'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Ticket, ArrowLeft, Shield, AlertTriangle, User, Star, Calendar, MapPin, Send } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function ListingDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const supabase = createClient()

  const [listing, setListing] = useState<any>(null)
  const [event, setEvent] = useState<any>(null)
  const [seller, setSeller] = useState<any>(null)
  const [user, setUser] = useState<any>(null)
  const [offerAmount, setOfferAmount] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [existingOffers, setExistingOffers] = useState<any[]>([])

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    const { data: { user: currentUser } } = await supabase.auth.getUser()
    setUser(currentUser)

    const { data: listingData } = await supabase
      .from('listings')
      .select('*, seller:profiles(id, full_name, trust_score, total_sales)')
      .eq('id', params.id)
      .single()

    if (!listingData) {
      router.push('/events')
      return
    }

    setListing(listingData)
    setSeller(listingData.seller)

    const { data: eventData } = await supabase
      .from('events')
      .select('*')
      .eq('id', listingData.event_id)
      .single()

    setEvent(eventData)

    // Load existing offers from this user
    if (currentUser) {
      const { data: offers } = await supabase
        .from('offers')
        .select('*')
        .eq('listing_id', params.id)
        .eq('buyer_id', currentUser.id)
        .order('created_at', { ascending: false })

      setExistingOffers(offers || [])
    }

    setLoading(false)
  }

  const handleOffer = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!user) {
      router.push('/auth/login')
      return
    }

    if (user.id === listing.seller_id) {
      setError('Kendi ilanınıza teklif veremezsiniz.')
      return
    }

    const amount = parseFloat(offerAmount)
    if (listing.min_price && amount < parseFloat(listing.min_price)) {
      setError(`Minimum teklif tutarı ₺${Number(listing.min_price).toLocaleString('tr-TR')}`)
      return
    }

    setSubmitting(true)

    const { error: insertError } = await supabase
      .from('offers')
      .insert({
        listing_id: params.id,
        buyer_id: user.id,
        amount,
      })

    if (insertError) {
      setError(insertError.message)
      setSubmitting(false)
      return
    }

    setSuccess('Teklifin gönderildi! Satıcı yanıt verdiğinde bildirim alacaksın.')
    setOfferAmount('')
    setSubmitting(false)
    loadData()
  }

  const handleBuyNow = () => {
    if (!user) {
      router.push('/auth/login')
      return
    }
    router.push(`/checkout/${params.id}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-sm text-zinc-400">Yükleniyor...</p>
      </div>
    )
  }

  if (!listing || !event) return null

  const isTransfer = listing.listing_type === 'transfer'
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

      <div className="max-w-[680px] mx-auto px-6 py-12">
        <Link href={`/events/${event.id}`} className="inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-900 transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" />
          {event.title}
        </Link>

        {/* Event Info */}
        <div className="mb-8">
          <h1 className="font-display text-2xl font-bold tracking-tight mb-2">{event.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-500">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              {date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              {event.venue}, {event.city}
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-[1fr_280px] gap-8">
          {/* Listing Details */}
          <div>
            {/* Delivery type badge */}
            {isTransfer ? (
              <div className="flex items-center gap-2 mb-6">
                <Shield className="w-4 h-4 text-emerald-600" />
                <span className="text-sm font-medium text-emerald-700">Transfer ile teslim</span>
              </div>
            ) : (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  <span className="text-sm font-medium text-amber-700">PDF/QR ile teslim</span>
                </div>
                <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl">
                  <p className="text-xs text-amber-700">
                    Bu ilan transfer değil, PDF/QR dosya paylaşımı ile teslim edilecektir. Risk daha yüksektir.
                  </p>
                </div>
              </div>
            )}

            {/* Seller info */}
            <div className="flex items-center gap-3 p-4 rounded-xl bg-zinc-50 border border-zinc-100 mb-6">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-zinc-200">
                <User className="w-4 h-4 text-zinc-400" />
              </div>
              <div>
                <p className="text-sm font-medium">{seller?.full_name || 'Anonim'}</p>
                <div className="flex items-center gap-2 text-xs text-zinc-400">
                  <span>Trust Score: {seller?.trust_score || 0}</span>
                  <span>·</span>
                  <span>{seller?.total_sales || 0} satış</span>
                </div>
              </div>
              {seller?.trust_score >= 90 && (
                <span className="ml-auto flex items-center gap-0.5 text-[10px] font-medium text-emerald-700 bg-emerald-50 px-2 py-1 rounded-full">
                  <Star className="w-3 h-3" />
                  Güvenilir
                </span>
              )}
            </div>

            {/* Listing info */}
            <div className="space-y-3 mb-8">
              <div className="flex justify-between py-2 border-b border-zinc-50">
                <span className="text-sm text-zinc-400">Adet</span>
                <span className="text-sm font-medium">{listing.quantity} bilet</span>
              </div>
              {listing.section_info && (
                <div className="flex justify-between py-2 border-b border-zinc-50">
                  <span className="text-sm text-zinc-400">Bölüm</span>
                  <span className="text-sm font-medium">{listing.section_info}</span>
                </div>
              )}
              <div className="flex justify-between py-2 border-b border-zinc-50">
                <span className="text-sm text-zinc-400">Teslim</span>
                <span className="text-sm font-medium">{isTransfer ? 'Transfer' : 'PDF/QR'}</span>
              </div>
            </div>

            {/* Existing offers */}
            {existingOffers.length > 0 && (
              <div className="mb-8">
                <h3 className="text-sm font-semibold mb-3">Tekliflerin</h3>
                <div className="space-y-2">
                  {existingOffers.map((offer) => (
                    <div key={offer.id} className="flex items-center justify-between p-3 rounded-lg bg-zinc-50 border border-zinc-100">
                      <div>
                        <p className="text-sm font-medium">₺{Number(offer.amount).toLocaleString('tr-TR')}</p>
                        <p className="text-[11px] text-zinc-400">
                          {new Date(offer.created_at).toLocaleDateString('tr-TR')}
                        </p>
                      </div>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        offer.status === 'pending' ? 'bg-amber-50 text-amber-700' :
                        offer.status === 'accepted' ? 'bg-emerald-50 text-emerald-700' :
                        offer.status === 'rejected' ? 'bg-red-50 text-red-600' :
                        offer.status === 'countered' ? 'bg-blue-50 text-blue-700' :
                        'bg-zinc-100 text-zinc-500'
                      }`}>
                        {offer.status === 'pending' ? 'Bekliyor' :
                         offer.status === 'accepted' ? 'Kabul Edildi' :
                         offer.status === 'rejected' ? 'Reddedildi' :
                         offer.status === 'countered' ? `Karşı: ₺${Number(offer.counter_amount).toLocaleString('tr-TR')}` :
                         'Süresi Doldu'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Offer form */}
            <div>
              <h3 className="text-sm font-semibold mb-3">Teklif Ver</h3>
              <form onSubmit={handleOffer} className="flex gap-3">
                <div className="relative flex-1">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-zinc-300">₺</span>
                  <input
                    type="number"
                    value={offerAmount}
                    onChange={(e) => setOfferAmount(e.target.value)}
                    placeholder="Teklif tutarı"
                    min="1"
                    step="0.01"
                    required
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-8 pr-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-300 outline-none focus:border-zinc-400 focus:bg-white transition-all"
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-zinc-900 hover:bg-black text-white text-sm font-medium rounded-xl px-5 py-3 transition-all disabled:opacity-50 active:scale-[0.98] flex items-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  Gönder
                </button>
              </form>
              {listing.min_price && (
                <p className="text-[11px] text-zinc-400 mt-1.5">
                  Minimum: ₺{Number(listing.min_price).toLocaleString('tr-TR')}
                </p>
              )}
              {error && <p className="text-xs text-red-500 bg-red-50 rounded-lg px-3 py-2 mt-2">{error}</p>}
              {success && <p className="text-xs text-emerald-600 bg-emerald-50 rounded-lg px-3 py-2 mt-2">{success}</p>}
            </div>
          </div>

          {/* Price Card (sticky) */}
          <div className="h-fit sticky top-16">
            <div className="bg-zinc-50 rounded-2xl p-6 border border-zinc-100">
              <p className="text-xs text-zinc-400 uppercase tracking-wider font-medium mb-1">Satış Fiyatı</p>
              <p className="font-display text-3xl font-bold tracking-tight mb-4">
                ₺{Number(listing.asking_price).toLocaleString('tr-TR')}
              </p>

              {/* Commission info */}
              <div className="p-3 bg-white rounded-xl border border-zinc-100 mb-4">
                <p className="text-[11px] text-zinc-500">
                  {parseFloat(listing.asking_price) >= 500
                    ? 'Komisyon satıcıdan kesilir. Alıcıya ek ücret yok.'
                    : 'Küçük bir hizmet bedeli alıcıdan alınır.'}
                </p>
              </div>

              <button
                onClick={handleBuyNow}
                className="w-full bg-zinc-900 hover:bg-black text-white text-sm font-medium rounded-xl px-4 py-3 transition-all active:scale-[0.98] mb-3"
              >
                Hemen Al — ₺{Number(listing.asking_price).toLocaleString('tr-TR')}
              </button>
              <p className="text-[10px] text-zinc-400 text-center">
                Emanet ödeme ile korunur
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
