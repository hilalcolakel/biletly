'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Ticket, ArrowLeft, GraduationCap, Mail, KeyRound, Check, Loader2, ArrowRight, Building } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { CampusRule } from '@/types/database'

export default function CampusVerifyPage() {
  const router = useRouter()
  const supabase = createClient()

  const [method, setMethod] = useState<'email' | 'invite' | null>(null)
  const [campusRules, setCampusRules] = useState<CampusRule[]>([])
  const [selectedCampus, setSelectedCampus] = useState<string>('')
  const [campusEmail, setCampusEmail] = useState('')
  const [inviteCode, setInviteCode] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    const { data: { user: u } } = await supabase.auth.getUser()
    if (!u) { router.push('/auth/login'); return }
    setUser(u)

    const { data: p } = await supabase.from('profiles').select('*').eq('id', u.id).single()
    setProfile(p)

    if (p?.campus_verified) {
      router.push('/dashboard')
      return
    }

    const { data: rules } = await supabase
      .from('campus_rules')
      .select('*')
      .eq('is_active', true)
      .order('campus_name')

    setCampusRules(rules || [])
    setLoading(false)
  }

  const handleEmailVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    // Validate campus email domain
    const selectedRule = campusRules.find(r => r.id === selectedCampus)
    if (!selectedRule) {
      setError('Lütfen bir kampüs seçin.')
      setSubmitting(false)
      return
    }

    const emailDomain = campusEmail.split('@')[1]
    if (emailDomain !== selectedRule.email_domain) {
      setError(`Bu kampüs için @${selectedRule.email_domain} uzantılı bir e-posta gereklidir.`)
      setSubmitting(false)
      return
    }

    // Update profile with campus info
    const { error: updateError } = await supabase.from('profiles').update({
      campus_name: selectedRule.campus_name,
      campus_email: campusEmail,
    }).eq('id', user.id)

    if (updateError) {
      setError('Bir hata oluştu. Lütfen tekrar deneyin.')
      setSubmitting(false)
      return
    }

    // In a full implementation, send verification email to campus email
    // For MVP, we mark as verified after email domain check
    await supabase.from('profiles').update({
      campus_verified: true,
      campus_verified_at: new Date().toISOString(),
    }).eq('id', user.id)

    setSuccess(true)
    setSubmitting(false)
  }

  const handleInviteVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    // Find campus by invite code
    const matchingCampus = campusRules.find(r => r.invite_code === inviteCode.trim())
    if (!matchingCampus) {
      setError('Geçersiz davet kodu. Lütfen kontrol edip tekrar deneyin.')
      setSubmitting(false)
      return
    }

    // Update profile
    const { error: updateError } = await supabase.from('profiles').update({
      campus_name: matchingCampus.campus_name,
      campus_verified: true,
      campus_verified_at: new Date().toISOString(),
    }).eq('id', user.id)

    if (updateError) {
      setError('Bir hata oluştu. Lütfen tekrar deneyin.')
      setSubmitting(false)
      return
    }

    setSuccess(true)
    setSubmitting(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col">
        <div className="p-6">
          <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" /> Dashboard
          </Link>
        </div>
        <div className="flex-1 flex items-center justify-center px-6 pb-20">
          <div className="w-full max-w-[380px] text-center">
            <div className="w-16 h-16 bg-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <GraduationCap className="w-8 h-8 text-emerald-400" />
            </div>
            <h1 className="font-display text-[28px] font-bold tracking-tight text-white mb-2">
              Kampüs Doğrulandı!
            </h1>
            <p className="text-sm text-zinc-500 leading-relaxed mb-8">
              Kampüs topluluğuna başarıyla katıldın. Artık doğrulanmış üye olarak platformu kullanabilirsin.
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-500 to-purple-600 text-white text-sm font-semibold rounded-xl px-6 py-3 transition-all hover:from-violet-600 hover:to-purple-700 active:scale-[0.98] shadow-lg shadow-violet-500/20"
            >
              Dashboard'a Git <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      {/* Nav */}
      <nav className="sticky top-0 z-50 glass-dark">
        <div className="max-w-[980px] mx-auto px-6 h-12 flex items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Ticket className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-display text-[15px] font-bold tracking-tight text-white">biletly</span>
          </Link>
        </div>
      </nav>

      <div className="flex-1 flex items-center justify-center px-6 pb-12">
        <div className="w-full max-w-[420px]">
          <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-white transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" /> Dashboard
          </Link>

          <div className="flex items-center justify-center mb-6">
            <div className="w-14 h-14 bg-violet-500/10 rounded-2xl flex items-center justify-center">
              <GraduationCap className="w-7 h-7 text-violet-400" />
            </div>
          </div>
          <h1 className="font-display text-[26px] font-bold tracking-tight text-center text-white mb-1">
            Kampüs Doğrulama
          </h1>
          <p className="text-sm text-zinc-500 text-center mb-8">
            Kampüs topluluğuna katılmak için kimliğini doğrula.
          </p>

          {!method ? (
            <div className="space-y-3">
              <button
                onClick={() => setMethod('email')}
                className="w-full p-5 rounded-xl border border-zinc-800 bg-zinc-900 hover:border-violet-500/30 hover:bg-violet-500/5 text-left transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-violet-500/10 rounded-xl flex items-center justify-center">
                    <Mail className="w-5 h-5 text-violet-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">Kampüs E-postası ile Doğrula</p>
                    <p className="text-xs text-zinc-500 mt-1">
                      .edu.tr uzantılı e-posta adresinle kampüsünü doğrula.
                    </p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setMethod('invite')}
                className="w-full p-5 rounded-xl border border-zinc-800 bg-zinc-900 hover:border-violet-500/30 hover:bg-violet-500/5 text-left transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center">
                    <KeyRound className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">Davet Kodu ile Katıl</p>
                    <p className="text-xs text-zinc-500 mt-1">
                      Pilot topluluk davet kodunla kampüse katıl.
                    </p>
                  </div>
                </div>
              </button>

              <p className="text-[11px] text-zinc-600 text-center mt-4">
                Kampüs doğrulama isteğe bağlıdır. <Link href="/dashboard" className="text-zinc-400 hover:underline">Atla</Link>
              </p>
            </div>
          ) : method === 'email' ? (
            <form onSubmit={handleEmailVerify} className="space-y-4 animate-fade-in">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">Kampüs</label>
                <select
                  value={selectedCampus}
                  onChange={(e) => setSelectedCampus(e.target.value)}
                  required
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-violet-500/50 transition-all appearance-none"
                >
                  <option value="">Kampüsünü seç...</option>
                  {campusRules.map((rule) => (
                    <option key={rule.id} value={rule.id}>
                      {rule.campus_name} (@{rule.email_domain})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">Kampüs E-postası</label>
                <input
                  type="email"
                  value={campusEmail}
                  onChange={(e) => setCampusEmail(e.target.value)}
                  placeholder="isim@ogrenci.edu.tr"
                  required
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-600 outline-none focus:border-violet-500/50 transition-all"
                />
              </div>

              {error && (
                <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => { setMethod(null); setError('') }}
                  className="flex-1 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 text-sm font-medium rounded-xl px-4 py-3 transition-all"
                >
                  Geri
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-[2] bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 disabled:opacity-50 text-white text-sm font-semibold rounded-xl px-4 py-3 transition-all active:scale-[0.98] shadow-lg shadow-violet-500/20 flex items-center justify-center gap-2"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  Doğrula
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleInviteVerify} className="space-y-4 animate-fade-in">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">Davet Kodu</label>
                <input
                  type="text"
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                  placeholder="XXXX-XXXX"
                  required
                  maxLength={20}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-600 outline-none focus:border-violet-500/50 transition-all font-mono tracking-widest text-center text-lg"
                />
              </div>

              {error && (
                <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => { setMethod(null); setError('') }}
                  className="flex-1 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 text-sm font-medium rounded-xl px-4 py-3 transition-all"
                >
                  Geri
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-[2] bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 disabled:opacity-50 text-white text-sm font-semibold rounded-xl px-4 py-3 transition-all active:scale-[0.98] shadow-lg shadow-violet-500/20 flex items-center justify-center gap-2"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  Katıl
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
