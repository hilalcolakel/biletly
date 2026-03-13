export type UserRole = 'buyer' | 'seller' | 'admin'
export type ListingType = 'transfer' | 'pdf_qr'
export type ListingStatus = 'active' | 'reserved' | 'sold' | 'expired' | 'cancelled'
export type OfferStatus = 'pending' | 'accepted' | 'rejected' | 'countered' | 'expired'
export type OrderStatus = 'pending_payment' | 'paid_escrow' | 'delivered' | 'completed' | 'refunded' | 'disputed'
export type DeliveryType = 'transfer' | 'pdf_qr'
export type KycStatus = 'pending' | 'approved' | 'rejected'
export type LegalDocumentType = 'kvkk' | 'terms' | 'seller_agreement' | 'privacy'
export type KycDocumentType = 'id_card' | 'passport' | 'driver_license' | 'student_id'

export interface Profile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  phone: string | null
  role: UserRole
  trust_score: number
  total_sales: number
  total_purchases: number
  is_verified: boolean
  is_banned: boolean
  listing_limit: number
  // Campus
  campus_name: string | null
  campus_email: string | null
  campus_verified: boolean
  campus_verified_at: string | null
  // KYC
  kyc_status: KycStatus
  kyc_submitted_at: string | null
  // KVKK
  kvkk_accepted: boolean
  kvkk_accepted_at: string | null
  kvkk_version: string | null
  // Seller agreement
  seller_agreement_accepted: boolean
  seller_agreement_version: string | null
  created_at: string
  updated_at: string
}

export interface LegalDocument {
  id: string
  type: LegalDocumentType
  version: string
  title: string
  content: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface CampusRule {
  id: string
  campus_name: string
  email_domain: string
  invite_code: string | null
  is_active: boolean
  max_users: number | null
  created_at: string
  updated_at: string
}

export interface KycSubmission {
  id: string
  user_id: string
  document_type: KycDocumentType
  document_url: string
  status: KycStatus
  reviewed_by: string | null
  review_note: string | null
  created_at: string
  reviewed_at: string | null
  // Joined
  user?: Profile
}

export interface Event {
  id: string
  title: string
  category: 'concert' | 'sport' | 'theatre' | 'festival' | 'other'
  city: string
  venue: string
  event_date: string
  description: string | null
  artist: string | null
  slug: string | null
  min_ticket_price: number | null
  max_ticket_price: number | null
  tags: string[]
  source_platform: string | null
  image_url: string | null
  created_by: string
  is_active: boolean
  created_at: string
  updated_at: string
  // Joined
  constraints?: EventConstraint
}

export interface EventCategory {
  id: string
  name: string
  slug: string
  icon: string
  color: string
  sort_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface EventConstraint {
  id: string
  event_id: string
  allowed_delivery_types: string[]
  max_ticket_price: number | null
  min_seller_trust_score: number
  max_listings_per_seller: number
  requires_proof: boolean
  notes: string | null
  created_at: string
  updated_at: string
}

export interface Listing {
  id: string
  event_id: string
  seller_id: string
  listing_type: ListingType
  quantity: number
  section_info: string | null
  asking_price: number
  min_price: number | null
  status: ListingStatus
  proof_url: string | null
  created_at: string
  updated_at: string
  // Joined
  event?: Event
  seller?: Profile
}

export interface Offer {
  id: string
  listing_id: string
  buyer_id: string
  amount: number
  status: OfferStatus
  counter_amount: number | null
  created_at: string
  updated_at: string
  // Joined
  listing?: Listing
  buyer?: Profile
}

export interface Order {
  id: string
  listing_id: string
  offer_id: string
  buyer_id: string
  seller_id: string
  amount: number
  platform_fee: number
  fee_paid_by: 'buyer' | 'seller'
  status: OrderStatus
  delivery_type: DeliveryType
  delivery_proof_url: string | null
  ticket_file_url: string | null
  delivered_at: string | null
  confirmed_at: string | null
  created_at: string
  updated_at: string
}
