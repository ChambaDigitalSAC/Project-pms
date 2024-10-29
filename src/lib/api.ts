import { supabase } from './supabase'
import { Booking, TimelineItem } from '@/types/database'

// Definir interfaces
interface Room {
  id: number
  name: string
  type: string
  description: string
  price: number
  max_adults: number
  max_children: number
  size: string
  amenities: string[]
  images: string[]
}

type ApiError = {
  message: string
  status?: number
}

export async function getAvailableRooms(
  checkIn: string,
  checkOut: string,
  adults: number,
  children: number
): Promise<Room[]> {
  try {
    // Primero, obtener las habitaciones reservadas para las fechas seleccionadas
    const { data: bookedRooms, error: bookingsError } = await supabase
      .from('bookings')
      .select('room_id')
      .or(`check_in.lte.${checkOut},check_out.gte.${checkIn}`)

    if (bookingsError) {
      throw new Error(bookingsError.message)
    }

    // Obtener los IDs de las habitaciones reservadas
    const bookedRoomIds = bookedRooms?.map(booking => booking.room_id) || []

    // Obtener las habitaciones disponibles
    const { data: availableRooms, error: roomsError } = await supabase
      .from('rooms')
      .select('*')
      .gte('max_adults', adults)
      .gte('max_children', children)
      .not('id', 'in', bookedRoomIds.length > 0 ? `(${bookedRoomIds.join(',')})` : '(0)')

    if (roomsError) {
      throw new Error(roomsError.message)
    }

    return availableRooms || []
  } catch (err) {
    const error = err as Error
    throw new Error(`Error al buscar habitaciones disponibles: ${error.message}`)
  }
}

// Función auxiliar para verificar si hay solapamiento de fechas
function datesOverlap(
  start1: string,
  end1: string,
  start2: string,
  end2: string
): boolean {
  const s1 = new Date(start1).getTime()
  const e1 = new Date(end1).getTime()
  const s2 = new Date(start2).getTime()
  const e2 = new Date(end2).getTime()
  return s1 <= e2 && e1 >= s2
}

// Función para crear una habitación de prueba
export async function createTestRoom(): Promise<Room> {
  try {
    const roomData = {
      name: 'Habitación de Prueba',
      type: 'standard',
      description: 'Esta es una habitación de prueba',
      price: 100,
      max_adults: 2,
      max_children: 1,
      size: '25m²',
      amenities: ['TV', 'WiFi', 'Minibar'],
      images: ['/room1.jpg']
    }

    const { data, error } = await supabase
      .from('rooms')
      .insert(roomData)
      .select()
      .single()

    if (error) {
      throw new Error(error.message)
    }

    return data as Room
  } catch (err) {
    const error = err as Error
    throw new Error(`Error al crear la habitación de prueba: ${error.message}`)
  }
}

// Función para obtener todas las habitaciones
export async function getAllRooms(): Promise<Room[]> {
  try {
    const { data, error } = await supabase
      .from('rooms')
      .select('*')
      .order('price')

    if (error) {
      throw new Error(error.message)
    }

    return data as Room[] || []
  } catch (err) {
    const error = err as Error
    throw new Error(`Error al obtener las habitaciones: ${error.message}`)
  }
}

// Función para crear una habitación
export async function createRoom(roomData: Omit<Room, 'id'>): Promise<Room> {
  try {
    const { data, error } = await supabase
      .from('rooms')
      .insert(roomData)
      .select()
      .single()

    if (error) {
      throw new Error(error.message)
    }

    return data as Room
  } catch (err) {
    const error = err as Error
    throw new Error(`Error al crear la habitación: ${error.message}`)
  }
}

// Función para actualizar una habitación
export async function updateRoom(id: number, roomData: Partial<Room>): Promise<Room> {
  try {
    const { data, error } = await supabase
      .from('rooms')
      .update(roomData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw new Error(error.message)
    }

    return data as Room
  } catch (err) {
    const error = err as Error
    throw new Error(`Error al actualizar la habitación: ${error.message}`)
  }
}

// Función para eliminar una habitación
export async function deleteRoom(id: number): Promise<void> {
  try {
    const { error } = await supabase
      .from('rooms')
      .delete()
      .eq('id', id)

    if (error) {
      throw new Error(error.message)
    }
  } catch (err) {
    const error = err as Error
    throw new Error(`Error al eliminar la habitación: ${error.message}`)
  }
}

// Función para crear una reserva
export async function createBooking(bookingData: {
  room_id: number
  check_in: string
  check_out: string
  adults: number
  children: number
  total_price: number
}) {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .insert(bookingData)
      .select()
      .single()

    if (error) {
      throw new Error(error.message)
    }

    return data
  } catch (err) {
    const error = err as Error
    throw new Error(`Error al crear la reserva: ${error.message}`)
  }
}

export async function getBookingDetails(id: string) {
  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      guest:guests(*),
      room:rooms(*),
      timeline:booking_timeline(*)
    `)
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

export async function updateBookingStatus(id: string, status: Booking['status']) {
  const { data, error } = await supabase
    .from('bookings')
    .update({ status })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateBookingNotes(
  id: string, 
  { internalNotes, guestNotes }: { internalNotes?: string, guestNotes?: string }
) {
  const updates: Partial<Booking> = {}
  if (internalNotes !== undefined) updates.internal_notes = internalNotes
  if (guestNotes !== undefined) updates.guest_notes = guestNotes

  const { data, error } = await supabase
    .from('bookings')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function uploadPaymentReceipt(bookingId: string, file: File) {
  const fileExt = file.name.split('.').pop()
  const fileName = `${bookingId}-${Date.now()}.${fileExt}`
  const filePath = `payment-receipts/${fileName}`

  const { error: uploadError } = await supabase.storage
    .from('receipts')
    .upload(filePath, file)

  if (uploadError) throw uploadError

  const { data: { publicUrl } } = supabase.storage
    .from('receipts')
    .getPublicUrl(filePath)

  const { error: dbError } = await supabase
    .from('payment_receipts')
    .insert({
      booking_id: bookingId,
      file_url: publicUrl,
      file_name: fileName
    })

  if (dbError) throw dbError

  return publicUrl
}

export async function addTimelineItem(
  bookingId: string,
  actionType: string,
  description: string
) {
  const { data, error } = await supabase
    .from('booking_timeline')
    .insert({
      booking_id: bookingId,
      action_type: actionType,
      description
    })
    .select()
    .single()

  if (error) throw error
  return data
}
