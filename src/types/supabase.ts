export interface Database {
  public: {
    Tables: {
      bookings: {
        Row: {
          id: string
          created_at: string
          check_in: string
          check_out: string
          guest_id: string
          room_id: string
          status: 'pending' | 'confirmed' | 'cancelled' | 'checked_in' | 'checked_out'
          total_amount: number
          notes: string | null
        }
        Insert: Omit<Database['public']['Tables']['bookings']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['bookings']['Insert']>
      }
      rooms: {
        Row: {
          id: string
          name: string
          type: string
          status: 'available' | 'occupied' | 'maintenance'
          capacity: number
          price: number
        }
        Insert: Omit<Database['public']['Tables']['rooms']['Row'], 'id'>
        Update: Partial<Database['public']['Tables']['rooms']['Insert']>
      }
      guests: {
        Row: {
          id: string
          first_name: string
          last_name: string
          email: string
          phone: string
          document_type: string
          document_number: string
        }
        Insert: Omit<Database['public']['Tables']['guests']['Row'], 'id'>
        Update: Partial<Database['public']['Tables']['guests']['Insert']>
      }
    }
  }
}
