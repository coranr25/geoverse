import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

function Register() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
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

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '16px', padding: '2rem', width: '100%', maxWidth: '400px' }}>

        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ color: 'var(--primary)', fontSize: '1.75rem', fontWeight: '700', margin: '0 0 0.25rem' }}>GeoVerse</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>Crea tu cuenta para empezar</p>
        </div>

        {error && (
          <p style={{ color: '#f87171', fontSize: '0.85rem', marginBottom: '1rem', background: 'rgba(239,68,68,0.1)', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(239,68,68,0.3)' }}>{error}</p>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <input
            type="text"
            placeholder="Nombre de usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ background: 'var(--bg-elevated)', color: 'var(--text-primary)', border: '1px solid var(--border)', borderRadius: '8px', padding: '0.75rem 1rem', fontSize: '0.95rem', outline: 'none' }}
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ background: 'var(--bg-elevated)', color: 'var(--text-primary)', border: '1px solid var(--border)', borderRadius: '8px', padding: '0.75rem 1rem', fontSize: '0.95rem', outline: 'none' }}
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ background: 'var(--bg-elevated)', color: 'var(--text-primary)', border: '1px solid var(--border)', borderRadius: '8px', padding: '0.75rem 1rem', fontSize: '0.95rem', outline: 'none' }}
          />
          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{ background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '8px', padding: '0.75rem', fontSize: '0.95rem', fontWeight: '600', cursor: 'pointer', opacity: loading ? 0.6 : 1, marginTop: '0.25rem' }}
          >
            {loading ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>
        </div>

        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '1.5rem', textAlign: 'center' }}>
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" style={{ color: 'var(--secondary)', textDecoration: 'none', fontWeight: '500' }}>
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Register