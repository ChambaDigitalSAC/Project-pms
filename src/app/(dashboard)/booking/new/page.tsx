'use client'

import { useState } from 'react'
import BookingSteps from '@/components/booking/BookingSteps'
import SearchAvailability from '@/components/booking/SearchAvailability'
import RoomSelection from '@/components/booking/RoomSelection'
import GuestInfo from '@/components/booking/GuestInfo'
import ExtrasSelection from '@/components/booking/ExtrasSelection'
import PaymentDetails from '@/components/booking/PaymentDetails'
import BookingSummary from '@/components/booking/BookingSummary'
import BookingSidebar from '@/components/booking/BookingSidebar'
import { ChevronUpIcon } from '@heroicons/react/24/outline'

const steps = [
  { id: 'search', name: 'Fechas y Huéspedes' },
  { id: 'room', name: 'Selección de Habitación' },
  { id: 'guest', name: 'Datos del Huésped' },
  { id: 'extras', name: 'Servicios Adicionales' },
  { id: 'payment', name: 'Pago' },
  { id: 'summary', name: 'Confirmación' }
]

export default function NewBookingPage() {
  const [currentStep, setCurrentStep] = useState('search')
  const [showSummary, setShowSummary] = useState(false)
  const [bookingData, setBookingData] = useState({
    search: {
      checkIn: '',
      checkOut: '',
      adults: 1,
      children: 0
    },
    room: null,
    guest: {},
    extras: [],
    payment: {}
  })

  const updateBookingData = (step: string, data: any) => {
    setBookingData(prev => ({
      ...prev,
      [step]: data
    }))
  }

  const handleNext = () => {
    const currentIndex = steps.findIndex(step => step.id === currentStep)
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1].id)
      window.scrollTo(0, 0)
    }
  }

  const handleBack = () => {
    const currentIndex = steps.findIndex(step => step.id === currentStep)
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1].id)
      window.scrollTo(0, 0)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
            Nueva Reserva
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Complete los siguientes pasos para crear una nueva reserva
          </p>
        </div>

        {/* Steps - Oculto en móvil */}
        <div className="hidden sm:block mb-8">
          <BookingSteps steps={steps} currentStep={currentStep} />
        </div>

        {/* Paso actual (móvil) */}
        <div className="sm:hidden mb-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Paso {steps.findIndex(step => step.id === currentStep) + 1} de {steps.length}</p>
                <p className="text-base font-medium text-gray-900">
                  {steps.find(step => step.id === currentStep)?.name}
                </p>
              </div>
              <div className="h-2 w-full max-w-[100px] bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-indigo-600 transition-all duration-300"
                  style={{ 
                    width: `${((steps.findIndex(step => step.id === currentStep) + 1) / steps.length) * 100}%` 
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
              {currentStep === 'search' && (
                <SearchAvailability
                  onNext={handleNext}
                  onUpdate={(data) => updateBookingData('search', data)}
                  initialData={bookingData.search}
                />
              )}
              {currentStep === 'room' && (
                <RoomSelection
                  onNext={handleNext}
                  onBack={handleBack}
                  onUpdate={(data) => updateBookingData('room', data)}
                  searchCriteria={bookingData.search}
                  initialData={bookingData.room}
                />
              )}
              {currentStep === 'guest' && (
                <GuestInfo
                  onNext={handleNext}
                  onBack={handleBack}
                  onUpdate={(data) => updateBookingData('guest', data)}
                  initialData={bookingData.guest}
                />
              )}
              {currentStep === 'extras' && (
                <ExtrasSelection
                  onNext={handleNext}
                  onBack={handleBack}
                  onUpdate={(data) => updateBookingData('extras', data)}
                  initialData={bookingData.extras}
                />
              )}
              {currentStep === 'payment' && (
                <PaymentDetails
                  onNext={handleNext}
                  onBack={handleBack}
                  onUpdate={(data) => updateBookingData('payment', data)}
                  initialData={bookingData.payment}
                />
              )}
              {currentStep === 'summary' && (
                <BookingSummary
                  bookingData={bookingData}
                  onBack={handleBack}
                  onConfirm={() => {
                    // Implementar lógica de confirmación
                  }}
                />
              )}
            </div>
          </div>

          {/* Sidebar - Desktop */}
          <div className="hidden lg:block">
            <div className="sticky top-6">
              <BookingSidebar
                bookingData={bookingData}
                currentStep={currentStep}
              />
            </div>
          </div>

          {/* Floating Summary Button - Mobile */}
          <div className="fixed bottom-0 left-0 right-0 lg:hidden">
            <div className="bg-white border-t border-gray-200 p-4">
              <button
                onClick={() => setShowSummary(!showSummary)}
                className="w-full flex items-center justify-between bg-indigo-600 text-white px-4 py-3 rounded-lg hover:bg-indigo-700"
              >
                <span>Ver resumen de reserva</span>
                <ChevronUpIcon 
                  className={`w-5 h-5 transition-transform duration-200 ${
                    showSummary ? 'transform rotate-180' : ''
                  }`} 
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
