'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Ticket, ArrowLeft, User, Shield, Ban, Star, Search, GraduationCap, Store, UserCheck, ShieldCheck } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function AdminUsersPage() {
  const router = useRouter()
  const supabase = createClient()

  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterRole, setFilterRole] = useState<string>('all')
  const [filterCampus, setFilterCampus] = useState<string>('all')
  const [filterKyc, setFilterKyc] = useState<string>('all')

  useEffect(() => { loadData() }, [])

  const loadData = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/auth/login'); return }

    const { data } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })

    setUsers(data || [])
    setLoading(false)
  }

  const handleUpdateTrustScore = async (userId: string, newScore: number) => {
    const score = Math.max(0, Math.min(100, newScore))
    await supabase.from('profiles').update({ trust_score: score }).eq('id', userId)
    loadData()
  }

  const handleToggleBan = async (userId: string, currentBan: boolean) => {
    await supabase.from('profiles').update({ is_banned: !currentBan }).eq('id', userId)
    loadData()
  }

  const handleUpdateListingLimit = async (userId: string, limit: number) => {
    await supabase.from('profiles').update({ listing_limit: limit }).eq('id', userId)
    loadData()
  }

  const handleUpdateRole = async (userId: string, role: string) => {
    await supabase.from('profiles').update({ role }).eq('id', userId)
    loadData()
  }

  const filteredUsers = users.filter(u => {
    const matchesSearch = (u.full_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = filterRole === 'all' || u.role === filterRole
    const matchesCampus = filterCampus === 'all' ||
      (filterCampus === 'verified' && u.campus_verified) ||
      (filterCampus === 'unverified' && !u.campus_verified)
    const matchesKyc = filterKyc === 'all' || u.kyc_status === filterKyc
    return matchesSearch && matchesRole && matchesCampus && matchesKyc
  })

  const roleIcons: Record<string, any> = { buyer: UserCheck, seller: Store, admin: Shield }
  const roleColors: Record<string, string> = {
    buyer: 'text-blue-600 bg-blue-50',
    seller: 'text-orange-600 bg-orange-50',
    admin: 'text-red-600 bg-red-50',
  }
  const roleLabels: Record<string, string> = { buyer: 'Alıcı', seller: 'Satıcı', admin: 'Admin' }
  const kycColors: Record<string, string> = {
    pending: 'text-amber-600 bg-amber-50',
    approved: 'text-emerald-600 bg-emerald-50',
    rejected: 'text-red-600 bg-red-50',
  }
  const kycLabels: Record<string, string> = { pending: 'Bekliyor', approved: 'Onaylı', rejected: 'Reddedildi' }

  if (loading) return <div className="min-h-screen bg-white flex items-center justify-center"><p className="text-sm text-zinc-400">Yükleniyor...</p></div>

  return (
    <div className="min-h-screen bg-white">
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
        <Link href="/admin" className="inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-900 transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Admin Panel
        </Link>

        <h1 className="font-display text-[28px] font-bold tracking-tight mb-1">Kullanıcılar</h1>
        <p className="text-sm text-zinc-400 mb-6">{users.length} kayıtlı kullanıcı • {filteredUsers.length} gösteriliyor</p>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300" />
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="İsim veya e-posta ile ara..."
            className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-10 pr-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-300 outline-none focus:border-zinc-400 focus:bg-white transition-all" />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-zinc-400 font-medium">Rol:</span>
            {[{ v: 'all', l: 'Tümü' }, { v: 'buyer', l: 'Alıcı' }, { v: 'seller', l: 'Satıcı' }, { v: 'admin', l: 'Admin' }].map(f => (
              <button key={f.v} onClick={() => setFilterRole(f.v)}
                className={`text-[11px] font-medium px-2 py-1 rounded-md transition-colors ${filterRole === f.v ? 'bg-zinc-900 text-white' : 'bg-zinc-50 text-zinc-500 hover:bg-zinc-100'}`}>
                {f.l}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-zinc-400 font-medium">Kampüs:</span>
            {[{ v: 'all', l: 'Tümü' }, { v: 'verified', l: 'Doğrulanmış' }, { v: 'unverified', l: 'Doğrulanmamış' }].map(f => (
              <button key={f.v} onClick={() => setFilterCampus(f.v)}
                className={`text-[11px] font-medium px-2 py-1 rounded-md transition-colors ${filterCampus === f.v ? 'bg-zinc-900 text-white' : 'bg-zinc-50 text-zinc-500 hover:bg-zinc-100'}`}>
                {f.l}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-zinc-400 font-medium">KYC:</span>
            {[{ v: 'all', l: 'Tümü' }, { v: 'pending', l: 'Bekliyor' }, { v: 'approved', l: 'Onaylı' }, { v: 'rejected', l: 'Reddedildi' }].map(f => (
              <button key={f.v} onClick={() => setFilterKyc(f.v)}
                className={`text-[11px] font-medium px-2 py-1 rounded-md transition-colors ${filterKyc === f.v ? 'bg-zinc-900 text-white' : 'bg-zinc-50 text-zinc-500 hover:bg-zinc-100'}`}>
                {f.l}
              </button>
            ))}
          </div>
        </div>

        {/* Users list */}
        <div className="space-y-3">
          {filteredUsers.map((u) => {
            const RoleIcon = roleIcons[u.role] || User
            return (
              <div key={u.id} className={`p-4 rounded-xl border transition-all ${u.is_banned ? 'border-red-200 bg-red-50/30' : 'border-zinc-100'}`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-zinc-100 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-zinc-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-medium">{u.full_name || 'İsimsiz'}</p>
                        {/* Role badge */}
                        <span className={`flex items-center gap-0.5 text-[10px] font-medium px-1.5 py-0.5 rounded ${roleColors[u.role] || ''}`}>
                          <RoleIcon className="w-2.5 h-2.5" /> {roleLabels[u.role] || u.role}
                        </span>
                        {u.is_banned && <span className="text-[10px] font-medium text-red-600 bg-red-100 px-1.5 py-0.5 rounded">BANNED</span>}
                        {u.campus_verified && (
                          <span className="flex items-center gap-0.5 text-[10px] font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                            <GraduationCap className="w-2.5 h-2.5" /> {u.campus_name || 'Kampüs'}
                          </span>
                        )}
                        {u.trust_score >= 90 && (
                          <span className="flex items-center gap-0.5 text-[10px] font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                            <Star className="w-2.5 h-2.5" /> Güvenilir
                          </span>
                        )}
                        <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${kycColors[u.kyc_status] || ''}`}>
                          KYC: {kycLabels[u.kyc_status] || u.kyc_status}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400">{u.email}{u.phone ? ` • ${u.phone}` : ''}</p>
                    </div>
                  </div>
                  <p className="text-xs text-zinc-300">{new Date(u.created_at).toLocaleDateString('tr-TR')}</p>
                </div>

                {/* Stats row */}
                <div className="flex items-center gap-4 text-xs text-zinc-400 mb-3 ml-[52px]">
                  <span>Alım: {u.total_purchases}</span>
                  <span>Satış: {u.total_sales}</span>
                  <span>Limit: {u.listing_limit}</span>
                  {u.kvkk_accepted && <span className="text-emerald-500">KVKK ✓</span>}
                  {u.seller_agreement_accepted && <span className="text-emerald-500">Satıcı Söz. ✓</span>}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 ml-[52px]">
                  {/* Role */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] text-zinc-400">Rol:</span>
                    <select value={u.role} onChange={(e) => handleUpdateRole(u.id, e.target.value)}
                      className="bg-zinc-50 border border-zinc-200 rounded-lg px-2 py-1 text-xs outline-none focus:border-zinc-400 appearance-none">
                      <option value="buyer">Alıcı</option>
                      <option value="seller">Satıcı</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  {/* Trust Score */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] text-zinc-400">Trust:</span>
                    <input type="number" defaultValue={u.trust_score} min={0} max={100}
                      onBlur={(e) => handleUpdateTrustScore(u.id, parseInt(e.target.value))}
                      className="w-14 bg-zinc-50 border border-zinc-200 rounded-lg px-2 py-1 text-xs text-center outline-none focus:border-zinc-400" />
                  </div>
                  {/* Listing Limit */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] text-zinc-400">Limit:</span>
                    <select defaultValue={u.listing_limit} onChange={(e) => handleUpdateListingLimit(u.id, parseInt(e.target.value))}
                      className="bg-zinc-50 border border-zinc-200 rounded-lg px-2 py-1 text-xs outline-none focus:border-zinc-400 appearance-none">
                      {[1, 2, 3, 5, 10, 20, 50].map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                  </div>
                  {/* Ban toggle */}
                  <button onClick={() => handleToggleBan(u.id, u.is_banned)}
                    className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-1 rounded-lg transition-all ${
                      u.is_banned ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' : 'bg-red-50 text-red-600 hover:bg-red-100'
                    }`}>
                    <Ban className="w-3 h-3" /> {u.is_banned ? 'Unban' : 'Ban'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
