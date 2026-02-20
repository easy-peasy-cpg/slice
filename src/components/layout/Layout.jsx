import Sidebar from './Sidebar'
import MobileNav from './MobileNav'

export default function Layout({ children }) {
  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 px-4 md:px-8 py-6 pb-24 md:pb-6 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
      <MobileNav />
    </div>
  )
}
