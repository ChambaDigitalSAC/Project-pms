'use client'

import { BellIcon, UserCircleIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'

export default function TopBar() {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="px-4 h-16 flex items-center justify-between">
        <div className="flex items-center flex-1">
          <div className="relative w-64">
            <input
              type="text"
              placeholder="Buscar..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <button className="p-2 rounded-lg hover:bg-gray-100 relative">
              <BellIcon className="w-6 h-6 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
          </div>
          
          <div className="border-l border-gray-200 h-8 mx-2"></div>
          
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">Admin User</p>
              <p className="text-xs text-gray-500">admin@openpms.com</p>
            </div>
            <button className="p-1 rounded-full bg-gray-100">
              <UserCircleIcon className="w-8 h-8 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

