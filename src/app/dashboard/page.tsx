import { createServerSupabaseClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Ticket, LogOut, Search, Plus } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="border-b border-zinc-100">
        <div className="max-w-[980px] mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-1.5">
            <Ticket className="w-[18px] h-[18px] text-zinc-900" strokeWidth={2.2} />
            <span className="font-display text-[15px] font-semibold tracking-tight">biletly</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-zinc-500">
              {profile?.full_name || user.email}
            </span>
            <form action="/auth/signout" method="post">
              <button className="text-zinc-400 hover:text-zinc-600 transition-colors">
                <LogOut className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-[980px] mx-auto px-6 py-16">
        <h1 className="font-display text-3xl font-bold tracking-tight mb-2">
          Hoş geldin{profile?.full_name ? `, ${profile.full_name.split(' ')[0]}` : ''}.
        </h1>
        <p className="text-zinc-400 text-base mb-12">
          Etkinlikleri keşfet, biletini al veya sat.
        </p>

        {/* Quick actions */}
        <div className="grid sm:grid-cols-2 gap-4 max-w-lg">
          <Link
            href="/events"
            className="group flex items-center gap-4 p-5 rounded-2xl bg-zinc-50 border border-zinc-100 hover:bg-zinc-100/80 transition-colors"
          >
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-zinc-200">
              <Search className="w-4 h-4 text-zinc-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-zinc-900">Etkinlik Keşfet</p>
              <p className="text-xs text-zinc-400">Bilet ara ve teklif ver</p>
            </div>
          </Link>

          <Link
            href="/listings/new"
            className="group flex items-center gap-4 p-5 rounded-2xl bg-zinc-50 border border-zinc-100 hover:bg-zinc-100/80 transition-colors"
          >
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-zinc-200">
              <Plus className="w-4 h-4 text-zinc-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-zinc-900">İlan Oluştur</p>
              <p className="text-xs text-zinc-400">Biletini satışa çıkar</p>
            </div>
          </Link>
        </div>

        {/* Trust Score */}
        <div className="mt-12 p-6 rounded-2xl bg-zinc-50 border border-zinc-100 max-w-lg">
          <p className="text-xs text-zinc-400 uppercase tracking-wider font-medium mb-2">Trust Score</p>
          <div className="flex items-end gap-3">
            <span className="font-display text-4xl font-bold tracking-tight">
              {profile?.trust_score ?? 50}
            </span>
            <span className="text-sm text-zinc-400 mb-1">/ 100</span>
          </div>
          <div className="mt-3 w-full bg-zinc-200 rounded-full h-1.5">
            <div
              className="bg-zinc-900 h-1.5 rounded-full transition-all"
              style={{ width: `${profile?.trust_score ?? 50}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
