'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  getBookingDetails, 
  updateBookingStatus,
  updateBookingNotes,
  uploadPaymentReceipt,
  addTimelineItem
} from '@/lib/api'

// ... importar componentes UI ...

export default function BookingDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [booking, setBooking] = useState<Booking | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadBookingDetails()
  }, [params.id])

  const loadBookingDetails = async () => {
    try {
      const data = await getBookingDetails(params.id)
      setBooking(data)
    } catch (err) {
      setError('Error al cargar los detalles de la reserva')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (newStatus: Booking['status']) => {
    try {
      await updateBookingStatus(params.id, newStatus)
      await addTimelineItem(
        params.id,
        'status_change',
        `Estado actualizado a ${newStatus}`
      )
      loadBookingDetails()
    } catch (err) {
      console.error('Error al actualizar el estado:', err)
    }
  }

  const handleNotesUpdate = async (
    type: 'internal' | 'guest',
    notes: string
  ) => {
    try {
      await updateBookingNotes(params.id, {
        [type === 'internal' ? 'internalNotes' : 'guestNotes']: notes
      })
    } catch (err) {
      console.error('Error al actualizar las notas:', err)
    }
  }

  const handleFileUpload = async (file: File) => {
    try {
      const fileUrl = await uploadPaymentReceipt(params.id, file)
      await addTimelineItem(
        params.id,
        'payment_receipt',
        'Comprobante de pago subido'
      )
      loadBookingDetails()
    } catch (err) {
      console.error('Error al subir el archivo:', err)
    }
  }

  if (loading) return <div>Cargando...</div>
  if (error || !booking) return <div>Error: {error}</div>

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-6 overflow-auto">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-2xl font-bold">Reserva {booking.id}</CardTitle>
            <div className="flex space-x-2">
              <Button variant="outline">
                <PrinterIcon className="mr-2 h-4 w-4" /> Imprimir
              </Button>
              <Button>
                <Pencil className="mr-2 h-4 w-4" /> Editar reserva
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-2">
                <ReservationStatus 
                  booking={booking} 
                  onStatusChange={handleStatusChange} 
                />
                <Separator className="my-6" />
                <GuestInformation booking={booking} />
                <Separator className="my-6" />
                <RoomInformation booking={booking} />
              </div>
              <div>
                <PaymentInformation 
                  booking={booking}
                  onFileUpload={handleFileUpload}
                />
              </div>
            </div>
            <Separator className="my-6" />
            <ReservationNotes 
              booking={booking}
              onNotesUpdate={handleNotesUpdate}
            />
            <Separator className="my-6" />
            <ReservationTimeline booking={booking} />
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
