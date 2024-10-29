'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  HomeIcon, 
  CalendarIcon, 
  BuildingOfficeIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  PlusCircleIcon,
  ClipboardDocumentListIcon,
  TagIcon,
  UserGroupIcon,
  GlobeAltIcon,
  EnvelopeIcon,
  UserIcon,
  QuestionMarkCircleIcon,
  ArrowRightOnRectangleIcon,
  SparklesIcon,
  BanknotesIcon,
  ClockIcon,
  BuildingStorefrontIcon,
  Bars3Icon,
  ChevronDoubleLeftIcon
} from '@heroicons/react/24/outline'

const mainMenuItems = [
  {
    group: "Gestión",
    items: [
      { name: 'Vista General', icon: HomeIcon, href: '/dashboard' },
      { name: 'Nueva Reserva', icon: PlusCircleIcon, href: '/booking/new' },
      { name: 'Gestión Reservas', icon: ClipboardDocumentListIcon, href: '/bookings' },
    ]
  },
  {
    group: "Operaciones",
    items: [
      { name: 'Calendario', icon: CalendarIcon, href: '/calendar' },
      { name: 'Inventario', icon: BuildingOfficeIcon, href: '/rooms' },
      { name: 'Precios', icon: TagIcon, href: '/rates' },
      { name: 'Finanzas', icon: CurrencyDollarIcon, href: '/payments' },
    ]
  },
  {
    group: "Análisis",
    items: [
      { name: 'Métricas', icon: ChartBarIcon, href: '/statistics' },
      { name: 'Canales', icon: BuildingStorefrontIcon, href: '/channels' },
    ]
  }
]

const configMenuItems = [
  {
    group: "Configuración",
    items: [
      { name: 'Propiedad', icon: BuildingOfficeIcon, href: '/settings/property' },
      { name: 'Servicios', icon: SparklesIcon, href: '/settings/extras' },
      { name: 'Tarifas', icon: BanknotesIcon, href: '/settings/prices' },
      { name: 'Disponibilidad', icon: ClockIcon, href: '/settings/availability' },
      { name: 'Distribución', icon: GlobeAltIcon, href: '/settings/channels' },
      { name: 'Equipo', icon: UserGroupIcon, href: '/settings/users' },
    ]
  }
]

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  return (
    <aside className={`bg-gradient-to-b from-indigo-900 to-indigo-950 text-white flex flex-col h-screen transition-all duration-300 ${
      collapsed ? 'w-20' : 'w-72'
    }`}>
      {/* Header */}
      <div className="p-4 border-b border-indigo-800/50">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-lg font-bold bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent">
                OpenPMS
              </span>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-indigo-200">Hotel Peña Linda</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-indigo-800/50 text-indigo-200">
                  #28190
                </span>
              </div>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-lg hover:bg-indigo-800/50 transition-colors"
          >
            {collapsed ? (
              <Bars3Icon className="w-5 h-5" />
            ) : (
              <ChevronDoubleLeftIcon className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-800 scrollbar-track-transparent">
        {mainMenuItems.map((group) => (
          <div key={group.group} className="py-4">
            {!collapsed && (
              <div className="px-4 py-2 text-xs font-medium text-indigo-300 uppercase tracking-wider">
                {group.group}
              </div>
            )}
            {group.items.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-4 py-2.5 text-sm transition-colors relative group
                    ${isActive 
                      ? 'text-white bg-indigo-800/50' 
                      : 'text-indigo-200 hover:text-white hover:bg-indigo-800/30'
                    }
                    ${collapsed ? 'justify-center' : ''}
                  `}
                >
                  <item.icon className={`w-5 h-5 ${collapsed ? '' : 'mr-3'}`} />
                  {!collapsed && <span>{item.name}</span>}
                  {collapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-indigo-900 rounded-md text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                      {item.name}
                    </div>
                  )}
                  {isActive && !collapsed && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-400 rounded-r"></div>
                  )}
                </Link>
              )
            })}
          </div>
        ))}

        {/* Settings */}
        {configMenuItems.map((group) => (
          <div key={group.group} className="py-4 border-t border-indigo-800/50">
            {!collapsed && (
              <div className="px-4 py-2 text-xs font-medium text-indigo-300 uppercase tracking-wider">
                {group.group}
              </div>
            )}
            {group.items.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-4 py-2.5 text-sm transition-colors relative group
                    ${isActive 
                      ? 'text-white bg-indigo-800/50' 
                      : 'text-indigo-200 hover:text-white hover:bg-indigo-800/30'
                    }
                    ${collapsed ? 'justify-center' : ''}
                  `}
                >
                  <item.icon className={`w-5 h-5 ${collapsed ? '' : 'mr-3'}`} />
                  {!collapsed && <span>{item.name}</span>}
                  {collapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-indigo-900 rounded-md text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                      {item.name}
                    </div>
                  )}
                </Link>
              )
            })}
          </div>
        ))}
      </nav>

      {/* User section */}
      <div className="border-t border-indigo-800/50 p-4">
        <div className={`flex items-center ${collapsed ? 'justify-center' : 'space-x-3'}`}>
          <div className="w-8 h-8 rounded-full bg-indigo-800/50 flex items-center justify-center">
            <UserIcon className="w-5 h-5 text-indigo-200" />
          </div>
          {!collapsed && (
            <div className="flex-1">
              <div className="text-sm font-medium text-white">Admin User</div>
              <div className="text-xs text-indigo-300">Administrador</div>
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}
