export interface Room {
  id: number
  name: string
  type: string
  description: string | null
  price: number
  max_adults: number
  max_children: number
  size: string | null
  amenities: string[]
  images: string[]
  created_at: string
  updated_at: string
}

export interface Booking {
  id: string
  guest_id: number
  room_id: number
  check_in: string
  check_out: string
  adults: number
  children: number
  total_amount: number
  paid_amount: number
  status: 'pending' | 'confirmed' | 'cancelled'
  checked_in: boolean
  checked_out: boolean
  internal_notes: string | null
  guest_notes: string | null
  created_at: string
  updated_at: string
}

export interface Guest {
  id: number
  first_name: string
  last_name: string
  email: string
  phone: string
  address: string
  city: string
  country: string
  created_at: string
}

export interface Extra {
  id: number
  name: string
  description: string | null
  price: number
  type: 'single' | 'daily'
  created_at: string
}

export interface BookingExtra {
  id: number
  booking_id: number
  extra_id: number
  quantity: number
  price: number
  created_at: string
}

export interface Payment {
  id: number
  booking_id: number
  amount: number
  method: 'card' | 'cash'
  status: 'pending' | 'completed' | 'failed'
  payment_date: string | null
  created_at: string
}

export interface TimelineItem {
  id: number
  booking_id: string
  action_type: string
  description: string
  created_at: string
}

export interface PaymentReceipt {
  id: number
  booking_id: string
  file_url: string
  file_name: string
  uploaded_at: string
}

export interface BookingEmail {
  id: number
  booking_id: string
  subject: string
  content: string
  sent_at: string
}

