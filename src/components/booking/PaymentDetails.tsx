'use client'

import { useState } from 'react'
import { 
  CreditCardIcon, 
  BanknotesIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline'

interface PaymentDetailsProps {
  onNext: () => void
  onBack: () => void
  onUpdate: (data: any) => void
  initialData: any
}

const paymentMethods = [
  {
    id: 'card',
    name: 'Tarjeta de Crédito/Débito',
    icon: CreditCardIcon,
    description: 'Pago seguro con tarjeta'
  },
  {
    id: 'cash',
    name: 'Efectivo',
    icon: BanknotesIcon,
    description: 'Pago en efectivo al hacer check-in'
  }
]

export default function PaymentDetails({ 
  onNext, 
  onBack, 
  onUpdate, 
  initialData 
}: PaymentDetailsProps) {
  const [selectedMethod, setSelectedMethod] = useState(initialData.method || 'card')
  const [cardData, setCardData] = useState({
    cardNumber: initialData.cardNumber || '',
    cardHolder: initialData.cardHolder || '',
    expiryDate: initialData.expiryDate || '',
    cvv: initialData.cvv || ''
  })
  const [errors, setErrors] = useState<{[key: string]: string}>({})

  const validateCard = () => {
    const newErrors: {[key: string]: string} = {}

    if (selectedMethod === 'card') {
      if (!cardData.cardNumber.match(/^\d{16}$/)) {
        newErrors.cardNumber = 'Número de tarjeta inválido'
      }
      if (!cardData.cardHolder.trim()) {
        newErrors.cardHolder = 'Nombre requerido'
      }
      if (!cardData.expiryDate.match(/^(0[1-9]|1[0-2])\/([0-9]{2})$/)) {
        newErrors.expiryDate = 'Fecha inválida (MM/YY)'
      }
      if (!cardData.cvv.match(/^\d{3,4}$/)) {
        newErrors.cvv = 'CVV inválido'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (selectedMethod === 'cash' || validateCard()) {
      onUpdate({
        method: selectedMethod,
        ...cardData
      })
      onNext()
    }
  }

  const formatCardNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    return numbers.slice(0, 16)
  }

  const formatExpiryDate = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length >= 2) {
      return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}`
    }
    return numbers
  }

  return (
    <div className="space-y-6">
      {/* Payment Method Selection */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-6">
            Método de Pago
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  selectedMethod === method.id
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200 hover:border-indigo-200'
                }`}
                onClick={() => setSelectedMethod(method.id)}
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-white border border-gray-200">
                    <method.icon className="w-6 h-6 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {method.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {method.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Card Details */}
      {selectedMethod === 'card' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-6">
              Detalles de la Tarjeta
            </h3>

            <div className="space-y-4">
              {/* Card Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Número de Tarjeta
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={cardData.cardNumber}
                    onChange={(e) => setCardData({
                      ...cardData,
                      cardNumber: formatCardNumber(e.target.value)
                    })}
                    className={`block w-full rounded-md px-3 py-2 border ${
                      errors.cardNumber 
                        ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                        : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                    }`}
                    placeholder="1234 5678 9012 3456"
                  />
                  {errors.cardNumber && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                    </div>
                  )}
                </div>
                {errors.cardNumber && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.cardNumber}
                  </p>
                )}
              </div>

              {/* Card Holder */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Titular de la Tarjeta
                </label>
                <input
                  type="text"
                  value={cardData.cardHolder}
                  onChange={(e) => setCardData({
                    ...cardData,
                    cardHolder: e.target.value
                  })}
                  className={`block w-full rounded-md px-3 py-2 border ${
                    errors.cardHolder 
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                      : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                  }`}
                  placeholder="NOMBRE COMO APARECE EN LA TARJETA"
                />
                {errors.cardHolder && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.cardHolder}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Expiry Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha de Expiración
                  </label>
                  <input
                    type="text"
                    value={cardData.expiryDate}
                    onChange={(e) => setCardData({
                      ...cardData,
                      expiryDate: formatExpiryDate(e.target.value)
                    })}
                    className={`block w-full rounded-md px-3 py-2 border ${
                      errors.expiryDate 
                        ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                        : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                    }`}
                    placeholder="MM/YY"
                  />
                  {errors.expiryDate && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.expiryDate}
                    </p>
                  )}
                </div>

                {/* CVV */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CVV
                  </label>
                  <input
                    type="text"
                    value={cardData.cvv}
                    onChange={(e) => setCardData({
                      ...cardData,
                      cvv: e.target.value.replace(/\D/g, '').slice(0, 4)
                    })}
                    className={`block w-full rounded-md px-3 py-2 border ${
                      errors.cvv 
                        ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                        : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                    }`}
                    placeholder="123"
                  />
                  {errors.cvv && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.cvv}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Terms */}
      <div className="bg-indigo-50 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <ExclamationCircleIcon className="w-5 h-5 text-indigo-600 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-indigo-900">
              Información de Pago
            </h4>
            <p className="text-sm text-indigo-700 mt-1">
              {selectedMethod === 'card' 
                ? 'Se realizará un cargo inmediato a su tarjeta para garantizar la reserva.'
                : 'Deberá realizar el pago completo al momento del check-in.'}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Atrás
        </button>
        <button
          onClick={handleSubmit}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          Continuar
        </button>
      </div>
    </div>
  )
}

