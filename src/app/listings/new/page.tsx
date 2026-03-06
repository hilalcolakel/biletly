'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Ticket, ArrowLeft, Shield, AlertTriangle, Lock } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function NewListingPage() {
  const router = useRouter()
  const supabase = createClient()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [events, setEvents] = useState<any[]>([])
  const [trustScore, setTrustScore] = useState(50)
  const [selectedEvent, setSelectedEvent] = useState<any>(null)

  const [form, setForm] = useState({
    event_id: '',
    quantity: '1',
    section_info: '',
    asking_price: '',
    min_price: '',
    listing_type: 'transfer',
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/auth/login')
      return
    }

    // Get user trust score
    const { data: profile } = await supabase
      .from('profiles')
      .select('trust_score')
      .eq('id', user.id)
      .single()

    if (profile) setTrustScore(profile.trust_score)

    // Get active events
    const { data: eventsData } = await supabase
      .from('events')
      .select('*')
      .eq('is_active', true)
      .gte('event_date', new Date().toISOString())
      .order('event_date', { ascending: true })

    if (eventsData) setEvents(eventsData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })

    if (name === 'event_id') {
      const event = events.find(ev => ev.id === value)
      setSelectedEvent(event)
    }
  }

  // PDF/QR eligibility
  const canUsePdfQr = trustScore >= 90
  const eventDate = selectedEvent ? new Date(selectedEvent.event_date) : null
  const hoursUntilEvent = eventDate ? (eventDate.getTime() - Date.now()) / (1000 * 60 * 60) : 999
  const pdfQrTimeOk = hoursUntilEvent >= 72

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/auth/login')
      return
    }

    // Validate PDF/QR rules
    if (form.listing_type === 'pdf_qr') {
      if (!canUsePdfQr) {
        setError('PDF/QR ilan açmak için Trust Score ≥ 90 gerekli.')
        setLoading(false)
        return
      }
      if (!pdfQrTimeOk) {
        setError('PDF/QR ilan sadece etkinliğe 72 saatten fazla varken açılabilir.')
        setLoading(false)
        return
      }
    }

    const { data, error: insertError } = await supabase
      .from('listings')
      .insert({
        event_id: form.event_id,
        seller_id: user.id,
        listing_type: form.listing_type,
        quantity: parseInt(form.quantity),
        section_info: form.section_info || null,
        asking_price: parseFloat(form.asking_price),
        min_price: form.min_price ? parseFloat(form.min_price) : null,
      })
      .select()
      .single()

    if (insertError) {
      setError(insertError.message)
      setLoading(false)
      return
    }

    router.push(`/events/${form.event_id}`)
  }

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

      <div className="max-w-[480px] mx-auto px-6 py-12">
        <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-900 transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" />
          Dashboard
        </Link>

        <h1 className="font-display text-[28px] font-bold tracking-tight mb-1">
          İlan Oluştur
        </h1>
        <p className="text-sm text-zinc-400 mb-8">
          Biletini satışa çıkar.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Event Selection */}
          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-1.5">Etkinlik</label>
            <select
              name="event_id"
              value={form.event_id}
              onChange={handleChange}
              required
              className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm text-zinc-900 outline-none focus:border-zinc-400 transition-all appearance-none"
            >
              <option value="">Etkinlik seç...</option>
              {events.map((event) => (
                <option key={event.id} value={event.id}>
                  {event.title} — {new Date(event.event_date).toLocaleDateString('tr-TR')}
                </option>
              ))}
            </select>
            <Link href="/events/new" className="inline-block text-xs text-zinc-400 hover:text-zinc-900 mt-1.5 transition-colors">
              Etkinlik listede yok mu? Yeni ekle →
            </Link>
          </div>

          {/* Delivery Type */}
          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-2">Teslim Tipi</label>
            <div className="grid grid-cols-2 gap-3">
              {/* Transfer */}
              <button
                type="button"
                onClick={() => setForm({ ...form, listing_type: 'transfer' })}
                className={`p-4 rounded-xl border text-left transition-all ${
                  form.listing_type === 'transfer'
                    ? 'border-zinc-900 bg-zinc-50'
                    : 'border-zinc-200 hover:border-zinc-300'
                }`}
              >
                <Shield className={`w-5 h-5 mb-2 ${form.listing_type === 'transfer' ? 'text-emerald-600' : 'text-zinc-300'}`} />
                <p className="text-sm font-semibold">Transfer</p>
                <p className="text-[11px] text-zinc-400 mt-0.5">Önerilen yöntem</p>
              </button>

              {/* PDF/QR */}
              <button
                type="button"
                onClick={() => {
                  if (canUsePdfQr && pdfQrTimeOk) {
                    setForm({ ...form, listing_type: 'pdf_qr' })
                  }
                }}
                disabled={!canUsePdfQr || !pdfQrTimeOk}
                className={`p-4 rounded-xl border text-left transition-all relative ${
                  form.listing_type === 'pdf_qr'
                    ? 'border-zinc-900 bg-zinc-50'
                    : !canUsePdfQr || !pdfQrTimeOk
                    ? 'border-zinc-100 bg-zinc-50/50 opacity-60 cursor-not-allowed'
                    : 'border-zinc-200 hover:border-zinc-300'
                }`}
              >
                {(!canUsePdfQr || !pdfQrTimeOk) && (
                  <Lock className="absolute top-3 right-3 w-3.5 h-3.5 text-zinc-300" />
                )}
                <AlertTriangle className={`w-5 h-5 mb-2 ${form.listing_type === 'pdf_qr' ? 'text-amber-500' : 'text-zinc-300'}`} />
                <p className="text-sm font-semibold">PDF/QR</p>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  {!canUsePdfQr
                    ? `Trust ≥ 90 gerekli (şu an: ${trustScore})`
                    : !pdfQrTimeOk
                    ? 'Etkinliğe 72+ saat olmalı'
                    : 'Dosya paylaşımı'}
                </p>
              </button>
            </div>
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-1.5">Bilet Adedi</label>
            <input
              type="number"
              name="quantity"
              value={form.quantity}
              onChange={handleChange}
              min="1"
              max="10"
              required
              className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm text-zinc-900 outline-none focus:border-zinc-400 focus:bg-white transition-all"
            />
          </div>

          {/* Section Info */}
          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-1.5">
              Tribün / Koltuk Bilgisi <span className="text-zinc-300">(opsiyonel)</span>
            </label>
            <input
              type="text"
              name="section_info"
              value={form.section_info}
              onChange={handleChange}
              placeholder="Örn: Tribün A, Sıra 5, Koltuk 12"
              className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-300 outline-none focus:border-zinc-400 focus:bg-white transition-all"
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-1.5">Satış Fiyatı (₺)</label>
            <input
              type="number"
              name="asking_price"
              value={form.asking_price}
              onChange={handleChange}
              min="1"
              step="0.01"
              placeholder="0.00"
              required
              className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-300 outline-none focus:border-zinc-400 focus:bg-white transition-all"
            />
          </div>

          {/* Min Price */}
          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-1.5">
              Minimum Kabul Fiyatı (₺) <span className="text-zinc-300">(opsiyonel)</span>
            </label>
            <input
              type="number"
              name="min_price"
              value={form.min_price}
              onChange={handleChange}
              min="1"
              step="0.01"
              placeholder="Alıcılar bu fiyatın altında teklif veremez"
              className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-300 outline-none focus:border-zinc-400 focus:bg-white transition-all"
            />
          </div>

          {/* Commission info */}
          {form.asking_price && (
            <div className="p-3 bg-zinc-50 border border-zinc-100 rounded-xl">
              <p className="text-xs text-zinc-500">
                {parseFloat(form.asking_price) >= 500
                  ? '≥ ₺500 — Komisyon satıcıdan kesilecek.'
                  : '< ₺500 — Alıcı küçük bir hizmet bedeli ödeyecek. Sana kesinti yok.'}
              </p>
            </div>
          )}

          {error && (
            <p className="text-xs text-red-500 bg-red-50 rounded-lg px-3 py-2">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-zinc-900 hover:bg-black text-white text-sm font-medium rounded-xl px-4 py-3 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
          >
            {loading ? 'Yayınlanıyor...' : 'İlanı Yayınla'}
          </button>
        </form>
      </div>
    </div>
  )
}
