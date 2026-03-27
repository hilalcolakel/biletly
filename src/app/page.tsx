'use client'

import Link from 'next/link'
import dynamic from 'next/dynamic'
import { Shield, ArrowRight, Ticket, Zap, Lock, Star, BadgeCheck, Search, Banknote, Users, Sparkles } from 'lucide-react'

const LiquidEther = dynamic(() => import('@/components/LiquidEther'), { ssr: false })

function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div className="max-w-[1200px] mx-auto px-6 pt-4">
        <div className="flex items-center justify-between h-14 px-6 rounded-full bg-white/[0.03] backdrop-blur-xl border border-white/[0.06]">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-[#5227FF] to-[#B19EEF] rounded-xl flex items-center justify-center shadow-lg shadow-[#5227FF]/30">
              <Ticket className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-display text-[17px] font-bold tracking-tight text-white">biletly</span>
          </Link>
          <div className="hidden md:flex items-center gap-7">
            <Link href="#nasil-calisir" className="text-[13px] text-zinc-500 hover:text-white transition-colors duration-300">Nasıl Çalışır</Link>
            <Link href="#guvenlik" className="text-[13px] text-zinc-500 hover:text-white transition-colors duration-300">Güvenlik</Link>
            <Link href="#ucretlendirme" className="text-[13px] text-zinc-500 hover:text-white transition-colors duration-300">Ücretlendirme</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/auth/login" className="hidden sm:block text-[13px] text-zinc-400 hover:text-white transition-colors px-4 py-2 rounded-full border border-transparent hover:border-white/10">Giriş</Link>
            <Link href="/auth/register" className="text-[13px] font-semibold text-white bg-white/[0.08] hover:bg-white/[0.14] backdrop-blur-sm px-5 py-2 rounded-full transition-all border border-white/[0.08] hover:border-white/[0.15]">
              Başla
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

function PhoneMockup() {
  return (
    <div className="relative animate-phone-bob" style={{ animationDelay: '0.6s' }}>
      {/* Glow behind phone */}
      <div className="absolute -inset-16 bg-gradient-to-br from-[#5227FF]/30 via-[#FF9FFC]/15 to-[#B19EEF]/25 rounded-full blur-[80px]" />

      {/* Floating badges */}
      <div className="absolute -top-6 -left-10 z-20 animate-float" style={{ animationDelay: '0s' }}>
        <div className="bg-white/[0.06] backdrop-blur-xl rounded-2xl p-3.5 border border-white/[0.08] shadow-2xl">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center">
              <BadgeCheck className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-white">Doğrulanmış</p>
              <p className="text-[9px] text-zinc-500">2.4K+ satıcı</p>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute -bottom-4 -right-10 z-20 animate-float" style={{ animationDelay: '1.5s' }}>
        <div className="bg-white/[0.06] backdrop-blur-xl rounded-2xl p-3.5 border border-white/[0.08] shadow-2xl">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-[#5227FF] to-[#B19EEF] rounded-lg flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-white">Emanet Ödeme</p>
              <p className="text-[9px] text-zinc-500">%100 Güvence</p>
            </div>
          </div>
        </div>
      </div>

      {/* iPhone 17 Frame */}
      <div className="relative z-10">
        <div className="w-[280px] md:w-[300px] rounded-[3.2rem] p-[3px] bg-gradient-to-b from-zinc-500/80 via-zinc-300/60 to-zinc-500/80 shadow-2xl shadow-black/60">
          <div className="bg-[#1a1a1e] rounded-[3rem] p-[5px]">
            <div className="bg-black rounded-[2.6rem] overflow-hidden relative">
              {/* Dynamic Island */}
              <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-[85px] h-[26px] bg-black rounded-full z-30" />

              {/* Mockup image from user */}
              <img 
                src="/mockup-app.png" 
                alt="Biletly App" 
                className="w-full h-auto block"
                style={{ minHeight: '580px', objectFit: 'cover', objectPosition: 'top' }}
              />

              {/* Home indicator */}
              <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-28 h-1 bg-white/20 rounded-full z-30" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-black">
      {/* LiquidEther background */}
      <div className="absolute inset-0 z-0 opacity-60">
        <LiquidEther
          colors={['#5227FF', '#FF9FFC', '#B19EEF']}
          mouseForce={20}
          cursorSize={100}
          isViscous
          viscous={30}
          iterationsViscous={32}
          iterationsPoisson={32}
          resolution={0.5}
          isBounce={false}
          autoDemo
          autoSpeed={0.5}
          autoIntensity={2.2}
          takeoverDuration={0.25}
          autoResumeDelay={3000}
          autoRampDuration={0.6}
          color0="#5227FF"
          color1="#FF9FFC"
          color2="#B19EEF"
        />
      </div>

      {/* Grain overlay */}
      <div className="absolute inset-0 z-[1] opacity-30 dot-grid" />

      <div className="relative z-10 max-w-[1200px] mx-auto px-6 pt-32 pb-20 w-full">
        <div className="grid lg:grid-cols-[1fr_380px] gap-16 items-center">
          {/* Left content */}
          <div>
            <div className="animate-fade-in-up inline-flex items-center gap-2 bg-white/[0.04] border border-white/[0.08] text-[#B19EEF] px-4 py-2 rounded-full text-[13px] font-medium mb-8 backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5" />
              Özyeğin Üniversitesi Pilotu Aktif
            </div>

            <h1 className="animate-fade-in-up font-display text-[clamp(2.8rem,7vw,5.5rem)] font-extrabold leading-[1.02] tracking-[-0.04em] mb-7 text-white" style={{ animationDelay: '0.1s' }}>
              Biletini
              <br />
              güvenle
              <br />
              <span className="hero-gradient-text">al ve sat.</span>
            </h1>

            <p className="animate-fade-in-up text-[clamp(1rem,2vw,1.15rem)] text-zinc-500 max-w-lg leading-[1.7] mb-10" style={{ animationDelay: '0.2s' }}>
              Emanet ödeme koruması ile konser, spor ve tiyatro biletlerinde güvenli alışveriş. Teklif ver, pazarlık et, güvenle al.
            </p>

            <div className="animate-fade-in-up flex flex-col sm:flex-row gap-4 mb-14" style={{ animationDelay: '0.3s' }}>
              <Link
                href="/auth/register"
                className="group inline-flex items-center justify-center gap-2.5 bg-white text-black font-bold text-[15px] px-8 py-4 rounded-full transition-all shadow-xl shadow-white/10 hover:shadow-white/20 hover:scale-[1.02] active:scale-[0.98]"
              >
                Hemen Başla
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href="#nasil-calisir"
                className="inline-flex items-center justify-center gap-2 text-[15px] text-zinc-400 hover:text-white font-medium transition-all border border-white/[0.08] hover:border-white/[0.18] px-8 py-4 rounded-full hover:bg-white/[0.03]"
              >
                Nasıl Çalışır?
              </Link>
            </div>

            <div className="animate-fade-in-up flex flex-wrap gap-6 text-[13px]" style={{ animationDelay: '0.4s' }}>
              {[
                { icon: Shield, label: 'Emanet ödeme', color: 'text-[#B19EEF]' },
                { icon: BadgeCheck, label: 'Doğrulanmış kullanıcılar', color: 'text-emerald-400' },
                { icon: Zap, label: 'Otomatik koruma', color: 'text-amber-400' },
              ].map((item) => (
                <span key={item.label} className="flex items-center gap-2 text-zinc-500">
                  <item.icon className={`w-4 h-4 ${item.color}`} /> {item.label}
                </span>
              ))}
            </div>
          </div>

          {/* Phone mockup */}
          <div className="hidden lg:flex justify-center animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <PhoneMockup />
          </div>
        </div>
      </div>

      {/* Bottom fade to next section */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent z-10" />
    </section>
  )
}

function HowItWorks() {
  const steps = [
    { number: '01', title: 'Keşfet', desc: 'Konser, spor ve tiyatro etkinliklerini keşfet. Aradığın bileti bul.', icon: Search, gradient: 'from-blue-500 to-cyan-400' },
    { number: '02', title: 'Teklif Ver', desc: 'Satıcıya fiyat teklifi gönder. Pazarlık et, anlaş.', icon: Banknote, gradient: 'from-orange-500 to-amber-400' },
    { number: '03', title: 'Güvenle Öde', desc: 'Ödemen emanete alınır. Bilet sana ulaşana kadar para güvende.', icon: Lock, gradient: 'from-[#5227FF] to-[#B19EEF]' },
    { number: '04', title: 'Bileti Al', desc: 'Satıcı PDF/QR dosyayı gönderir, sen onayla. Sorun olursa otomatik iade.', icon: Ticket, gradient: 'from-emerald-500 to-teal-400' },
  ]

  return (
    <section id="nasil-calisir" className="py-32 bg-black relative">
      {/* Subtle glow */}
      <div className="absolute top-0 left-1/3 w-[600px] h-[400px] bg-[#5227FF]/[0.04] rounded-full blur-[150px]" />

      <div className="relative max-w-[1200px] mx-auto px-6">
        <div className="text-center mb-20">
          <p className="text-[13px] font-semibold text-[#B19EEF] tracking-widest uppercase mb-4">Nasıl Çalışır</p>
          <h2 className="font-display text-[clamp(2.2rem,5vw,3.5rem)] font-extrabold tracking-[-0.03em] leading-[1.08] text-white">
            Dört adımda güvenli
            <br /><span className="text-zinc-700">bilet alışverişi.</span>
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map((step) => (
            <div key={step.number} className="group relative bg-white/[0.02] hover:bg-white/[0.05] rounded-3xl p-7 border border-white/[0.05] hover:border-white/[0.1] transition-all duration-500 overflow-hidden">
              {/* Top accent line */}
              <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${step.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${step.gradient} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                <step.icon className="w-5 h-5 text-white" />
              </div>
              <span className="text-[11px] text-zinc-700 font-bold tracking-wider">{step.number}</span>
              <h3 className="font-display text-lg font-bold tracking-tight mt-1.5 mb-2.5 text-white">{step.title}</h3>
              <p className="text-zinc-500 text-[13px] leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Security() {
  const features = [
    { title: 'Emanet Ödeme', desc: 'Paran bilet eline geçene kadar emanette. Teslim onaylanmadan satıcıya aktarılmaz.', icon: Shield, color: 'text-[#B19EEF]', bg: 'bg-[#5227FF]/10' },
    { title: 'Satıcı Puanı', desc: 'Her satış sonrası alıcı puanlama yapar. Yüksek puanlı satıcıları tercih et.', icon: Star, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { title: 'Otomatik İade', desc: 'SLA süresinde teslim olmazsa sistem otomatik iade başlatır.', icon: Zap, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { title: 'Bilet Koruması', desc: 'PDF biletler watermark ile korunur. Sahtecilik anında tespit edilir.', icon: Lock, color: 'text-[#FF9FFC]', bg: 'bg-[#FF9FFC]/10' },
  ]

  return (
    <section id="guvenlik" className="py-32 bg-black relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#5227FF]/[0.03] rounded-full blur-[150px]" />

      <div className="relative max-w-[1200px] mx-auto px-6">
        <div className="text-center mb-20">
          <p className="text-[13px] font-semibold text-[#B19EEF] tracking-widest uppercase mb-4">Güvenlik</p>
          <h2 className="font-display text-[clamp(2.2rem,5vw,3.5rem)] font-extrabold tracking-[-0.03em] leading-[1.08] text-white">
            Her adımda
            <br /><span className="text-zinc-700">güvendesin.</span>
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 gap-5 max-w-3xl mx-auto">
          {features.map((f, i) => (
            <div key={i} className="group bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.05] hover:border-white/[0.1] rounded-3xl p-8 transition-all duration-500">
              <div className={`w-14 h-14 ${f.bg} rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-500`}>
                <f.icon className={`w-6 h-6 ${f.color}`} />
              </div>
              <h3 className="font-display font-bold text-lg mb-2.5 text-white">{f.title}</h3>
              <p className="text-zinc-500 text-[13px] leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Pricing() {
  return (
    <section id="ucretlendirme" className="py-32 bg-black relative">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center mb-20">
          <p className="text-[13px] font-semibold text-[#B19EEF] tracking-widest uppercase mb-4">Ücretlendirme</p>
          <h2 className="font-display text-[clamp(2.2rem,5vw,3.5rem)] font-extrabold tracking-[-0.03em] text-white">Basit ve şeffaf.</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-5 max-w-2xl mx-auto">
          <div className="text-center p-10 rounded-3xl bg-white/[0.02] border border-white/[0.06] hover:border-blue-500/20 transition-all duration-500 hover:bg-blue-500/[0.03]">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-blue-500/20">
              <Users className="w-6 h-6 text-white" />
            </div>
            <p className="text-[13px] text-blue-400 font-medium mb-2">İşlem tutarı</p>
            <p className="font-display text-4xl font-bold tracking-tight mb-5 text-white">&lt; ₺500</p>
            <p className="text-zinc-500 text-[13px]">Küçük bir hizmet bedeli <span className="text-blue-400 font-semibold">alıcıdan</span> alınır.</p>
          </div>

          <div className="text-center p-10 rounded-3xl bg-white/[0.02] border border-white/[0.06] hover:border-emerald-500/20 transition-all duration-500 hover:bg-emerald-500/[0.03]">
            <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-emerald-500/20">
              <Banknote className="w-6 h-6 text-white" />
            </div>
            <p className="text-[13px] text-emerald-400 font-medium mb-2">İşlem tutarı</p>
            <p className="font-display text-4xl font-bold tracking-tight mb-5 text-white">≥ ₺500</p>
            <p className="text-zinc-500 text-[13px]">Komisyon <span className="text-emerald-400 font-semibold">satıcıdan</span> kesilir.</p>
          </div>
        </div>
      </div>
    </section>
  )
}

function CTA() {
  return (
    <section className="py-32 relative overflow-hidden">
      {/* LiquidEther CTA background */}
      <div className="absolute inset-0 z-0 opacity-50">
        <LiquidEther
          colors={['#5227FF', '#FF9FFC', '#B19EEF']}
          autoDemo
          autoSpeed={0.3}
          autoIntensity={1.8}
          resolution={0.5}
        />
      </div>

      <div className="absolute inset-0 bg-black/40 z-[1]" />

      <div className="relative z-10 max-w-[1200px] mx-auto px-6 text-center">
        <h2 className="font-display text-[clamp(2.2rem,5vw,3.5rem)] font-extrabold tracking-[-0.03em] leading-[1.08] text-white mb-6">
          Güvenli bilet alışverişi
          <br /><span className="text-white/40">seni bekliyor.</span>
        </h2>
        <p className="text-zinc-400 text-lg mb-12 max-w-md mx-auto">
          Şu an Özyeğin Üniversitesi topluluğuna özel.
        </p>
        <Link
          href="/auth/register"
          className="group inline-flex items-center gap-2.5 bg-white text-black font-bold text-[15px] px-9 py-4.5 rounded-full transition-all shadow-xl shadow-white/10 hover:shadow-white/20 hover:scale-[1.02] active:scale-[0.98]"
        >
          Ücretsiz Kayıt Ol
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="bg-black border-t border-white/[0.04]">
      <div className="max-w-[1200px] mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-gradient-to-br from-[#5227FF] to-[#B19EEF] rounded-lg flex items-center justify-center">
              <Ticket className="w-3 h-3 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-display text-sm font-semibold text-zinc-600">biletly</span>
          </div>
          <div className="flex items-center gap-6 text-[12px] text-zinc-700">
            <Link href="#" className="hover:text-zinc-300 transition-colors duration-300">Gizlilik</Link>
            <Link href="#" className="hover:text-zinc-300 transition-colors duration-300">Kullanım Koşulları</Link>
            <Link href="#" className="hover:text-zinc-300 transition-colors duration-300">İletişim</Link>
          </div>
          <p className="text-[12px] text-zinc-800">© 2026 Biletly</p>
        </div>
      </div>
    </footer>
  )
}

export default function Home() {
  return (
    <main className="bg-black">
      <Navbar />
      <Hero />
      <HowItWorks />
      <Security />
      <Pricing />
      <CTA />
      <Footer />
    </main>
  )
}
