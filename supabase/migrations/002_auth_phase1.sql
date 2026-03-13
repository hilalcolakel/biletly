-- ============================================
-- Biletly — Phase 1: Authentication & Registration
-- ============================================

-- 1) User Role enum
CREATE TYPE public.user_role AS ENUM ('buyer', 'seller', 'admin');

-- 2) Extend profiles table
ALTER TABLE public.profiles
  ADD COLUMN phone TEXT UNIQUE,
  ADD COLUMN role public.user_role NOT NULL DEFAULT 'buyer',
  ADD COLUMN campus_name TEXT,
  ADD COLUMN campus_email TEXT,
  ADD COLUMN campus_verified BOOLEAN DEFAULT FALSE,
  ADD COLUMN campus_verified_at TIMESTAMPTZ,
  ADD COLUMN kyc_status TEXT DEFAULT 'pending' CHECK (kyc_status IN ('pending', 'approved', 'rejected')),
  ADD COLUMN kyc_submitted_at TIMESTAMPTZ,
  ADD COLUMN kvkk_accepted BOOLEAN DEFAULT FALSE,
  ADD COLUMN kvkk_accepted_at TIMESTAMPTZ,
  ADD COLUMN kvkk_version TEXT,
  ADD COLUMN seller_agreement_accepted BOOLEAN DEFAULT FALSE,
  ADD COLUMN seller_agreement_version TEXT;

-- 3) Legal documents table (KVKK, terms, seller agreement, privacy)
CREATE TABLE public.legal_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT NOT NULL CHECK (type IN ('kvkk', 'terms', 'seller_agreement', 'privacy')),
  version TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  is_active BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Only one active document per type
CREATE UNIQUE INDEX idx_legal_active_per_type
  ON public.legal_documents(type) WHERE is_active = TRUE;

CREATE INDEX idx_legal_type ON public.legal_documents(type);

-- 4) Campus rules table
CREATE TABLE public.campus_rules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campus_name TEXT NOT NULL,
  email_domain TEXT NOT NULL,
  invite_code TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  max_users INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_campus_domain ON public.campus_rules(email_domain);

-- 5) KYC submissions table
CREATE TABLE public.kyc_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL CHECK (document_type IN ('id_card', 'passport', 'driver_license', 'student_id')),
  document_url TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_by UUID REFERENCES public.profiles(id),
  review_note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ
);

CREATE INDEX idx_kyc_user ON public.kyc_submissions(user_id);
CREATE INDEX idx_kyc_status ON public.kyc_submissions(status);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

-- Legal documents: readable by all, writable by admin only
ALTER TABLE public.legal_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Legal documents viewable by everyone"
  ON public.legal_documents FOR SELECT
  USING (true);

CREATE POLICY "Only admins can manage legal documents"
  ON public.legal_documents FOR ALL
  USING (
    auth.uid() IN (
      SELECT id FROM public.profiles WHERE role = 'admin'
    )
  );

-- Campus rules: readable by all, writable by admin only
ALTER TABLE public.campus_rules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Campus rules viewable by everyone"
  ON public.campus_rules FOR SELECT
  USING (true);

CREATE POLICY "Only admins can manage campus rules"
  ON public.campus_rules FOR ALL
  USING (
    auth.uid() IN (
      SELECT id FROM public.profiles WHERE role = 'admin'
    )
  );

-- KYC submissions: user can view own, admin can view all
ALTER TABLE public.kyc_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own KYC submissions"
  ON public.kyc_submissions FOR SELECT
  USING (
    auth.uid() = user_id OR
    auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin')
  );

CREATE POLICY "Users can create own KYC submissions"
  ON public.kyc_submissions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Only admins can update KYC submissions"
  ON public.kyc_submissions FOR UPDATE
  USING (
    auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin')
  );

-- ============================================
-- UPDATED_AT TRIGGERS
-- ============================================
CREATE TRIGGER update_legal_documents_updated_at
  BEFORE UPDATE ON public.legal_documents
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_campus_rules_updated_at
  BEFORE UPDATE ON public.campus_rules
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ============================================
-- SEED: Default legal documents
-- ============================================
INSERT INTO public.legal_documents (type, version, title, content, is_active) VALUES
(
  'kvkk',
  '1.0',
  'Kişisel Verilerin Korunması Aydınlatma Metni',
  'Biletly platformu olarak, 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) kapsamında kişisel verilerinizin korunmasına önem veriyoruz.

## Veri Sorumlusu
Biletly Teknoloji A.Ş. olarak, kişisel verileriniz aşağıda açıklanan amaçlar doğrultusunda işlenmektedir.

## İşlenen Kişisel Veriler
- Kimlik bilgileri (ad, soyad)
- İletişim bilgileri (e-posta, telefon)
- Kampüs/öğrenci bilgileri
- Ödeme bilgileri
- İşlem geçmişi

## Kişisel Veri İşleme Amaçları
- Üyelik oluşturma ve yönetimi
- Bilet alım-satım işlemlerinin gerçekleştirilmesi
- Emanet ödeme sisteminin işletilmesi
- Güvenlik ve dolandırıcılık önleme
- Yasal yükümlülüklerin yerine getirilmesi

## Haklarınız
KVKK''nın 11. maddesi kapsamında; kişisel verilerinizin işlenip işlenmediğini öğrenme, işlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme, düzeltilmesini veya silinmesini isteme haklarına sahipsiniz.',
  TRUE
),
(
  'terms',
  '1.0',
  'Kullanım Koşulları',
  'Biletly platformunu kullanarak aşağıdaki koşulları kabul etmiş sayılırsınız.

## Genel Kurallar
1. Platform üzerinde yalnızca gerçek biletler satışa sunulabilir.
2. Sahte bilet satışı kesinlikle yasaktır ve yasal işlem başlatılır.
3. Tüm işlemler emanet ödeme sistemi üzerinden gerçekleştirilir.
4. Satıcılar, bilet teslimini belirlenen SLA süreleri içinde tamamlamakla yükümlüdür.

## Emanet Ödeme Sistemi
- Alıcının ödemesi, bilet teslimi onaylanana kadar emanet hesapta tutulur.
- Teslim onayı sonrasında ödeme satıcıya aktarılır.
- Uyuşmazlık durumunda platform hakem rolü üstlenir.

## Hesap Güvenliği
- Kullanıcılar hesap bilgilerinin güvenliğinden sorumludur.
- Şüpheli aktivite tespit edildiğinde hesap geçici olarak askıya alınabilir.',
  TRUE
),
(
  'seller_agreement',
  '1.0',
  'Satıcı Sözleşmesi',
  'Biletly platformunda satıcı olarak faaliyet göstermek için aşağıdaki koşulları kabul etmeniz gerekmektedir.

## Satıcı Yükümlülükleri
1. Yalnızca sahip olduğunuz biletleri satışa sunabilirsiniz.
2. Sahiplik kanıtı yüklemeniz gerekebilir.
3. Bilet teslimini etkinlik tipine göre belirlenen süre içinde tamamlamanız gerekmektedir.
4. Platform komisyonu satış tutarından düşülür.

## Komisyon ve Ödeme
- Platform komisyonu: %5 (satıcı tarafı)
- Ödeme, teslim onayından sonra 1-3 iş günü içinde IBAN hesabınıza aktarılır.
- Uyuşmazlık durumunda ödeme bekletilir.

## Cezai Yaptırımlar
- SLA ihlali: Trust Score düşüşü
- Sahte bilet: Hesap kalıcı kapatma + yasal işlem
- Tekrarlanan ihlaller: Geçici veya kalıcı satış yasağı',
  TRUE
);
