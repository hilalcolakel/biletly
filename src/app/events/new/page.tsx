'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Ticket, ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function NewEventPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ title: '', category: 'concert', city: '', venue: '', event_date: '', event_time: '', source_platform: '' })
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/auth/login'); return }
    const { data, error: err } = await supabase.from('events').insert({ title: form.title, category: form.category, city: form.city, venue: form.venue, event_date: new Date(`${form.event_date}T${form.event_time}`).toISOString(), source_platform: form.source_platform || null, created_by: user.id }).select().single()
    if (err) { setError(err.message); setLoading(false); return }
    router.push(`/events/${data.id}`)
  }

  const inputClass = "w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-600 outline-none focus:border-violet-500/50 transition-all"

  return (
    <div className="min-h-screen bg-zinc-950">
      <nav className="sticky top-0 z-50 glass-dark"><div className="max-w-[980px] mx-auto px-6 h-12 flex items-center"><Link href="/" className="flex items-center gap-2"><div className="w-7 h-7 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center"><Ticket className="w-3.5 h-3.5 text-white" strokeWidth={2.5} /></div><span className="font-display text-[15px] font-bold tracking-tight text-white">biletly</span></Link></div></nav>
      <div className="max-w-[480px] mx-auto px-6 py-12">
        <Link href="/events" className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-white transition-colors mb-8"><ArrowLeft className="w-4 h-4" />Etkinlikler</Link>
        <h1 className="font-display text-[28px] font-bold tracking-tight text-white mb-1">Etkinlik Ekle</h1>
        <p className="text-sm text-zinc-500 mb-8">Topluluk için yeni bir etkinlik oluştur.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label className="block text-xs font-medium text-zinc-400 mb-1.5">Etkinlik Adı</label><input type="text" name="title" value={form.title} onChange={handleChange} placeholder="Örn: Mabel Matiz Konseri" required className={inputClass} /></div>
          <div><label className="block text-xs font-medium text-zinc-400 mb-1.5">Kategori</label><select name="category" value={form.category} onChange={handleChange} className={inputClass + " appearance-none"}><option value="concert">Konser</option><option value="sport">Spor</option><option value="theatre">Tiyatro</option><option value="festival">Festival</option><option value="other">Diğer</option></select></div>
          <div className="grid grid-cols-2 gap-3"><div><label className="block text-xs font-medium text-zinc-400 mb-1.5">Şehir</label><input type="text" name="city" value={form.city} onChange={handleChange} placeholder="İstanbul" required className={inputClass} /></div><div><label className="block text-xs font-medium text-zinc-400 mb-1.5">Mekan</label><input type="text" name="venue" value={form.venue} onChange={handleChange} placeholder="Kuruçeşme Arena" required className={inputClass} /></div></div>
          <div className="grid grid-cols-2 gap-3"><div><label className="block text-xs font-medium text-zinc-400 mb-1.5">Tarih</label><input type="date" name="event_date" value={form.event_date} onChange={handleChange} required className={inputClass} /></div><div><label className="block text-xs font-medium text-zinc-400 mb-1.5">Saat</label><input type="time" name="event_time" value={form.event_time} onChange={handleChange} required className={inputClass} /></div></div>
          <div><label className="block text-xs font-medium text-zinc-400 mb-1.5">Platform <span className="text-zinc-600">(ops.)</span></label><input type="text" name="source_platform" value={form.source_platform} onChange={handleChange} placeholder="Biletix, Passo..." className={inputClass} /></div>
          {error && <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</p>}
          <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-violet-500 to-purple-600 text-white text-sm font-semibold rounded-xl px-4 py-3 transition-all disabled:opacity-50 active:scale-[0.98] shadow-lg shadow-violet-500/20">{loading ? 'Oluşturuluyor...' : 'Etkinlik Oluştur'}</button>
        </form>
      </div>
    </div>
  )
}
