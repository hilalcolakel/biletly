import { createServerSupabaseClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Ticket, Calendar, MapPin, ArrowLeft, Shield, AlertTriangle, User, Star } from 'lucide-react'

const categoryLabels: Record<string, string> = {
  concert: 'Konser',
  sport: 'Spor',
  theatre: 'Tiyatro',
  festival: 'Festival',
  other: 'Diğer',
}

export default async function EventDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = createServerSupabaseClient()

  const { data: event } = await supabase
    .from('events')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!event) notFound()

  // Get listings for this event with seller info
  const { data: listings } = await supabase
    .from('listings')
    .select('*, seller:profiles(id, full_name, trust_score, total_sales)')
    .eq('event_id', params.id)
    .eq('status', 'active')
    .order('listing_type', { ascending: true }) // transfer first
    .order('asking_price', { ascending: true })

  const date = new Date(event.event_date)
  const hoursUntil = (date.getTime() - Date.now()) / (1000 * 60 * 60)

  // Separate transfer and PDF/QR listings
  const transferListings = listings?.filter((l: any) => l.listing_type === 'transfer') || []
  const pdfListings = listings?.filter((l: any) => l.listing_type === 'pdf_qr') || []

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
        {/* Back */}
        <Link href="/events" className="inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-900 transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" />
          Etkinlikler
        </Link>

        {/* Event Header */}
        <div className="grid md:grid-cols-[1fr_320px] gap-10 mb-12">
          <div>
            <span className="inline-block text-[11px] font-medium px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-600 mb-3">
              {categoryLabels[event.category] || 'Diğer'}
            </span>
            <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight mb-4">
              {event.title}
            </h1>
            <div className="space-y-2">
              <p className="flex items-center gap-2 text-sm text-zinc-500">
                <Calendar className="w-4 h-4 text-zinc-400" />
                {date.toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                {' · '}
                {date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
              </p>
              <p className="flex items-center gap-2 text-sm text-zinc-500">
                <MapPin className="w-4 h-4 text-zinc-400" />
                {event.venue}, {event.city}
              </p>
              {event.source_platform && (
                <p className="text-xs text-zinc-400">
                  Kaynak: {event.source_platform}
                </p>
              )}
            </div>
          </div>

          {/* Quick Stats Card */}
          <div className="bg-zinc-50 rounded-2xl p-6 border border-zinc-100 h-fit">
            <div className="text-center mb-4">
              <p className="text-xs text-zinc-400 uppercase tracking-wider font-medium mb-1">Aktif İlan</p>
              <p className="font-display text-4xl font-bold tracking-tight">
                {(listings?.length || 0)}
              </p>
            </div>
            <div className="w-full h-px bg-zinc-200 my-4" />
            {listings && listings.length > 0 ? (
              <div className="text-center">
                <p className="text-xs text-zinc-400 mb-1">Fiyat aralığı</p>
                <p className="font-display text-xl font-bold tracking-tight">
                  ₺{Math.min(...listings.map((l: any) => Number(l.asking_price))).toLocaleString('tr-TR')}
                  {' – '}
                  ₺{Math.max(...listings.map((l: any) => Number(l.asking_price))).toLocaleString('tr-TR')}
                </p>
              </div>
            ) : (
              <p className="text-xs text-zinc-400 text-center">Henüz fiyat bilgisi yok</p>
            )}
            <Link
              href="/listings/new"
              className="mt-4 w-full inline-flex items-center justify-center text-sm font-medium text-white bg-zinc-900 hover:bg-black px-5 py-2.5 rounded-xl transition-all active:scale-[0.98]"
            >
              İlan Oluştur
            </Link>
          </div>
        </div>

        {/* Listings */}
        <div>
          <h2 className="font-display text-xl font-bold tracking-tight mb-6">
            İlanlar
          </h2>

          {/* Transfer Listings */}
          {transferListings.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-semibold text-zinc-700">Transfer İlanları</h3>
                <span className="text-xs text-zinc-400">— Önerilen yöntem</span>
              </div>
              <div className="space-y-3">
                {transferListings.map((listing: any) => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>
            </div>
          )}

          {/* PDF/QR Listings */}
          {pdfListings.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <h3 className="text-sm font-semibold text-zinc-700">PDF/QR İlanları</h3>
                <span className="text-xs text-zinc-400">— Daha yüksek risk</span>
              </div>
              <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl mb-4">
                <p className="text-xs text-amber-700">
                  PDF/QR biletlerde transfer yapılmaz, dosya paylaşılır. Risk daha yüksektir.
                  Sadece Trust Score ≥ 90 olan satıcılar bu tür ilan açabilir.
                </p>
              </div>
              <div className="space-y-3">
                {pdfListings.map((listing: any) => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {(!listings || listings.length === 0) && (
            <div className="text-center py-16">
              <div className="w-14 h-14 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Ticket className="w-6 h-6 text-zinc-300" />
              </div>
              <h3 className="font-display text-lg font-semibold mb-1">Henüz ilan yok</h3>
              <p className="text-sm text-zinc-400 mb-6">Bu etkinlik için ilk ilanı sen oluştur.</p>
              <Link
                href="/listings/new"
                className="inline-flex text-sm font-medium text-white bg-zinc-900 hover:bg-black px-5 py-2.5 rounded-full transition-all"
              >
                İlan Oluştur
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function ListingCard({ listing }: { listing: any }) {
  const seller = listing.seller
  const isTransfer = listing.listing_type === 'transfer'

  return (
    <div className="group flex items-center justify-between p-4 rounded-xl border border-zinc-100 hover:border-zinc-200 hover:shadow-sm transition-all">
      <div className="flex items-center gap-4">
        {/* Seller avatar */}
        <div className="w-10 h-10 bg-zinc-100 rounded-full flex items-center justify-center">
          <User className="w-4 h-4 text-zinc-400" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-zinc-900">
              {seller?.full_name || 'Anonim'}
            </p>
            {seller?.trust_score >= 90 && (
              <span className="flex items-center gap-0.5 text-[10px] font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                <Star className="w-2.5 h-2.5" />
                {seller.trust_score}
              </span>
            )}
          </div>
          <p className="text-xs text-zinc-400">
            {listing.quantity} bilet · {listing.section_info || 'Bölüm belirtilmemiş'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="font-display text-lg font-bold tracking-tight">
            ₺{Number(listing.asking_price).toLocaleString('tr-TR')}
          </p>
          <p className="text-[10px] text-zinc-400">
            {isTransfer ? 'Transfer' : 'PDF/QR'}
          </p>
        </div>
        <Link
          href={`/listings/${listing.id}`}
          className="text-xs font-medium text-white bg-zinc-900 hover:bg-black px-4 py-2 rounded-full transition-all active:scale-[0.97]"
        >
          Teklif Ver
        </Link>
      </div>
    </div>
  )
}
