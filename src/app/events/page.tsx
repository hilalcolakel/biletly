import { createServerSupabaseClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Ticket, Search, Calendar, MapPin, ArrowLeft, Filter } from 'lucide-react'

const categoryLabels: Record<string, string> = {
  concert: 'Konser',
  sport: 'Spor',
  theatre: 'Tiyatro',
  festival: 'Festival',
  other: 'Diğer',
}

const categoryColors: Record<string, string> = {
  concert: 'bg-purple-50 text-purple-700',
  sport: 'bg-emerald-50 text-emerald-700',
  theatre: 'bg-amber-50 text-amber-700',
  festival: 'bg-pink-50 text-pink-700',
  other: 'bg-zinc-50 text-zinc-700',
}

export default async function EventsPage({
  searchParams,
}: {
  searchParams: { q?: string; category?: string; city?: string }
}) {
  const supabase = createServerSupabaseClient()

  let query = supabase
    .from('events')
    .select('*, listings(count)')
    .eq('is_active', true)
    .gte('event_date', new Date().toISOString())
    .order('event_date', { ascending: true })

  if (searchParams.q) {
    query = query.ilike('title', `%${searchParams.q}%`)
  }
  if (searchParams.category) {
    query = query.eq('category', searchParams.category)
  }
  if (searchParams.city) {
    query = query.ilike('city', `%${searchParams.city}%`)
  }

  const { data: events } = await query

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-zinc-100">
        <div className="max-w-[980px] mx-auto px-6 h-12 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-1.5">
            <Ticket className="w-[18px] h-[18px] text-zinc-900" strokeWidth={2.2} />
            <span className="font-display text-[15px] font-semibold tracking-tight">biletly</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/auth/login" className="text-xs text-zinc-500 hover:text-zinc-900 transition-colors">
              Giriş Yap
            </Link>
            <Link href="/auth/register" className="text-xs font-medium text-white bg-zinc-900 hover:bg-black px-3.5 py-1.5 rounded-full transition-all">
              Başla
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-[980px] mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-10">
          <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-900 transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" />
            Dashboard
          </Link>
          <h1 className="font-display text-3xl font-bold tracking-tight">Etkinlikler</h1>
          <p className="text-zinc-400 mt-1">Yaklaşan etkinlikleri keşfet, bilet bul.</p>
        </div>

        {/* Search & Filters */}
        <form className="mb-10">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300" />
              <input
                type="text"
                name="q"
                defaultValue={searchParams.q || ''}
                placeholder="Etkinlik ara..."
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-10 pr-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-300 outline-none focus:border-zinc-400 focus:bg-white transition-all"
              />
            </div>
            <select
              name="category"
              defaultValue={searchParams.category || ''}
              className="bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm text-zinc-600 outline-none focus:border-zinc-400 transition-all appearance-none min-w-[140px]"
            >
              <option value="">Tüm Kategoriler</option>
              <option value="concert">Konser</option>
              <option value="sport">Spor</option>
              <option value="theatre">Tiyatro</option>
              <option value="festival">Festival</option>
              <option value="other">Diğer</option>
            </select>
            <button
              type="submit"
              className="bg-zinc-900 hover:bg-black text-white text-sm font-medium rounded-xl px-6 py-3 transition-all active:scale-[0.98]"
            >
              Ara
            </button>
          </div>
        </form>

        {/* Events Grid */}
        {events && events.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.map((event: any) => {
              const date = new Date(event.event_date)
              const listingCount = event.listings?.[0]?.count || 0

              return (
                <Link
                  key={event.id}
                  href={`/events/${event.id}`}
                  className="group block rounded-2xl border border-zinc-100 hover:border-zinc-200 bg-white hover:shadow-lg hover:shadow-zinc-900/5 transition-all overflow-hidden"
                >
                  {/* Image placeholder */}
                  <div className="h-36 bg-gradient-to-br from-zinc-100 to-zinc-50 flex items-center justify-center relative">
                    {event.image_url ? (
                      <img src={event.image_url} alt={event.title} className="w-full h-full object-cover" />
                    ) : (
                      <Ticket className="w-8 h-8 text-zinc-200" />
                    )}
                    <span className={`absolute top-3 left-3 text-[11px] font-medium px-2 py-0.5 rounded-md ${categoryColors[event.category] || categoryColors.other}`}>
                      {categoryLabels[event.category] || 'Diğer'}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <h3 className="font-display font-semibold text-base tracking-tight group-hover:text-zinc-700 transition-colors line-clamp-1">
                      {event.title}
                    </h3>
                    <div className="mt-2 space-y-1">
                      <p className="flex items-center gap-1.5 text-xs text-zinc-400">
                        <Calendar className="w-3 h-3" />
                        {date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                        {' · '}
                        {date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                      <p className="flex items-center gap-1.5 text-xs text-zinc-400">
                        <MapPin className="w-3 h-3" />
                        {event.venue}, {event.city}
                      </p>
                    </div>
                    <div className="mt-3 pt-3 border-t border-zinc-50 flex items-center justify-between">
                      <span className="text-xs text-zinc-400">
                        {listingCount > 0 ? `${listingCount} ilan` : 'Henüz ilan yok'}
                      </span>
                      <span className="text-xs font-medium text-zinc-900 group-hover:underline">
                        Detay →
                      </span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-7 h-7 text-zinc-300" />
            </div>
            <h3 className="font-display text-lg font-semibold mb-1">Etkinlik bulunamadı</h3>
            <p className="text-sm text-zinc-400 mb-6">
              {searchParams.q ? 'Farklı anahtar kelimelerle aramayı dene.' : 'Henüz etkinlik eklenmemiş.'}
            </p>
            <Link
              href="/events/new"
              className="inline-flex text-sm font-medium text-white bg-zinc-900 hover:bg-black px-5 py-2.5 rounded-full transition-all"
            >
              Etkinlik Ekle
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
