'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { 
  BuildingOfficeIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Modal, ModalContent, ModalFooter, ModalHeader, ModalTitle } from '@/components/ui/modal'

interface Room {
  id: string
  name: string
  type: string
  status: 'available' | 'occupied' | 'maintenance'
  capacity: number
  price: number
}

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [newRoom, setNewRoom] = useState<Partial<Room>>({
    name: '',
    type: '',
    status: 'available',
    capacity: 1,
    price: 0
  })

  useEffect(() => {
    loadRooms()
  }, [])

  const loadRooms = async () => {
    try {
      const { data, error } = await supabase
        .from('rooms')
        .select('*')

      if (error) throw error
      setRooms(data || [])
    } catch (err) {
      setError('Error al cargar las habitaciones')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateRoom = async () => {
    try {
      const { data, error } = await supabase
        .from('rooms')
        .insert(newRoom)
        .select()
        .single()

      if (error) throw error
      setRooms([...rooms, data])
      setShowModal(false)
      setNewRoom({
        name: '',
        type: '',
        status: 'available',
        capacity: 1,
        price: 0
      })
    } catch (err) {
      console.error('Error al crear la habitación:', err)
    }
  }

  const handleUpdateRoom = async (room: Room) => {
    // Implementar lógica de actualización de habitación
  }

  const handleDeleteRoom = async (room: Room) => {
    // Implementar lógica de eliminación de habitación
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Inventario de Habitaciones
          </h1>
          <Button
            variant="primary"
            onClick={() => setShowModal(true)}
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Agregar Habitación
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <p>Cargando habitaciones...</p>
        </div>
      ) : error ? (
        <div className="text-center py-8 text-red-600">
          <p>{error}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <Card key={room.id}>
              <CardContent>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {room.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {room.type} - {room.capacity} personas
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Estado: {room.status}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleUpdateRoom(room)}
                    >
                      <PencilIcon className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteRoom(room)}
                    >
                      <TrashIcon className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Modal para crear nueva habitación */}
      <Modal open={showModal} onClose={() => setShowModal(false)}>
        <ModalHeader>
          <ModalTitle>Agregar Habitación</ModalTitle>
        </ModalHeader>
        <ModalContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre
              </label>
              <Input
                type="text"
                value={newRoom.name || ''}
                onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo
              </label>
              <Select
                value={newRoom.type || ''}
                onValueChange={(value) => setNewRoom({ ...newRoom, type: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Estándar</SelectItem>
                  <SelectItem value="deluxe">Deluxe</SelectItem>
                  <SelectItem value="suite">Suite</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado
              </label>
              <Select
                value={newRoom.status || 'available'}
                onValueChange={(value) => setNewRoom({ ...newRoom, status: value as Room['status'] })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Disponible</SelectItem>
                  <SelectItem value="occupied">Ocupada</SelectItem>
                  <SelectItem value="maintenance">En mantenimiento</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Capacidad
              </label>
              <Input
                type="number"
                min={1}
                value={newRoom.capacity || 1}
                onChange={(e) => setNewRoom({ ...newRoom, capacity: parseInt(e.target.value) })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Precio
              </label>
              <Input
                type="number"
                min={0}
                value={newRoom.price || 0}
                onChange={(e) => setNewRoom({ ...newRoom, price: parseFloat(e.target.value) })}
              />
            </div>
          </div>
        </ModalContent>
        <ModalFooter>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleCreateRoom}>
            Guardar
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  )
}
