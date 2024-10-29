'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import React from 'react'
import { 
  CheckCircleIcon,
  CalendarDaysIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  SparklesIcon,
  CreditCardIcon,
  PencilSquareIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { supabase } from '@/lib/supabase'

const formatDate = (dateString: string | null) => {
  if (!dateString) return '-'
  try {
    return format(new Date(dateString), 'PPP', { locale: es })
  } catch (error) {
    return '-'
  }
}

interface Payment {
  method: string
  status: string
  total: number
}

interface BookingDetails {
  id: string
  room: {
    name: string
    description: string
    price: number
  }
  guest: {
    firstName: string
    lastName: string
    email: string
    phone: string
  }
  check_in: string
  check_out: string
  adults: number
  children: number
  extras: Array<{
    name: string
    quantity: number
    price: number
  }>
  payment?: Payment
  status: string
  created_at: string
  total_price: number
}

// Este es el componente de la página que recibe los params
export default function BookingConfirmationPage({ params }: { params: { id: string } }) {
  return <BookingConfirmation id={params.id} />
}

// Este es el componente que maneja la lógica y el estado
function BookingConfirmation({ id }: { id: string }) {
  const router = useRouter()
  const [booking, setBooking] = useState<BookingDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadBookingDetails() {
      try {
        const { data, error } = await supabase
          .from('bookings')
          .select(`
            *,
            room:rooms(*),
            guest:guests(*),
            extras:booking_extras(*)
          `)
          .eq('id', id)
          .single()

        if (error) throw error
        setBooking(data)
      } catch (err) {
        setError('Error al cargar los detalles de la reserva')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadBookingDetails()
  }, [id])

  const calculateNights = () => {
    if (!booking) return 0
    try {
      const checkIn = new Date(booking.check_in)
      const checkOut = new Date(booking.check_out)
      return Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))
    } catch (error) {
      return 0
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
      </div>
    )
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Reserva no encontrada'}</p>
          <button
            onClick={() => router.push('/booking/new')}
            className="text-indigo-600 hover:text-indigo-700"
          >
            Volver al motor de reservas
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-shrink-0">
            <CheckCircleIcon className="w-12 h-12 text-green-500" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              ¡Reserva Confirmada!
            </h1>
            <p className="text-gray-500">
              Número de reserva: #{booking.id}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <CalendarDaysIcon className="w-4 h-4" />
          <span>Reserva realizada el {formatDate(booking.created_at)}</span>
        </div>
      </div>

      {/* Booking Details */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Guest Information */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <UserGroupIcon className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-medium text-gray-900">Información del Huésped</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Nombre completo</p>
              <p className="font-medium">{booking.guest.firstName} {booking.guest.lastName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{booking.guest.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Teléfono</p>
              <p className="font-medium">{booking.guest.phone}</p>
            </div>
          </div>
        </div>

        {/* Stay Details */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <BuildingOfficeIcon className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-medium text-gray-900">Detalles de la Estancia</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Check-in</p>
              <p className="font-medium">{formatDate(booking.check_in)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Check-out</p>
              <p className="font-medium">{formatDate(booking.check_out)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Duración</p>
              <p className="font-medium">{calculateNights()} noches</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Huéspedes</p>
              <p className="font-medium">
                {booking.adults} adultos{booking.children > 0 && `, ${booking.children} niños`}
              </p>
            </div>
          </div>
        </div>

        {/* Room Details */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <BuildingOfficeIcon className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-medium text-gray-900">Habitación</h2>
          </div>
          <div>
            <h3 className="font-medium">{booking.room.name}</h3>
            <p className="text-gray-500 mt-1">{booking.room.description}</p>
            <p className="text-indigo-600 font-medium mt-2">
              ${booking.room.price} x {calculateNights()} noches = ${booking.room.price * calculateNights()}
            </p>
          </div>
        </div>

        {/* Extras */}
        {booking.extras.length > 0 && (
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <SparklesIcon className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg font-medium text-gray-900">Servicios Adicionales</h2>
            </div>
            <div className="space-y-2">
              {booking.extras.map((extra, index) => (
                <div key={index} className="flex justify-between">
                  <span className="text-gray-600">
                    {extra.name} x{extra.quantity}
                  </span>
                  <span className="font-medium">${extra.price * extra.quantity}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Payment */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <CreditCardIcon className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-medium text-gray-900">Pago</h2>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500">Método de pago</p>
              <p className="font-medium">
                {booking.payment?.method === 'card' ? 'Tarjeta de crédito' : 'Efectivo'}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Estado: {' '}
                <span className={`font-medium ${
                  booking.payment?.status === 'completed' 
                    ? 'text-green-600' 
                    : 'text-yellow-600'
                }`}>
                  {booking.payment?.status === 'completed' ? 'Pagado' : 'Pendiente'}
                </span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-gray-500">Total</p>
              <p className="text-xl font-semibold text-indigo-600">
                ${booking.total_price}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-6 flex justify-between">
        <button
          onClick={() => router.push('/booking/new')}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          <ArrowPathIcon className="w-5 h-5" />
          Nueva Reserva
        </button>
        <button
          onClick={() => router.push(`/booking/edit/${booking.id}`)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          <PencilSquareIcon className="w-5 h-5" />
          Editar Reserva
        </button>
      </div>
    </div>
  )
}
