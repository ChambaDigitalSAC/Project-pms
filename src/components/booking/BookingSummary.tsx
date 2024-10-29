'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'

interface BookingSummaryProps {
  bookingData: {
    search: {
      checkIn: string
      checkOut: string
      adults: number
      children: number
    }
    room: {
      id: number
      name: string
      price: number
      description: string
    } | null
    guest: {
      firstName?: string
      lastName?: string
      email?: string
      phone?: string
      documentType?: string
      document?: string
    }
    extras: Array<{
      id: number
      name: string
      price: number
      quantity: number
    }>
    payment: {
      method?: string
      cardNumber?: string
      cardHolder?: string
    }
  }
  onBack: () => void
  onConfirm: () => void
}

export default function BookingSummary({ 
  bookingData, 
  onBack, 
  onConfirm 
}: BookingSummaryProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const calculateNights = () => {
    if (!bookingData.search.checkIn || !bookingData.search.checkOut) return 0
    const checkIn = new Date(bookingData.search.checkIn)
    const checkOut = new Date(bookingData.search.checkOut)
    return Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))
  }

  const calculateTotal = () => {
    if (!bookingData.room || !bookingData.search.adults || !bookingData.search.children) return 0
    const roomPrice = bookingData.room.price
    const adults = bookingData.search.adults
    const children = bookingData.search.children
    const total = roomPrice * calculateNights() + bookingData.extras.reduce((total, extra) => total + extra.price * extra.quantity, 0)
    return total
  }

  const handleConfirm = async () => {
    try {
      setLoading(true)
      // Crear la reserva
      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .insert({
          room_id: bookingData.room.id,
          check_in: bookingData.search.checkIn,
          check_out: bookingData.search.checkOut,
          adults: bookingData.search.adults,
          children: bookingData.search.children,
          total_price: calculateTotal(),
          status: 'confirmed'
        })
        .select()
        .single()

      if (bookingError) throw bookingError

      // Crear el huésped
      await supabase.from('guests').insert({
        booking_id: booking.id,
        first_name: bookingData.guest.firstName,
        last_name: bookingData.guest.lastName,
        email: bookingData.guest.email,
        phone: bookingData.guest.phone
      })

      // Crear los extras si existen
      if (bookingData.extras.length > 0) {
        await supabase.from('booking_extras').insert(
          bookingData.extras.map(extra => ({
            booking_id: booking.id,
            extra_id: extra.id,
            quantity: extra.quantity,
            price: extra.price
          }))
        )
      }

      // Crear el pago
      await supabase.from('payments').insert({
        booking_id: booking.id,
        amount: calculateTotal(),
        method: bookingData.payment.method,
        status: 'pending'
      })

      // Redireccionar a la página de confirmación
      router.push(`/booking/confirmation/${booking.id}`)
    } catch (error) {
      console.error('Error al crear la reserva:', error)
      alert('Error al crear la reserva. Por favor, intente nuevamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleConfirm}
      disabled={loading}
      className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50"
    >
      {loading ? 'Procesando...' : 'Confirmar Reserva'}
    </button>
  )
}

