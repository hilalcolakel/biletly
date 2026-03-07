'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Ticket, ArrowLeft, Calendar, MapPin, Trash2, Search, Merge, Eye, EyeOff } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function AdminEventsPage() {
  const router = useRouter()
  const supabase = createClient()

  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    const { data } = await supabase
      .from('events')
      .select('*, listings(count)')
      .order('event_date', { ascending: true })

    setEvents(data || [])
    setLoading(false)
  }

  const handleToggleActive = async (eventId: string, currentActive: boolean) => {
    await supabase.from('events').update({ is_active: !currentActive }).eq('id', eventId)
    loadData()
  }

  const handleDelete = async (eventId: string) => {
    if (!confirm('Bu etkinliği silmek istediğinden emin misin? İlgili ilanlar da silinecek.')) return
    await supabase.from('events').delete().eq('id', eventId)
    loadData()
  }

  const filteredEvents = events.filter(e =>
    e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.venue.toLowerCase().includes(searchQuery.toLowerCase())
  )

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

        <h1 className="font-display text-[28px] font-bold tracking-tight mb-1">Etkinlikler</h1>
        <p className="text-sm text-zinc-400 mb-8">{events.length} etkinlik</p>

        <div className="relative mb-6">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Etkinlik, şehir veya mekan ara..."
            className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-10 pr-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-300 outline-none focus:border-zinc-400 focus:bg-white transition-all"
          />
        </div>

        <div className="space-y-2">
          {filteredEvents.map((event) => {
            const date = new Date(event.event_date)
            const isPast = date < new Date()
            const listingCount = event.listings?.[0]?.count || 0

            return (
              <div key={event.id} className={`p-4 rounded-xl border transition-all ${!event.is_active ? 'border-zinc-200 bg-zinc-50/50 opacity-60' : isPast ? 'border-amber-200 bg-amber-50/20' : 'border-zinc-100'}`}>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-medium">{event.title}</h3>
                      {!event.is_active && (
                        <span className="text-[10px] font-medium text-zinc-500 bg-zinc-200 px-1.5 py-0.5 rounded">GİZLİ</span>
                      )}
                      {isPast && (
                        <span className="text-[10px] font-medium text-amber-600 bg-amber-100 px-1.5 py-0.5 rounded">GEÇMİŞ</span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-zinc-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {date.toLocaleDateString('tr-TR')}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {event.venue}, {event.city}
                      </span>
                      <span>{listingCount} ilan</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleToggleActive(event.id, event.is_active)}
                      className={`p-1.5 rounded-lg transition-all ${event.is_active ? 'hover:bg-zinc-100 text-zinc-400' : 'hover:bg-emerald-50 text-emerald-500'}`}
                      title={event.is_active ? 'Gizle' : 'Aktifleştir'}
                    >
                      {event.is_active ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={() => handleDelete(event.id)}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-zinc-400 hover:text-red-500 transition-all"
                      title="Sil"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
