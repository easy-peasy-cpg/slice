import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import ProtectedRoute from './components/layout/ProtectedRoute'
import Home from './pages/Home'
import Privacy from './pages/Privacy'
import Terms from './pages/Terms'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Voids from './pages/Voids'
import Rankings from './pages/Rankings'
import AIAnalysis from './pages/AIAnalysis'
import PromoPerformance from './pages/PromoPerformance'
import AskSlice from './pages/AskSlice'
import SalesDeck from './pages/SalesDeck'
import Settings from './pages/Settings'
import Import from './pages/Import'

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/sales" element={<Navigate to="/dashboard" replace />} />
        <Route path="/voids" element={<ProtectedRoute><Voids /></ProtectedRoute>} />
        <Route path="/rankings" element={<ProtectedRoute><Rankings /></ProtectedRoute>} />
        <Route path="/stores" element={<Navigate to="/rankings" replace />} />
        <Route path="/regions" element={<Navigate to="/rankings" replace />} />
        <Route path="/items" element={<Navigate to="/rankings" replace />} />
        <Route path="/promos" element={<ProtectedRoute><PromoPerformance /></ProtectedRoute>} />
        <Route path="/analysis" element={<ProtectedRoute><AIAnalysis /></ProtectedRoute>} />
        <Route path="/ask" element={<ProtectedRoute><AskSlice /></ProtectedRoute>} />
        <Route path="/deck" element={<ProtectedRoute><SalesDeck /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="/import" element={<ProtectedRoute><Import /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  )
}
