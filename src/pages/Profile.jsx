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
  const [editing, setEditing] = useState(false)
  const [newUsername, setNewUsername] = useState('')
  const [editError, setEditError] = useState(null)
  const [editLoading, setEditLoading] = useState(false)

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
      setNewUsername(profileData?.username || '')
      setScores(scoresData || [])
      setBest(scoresData?.length ? Math.max(...scoresData.map(s => s.score)) : null)
      setLoading(false)
    }

    if (user) fetchData()
  }, [user])

  async function handleEditUsername() {
    setEditLoading(true)
    setEditError(null)

    const trimmed = newUsername.trim()

    if (!trimmed) {
      setEditError('El nombre de usuario no puede estar vacío.')
      setEditLoading(false)
      return
    }

    if (trimmed === profile.username) {
      setEditing(false)
      setEditLoading(false)
      return
    }

    const { error } = await supabase
      .from('profiles')
      .update({ username: trimmed, username_changed: true })
      .eq('id', user.id)

    if (error) {
      if (error.code === '23505') {
        setEditError('Ese nombre de usuario ya está en uso.')
      } else {
        setEditError('Error al actualizar. Inténtalo de nuevo.')
      }
      setEditLoading(false)
      return
    }

    setProfile((p) => ({ ...p, username: trimmed, username_changed: true }))
    setEditing(false)
    setEditLoading(false)
  }

  if (loading) return <div style={{ minHeight: '100vh', background: 'var(--bg-base)' }} />

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', color: 'var(--text-primary)', padding: '2rem' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <button
            onClick={() => navigate('/')}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.85rem' }}
          >
            ← Volver
          </button>
          <button
            onClick={toggle}
            style={{ background: 'var(--bg-elevated)', color: 'var(--text-primary)', border: '1px solid var(--border)', borderRadius: '8px', padding: '0.5rem 1rem', fontSize: '0.85rem', cursor: 'pointer' }}
          >
            {dark ? '☀️ Claro' : '🌙 Oscuro'}
          </button>
        </div>

        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '16px', padding: '1.5rem', marginBottom: '1rem' }}>
          {editing ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <input
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                maxLength={30}
                autoFocus
                style={{ background: 'var(--bg-elevated)', color: 'var(--text-primary)', border: '1px solid var(--border)', borderRadius: '8px', padding: '0.75rem 1rem', fontSize: '0.95rem', outline: 'none' }}
              />
              {editError && (
                <p style={{ color: '#ef4444', fontSize: '0.85rem', margin: 0 }}>{editError}</p>
              )}
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={handleEditUsername}
                  disabled={editLoading}
                  style={{ background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '8px', padding: '0.5rem 1rem', fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer', opacity: editLoading ? 0.6 : 1 }}
                >
                  {editLoading ? 'Guardando...' : 'Guardar'}
                </button>
                <button
                  onClick={() => { setEditing(false); setEditError(null); setNewUsername(profile.username) }}
                  style={{ background: 'var(--bg-elevated)', color: 'var(--text-primary)', border: '1px solid var(--border)', borderRadius: '8px', padding: '0.5rem 1rem', fontSize: '0.85rem', cursor: 'pointer' }}
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h1 style={{ fontSize: '1.5rem', fontWeight: '700', margin: '0 0 0.25rem' }}>{profile?.username}</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>{user?.email}</p>
              </div>
              {!profile?.username_changed && (
                <button
                  onClick={() => setEditing(true)}
                  style={{ background: 'var(--bg-elevated)', color: 'var(--text-primary)', border: '1px solid var(--border)', borderRadius: '8px', padding: '0.5rem 1rem', fontSize: '0.85rem', cursor: 'pointer' }}
                >
                  Editar
                </button>
              )}
            </div>
          )}

          {best !== null && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
              <span style={{ color: '#facc15', fontSize: '0.85rem', fontWeight: '600' }}>🏆 Mejor puntuación:</span>
              <span style={{ fontSize: '0.85rem', fontWeight: '700' }}>{best} / 195</span>
            </div>
          )}
        </div>

        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '16px', padding: '1.5rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem', margin: '0 0 1rem' }}>Historial de partidas</h2>

          {scores.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>No hay partidas todavía.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {scores.map((s) => (
                <div
                  key={s.id}
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '8px', padding: '0.75rem 1rem' }}
                >
                  <span style={{ fontSize: '0.85rem' }}>{s.game === 'flags' ? '🏳️ Banderas' : s.game}</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--primary)' }}>{s.score} pts</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
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