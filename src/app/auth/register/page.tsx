'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Ticket, ArrowLeft, Eye, EyeOff, Check } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function RegisterPage() {
  const router = useRouter()
  const supabase = createClient()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const checks = { length: password.length >= 8, letter: /[a-zA-Z]/.test(password), number: /[0-9]/.test(password) }
  const isValid = checks.length && checks.letter && checks.number

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault(); setError('')
    if (!isValid) { setError('Şifre gereksinimlerini karşılamıyor.'); return }
    setLoading(true)
    const { error } = await supabase.auth.signUp({ email, password, options: { data: { full_name: fullName }, emailRedirectTo: `${window.location.origin}/auth/callback` } })
    if (error) { setError(error.message === 'User already registered' ? 'Bu e-posta zaten kayıtlı.' : error.message); setLoading(false); return }
    setSuccess(true); setLoading(false)
  }

  const handleGoogle = async () => {
    await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: `${window.location.origin}/auth/callback` } })
  }

  if (success) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col">
        <div className="p-6"><Link href="/" className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-white transition-colors"><ArrowLeft className="w-4 h-4" /> Ana Sayfa</Link></div>
        <div className="flex-1 flex items-center justify-center px-6 pb-20">
          <div className="w-full max-w-[340px] text-center">
            <div className="w-14 h-14 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6"><Check className="w-7 h-7 text-emerald-400" /></div>
            <h1 className="font-display text-[28px] font-bold tracking-tight text-white mb-2">E-postanı kontrol et</h1>
            <p className="text-sm text-zinc-500 leading-relaxed mb-8"><span className="text-white font-medium">{email}</span> adresine doğrulama bağlantısı gönderdik.</p>
            <Link href="/auth/login" className="text-sm text-violet-400 font-medium hover:underline">Giriş sayfasına dön</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      <div className="p-6"><Link href="/" className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-white transition-colors"><ArrowLeft className="w-4 h-4" /> Ana Sayfa</Link></div>
      <div className="flex-1 flex items-center justify-center px-6 pb-20">
        <div className="w-full max-w-[340px]">
          <div className="flex items-center justify-center gap-2 mb-10">
            <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Ticket className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-display text-lg font-bold tracking-tight text-white">biletly</span>
          </div>
          <h1 className="font-display text-[28px] font-bold tracking-tight text-center text-white mb-1">Kayıt Ol</h1>
          <p className="text-sm text-zinc-500 text-center mb-8">Hemen hesap oluştur, bilet alıp satmaya başla.</p>

          <button onClick={handleGoogle}
            className="w-full flex items-center justify-center gap-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-sm font-medium text-zinc-300 rounded-xl px-4 py-3 transition-colors mb-6">
            <svg className="w-4 h-4" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            Google ile devam et
          </button>

          <div className="flex items-center gap-3 mb-6"><div className="flex-1 h-px bg-zinc-800"/><span className="text-xs text-zinc-600">veya</span><div className="flex-1 h-px bg-zinc-800"/></div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">Ad Soyad</label>
              <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Adın Soyadın" required
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-600 outline-none focus:border-violet-500/50 transition-all" />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">E-posta</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="ornek@email.com" required
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-600 outline-none focus:border-violet-500/50 transition-all" />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">Şifre</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 pr-10 text-sm text-white placeholder:text-zinc-600 outline-none focus:border-violet-500/50 transition-all" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400 transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {password.length > 0 && (
                <div className="mt-2.5 space-y-1">
                  {[{ key: 'length', label: 'En az 8 karakter' }, { key: 'letter', label: 'Bir harf içermeli' }, { key: 'number', label: 'Bir rakam içermeli' }].map((c) => (
                    <div key={c.key} className="flex items-center gap-2">
                      <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${checks[c.key as keyof typeof checks] ? 'bg-emerald-500' : 'bg-zinc-700'}`}>
                        {checks[c.key as keyof typeof checks] && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
                      </div>
                      <span className={`text-xs ${checks[c.key as keyof typeof checks] ? 'text-emerald-400' : 'text-zinc-600'}`}>{c.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {error && <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</p>}
            <button type="submit" disabled={loading}
              className="w-full bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white text-sm font-semibold rounded-xl px-4 py-3 transition-all disabled:opacity-50 active:scale-[0.98] shadow-lg shadow-violet-500/20">
              {loading ? 'Hesap oluşturuluyor...' : 'Kayıt Ol'}
            </button>
          </form>
          <p className="text-[11px] text-zinc-600 text-center mt-4 leading-relaxed">
            Kayıt olarak <Link href="#" className="text-zinc-400 hover:underline">Kullanım Koşulları</Link> ve <Link href="#" className="text-zinc-400 hover:underline">Gizlilik Politikası</Link>&apos;nı kabul edersin.
          </p>
          <p className="text-center text-sm text-zinc-500 mt-8">Zaten hesabın var mı? <Link href="/auth/login" className="text-violet-400 font-medium hover:underline">Giriş Yap</Link></p>
        </div>
      </div>
    </div>
  )
}
