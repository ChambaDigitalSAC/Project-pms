'use client'

import { useState } from 'react'
import { 
  ChevronRightIcon, 
  EllipsisHorizontalIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

// Función helper para formatear fechas de manera consistente
const formatDate = (dateString: string) => {
  return format(new Date(dateString), 'dd/MM/yyyy', { locale: es })
}

interface Reservation {
  id: string
  guest: string
  room: string
  checkIn: string
  checkOut: string
  status: 'confirmed' | 'pending' | 'cancelled' | 'in-progress'
  total: number
  guests: number
  nights: number
}

const mockReservations: Reservation[] = [
  {
    id: 'RES-001',
    guest: 'Juan Pérez',
    room: '101 - Suite Deluxe',
    checkIn: '2024-01-20',
    checkOut: '2024-01-25',
    status: 'confirmed',
    total: 750,
    guests: 2,
    nights: 5
  },
  {
    id: 'RES-002',
    guest: 'María García',
    room: '205 - Standard',
    checkIn: '2024-01-21',
    checkOut: '2024-01-23',
    status: 'in-progress',
    total: 280,
    guests: 1,
    nights: 2
  },
  {
    id: 'RES-003',
    guest: 'Carlos López',
    room: '304 - Suite',
    checkIn: '2024-01-22',
    checkOut: '2024-01-26',
    status: 'pending',
    total: 620,
    guests: 3,
    nights: 4
  }
]

const statusStyles = {
  confirmed: {
    bg: 'bg-green-50',
    text: 'text-green-700',
    icon: CheckCircleIcon
  },
  pending: {
    bg: 'bg-yellow-50',
    text: 'text-yellow-700',
    icon: ClockIcon
  },
  cancelled: {
    bg: 'bg-red-50',
    text: 'text-red-700',
    icon: XCircleIcon
  },
  'in-progress': {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    icon: ArrowPathIcon
  }
}

export default function SearchResults() {
  const [selectedReservation, setSelectedReservation] = useState<string | null>(null)

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      {/* Results Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">
            Resultados de búsqueda
          </h3>
          <span className="text-sm text-gray-500">
            Mostrando {mockReservations.length} resultados
          </span>
        </div>
      </div>

      {/* Results Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Reserva
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Habitación
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Check-in/out
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {mockReservations.map((reservation) => {
              const StatusIcon = statusStyles[reservation.status].icon
              return (
                <tr 
                  key={reservation.id}
                  className={`hover:bg-gray-50 ${
                    selectedReservation === reservation.id ? 'bg-indigo-50' : ''
                  }`}
                  onClick={() => setSelectedReservation(reservation.id)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <div className="text-sm font-medium text-gray-900">
                        {reservation.guest}
                      </div>
                      <div className="text-sm text-gray-500">
                        {reservation.id}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <div className="text-sm text-gray-900">
                        {reservation.room}
                      </div>
                      <div className="text-sm text-gray-500">
                        {reservation.guests} huéspedes · {reservation.nights} noches
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <div className="text-sm text-gray-900">
                        {formatDate(reservation.checkIn)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatDate(reservation.checkOut)}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      statusStyles[reservation.status].bg
                    } ${statusStyles[reservation.status].text}`}>
                      <StatusIcon className="w-4 h-4 mr-1" />
                      {reservation.status === 'confirmed' && 'Confirmada'}
                      {reservation.status === 'pending' && 'Pendiente'}
                      {reservation.status === 'cancelled' && 'Cancelada'}
                      {reservation.status === 'in-progress' && 'En curso'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${reservation.total.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button className="text-indigo-600 hover:text-indigo-900">
                        Ver detalles
                      </button>
                      <button className="p-1 rounded-full hover:bg-gray-100">
                        <EllipsisHorizontalIcon className="w-5 h-5 text-gray-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <select className="border border-gray-200 rounded-lg text-sm px-2 py-1">
            <option>10 por página</option>
            <option>25 por página</option>
            <option>50 por página</option>
          </select>
          <span className="text-sm text-gray-500">
            Mostrando 1-3 de 3 resultados
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1 border border-gray-200 rounded-lg text-sm disabled:opacity-50">
            Anterior
          </button>
          <button className="px-3 py-1 border border-gray-200 rounded-lg text-sm disabled:opacity-50">
            Siguiente
          </button>
        </div>
      </div>
    </div>
  )
}
