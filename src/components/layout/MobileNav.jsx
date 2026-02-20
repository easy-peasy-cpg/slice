import { NavLink } from 'react-router-dom'
import {
  HomeIcon,
  ChartBarIcon,
  BuildingStorefrontIcon,
  ArrowUpTrayIcon,
} from '@heroicons/react/24/outline'

const navItems = [
  { path: '/', label: 'Home', icon: HomeIcon, end: true },
  { path: '/velocity', label: 'Velocity', icon: ChartBarIcon },
  { path: '/stores', label: 'Stores', icon: BuildingStorefrontIcon },
  { path: '/import', label: 'Import', icon: ArrowUpTrayIcon },
]

export default function MobileNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#1e293b] border-t border-white/10 z-50">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map(({ path, label, icon: Icon, end }) => (
          <NavLink
            key={path}
            to={path}
            end={end}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg text-xs transition-colors ${
                isActive ? 'text-emerald-400' : 'text-slate-400'
              }`
            }
          >
            <Icon className="w-5 h-5" />
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
