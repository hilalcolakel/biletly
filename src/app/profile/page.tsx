'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Ticket, ArrowLeft, User, Shield, Star, TrendingUp, TrendingDown, LogOut, Save, ShoppingBag, Tag, Package, Clock, CheckCircle, XCircle, ChevronRight, Settings, CreditCard, Bell, HelpCircle, Award } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function ProfilePage() {
  const router = useRouter()
  const supabase = createClient()
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState('')
  const [form, setForm] = useState({ full_name: '' })
  const [activeTab, setActiveTab] = useState<'overview' | 'settings'>('overview')
  const [stats, setStats] = useState({ activeListings: 0, completedOrders: 0, totalOrders: 0 })

  useEffect(() => { loadData() }, [])

  const loadData = async () => {
    const { data: { user: u } } = await supabase.auth.getUser()
    if (!u) { router.push('/auth/login'); return }
    setUser(u)
    const { data: p } = await supabase.from('profiles').select('*').eq('id', u.id).single()
    if (p) { setProfile(p); setForm({ full_name: p.full_name || '' }) }
    const { count: active } = await supabase.from('listings').select('*', { count: 'exact', head: true }).eq('seller_id', u.id).eq('status', 'active')
    const { count: completed } = await supabase.from('orders').select('*', { count: 'exact', head: true }).or(`buyer_id.eq.${u.id},seller_id.eq.${u.id}`).eq('status', 'completed')
    const { count: total } = await supabase.from('orders').select('*', { count: 'exact', head: true }).or(`buyer_id.eq.${u.id},seller_id.eq.${u.id}`)
    setStats({ activeListings: active || 0, completedOrders: completed || 0, totalOrders: total || 0 })
    setLoading(false)
  }

  const handleSave = async () => {
    setSaving(true); setSuccess('')
    await supabase.from('profiles').update({ full_name: form.full_name }).eq('id', user.id)
    setSuccess('Profil güncellendi.'); setProfile({ ...profile, full_name: form.full_name }); setSaving(false)
  }

  const handleSignOut = async () => { await supabase.auth.signOut(); router.push('/'); router.refresh() }

  if (loading) return <div className="min-h-screen bg-zinc-950 flex items-center justify-center"><p className="text-sm text-zinc-500">Yükleniyor...</p></div>

  const ts = profile?.trust_score ?? 50
  const tsColor = ts >= 90 ? 'from-emerald-500 to-teal-400' : ts >= 70 ? 'from-blue-500 to-cyan-400' : ts >= 50 ? 'from-amber-500 to-orange-400' : 'from-red-500 to-rose-400'
  const tsLabel = ts >= 90 ? 'Güvenilir Satıcı' : ts >= 70 ? 'İyi' : ts >= 50 ? 'Orta' : 'Düşük'

  return (
    <div className="min-h-screen bg-zinc-950">
      <nav className="sticky top-0 z-50 glass-dark">
        <div className="max-w-[980px] mx-auto px-6 h-12 flex items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center"><Ticket className="w-3.5 h-3.5 text-white" strokeWidth={2.5} /></div>
            <span className="font-display text-[15px] font-bold tracking-tight text-white">biletly</span>
          </Link>
        </div>
      </nav>

      <div className="max-w-[680px] mx-auto px-6 py-12">
        <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-white transition-colors mb-8"><ArrowLeft className="w-4 h-4" />Dashboard</Link>

        {/* Profile Header - Dolap style */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-4 mb-5">
            <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg shadow-violet-500/20">
              <span className="text-xl font-bold text-white">{(profile?.full_name || 'U')[0].toUpperCase()}</span>
            </div>
            <div className="flex-1">
              <h1 className="font-display text-xl font-bold text-white">{profile?.full_name || 'İsimsiz'}</h1>
              <p className="text-sm text-zinc-500">{user?.email}</p>
              <div className="flex items-center gap-2 mt-1">
                {ts >= 90 && <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full"><Award className="w-3 h-3" />Güvenilir Satıcı</span>}
                {profile?.is_verified && <span className="flex items-center gap-1 text-[10px] font-semibold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full"><CheckCircle className="w-3 h-3" />Doğrulanmış</span>}
                <span className="text-[10px] text-zinc-600">Üyelik: {new Date(profile?.created_at).toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })}</span>
              </div>
            </div>
          </div>

          {/* Stats row - Dolap style */}
          <div className="grid grid-cols-4 gap-3">
            <div className="text-center p-3 bg-zinc-800/50 rounded-xl">
              <p className="font-display text-lg font-bold text-white">{profile?.total_purchases || 0}</p>
              <p className="text-[10px] text-zinc-500">Alım</p>
            </div>
            <div className="text-center p-3 bg-zinc-800/50 rounded-xl">
              <p className="font-display text-lg font-bold text-white">{profile?.total_sales || 0}</p>
              <p className="text-[10px] text-zinc-500">Satış</p>
            </div>
            <div className="text-center p-3 bg-zinc-800/50 rounded-xl">
              <p className="font-display text-lg font-bold text-white">{stats.activeListings}</p>
              <p className="text-[10px] text-zinc-500">Aktif İlan</p>
            </div>
            <div className="text-center p-3 bg-zinc-800/50 rounded-xl">
              <p className="font-display text-lg font-bold text-white">{stats.completedOrders}</p>
              <p className="text-[10px] text-zinc-500">Tamamlanan</p>
            </div>
          </div>
        </div>

        {/* Trust Score Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-violet-400" />
              <h2 className="text-sm font-semibold text-white">Trust Score</h2>
            </div>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full bg-gradient-to-r ${tsColor} text-white`}>{tsLabel}</span>
          </div>
          <div className="flex items-end gap-3 mb-3">
            <span className="font-display text-5xl font-bold tracking-tight text-white">{ts}</span>
            <span className="text-sm text-zinc-600 mb-2">/ 100</span>
          </div>
          <div className="w-full bg-zinc-800 rounded-full h-2.5 mb-4">
            <div className={`h-2.5 rounded-full bg-gradient-to-r ${tsColor} transition-all`} style={{ width: `${ts}%` }} />
          </div>

          {/* Score factors */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-500">SLA içi teslim</span>
              <span className="text-emerald-400">+Puan</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-500">Düşük dispute oranı</span>
              <span className="text-emerald-400">+Puan</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-500">SLA kaçırma / iade</span>
              <span className="text-red-400">−Puan</span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-zinc-800">
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-500">PDF/QR ilan yetkisi</span>
              <span className={ts >= 90 ? 'text-emerald-400 font-medium' : 'text-zinc-600'}>
                {ts >= 90 ? '✓ Aktif' : `${90 - ts} puan kaldı`}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs mt-1">
              <span className="text-zinc-500">İlan limiti</span>
              <span className="text-white font-medium">{profile?.listing_limit || 5} ilan</span>
            </div>
          </div>
        </div>

        {/* Quick links - Dolap style menu */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden mb-6">
          {[
            { href: '/orders', icon: ShoppingBag, label: 'Aldıklarım & Sattıklarım', desc: 'Sipariş takibi', color: 'text-orange-400' },
            { href: '/listings/new', icon: Tag, label: 'İlan Oluştur', desc: 'Biletini satışa çıkar', color: 'text-violet-400' },
            { href: '/events', icon: Ticket, label: 'Etkinlikleri Keşfet', desc: 'Bilet ara', color: 'text-blue-400' },
          ].map((item, i) => (
            <Link key={item.href} href={item.href}
              className={`flex items-center justify-between p-4 hover:bg-zinc-800/50 transition-colors ${i > 0 ? 'border-t border-zinc-800' : ''}`}>
              <div className="flex items-center gap-3">
                <item.icon className={`w-5 h-5 ${item.color}`} />
                <div>
                  <p className="text-sm font-medium text-white">{item.label}</p>
                  <p className="text-[11px] text-zinc-600">{item.desc}</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-zinc-700" />
            </Link>
          ))}
        </div>

        {/* Settings */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-6">
          <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <Settings className="w-4 h-4 text-zinc-500" /> Hesap Ayarları
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">E-posta</label>
              <input type="email" value={user?.email || ''} disabled
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-zinc-500 cursor-not-allowed" />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">Ad Soyad</label>
              <input type="text" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} placeholder="Adın Soyadın"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-600 outline-none focus:border-violet-500/50 transition-all" />
            </div>
            {success && <p className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-2">{success}</p>}
            <button onClick={handleSave} disabled={saving}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-500 to-purple-600 text-white text-sm font-semibold rounded-xl px-5 py-2.5 transition-all disabled:opacity-50 active:scale-[0.98] shadow-lg shadow-violet-500/20">
              <Save className="w-3.5 h-3.5" />{saving ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
          </div>
        </div>

        {/* Sign out */}
        <button onClick={handleSignOut}
          className="w-full flex items-center justify-center gap-2 p-3 rounded-xl border border-zinc-800 text-red-400 hover:bg-red-500/5 hover:border-red-500/20 transition-all text-sm font-medium">
          <LogOut className="w-4 h-4" /> Çıkış Yap
        </button>
      </div>
    </div>
  )
}
