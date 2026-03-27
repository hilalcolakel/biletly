'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Ticket, ArrowLeft, Shield, AlertTriangle, Check, Clock, XCircle, Upload, Package, Star } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  pending_payment: { label: 'Ödeme Bekleniyor', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20', icon: Clock },
  paid_escrow: { label: 'Ödendi (Emanet)', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20', icon: Shield },
  delivered: { label: 'Teslim Edildi', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20', icon: Package },
  completed: { label: 'Tamamlandı', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', icon: Check },
  refunded: { label: 'İade Edildi', color: 'bg-red-500/10 text-red-400 border-red-500/20', icon: XCircle },
  disputed: { label: 'İncelemede', color: 'bg-orange-500/10 text-orange-400 border-orange-500/20', icon: AlertTriangle },
}

function OrdersContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()
  const successOrderId = searchParams.get('success')
  const [buyOrders, setBuyOrders] = useState<any[]>([])
  const [sellOrders, setSellOrders] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState<'buying' | 'selling'>('buying')
  const [loading, setLoading] = useState(true)
  const [ratingOrderId, setRatingOrderId] = useState<string | null>(null)
  const [ratingValue, setRatingValue] = useState(0)

  useEffect(() => { loadData() }, [])

  const loadData = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/auth/login'); return }
    const { data: buying } = await supabase.from('orders').select('*, listing:listings(*, event:events(*)), seller:profiles!orders_seller_id_fkey(full_name, trust_score)').eq('buyer_id', user.id).order('created_at', { ascending: false })
    setBuyOrders(buying || [])
    const { data: selling } = await supabase.from('orders').select('*, listing:listings(*, event:events(*)), buyer:profiles!orders_buyer_id_fkey(full_name)').eq('seller_id', user.id).order('created_at', { ascending: false })
    setSellOrders(selling || [])
    setLoading(false)
  }

  const handleConfirmDelivery = async (orderId: string) => {
    setRatingOrderId(orderId)
  }

  const handleSubmitRating = async () => {
    if (!ratingOrderId || ratingValue === 0) return
    const order = buyOrders.find(o => o.id === ratingOrderId)
    if (!order) return
    // Update order as completed
    await supabase.from('orders').update({ status: 'completed', confirmed_at: new Date().toISOString() }).eq('id', ratingOrderId)
    // Get seller's current scores
    const { data: seller } = await supabase.from('profiles').select('trust_score, total_sales').eq('id', order.seller_id).single()
    if (seller) {
      const currentTotal = seller.total_sales || 0
      const currentScore = seller.trust_score || 0
      // Calculate new average: (old_avg * old_count + new_rating) / (old_count + 1)
      const newScore = parseFloat((((currentScore * currentTotal) + ratingValue) / (currentTotal + 1)).toFixed(1))
      await supabase.from('profiles').update({ trust_score: newScore, total_sales: currentTotal + 1 }).eq('id', order.seller_id)
    }
    setRatingOrderId(null)
    setRatingValue(0)
    loadData()
  }

  const handleMarkDelivered = async (orderId: string) => {
    await supabase.from('orders').update({ status: 'delivered', delivered_at: new Date().toISOString() }).eq('id', orderId)
    loadData()
  }

  if (loading) return <div className="min-h-screen bg-zinc-950 flex items-center justify-center"><p className="text-sm text-zinc-500">Yükleniyor...</p></div>

  const orders = activeTab === 'buying' ? buyOrders : sellOrders

  return (
    <div className="min-h-screen bg-zinc-950">
      <nav className="sticky top-0 z-50 glass-dark"><div className="max-w-[980px] mx-auto px-6 h-12 flex items-center"><Link href="/" className="flex items-center gap-2"><div className="w-7 h-7 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center"><Ticket className="w-3.5 h-3.5 text-white" strokeWidth={2.5} /></div><span className="font-display text-[15px] font-bold tracking-tight text-white">biletly</span></Link></div></nav>

      <div className="max-w-[680px] mx-auto px-6 py-12">
        <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-white transition-colors mb-8"><ArrowLeft className="w-4 h-4" />Dashboard</Link>
        <h1 className="font-display text-[28px] font-bold tracking-tight text-white mb-1">Biletlerim</h1>
        <p className="text-sm text-zinc-500 mb-8">Aldığın ve sattığın biletleri takip et.</p>

        {successOrderId && (
          <div className="flex items-start gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 mb-6">
            <Check className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
            <div><p className="text-sm font-medium text-emerald-300">Ödeme başarılı!</p><p className="text-xs text-emerald-400/70 mt-0.5">Ödemen emanete alındı.</p></div>
          </div>
        )}

        <div className="flex gap-1 p-1 bg-zinc-900 border border-zinc-800 rounded-xl mb-8">
          <button onClick={() => setActiveTab('buying')} className={`flex-1 text-sm font-medium py-2.5 rounded-lg transition-all ${activeTab === 'buying' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}>Aldıklarım ({buyOrders.length})</button>
          <button onClick={() => setActiveTab('selling')} className={`flex-1 text-sm font-medium py-2.5 rounded-lg transition-all ${activeTab === 'selling' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}>Sattıklarım ({sellOrders.length})</button>
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
                <div key={order.id} className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-display font-semibold text-sm text-white">{event?.title || 'Etkinlik'}</h3>
                      {date && <p className="text-xs text-zinc-500 mt-0.5">{date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })} · {event?.venue}</p>}
                    </div>
                    <span className={`flex items-center gap-1 text-[11px] font-medium px-2 py-1 rounded-full border ${status.color}`}><StatusIcon className="w-3 h-3" />{status.label}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-zinc-500 mb-3">
                    <span>{order.listing?.quantity} bilet · PDF/QR</span>
                    <span className="font-display font-bold text-base text-white">₺{Number(order.amount).toLocaleString('tr-TR')}</span>
                  </div>
                  <div className="text-xs text-zinc-600 mb-3">{isBuyer ? `Satıcı: ${order.seller?.full_name || 'Anonim'}` : `Alıcı: ${order.buyer?.full_name || 'Anonim'}`}</div>

                  {isBuyer && order.status === 'delivered' && ratingOrderId !== order.id && (
                    <button onClick={() => handleConfirmDelivery(order.id)} className="w-full bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-medium rounded-lg px-4 py-2.5 transition-all active:scale-[0.98] flex items-center justify-center gap-1.5"><Check className="w-3.5 h-3.5" />Teslim Aldım — Onayla & Puanla</button>
                  )}
                  {isBuyer && ratingOrderId === order.id && (
                    <div className="space-y-3 p-3 bg-violet-500/5 border border-violet-500/10 rounded-xl">
                      <p className="text-xs font-medium text-white">Satıcıyı puanla</p>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map(star => (
                          <button key={star} onClick={() => setRatingValue(star)} className="p-1 transition-all hover:scale-110">
                            <Star className={`w-6 h-6 ${star <= ratingValue ? 'text-amber-400 fill-amber-400' : 'text-zinc-700'}`} />
                          </button>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => { setRatingOrderId(null); setRatingValue(0) }} className="flex-1 text-xs text-zinc-500 hover:text-white py-2 rounded-lg transition-colors">İptal</button>
                        <button onClick={handleSubmitRating} disabled={ratingValue === 0} className="flex-1 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white text-xs font-medium rounded-lg px-4 py-2 transition-all">Onayla</button>
                      </div>
                    </div>
                  )}
                  {!isBuyer && order.status === 'paid_escrow' && (
                    <button onClick={() => handleMarkDelivered(order.id)} className="w-full bg-gradient-to-r from-violet-500 to-purple-600 text-white text-xs font-medium rounded-lg px-4 py-2.5 transition-all active:scale-[0.98] flex items-center justify-center gap-1.5"><Upload className="w-3.5 h-3.5" />Teslim Ettim</button>
                  )}
                  {isBuyer && order.status === 'paid_escrow' && (
                    <div className="flex items-center gap-2 p-2.5 bg-blue-500/5 border border-blue-500/10 rounded-lg"><Clock className="w-3.5 h-3.5 text-blue-400" /><p className="text-[11px] text-blue-400/80">Satıcının teslim etmesi bekleniyor.</p></div>
                  )}
                  <p className="text-[10px] text-zinc-700 mt-3">{new Date(order.created_at).toLocaleString('tr-TR')}</p>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-14 h-14 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-4"><Ticket className="w-6 h-6 text-zinc-700" /></div>
            <h3 className="font-display text-lg font-semibold text-white mb-1">{activeTab === 'buying' ? 'Henüz bilet almadın' : 'Henüz bilet satmadın'}</h3>
            <p className="text-sm text-zinc-500 mb-6">{activeTab === 'buying' ? 'Etkinlikleri keşfet ve ilk biletini al.' : 'İlan oluştur ve biletini satışa çıkar.'}</p>
            <Link href={activeTab === 'buying' ? '/events' : '/listings/new'} className="text-sm font-medium text-white bg-gradient-to-r from-violet-500 to-purple-600 px-5 py-2.5 rounded-full">{activeTab === 'buying' ? 'Etkinlikleri Keşfet' : 'İlan Oluştur'}</Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default function OrdersPage() {
  return <Suspense fallback={<div className="min-h-screen bg-zinc-950 flex items-center justify-center"><p className="text-sm text-zinc-500">Yükleniyor...</p></div>}><OrdersContent /></Suspense>
}
