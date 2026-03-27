import { createServerSupabaseClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Ticket, Calendar, MapPin, ArrowLeft, User, Star } from 'lucide-react'

export default async function EventDetailPage({ params }: { params: { id: string } }) {
  const supabase = createServerSupabaseClient()
  const { data: event } = await supabase.from('events').select('*').eq('id', params.id).single()
  if (!event) notFound()
  const { data: listings } = await supabase.from('listings').select('*, seller:profiles(id, full_name, trust_score, total_sales)').eq('event_id', params.id).eq('status', 'active').order('asking_price', { ascending: true })
  const date = new Date(event.event_date)

  return (
    <div className="min-h-screen bg-zinc-950">
      <nav className="sticky top-0 z-50 glass-dark"><div className="max-w-[980px] mx-auto px-6 h-12 flex items-center"><Link href="/" className="flex items-center gap-2"><div className="w-7 h-7 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center"><Ticket className="w-3.5 h-3.5 text-white" strokeWidth={2.5} /></div><span className="font-display text-[15px] font-bold tracking-tight text-white">biletly</span></Link></div></nav>

      <div className="max-w-[980px] mx-auto px-6 py-12">
        <Link href="/events" className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-white transition-colors mb-8"><ArrowLeft className="w-4 h-4" />Etkinlikler</Link>

        <div className="grid md:grid-cols-[1fr_300px] gap-10 mb-12">
          <div>
            <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight text-white mb-4">{event.title}</h1>
            <div className="space-y-2">
              <p className="flex items-center gap-2 text-sm text-zinc-400"><Calendar className="w-4 h-4 text-zinc-600" />{date.toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} · {date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</p>
              <p className="flex items-center gap-2 text-sm text-zinc-400"><MapPin className="w-4 h-4 text-zinc-600" />{event.venue}, {event.city}</p>
            </div>
          </div>
          <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800 h-fit">
            <p className="text-xs text-zinc-500 uppercase tracking-wider font-medium mb-1">Aktif İlan</p>
            <p className="font-display text-4xl font-bold tracking-tight text-white">{listings?.length || 0}</p>
            {listings && listings.length > 0 && (<><div className="w-full h-px bg-zinc-800 my-4" /><p className="text-xs text-zinc-500 mb-1">Fiyat aralığı</p><p className="font-display text-xl font-bold text-white">₺{Math.min(...listings.map((l: any) => Number(l.asking_price))).toLocaleString('tr-TR')} – ₺{Math.max(...listings.map((l: any) => Number(l.asking_price))).toLocaleString('tr-TR')}</p></>)}
            <Link href="/listings/new" className="mt-4 w-full inline-flex items-center justify-center text-sm font-semibold text-white bg-gradient-to-r from-violet-500 to-purple-600 px-5 py-2.5 rounded-xl shadow-lg shadow-violet-500/20 active:scale-[0.98]">İlan Oluştur</Link>
          </div>
        </div>

        <h2 className="font-display text-xl font-bold text-white mb-6">İlanlar</h2>

        {listings && listings.length > 0 ? (
          <div className="space-y-2">
            {listings.map((l: any) => <ListingRow key={l.id} listing={l} />)}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-14 h-14 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-4"><Ticket className="w-6 h-6 text-zinc-700" /></div>
            <h3 className="font-display text-lg font-semibold text-white mb-1">Henüz ilan yok</h3>
            <p className="text-sm text-zinc-500 mb-6">Bu etkinlik için ilk ilanı sen oluştur.</p>
            <Link href="/listings/new" className="text-sm font-medium text-white bg-gradient-to-r from-violet-500 to-purple-600 px-5 py-2.5 rounded-full">İlan Oluştur</Link>
          </div>
        )}
      </div>
    </div>
  )
}

function ListingRow({ listing }: { listing: any }) {
  const seller = listing.seller
  return (
    <div className="group flex items-center justify-between p-4 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center"><User className="w-4 h-4 text-zinc-500" /></div>
        <div>
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-white">{seller?.full_name || 'Anonim'}</p>
            {seller?.trust_score >= 4 && <span className="flex items-center gap-0.5 text-[10px] font-medium text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded"><Star className="w-2.5 h-2.5" />{seller.trust_score.toFixed(1)}</span>}
          </div>
          <p className="text-xs text-zinc-500">{listing.quantity} bilet · {listing.section_info || 'Bölüm belirtilmemiş'}</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="font-display text-lg font-bold text-white">₺{Number(listing.asking_price).toLocaleString('tr-TR')}</p>
          <p className="text-[10px] text-zinc-600">PDF/QR</p>
        </div>
        <Link href={`/listings/${listing.id}`} className="text-xs font-semibold text-white bg-gradient-to-r from-violet-500 to-purple-600 px-4 py-2 rounded-full active:scale-[0.97]">Teklif Ver</Link>
      </div>
    </div>
  )
}
