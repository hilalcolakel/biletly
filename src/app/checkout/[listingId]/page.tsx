'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Ticket, ArrowLeft, Shield, AlertTriangle, Check, Lock, Calendar, MapPin } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const PLATFORM_FEE_PERCENT = 5 // 5% fee

export default function CheckoutPage({ params }: { params: { listingId: string } }) {
  const router = useRouter()
  const supabase = createClient()

  const [listing, setListing] = useState<any>(null)
  const [event, setEvent] = useState<any>(null)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState('')
  const [riskAccepted, setRiskAccepted] = useState(false)

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

    const { data: listingData } = await supabase
      .from('listings')
      .select('*, seller:profiles(id, full_name, trust_score)')
      .eq('id', params.listingId)
      .single()

    if (!listingData || listingData.status !== 'active') {
      router.push('/events')
      return
    }

    setListing(listingData)

    const { data: eventData } = await supabase
      .from('events')
      .select('*')
      .eq('id', listingData.event_id)
      .single()

    setEvent(eventData)
    setLoading(false)
  }

  const amount = listing ? parseFloat(listing.asking_price) : 0
  const isBuyerFee = amount < 500
  const platformFee = amount * (PLATFORM_FEE_PERCENT / 100)
  const totalForBuyer = isBuyerFee ? amount + platformFee : amount
  const isPdfQr = listing?.listing_type === 'pdf_qr'

  // SLA calculation
  const getSlaDuration = () => {
    if (!event) return '24 saat'
    const hoursUntil = (new Date(event.event_date).getTime() - Date.now()) / (1000 * 60 * 60)
    return hoursUntil <= 72 ? '3 saat' : '24 saat'
  }

  const handleCheckout = async () => {
    setError('')

    if (isPdfQr && !riskAccepted) {
      setError('PDF/QR risk uyarısını kabul etmeniz gerekiyor.')
      return
    }

    if (user.id === listing.seller_id) {
      setError('Kendi ilanınızı satın alamazsınız.')
      return
    }

    setProcessing(true)

    // Create order with escrow status
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        listing_id: listing.id,
        offer_id: listing.id, // Direct buy, using listing id as placeholder
        buyer_id: user.id,
        seller_id: listing.seller_id,
        amount,
        platform_fee: platformFee,
        fee_paid_by: isBuyerFee ? 'buyer' : 'seller',
        status: 'paid_escrow',
        delivery_type: listing.listing_type,
        sla_deadline: new Date(Date.now() + (getSlaDuration() === '3 saat' ? 3 : 24) * 60 * 60 * 1000).toISOString(),
      })
      .select()
      .single()

    if (orderError) {
      setError(orderError.message)
      setProcessing(false)
      return
    }

    // Update listing status
    await supabase
      .from('listings')
      .update({ status: 'reserved' })
      .eq('id', listing.id)

    // Update buyer purchase count
    await supabase.rpc('increment_purchases', { user_id: user.id }).catch(() => {})

    router.push(`/orders?success=${order.id}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-sm text-zinc-400">Yükleniyor...</p>
      </div>
    )
  }

  if (!listing || !event) return null

  const date = new Date(event.event_date)

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-zinc-100">
        <div className="max-w-[980px] mx-auto px-6 h-12 flex items-center">
          <Link href="/" className="flex items-center gap-1.5">
            <Ticket className="w-[18px] h-[18px] text-zinc-900" strokeWidth={2.2} />
            <span className="font-display text-[15px] font-semibold tracking-tight">biletly</span>
          </Link>
        </div>
      </nav>

      <div className="max-w-[580px] mx-auto px-6 py-12">
        <Link href={`/listings/${listing.id}`} className="inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-900 transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" />
          İlana Dön
        </Link>

        <h1 className="font-display text-[28px] font-bold tracking-tight mb-1">
          Ödeme
        </h1>
        <p className="text-sm text-zinc-400 mb-8">
          Siparişini kontrol et ve onayla.
        </p>

        {/* Event summary */}
        <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-100 mb-6">
          <h3 className="font-display font-semibold text-base mb-2">{event.title}</h3>
          <div className="flex flex-wrap gap-3 text-xs text-zinc-500">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {event.venue}, {event.city}
            </span>
          </div>
        </div>

        {/* Order details */}
        <div className="space-y-3 mb-6">
          <div className="flex justify-between py-2.5 border-b border-zinc-100">
            <span className="text-sm text-zinc-500">Bilet</span>
            <span className="text-sm font-medium">{listing.quantity}x {listing.section_info || 'Standart'}</span>
          </div>
          <div className="flex justify-between py-2.5 border-b border-zinc-100">
            <span className="text-sm text-zinc-500">Teslim yöntemi</span>
            <span className="text-sm font-medium flex items-center gap-1.5">
              {isPdfQr ? (
                <><AlertTriangle className="w-3 h-3 text-amber-500" /> PDF/QR</>
              ) : (
                <><Shield className="w-3 h-3 text-emerald-600" /> Transfer</>
              )}
            </span>
          </div>
          <div className="flex justify-between py-2.5 border-b border-zinc-100">
            <span className="text-sm text-zinc-500">Teslim SLA</span>
            <span className="text-sm font-medium">{getSlaDuration()}</span>
          </div>
          <div className="flex justify-between py-2.5 border-b border-zinc-100">
            <span className="text-sm text-zinc-500">Bilet fiyatı</span>
            <span className="text-sm font-medium">₺{amount.toLocaleString('tr-TR')}</span>
          </div>
          {isBuyerFee && (
            <div className="flex justify-between py-2.5 border-b border-zinc-100">
              <span className="text-sm text-zinc-500">Hizmet bedeli (%{PLATFORM_FEE_PERCENT})</span>
              <span className="text-sm font-medium">₺{platformFee.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</span>
            </div>
          )}
          <div className="flex justify-between py-3">
            <span className="text-sm font-semibold">Toplam</span>
            <span className="font-display text-xl font-bold">₺{totalForBuyer.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</span>
          </div>
        </div>

        {/* Escrow info */}
        <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-50 border border-blue-100 mb-6">
          <Lock className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-medium text-blue-900">Emanet Ödeme Koruması</p>
            <p className="text-xs text-blue-700 mt-0.5">
              Ödemen emanete alınır. Bilet sana teslim edilip onaylayana kadar satıcıya aktarılmaz.
              Teslim olmazsa {getSlaDuration()} sonra otomatik iade yapılır.
            </p>
          </div>
        </div>

        {/* PDF/QR risk checkbox */}
        {isPdfQr && (
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-100 mb-6">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={riskAccepted}
                onChange={(e) => setRiskAccepted(e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-amber-300 text-amber-600 focus:ring-amber-500"
              />
              <div>
                <p className="text-sm font-medium text-amber-900">PDF/QR Risk Uyarısı</p>
                <p className="text-xs text-amber-700 mt-0.5">
                  Bu bilet transfer yerine PDF/QR dosya olarak teslim edilecektir.
                  Transfer yöntemine göre risk daha yüksektir. Anladım ve kabul ediyorum.
                </p>
              </div>
            </label>
          </div>
        )}

        {error && (
          <p className="text-xs text-red-500 bg-red-50 rounded-lg px-3 py-2 mb-4">{error}</p>
        )}

        {/* Pay button */}
        <button
          onClick={handleCheckout}
          disabled={processing || (isPdfQr && !riskAccepted)}
          className="w-full bg-zinc-900 hover:bg-black text-white text-sm font-medium rounded-xl px-4 py-3.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] flex items-center justify-center gap-2"
        >
          {processing ? (
            'İşleniyor...'
          ) : (
            <>
              <Lock className="w-3.5 h-3.5" />
              Güvenli Ödeme — ₺{totalForBuyer.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
            </>
          )}
        </button>

        <p className="text-[10px] text-zinc-400 text-center mt-3">
          Ödeme yaparak Kullanım Koşulları&apos;nı kabul etmiş olursun.
        </p>
      </div>
    </div>
  )
}
