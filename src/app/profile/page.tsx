'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Ticket, ArrowLeft, User, Shield, Star, TrendingUp, TrendingDown, LogOut, Save, ShoppingBag, Tag } from 'lucide-react'
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

  // Stats
  const [stats, setStats] = useState({ activeListing: 0, totalOrders: 0 })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    const { data: { user: currentUser } } = await supabase.auth.getUser()
    if (!currentUser) {
      router.push('/auth/login')
      return
    }
    setUser(currentUser)

    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', currentUser.id)
      .single()

    if (profileData) {
      setProfile(profileData)
      setForm({ full_name: profileData.full_name || '' })
    }

    // Active listings count
    const { count: listingCount } = await supabase
      .from('listings')
      .select('*', { count: 'exact', head: true })
      .eq('seller_id', currentUser.id)
      .eq('status', 'active')

    // Total orders (buy + sell)
    const { count: buyCount } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('buyer_id', currentUser.id)

    const { count: sellCount } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('seller_id', currentUser.id)

    setStats({
      activeListing: listingCount || 0,
      totalOrders: (buyCount || 0) + (sellCount || 0),
    })

    setLoading(false)
  }

  const handleSave = async () => {
    setSaving(true)
    setSuccess('')

    const { error } = await supabase
      .from('profiles')
      .update({ full_name: form.full_name })
      .eq('id', user.id)

    if (!error) {
      setSuccess('Profil güncellendi.')
      setProfile({ ...profile, full_name: form.full_name })
    }
    setSaving(false)
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-sm text-zinc-400">Yükleniyor...</p>
      </div>
    )
  }

  const trustScore = profile?.trust_score ?? 50
  const trustLevel = trustScore >= 90 ? 'Güvenilir' : trustScore >= 70 ? 'İyi' : trustScore >= 50 ? 'Orta' : 'Düşük'
  const trustColor = trustScore >= 90 ? 'text-emerald-600' : trustScore >= 70 ? 'text-blue-600' : trustScore >= 50 ? 'text-amber-600' : 'text-red-500'

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-zinc-100">
        <div className="max-w-[980px] mx-auto px-6 h-12 flex items-center">
          <Link href="/" className="flex items-center gap-1.5">
            <Ticket className="w-[18px] h-[18px] text-zinc-900" strokeWidth={2.2} />
            <span className="font-display text-[15px] font-semibold tracking-tight">biletly</span>
          </Link>
        </div>
      </nav>

      <div className="max-w-[580px] mx-auto px-6 py-12">
        <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-900 transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" />
          Dashboard
        </Link>

        <h1 className="font-display text-[28px] font-bold tracking-tight mb-1">Profil</h1>
        <p className="text-sm text-zinc-400 mb-10">Hesap bilgilerini ve güven puanını görüntüle.</p>

        {/* Trust Score Card */}
        <div className="p-6 rounded-2xl bg-zinc-50 border border-zinc-100 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs text-zinc-400 uppercase tracking-wider font-medium mb-1">Trust Score</p>
              <div className="flex items-end gap-2">
                <span className="font-display text-4xl font-bold tracking-tight">{trustScore}</span>
                <span className="text-sm text-zinc-400 mb-1">/ 100</span>
              </div>
            </div>
            <div className={`flex items-center gap-1 text-sm font-medium ${trustColor}`}>
              {trustScore >= 70 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              {trustLevel}
            </div>
          </div>
          <div className="w-full bg-zinc-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${
                trustScore >= 90 ? 'bg-emerald-500' : trustScore >= 70 ? 'bg-blue-500' : trustScore >= 50 ? 'bg-amber-500' : 'bg-red-500'
              }`}
              style={{ width: `${trustScore}%` }}
            />
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-[10px] text-zinc-400">0</span>
            <span className="text-[10px] text-zinc-400">PDF/QR izni: 90+</span>
            <span className="text-[10px] text-zinc-400">100</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-100 text-center">
            <ShoppingBag className="w-4 h-4 text-zinc-400 mx-auto mb-2" />
            <p className="font-display text-xl font-bold">{profile?.total_purchases || 0}</p>
            <p className="text-[11px] text-zinc-400">Alım</p>
          </div>
          <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-100 text-center">
            <Tag className="w-4 h-4 text-zinc-400 mx-auto mb-2" />
            <p className="font-display text-xl font-bold">{profile?.total_sales || 0}</p>
            <p className="text-[11px] text-zinc-400">Satış</p>
          </div>
          <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-100 text-center">
            <Ticket className="w-4 h-4 text-zinc-400 mx-auto mb-2" />
            <p className="font-display text-xl font-bold">{stats.activeListing}</p>
            <p className="text-[11px] text-zinc-400">Aktif İlan</p>
          </div>
        </div>

        {/* Profile Form */}
        <div className="mb-8">
          <h2 className="font-display text-lg font-semibold mb-4">Hesap Bilgileri</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-zinc-500 mb-1.5">E-posta</label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full bg-zinc-100 border border-zinc-200 rounded-xl px-4 py-3 text-sm text-zinc-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-500 mb-1.5">Ad Soyad</label>
              <input
                type="text"
                value={form.full_name}
                onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                placeholder="Adın Soyadın"
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-300 outline-none focus:border-zinc-400 focus:bg-white transition-all"
              />
            </div>

            {success && (
              <p className="text-xs text-emerald-600 bg-emerald-50 rounded-lg px-3 py-2">{success}</p>
            )}

            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-2 bg-zinc-900 hover:bg-black text-white text-sm font-medium rounded-xl px-5 py-2.5 transition-all disabled:opacity-50 active:scale-[0.98]"
            >
              <Save className="w-3.5 h-3.5" />
              {saving ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
          </div>
        </div>

        {/* Account info */}
        <div className="mb-8">
          <h2 className="font-display text-lg font-semibold mb-4">Hesap</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between py-2 border-b border-zinc-50">
              <span className="text-zinc-400">Üyelik tarihi</span>
              <span className="font-medium">{new Date(profile?.created_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-zinc-50">
              <span className="text-zinc-400">Doğrulama</span>
              <span className={`font-medium ${profile?.is_verified ? 'text-emerald-600' : 'text-zinc-400'}`}>
                {profile?.is_verified ? 'Doğrulanmış' : 'Doğrulanmamış'}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-zinc-50">
              <span className="text-zinc-400">İlan limiti</span>
              <span className="font-medium">{profile?.listing_limit || 5}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-zinc-400">PDF/QR yetkisi</span>
              <span className={`font-medium ${trustScore >= 90 ? 'text-emerald-600' : 'text-zinc-400'}`}>
                {trustScore >= 90 ? 'Aktif' : `Trust ≥ 90 gerekli (şu an: ${trustScore})`}
              </span>
            </div>
          </div>
        </div>

        {/* Sign out */}
        <button
          onClick={handleSignOut}
          className="inline-flex items-center gap-2 text-sm text-red-500 hover:text-red-600 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Çıkış Yap
        </button>
      </div>
    </div>
  )
}
