import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
  HomeIcon,
  ChartBarIcon,
  BuildingStorefrontIcon,
  ArrowRightOnRectangleIcon,
  ChevronLeftIcon,
} from '@heroicons/react/24/outline'

const navItems = [
  { path: '/', label: 'Dashboard', icon: HomeIcon, end: true },
  { path: '/velocity', label: 'Velocity', icon: ChartBarIcon },
  { path: '/stores', label: 'Stores', icon: BuildingStorefrontIcon },
]

export default function Sidebar() {
  const { signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  return (
    <aside className="hidden md:flex flex-col w-60 shrink-0 bg-[#1e293b] min-h-screen">
      {/* Logo */}
      <div className="px-5 py-6 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-emerald-500 rounded-md flex items-center justify-center shrink-0">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <span className="text-white font-semibold text-lg tracking-tight">Slice</span>
        </div>
        <p className="text-slate-400 text-xs mt-1.5 ml-9">Retail Sales Intelligence</p>
      </div>

      {/* Back to Piece of Pie */}
      <div className="px-3 pt-3 pb-1">
        <a
          href="https://piece-of-pie.vercel.app/dashboard"
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-colors"
        >
          <ChevronLeftIcon className="w-3.5 h-3.5 shrink-0" />
          All Apps
        </a>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-2 space-y-0.5">
        {navItems.map(({ path, label, icon: Icon, end }) => (
          <NavLink
            key={path}
            to={path}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-emerald-500/15 text-emerald-400'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`
            }
          >
            <Icon className="w-[18px] h-[18px] shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Sign out */}
      <div className="px-3 py-4 border-t border-white/10">
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
        >
          <ArrowRightOnRectangleIcon className="w-[18px] h-[18px] shrink-0" />
          Sign out
        </button>
      </div>
    </aside>
  )
}
