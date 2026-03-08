import { createServerSupabaseClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Ticket, Search, Calendar, MapPin, ArrowLeft, Music, Trophy, Drama, PartyPopper, HelpCircle } from 'lucide-react'

const catConfig: Record<string, { label: string; color: string; gradient: string }> = {
  concert: { label: 'Konser', color: 'text-violet-400 bg-violet-500/10', gradient: 'from-violet-500 to-purple-500' },
  sport: { label: 'Spor', color: 'text-orange-400 bg-orange-500/10', gradient: 'from-orange-500 to-amber-500' },
  theatre: { label: 'Tiyatro', color: 'text-emerald-400 bg-emerald-500/10', gradient: 'from-emerald-500 to-teal-500' },
  festival: { label: 'Festival', color: 'text-pink-400 bg-pink-500/10', gradient: 'from-pink-500 to-rose-500' },
  other: { label: 'Diğer', color: 'text-zinc-400 bg-zinc-500/10', gradient: 'from-zinc-500 to-zinc-400' },
}

export default async function EventsPage({ searchParams }: { searchParams: { q?: string; category?: string } }) {
  const supabase = createServerSupabaseClient()
  let query = supabase.from('events').select('*, listings(count)').eq('is_active', true).gte('event_date', new Date().toISOString()).order('event_date', { ascending: true })
  if (searchParams.q) query = query.ilike('title', `%${searchParams.q}%`)
  if (searchParams.category) query = query.eq('category', searchParams.category)
  const { data: events } = await query

  return (
    <div className="min-h-screen bg-zinc-950">
      <nav className="sticky top-0 z-50 glass-dark">
        <div className="max-w-[980px] mx-auto px-6 h-12 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Ticket className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-display text-[15px] font-bold tracking-tight text-white">biletly</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/auth/login" className="text-xs text-zinc-400 hover:text-white transition-colors">Giriş</Link>
            <Link href="/auth/register" className="text-xs font-semibold text-white bg-gradient-to-r from-violet-500 to-purple-600 px-4 py-1.5 rounded-full">Başla</Link>
          </div>
        </div>
      </nav>

      <div className="max-w-[980px] mx-auto px-6 py-12">
        <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-white transition-colors mb-6"><ArrowLeft className="w-4 h-4" />Dashboard</Link>
        <h1 className="font-display text-3xl font-bold tracking-tight text-white">Etkinlikler</h1>
        <p className="text-zinc-500 mt-1 mb-8">Yaklaşan etkinlikleri keşfet, bilet bul.</p>

        <form className="mb-8">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
              <input type="text" name="q" defaultValue={searchParams.q || ''} placeholder="Etkinlik ara..."
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-zinc-600 outline-none focus:border-violet-500/50 transition-all" />
            </div>
            <select name="category" defaultValue={searchParams.category || ''}
              className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-400 outline-none focus:border-violet-500/50 transition-all appearance-none min-w-[140px]">
              <option value="">Tüm Kategoriler</option>
              <option value="concert">Konser</option><option value="sport">Spor</option><option value="theatre">Tiyatro</option><option value="festival">Festival</option>
            </select>
            <button type="submit" className="bg-gradient-to-r from-violet-500 to-purple-600 text-white text-sm font-medium rounded-xl px-6 py-3 transition-all active:scale-[0.98]">Ara</button>
          </div>
        </form>

        {events && events.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {events.map((event: any) => {
              const date = new Date(event.event_date)
              const cat = catConfig[event.category] || catConfig.other
              const count = event.listings?.[0]?.count || 0
              return (
                <Link key={event.id} href={`/events/${event.id}`}
                  className="group block rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all card-hover overflow-hidden">
                  <div className={`h-24 bg-gradient-to-br ${cat.gradient} opacity-20 group-hover:opacity-30 transition-opacity`} />
                  <div className="p-4 -mt-6 relative">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${cat.color}`}>{cat.label}</span>
                    <h3 className="font-display font-semibold text-white mt-2 line-clamp-1">{event.title}</h3>
                    <div className="mt-2 space-y-1">
                      <p className="flex items-center gap-1.5 text-xs text-zinc-500"><Calendar className="w-3 h-3" />{date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })} · {date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</p>
                      <p className="flex items-center gap-1.5 text-xs text-zinc-500"><MapPin className="w-3 h-3" />{event.venue}, {event.city}</p>
                    </div>
                    <div className="mt-3 pt-3 border-t border-zinc-800 flex items-center justify-between">
                      <span className="text-xs text-zinc-600">{count > 0 ? `${count} ilan` : 'Henüz ilan yok'}</span>
                      <span className="text-xs font-medium text-violet-400 group-hover:underline">Detay →</span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-4"><Calendar className="w-7 h-7 text-zinc-700" /></div>
            <h3 className="font-display text-lg font-semibold text-white mb-1">Etkinlik bulunamadı</h3>
            <p className="text-sm text-zinc-500 mb-6">{searchParams.q ? 'Farklı anahtar kelimelerle ara.' : 'Henüz etkinlik eklenmemiş.'}</p>
            <Link href="/events/new" className="text-sm font-medium text-white bg-gradient-to-r from-violet-500 to-purple-600 px-5 py-2.5 rounded-full">Etkinlik Ekle</Link>
          </div>
        )}
      </div>
    </div>
  )
}
