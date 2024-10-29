'use client'

import { useState } from 'react'
import { 
  CalendarDaysIcon,
  UserGroupIcon,
  UserIcon,
  UserPlusIcon,
  MinusIcon,
  PlusIcon,
  ClockIcon
} from '@heroicons/react/24/outline'
import DateRangePicker from './DateRangePicker'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface SearchAvailabilityProps {
  onNext: () => void
  onUpdate: (data: any) => void
  initialData: {
    checkIn: string
    checkOut: string
    adults: number
    children: number
  }
}

export default function SearchAvailability({
  onNext,
  onUpdate,
  initialData
}: SearchAvailabilityProps) {
  const [dateRange, setDateRange] = useState({
    startDate: initialData.checkIn ? new Date(initialData.checkIn) : null,
    endDate: initialData.checkOut ? new Date(initialData.checkOut) : null
  })
  
  const [guests, setGuests] = useState({
    adults: initialData.adults || 1,
    children: initialData.children || 0
  })

  const calculateNights = () => {
    if (!dateRange.startDate || !dateRange.endDate) return 0
    return Math.ceil(
      (dateRange.endDate.getTime() - dateRange.startDate.getTime()) / 
      (1000 * 60 * 60 * 24)
    )
  }

  const handleGuestsChange = (type: 'adults' | 'children', operation: 'add' | 'subtract') => {
    setGuests(prev => ({
      ...prev,
      [type]: operation === 'add' ? prev[type] + 1 : Math.max(type === 'adults' ? 1 : 0, prev[type] - 1)
    }))
  }

  const handleSearch = () => {
    if (dateRange.startDate && dateRange.endDate) {
      onUpdate({
        checkIn: dateRange.startDate.toISOString(),
        checkOut: dateRange.endDate.toISOString(),
        adults: guests.adults,
        children: guests.children
      })
      onNext()
    }
  }

  return (
    <div className="space-y-6">
      {/* Fechas */}
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Seleccionar Fechas
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendario */}
          <div className="lg:col-span-2">
            <DateRangePicker
              value={dateRange}
              onChange={setDateRange}
            />
          </div>

          {/* Resumen de fechas */}
          <div className="space-y-4">
            {/* Resumen de fechas seleccionadas */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-900 mb-3">
                Resumen de Fechas
              </h3>
              <div className="space-y-3">
                <div className="flex items-center text-sm">
                  <CalendarDaysIcon className="w-4 h-4 text-gray-400 mr-2" />
                  <div>
                    <p className="text-gray-600">Check-in</p>
                    <p className="font-medium">
                      {dateRange.startDate 
                        ? format(dateRange.startDate, 'PPP', { locale: es })
                        : '-'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center text-sm">
                  <CalendarDaysIcon className="w-4 h-4 text-gray-400 mr-2" />
                  <div>
                    <p className="text-gray-600">Check-out</p>
                    <p className="font-medium">
                      {dateRange.endDate 
                        ? format(dateRange.endDate, 'PPP', { locale: es })
                        : '-'}
                    </p>
                  </div>
                </div>
                {calculateNights() > 0 && (
                  <div className="flex items-center text-sm">
                    <ClockIcon className="w-4 h-4 text-gray-400 mr-2" />
                    <div>
                      <p className="text-gray-600">Duración</p>
                      <p className="font-medium">{calculateNights()} noches</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Información de check-in/out */}
            <div className="bg-indigo-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-indigo-900 mb-2">
                Información
              </h3>
              <ul className="text-sm text-indigo-700 space-y-1">
                <li>• Check-in desde las 15:00</li>
                <li>• Check-out hasta las 12:00</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Huéspedes */}
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Número de Huéspedes
        </h2>
        <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-4">
          {/* Adultos */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <UserIcon className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">Adultos</p>
                <p className="text-xs text-gray-500">13+ años</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleGuestsChange('adults', 'subtract')}
                className="p-1 rounded-full hover:bg-gray-100"
                disabled={guests.adults <= 1}
              >
                <MinusIcon className="w-5 h-5 text-gray-400" />
              </button>
              <span className="w-8 text-center text-gray-900 font-medium">
                {guests.adults}
              </span>
              <button
                onClick={() => handleGuestsChange('adults', 'add')}
                className="p-1 rounded-full hover:bg-gray-100"
                disabled={guests.adults >= 10}
              >
                <PlusIcon className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>

          {/* Niños */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <UserPlusIcon className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">Niños</p>
                <p className="text-xs text-gray-500">2-12 años</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleGuestsChange('children', 'subtract')}
                className="p-1 rounded-full hover:bg-gray-100"
                disabled={guests.children <= 0}
              >
                <MinusIcon className="w-5 h-5 text-gray-400" />
              </button>
              <span className="w-8 text-center text-gray-900 font-medium">
                {guests.children}
              </span>
              <button
                onClick={() => handleGuestsChange('children', 'add')}
                className="p-1 rounded-full hover:bg-gray-100"
                disabled={guests.children >= 6}
              >
                <PlusIcon className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Botón de búsqueda */}
      <div className="flex justify-end">
        <button
          onClick={handleSearch}
          disabled={!dateRange.startDate || !dateRange.endDate}
          className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Buscar Disponibilidad
        </button>
      </div>
    </div>
  )
}

