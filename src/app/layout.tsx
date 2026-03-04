import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Biletly — Güvenli C2C Bilet Pazaryeri',
  description: 'Konser, spor ve tiyatro biletlerini güvenle al ve sat. Emanet ödeme sistemi ile korunan bilet pazaryeri.',
  keywords: ['bilet', 'konser bileti', 'spor bileti', 'bilet al', 'bilet sat', 'güvenli bilet'],
  openGraph: {
    title: 'Biletly — Güvenli C2C Bilet Pazaryeri',
    description: 'Konser, spor ve tiyatro biletlerini güvenle al ve sat.',
    url: 'https://biletly.co',
    siteName: 'Biletly',
    locale: 'tr_TR',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr">
      <body className="bg-white text-zinc-900 antialiased">
        {children}
      </body>
    </html>
  )
}
