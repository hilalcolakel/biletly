export type UserRole = 'buyer' | 'seller' | 'admin'
export type ListingType = 'transfer' | 'pdf_qr'
export type ListingStatus = 'active' | 'reserved' | 'sold' | 'expired' | 'cancelled'
export type OfferStatus = 'pending' | 'accepted' | 'rejected' | 'countered' | 'expired'
export type OrderStatus = 'pending_payment' | 'paid_escrow' | 'delivered' | 'completed' | 'refunded' | 'disputed'
export type DeliveryType = 'transfer' | 'pdf_qr'

export interface Profile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  trust_score: number
  total_sales: number
  total_purchases: number
  is_verified: boolean
  created_at: string
  updated_at: string
}

export interface Event {
  id: string
  title: string
  category: 'concert' | 'sport' | 'theatre' | 'festival' | 'other'
  city: string
  venue: string
  event_date: string
  source_platform: string | null
  image_url: string | null
  created_by: string
  is_active: boolean
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
