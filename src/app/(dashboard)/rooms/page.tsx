'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusIcon } from "@heroicons/react/24/outline"

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

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Inventario de Habitaciones</h1>
        <Button onClick={() => {}}>
          <PlusIcon className="h-5 w-5 mr-2" />
          Agregar Habitación
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Habitaciones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-gray-50">
                <tr>
                  <th className="px-6 py-3">Nombre</th>
                  <th className="px-6 py-3">Tipo</th>
                  <th className="px-6 py-3">Estado</th>
                  <th className="px-6 py-3">Capacidad</th>
                  <th className="px-6 py-3">Precio</th>
                  <th className="px-6 py-3">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {rooms.map((room) => (
                  <tr key={room.id} className="bg-white border-b">
                    <td className="px-6 py-4">{room.name}</td>
                    <td className="px-6 py-4">{room.type}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        room.status === 'available' 
                          ? 'bg-green-100 text-green-800'
                          : room.status === 'occupied'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {room.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">{room.capacity}</td>
                    <td className="px-6 py-4">${room.price}</td>
                    <td className="px-6 py-4">
                      <Button variant="ghost" size="sm">Editar</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
