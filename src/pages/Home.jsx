import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import { useTheme } from '../hooks/useTheme'

function Home() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()
  const { dark, toggle } = useTheme()

  async function handleLogout() {
    await supabase.auth.signOut()
    navigate('/login')
  }

  if (loading) return <div style={{ minHeight: '100vh', background: 'var(--bg-base)' }} />

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', color: 'var(--text-primary)', padding: '2rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '700', color: 'var(--primary)', margin: 0 }}>GeoVerse</h1>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              onClick={toggle}
              style={{ background: 'var(--bg-elevated)', color: 'var(--text-primary)', border: '1px solid var(--border)', borderRadius: '8px', padding: '0.5rem 1rem', fontSize: '0.85rem', cursor: 'pointer' }}
            >
              {dark ? '☀️ Claro' : '🌙 Oscuro'}
            </button>
            {user && (
              <button
                onClick={handleLogout}
                style={{ background: 'var(--bg-elevated)', color: 'var(--text-primary)', border: '1px solid var(--border)', borderRadius: '8px', padding: '0.5rem 1rem', fontSize: '0.85rem', cursor: 'pointer' }}
              >
                Cerrar sesión
              </button>
            )}
          </div>
        </div>

        {user ? (
          <p
            onClick={() => navigate('/profile')}
            style={{ color: 'var(--text-muted)', marginBottom: '2rem', cursor: 'pointer', fontSize: '0.9rem' }}
          >
            Bienvenido, {user.email} →
          </p>
        ) : (
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.9rem' }}>
            <span
              onClick={() => navigate('/login')}
              style={{ color: 'var(--secondary)', cursor: 'pointer', fontWeight: '600' }}
            >
              Inicia sesión
            </span>
            {' '}o{' '}
            <span
              onClick={() => navigate('/register')}
              style={{ color: 'var(--secondary)', cursor: 'pointer', fontWeight: '600' }}
            >
              regístrate
            </span>
            {' '}para guardar tu progreso.
          </p>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          <div
            onClick={() => navigate('/flags')}
            style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.5rem', cursor: 'pointer', transition: 'border-color 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
          >
            <h2 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.5rem' }}>🏳️ Banderas</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>Adivina el país por su bandera</p>
          </div>

          <div
            style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.5rem', opacity: 0.4, cursor: 'not-allowed' }}
          >
            <h2 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.5rem' }}>🏙️ Capitales</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>Próximamente</p>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Home