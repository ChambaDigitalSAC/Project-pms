'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { seedRooms } from '@/lib/seedData'

export default function TestPage() {
  const [connectionStatus, setConnectionStatus] = useState<string>('Verificando conexión...')
  const [rooms, setRooms] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Probar conexión
  useEffect(() => {
    async function checkConnection() {
      try {
        const { data, error } = await supabase.from('rooms').select('count')
        if (error) throw error
        setConnectionStatus('✅ Conexión exitosa con Supabase')
      } catch (error) {
        setConnectionStatus('❌ Error de conexión con Supabase')
        console.error('Error:', error)
      }
    }

    checkConnection()
  }, [])

  // Cargar habitaciones
  const loadRooms = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('rooms')
        .select('*')
      
      if (error) throw error
      setRooms(data || [])
    } catch (error) {
      console.error('Error al cargar habitaciones:', error)
      setError('Error al cargar las habitaciones')
    } finally {
      setLoading(false)
    }
  }

  // Cargar habitaciones al montar el componente
  useEffect(() => {
    loadRooms()
  }, [])

  // Función para insertar una habitación de prueba
  const insertTestRoom = async () => {
    try {
      const { data, error } = await supabase
        .from('rooms')
        .insert({
          name: 'Habitación de Prueba',
          type: 'standard',
          description: 'Esta es una habitación de prueba',
          price: 100,
          max_adults: 2,
          max_children: 1,
          size: '25m²',
          amenities: ['TV', 'WiFi', 'Minibar'],
          images: ['/room1.jpg']
        })
        .select()

      if (error) throw error
      alert('Habitación creada exitosamente')
      loadRooms() // Recargar la lista
    } catch (error) {
      console.error('Error al insertar:', error)
      alert('Error al crear la habitación')
    }
  }

  const handleSeedData = async () => {
    try {
      await seedRooms()
      alert('Datos de prueba insertados correctamente')
      loadRooms() // Recargar la lista de habitaciones
    } catch (error) {
      alert('Error al insertar datos de prueba')
      console.error(error)
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Página de Prueba DB</h1>

      {/* Estado de la conexión */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <h2 className="font-semibold mb-2">Estado de la Conexión:</h2>
        <p className="text-gray-700">{connectionStatus}</p>
      </div>

      {/* Acciones de prueba */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <h2 className="font-semibold mb-4">Acciones de Prueba:</h2>
        <div className="space-x-4">
          <button
            onClick={insertTestRoom}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Insertar Habitación de Prueba
          </button>
          <button
            onClick={loadRooms}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Recargar Habitaciones
          </button>
          <button
            onClick={handleSeedData}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Insertar Datos de Prueba
          </button>
        </div>
      </div>

      {/* Lista de habitaciones */}
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="font-semibold mb-4">Habitaciones en la Base de Datos:</h2>
        {loading ? (
          <p>Cargando habitaciones...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : rooms.length === 0 ? (
          <p>No hay habitaciones en la base de datos</p>
        ) : (
          <div className="space-y-4">
            {rooms.map((room) => (
              <div
                key={room.id}
                className="border rounded-lg p-4 hover:bg-gray-50"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{room.name}</h3>
                    <p className="text-sm text-gray-600">{room.description}</p>
                    <p className="text-sm text-gray-600">
                      Capacidad: {room.max_adults} adultos, {room.max_children} niños
                    </p>
                    <p className="text-sm text-gray-600">
                      Tamaño: {room.size}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {room.amenities?.map((amenity: string) => (
                        <span
                          key={amenity}
                          className="px-2 py-1 bg-gray-100 rounded-full text-xs"
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-lg font-semibold text-green-600">
                    ${room.price}/noche
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
