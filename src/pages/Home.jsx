import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import { useTheme } from '../hooks/useTheme'

function Home() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { dark, toggle } = useTheme()

  async function handleLogout() {
    await supabase.auth.signOut()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-white p-8 transition-colors">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <h1 className="text-3xl font-bold">GeoVerse</h1>
          <div className="flex items-center gap-3">
            <button
              onClick={toggle}
              className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 px-4 py-2 rounded-lg text-sm transition-colors"
            >
              {dark ? '☀️ Claro' : '🌙 Oscuro'}
            </button>
            <button
              onClick={handleLogout}
              className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 px-4 py-2 rounded-lg text-sm transition-colors"
            >
              Cerrar sesión
            </button>
          </div>
        </div>

        <p
          onClick={() => navigate('/profile')}
          className="text-gray-500 dark:text-gray-400 mb-8 cursor-pointer hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          Bienvenido, {user?.email} →
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            onClick={() => navigate('/flags')}
            className="bg-gray-100 dark:bg-gray-900 hover:bg-gray-200 dark:hover:bg-gray-800 p-6 rounded-xl cursor-pointer transition-colors"
          >
            <h2 className="text-xl font-semibold mb-2">🏳️ Banderas</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Adivina el país por su bandera</p>
          </div>

          <div className="bg-gray-100 dark:bg-gray-900 p-6 rounded-xl opacity-40 cursor-not-allowed">
            <h2 className="text-xl font-semibold mb-2">🏙️ Capitales</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Próximamente</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home