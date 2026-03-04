-- ============================================
-- Biletly C2C Bilet Pazaryeri — Database Schema
-- ============================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1) PROFILES (extends Supabase auth.users)
-- ============================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  trust_score INTEGER DEFAULT 50 CHECK (trust_score >= 0 AND trust_score <= 100),
  total_sales INTEGER DEFAULT 0,
  total_purchases INTEGER DEFAULT 0,
  is_verified BOOLEAN DEFAULT FALSE,
  is_banned BOOLEAN DEFAULT FALSE,
  listing_limit INTEGER DEFAULT 5,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- 2) EVENTS
-- ============================================
CREATE TYPE public.event_category AS ENUM ('concert', 'sport', 'theatre', 'festival', 'other');

CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  category public.event_category NOT NULL DEFAULT 'other',
  city TEXT NOT NULL,
  venue TEXT NOT NULL,
  event_date TIMESTAMPTZ NOT NULL,
  source_platform TEXT,
  image_url TEXT,
  created_by UUID REFERENCES public.profiles(id),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_events_date ON public.events(event_date);
CREATE INDEX idx_events_city ON public.events(city);
CREATE INDEX idx_events_category ON public.events(category);

-- ============================================
-- 3) LISTINGS
-- ============================================
CREATE TYPE public.listing_type AS ENUM ('transfer', 'pdf_qr');
CREATE TYPE public.listing_status AS ENUM ('active', 'reserved', 'sold', 'expired', 'cancelled');

CREATE TABLE public.listings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  seller_id UUID NOT NULL REFERENCES public.profiles(id),
  listing_type public.listing_type NOT NULL DEFAULT 'transfer',
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  section_info TEXT,
  asking_price NUMERIC(10,2) NOT NULL CHECK (asking_price > 0),
  min_price NUMERIC(10,2) CHECK (min_price IS NULL OR min_price > 0),
  status public.listing_status NOT NULL DEFAULT 'active',
  proof_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_listings_event ON public.listings(event_id);
CREATE INDEX idx_listings_seller ON public.listings(seller_id);
CREATE INDEX idx_listings_status ON public.listings(status);

-- ============================================
-- 4) OFFERS
-- ============================================
CREATE TYPE public.offer_status AS ENUM ('pending', 'accepted', 'rejected', 'countered', 'expired');

CREATE TABLE public.offers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  buyer_id UUID NOT NULL REFERENCES public.profiles(id),
  amount NUMERIC(10,2) NOT NULL CHECK (amount > 0),
  status public.offer_status NOT NULL DEFAULT 'pending',
  counter_amount NUMERIC(10,2),
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '2 hours'),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_offers_listing ON public.offers(listing_id);
CREATE INDEX idx_offers_buyer ON public.offers(buyer_id);

-- ============================================
-- 5) ORDERS
-- ============================================
CREATE TYPE public.order_status AS ENUM (
  'pending_payment', 'paid_escrow', 'delivered', 'completed', 'refunded', 'disputed'
);
CREATE TYPE public.delivery_type AS ENUM ('transfer', 'pdf_qr');
CREATE TYPE public.fee_payer AS ENUM ('buyer', 'seller');

CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id UUID NOT NULL REFERENCES public.listings(id),
  offer_id UUID NOT NULL REFERENCES public.offers(id),
  buyer_id UUID NOT NULL REFERENCES public.profiles(id),
  seller_id UUID NOT NULL REFERENCES public.profiles(id),
  amount NUMERIC(10,2) NOT NULL,
  platform_fee NUMERIC(10,2) NOT NULL DEFAULT 0,
  fee_paid_by public.fee_payer NOT NULL,
  status public.order_status NOT NULL DEFAULT 'pending_payment',
  delivery_type public.delivery_type NOT NULL,
  delivery_proof_url TEXT,
  ticket_file_url TEXT,
  delivered_at TIMESTAMPTZ,
  confirmed_at TIMESTAMPTZ,
  sla_deadline TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_orders_buyer ON public.orders(buyer_id);
CREATE INDEX idx_orders_seller ON public.orders(seller_id);
CREATE INDEX idx_orders_status ON public.orders(status);

-- ============================================
-- 6) DISPUTES
-- ============================================
CREATE TYPE public.dispute_status AS ENUM ('open', 'under_review', 'resolved_refund', 'resolved_payout', 'closed');

CREATE TABLE public.disputes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES public.orders(id),
  opened_by UUID NOT NULL REFERENCES public.profiles(id),
  reason TEXT NOT NULL,
  evidence_url TEXT,
  status public.dispute_status NOT NULL DEFAULT 'open',
  resolution_note TEXT,
  resolved_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 7) ANALYTICS EVENTS
-- ============================================
CREATE TABLE public.analytics_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_name TEXT NOT NULL,
  user_id UUID REFERENCES public.profiles(id),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_analytics_event_name ON public.analytics_events(event_name);
CREATE INDEX idx_analytics_created ON public.analytics_events(created_at);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

-- Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Events
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Events viewable by everyone"
  ON public.events FOR SELECT
  USING (is_active = true);

CREATE POLICY "Authenticated users can create events"
  ON public.events FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Listings
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Active listings viewable by everyone"
  ON public.listings FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create listings"
  ON public.listings FOR INSERT
  WITH CHECK (auth.uid() = seller_id);

CREATE POLICY "Sellers can update own listings"
  ON public.listings FOR UPDATE
  USING (auth.uid() = seller_id);

-- Offers
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own offers"
  ON public.offers FOR SELECT
  USING (auth.uid() = buyer_id OR auth.uid() IN (
    SELECT seller_id FROM public.listings WHERE id = listing_id
  ));

CREATE POLICY "Authenticated users can create offers"
  ON public.offers FOR INSERT
  WITH CHECK (auth.uid() = buyer_id);

CREATE POLICY "Involved parties can update offers"
  ON public.offers FOR UPDATE
  USING (auth.uid() = buyer_id OR auth.uid() IN (
    SELECT seller_id FROM public.listings WHERE id = listing_id
  ));

-- Orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own orders"
  ON public.orders FOR SELECT
  USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

CREATE POLICY "System can create orders"
  ON public.orders FOR INSERT
  WITH CHECK (auth.uid() = buyer_id);

CREATE POLICY "Involved parties can update orders"
  ON public.orders FOR UPDATE
  USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

-- Disputes
ALTER TABLE public.disputes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own disputes"
  ON public.disputes FOR SELECT
  USING (auth.uid() = opened_by OR auth.uid() IN (
    SELECT buyer_id FROM public.orders WHERE id = order_id
    UNION
    SELECT seller_id FROM public.orders WHERE id = order_id
  ));

CREATE POLICY "Users can create disputes for their orders"
  ON public.disputes FOR INSERT
  WITH CHECK (auth.uid() = opened_by);

-- Analytics (insert only for authenticated)
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can insert analytics"
  ON public.analytics_events FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- ============================================
-- UPDATED_AT TRIGGER
-- ============================================
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON public.events FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_listings_updated_at BEFORE UPDATE ON public.listings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_offers_updated_at BEFORE UPDATE ON public.offers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_disputes_updated_at BEFORE UPDATE ON public.disputes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
