import Link from 'next/link'
import { Shield, ArrowRight, Ticket, ChevronDown, Zap, Lock, Star, BadgeCheck, Search, Banknote, Users, Sparkles } from 'lucide-react'

function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/20">
      <div className="max-w-[1080px] mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Ticket className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
          <span className="font-display text-[17px] font-bold tracking-tight">biletly</span>
        </Link>
        <div className="hidden md:flex items-center gap-7">
          <Link href="#nasil-calisir" className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors">Nasıl Çalışır</Link>
          <Link href="#guvenlik" className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors">Güvenlik</Link>
          <Link href="#ucretlendirme" className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors">Ücretlendirme</Link>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/auth/login" className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors px-3 py-1.5">Giriş</Link>
          <Link href="/auth/register" className="text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 px-5 py-2 rounded-full transition-all shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 active:scale-[0.97]">
            Başla
          </Link>
        </div>
      </div>
    </nav>
  )
}

function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50" />
      <div className="absolute top-20 right-20 w-[500px] h-[500px] bg-gradient-to-bl from-orange-200/30 to-transparent rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 left-20 w-[400px] h-[400px] bg-gradient-to-tr from-indigo-200/40 to-transparent rounded-full blur-3xl" style={{ animationDelay: '1.5s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-purple-100/20 to-pink-100/20 rounded-full blur-3xl" />

      <div className="relative text-center px-6 max-w-4xl mx-auto pt-24">
        {/* Badge */}
        <div className="animate-fade-in-up inline-flex items-center gap-2 bg-white/80 backdrop-blur border border-indigo-100 text-indigo-700 px-4 py-1.5 rounded-full text-sm font-medium mb-8 shadow-sm">
          <Sparkles className="w-3.5 h-3.5" />
          Özyeğin Üniversitesi Pilotu Aktif
        </div>

        {/* Headline */}
        <h1 className="animate-fade-in-up font-display text-[clamp(2.8rem,8vw,5.5rem)] font-extrabold leading-[1.05] tracking-[-0.03em] mb-6" style={{ animationDelay: '0.1s' }}>
          Biletini güvenle
          <br />
          <span className="gradient-text">al ve sat.</span>
        </h1>

        {/* Sub */}
        <p className="animate-fade-in-up text-[clamp(1rem,2.2vw,1.25rem)] text-zinc-500 max-w-lg mx-auto leading-relaxed mb-10" style={{ animationDelay: '0.2s' }}>
          Emanet ödeme koruması ile konser, spor ve tiyatro biletlerinde güvenli alışveriş.
        </p>

        {/* CTAs */}
        <div className="animate-fade-in-up flex flex-col sm:flex-row items-center justify-center gap-4 mb-16" style={{ animationDelay: '0.3s' }}>
          <Link
            href="/auth/register"
            className="group btn-shine inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold text-base px-8 py-4 rounded-full transition-all shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98]"
          >
            Hemen Başla
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <Link
            href="#nasil-calisir"
            className="inline-flex items-center gap-2 text-base text-zinc-600 hover:text-zinc-900 font-medium transition-colors"
          >
            Nasıl çalışır?
            <ChevronDown className="w-4 h-4" />
          </Link>
        </div>

        {/* Trust indicators */}
        <div className="animate-fade-in-up flex flex-wrap justify-center gap-6 text-sm text-zinc-500" style={{ animationDelay: '0.4s' }}>
          <span className="flex items-center gap-2 bg-white/60 backdrop-blur px-3 py-1.5 rounded-full border border-zinc-100">
            <Shield className="w-4 h-4 text-indigo-500" /> Emanet ödeme
          </span>
          <span className="flex items-center gap-2 bg-white/60 backdrop-blur px-3 py-1.5 rounded-full border border-zinc-100">
            <BadgeCheck className="w-4 h-4 text-emerald-500" /> Doğrulanmış kullanıcılar
          </span>
          <span className="flex items-center gap-2 bg-white/60 backdrop-blur px-3 py-1.5 rounded-full border border-zinc-100">
            <Zap className="w-4 h-4 text-orange-500" /> Otomatik koruma
          </span>
        </div>
      </div>

      {/* Scroll */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDown className="w-5 h-5 text-zinc-400" />
      </div>
    </section>
  )
}

function HowItWorks() {
  const steps = [
    { number: '01', title: 'Keşfet', desc: 'Konser, spor ve tiyatro etkinliklerini keşfet. Aradığın bileti bul.', icon: Search, gradient: 'from-blue-500 to-cyan-400' },
    { number: '02', title: 'Teklif Ver', desc: 'Satıcıya fiyat teklifi gönder. Pazarlık et, anlaş.', icon: Banknote, gradient: 'from-orange-500 to-amber-400' },
    { number: '03', title: 'Güvenle Öde', desc: 'Ödemen emanete alınır. Bilet sana ulaşana kadar para güvende.', icon: Lock, gradient: 'from-indigo-500 to-purple-500' },
    { number: '04', title: 'Bileti Al', desc: 'Satıcı transfer eder, sen onayla. Sorun olursa otomatik iade.', icon: Ticket, gradient: 'from-emerald-500 to-teal-400' },
  ]

  return (
    <section id="nasil-calisir" className="py-28 bg-white relative">
      <div className="max-w-[1080px] mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-indigo-500 tracking-wide uppercase mb-3">Nasıl Çalışır</p>
          <h2 className="font-display text-[clamp(2rem,5vw,3.2rem)] font-extrabold tracking-[-0.02em] leading-[1.1]">
            Dört adımda güvenli
            <br /><span className="text-zinc-400">bilet alışverişi.</span>
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {steps.map((step) => (
            <div key={step.number} className="group card-hover bg-white rounded-2xl p-6 border border-zinc-100 hover:border-zinc-200 relative overflow-hidden">
              {/* Gradient accent */}
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${step.gradient} opacity-0 group-hover:opacity-100 transition-opacity`} />
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${step.gradient} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                <step.icon className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs text-zinc-300 font-bold">{step.number}</span>
              <h3 className="font-display text-lg font-bold tracking-tight mt-1 mb-2">{step.title}</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Security() {
  const features = [
    { title: 'Emanet Ödeme', desc: 'Paran bilet eline geçene kadar emanette. Teslim onaylanmadan satıcıya aktarılmaz.', icon: Shield, color: 'text-indigo-400' },
    { title: 'Trust Score', desc: 'Her kullanıcının güven puanı var. Başarılı satışlar puanı yükseltir.', icon: Star, color: 'text-amber-400' },
    { title: 'Otomatik İade', desc: 'SLA süresinde teslim olmazsa sistem otomatik iade başlatır.', icon: Zap, color: 'text-emerald-400' },
    { title: 'Bilet Koruması', desc: 'PDF biletler watermark ile korunur. Sahtecilik anında tespit edilir.', icon: Lock, color: 'text-purple-400' },
  ]

  return (
    <section id="guvenlik" className="py-28 bg-zinc-950 text-white relative overflow-hidden">
      <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[100px]" />

      <div className="relative max-w-[1080px] mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-indigo-400 tracking-wide uppercase mb-3">Güvenlik</p>
          <h2 className="font-display text-[clamp(2rem,5vw,3.2rem)] font-extrabold tracking-[-0.02em] leading-[1.1]">
            Her adımda
            <br /><span className="text-zinc-600">güvendesin.</span>
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 gap-5 max-w-3xl mx-auto">
          {features.map((f, i) => (
            <div key={i} className="group bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] hover:border-white/[0.12] rounded-2xl p-7 transition-all duration-300 card-hover">
              <f.icon className={`w-7 h-7 ${f.color} mb-4`} />
              <h3 className="font-display font-bold text-lg mb-2">{f.title}</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Pricing() {
  return (
    <section id="ucretlendirme" className="py-28 bg-white">
      <div className="max-w-[1080px] mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-indigo-500 tracking-wide uppercase mb-3">Ücretlendirme</p>
          <h2 className="font-display text-[clamp(2rem,5vw,3.2rem)] font-extrabold tracking-[-0.02em]">Basit ve şeffaf.</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          <div className="card-hover text-center p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-indigo-100">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/20">
              <Users className="w-5 h-5 text-white" />
            </div>
            <p className="text-sm text-indigo-600 font-medium mb-1">İşlem tutarı</p>
            <p className="font-display text-3xl font-bold tracking-tight mb-4">&lt; ₺500</p>
            <p className="text-zinc-500 text-sm leading-relaxed">
              Küçük bir hizmet bedeli <span className="text-indigo-600 font-semibold">alıcıdan</span> alınır. Satıcıya kesinti yok.
            </p>
          </div>

          <div className="card-hover text-center p-8 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/20">
              <Banknote className="w-5 h-5 text-white" />
            </div>
            <p className="text-sm text-emerald-600 font-medium mb-1">İşlem tutarı</p>
            <p className="font-display text-3xl font-bold tracking-tight mb-4">≥ ₺500</p>
            <p className="text-zinc-500 text-sm leading-relaxed">
              Komisyon <span className="text-emerald-600 font-semibold">satıcıdan</span> kesilir. Alıcıya ek ücret yok.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

function CTA() {
  return (
    <section className="py-28 bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-56 h-56 bg-orange-500/15 rounded-full blur-3xl" />

      <div className="relative max-w-[1080px] mx-auto px-6 text-center">
        <h2 className="font-display text-[clamp(2rem,5vw,3.2rem)] font-extrabold tracking-[-0.02em] leading-[1.1] mb-5">
          Güvenli bilet alışverişi
          <br /><span className="text-white/60">seni bekliyor.</span>
        </h2>
        <p className="text-indigo-100 text-lg mb-10 max-w-md mx-auto">
          Şu an Özyeğin Üniversitesi topluluğuna özel.
        </p>
        <Link
          href="/auth/register"
          className="group btn-shine inline-flex items-center gap-2 bg-white text-indigo-700 font-bold text-base px-8 py-4 rounded-full transition-all shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98]"
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
    <footer className="bg-zinc-950 border-t border-zinc-800/50">
      <div className="max-w-[1080px] mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Ticket className="w-3 h-3 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-display text-sm font-semibold text-zinc-400">biletly</span>
          </div>
          <div className="flex items-center gap-5 text-[12px] text-zinc-500">
            <Link href="#" className="hover:text-zinc-300 transition-colors">Gizlilik</Link>
            <Link href="#" className="hover:text-zinc-300 transition-colors">Kullanım Koşulları</Link>
            <Link href="#" className="hover:text-zinc-300 transition-colors">İletişim</Link>
          </div>
          <p className="text-[12px] text-zinc-600">© 2026 Biletly</p>
        </div>
      </div>
    </footer>
  )
}

export default function Home() {
  return (
    <main>
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
