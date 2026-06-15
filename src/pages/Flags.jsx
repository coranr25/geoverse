import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import { countries } from '../lib/countries'

function shuffle(array) {
  return [...array].sort(() => Math.random() - 0.5)
}

const MODES = [
  { label: '10 banderas', value: 10, description: 'Sesión rápida' },
  { label: '25 banderas', value: 25, description: 'Sesión media' },
  { label: '50 banderas', value: 50, description: 'Sesión larga' },
  { label: '195 banderas', value: 195, description: 'Todas' },
]

function formatTime(seconds) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

function Flags() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [mode, setMode] = useState(null)
  const [queue, setQueue] = useState([])
  const [current, setCurrent] = useState(0)
  const [input, setInput] = useState('')
  const [feedback, setFeedback] = useState(null)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [time, setTime] = useState(0)
  const [showExit, setShowExit] = useState(false)

  function startGame(selectedMode) {
    setMode(selectedMode)
    setQueue(shuffle(countries).slice(0, selectedMode))
    setCurrent(0)
    setScore(0)
    setFinished(false)
    setSaved(false)
    setInput('')
    setFeedback(null)
    setTime(0)
  }

  useEffect(() => {
    if (!mode || finished) return
    const interval = setInterval(() => setTime((t) => t + 1), 1000)
    return () => clearInterval(interval)
  }, [mode, finished])

  useEffect(() => {
    if (finished && !saved && user && mode !== null) {
      setSaved(true)
      setSaving(true)
      supabase.from('scores').insert({
        user_id: user.id,
        game: 'flags',
        score,
        total: mode,
        time_seconds: time,
      }).then(() => setSaving(false))
    }
  }, [finished])

  const country = queue[current]

  function validate() {
    if (!input.trim() || feedback) return

    const answer = input.trim().toLowerCase()
    const correct = answer === country.name_es || answer === country.name_en

    if (correct) {
      setScore((s) => s + 1)
      setFeedback('correct')
    } else {
      setFeedback('incorrect')
    }

    setTimeout(() => {
      setFeedback(null)
      setInput('')
      if (current + 1 >= queue.length) {
        setFinished(true)
      } else {
        setCurrent((c) => c + 1)
      }
    }, 800)
  }

  function handleKey(e) {
    if (e.key === 'Enter') validate()
  }

  function handleExit() {
    setShowExit(true)
  }

  function confirmExit() {
    navigate('/')
  }

  function cancelExit() {
    setShowExit(false)
  }

  if (!mode) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-base)', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
        <div style={{ maxWidth: '420px', width: '100%' }}>
          <button
            onClick={() => navigate('/')}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.85rem', marginBottom: '2rem', padding: 0 }}
          >
            ← Volver
          </button>

          <h1 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>🏳️ Banderas</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '2rem' }}>Elige cuántas banderas quieres adivinar</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {MODES.map((m) => (
              <div
                key={m.value}
                onClick={() => startGame(m.value)}
                style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.25rem 1.5rem', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'border-color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
              >
                <div>
                  <p style={{ fontWeight: '600', margin: '0 0 0.25rem', fontSize: '0.95rem' }}>{m.label}</p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', margin: 0 }}>{m.description}</p>
                </div>
                <span style={{ color: 'var(--primary)', fontSize: '1.2rem' }}>→</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (finished) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-base)', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '16px', padding: '2rem', textAlign: 'center', maxWidth: '360px', width: '100%' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>Partida terminada</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
            Acertaste <span style={{ color: 'var(--primary)', fontWeight: '700' }}>{score}</span> de {mode}
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
            {Math.round((score / mode) * 100)}% de aciertos
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
            ⏱ Tiempo: <span style={{ color: 'var(--primary)', fontWeight: '700' }}>{formatTime(time)}</span>
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {!user && (
              <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '8px', padding: '0.75rem 1rem', textAlign: 'center' }}>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '0 0 0.5rem' }}>
                  Tu puntuación no se ha guardado.
                </p>
                <p style={{ fontSize: '0.85rem', margin: 0 }}>
                  <span
                    onClick={() => navigate('/register')}
                    style={{ color: 'var(--primary)', cursor: 'pointer', fontWeight: '600' }}
                  >
                    Regístrate
                  </span>
                  {' '}o{' '}
                  <span
                    onClick={() => navigate('/login')}
                    style={{ color: 'var(--primary)', cursor: 'pointer', fontWeight: '600' }}
                  >
                    inicia sesión
                  </span>
                  {' '}para guardar tu progreso.
                </p>
              </div>
            )}
            <button
              onClick={() => navigate('/')}
              disabled={saving}
              style={{ background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '8px', padding: '0.75rem 1.5rem', fontSize: '0.95rem', fontWeight: '600', cursor: saving ? 'not-allowed' : 'pointer', width: '100%', opacity: saving ? 0.6 : 1 }}
            >
              {saving ? 'Guardando...' : 'Volver al inicio'}
            </button>
            <button
              onClick={() => startGame(mode)}
              disabled={saving}
              style={{ background: 'var(--bg-elevated)', color: 'var(--text-primary)', border: '1px solid var(--border)', borderRadius: '8px', padding: '0.75rem 1.5rem', fontSize: '0.95rem', cursor: saving ? 'not-allowed' : 'pointer', width: '100%', opacity: saving ? 0.6 : 1 }}
            >
              Jugar de nuevo
            </button>
          </div>
        </div>
      </div>
    )
  }

  const inputBorder = feedback === 'correct'
    ? '#22c55e'
    : feedback === 'incorrect'
    ? '#ef4444'
    : 'var(--border)'

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>

      {showExit && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '1rem' }}>
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '16px', padding: '2rem', maxWidth: '340px', width: '100%', textAlign: 'center' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.5rem' }}>¿Salir de la partida?</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>El progreso actual no se guardará.</p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={cancelExit}
                style={{ flex: 1, background: 'var(--bg-elevated)', color: 'var(--text-primary)', border: '1px solid var(--border)', borderRadius: '8px', padding: '0.75rem', fontSize: '0.9rem', cursor: 'pointer' }}
              >
                Cancelar
              </button>
              <button
                onClick={confirmExit}
                style={{ flex: 1, background: '#ef4444', color: '#fff', border: 'none', borderRadius: '8px', padding: '0.75rem', fontSize: '0.9rem', fontWeight: '600', cursor: 'pointer' }}
              >
                Salir
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '16px', padding: '2rem', textAlign: 'center', maxWidth: '380px', width: '100%' }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <button
            onClick={handleExit}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.85rem' }}
          >
            ← Salir
          </button>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{current + 1} / {mode}</span>
          <span style={{ color: 'var(--primary)', fontWeight: '700', fontSize: '0.85rem' }}>{formatTime(time)}</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Puntos: <span style={{ color: 'var(--primary)', fontWeight: '700' }}>{score}</span></span>
        </div>

        <img
          src={`https://flagcdn.com/w320/${country.code.toLowerCase()}.png`}
          alt="Bandera"
          style={{ width: '100%', maxWidth: '260px', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid var(--border)' }}
        />

        <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '0.75rem' }}>
          Escribe el nombre en español o inglés. Respeta los acentos (México, Brasil...).
        </p>

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Nombre del país..."
          autoFocus
          style={{ width: '100%', background: 'var(--bg-elevated)', color: 'var(--text-primary)', border: `2px solid ${inputBorder}`, borderRadius: '8px', padding: '0.75rem 1rem', fontSize: '0.95rem', outline: 'none', marginBottom: '0.75rem', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
        />

        {feedback === 'correct' && (
          <div style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid #22c55e', borderRadius: '8px', padding: '0.75rem', marginBottom: '0.75rem' }}>
            <p style={{ color: '#22c55e', fontSize: '0.9rem', fontWeight: '600', margin: 0 }}>✓ ¡Correcto!</p>
          </div>
        )}

        {feedback === 'incorrect' && (
          <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid #ef4444', borderRadius: '8px', padding: '0.75rem', marginBottom: '0.75rem' }}>
            <p style={{ color: '#ef4444', fontSize: '0.9rem', fontWeight: '600', margin: '0 0 0.25rem' }}>✗ Incorrecto</p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', margin: 0 }}>Era: {country.name_es} / {country.name_en}</p>
          </div>
        )}

        <button
          onClick={validate}
          disabled={!!feedback}
          style={{ background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '8px', padding: '0.75rem', fontSize: '0.95rem', fontWeight: '600', cursor: feedback ? 'not-allowed' : 'pointer', width: '100%', opacity: feedback ? 0.6 : 1 }}
        >
          Comprobar
        </button>

      </div>
    </div>
  )
}

export default Flags