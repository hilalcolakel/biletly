'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Ticket, ArrowLeft, Eye, EyeOff, Check, ChevronRight, ShieldCheck, UserCheck, Store, ArrowRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import LegalModal from '../components/LegalModal'

type Step = 'credentials' | 'kvkk' | 'role'

export default function RegisterPage() {
  const router = useRouter()
  const supabase = createClient()

  // Step management
  const [currentStep, setCurrentStep] = useState<Step>('credentials')

  // Credentials
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  // KVKK
  const [kvkkAccepted, setKvkkAccepted] = useState(false)
  const [kvkkVersion, setKvkkVersion] = useState('')
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [termsVersion, setTermsVersion] = useState('')
  const [showLegalModal, setShowLegalModal] = useState<'kvkk' | 'terms' | 'seller_agreement' | null>(null)

  // Role
  const [selectedRole, setSelectedRole] = useState<'buyer' | 'seller'>('buyer')
  const [sellerAgreementAccepted, setSellerAgreementAccepted] = useState(false)
  const [sellerAgreementVersion, setSellerAgreementVersion] = useState('')

  // State
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  // Password validation
  const checks = {
    length: password.length >= 8,
    letter: /[a-zA-Z]/.test(password),
    number: /[0-9]/.test(password),
  }
  const isPasswordValid = checks.length && checks.letter && checks.number

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
  }

  const handleCredentialsNext = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!fullName.trim()) { setError('Lütfen adınızı ve soyadınızı girin.'); return }
    if (!email.trim()) { setError('Lütfen e-posta adresinizi girin.'); return }
    if (!isPasswordValid) { setError('Şifre gereksinimlerini karşılamıyor.'); return }
    setCurrentStep('kvkk')
  }

  const handleKvkkNext = () => {
    setError('')
    if (!kvkkAccepted) { setError('KVKK aydınlatma metnini onaylamanız gerekiyor.'); return }
    if (!termsAccepted) { setError('Kullanım koşullarını kabul etmeniz gerekiyor.'); return }
    setCurrentStep('role')
  }

  const handleRegister = async () => {
    setError('')
    if (selectedRole === 'seller' && !sellerAgreementAccepted) {
      setError('Satıcı sözleşmesini kabul etmeniz gerekiyor.')
      return
    }
    setLoading(true)

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (signUpError) {
      setError(
        signUpError.message === 'User already registered'
          ? 'Bu e-posta zaten kayıtlı.'
          : signUpError.message
      )
      setLoading(false)
      return
    }

    // Update profile with additional fields
    if (data.user) {
      await supabase.from('profiles').update({
        role: selectedRole,
        kvkk_accepted: true,
        kvkk_accepted_at: new Date().toISOString(),
        kvkk_version: kvkkVersion,
        seller_agreement_accepted: selectedRole === 'seller' ? true : false,
        seller_agreement_version: selectedRole === 'seller' ? sellerAgreementVersion : null,
      }).eq('id', data.user.id)
    }

    setSuccess(true)
    setLoading(false)
  }

  const stepIndex = currentStep === 'credentials' ? 0 : currentStep === 'kvkk' ? 1 : 2
  const steps = [
    { key: 'credentials', label: 'Bilgiler' },
    { key: 'kvkk', label: 'Sözleşmeler' },
    { key: 'role', label: 'Rol Seçimi' },
  ]

  // Success Screen
  if (success) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col">
        <div className="p-6">
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" /> Ana Sayfa
          </Link>
        </div>
        <div className="flex-1 flex items-center justify-center px-6 pb-20">
          <div className="w-full max-w-[380px] text-center">
            <div className="w-16 h-16 bg-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Check className="w-8 h-8 text-emerald-400" />
            </div>
            <h1 className="font-display text-[28px] font-bold tracking-tight text-white mb-2">
              E-postanı kontrol et
            </h1>
            <p className="text-sm text-zinc-500 leading-relaxed mb-2">
              <span className="text-white font-medium">{email}</span> adresine doğrulama bağlantısı gönderdik.
            </p>
            <p className="text-xs text-zinc-600 mb-8">
              Bağlantıya tıklayarak hesabını aktifleştir ve {selectedRole === 'seller' ? 'satışa' : 'alışverişe'} başla.
            </p>
            <Link
              href="/auth/login"
              className="inline-flex items-center gap-2 text-sm text-violet-400 font-medium hover:underline"
            >
              Giriş sayfasına dön <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      <div className="p-6">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" /> Ana Sayfa
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 pb-12">
        <div className="w-full max-w-[400px]">
          {/* Logo */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Ticket className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-display text-lg font-bold tracking-tight text-white">biletly</span>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {steps.map((step, i) => (
              <div key={step.key} className="flex items-center gap-2">
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  i < stepIndex
                    ? 'bg-emerald-500/10 text-emerald-400'
                    : i === stepIndex
                    ? 'bg-violet-500/10 text-violet-400 ring-1 ring-violet-500/30'
                    : 'bg-zinc-900 text-zinc-600'
                }`}>
                  {i < stepIndex ? (
                    <Check className="w-3 h-3" />
                  ) : (
                    <span className="w-4 text-center">{i + 1}</span>
                  )}
                  <span className="hidden sm:inline">{step.label}</span>
                </div>
                {i < steps.length - 1 && (
                  <ChevronRight className="w-3 h-3 text-zinc-700" />
                )}
              </div>
            ))}
          </div>

          {/* Step 1: Credentials */}
          {currentStep === 'credentials' && (
            <div className="animate-fade-in">
              <h1 className="font-display text-[26px] font-bold tracking-tight text-center text-white mb-1">
                Kayıt Ol
              </h1>
              <p className="text-sm text-zinc-500 text-center mb-8">
                Hemen hesap oluştur, bilet alıp satmaya başla.
              </p>

              <button
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center gap-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-sm font-medium text-zinc-300 rounded-xl px-4 py-3 transition-colors mb-6"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Google ile devam et
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div className="flex-1 h-px bg-zinc-800" />
                <span className="text-xs text-zinc-600">veya</span>
                <div className="flex-1 h-px bg-zinc-800" />
              </div>

              <form onSubmit={handleCredentialsNext} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">Ad Soyad</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Adın Soyadın"
                    required
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-600 outline-none focus:border-violet-500/50 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">E-posta</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ornek@email.com"
                    required
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-600 outline-none focus:border-violet-500/50 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">Şifre</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 pr-10 text-sm text-white placeholder:text-zinc-600 outline-none focus:border-violet-500/50 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {password.length > 0 && (
                    <div className="mt-2.5 space-y-1">
                      {[
                        { key: 'length', label: 'En az 8 karakter' },
                        { key: 'letter', label: 'Bir harf içermeli' },
                        { key: 'number', label: 'Bir rakam içermeli' },
                      ].map((c) => (
                        <div key={c.key} className="flex items-center gap-2">
                          <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${checks[c.key as keyof typeof checks] ? 'bg-emerald-500' : 'bg-zinc-700'}`}>
                            {checks[c.key as keyof typeof checks] && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
                          </div>
                          <span className={`text-xs ${checks[c.key as keyof typeof checks] ? 'text-emerald-400' : 'text-zinc-600'}`}>
                            {c.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {error && (
                  <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white text-sm font-semibold rounded-xl px-4 py-3 transition-all active:scale-[0.98] shadow-lg shadow-violet-500/20 flex items-center justify-center gap-2"
                >
                  Devam Et <ChevronRight className="w-4 h-4" />
                </button>
              </form>

              <p className="text-center text-sm text-zinc-500 mt-8">
                Zaten hesabın var mı?{' '}
                <Link href="/auth/login" className="text-violet-400 font-medium hover:underline">
                  Giriş Yap
                </Link>
              </p>
            </div>
          )}

          {/* Step 2: KVKK & Terms */}
          {currentStep === 'kvkk' && (
            <div className="animate-fade-in">
              <h1 className="font-display text-[26px] font-bold tracking-tight text-center text-white mb-1">
                Sözleşmeler
              </h1>
              <p className="text-sm text-zinc-500 text-center mb-8">
                Devam etmek için aşağıdaki metinleri okuyup onaylaman gerekiyor.
              </p>

              <div className="space-y-3 mb-6">
                {/* KVKK */}
                <div className={`p-4 rounded-xl border transition-all ${kvkkAccepted ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-zinc-800 bg-zinc-900'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${kvkkAccepted ? 'bg-emerald-500/20' : 'bg-zinc-800'}`}>
                        <ShieldCheck className={`w-4 h-4 ${kvkkAccepted ? 'text-emerald-400' : 'text-zinc-500'}`} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">KVKK Aydınlatma Metni</p>
                        <p className="text-[11px] text-zinc-600">Kişisel verilerin korunması hakkında</p>
                      </div>
                    </div>
                    {kvkkAccepted ? (
                      <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full flex items-center gap-1">
                        <Check className="w-3 h-3" /> Onaylandı
                      </span>
                    ) : (
                      <button
                        onClick={() => setShowLegalModal('kvkk')}
                        className="text-xs font-medium text-violet-400 hover:text-violet-300 transition-colors"
                      >
                        Oku ve Onayla →
                      </button>
                    )}
                  </div>
                </div>

                {/* Terms */}
                <div className={`p-4 rounded-xl border transition-all ${termsAccepted ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-zinc-800 bg-zinc-900'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${termsAccepted ? 'bg-emerald-500/20' : 'bg-zinc-800'}`}>
                        <ShieldCheck className={`w-4 h-4 ${termsAccepted ? 'text-emerald-400' : 'text-zinc-500'}`} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">Kullanım Koşulları</p>
                        <p className="text-[11px] text-zinc-600">Platform kullanım kuralları</p>
                      </div>
                    </div>
                    {termsAccepted ? (
                      <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full flex items-center gap-1">
                        <Check className="w-3 h-3" /> Onaylandı
                      </span>
                    ) : (
                      <button
                        onClick={() => setShowLegalModal('terms')}
                        className="text-xs font-medium text-violet-400 hover:text-violet-300 transition-colors"
                      >
                        Oku ve Onayla →
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {error && (
                <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2 mb-4">
                  {error}
                </p>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => { setCurrentStep('credentials'); setError('') }}
                  className="flex-1 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 text-sm font-medium rounded-xl px-4 py-3 transition-all"
                >
                  Geri
                </button>
                <button
                  onClick={handleKvkkNext}
                  disabled={!kvkkAccepted || !termsAccepted}
                  className="flex-[2] bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl px-4 py-3 transition-all active:scale-[0.98] shadow-lg shadow-violet-500/20 flex items-center justify-center gap-2"
                >
                  Devam Et <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Role Selection */}
          {currentStep === 'role' && (
            <div className="animate-fade-in">
              <h1 className="font-display text-[26px] font-bold tracking-tight text-center text-white mb-1">
                Nasıl kullanmak istersin?
              </h1>
              <p className="text-sm text-zinc-500 text-center mb-8">
                Daha sonra istediğin zaman değiştirebilirsin.
              </p>

              <div className="space-y-3 mb-6">
                {/* Buyer */}
                <button
                  onClick={() => setSelectedRole('buyer')}
                  className={`w-full p-5 rounded-xl border text-left transition-all ${
                    selectedRole === 'buyer'
                      ? 'border-violet-500/50 bg-violet-500/5 ring-1 ring-violet-500/20'
                      : 'border-zinc-800 bg-zinc-900 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      selectedRole === 'buyer' ? 'bg-violet-500/20' : 'bg-zinc-800'
                    }`}>
                      <UserCheck className={`w-5 h-5 ${selectedRole === 'buyer' ? 'text-violet-400' : 'text-zinc-500'}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-white">Bilet Almak İstiyorum</p>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          selectedRole === 'buyer' ? 'border-violet-500 bg-violet-500' : 'border-zinc-700'
                        }`}>
                          {selectedRole === 'buyer' && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                        </div>
                      </div>
                      <p className="text-xs text-zinc-500 mt-1">
                        Etkinlikleri keşfet, bilet bul ve güvenle satın al.
                      </p>
                    </div>
                  </div>
                </button>

                {/* Seller */}
                <button
                  onClick={() => setSelectedRole('seller')}
                  className={`w-full p-5 rounded-xl border text-left transition-all ${
                    selectedRole === 'seller'
                      ? 'border-violet-500/50 bg-violet-500/5 ring-1 ring-violet-500/20'
                      : 'border-zinc-800 bg-zinc-900 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      selectedRole === 'seller' ? 'bg-violet-500/20' : 'bg-zinc-800'
                    }`}>
                      <Store className={`w-5 h-5 ${selectedRole === 'seller' ? 'text-violet-400' : 'text-zinc-500'}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-white">Bilet Satmak İstiyorum</p>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          selectedRole === 'seller' ? 'border-violet-500 bg-violet-500' : 'border-zinc-700'
                        }`}>
                          {selectedRole === 'seller' && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                        </div>
                      </div>
                      <p className="text-xs text-zinc-500 mt-1">
                        Biletlerini satışa çıkar ve emanet ödeme ile güvenle kazan.
                      </p>
                    </div>
                  </div>
                </button>
              </div>

              {/* Seller Agreement (only if seller selected) */}
              {selectedRole === 'seller' && (
                <div className={`p-4 rounded-xl border mb-4 transition-all ${
                  sellerAgreementAccepted ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-amber-500/30 bg-amber-500/5'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        sellerAgreementAccepted ? 'bg-emerald-500/20' : 'bg-amber-500/20'
                      }`}>
                        <ShieldCheck className={`w-4 h-4 ${sellerAgreementAccepted ? 'text-emerald-400' : 'text-amber-400'}`} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">Satıcı Sözleşmesi</p>
                        <p className="text-[11px] text-zinc-600">Satıcı olarak kabul etmeniz gerekir</p>
                      </div>
                    </div>
                    {sellerAgreementAccepted ? (
                      <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full flex items-center gap-1">
                        <Check className="w-3 h-3" /> Onaylandı
                      </span>
                    ) : (
                      <button
                        onClick={() => setShowLegalModal('seller_agreement')}
                        className="text-xs font-medium text-amber-400 hover:text-amber-300 transition-colors"
                      >
                        Oku ve Onayla →
                      </button>
                    )}
                  </div>
                </div>
              )}

              {error && (
                <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2 mb-4">
                  {error}
                </p>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => { setCurrentStep('kvkk'); setError('') }}
                  className="flex-1 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 text-sm font-medium rounded-xl px-4 py-3 transition-all"
                >
                  Geri
                </button>
                <button
                  onClick={handleRegister}
                  disabled={loading || (selectedRole === 'seller' && !sellerAgreementAccepted)}
                  className="flex-[2] bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl px-4 py-3 transition-all active:scale-[0.98] shadow-lg shadow-violet-500/20 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Hesap oluşturuluyor...
                    </>
                  ) : (
                    <>Hesap Oluştur</>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Legal Modal */}
      <LegalModal
        isOpen={showLegalModal !== null}
        onClose={() => setShowLegalModal(null)}
        type={showLegalModal || 'kvkk'}
        onAccept={(version) => {
          if (showLegalModal === 'kvkk') {
            setKvkkAccepted(true)
            setKvkkVersion(version)
          } else if (showLegalModal === 'terms') {
            setTermsAccepted(true)
            setTermsVersion(version)
          } else if (showLegalModal === 'seller_agreement') {
            setSellerAgreementAccepted(true)
            setSellerAgreementVersion(version)
          }
          setShowLegalModal(null)
        }}
      />
    </div>
  )
}
