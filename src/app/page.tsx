import Link from 'next/link'
import { Shield, ArrowRight, Ticket, ChevronDown, Zap, Lock, Star, BadgeCheck, Search, Banknote, Users, Sparkles, Music, Trophy, Drama, PartyPopper, MapPin, Calendar } from 'lucide-react'

function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-dark">
      <div className="max-w-[1100px] mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/30">
            <Ticket className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
          <span className="font-display text-[17px] font-bold tracking-tight text-white">biletly</span>
        </Link>
        <div className="hidden md:flex items-center gap-7">
          <Link href="#nasil-calisir" className="text-sm text-zinc-400 hover:text-white transition-colors">Nasıl Çalışır</Link>
          <Link href="#guvenlik" className="text-sm text-zinc-400 hover:text-white transition-colors">Güvenlik</Link>
          <Link href="#ucretlendirme" className="text-sm text-zinc-400 hover:text-white transition-colors">Ücretlendirme</Link>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/auth/login" className="text-sm text-zinc-400 hover:text-white transition-colors px-3 py-1.5">Giriş</Link>
          <Link href="/auth/register" className="text-sm font-semibold text-white bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 px-5 py-2 rounded-full transition-all shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 active:scale-[0.97]">
            Başla
          </Link>
        </div>
      </div>
    </nav>
  )
}

function PhoneMockup() {
  const events = [
    { title: 'Mabel Matiz', venue: 'Kuruçeşme Arena', date: '15 Nis', price: '₺450', cat: 'Konser', icon: Music, color: 'from-violet-500 to-purple-500' },
    { title: 'Galatasaray vs Fenerbahçe', venue: 'Rams Park', date: '22 Nis', price: '₺800', cat: 'Spor', icon: Trophy, color: 'from-orange-500 to-amber-500' },
    { title: 'Hamlet — Zorlu PSM', venue: 'Zorlu PSM', date: '28 Nis', price: '₺320', cat: 'Tiyatro', icon: Drama, color: 'from-emerald-500 to-teal-500' },
    { title: 'Chill-Out Festival', venue: 'Life Park', date: '5 May', price: '₺650', cat: 'Festival', icon: PartyPopper, color: 'from-pink-500 to-rose-500' },
  ]

  return (
    <div className="animate-phone-bob" style={{ animationDelay: '0.6s' }}>
      {/* Phone frame */}
      <div className="w-[280px] md:w-[300px] bg-zinc-900 rounded-[2.5rem] p-2 shadow-2xl shadow-black/50 border border-zinc-700/50">
        {/* Screen */}
        <div className="bg-zinc-950 rounded-[2rem] overflow-hidden">
          {/* Status bar */}
          <div className="flex items-center justify-between px-5 pt-3 pb-1">
            <span className="text-[10px] text-zinc-400 font-medium">21:30</span>
            <div className="w-20 h-5 bg-zinc-900 rounded-full" />
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 border border-zinc-500 rounded-sm" />
            </div>
          </div>

          {/* App header */}
          <div className="px-4 pt-3 pb-2">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 bg-gradient-to-br from-violet-500 to-purple-600 rounded-md flex items-center justify-center">
                  <Ticket className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                </div>
                <span className="text-[11px] font-bold text-white">biletly</span>
              </div>
              <div className="w-6 h-6 bg-zinc-800 rounded-full" />
            </div>

            {/* Search bar */}
            <div className="flex items-center gap-2 bg-zinc-800/80 rounded-xl px-3 py-2 mb-3">
              <Search className="w-3 h-3 text-zinc-500" />
              <span className="text-[10px] text-zinc-500">Etkinlik ara...</span>
            </div>

            {/* Category pills */}
            <div className="flex gap-1.5 mb-3 overflow-hidden">
              {['Tümü', 'Konser', 'Spor', 'Tiyatro'].map((cat, i) => (
                <span key={cat} className={`text-[9px] px-2.5 py-1 rounded-full whitespace-nowrap font-medium ${i === 0 ? 'bg-violet-500 text-white' : 'bg-zinc-800 text-zinc-400'}`}>
                  {cat}
                </span>
              ))}
            </div>
          </div>

          {/* Event cards */}
          <div className="px-4 pb-4 space-y-2.5">
            {events.map((event, i) => (
              <div key={i} className="bg-zinc-800/50 rounded-xl p-3 border border-zinc-700/30 flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${event.color} flex items-center justify-center shrink-0 shadow-lg`}>
                  <event.icon className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-semibold text-white truncate">{event.title}</p>
                  <p className="text-[9px] text-zinc-500 truncate">{event.date} · {event.venue}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[11px] font-bold text-white">{event.price}</p>
                  <p className="text-[8px] text-zinc-500">{event.cat}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom nav */}
          <div className="flex items-center justify-around px-4 py-2.5 border-t border-zinc-800/80">
            {[
              { icon: Search, label: 'Keşfet', active: true },
              { icon: Ticket, label: 'Biletlerim', active: false },
              { icon: Star, label: 'Profil', active: false },
            ].map((item) => (
              <div key={item.label} className="flex flex-col items-center gap-0.5">
                <item.icon className={`w-4 h-4 ${item.active ? 'text-violet-400' : 'text-zinc-600'}`} />
                <span className={`text-[8px] ${item.active ? 'text-violet-400 font-medium' : 'text-zinc-600'}`}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden mesh-bg">
      {/* Glow orbs */}
      <div className="absolute top-20 left-[10%] w-[500px] h-[500px] bg-violet-500/8 rounded-full blur-[120px]" />
      <div className="absolute bottom-10 right-[10%] w-[400px] h-[400px] bg-indigo-500/6 rounded-full blur-[100px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-500/4 rounded-full blur-[150px]" />

      {/* Dot grid overlay */}
      <div className="absolute inset-0 dot-grid opacity-30" />

      <div className="relative max-w-[1100px] mx-auto px-6 pt-28 pb-16 w-full">
        <div className="grid lg:grid-cols-[1fr_340px] gap-12 items-center">
          {/* Left content */}
          <div>
            <div className="animate-fade-in-up inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 text-violet-300 px-4 py-1.5 rounded-full text-sm font-medium mb-8">
              <Sparkles className="w-3.5 h-3.5" />
              Özyeğin Üniversitesi Pilotu Aktif
            </div>

            <h1 className="animate-fade-in-up font-display text-[clamp(2.5rem,7vw,5rem)] font-extrabold leading-[1.05] tracking-[-0.03em] mb-6 text-white" style={{ animationDelay: '0.1s' }}>
              Biletini güvenle
              <br />
              <span className="gradient-text">al ve sat.</span>
            </h1>

            <p className="animate-fade-in-up text-[clamp(1rem,2vw,1.2rem)] text-zinc-400 max-w-lg leading-relaxed mb-10" style={{ animationDelay: '0.2s' }}>
              Emanet ödeme koruması ile konser, spor ve tiyatro biletlerinde güvenli alışveriş. Teklif ver, pazarlık et, güvenle al.
            </p>

            <div className="animate-fade-in-up flex flex-col sm:flex-row gap-4 mb-12" style={{ animationDelay: '0.3s' }}>
              <Link
                href="/auth/register"
                className="group inline-flex items-center justify-center gap-2 bg-gradient-to-r from-violet-500 to-purple-600 text-white font-semibold text-base px-8 py-4 rounded-full transition-all shadow-xl shadow-violet-500/25 hover:shadow-violet-500/40 hover:scale-[1.02] active:scale-[0.98]"
              >
                Hemen Başla
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href="#nasil-calisir"
                className="inline-flex items-center justify-center gap-2 text-base text-zinc-400 hover:text-white font-medium transition-colors border border-zinc-800 hover:border-zinc-700 px-8 py-4 rounded-full"
              >
                Nasıl Çalışır?
              </Link>
            </div>

            <div className="animate-fade-in-up flex flex-wrap gap-4 text-sm" style={{ animationDelay: '0.4s' }}>
              <span className="flex items-center gap-2 text-zinc-500">
                <Shield className="w-4 h-4 text-violet-400" /> Emanet ödeme
              </span>
              <span className="flex items-center gap-2 text-zinc-500">
                <BadgeCheck className="w-4 h-4 text-emerald-400" /> Doğrulanmış kullanıcılar
              </span>
              <span className="flex items-center gap-2 text-zinc-500">
                <Zap className="w-4 h-4 text-amber-400" /> Otomatik koruma
              </span>
            </div>
          </div>

          {/* Phone mockup */}
          <div className="hidden lg:flex justify-center animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <PhoneMockup />
          </div>
        </div>
      </div>
    </section>
  )
}

function HowItWorks() {
  const steps = [
    { number: '01', title: 'Keşfet', desc: 'Konser, spor ve tiyatro etkinliklerini keşfet. Aradığın bileti bul.', icon: Search, gradient: 'from-blue-500 to-cyan-400' },
    { number: '02', title: 'Teklif Ver', desc: 'Satıcıya fiyat teklifi gönder. Pazarlık et, anlaş.', icon: Banknote, gradient: 'from-orange-500 to-amber-400' },
    { number: '03', title: 'Güvenle Öde', desc: 'Ödemen emanete alınır. Bilet sana ulaşana kadar para güvende.', icon: Lock, gradient: 'from-violet-500 to-purple-500' },
    { number: '04', title: 'Bileti Al', desc: 'Satıcı transfer eder, sen onayla. Sorun olursa otomatik iade.', icon: Ticket, gradient: 'from-emerald-500 to-teal-400' },
  ]

  return (
    <section id="nasil-calisir" className="py-28 bg-zinc-950 relative mesh-bg">
      <div className="max-w-[1100px] mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-violet-400 tracking-wide uppercase mb-3">Nasıl Çalışır</p>
          <h2 className="font-display text-[clamp(2rem,5vw,3rem)] font-extrabold tracking-[-0.02em] leading-[1.1] text-white">
            Dört adımda güvenli
            <br /><span className="text-zinc-600">bilet alışverişi.</span>
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map((step) => (
            <div key={step.number} className="group card-hover glow-border bg-zinc-900/80 rounded-2xl p-6 border border-zinc-800/50 relative overflow-hidden">
              <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${step.gradient} opacity-0 group-hover:opacity-100 transition-opacity`} />
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${step.gradient} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                <step.icon className="w-5 h-5 text-white" />
              </div>
              <span className="text-[11px] text-zinc-600 font-bold">{step.number}</span>
              <h3 className="font-display text-lg font-bold tracking-tight mt-1 mb-2 text-white">{step.title}</h3>
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
    { title: 'Emanet Ödeme', desc: 'Paran bilet eline geçene kadar emanette. Teslim onaylanmadan satıcıya aktarılmaz.', icon: Shield, color: 'text-violet-400', bg: 'bg-violet-500/10' },
    { title: 'Trust Score', desc: 'Her kullanıcının güven puanı var. Başarılı satışlar puanı yükseltir.', icon: Star, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { title: 'Otomatik İade', desc: 'SLA süresinde teslim olmazsa sistem otomatik iade başlatır.', icon: Zap, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { title: 'Bilet Koruması', desc: 'PDF biletler watermark ile korunur. Sahtecilik anında tespit edilir.', icon: Lock, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  ]

  return (
    <section id="guvenlik" className="py-28 bg-black relative overflow-hidden">
      <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-violet-500/5 rounded-full blur-[120px]" />

      <div className="relative max-w-[1100px] mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-violet-400 tracking-wide uppercase mb-3">Güvenlik</p>
          <h2 className="font-display text-[clamp(2rem,5vw,3rem)] font-extrabold tracking-[-0.02em] leading-[1.1] text-white">
            Her adımda
            <br /><span className="text-zinc-700">güvendesin.</span>
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
          {features.map((f, i) => (
            <div key={i} className="group card-hover bg-zinc-900/60 border border-zinc-800/60 hover:border-zinc-700/60 rounded-2xl p-7 transition-all">
              <div className={`w-12 h-12 ${f.bg} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <f.icon className={`w-6 h-6 ${f.color}`} />
              </div>
              <h3 className="font-display font-bold text-lg mb-2 text-white">{f.title}</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Pricing() {
  return (
    <section id="ucretlendirme" className="py-28 bg-zinc-950 mesh-bg">
      <div className="max-w-[1100px] mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-violet-400 tracking-wide uppercase mb-3">Ücretlendirme</p>
          <h2 className="font-display text-[clamp(2rem,5vw,3rem)] font-extrabold tracking-[-0.02em] text-white">Basit ve şeffaf.</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-5 max-w-2xl mx-auto">
          <div className="card-hover text-center p-8 rounded-2xl bg-gradient-to-b from-blue-500/10 to-indigo-500/5 border border-blue-500/20">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/20">
              <Users className="w-5 h-5 text-white" />
            </div>
            <p className="text-sm text-blue-400 font-medium mb-1">İşlem tutarı</p>
            <p className="font-display text-3xl font-bold tracking-tight mb-4 text-white">&lt; ₺500</p>
            <p className="text-zinc-500 text-sm">Küçük bir hizmet bedeli <span className="text-blue-400 font-semibold">alıcıdan</span> alınır.</p>
          </div>

          <div className="card-hover text-center p-8 rounded-2xl bg-gradient-to-b from-emerald-500/10 to-teal-500/5 border border-emerald-500/20">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/20">
              <Banknote className="w-5 h-5 text-white" />
            </div>
            <p className="text-sm text-emerald-400 font-medium mb-1">İşlem tutarı</p>
            <p className="font-display text-3xl font-bold tracking-tight mb-4 text-white">≥ ₺500</p>
            <p className="text-zinc-500 text-sm">Komisyon <span className="text-emerald-400 font-semibold">satıcıdan</span> kesilir.</p>
          </div>
        </div>
      </div>
    </section>
  )
}

function CTA() {
  return (
    <section className="py-28 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700" />
      <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-56 h-56 bg-orange-500/10 rounded-full blur-3xl" />
      <div className="absolute inset-0 dot-grid opacity-10" />

      <div className="relative max-w-[1100px] mx-auto px-6 text-center">
        <h2 className="font-display text-[clamp(2rem,5vw,3rem)] font-extrabold tracking-[-0.02em] leading-[1.1] text-white mb-5">
          Güvenli bilet alışverişi
          <br /><span className="text-white/50">seni bekliyor.</span>
        </h2>
        <p className="text-violet-100/80 text-lg mb-10 max-w-md mx-auto">
          Şu an Özyeğin Üniversitesi topluluğuna özel.
        </p>
        <Link
          href="/auth/register"
          className="group inline-flex items-center gap-2 bg-white text-violet-700 font-bold text-base px-8 py-4 rounded-full transition-all shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98]"
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
    <footer className="bg-black border-t border-zinc-800/50">
      <div className="max-w-[1100px] mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Ticket className="w-3 h-3 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-display text-sm font-semibold text-zinc-500">biletly</span>
          </div>
          <div className="flex items-center gap-5 text-[12px] text-zinc-600">
            <Link href="#" className="hover:text-zinc-300 transition-colors">Gizlilik</Link>
            <Link href="#" className="hover:text-zinc-300 transition-colors">Kullanım Koşulları</Link>
            <Link href="#" className="hover:text-zinc-300 transition-colors">İletişim</Link>
          </div>
          <p className="text-[12px] text-zinc-700">© 2026 Biletly</p>
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
