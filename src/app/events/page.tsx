'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Ticket, Calendar, MapPin, Search, ArrowRight, ArrowLeft, LogOut } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const CATEGORY_META: Record<string, { icon: string; color: string; label: string }> = {
  concert: { icon: '🎵', color: 'bg-violet-500/10 text-violet-400 border-violet-500/20', label: 'Konser' },
  sport: { icon: '⚽', color: 'bg-orange-500/10 text-orange-400 border-orange-500/20', label: 'Spor' },
  theatre: { icon: '🎭', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', label: 'Tiyatro' },
  festival: { icon: '🎉', color: 'bg-pink-500/10 text-pink-400 border-pink-500/20', label: 'Festival' },
  other: { icon: '🎫', color: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20', label: 'Diğer' },
}

export default function EventsPage() {
  const supabase = createClient()
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const load = async () => {
      // Check auth state
      const { data: { user: currentUser } } = await supabase.auth.getUser()
      setUser(currentUser)

      const { data } = await supabase
        .from('events')
        .select('*, listings(count)')
        .eq('is_active', true)
        .gte('event_date', new Date().toISOString())
        .order('event_date', { ascending: true })
      setEvents(data || [])
      setLoading(false)
    }
    load()
  }, [])

  const filtered = events.filter(e => {
    const q = searchQuery.toLowerCase()
    const matchSearch = !q || e.title.toLowerCase().includes(q) || e.city?.toLowerCase().includes(q) || e.venue?.toLowerCase().includes(q) || e.artist?.toLowerCase().includes(q)
    const matchCat = categoryFilter === 'all' || e.category === categoryFilter
    return matchSearch && matchCat
  })

  return (
    <div className="min-h-screen bg-black">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50">
        <div className="max-w-[1200px] mx-auto px-6 pt-4">
          <div className="flex items-center justify-between h-14 px-6 rounded-full bg-white/[0.03] backdrop-blur-xl border border-white/[0.06]">
            <Link href={user ? '/dashboard' : '/'} className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-gradient-to-br from-[#5227FF] to-[#B19EEF] rounded-xl flex items-center justify-center shadow-lg shadow-[#5227FF]/30">
                <Ticket className="w-4 h-4 text-white" strokeWidth={2.5} />
              </div>
              <span className="font-display text-[17px] font-bold tracking-tight text-white">biletly</span>
            </Link>
            {user ? (
              <div className="flex items-center gap-5">
                <Link href="/orders" className="text-xs text-zinc-400 hover:text-white transition-colors">Biletlerim</Link>
                <Link href="/profile" className="text-xs text-zinc-400 hover:text-white transition-colors">Profil</Link>
                <span className="text-sm text-zinc-500">{user.email}</span>
                <form action="/auth/signout" method="post">
                  <button className="text-zinc-600 hover:text-zinc-400 transition-colors"><LogOut className="w-4 h-4" /></button>
                </form>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/auth/login" className="hidden sm:block text-[13px] text-zinc-400 hover:text-white transition-colors px-4 py-2 rounded-full">Giriş</Link>
                <Link href="/auth/register" className="text-[13px] font-semibold text-white bg-white/[0.08] hover:bg-white/[0.14] backdrop-blur-sm px-5 py-2 rounded-full transition-all border border-white/[0.08]">Başla</Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      <div className="max-w-[1200px] mx-auto px-6 pt-32 pb-20">
        <Link href={user ? '/dashboard' : '/'} className="inline-flex items-center gap-1.5 text-sm text-zinc-600 hover:text-white transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> {user ? 'Dashboard' : 'Ana Sayfa'}
        </Link>

        <h1 className="font-display text-[clamp(2rem,5vw,3rem)] font-extrabold tracking-[-0.03em] text-white mb-2">Etkinlikler</h1>
        <p className="text-zinc-500 mb-10">Yaklaşan etkinlikleri keşfet, biletlerini güvenle al.</p>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
            <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              placeholder="Etkinlik, sanatçı, mekan veya şehir ara..."
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-2xl pl-11 pr-4 py-3 text-sm text-white placeholder:text-zinc-600 outline-none focus:border-[#5227FF]/50 transition-all" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {['all', 'concert', 'sport', 'theatre', 'festival', 'other'].map(cat => {
              const meta = cat === 'all' ? { icon: '🔥', label: 'Tümü' } : CATEGORY_META[cat]
              return (
                <button key={cat} onClick={() => setCategoryFilter(cat)}
                  className={`text-[13px] px-4 py-2.5 rounded-xl border transition-all ${categoryFilter === cat
                    ? 'bg-white/[0.08] border-white/[0.15] text-white'
                    : 'bg-transparent border-white/[0.06] text-zinc-500 hover:text-white hover:border-white/[0.12]'
                  }`}>
                  {meta.icon} {meta.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Events Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20"><p className="text-sm text-zinc-600">Yükleniyor...</p></div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-zinc-600 text-sm">Etkinlik bulunamadı.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(event => {
              const date = new Date(event.event_date)
              const cat = CATEGORY_META[event.category] || CATEGORY_META.other
              const listingCount = event.listings?.[0]?.count || 0

              return (
                <div key={event.id} className="group bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.06] hover:border-white/[0.12] rounded-3xl p-6 transition-all duration-500 flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-[11px] font-medium px-2.5 py-1 rounded-lg border ${cat.color}`}>{cat.icon} {cat.label}</span>
                    {listingCount > 0 && <span className="text-[11px] text-zinc-500">{listingCount} ilan</span>}
                  </div>

                  <h3 className="font-display text-lg font-bold text-white mb-1 group-hover:text-[#B19EEF] transition-colors">{event.title}</h3>
                  {event.artist && <p className="text-sm text-zinc-500 mb-3">{event.artist}</p>}
                  {event.description && <p className="text-xs text-zinc-600 mb-4 line-clamp-2">{event.description}</p>}

                  <div className="mt-auto pt-4 border-t border-white/[0.04] flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="flex items-center gap-1.5 text-xs text-zinc-500">
                        <Calendar className="w-3 h-3" />
                        {date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                      <p className="flex items-center gap-1.5 text-xs text-zinc-500">
                        <MapPin className="w-3 h-3" />
                        {event.venue}, {event.city}
                      </p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-white/[0.05] flex items-center justify-center group-hover:bg-[#5227FF]/20 transition-colors">
                      <ArrowRight className="w-3.5 h-3.5 text-zinc-600 group-hover:text-[#B19EEF] transition-colors" />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <footer className="border-t border-white/[0.04]">
        <div className="max-w-[1200px] mx-auto px-6 py-8 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-gradient-to-br from-[#5227FF] to-[#B19EEF] rounded-lg flex items-center justify-center">
              <Ticket className="w-3 h-3 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-display text-sm font-semibold text-zinc-600">biletly</span>
          </div>
          <p className="text-[12px] text-zinc-800">© 2026 Biletly</p>
        </div>
      </footer>
    </div>
  )
}
