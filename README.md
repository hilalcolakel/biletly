# Biletly — C2C Bilet Pazaryeri

Konser, spor ve tiyatro biletlerini güvenle al ve sat. Emanet ödeme sistemi ile korunan bilet pazaryeri.

## Tech Stack

- **Frontend:** Next.js 14 (App Router) + Tailwind CSS
- **Backend:** Supabase (Auth, PostgreSQL, Storage, Realtime)
- **Hosting:** Vercel
- **Ödeme:** iyzico (yakında)

## Kurulum

```bash
# Bağımlılıkları yükle
npm install

# Development server
npm run dev
```

Tarayıcıda [http://localhost:3000](http://localhost:3000) adresini aç.

## Environment Variables

`.env.example` dosyasını `.env.local` olarak kopyala ve Supabase bilgilerini doldur.

## Veritabanı

Migration dosyası: `supabase/migrations/001_initial_schema.sql`

Supabase SQL Editor'da çalıştır.
