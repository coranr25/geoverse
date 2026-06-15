import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import Flags from './pages/Flags'
import Profile from './pages/Profile'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) return <div className="min-h-screen bg-gray-950" />

  if (!user) return <Navigate to="/login" />

  return children
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Home />} />
        <Route path="/flags" element={<Flags />} />
        <Route
          path="/profile"
          element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App