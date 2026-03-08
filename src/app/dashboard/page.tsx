import { createServerSupabaseClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Ticket, LogOut, Search, Plus, ShoppingBag, User, Settings, ChevronRight } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()

  const ts = profile?.trust_score ?? 50
  const tsColor = ts >= 90 ? 'from-emerald-500 to-teal-400' : ts >= 70 ? 'from-blue-500 to-cyan-400' : ts >= 50 ? 'from-amber-500 to-orange-400' : 'from-red-500 to-rose-400'

  return (
    <div className="min-h-screen bg-zinc-950">
      <nav className="sticky top-0 z-50 glass-dark">
        <div className="max-w-[980px] mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Ticket className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-display text-[15px] font-bold tracking-tight text-white">biletly</span>
          </Link>
          <div className="flex items-center gap-5">
            <Link href="/orders" className="text-xs text-zinc-400 hover:text-white transition-colors">Biletlerim</Link>
            <Link href="/profile" className="text-xs text-zinc-400 hover:text-white transition-colors">Profil</Link>
            <Link href="/admin" className="text-xs text-zinc-400 hover:text-white transition-colors">Admin</Link>
            <span className="text-sm text-zinc-500">{profile?.full_name || user.email}</span>
            <form action="/auth/signout" method="post">
              <button className="text-zinc-600 hover:text-zinc-400 transition-colors"><LogOut className="w-4 h-4" /></button>
            </form>
          </div>
        </div>
      </nav>

      <div className="max-w-[980px] mx-auto px-6 py-16">
        <h1 className="font-display text-3xl font-bold tracking-tight text-white mb-2">
          Hoş geldin{profile?.full_name ? `, ${profile.full_name.split(' ')[0]}` : ''}.
        </h1>
        <p className="text-zinc-500 text-base mb-12">Etkinlikleri keşfet, biletini al veya sat.</p>

        {/* Quick actions */}
        <div className="grid sm:grid-cols-2 gap-3 max-w-xl mb-12">
          {[
            { href: '/events', icon: Search, title: 'Etkinlik Keşfet', desc: 'Bilet ara ve teklif ver', gradient: 'from-blue-500 to-cyan-400' },
            { href: '/listings/new', icon: Plus, title: 'İlan Oluştur', desc: 'Biletini satışa çıkar', gradient: 'from-violet-500 to-purple-500' },
            { href: '/orders', icon: ShoppingBag, title: 'Biletlerim', desc: 'Aldığın ve sattığın biletler', gradient: 'from-orange-500 to-amber-400' },
            { href: '/profile', icon: User, title: 'Profil', desc: 'Hesap ayarları ve trust score', gradient: 'from-emerald-500 to-teal-400' },
          ].map((item) => (
            <Link key={item.href} href={item.href}
              className="group flex items-center gap-4 p-4 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all card-hover">
              <div className={`w-10 h-10 bg-gradient-to-br ${item.gradient} rounded-xl flex items-center justify-center shadow-lg shrink-0 group-hover:scale-110 transition-transform`}>
                <item.icon className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-white">{item.title}</p>
                <p className="text-xs text-zinc-500">{item.desc}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-zinc-700 group-hover:text-zinc-500 transition-colors" />
            </Link>
          ))}
        </div>

        {/* Trust Score */}
        <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 max-w-xl">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-zinc-500 uppercase tracking-wider font-medium">Trust Score</p>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full bg-gradient-to-r ${tsColor} text-white`}>
              {ts >= 90 ? 'Güvenilir' : ts >= 70 ? 'İyi' : ts >= 50 ? 'Orta' : 'Düşük'}
            </span>
          </div>
          <div className="flex items-end gap-3 mb-3">
            <span className="font-display text-4xl font-bold tracking-tight text-white">{ts}</span>
            <span className="text-sm text-zinc-600 mb-1">/ 100</span>
          </div>
          <div className="w-full bg-zinc-800 rounded-full h-2">
            <div className={`h-2 rounded-full bg-gradient-to-r ${tsColor} transition-all`} style={{ width: `${ts}%` }} />
          </div>
        </div>
      </div>
    </div>
  )
}
