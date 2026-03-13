'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Ticket, Users, Calendar, Tag, AlertTriangle, ShieldCheck, BarChart3, ChevronRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function AdminPage() {
  const router = useRouter()
  const supabase = createClient()

  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalEvents: 0,
    totalListings: 0,
    activeListings: 0,
    totalOrders: 0,
    openDisputes: 0,
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/auth/login')
      return
    }

    // Check admin (simple check - in production use RLS or admin role)
    const { data: profile } = await supabase
      .from('profiles')
      .select('email')
      .eq('id', user.id)
      .single()

    // For now allow access - in production check admin role

    const { count: userCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true })
    const { count: eventCount } = await supabase.from('events').select('*', { count: 'exact', head: true })
    const { count: listingCount } = await supabase.from('listings').select('*', { count: 'exact', head: true })
    const { count: activeCount } = await supabase.from('listings').select('*', { count: 'exact', head: true }).eq('status', 'active')
    const { count: orderCount } = await supabase.from('orders').select('*', { count: 'exact', head: true })
    const { count: disputeCount } = await supabase.from('disputes').select('*', { count: 'exact', head: true }).eq('status', 'open')

    setStats({
      totalUsers: userCount || 0,
      totalEvents: eventCount || 0,
      totalListings: listingCount || 0,
      activeListings: activeCount || 0,
      totalOrders: orderCount || 0,
      openDisputes: disputeCount || 0,
    })

    setLoading(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-sm text-zinc-400">Yükleniyor...</p>
      </div>
    )
  }

  const statCards = [
    { label: 'Kullanıcılar', value: stats.totalUsers, icon: Users, color: 'bg-blue-50 text-blue-600' },
    { label: 'Etkinlikler', value: stats.totalEvents, icon: Calendar, color: 'bg-purple-50 text-purple-600' },
    { label: 'Aktif İlanlar', value: stats.activeListings, icon: Tag, color: 'bg-emerald-50 text-emerald-600' },
    { label: 'Toplam Sipariş', value: stats.totalOrders, icon: ShieldCheck, color: 'bg-amber-50 text-amber-600' },
    { label: 'Toplam İlan', value: stats.totalListings, icon: BarChart3, color: 'bg-zinc-50 text-zinc-600' },
    { label: 'Açık Dispute', value: stats.openDisputes, icon: AlertTriangle, color: stats.openDisputes > 0 ? 'bg-red-50 text-red-600' : 'bg-zinc-50 text-zinc-600' },
  ]

  const menuItems = [
    { label: 'Kullanıcı Yönetimi', desc: 'Rol, trust score, ban, ilan limiti', href: '/admin/users', icon: Users },
    { label: 'Etkinlik Yönetimi', desc: 'Merge, düzenle, sil', href: '/admin/events', icon: Calendar },
    { label: 'Dispute Çözümü', desc: 'Açık şikayetleri değerlendir', href: '/admin/disputes', icon: AlertTriangle },
    { label: 'Kampüs Kuralları', desc: 'Kampüs doğrulama & davet kodları', href: '/admin/campus-rules', icon: ShieldCheck },
    { label: 'KYC İncelemeleri', desc: 'Kimlik doğrulama başvuruları', href: '/admin/kyc', icon: ShieldCheck },
    { label: 'Hukuki Metinler', desc: 'KVKK, kullanım koşulları versiyonları', href: '/admin/legal', icon: BarChart3 },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
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
        <h1 className="font-display text-[28px] font-bold tracking-tight mb-1">Admin Panel</h1>
        <p className="text-sm text-zinc-400 mb-10">Platform yönetim merkezi.</p>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-10">
          {statCards.map((stat) => (
            <div key={stat.label} className="p-4 rounded-xl border border-zinc-100">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-8 h-8 rounded-lg ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="w-4 h-4" />
                </div>
              </div>
              <p className="font-display text-2xl font-bold tracking-tight">{stat.value}</p>
              <p className="text-xs text-zinc-400 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Menu */}
        <h2 className="font-display text-lg font-semibold mb-4">Yönetim</h2>
        <div className="space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center justify-between p-4 rounded-xl border border-zinc-100 hover:border-zinc-200 hover:bg-zinc-50/50 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-zinc-50 rounded-xl flex items-center justify-center border border-zinc-100">
                  <item.icon className="w-4 h-4 text-zinc-500" />
                </div>
                <div>
                  <p className="text-sm font-medium">{item.label}</p>
                  <p className="text-xs text-zinc-400">{item.desc}</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-zinc-300 group-hover:text-zinc-500 transition-colors" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
