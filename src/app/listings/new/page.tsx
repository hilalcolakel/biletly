'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Ticket, ArrowLeft, Music, Trophy, Drama, PartyPopper } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function NewListingPage() {
  const router = useRouter()
  const supabase = createClient()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    // Event info
    event_title: '',
    category: 'concert',
    city: '',
    venue: '',
    event_date: '',
    event_time: '',
    source_platform: '',
    // Listing info
    quantity: '1',
    section_info: '',
    asking_price: '',
    min_price: '',
  })

  useState(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth/login'); return }
    }
    checkAuth()
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/auth/login'); return }

    // Validate
    if (!form.event_title || !form.city || !form.venue || !form.event_date || !form.event_time || !form.asking_price) {
      setError('Lütfen tüm zorunlu alanları doldur.')
      setLoading(false)
      return
    }

    const eventDate = new Date(`${form.event_date}T${form.event_time}`)

    // 72-hour rule for PDF/QR
    const hoursUntil = (eventDate.getTime() - Date.now()) / (1000 * 60 * 60)
    if (hoursUntil < 72) { setError('İlan etkinliğe 72+ saat varken açılabilir.'); setLoading(false); return }

    // 1. Create or find event
    const { data: existingEvents } = await supabase
      .from('events')
      .select('id')
      .ilike('title', form.event_title)
      .eq('city', form.city)
      .gte('event_date', new Date(form.event_date + 'T00:00:00').toISOString())
      .lte('event_date', new Date(form.event_date + 'T23:59:59').toISOString())
      .limit(1)

    let eventId: string

    if (existingEvents && existingEvents.length > 0) {
      eventId = existingEvents[0].id
    } else {
      const { data: newEvent, error: eventError } = await supabase
        .from('events')
        .insert({
          title: form.event_title,
          category: form.category,
          city: form.city,
          venue: form.venue,
          event_date: eventDate.toISOString(),
          source_platform: form.source_platform || null,
          created_by: user.id,
        })
        .select()
        .single()

      if (eventError) { setError(eventError.message); setLoading(false); return }
      eventId = newEvent.id
    }

    // 2. Create listing
    const { data: listing, error: listingError } = await supabase
      .from('listings')
      .insert({
        event_id: eventId,
        seller_id: user.id,
        listing_type: 'pdf_qr',
        quantity: parseInt(form.quantity),
        section_info: form.section_info || null,
        asking_price: parseFloat(form.asking_price),
        min_price: form.min_price ? parseFloat(form.min_price) : null,
      })
      .select()
      .single()

    if (listingError) { setError(listingError.message); setLoading(false); return }

    router.push(`/events/${eventId}`)
  }

  const categories = [
    { value: 'concert', label: 'Konser', icon: Music },
    { value: 'sport', label: 'Spor', icon: Trophy },
    { value: 'theatre', label: 'Tiyatro', icon: Drama },
    { value: 'festival', label: 'Festival', icon: PartyPopper },
  ]

  return (
    <div className="min-h-screen bg-zinc-950">
      <nav className="sticky top-0 z-50 glass-dark">
        <div className="max-w-[980px] mx-auto px-6 h-12 flex items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Ticket className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-display text-[15px] font-bold tracking-tight text-white">biletly</span>
          </Link>
        </div>
      </nav>

      <div className="max-w-[520px] mx-auto px-6 py-12">
        <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-white transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" />
          Dashboard
        </Link>

        <h1 className="font-display text-[28px] font-bold tracking-tight text-white mb-1">İlan Oluştur</h1>
        <p className="text-sm text-zinc-500 mb-10">Biletini satışa çıkar. Etkinlik ve bilet bilgilerini gir.</p>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* ── ETKINLIK BİLGİLERİ ── */}
          <div>
            <div className="flex items-center gap-2 mb-5">
              <div className="w-6 h-6 bg-violet-500/20 rounded-lg flex items-center justify-center">
                <span className="text-xs font-bold text-violet-400">1</span>
              </div>
              <h2 className="text-sm font-semibold text-white">Etkinlik Bilgileri</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">Etkinlik Adı *</label>
                <input
                  type="text" name="event_title" value={form.event_title} onChange={handleChange}
                  placeholder="Örn: Mabel Matiz — İstanbul Konseri"
                  required
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-600 outline-none focus:border-violet-500/50 focus:bg-zinc-900/80 transition-all"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-2">Kategori</label>
                <div className="grid grid-cols-4 gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.value} type="button"
                      onClick={() => setForm({ ...form, category: cat.value })}
                      className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all ${
                        form.category === cat.value
                          ? 'border-violet-500 bg-violet-500/10 text-violet-300'
                          : 'border-zinc-800 text-zinc-500 hover:border-zinc-700'
                      }`}
                    >
                      <cat.icon className="w-4 h-4" />
                      <span className="text-[11px] font-medium">{cat.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">Şehir *</label>
                  <input type="text" name="city" value={form.city} onChange={handleChange} placeholder="İstanbul" required
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-600 outline-none focus:border-violet-500/50 transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">Mekan *</label>
                  <input type="text" name="venue" value={form.venue} onChange={handleChange} placeholder="Kuruçeşme Arena" required
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-600 outline-none focus:border-violet-500/50 transition-all" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">Tarih *</label>
                  <input type="date" name="event_date" value={form.event_date} onChange={handleChange} required
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-violet-500/50 transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">Saat *</label>
                  <input type="time" name="event_time" value={form.event_time} onChange={handleChange} required
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-violet-500/50 transition-all" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">Kaynak Platform <span className="text-zinc-600">(opsiyonel)</span></label>
                <input type="text" name="source_platform" value={form.source_platform} onChange={handleChange} placeholder="Biletix, Biletinial, Passo..."
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-600 outline-none focus:border-violet-500/50 transition-all" />
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-zinc-800" />

          {/* ── BİLET BİLGİLERİ ── */}
          <div>
            <div className="flex items-center gap-2 mb-5">
              <div className="w-6 h-6 bg-violet-500/20 rounded-lg flex items-center justify-center">
                <span className="text-xs font-bold text-violet-400">2</span>
              </div>
              <h2 className="text-sm font-semibold text-white">Bilet Bilgileri</h2>
            </div>

            <div className="space-y-4">
              {/* Info about delivery */}
              <div className="p-3 bg-violet-500/5 border border-violet-500/10 rounded-xl">
                <p className="text-xs text-violet-400/80">Tüm biletler PDF veya QR kod olarak teslim edilir.</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">Bilet Adedi *</label>
                  <input type="number" name="quantity" value={form.quantity} onChange={handleChange} min="1" max="10" required
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-violet-500/50 transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">Bölüm <span className="text-zinc-600">(ops.)</span></label>
                  <input type="text" name="section_info" value={form.section_info} onChange={handleChange} placeholder="Tribün A, Sıra 5"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-600 outline-none focus:border-violet-500/50 transition-all" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">Satış Fiyatı (₺) *</label>
                <input type="number" name="asking_price" value={form.asking_price} onChange={handleChange} min="1" step="0.01" placeholder="0.00" required
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-600 outline-none focus:border-violet-500/50 transition-all" />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">Min. Kabul Fiyatı (₺) <span className="text-zinc-600">(opsiyonel)</span></label>
                <input type="number" name="min_price" value={form.min_price} onChange={handleChange} min="1" step="0.01" placeholder="Bu fiyatın altında teklif kabul edilmez"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-600 outline-none focus:border-violet-500/50 transition-all" />
              </div>

              {/* Commission info */}
              {form.asking_price && (
                <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl">
                  <p className="text-xs text-zinc-400">
                    {parseFloat(form.asking_price) >= 500
                      ? '≥ ₺500 — Komisyon satıcıdan kesilecek.'
                      : '< ₺500 — Alıcı küçük bir hizmet bedeli ödeyecek. Sana kesinti yok.'}
                  </p>
                </div>
              )}
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
              <p className="text-xs text-red-400">{error}</p>
            </div>
          )}

          <button type="submit" disabled={loading}
            className="w-full bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white text-sm font-semibold rounded-xl px-4 py-3.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] shadow-lg shadow-violet-500/20">
            {loading ? 'Yayınlanıyor...' : 'İlanı Yayınla'}
          </button>
        </form>
      </div>
    </div>
  )
}
