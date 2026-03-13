-- ============================================
-- Biletly — Phase 2: Event Catalog & Category Management
-- ============================================

-- 1) Extend events table with new columns
ALTER TABLE public.events
  ADD COLUMN description TEXT,
  ADD COLUMN artist TEXT,
  ADD COLUMN slug TEXT UNIQUE,
  ADD COLUMN min_ticket_price NUMERIC(10,2),
  ADD COLUMN max_ticket_price NUMERIC(10,2),
  ADD COLUMN tags TEXT[] DEFAULT '{}';

CREATE INDEX idx_events_slug ON public.events(slug);
CREATE INDEX idx_events_artist ON public.events(artist);

-- 2) Event categories table (dynamic, replaces enum for management)
CREATE TABLE public.event_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  icon TEXT DEFAULT '🎫',
  color TEXT DEFAULT '#8b5cf6',
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed default categories matching existing enum
INSERT INTO public.event_categories (name, slug, icon, color, sort_order) VALUES
  ('Konser', 'concert', '🎵', '#8b5cf6', 1),
  ('Spor', 'sport', '⚽', '#f97316', 2),
  ('Tiyatro', 'theatre', '🎭', '#10b981', 3),
  ('Festival', 'festival', '🎉', '#ec4899', 4),
  ('Diğer', 'other', '🎫', '#6b7280', 5);

-- 3) Event constraints table
CREATE TABLE public.event_constraints (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  allowed_delivery_types TEXT[] DEFAULT '{transfer,pdf_qr}',
  max_ticket_price NUMERIC(10,2),
  min_seller_trust_score INTEGER DEFAULT 0,
  max_listings_per_seller INTEGER DEFAULT 5,
  requires_proof BOOLEAN DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(event_id)
);

CREATE INDEX idx_event_constraints_event ON public.event_constraints(event_id);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

-- Event categories: readable by all, writable by admin
ALTER TABLE public.event_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Event categories viewable by everyone"
  ON public.event_categories FOR SELECT
  USING (true);

CREATE POLICY "Only admins can manage event categories"
  ON public.event_categories FOR ALL
  USING (
    auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin')
  );

-- Event constraints: readable by all, writable by admin
ALTER TABLE public.event_constraints ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Event constraints viewable by everyone"
  ON public.event_constraints FOR SELECT
  USING (true);

CREATE POLICY "Only admins can manage event constraints"
  ON public.event_constraints FOR ALL
  USING (
    auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin')
  );

-- ============================================
-- UPDATED_AT TRIGGERS
-- ============================================
CREATE TRIGGER update_event_categories_updated_at
  BEFORE UPDATE ON public.event_categories
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_event_constraints_updated_at
  BEFORE UPDATE ON public.event_constraints
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
