'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Ticket, ArrowLeft, User, Shield, Ban, Star, Search, ChevronDown } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function AdminUsersPage() {
  const router = useRouter()
  const supabase = createClient()

  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    loadData()
  }, [])

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

  const filteredUsers = users.filter(u =>
    (u.full_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-sm text-zinc-400">Yükleniyor...</p>
      </div>
    )
  }

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
          <ArrowLeft className="w-4 h-4" />
          Admin Panel
        </Link>

        <h1 className="font-display text-[28px] font-bold tracking-tight mb-1">Kullanıcılar</h1>
        <p className="text-sm text-zinc-400 mb-8">{users.length} kayıtlı kullanıcı</p>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="İsim veya e-posta ile ara..."
            className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-10 pr-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-300 outline-none focus:border-zinc-400 focus:bg-white transition-all"
          />
        </div>

        {/* Users list */}
        <div className="space-y-3">
          {filteredUsers.map((u) => (
            <div key={u.id} className={`p-4 rounded-xl border transition-all ${u.is_banned ? 'border-red-200 bg-red-50/30' : 'border-zinc-100'}`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-zinc-100 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-zinc-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{u.full_name || 'İsimsiz'}</p>
                      {u.is_banned && (
                        <span className="text-[10px] font-medium text-red-600 bg-red-100 px-1.5 py-0.5 rounded">BANNED</span>
                      )}
                      {u.trust_score >= 90 && (
                        <span className="text-[10px] font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                          <Star className="w-2.5 h-2.5" /> Güvenilir
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-400">{u.email}</p>
                  </div>
                </div>
                <p className="text-xs text-zinc-300">
                  {new Date(u.created_at).toLocaleDateString('tr-TR')}
                </p>
              </div>

              {/* Stats row */}
              <div className="flex items-center gap-4 text-xs text-zinc-400 mb-3 ml-[52px]">
                <span>Alım: {u.total_purchases}</span>
                <span>Satış: {u.total_sales}</span>
                <span>Limit: {u.listing_limit}</span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 ml-[52px]">
                {/* Trust Score */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] text-zinc-400">Trust:</span>
                  <input
                    type="number"
                    defaultValue={u.trust_score}
                    min={0}
                    max={100}
                    onBlur={(e) => handleUpdateTrustScore(u.id, parseInt(e.target.value))}
                    className="w-14 bg-zinc-50 border border-zinc-200 rounded-lg px-2 py-1 text-xs text-center outline-none focus:border-zinc-400"
                  />
                </div>

                {/* Listing Limit */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] text-zinc-400">Limit:</span>
                  <select
                    defaultValue={u.listing_limit}
                    onChange={(e) => handleUpdateListingLimit(u.id, parseInt(e.target.value))}
                    className="bg-zinc-50 border border-zinc-200 rounded-lg px-2 py-1 text-xs outline-none focus:border-zinc-400 appearance-none"
                  >
                    {[1, 2, 3, 5, 10, 20, 50].map(n => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </div>

                {/* Ban toggle */}
                <button
                  onClick={() => handleToggleBan(u.id, u.is_banned)}
                  className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-1 rounded-lg transition-all ${
                    u.is_banned
                      ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                      : 'bg-red-50 text-red-600 hover:bg-red-100'
                  }`}
                >
                  <Ban className="w-3 h-3" />
                  {u.is_banned ? 'Unban' : 'Ban'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
