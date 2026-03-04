import Link from 'next/link'
import { Shield, ArrowRight, Ticket, Users, Zap, Lock, Star, ChevronRight, Search, BadgeCheck, Banknote } from 'lucide-react'

function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-brand-600 to-brand-800 rounded-lg flex items-center justify-center">
            <Ticket className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
          <span className="font-display font-bold text-xl tracking-tight">biletly</span>
        </Link>
        <div className="hidden md:flex items-center gap-8">
          <Link href="#nasil-calisir" className="text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors">
            Nasıl Çalışır?
          </Link>
          <Link href="#guvenlik" className="text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors">
            Güvenlik
          </Link>
          <Link href="#sss" className="text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors">
            SSS
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/auth/login"
            className="text-sm font-medium text-zinc-700 hover:text-zinc-900 transition-colors px-4 py-2"
          >
            Giriş Yap
          </Link>
          <Link
            href="/auth/register"
            className="text-sm font-semibold text-white bg-zinc-900 hover:bg-zinc-800 px-5 py-2.5 rounded-full transition-all hover:shadow-lg hover:shadow-zinc-900/20 active:scale-[0.98]"
          >
            Kayıt Ol
          </Link>
        </div>
      </div>
    </nav>
  )
}

function Hero() {
  return (
    <section className="relative min-h-[92vh] flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-brand-50/80 via-white to-white" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-accent/10 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-brand-200/30 to-transparent rounded-full blur-3xl" />

      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)',
        backgroundSize: '48px 48px'
      }} />

      <div className="relative max-w-7xl mx-auto px-6 pt-24 pb-16 w-full">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="animate-fade-in-up inline-flex items-center gap-2 bg-brand-100/60 border border-brand-200/60 text-brand-800 px-4 py-1.5 rounded-full text-sm font-medium mb-8">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Özyeğin Üniversitesi Pilotu Aktif
          </div>

          {/* Headline */}
          <h1 className="animate-fade-in-up font-display text-5xl md:text-7xl font-extrabold leading-[1.05] tracking-tight mb-6" style={{ animationDelay: '0.1s' }}>
            Biletini güvenle
            <br />
            <span className="bg-gradient-to-r from-brand-600 via-brand-500 to-accent bg-clip-text text-transparent">
              al ve sat.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="animate-fade-in-up text-lg md:text-xl text-zinc-600 max-w-xl leading-relaxed mb-10" style={{ animationDelay: '0.2s' }}>
            Konser, spor ve tiyatro biletlerini teklif-pazarlık ile satışa çıkar.
            Emanet ödeme ile hem alıcı hem satıcı güvende.
          </p>

          {/* CTA Buttons */}
          <div className="animate-fade-in-up flex flex-col sm:flex-row gap-4 mb-16" style={{ animationDelay: '0.3s' }}>
            <Link
              href="/auth/register"
              className="group inline-flex items-center justify-center gap-2 bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-700 hover:to-brand-800 text-white font-semibold px-8 py-4 rounded-full text-base transition-all hover:shadow-xl hover:shadow-brand-600/25 active:scale-[0.98]"
            >
              Hemen Başla
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="#nasil-calisir"
              className="inline-flex items-center justify-center gap-2 bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-700 font-medium px-8 py-4 rounded-full text-base transition-all hover:shadow-md"
            >
              Nasıl Çalışır?
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="animate-fade-in-up flex flex-wrap gap-6 text-sm text-zinc-500" style={{ animationDelay: '0.4s' }}>
            <span className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-brand-600" />
              Emanet ödeme koruması
            </span>
            <span className="flex items-center gap-2">
              <BadgeCheck className="w-4 h-4 text-brand-600" />
              Doğrulanmış kullanıcılar
            </span>
            <span className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-brand-600" />
              Güvenli transfer
            </span>
          </div>
        </div>

        {/* Floating card mockup */}
        <div className="hidden lg:block absolute right-8 top-1/2 -translate-y-1/2 w-[380px]">
          <div className="animate-fade-in relative" style={{ animationDelay: '0.5s' }}>
            {/* Event card */}
            <div className="bg-white rounded-2xl shadow-2xl shadow-zinc-900/10 border border-zinc-100 p-5 rotate-[-2deg] hover:rotate-0 transition-transform duration-500">
              <div className="w-full h-40 bg-gradient-to-br from-brand-600 to-brand-800 rounded-xl mb-4 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-20" style={{
                  backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)',
                  backgroundSize: '30px 30px'
                }} />
                <Ticket className="w-12 h-12 text-white/80" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-medium rounded-md">Konser</span>
                  <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-md flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    Transfer
                  </span>
                </div>
                <h3 className="font-display font-bold text-lg">Mabel Matiz — İstanbul</h3>
                <p className="text-zinc-500 text-sm">15 Nisan 2026 • Kuruçeşme Arena</p>
                <div className="flex items-center justify-between pt-3 border-t border-zinc-100">
                  <div>
                    <p className="text-xs text-zinc-400">Fiyat aralığı</p>
                    <p className="font-display font-bold text-xl text-brand-700">₺450 – ₺1.200</p>
                  </div>
                  <button className="bg-zinc-900 text-white text-sm font-medium px-4 py-2 rounded-full hover:bg-zinc-800 transition-colors">
                    Teklif Ver
                  </button>
                </div>
              </div>
            </div>

            {/* Mini notification */}
            <div className="absolute -bottom-6 -left-8 bg-white rounded-xl shadow-lg shadow-zinc-900/10 border border-zinc-100 px-4 py-3 animate-slide-in-right flex items-center gap-3" style={{ animationDelay: '0.8s' }}>
              <div className="w-9 h-9 bg-green-100 rounded-full flex items-center justify-center">
                <BadgeCheck className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-zinc-900">Teslim onaylandı!</p>
                <p className="text-xs text-zinc-500">Ödeme satıcıya aktarıldı</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function HowItWorks() {
  const steps = [
    {
      number: '01',
      icon: Search,
      title: 'Etkinlik Bul',
      description: 'Konser, spor ve tiyatro etkinliklerini keşfet. İstediğin etkinliğin biletlerini listele.',
      color: 'bg-blue-50 text-blue-600',
    },
    {
      number: '02',
      icon: Banknote,
      title: 'Teklif Ver & Pazarlık',
      description: 'Satıcıya teklif gönder. Karşı teklif al, anlaş. Fiyat sana uygun olana kadar pazarlık et.',
      color: 'bg-amber-50 text-amber-600',
    },
    {
      number: '03',
      icon: Lock,
      title: 'Güvenli Öde',
      description: 'Ödemen emanete alınır. Bilet sana ulaşana kadar para güvende, kimseye aktarılmaz.',
      color: 'bg-emerald-50 text-emerald-600',
    },
    {
      number: '04',
      icon: Ticket,
      title: 'Bileti Al',
      description: 'Satıcı transfer eder, sen onayla. Otomatik koruma: teslim olmazsa otomatik iade.',
      color: 'bg-purple-50 text-purple-600',
    },
  ]

  return (
    <section id="nasil-calisir" className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-sm font-semibold text-brand-600 tracking-wide uppercase">Nasıl Çalışır?</span>
          <h2 className="font-display text-4xl md:text-5xl font-extrabold mt-3 tracking-tight">
            4 adımda güvenli bilet alışverişi
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step) => (
            <div key={step.number} className="group relative bg-surface-50 hover:bg-white rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-zinc-900/5 border border-transparent hover:border-zinc-200">
              <div className="flex items-center justify-between mb-5">
                <div className={`w-12 h-12 rounded-xl ${step.color} flex items-center justify-center transition-transform group-hover:scale-110`}>
                  <step.icon className="w-6 h-6" />
                </div>
                <span className="font-display text-3xl font-extrabold text-zinc-100 group-hover:text-zinc-200 transition-colors">
                  {step.number}
                </span>
              </div>
              <h3 className="font-display font-bold text-lg mb-2">{step.title}</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Security() {
  const features = [
    {
      icon: Shield,
      title: 'Emanet Ödeme',
      description: 'Paran bilet eline geçene kadar emanette. Sorun olursa otomatik iade.',
    },
    {
      icon: BadgeCheck,
      title: 'Trust Score Sistemi',
      description: 'Her kullanıcının güven puanı var. Yüksek puanlı satıcılar rozet kazanır.',
    },
    {
      icon: Zap,
      title: 'Otomatik Koruma',
      description: 'SLA süresinde teslim olmazsa otomatik iade. 7/24 çalışan koruma sistemi.',
    },
    {
      icon: Lock,
      title: 'Watermark & Takip',
      description: 'PDF biletler watermark ile korunur. Sahte bilet kullanımı anında tespit edilir.',
    },
  ]

  return (
    <section id="guvenlik" className="py-24 bg-zinc-950 text-white relative overflow-hidden noise-overlay">
      {/* Decorative elements */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-brand-600/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[100px]" />

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-sm font-semibold text-brand-400 tracking-wide uppercase">Güvenlik</span>
          <h2 className="font-display text-4xl md:text-5xl font-extrabold mt-3 tracking-tight">
            Güvenin her adımda
            <br />
            <span className="text-zinc-500">yanında.</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {features.map((feature, i) => (
            <div
              key={i}
              className="group bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] hover:border-white/[0.12] rounded-2xl p-6 transition-all duration-300"
            >
              <div className="w-12 h-12 bg-brand-600/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-brand-600/30 transition-colors">
                <feature.icon className="w-6 h-6 text-brand-400" />
              </div>
              <h3 className="font-display font-bold text-lg mb-2">{feature.title}</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Commission() {
  return (
    <section className="py-24 bg-surface-50 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-sm font-semibold text-brand-600 tracking-wide uppercase">Ücretlendirme</span>
          <h2 className="font-display text-4xl md:text-5xl font-extrabold mt-3 tracking-tight">
            Şeffaf ve adil fiyatlandırma
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* Under 500 */}
          <div className="bg-white rounded-2xl p-8 border border-zinc-200 hover:shadow-xl hover:shadow-zinc-900/5 transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-zinc-500">İşlem tutarı</p>
                <p className="font-display font-bold text-lg">&lt; ₺500</p>
              </div>
            </div>
            <div className="bg-blue-50 rounded-xl p-4">
              <p className="text-sm text-blue-800">
                <span className="font-semibold">Alıcı</span> küçük bir hizmet bedeli öder.
                Satıcıdan kesinti yok.
              </p>
            </div>
          </div>

          {/* Over 500 */}
          <div className="bg-white rounded-2xl p-8 border border-zinc-200 hover:shadow-xl hover:shadow-zinc-900/5 transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center">
                <Banknote className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-zinc-500">İşlem tutarı</p>
                <p className="font-display font-bold text-lg">≥ ₺500</p>
              </div>
            </div>
            <div className="bg-emerald-50 rounded-xl p-4">
              <p className="text-sm text-emerald-800">
                <span className="font-semibold">Satıcı</span>dan komisyon kesilir.
                Alıcıya ek ücret yok.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function CTA() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <div className="bg-gradient-to-br from-brand-600 to-brand-800 rounded-3xl p-12 md:p-16 relative overflow-hidden">
          {/* Decorative */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/20 rounded-full blur-3xl" />

          <div className="relative">
            <h2 className="font-display text-3xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
              Biletini aramaya başla
            </h2>
            <p className="text-brand-100 text-lg mb-8 max-w-lg mx-auto">
              Şu an Özyeğin Üniversitesi topluluğuna özel. Hemen katıl, güvenli bilet alışverişine başla.
            </p>
            <Link
              href="/auth/register"
              className="group inline-flex items-center gap-2 bg-white text-brand-700 font-bold px-8 py-4 rounded-full text-base transition-all hover:shadow-xl hover:bg-brand-50 active:scale-[0.98]"
            >
              Ücretsiz Kayıt Ol
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="bg-zinc-950 text-zinc-400 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gradient-to-br from-brand-500 to-brand-700 rounded-lg flex items-center justify-center">
              <Ticket className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-display font-bold text-white text-lg">biletly</span>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <Link href="#" className="hover:text-white transition-colors">Gizlilik</Link>
            <Link href="#" className="hover:text-white transition-colors">Kullanım Koşulları</Link>
            <Link href="#" className="hover:text-white transition-colors">İletişim</Link>
          </div>
          <p className="text-sm">© 2026 Biletly. Tüm hakları saklıdır.</p>
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
      <Commission />
      <CTA />
      <Footer />
    </main>
  )
}
