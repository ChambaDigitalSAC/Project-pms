'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { 
  Home, 
  Calendar, 
  Bell, 
  User,
  BarChart2,
  BedDouble,
  Facebook,
  Instagram,
  Linkedin
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface DashboardStats {
  newBookings: number
  cancellations: number
  reminders: number
  checkIns: number
  checkOuts: number
  occupancyRate: number
  occupiedRooms: number
}

interface BlogPost {
  title: string
  date: string
  excerpt: string
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardStats()
  }, [])

  const loadDashboardStats = async () => {
    try {
      const today = new Date().toISOString().split('T')[0]
      
      // Obtener estadísticas de reservas
      const { data: bookingsStats, error: bookingsError } = await supabase
        .from('bookings')
        .select('*')
        .gte('created_at', today)

      // Obtener check-ins y check-outs de hoy
      const { data: todayActivity, error: activityError } = await supabase
        .from('bookings')
        .select('*')
        .eq('check_in', today)
        .or(`check_out.eq.${today}`)

      // Obtener ocupación actual
      const { data: occupancyData, error: occupancyError } = await supabase
        .from('rooms')
        .select('*')

      if (bookingsError || activityError || occupancyError) throw new Error('Error fetching stats')

      const occupiedRooms = occupancyData?.filter(room => room.status === 'occupied').length || 0
      const totalRooms = occupancyData?.length || 1

      setStats({
        newBookings: bookingsStats?.length || 0,
        cancellations: bookingsStats?.filter(b => b.status === 'cancelled').length || 0,
        reminders: 0, // Implementar lógica de recordatorios
        checkIns: todayActivity?.filter(b => b.check_in === today).length || 0,
        checkOuts: todayActivity?.filter(b => b.check_out === today).length || 0,
        occupancyRate: Math.round((occupiedRooms / totalRooms) * 100),
        occupiedRooms
      })
    } catch (error) {
      console.error('Error loading dashboard stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const blogPosts: BlogPost[] = [
    {
      title: '6 Essential Features Every Hotel Channel Manager Should Have',
      date: 'Publicado: 03/07/2024 09:13',
      excerpt: 'A hotel channel manager is an indispensable tool. It helps manage your processes in a fast-paced hospitality industry. But what is a...'
    },
    {
      title: 'Entérate de las últimas actualizaciones de Sirvoy',
      date: 'Publicado: 07/05/2024 01:16',
      excerpt: '¡Hola! Nos emociona informarte de algunas de las últimas actualizaciones que hemos realizado en Sirvoy. Estos ajustes y mejoras...'
    },
    {
      title: 'Simplifica los pagos y la contabilidad con Stripe y Sirvoy',
      date: 'Publicado: 18/04/2024 13:19',
      excerpt: 'Aproximadamente la mitad de los propietarios de pequeñas empresas dicen que la contabilidad es la tarea que menos les gusta...'
    }
  ]

  if (loading) {
    return <div>Cargando...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 max-w-[100vw] overflow-x-hidden">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Principal</h1>
        </div>

        {/* Stats Grid - Primera fila */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <StatCard 
            icon={<Home className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500" />} 
            title="Nuevas reservas" 
            value={stats?.newBookings.toString() || "0"} 
          />
          <StatCard 
            icon={<Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-red-500" />} 
            title="Nuevas cancelaciones" 
            value={stats?.cancellations.toString() || "0"} 
          />
          <StatCard 
            icon={<Bell className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-500" />} 
            title="Recordatorios" 
            value={stats?.reminders.toString() || "0"} 
          />
          <StatCard 
            icon={<User className="h-5 w-5 sm:h-6 sm:w-6 text-green-500" />} 
            title="Check-ins" 
            value={stats?.checkIns.toString() || "0"} 
          />
        </div>

        {/* Stats Grid - Segunda fila */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <StatCard 
            icon={<User className="h-5 w-5 sm:h-6 sm:w-6 text-purple-500" />} 
            title="Check-outs" 
            value={stats?.checkOuts.toString() || "0"} 
          />
          <StatCard 
            icon={<BarChart2 className="h-5 w-5 sm:h-6 sm:w-6 text-indigo-500" />} 
            title="Ocupación" 
            value={`${stats?.occupancyRate || 0}%`} 
          />
          <StatCard 
            icon={<BedDouble className="h-5 w-5 sm:h-6 sm:w-6 text-pink-500" />} 
            title="Habitaciones ocupadas" 
            value={stats?.occupiedRooms.toString() || "0"} 
          />
        </div>

        {/* Buscador */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 overflow-hidden">
          <div className="p-4 sm:p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Buscar</h2>
            <SearchFilters />
          </div>
        </div>

        {/* Blog Posts */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 sm:p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Blog de OpenPMS</h2>
            <BlogPosts />
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-6 py-4 text-center text-sm text-gray-500">
          <div className="flex justify-center space-x-4 mb-2">
            <Facebook className="h-4 w-4 sm:h-5 sm:w-5" />
            <Instagram className="h-4 w-4 sm:h-5 sm:w-5" />
            <Linkedin className="h-4 w-4 sm:h-5 sm:w-5" />
          </div>
          <p className="text-xs sm:text-sm">Términos y condiciones | Copyright © 2024 OpenPMS</p>
        </footer>
      </main>
    </div>
  )
}

// Actualizar StatCard para ser más responsive
function StatCard({ icon, title, value }: { icon: React.ReactNode, title: string, value: string }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
      <div className="flex items-center">
        <div className="rounded-full p-2 sm:p-3 bg-gray-50 mr-3 sm:mr-4 flex-shrink-0">
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs sm:text-sm font-medium text-gray-500 truncate">
            {title}
          </p>
          <p className="text-lg sm:text-2xl font-bold text-gray-900 truncate">
            {value}
          </p>
        </div>
      </div>
    </div>
  )
}

// Actualizar SearchFilters para ser más responsive
function SearchFilters() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* Filtro de texto */}
      <div className="col-span-1">
        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
          Texto
        </label>
        <input
          type="text"
          placeholder="Buscar..."
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      {/* Filtro de origen */}
      <div className="col-span-1">
        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
          Origen
        </label>
        <select className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
          <option value="all">Todos</option>
          <option value="web">Web</option>
          <option value="phone">Teléfono</option>
          <option value="agency">Agencia</option>
        </select>
      </div>

      {/* Fechas en una sola columna en móvil */}
      <div className="col-span-1">
        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
          Check-in
        </label>
        <input
          type="date"
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <div className="col-span-1">
        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
          Check-out
        </label>
        <input
          type="date"
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      {/* Resto de filtros */}
      <div className="col-span-1">
        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
          Tipo de habitación
        </label>
        <select className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
          <option value="all">Todos</option>
          <option value="single">Individual</option>
          <option value="double">Doble</option>
          <option value="suite">Suite</option>
        </select>
      </div>

      <div className="col-span-1">
        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
          Estado
        </label>
        <select className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
          <option value="all">Todos</option>
          <option value="confirmed">Confirmada</option>
          <option value="pending">Pendiente</option>
          <option value="cancelled">Cancelada</option>
        </select>
      </div>

      {/* Botón de búsqueda */}
      <div className="col-span-1 sm:col-span-2 lg:col-span-3">
        <button className="w-full bg-indigo-600 text-white px-4 py-2 text-sm rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
          Buscar
        </button>
      </div>
    </div>
  )
}

// Actualizar BlogPosts para ser más responsive
function BlogPosts() {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* ... contenido del blog ... */}
    </div>
  )
}
