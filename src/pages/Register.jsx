import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

function Register() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit() {
    setLoading(true)
    setError(null)

    const { error: signUpError } = await supabase.auth.signUp({ email, password })

    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
      return
    }

    navigate('/')
  }

  function handleKey(e) {
    if (e.key === 'Enter') handleSubmit()
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-base)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem',
      fontFamily: "'Nunito', sans-serif"
    }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>

        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '64px',
            height: '64px',
            background: 'var(--primary)',
            borderRadius: '16px',
            fontSize: '2rem',
            marginBottom: '1rem'
          }}>
            🌍
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--primary)', margin: '0 0 0.25rem' }}>GeoVerse</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: 0 }}>Crea tu cuenta y empieza a explorar</p>
        </div>

        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          borderRadius: '20px',
          padding: '2rem',
        }}>

          {error && (
            <div style={{
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: '10px',
              padding: '0.75rem 1rem',
              marginBottom: '1.25rem'
            }}>
              <p style={{ color: '#f87171', fontSize: '0.875rem', margin: 0 }}>{error}</p>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
                Email
              </label>
              <input
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleKey}
                style={{
                  width: '100%',
                  background: 'var(--bg-elevated)',
                  color: 'var(--text-primary)',
                  border: '1.5px solid var(--border)',
                  borderRadius: '10px',
                  padding: '0.75rem 1rem',
                  fontSize: '0.95rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                  fontFamily: "'Nunito', sans-serif"
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
                Contraseña
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKey}
                style={{
                  width: '100%',
                  background: 'var(--bg-elevated)',
                  color: 'var(--text-primary)',
                  border: '1.5px solid var(--border)',
                  borderRadius: '10px',
                  padding: '0.75rem 1rem',
                  fontSize: '0.95rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                  fontFamily: "'Nunito', sans-serif"
                }}
              />
            </div>

            <div style={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border)',
              borderRadius: '10px',
              padding: '0.75rem 1rem',
              fontSize: '0.8rem',
              color: 'var(--text-muted)',
              lineHeight: '1.5'
            }}>
              Tu nombre de usuario se generará automáticamente desde tu email. Podrás cambiarlo una vez desde tu perfil.
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              style={{
                background: 'var(--primary)',
                color: '#fff',
                border: 'none',
                borderRadius: '10px',
                padding: '0.875rem',
                fontSize: '1rem',
                fontWeight: '700',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                marginTop: '0.25rem',
                fontFamily: "'Nunito', sans-serif",
                transition: 'opacity 0.2s'
              }}
            >
              {loading ? 'Creando cuenta...' : 'Crear cuenta gratis'}
            </button>
          </div>

          <div style={{
            borderTop: '1px solid var(--border)',
            marginTop: '1.5rem',
            paddingTop: '1.5rem',
            textAlign: 'center'
          }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
              ¿Ya tienes cuenta?{' '}
              <Link to="/login" style={{ color: 'var(--secondary)', fontWeight: '700', textDecoration: 'none' }}>
                Inicia sesión
              </Link>
            </p>
          </div>
        </div>

        <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '1.5rem' }}>
          <span
            onClick={() => navigate('/')}
            style={{ cursor: 'pointer', color: 'var(--text-muted)' }}
          >
            ← Volver al inicio
          </span>
        </p>

      </div>
    </div>
  )
}

export default Register