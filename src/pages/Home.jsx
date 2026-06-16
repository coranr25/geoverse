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

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
  }

  if (loading) return <div style={{ minHeight: '100vh', background: 'var(--bg-base)' }} />

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-base)',
      color: 'var(--text-primary)',
      fontFamily: "'Nunito', sans-serif"
    }}>

      <nav style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1rem 2rem',
        borderBottom: '1px solid var(--border)',
        background: 'var(--bg-surface)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span style={{ fontSize: '1.5rem' }}>🌍</span>
          <h1 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--primary)', margin: 0 }}>GeoVerse</h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            onClick={toggleFullscreen}
            title="Pantalla completa"
            style={{
              background: 'var(--bg-elevated)',
              color: 'var(--text-muted)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              padding: '0.45rem 0.75rem',
              fontSize: '1rem',
              cursor: 'pointer',
              lineHeight: 1
            }}
          >
            ⛶
          </button>
          <button
            onClick={toggle}
            title="Cambiar tema"
            style={{
              background: 'var(--bg-elevated)',
              color: 'var(--text-muted)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              padding: '0.45rem 0.75rem',
              fontSize: '1rem',
              cursor: 'pointer',
              lineHeight: 1
            }}
          >
            {dark ? '☀️' : '🌙'}
          </button>
          {user ? (
            <>
              <button
                onClick={() => navigate('/profile')}
                style={{
                  background: 'var(--bg-elevated)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  padding: '0.45rem 1rem',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontFamily: "'Nunito', sans-serif"
                }}
              >
                👤 Perfil
              </button>
              <button
                onClick={handleLogout}
                style={{
                  background: 'none',
                  color: 'var(--text-muted)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  padding: '0.45rem 1rem',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontFamily: "'Nunito', sans-serif"
                }}
              >
                Salir
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate('/login')}
                style={{
                  background: 'none',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  padding: '0.45rem 1rem',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontFamily: "'Nunito', sans-serif"
                }}
              >
                Iniciar sesión
              </button>
              <button
                onClick={() => navigate('/register')}
                style={{
                  background: 'var(--primary)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0.45rem 1rem',
                  fontSize: '0.875rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  fontFamily: "'Nunito', sans-serif"
                }}
              >
                Registrarse
              </button>
            </>
          )}
        </div>
      </nav>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '3rem 2rem' }}>

        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '800', margin: '0 0 1rem', lineHeight: 1.2 }}>
            Aprende geografía{' '}
            <span style={{ color: 'var(--primary)' }}>jugando</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', margin: '0 auto', maxWidth: '500px', lineHeight: 1.6 }}>
            Pon a prueba tus conocimientos con banderas de 195 países. Gratis, sin instalación.
          </p>
          {user && (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '1rem' }}>
              Jugando como <span style={{ color: 'var(--primary)', fontWeight: '700' }}>{user.email}</span>
            </p>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', marginBottom: '3rem' }}>

          <div
            onClick={() => navigate('/flags')}
            style={{
              background: 'var(--bg-surface)',
              border: '2px solid var(--border)',
              borderRadius: '20px',
              padding: '2rem',
              cursor: 'pointer',
              transition: 'border-color 0.2s, transform 0.15s',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'var(--primary)'
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'var(--border)'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🏳️</div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', margin: '0 0 0.5rem' }}>Banderas</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: '0 0 1.5rem', lineHeight: 1.5 }}>
              Adivina el país por su bandera. 195 países, varios modos de juego.
            </p>
            <span style={{
              display: 'inline-block',
              background: 'var(--primary)',
              color: '#fff',
              borderRadius: '8px',
              padding: '0.4rem 1rem',
              fontSize: '0.875rem',
              fontWeight: '700'
            }}>
              Jugar →
            </span>
          </div>

          <div
            style={{
              background: 'var(--bg-surface)',
              border: '2px solid var(--border)',
              borderRadius: '20px',
              padding: '2rem',
              opacity: 0.5,
              cursor: 'not-allowed',
              position: 'relative'
            }}
          >
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🏙️</div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', margin: '0 0 0.5rem' }}>Capitales</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: '0 0 1.5rem', lineHeight: 1.5 }}>
              Adivina la capital de cada país del mundo.
            </p>
            <span style={{
              display: 'inline-block',
              background: 'var(--bg-elevated)',
              color: 'var(--text-muted)',
              borderRadius: '8px',
              padding: '0.4rem 1rem',
              fontSize: '0.875rem',
              fontWeight: '700',
              border: '1px solid var(--border)'
            }}>
              Próximamente
            </span>
          </div>

        </div>

        <div
  onClick={() => user ? navigate('/glossary') : navigate('/register')}
  style={{
    background: 'var(--bg-surface)',
    border: '2px solid var(--border)',
    borderRadius: '20px',
    padding: '2rem',
    cursor: 'pointer',
    transition: 'border-color 0.2s, transform 0.15s'
  }}
  onMouseEnter={e => {
    e.currentTarget.style.borderColor = 'var(--primary)'
    e.currentTarget.style.transform = 'translateY(-2px)'
  }}
  onMouseLeave={e => {
    e.currentTarget.style.borderColor = 'var(--border)'
    e.currentTarget.style.transform = 'translateY(0)'
  }}
>
  <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🗺️</div>
  <h3 style={{ fontSize: '1.25rem', fontWeight: '800', margin: '0 0 0.5rem' }}>Glosario</h3>
  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: '0 0 1.5rem', lineHeight: 1.5 }}>
    Descubre los países que ya conoces y aprende sobre ellos.
  </p>
  <span style={{
    display: 'inline-block',
    background: 'var(--primary)',
    color: '#fff',
    borderRadius: '8px',
    padding: '0.4rem 1rem',
    fontSize: '0.875rem',
    fontWeight: '700'
  }}>
    {user ? 'Ver glosario →' : 'Requiere cuenta →'}
  </span>
</div>

        {!user && (
          <div style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border)',
            borderRadius: '20px',
            padding: '2rem',
            textAlign: 'center'
          }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', margin: '0 0 0.5rem' }}>¿Quieres guardar tu progreso?</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: '0 0 1.5rem', lineHeight: 1.5 }}>
              Crea una cuenta gratis para guardar tus puntuaciones, ver tu historial y competir en el ranking.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={() => navigate('/register')}
                style={{
                  background: 'var(--primary)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '0.75rem 1.5rem',
                  fontSize: '0.95rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  fontFamily: "'Nunito', sans-serif"
                }}
              >
                Crear cuenta gratis
              </button>
              <button
                onClick={() => navigate('/login')}
                style={{
                  background: 'none',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border)',
                  borderRadius: '10px',
                  padding: '0.75rem 1.5rem',
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontFamily: "'Nunito', sans-serif"
                }}
              >
                Iniciar sesión
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default Home