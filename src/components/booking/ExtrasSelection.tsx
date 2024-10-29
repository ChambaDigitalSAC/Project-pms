'use client'

import { useState } from 'react'
import { 
  SparklesIcon, 
  PlusIcon, 
  MinusIcon,
  WifiIcon,
  TruckIcon,
  ShoppingBagIcon,
  HeartIcon,
  CakeIcon,
  VehicleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline'

interface ExtrasSelectionProps {
  onNext: () => void
  onBack: () => void
  onUpdate: (data: any) => void
  initialData: any[]
}

const extraServices = [
  {
    id: 1,
    name: 'Traslado Aeropuerto',
    description: 'Servicio de transporte desde/hacia el aeropuerto',
    price: 45,
    icon: TruckIcon,
    type: 'single',
    category: 'transport'
  },
  {
    id: 2,
    name: 'Desayuno Premium',
    description: 'Desayuno buffet completo con opciones premium',
    price: 15,
    icon: CakeIcon,
    type: 'daily',
    category: 'food'
  },
  {
    id: 3,
    name: 'Internet Alta Velocidad',
    description: 'Conexión premium de alta velocidad',
    price: 10,
    icon: WifiIcon,
    type: 'daily',
    category: 'technology'
  },
  {
    id: 4,
    name: 'Servicio de Lavandería',
    description: 'Lavado y planchado de ropa',
    price: 25,
    icon: ArrowPathIcon,
    type: 'single',
    category: 'service'
  },
  {
    id: 5,
    name: 'Pack Romántico',
    description: 'Decoración especial, champagne y chocolates',
    price: 75,
    icon: HeartIcon,
    type: 'single',
    category: 'special'
  },
  {
    id: 6,
    name: 'Minibar Premium',
    description: 'Selección premium de bebidas y snacks',
    price: 40,
    icon: ShoppingBagIcon,
    type: 'single',
    category: 'food'
  }
]

const categories = [
  { id: 'all', name: 'Todos' },
  { id: 'transport', name: 'Transporte' },
  { id: 'food', name: 'Alimentación' },
  { id: 'technology', name: 'Tecnología' },
  { id: 'service', name: 'Servicios' },
  { id: 'special', name: 'Especiales' }
]

export default function ExtrasSelection({ 
  onNext, 
  onBack, 
  onUpdate, 
  initialData 
}: ExtrasSelectionProps) {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedExtras, setSelectedExtras] = useState<{[key: number]: number}>(
    initialData.reduce((acc: any, item: any) => {
      acc[item.id] = item.quantity || 0
      return acc
    }, {})
  )

  const filteredExtras = selectedCategory === 'all' 
    ? extraServices
    : extraServices.filter(extra => extra.category === selectedCategory)

  const handleQuantityChange = (extraId: number, change: number) => {
    setSelectedExtras(prev => {
      const newQuantity = (prev[extraId] || 0) + change
      if (newQuantity < 0) return prev
      
      return {
        ...prev,
        [extraId]: newQuantity
      }
    })
  }

  const handleContinue = () => {
    const selectedItems = Object.entries(selectedExtras)
      .filter(([_, quantity]) => quantity > 0)
      .map(([extraId, quantity]) => ({
        ...extraServices.find(extra => extra.id === Number(extraId)),
        quantity
      }))
    
    onUpdate(selectedItems)
    onNext()
  }

  const calculateTotal = () => {
    return Object.entries(selectedExtras).reduce((total, [extraId, quantity]) => {
      const extra = extraServices.find(e => e.id === Number(extraId))
      if (extra && quantity > 0) {
        return total + (extra.price * quantity)
      }
      return total
    }, 0)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <SparklesIcon className="w-6 h-6 text-indigo-600" />
            <h2 className="text-lg font-medium text-gray-900">
              Servicios Adicionales
            </h2>
          </div>
          
          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Extras Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredExtras.map((extra) => (
          <div
            key={extra.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-indigo-50">
                <extra.icon className="w-6 h-6 text-indigo-600" />
              </div>
              
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">
                      {extra.name}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {extra.description}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      ${extra.price}
                    </p>
                    <p className="text-xs text-gray-500">
                      {extra.type === 'daily' ? 'por día' : 'una vez'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleQuantityChange(extra.id, -1)}
                      className="p-1 rounded-full hover:bg-gray-100"
                      disabled={!selectedExtras[extra.id]}
                    >
                      <MinusIcon className="w-5 h-5 text-gray-400" />
                    </button>
                    <span className="text-gray-900 font-medium">
                      {selectedExtras[extra.id] || 0}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(extra.id, 1)}
                      className="p-1 rounded-full hover:bg-gray-100"
                    >
                      <PlusIcon className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>
                  
                  {selectedExtras[extra.id] > 0 && (
                    <p className="text-sm font-medium text-indigo-600">
                      ${extra.price * (selectedExtras[extra.id] || 0)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary and Navigation */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-gray-900 font-medium">Total Servicios Adicionales</span>
          <span className="text-lg font-semibold text-indigo-600">
            ${calculateTotal()}
          </span>
        </div>

        <div className="flex justify-between">
          <button
            onClick={onBack}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Atrás
          </button>
          <button
            onClick={handleContinue}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            Continuar
          </button>
        </div>
      </div>
    </div>
  )
}
