'use client'

import { 
  CalendarDaysIcon, 
  UserIcon, 
  BuildingOfficeIcon,
  SparklesIcon,
  CreditCardIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  IdentificationIcon
} from '@heroicons/react/24/outline'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface BookingSidebarProps {
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
      documentNumber?: string
      address?: string
      city?: string
      country?: string
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
    }
  }
  currentStep: string
}

export default function BookingSidebar({ bookingData, currentStep }: BookingSidebarProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return '-'
    try {
      return format(new Date(dateString), 'PPP', { locale: es })
    } catch (error) {
      return '-'
    }
  }

  const calculateNights = () => {
    if (!bookingData.search?.checkIn || !bookingData.search?.checkOut) return 0
    const checkIn = new Date(bookingData.search.checkIn)
    const checkOut = new Date(bookingData.search.checkOut)
    return Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))
  }

  const calculateTotal = () => {
    const nights = calculateNights()
    const roomTotal = (bookingData.room?.price || 0) * nights
    const extrasTotal = bookingData.extras?.reduce((total, extra) => 
      total + (extra.price * extra.quantity), 0) || 0
    return roomTotal + extrasTotal
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 divide-y divide-gray-200">
      {/* Fechas y Huéspedes */}
      {bookingData.search && (
        <div className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <CalendarDaysIcon className="w-5 h-5 text-indigo-600" />
            <h3 className="font-medium text-gray-900">Fechas</h3>
          </div>
          <div className="ml-7 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Check-in:</span>
              <span className="font-medium">{formatDate(bookingData.search.checkIn)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Check-out:</span>
              <span className="font-medium">{formatDate(bookingData.search.checkOut)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Noches:</span>
              <span className="font-medium">{calculateNights()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Huéspedes:</span>
              <span className="font-medium">
                {bookingData.search.adults} adultos
                {bookingData.search.children > 0 && `, ${bookingData.search.children} niños`}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Datos del Cliente */}
      {bookingData.guest && Object.keys(bookingData.guest).length > 0 && (
        <div className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <UserIcon className="w-5 h-5 text-indigo-600" />
            <h3 className="font-medium text-gray-900">Datos del Huésped</h3>
          </div>
          <div className="ml-7 space-y-2">
            <div className="space-y-1">
              <div className="text-sm font-medium">
                {bookingData.guest.firstName} {bookingData.guest.lastName}
              </div>
              {bookingData.guest.documentType && bookingData.guest.documentNumber && (
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <IdentificationIcon className="w-4 h-4" />
                  {bookingData.guest.documentType}: {bookingData.guest.documentNumber}
                </div>
              )}
              {bookingData.guest.email && (
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <EnvelopeIcon className="w-4 h-4" />
                  {bookingData.guest.email}
                </div>
              )}
              {bookingData.guest.phone && (
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <PhoneIcon className="w-4 h-4" />
                  {bookingData.guest.phone}
                </div>
              )}
              {(bookingData.guest.address || bookingData.guest.city || bookingData.guest.country) && (
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <MapPinIcon className="w-4 h-4" />
                  <span>
                    {[
                      bookingData.guest.address,
                      bookingData.guest.city,
                      bookingData.guest.country
                    ].filter(Boolean).join(', ')}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Habitación */}
      {bookingData.room && (
        <div className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <BuildingOfficeIcon className="w-5 h-5 text-indigo-600" />
            <h3 className="font-medium text-gray-900">Habitación</h3>
          </div>
          <div className="ml-7 space-y-2">
            <div className="text-sm font-medium">{bookingData.room.name}</div>
            <p className="text-sm text-gray-500">{bookingData.room.description}</p>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Precio por noche:</span>
              <span className="font-medium">${bookingData.room.price}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Total habitación:</span>
              <span className="font-medium">
                ${bookingData.room.price * calculateNights()}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Extras */}
      {bookingData.extras && bookingData.extras.length > 0 && (
        <div className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <SparklesIcon className="w-5 h-5 text-indigo-600" />
            <h3 className="font-medium text-gray-900">Servicios Adicionales</h3>
          </div>
          <div className="ml-7 space-y-2">
            {bookingData.extras.map((extra) => (
              <div key={extra.id} className="flex justify-between text-sm">
                <span className="text-gray-500">
                  {extra.name} (x{extra.quantity})
                </span>
                <span className="font-medium">${extra.price * extra.quantity}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Total */}
      <div className="p-4">
        <div className="flex justify-between items-center">
          <span className="font-medium text-gray-900">Total Reserva</span>
          <span className="text-xl font-semibold text-indigo-600">
            ${calculateTotal()}
          </span>
        </div>
      </div>

      {/* Estado actual */}
      <div className="p-4 bg-gray-50">
        <div className="text-sm text-gray-500">
          <span className="font-medium">Paso actual: </span>
          {currentStep === 'search' && 'Selección de fechas'}
          {currentStep === 'room' && 'Selección de habitación'}
          {currentStep === 'guest' && 'Datos del huésped'}
          {currentStep === 'extras' && 'Servicios adicionales'}
          {currentStep === 'payment' && 'Método de pago'}
          {currentStep === 'summary' && 'Confirmación'}
        </div>
      </div>
    </div>
  )
}
