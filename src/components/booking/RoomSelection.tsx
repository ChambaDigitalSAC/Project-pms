'use client'

import { useState, useEffect } from 'react'
import { UsersIcon, HomeIcon } from '@heroicons/react/24/outline'
import { getAvailableRooms } from '@/lib/api'

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

interface RoomSelectionProps {
  searchCriteria: {
    checkIn: string
    checkOut: string
    adults: number
    children: number
  }
  onNext: () => void
  onBack: () => void
  onUpdate: (data: any) => void
  initialData?: {
    roomId?: number
  }
}

export default function RoomSelection({ 
  searchCriteria,
  onNext,
  onBack,
  onUpdate,
  initialData = {}
}: RoomSelectionProps) {
  const [rooms, setRooms] = useState<Room[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedRoom, setSelectedRoom] = useState<number | null>(initialData?.roomId || null)

  useEffect(() => {
    async function loadRooms() {
      try {
        const availableRooms = await getAvailableRooms(
          searchCriteria.checkIn,
          searchCriteria.checkOut,
          searchCriteria.adults,
          searchCriteria.children
        )
        setRooms(availableRooms)
        setError(null)
      } catch (error) {
        setError('Error al cargar las habitaciones disponibles')
        console.error('Error loading rooms:', error)
      } finally {
        setLoading(false)
      }
    }

    loadRooms()
  }, [searchCriteria])

  const calculateNights = () => {
    const checkIn = new Date(searchCriteria.checkIn)
    const checkOut = new Date(searchCriteria.checkOut)
    return Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))
  }

  const handleContinue = () => {
    if (selectedRoom) {
      const selectedRoomData = rooms.find(room => room.id === selectedRoom)
      if (selectedRoomData) {
        onUpdate({
          roomId: selectedRoom,
          ...selectedRoomData,
          nights: calculateNights(),
          totalPrice: selectedRoomData.price * calculateNights()
        })
        onNext()
      }
    }
  }

  return (
    <div className="space-y-6">
      {/* Search Summary */}
      <div className="bg-indigo-50 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-sm">
              <p className="text-indigo-900 font-medium">Fechas seleccionadas:</p>
              <p className="text-indigo-700">
                {new Date(searchCriteria.checkIn).toLocaleDateString()} - {new Date(searchCriteria.checkOut).toLocaleDateString()}
                <span className="ml-2 text-indigo-600 font-medium">
                  ({calculateNights()} noches)
                </span>
              </p>
            </div>
            <div className="text-sm">
              <p className="text-indigo-900 font-medium">Huéspedes:</p>
              <p className="text-indigo-700">
                {searchCriteria.adults} adultos, {searchCriteria.children} niños
              </p>
            </div>
          </div>
          <button
            onClick={onBack}
            className="text-sm text-indigo-600 hover:text-indigo-700"
          >
            Modificar búsqueda
          </button>
        </div>
      </div>

      {/* Available Rooms */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-6">
            Habitaciones Disponibles
          </h2>
          
          {loading ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Cargando habitaciones disponibles...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-500">{error}</p>
            </div>
          ) : rooms.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">
                No hay habitaciones disponibles para los criterios seleccionados.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {rooms.map((room) => (
                <div
                  key={room.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    selectedRoom === room.id
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-200 hover:border-indigo-200'
                  }`}
                  onClick={() => setSelectedRoom(room.id)}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-32 h-24 bg-gray-200 rounded-lg overflow-hidden">
                      {/* Aquí iría la imagen de la habitación */}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium text-gray-900">
                          {room.name}
                        </h3>
                        <div className="text-right">
                          <p className="text-lg font-semibold text-indigo-600">
                            ${room.price}
                            <span className="text-sm text-gray-500">/noche</span>
                          </p>
                          <p className="text-sm text-indigo-600 font-medium">
                            Total: ${room.price * calculateNights()}
                          </p>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-500 mt-1">
                        {room.description}
                      </p>
                      
                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center text-sm text-gray-500">
                          <UsersIcon className="w-4 h-4 mr-1" />
                          Hasta {room.max_adults} adultos
                          {room.max_children > 0 && `, ${room.max_children} niños`}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <HomeIcon className="w-4 h-4 mr-1" />
                          {room.size}
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mt-3">
                        {room.amenities.map((amenity) => (
                          <span
                            key={amenity}
                            className="px-2 py-1 rounded-full bg-gray-100 text-gray-600 text-xs"
                          >
                            {amenity}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Atrás
        </button>
        <button
          onClick={handleContinue}
          disabled={!selectedRoom}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continuar
        </button>
      </div>
    </div>
  )
}
