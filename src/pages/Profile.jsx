import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import { useTheme } from '../hooks/useTheme'

function Profile() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { dark, toggle } = useTheme()
  const [profile, setProfile] = useState(null)
  const [scores, setScores] = useState([])
  const [best, setBest] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      const { data: scoresData } = await supabase
        .from('scores')
        .select('*')
        .eq('user_id', user.id)
        .order('played_at', { ascending: false })

      setProfile(profileData)
      setScores(scoresData || [])
      setBest(scoresData?.length ? Math.max(...scoresData.map(s => s.score)) : null)
      setLoading(false)
    }

    if (user) fetchData()
  }, [user])

  if (loading) return <div className="min-h-screen bg-white dark:bg-gray-950" />

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-white p-8 transition-colors">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <button
            onClick={() => navigate('/')}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm transition-colors"
          >
            ← Volver
          </button>
          <button
            onClick={toggle}
            className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 px-4 py-2 rounded-lg text-sm transition-colors"
          >
            {dark ? '☀️ Claro' : '🌙 Oscuro'}
          </button>
        </div>

      <div className="bg-gray-100 dark:bg-gray-900 p-6 rounded-xl mb-6">
        <h1 className="text-2xl font-bold mb-1">{profile?.username}</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">{user?.email}</p>
        {best !== null && (
          <div className="flex items-center gap-2">
            <span className="text-yellow-500 text-sm font-semibold">🏆 Mejor puntuación:</span>
            <span className="text-sm font-bold">{best} / 20</span>
        </div>
      )}
    </div>

        <div className="bg-gray-100 dark:bg-gray-900 p-6 rounded-xl">
          <h2 className="text-lg font-semibold mb-4">Historial de partidas</h2>

          {scores.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-sm">No hay partidas todavía.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {scores.map((s) => (
                <div
                  key={s.id}
                  className="flex justify-between items-center bg-white dark:bg-gray-800 px-4 py-3 rounded-lg"
                >
                  <span className="text-sm capitalize">{s.game === 'flags' ? '🏳️ Banderas' : s.game}</span>
                  <span className="text-sm font-semibold">{s.score} pts</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(s.played_at).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Profile