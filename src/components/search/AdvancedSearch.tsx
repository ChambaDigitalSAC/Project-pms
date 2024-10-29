'use client'

import { useState } from 'react'
import { 
  MagnifyingGlassIcon, 
  FunnelIcon,
  XMarkIcon,
  CalendarDaysIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  TagIcon
} from '@heroicons/react/24/outline'

interface FilterState {
  dateRange: string
  roomType: string
  status: string
  priceRange: string
  guests: string
}

export default function AdvancedSearch() {
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<FilterState>({
    dateRange: '',
    roomType: '',
    status: '',
    priceRange: '',
    guests: ''
  })

  const quickFilters = [
    { id: 'today', label: 'Check-in Hoy', icon: CalendarDaysIcon },
    { id: 'tomorrow', label: 'Check-in Mañana', icon: CalendarDaysIcon },
    { id: 'pending', label: 'Pendientes', icon: UserGroupIcon },
    { id: 'confirmed', label: 'Confirmadas', icon: TagIcon },
  ]

  const filterOptions = {
    roomType: ['Estándar', 'Superior', 'Suite', 'Villa'],
    status: ['Pendiente', 'Confirmada', 'Check-in', 'Check-out', 'Cancelada'],
    priceRange: ['$0-100', '$100-200', '$200-300', '$300+'],
    guests: ['1-2', '3-4', '5+']
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      {/* Search Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Buscador de Reservas</h2>
        <div className="flex items-center gap-2">
          <div className="relative flex-1 md:w-96">
            <input
              type="text"
              placeholder="Buscar por nombre, habitación o ID..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          </div>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              showFilters 
                ? 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            {showFilters ? <XMarkIcon className="w-5 h-5" /> : <FunnelIcon className="w-5 h-5" />}
            <span>Filtros</span>
          </button>
        </div>
      </div>

      {/* Quick Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        {quickFilters.map((filter) => (
          <button
            key={filter.id}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-700 text-sm hover:bg-indigo-100 transition-colors"
          >
            <filter.icon className="w-4 h-4" />
            <span>{filter.label}</span>
          </button>
        ))}
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Date Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fechas
              </label>
              <input
                type="date"
                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Room Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Habitación
              </label>
              <select 
                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={filters.roomType}
                onChange={(e) => setFilters({...filters, roomType: e.target.value})}
              >
                <option value="">Todos</option>
                {filterOptions.roomType.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado
              </label>
              <select 
                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
              >
                <option value="">Todos</option>
                {filterOptions.status.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rango de Precio
              </label>
              <select 
                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={filters.priceRange}
                onChange={(e) => setFilters({...filters, priceRange: e.target.value})}
              >
                <option value="">Todos</option>
                {filterOptions.priceRange.map(range => (
                  <option key={range} value={range}>{range}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 mt-4">
            <button 
              onClick={() => setFilters({
                dateRange: '',
                roomType: '',
                status: '',
                priceRange: '',
                guests: ''
              })}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
            >
              Limpiar Filtros
            </button>
            <button className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
              Aplicar Filtros
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
