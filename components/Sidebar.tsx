'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import {
  LayoutDashboard,
  Users,
  Building2,
  DollarSign,
  Calendar,
  TrendingUp,
  Settings,
  LogOut,
  Shield
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Contacts', href: '/contacts', icon: Users },
  { name: 'Companies', href: '/companies', icon: Building2 },
  { name: 'Deals', href: '/deals', icon: DollarSign },
  { name: 'Activities', href: '/activities', icon: Calendar },
]

const ROLE_LABELS: { [key: string]: string } = {
  admin: 'Admin',
  manager: 'Manager',
  sales: 'Sales Rep',
  viewer: 'Viewer',
}

const ROLE_COLORS: { [key: string]: string } = {
  admin: 'bg-red-500/20 text-red-200',
  manager: 'bg-purple-500/20 text-purple-200',
  sales: 'bg-blue-500/20 text-blue-200',
  viewer: 'bg-gray-500/20 text-gray-200',
}

export default function Sidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()

  const handleSignOut = () => {
    signOut({ callbackUrl: '/login' })
  }

  return (
    <div className="w-64 bg-gradient-to-b from-indigo-900 to-indigo-800 text-white flex flex-col">
      <div className="p-6">
        <div className="flex items-center space-x-3">
          <div className="bg-white/10 p-2 rounded-lg backdrop-blur-sm">
            <TrendingUp className="h-8 w-8 text-indigo-200" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">CRM Pro</h1>
            <p className="text-indigo-200 text-sm">Business Suite</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`
                flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200
                ${isActive
                  ? 'bg-white/20 text-white shadow-lg backdrop-blur-sm'
                  : 'text-indigo-100 hover:bg-white/10 hover:text-white'
                }
              `}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{item.name}</span>
            </Link>
          )
        })}

        {session?.user?.role === 'admin' && (
          <Link
            href="/users"
            className={`
              flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200
              ${pathname === '/users'
                ? 'bg-white/20 text-white shadow-lg backdrop-blur-sm'
                : 'text-indigo-100 hover:bg-white/10 hover:text-white'
              }
            `}
          >
            <Settings className="h-5 w-5" />
            <span className="font-medium">User Management</span>
          </Link>
        )}
      </nav>

      <div className="p-4 border-t border-white/10 space-y-3">
        {session?.user && (
          <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
            <div className="flex items-center space-x-3 mb-3">
              <div className="bg-white/20 rounded-full h-10 w-10 flex items-center justify-center">
                <span className="text-sm font-bold">
                  {session.user.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {session.user.name}
                </p>
                <p className="text-xs text-indigo-200 truncate">
                  {session.user.email}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  ROLE_COLORS[session.user.role] || ROLE_COLORS.viewer
                }`}
              >
                {ROLE_LABELS[session.user.role] || 'Viewer'}
              </span>
              <button
                onClick={handleSignOut}
                className="text-indigo-200 hover:text-white transition-colors"
                title="Sign out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
