'use client'

import { useState } from 'react'
import { DayPicker, DateRange } from 'react-day-picker'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import 'react-day-picker/dist/style.css'

interface DateRangePickerProps {
  value: {
    startDate: Date | null
    endDate: Date | null
  }
  onChange: (range: { startDate: Date | null; endDate: Date | null }) => void
}

export default function DateRangePicker({ value, onChange }: DateRangePickerProps) {
  const [selectedRange, setSelectedRange] = useState<{
    from: Date | undefined
    to: Date | undefined
  }>({
    from: value.startDate || undefined,
    to: value.endDate || undefined
  })

  const handleSelect = (range: any) => {
    setSelectedRange(range)
    onChange({
      startDate: range?.from || null,
      endDate: range?.to || null
    })
  }

  return (
    <div className="border rounded-lg p-4">
      <DayPicker
        mode="range"
        selected={selectedRange}
        onSelect={handleSelect}
        locale={es}
        disabled={[{ before: new Date() }]}
        numberOfMonths={1}
        showOutsideDays
        className="border-0"
        styles={{
          caption: { color: '#4F46E5' },
          day: { margin: '0.2em' }
        }}
        modifiers={{
          booked: [] // Aquí puedes agregar días no disponibles
        }}
        modifiersStyles={{
          booked: { 
            textDecoration: 'line-through',
            color: '#EF4444'
          }
        }}
      />
    </div>
  )
}
