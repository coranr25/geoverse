import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import { useTheme } from '../hooks/useTheme'

function formatTime(seconds) {
  if (!seconds) return '—'
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

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
        .limit(10)

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

  const initials = profile?.username?.slice(0, 2).toUpperCase() || '??'

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', color: 'var(--text-primary)', fontFamily: "'Nunito', sans-serif" }}>

      <nav style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1rem 2rem',
        borderBottom: '1px solid var(--border)',
        background: 'var(--bg-surface)',
      }}>
        <button
          onClick={() => navigate('/')}
          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '600', padding: 0, fontFamily: "'Nunito', sans-serif" }}
        >
          ← Menú principal
        </button>
        <button
          onClick={toggle}
          style={{ background: 'var(--bg-elevated)', color: 'var(--text-muted)', border: '1px solid var(--border)', borderRadius: '8px', padding: '0.45rem 0.75rem', fontSize: '1rem', cursor: 'pointer' }}
        >
          {dark ? '☀️' : '🌙'}
        </button>
      </nav>

      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem' }}>

        <div style={{
          background: 'var(--bg-surface)',
          border: '2px solid var(--border)',
          borderRadius: '24px',
          padding: '2rem',
          marginBottom: '1.25rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.25rem',
              fontWeight: '800',
              color: '#fff',
              flexShrink: 0
            }}>
              {initials}
            </div>
            <div style={{ flex: 1 }}>
              {editing ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <input
                    type="text"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    maxLength={30}
                    autoFocus
                    style={{
                      background: 'var(--bg-elevated)',
                      color: 'var(--text-primary)',
                      border: '1.5px solid var(--border)',
                      borderRadius: '8px',
                      padding: '0.5rem 0.75rem',
                      fontSize: '1rem',
                      fontWeight: '700',
                      outline: 'none',
                      fontFamily: "'Nunito', sans-serif",
                      width: '100%',
                      boxSizing: 'border-box'
                    }}
                  />
                  {editError && <p style={{ color: '#ef4444', fontSize: '0.8rem', margin: 0 }}>{editError}</p>}
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={handleEditUsername}
                      disabled={editLoading}
                      style={{ background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '8px', padding: '0.4rem 1rem', fontSize: '0.85rem', fontWeight: '700', cursor: 'pointer', fontFamily: "'Nunito', sans-serif" }}
                    >
                      {editLoading ? 'Guardando...' : 'Guardar'}
                    </button>
                    <button
                      onClick={() => { setEditing(false); setEditError(null); setNewUsername(profile.username) }}
                      style={{ background: 'var(--bg-elevated)', color: 'var(--text-primary)', border: '1px solid var(--border)', borderRadius: '8px', padding: '0.4rem 1rem', fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer', fontFamily: "'Nunito', sans-serif" }}
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div>
                    <p style={{ fontSize: '1.25rem', fontWeight: '800', margin: '0 0 0.2rem' }}>{profile?.username}</p>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>{user?.email}</p>
                  </div>
                  {!profile?.username_changed && (
                    <button
                      onClick={() => setEditing(true)}
                      style={{ background: 'var(--bg-elevated)', color: 'var(--text-muted)', border: '1px solid var(--border)', borderRadius: '8px', padding: '0.3rem 0.75rem', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer', fontFamily: "'Nunito', sans-serif", whiteSpace: 'nowrap' }}
                    >
                      ✏️ Editar
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {best !== null && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '0.75rem',
              borderTop: '1px solid var(--border)',
              paddingTop: '1.25rem'
            }}>
              <div style={{ background: 'var(--bg-elevated)', borderRadius: '12px', padding: '1rem', textAlign: 'center' }}>
                <p style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--primary)', margin: '0 0 0.25rem' }}>{best}</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', margin: 0 }}>🏆 Mejor puntuación</p>
              </div>
              <div style={{ background: 'var(--bg-elevated)', borderRadius: '12px', padding: '1rem', textAlign: 'center' }}>
                <p style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--primary)', margin: '0 0 0.25rem' }}>{scores.length}</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', margin: 0 }}>🎮 Partidas jugadas</p>
              </div>
            </div>
          )}
        </div>

        <div style={{
          background: 'var(--bg-surface)',
          border: '2px solid var(--border)',
          borderRadius: '24px',
          padding: '2rem'
        }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: '800', margin: '0 0 1.25rem' }}>📋 Historial de partidas</h2>

          {scores.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem 0' }}>
              <p style={{ fontSize: '2rem', margin: '0 0 0.5rem' }}>🎯</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>No hay partidas todavía. ¡Empieza a jugar!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {scores.map((s) => (
                <div
                  key={s.id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr auto auto auto',
                    alignItems: 'center',
                    gap: '1rem',
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border)',
                    borderRadius: '12px',
                    padding: '0.875rem 1rem'
                  }}
                >
                  <span style={{ fontSize: '0.9rem', fontWeight: '700' }}>
                    {s.game === 'flags' ? '🏳️ Banderas' : s.game}
                  </span>
                  <span style={{ fontSize: '0.9rem', fontWeight: '800', color: 'var(--primary)' }}>
                    {s.score}/{s.total || 195}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                    ⏱ {formatTime(s.time_seconds)}
                  </span>
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