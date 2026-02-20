import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import ProtectedRoute from './components/layout/ProtectedRoute'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Velocity from './pages/Velocity'
import Stores from './pages/Stores'
import Import from './pages/Import'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
      <Route path="/velocity" element={<ProtectedRoute><Layout><Velocity /></Layout></ProtectedRoute>} />
      <Route path="/stores" element={<ProtectedRoute><Layout><Stores /></Layout></ProtectedRoute>} />
      <Route path="/import" element={<ProtectedRoute><Layout><Import /></Layout></ProtectedRoute>} />
    </Routes>
  )
}
