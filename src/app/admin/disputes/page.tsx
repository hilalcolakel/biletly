'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Ticket, ArrowLeft, AlertTriangle, Check, XCircle, Clock, MessageSquare } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const statusLabels: Record<string, { label: string; color: string }> = {
  open: { label: 'Açık', color: 'bg-red-50 text-red-600' },
  under_review: { label: 'İnceleniyor', color: 'bg-amber-50 text-amber-700' },
  resolved_refund: { label: 'İade Edildi', color: 'bg-blue-50 text-blue-700' },
  resolved_payout: { label: 'Satıcıya Ödendi', color: 'bg-emerald-50 text-emerald-700' },
  closed: { label: 'Kapatıldı', color: 'bg-zinc-100 text-zinc-500' },
}

export default function AdminDisputesPage() {
  const router = useRouter()
  const supabase = createClient()

  const [disputes, setDisputes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/auth/login'); return }

    const { data } = await supabase
      .from('disputes')
      .select(`
        *,
        order:orders(*, listing:listings(*, event:events(title)), buyer:profiles!orders_buyer_id_fkey(full_name, email), seller:profiles!orders_seller_id_fkey(full_name, email)),
        opener:profiles!disputes_opened_by_fkey(full_name, email)
      `)
      .order('created_at', { ascending: false })

    setDisputes(data || [])
    setLoading(false)
  }

  const handleResolve = async (disputeId: string, orderId: string, resolution: 'refund' | 'payout', note: string) => {
    const { data: { user } } = await supabase.auth.getUser()

    await supabase
      .from('disputes')
      .update({
        status: resolution === 'refund' ? 'resolved_refund' : 'resolved_payout',
        resolution_note: note || (resolution === 'refund' ? 'İade kararı verildi.' : 'Satıcıya ödeme kararı verildi.'),
        resolved_by: user?.id,
      })
      .eq('id', disputeId)

    await supabase
      .from('orders')
      .update({ status: resolution === 'refund' ? 'refunded' : 'completed' })
      .eq('id', orderId)

    loadData()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-sm text-zinc-400">Yükleniyor...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-zinc-100">
        <div className="max-w-[980px] mx-auto px-6 h-12 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-1.5">
            <Ticket className="w-[18px] h-[18px] text-zinc-900" strokeWidth={2.2} />
            <span className="font-display text-[15px] font-semibold tracking-tight">biletly</span>
          </Link>
          <span className="text-[11px] font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded-full">Admin</span>
        </div>
      </nav>

      <div className="max-w-[980px] mx-auto px-6 py-12">
        <Link href="/admin" className="inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-900 transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" />
          Admin Panel
        </Link>

        <h1 className="font-display text-[28px] font-bold tracking-tight mb-1">Dispute Yönetimi</h1>
        <p className="text-sm text-zinc-400 mb-8">
          {disputes.filter(d => d.status === 'open' || d.status === 'under_review').length} açık şikayet
        </p>

        {disputes.length > 0 ? (
          <div className="space-y-4">
            {disputes.map((dispute) => {
              const status = statusLabels[dispute.status] || statusLabels.open
              const order = dispute.order
              const isOpen = dispute.status === 'open' || dispute.status === 'under_review'

              return (
                <div key={dispute.id} className={`p-5 rounded-xl border ${isOpen ? 'border-red-200 bg-red-50/20' : 'border-zinc-100'}`}>
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <AlertTriangle className={`w-4 h-4 ${isOpen ? 'text-red-500' : 'text-zinc-400'}`} />
                        <h3 className="text-sm font-semibold">
                          {order?.listing?.event?.title || 'Sipariş'}
                        </h3>
                      </div>
                      <p className="text-xs text-zinc-400">
                        Açan: {dispute.opener?.full_name || dispute.opener?.email} · {new Date(dispute.created_at).toLocaleString('tr-TR')}
                      </p>
                    </div>
                    <span className={`text-[11px] font-medium px-2 py-1 rounded-full ${status.color}`}>
                      {status.label}
                    </span>
                  </div>

                  {/* Reason */}
                  <div className="p-3 bg-white rounded-lg border border-zinc-100 mb-3">
                    <p className="text-sm text-zinc-700">{dispute.reason}</p>
                  </div>

                  {/* Order info */}
                  {order && (
                    <div className="flex items-center gap-4 text-xs text-zinc-400 mb-3">
                      <span>Tutar: ₺{Number(order.amount).toLocaleString('tr-TR')}</span>
                      <span>Alıcı: {order.buyer?.full_name || order.buyer?.email}</span>
                      <span>Satıcı: {order.seller?.full_name || order.seller?.email}</span>
                      <span>Teslim: {order.delivery_type}</span>
                    </div>
                  )}

                  {/* Resolution note */}
                  {dispute.resolution_note && (
                    <div className="p-3 bg-zinc-50 rounded-lg mb-3">
                      <p className="text-xs text-zinc-500">
                        <span className="font-medium">Karar:</span> {dispute.resolution_note}
                      </p>
                    </div>
                  )}

                  {/* Actions for open disputes */}
                  {isOpen && (
                    <div className="flex items-center gap-2 pt-3 border-t border-zinc-100">
                      <button
                        onClick={() => handleResolve(dispute.id, order?.id, 'refund', '')}
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-lg transition-all"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        İade Et
                      </button>
                      <button
                        onClick={() => handleResolve(dispute.id, order?.id, 'payout', '')}
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 hover:bg-emerald-100 px-3 py-2 rounded-lg transition-all"
                      >
                        <Check className="w-3.5 h-3.5" />
                        Satıcıya Öde
                      </button>
                      {dispute.status === 'open' && (
                        <button
                          onClick={async () => {
                            await supabase.from('disputes').update({ status: 'under_review' }).eq('id', dispute.id)
                            loadData()
                          }}
                          className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-600 bg-amber-50 hover:bg-amber-100 px-3 py-2 rounded-lg transition-all"
                        >
                          <Clock className="w-3.5 h-3.5" />
                          İncelemeye Al
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-14 h-14 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-6 h-6 text-zinc-300" />
            </div>
            <h3 className="font-display text-lg font-semibold mb-1">Açık dispute yok</h3>
            <p className="text-sm text-zinc-400">Tüm şikayetler çözülmüş durumda.</p>
          </div>
        )}
      </div>
    </div>
  )
}
