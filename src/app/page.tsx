import Link from 'next/link'
import { Shield, ArrowRight, Ticket, ChevronDown } from 'lucide-react'

/* ───────────────────────── NAVBAR ───────────────────────── */
function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-zinc-100/80">
      <div className="max-w-[980px] mx-auto px-6 h-12 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-1.5">
          <Ticket className="w-[18px] h-[18px] text-zinc-900" strokeWidth={2.2} />
          <span className="font-display text-[15px] font-semibold tracking-tight text-zinc-900">biletly</span>
        </Link>
        <div className="hidden md:flex items-center gap-7">
          <Link href="#nasil-calisir" className="text-xs text-zinc-500 hover:text-zinc-900 transition-colors">
            Nasıl Çalışır
          </Link>
          <Link href="#guvenlik" className="text-xs text-zinc-500 hover:text-zinc-900 transition-colors">
            Güvenlik
          </Link>
          <Link href="#ucretlendirme" className="text-xs text-zinc-500 hover:text-zinc-900 transition-colors">
            Ücretlendirme
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/auth/login"
            className="text-xs text-zinc-500 hover:text-zinc-900 transition-colors"
          >
            Giriş Yap
          </Link>
          <Link
            href="/auth/register"
            className="text-xs font-medium text-white bg-zinc-900 hover:bg-black px-3.5 py-1.5 rounded-full transition-all"
          >
            Başla
          </Link>
        </div>
      </div>
    </nav>
  )
}

/* ───────────────────────── HERO ───────────────────────── */
function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center bg-black text-white overflow-hidden">
      {/* Subtle radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-zinc-800/40 via-transparent to-transparent rounded-full blur-3xl" />

      <div className="relative text-center px-6 max-w-4xl mx-auto">
        {/* Overline */}
        <p className="animate-fade-in text-[13px] tracking-[0.2em] uppercase text-zinc-500 font-medium mb-8">
          C2C Bilet Pazaryeri
        </p>

        {/* Main headline */}
        <h1 className="animate-fade-in-up font-display text-[clamp(2.8rem,8vw,6.5rem)] font-bold leading-[1] tracking-[-0.03em] mb-6">
          Biletini güvenle
          <br />
          al ve sat.
        </h1>

        {/* Sub */}
        <p className="animate-fade-in-up text-[clamp(1rem,2.2vw,1.35rem)] text-zinc-400 max-w-xl mx-auto leading-relaxed mb-12" style={{ animationDelay: '0.15s' }}>
          Emanet ödeme koruması ile konser, spor ve tiyatro biletlerinde
          güvenli alışveriş.
        </p>

        {/* CTAs */}
        <div className="animate-fade-in-up flex flex-col sm:flex-row items-center justify-center gap-4 mb-20" style={{ animationDelay: '0.25s' }}>
          <Link
            href="/auth/register"
            className="group inline-flex items-center gap-2 bg-white text-black font-medium text-[15px] px-7 py-3.5 rounded-full transition-all hover:bg-zinc-100 active:scale-[0.97]"
          >
            Hemen Başla
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <Link
            href="#nasil-calisir"
            className="inline-flex items-center gap-2 text-[15px] text-blue-400 hover:text-blue-300 font-medium transition-colors"
          >
            Nasıl çalışır?
            <ChevronDown className="w-4 h-4" />
          </Link>
        </div>

        {/* Pilot badge */}
        <div className="animate-fade-in inline-flex items-center gap-2 text-[13px] text-zinc-600" style={{ animationDelay: '0.4s' }}>
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
          Özyeğin Üniversitesi pilot programı aktif
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDown className="w-5 h-5 text-zinc-600" />
      </div>
    </section>
  )
}

/* ───────────────────────── HOW IT WORKS ───────────────────────── */
function HowItWorks() {
  const steps = [
    {
      number: '01',
      title: 'Keşfet',
      desc: 'Konser, spor ve tiyatro etkinliklerini keşfet. Aradığın bileti bul.',
    },
    {
      number: '02',
      title: 'Teklif Ver',
      desc: 'Satıcıya fiyat teklifi gönder. Pazarlık et, anlaş.',
    },
    {
      number: '03',
      title: 'Güvenle Öde',
      desc: 'Ödemen emanete alınır. Bilet sana ulaşana kadar para güvende.',
    },
    {
      number: '04',
      title: 'Bileti Al',
      desc: 'Satıcı transfer eder, sen onayla. Sorun olursa otomatik iade.',
    },
  ]

  return (
    <section id="nasil-calisir" className="bg-white py-32 md:py-44">
      <div className="max-w-[980px] mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-20 md:mb-28">
          <p className="text-[13px] tracking-[0.2em] uppercase text-zinc-400 font-medium mb-4">
            Nasıl Çalışır
          </p>
          <h2 className="font-display text-[clamp(2rem,5vw,3.5rem)] font-bold tracking-[-0.02em] leading-[1.1]">
            Dört adımda
            <br />
            <span className="text-zinc-400">güvenli bilet alışverişi.</span>
          </h2>
        </div>

        {/* Steps */}
        <div className="space-y-0">
          {steps.map((step, i) => (
            <div
              key={step.number}
              className="group grid grid-cols-[60px_1fr] md:grid-cols-[80px_200px_1fr] gap-4 md:gap-8 items-baseline py-10 border-t border-zinc-100 last:border-b transition-colors hover:bg-zinc-50/50"
            >
              <span className="font-display text-sm text-zinc-300 font-medium">
                {step.number}
              </span>
              <h3 className="font-display text-2xl md:text-3xl font-semibold tracking-tight">
                {step.title}
              </h3>
              <p className="text-zinc-500 text-base leading-relaxed col-start-2 md:col-start-3">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ───────────────────────── SECURITY ───────────────────────── */
function Security() {
  return (
    <section id="guvenlik" className="bg-zinc-950 text-white py-32 md:py-44">
      <div className="max-w-[980px] mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-20 md:mb-28">
          <p className="text-[13px] tracking-[0.2em] uppercase text-zinc-500 font-medium mb-4">
            Güvenlik
          </p>
          <h2 className="font-display text-[clamp(2rem,5vw,3.5rem)] font-bold tracking-[-0.02em] leading-[1.1]">
            Her adımda
            <br />
            <span className="text-zinc-600">güvendesin.</span>
          </h2>
        </div>

        {/* Feature grid */}
        <div className="grid md:grid-cols-2 gap-px bg-zinc-800/50 rounded-2xl overflow-hidden">
          {[
            {
              title: 'Emanet Ödeme',
              desc: 'Paran bilet eline geçene kadar emanette tutulur. Teslim onaylanmadan satıcıya aktarılmaz.',
            },
            {
              title: 'Trust Score',
              desc: 'Her kullanıcının güven puanı var. Başarılı satışlar puanı yükseltir, sorunlar düşürür.',
            },
            {
              title: 'Otomatik İade',
              desc: 'SLA süresinde teslim olmazsa sistem otomatik iade başlatır. İnsan müdahalesi gerekmez.',
            },
            {
              title: 'Bilet Koruması',
              desc: 'PDF biletler watermark ile korunur. Tekrar kullanım ve sahtecilik anında tespit edilir.',
            },
          ].map((feature, i) => (
            <div key={i} className="bg-zinc-950 p-10 md:p-12">
              <h3 className="font-display text-xl font-semibold tracking-tight mb-3">
                {feature.title}
              </h3>
              <p className="text-zinc-500 text-[15px] leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ───────────────────────── PRICING ───────────────────────── */
function Pricing() {
  return (
    <section id="ucretlendirme" className="bg-white py-32 md:py-44">
      <div className="max-w-[980px] mx-auto px-6">
        <div className="text-center mb-20 md:mb-28">
          <p className="text-[13px] tracking-[0.2em] uppercase text-zinc-400 font-medium mb-4">
            Ücretlendirme
          </p>
          <h2 className="font-display text-[clamp(2rem,5vw,3.5rem)] font-bold tracking-[-0.02em] leading-[1.1]">
            Basit ve şeffaf.
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {/* Under 500 */}
          <div className="text-center p-10 md:p-12 rounded-2xl bg-zinc-50 border border-zinc-100">
            <p className="text-[13px] tracking-[0.15em] uppercase text-zinc-400 font-medium mb-2">İşlem tutarı</p>
            <p className="font-display text-4xl font-bold tracking-tight mb-1">&lt; ₺500</p>
            <div className="w-8 h-px bg-zinc-200 mx-auto my-6" />
            <p className="text-zinc-500 text-[15px] leading-relaxed">
              Küçük bir hizmet bedeli <span className="text-zinc-900 font-medium">alıcıdan</span> alınır.
              Satıcıya kesinti yok.
            </p>
          </div>

          {/* Over 500 */}
          <div className="text-center p-10 md:p-12 rounded-2xl bg-zinc-50 border border-zinc-100">
            <p className="text-[13px] tracking-[0.15em] uppercase text-zinc-400 font-medium mb-2">İşlem tutarı</p>
            <p className="font-display text-4xl font-bold tracking-tight mb-1">≥ ₺500</p>
            <div className="w-8 h-px bg-zinc-200 mx-auto my-6" />
            <p className="text-zinc-500 text-[15px] leading-relaxed">
              Komisyon <span className="text-zinc-900 font-medium">satıcıdan</span> kesilir.
              Alıcıya ek ücret yok.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ───────────────────────── CTA ───────────────────────── */
function CTA() {
  return (
    <section className="bg-black text-white py-32 md:py-44">
      <div className="max-w-[980px] mx-auto px-6 text-center">
        <h2 className="font-display text-[clamp(2rem,5vw,3.5rem)] font-bold tracking-[-0.02em] leading-[1.1] mb-6">
          Güvenli bilet alışverişi
          <br />
          <span className="text-zinc-600">seni bekliyor.</span>
        </h2>
        <p className="text-zinc-500 text-lg mb-10 max-w-md mx-auto">
          Şu an Özyeğin Üniversitesi topluluğuna özel.
        </p>
        <Link
          href="/auth/register"
          className="group inline-flex items-center gap-2 bg-white text-black font-medium text-[15px] px-7 py-3.5 rounded-full transition-all hover:bg-zinc-100 active:scale-[0.97]"
        >
          Ücretsiz Kayıt Ol
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </section>
  )
}

/* ───────────────────────── FOOTER ───────────────────────── */
function Footer() {
  return (
    <footer className="bg-zinc-950 border-t border-zinc-800/50">
      <div className="max-w-[980px] mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-[12px] text-zinc-500">
            <span>© 2026 Biletly</span>
            <span className="text-zinc-800">|</span>
            <Link href="#" className="hover:text-zinc-300 transition-colors">Gizlilik</Link>
            <Link href="#" className="hover:text-zinc-300 transition-colors">Kullanım Koşulları</Link>
            <Link href="#" className="hover:text-zinc-300 transition-colors">İletişim</Link>
          </div>
          <div className="flex items-center gap-1.5">
            <Ticket className="w-3.5 h-3.5 text-zinc-600" strokeWidth={2.2} />
            <span className="font-display text-[13px] font-medium text-zinc-600">biletly</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

/* ───────────────────────── PAGE ───────────────────────── */
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
