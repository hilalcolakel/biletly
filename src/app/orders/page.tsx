'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Ticket, ArrowLeft, Shield, AlertTriangle, Check, Clock, XCircle, Upload, Package } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  pending_payment: { label: 'Ödeme Bekleniyor', color: 'bg-amber-50 text-amber-700', icon: Clock },
  paid_escrow: { label: 'Ödendi (Emanet)', color: 'bg-blue-50 text-blue-700', icon: Shield },
  delivered: { label: 'Teslim Edildi', color: 'bg-purple-50 text-purple-700', icon: Package },
  completed: { label: 'Tamamlandı', color: 'bg-emerald-50 text-emerald-700', icon: Check },
  refunded: { label: 'İade Edildi', color: 'bg-red-50 text-red-600', icon: XCircle },
  disputed: { label: 'İncelemede', color: 'bg-orange-50 text-orange-700', icon: AlertTriangle },
}

function OrdersContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()
  const successOrderId = searchParams.get('success')

  const [user, setUser] = useState<any>(null)
  const [buyOrders, setBuyOrders] = useState<any[]>([])
  const [sellOrders, setSellOrders] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState<'buying' | 'selling'>('buying')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    const { data: { user: currentUser } } = await supabase.auth.getUser()
    if (!currentUser) {
      router.push('/auth/login')
      return
    }
    setUser(currentUser)

    const { data: buying } = await supabase
      .from('orders')
      .select(`
        *,
        listing:listings(*, event:events(*)),
        seller:profiles!orders_seller_id_fkey(full_name, trust_score)
      `)
      .eq('buyer_id', currentUser.id)
      .order('created_at', { ascending: false })

    setBuyOrders(buying || [])

    const { data: selling } = await supabase
      .from('orders')
      .select(`
        *,
        listing:listings(*, event:events(*)),
        buyer:profiles!orders_buyer_id_fkey(full_name)
      `)
      .eq('seller_id', currentUser.id)
      .order('created_at', { ascending: false })

    setSellOrders(selling || [])
    setLoading(false)
  }

  const handleConfirmDelivery = async (orderId: string) => {
    const { error } = await supabase
      .from('orders')
      .update({ status: 'completed', confirmed_at: new Date().toISOString() })
      .eq('id', orderId)
    if (!error) loadData()
  }

  const handleMarkDelivered = async (orderId: string) => {
    const { error } = await supabase
      .from('orders')
      .update({ status: 'delivered', delivered_at: new Date().toISOString() })
      .eq('id', orderId)
    if (!error) loadData()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-sm text-zinc-400">Yükleniyor...</p>
      </div>
    )
  }

  const orders = activeTab === 'buying' ? buyOrders : sellOrders

  return (
    <div className="min-h-screen bg-white">
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-zinc-100">
        <div className="max-w-[980px] mx-auto px-6 h-12 flex items-center">
          <Link href="/" className="flex items-center gap-1.5">
            <Ticket className="w-[18px] h-[18px] text-zinc-900" strokeWidth={2.2} />
            <span className="font-display text-[15px] font-semibold tracking-tight">biletly</span>
          </Link>
        </div>
      </nav>

      <div className="max-w-[680px] mx-auto px-6 py-12">
        <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-900 transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" />
          Dashboard
        </Link>

        <h1 className="font-display text-[28px] font-bold tracking-tight mb-1">Biletlerim</h1>
        <p className="text-sm text-zinc-400 mb-8">Aldığın ve sattığın biletleri takip et.</p>

        {successOrderId && (
          <div className="flex items-start gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-100 mb-6">
            <Check className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-emerald-900">Ödeme başarılı!</p>
              <p className="text-xs text-emerald-700 mt-0.5">Ödemen emanete alındı. Satıcı bileti teslim ettiğinde bildirim alacaksın.</p>
            </div>
          </div>
        )}

        <div className="flex gap-1 p-1 bg-zinc-100 rounded-xl mb-8">
          <button
            onClick={() => setActiveTab('buying')}
            className={`flex-1 text-sm font-medium py-2 rounded-lg transition-all ${activeTab === 'buying' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'}`}
          >
            Aldıklarım ({buyOrders.length})
          </button>
          <button
            onClick={() => setActiveTab('selling')}
            className={`flex-1 text-sm font-medium py-2 rounded-lg transition-all ${activeTab === 'selling' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'}`}
          >
            Sattıklarım ({sellOrders.length})
          </button>
        </div>

        {orders.length > 0 ? (
          <div className="space-y-3">
            {orders.map((order) => {
              const event = order.listing?.event
              const status = statusConfig[order.status] || statusConfig.pending_payment
              const StatusIcon = status.icon
              const date = event ? new Date(event.event_date) : null
              const isBuyer = activeTab === 'buying'

              return (
                <div key={order.id} className="p-4 rounded-xl border border-zinc-100 hover:border-zinc-200 transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-display font-semibold text-sm">{event?.title || 'Etkinlik'}</h3>
                      {date && (
                        <p className="text-xs text-zinc-400 mt-0.5">
                          {date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })} · {event?.venue}
                        </p>
                      )}
                    </div>
                    <span className={`flex items-center gap-1 text-[11px] font-medium px-2 py-1 rounded-full ${status.color}`}>
                      <StatusIcon className="w-3 h-3" />
                      {status.label}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-zinc-400 mb-3">
                    <span>{order.listing?.quantity} bilet · {order.delivery_type === 'transfer' ? 'Transfer' : 'PDF/QR'}</span>
                    <span className="font-display font-bold text-base text-zinc-900">₺{Number(order.amount).toLocaleString('tr-TR')}</span>
                  </div>

                  <div className="text-xs text-zinc-400 mb-3">
                    {isBuyer ? `Satıcı: ${order.seller?.full_name || 'Anonim'}` : `Alıcı: ${order.buyer?.full_name || 'Anonim'}`}
                  </div>

                  {isBuyer && order.status === 'delivered' && (
                    <button
                      onClick={() => handleConfirmDelivery(order.id)}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded-lg px-4 py-2.5 transition-all active:scale-[0.98] flex items-center justify-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Teslim Aldım — Onayla
                    </button>
                  )}

                  {!isBuyer && order.status === 'paid_escrow' && (
                    <button
                      onClick={() => handleMarkDelivered(order.id)}
                      className="w-full bg-zinc-900 hover:bg-black text-white text-xs font-medium rounded-lg px-4 py-2.5 transition-all active:scale-[0.98] flex items-center justify-center gap-1.5"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      Teslim Ettim
                    </button>
                  )}

                  {isBuyer && order.status === 'paid_escrow' && (
                    <div className="flex items-center gap-2 p-2.5 bg-blue-50 rounded-lg">
                      <Clock className="w-3.5 h-3.5 text-blue-600" />
                      <p className="text-[11px] text-blue-700">
                        Satıcının teslim etmesi bekleniyor. SLA: {order.sla_deadline ? new Date(order.sla_deadline).toLocaleString('tr-TR') : '—'}
                      </p>
                    </div>
                  )}

                  <p className="text-[10px] text-zinc-300 mt-3">
                    Sipariş: {new Date(order.created_at).toLocaleString('tr-TR')}
                  </p>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-14 h-14 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Ticket className="w-6 h-6 text-zinc-300" />
            </div>
            <h3 className="font-display text-lg font-semibold mb-1">
              {activeTab === 'buying' ? 'Henüz bilet almadın' : 'Henüz bilet satmadın'}
            </h3>
            <p className="text-sm text-zinc-400 mb-6">
              {activeTab === 'buying' ? 'Etkinlikleri keşfet ve ilk biletini al.' : 'İlan oluştur ve biletini satışa çıkar.'}
            </p>
            <Link
              href={activeTab === 'buying' ? '/events' : '/listings/new'}
              className="inline-flex text-sm font-medium text-white bg-zinc-900 hover:bg-black px-5 py-2.5 rounded-full transition-all"
            >
              {activeTab === 'buying' ? 'Etkinlikleri Keşfet' : 'İlan Oluştur'}
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default function OrdersPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-sm text-zinc-400">Yükleniyor...</p>
      </div>
    }>
      <OrdersContent />
    </Suspense>
  )
}
