'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Ticket, ArrowLeft, ShieldCheck, Check, X, Eye, Search, FileText, User, Clock } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function AdminKycPage() {
  const router = useRouter()
  const supabase = createClient()

  const [submissions, setSubmissions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState<string>('pending')
  const [reviewNote, setReviewNote] = useState('')
  const [reviewingId, setReviewingId] = useState<string | null>(null)
  const [viewingDoc, setViewingDoc] = useState<string | null>(null)

  useEffect(() => { loadData() }, [filterStatus])

  const loadData = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/auth/login'); return }

    let query = supabase
      .from('kyc_submissions')
      .select('*, user:profiles(*)')
      .order('created_at', { ascending: false })

    if (filterStatus !== 'all') {
      query = query.eq('status', filterStatus)
    }

    const { data } = await query
    setSubmissions(data || [])
    setLoading(false)
  }

  const handleReview = async (id: string, userId: string, status: 'approved' | 'rejected') => {
    const { data: { user } } = await supabase.auth.getUser()

    await supabase.from('kyc_submissions').update({
      status,
      reviewed_by: user?.id,
      review_note: reviewNote,
      reviewed_at: new Date().toISOString(),
    }).eq('id', id)

    // Update user's KYC status
    await supabase.from('profiles').update({
      kyc_status: status,
      is_verified: status === 'approved',
    }).eq('id', userId)

    setReviewingId(null)
    setReviewNote('')
    loadData()
  }

  const docTypeLabels: Record<string, string> = {
    id_card: 'Kimlik Kartı',
    passport: 'Pasaport',
    driver_license: 'Ehliyet',
    student_id: 'Öğrenci Belgesi',
  }

  const statusLabels: Record<string, { label: string, color: string }> = {
    pending: { label: 'Bekliyor', color: 'text-amber-600 bg-amber-50' },
    approved: { label: 'Onaylı', color: 'text-emerald-600 bg-emerald-50' },
    rejected: { label: 'Reddedildi', color: 'text-red-600 bg-red-50' },
  }

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

        <h1 className="font-display text-[28px] font-bold tracking-tight flex items-center gap-3 mb-1">
          <ShieldCheck className="w-7 h-7 text-violet-500" /> KYC İncelemeleri
        </h1>
        <p className="text-sm text-zinc-400 mb-8">{submissions.length} başvuru</p>

        {/* Filters */}
        <div className="flex gap-2 mb-6">
          {[
            { value: 'pending', label: 'Bekleyenler' },
            { value: 'approved', label: 'Onaylananlar' },
            { value: 'rejected', label: 'Reddedilenler' },
            { value: 'all', label: 'Tümü' },
          ].map((f) => (
            <button key={f.value} onClick={() => setFilterStatus(f.value)}
              className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${
                filterStatus === f.value ? 'bg-zinc-900 text-white' : 'bg-zinc-50 text-zinc-500 hover:bg-zinc-100'
              }`}>
              {f.label}
            </button>
          ))}
        </div>

        {/* Submissions List */}
        <div className="space-y-3">
          {submissions.map((sub) => (
            <div key={sub.id} className="p-4 rounded-xl border border-zinc-100">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-zinc-100 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-zinc-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{sub.user?.full_name || 'İsimsiz'}</p>
                    <p className="text-xs text-zinc-400">{sub.user?.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[11px] font-medium px-2 py-0.5 rounded ${statusLabels[sub.status]?.color || ''}`}>
                    {statusLabels[sub.status]?.label}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs text-zinc-400 mb-3 ml-[52px]">
                <span className="flex items-center gap-1">
                  <FileText className="w-3 h-3" /> {docTypeLabels[sub.document_type] || sub.document_type}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {new Date(sub.created_at).toLocaleDateString('tr-TR')}
                </span>
                {sub.review_note && (
                  <span className="text-zinc-300">Not: {sub.review_note}</span>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 ml-[52px]">
                {sub.document_url && (
                  <a href={sub.document_url} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-medium bg-zinc-50 text-zinc-600 hover:bg-zinc-100 px-2 py-1 rounded-lg transition-colors">
                    <Eye className="w-3 h-3" /> Belge Görüntüle
                  </a>
                )}

                {sub.status === 'pending' && (
                  <>
                    {reviewingId === sub.id ? (
                      <div className="flex items-center gap-2">
                        <input type="text" value={reviewNote} onChange={(e) => setReviewNote(e.target.value)}
                          placeholder="Not ekle (isteğe bağlı)"
                          className="bg-zinc-50 border border-zinc-200 rounded-lg px-2 py-1 text-xs w-48 outline-none focus:border-zinc-400" />
                        <button onClick={() => handleReview(sub.id, sub.user_id, 'approved')}
                          className="inline-flex items-center gap-1 text-[11px] font-medium bg-emerald-50 text-emerald-600 hover:bg-emerald-100 px-2 py-1 rounded-lg transition-colors">
                          <Check className="w-3 h-3" /> Onayla
                        </button>
                        <button onClick={() => handleReview(sub.id, sub.user_id, 'rejected')}
                          className="inline-flex items-center gap-1 text-[11px] font-medium bg-red-50 text-red-600 hover:bg-red-100 px-2 py-1 rounded-lg transition-colors">
                          <X className="w-3 h-3" /> Reddet
                        </button>
                        <button onClick={() => { setReviewingId(null); setReviewNote('') }}
                          className="text-zinc-400 hover:text-zinc-600 text-[11px]">İptal</button>
                      </div>
                    ) : (
                      <button onClick={() => setReviewingId(sub.id)}
                        className="inline-flex items-center gap-1 text-[11px] font-medium bg-violet-50 text-violet-600 hover:bg-violet-100 px-2 py-1 rounded-lg transition-colors">
                        <ShieldCheck className="w-3 h-3" /> İncele
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}

          {submissions.length === 0 && (
            <div className="text-center py-12">
              <ShieldCheck className="w-8 h-8 text-zinc-200 mx-auto mb-3" />
              <p className="text-sm text-zinc-400">
                {filterStatus === 'pending' ? 'Bekleyen KYC başvurusu yok.' : 'Başvuru bulunamadı.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
