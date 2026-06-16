import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import { countries } from '../lib/countries'

function shuffle(array) {
  return [...array].sort(() => Math.random() - 0.5)
}

const MODES = [
  { label: '10 banderas', value: 10, description: 'Sesión rápida', emoji: '⚡' },
  { label: '25 banderas', value: 25, description: 'Sesión media', emoji: '🎯' },
  { label: '50 banderas', value: 50, description: 'Sesión larga', emoji: '🔥' },
  { label: '195 banderas', value: 195, description: 'Todas', emoji: '🌍' },
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
  if (user) {
  supabase.from('discovered_countries').upsert({
    user_id: user.id,
    country_code: country.code,
  }, { onConflict: 'user_id,country_code' })
}
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

  if (!mode) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-base)', color: 'var(--text-primary)', fontFamily: "'Nunito', sans-serif", padding: '2rem' }}>
        <div style={{ maxWidth: '480px', margin: '0 auto' }}>

          <button
            onClick={() => navigate('/')}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '600', padding: 0, marginBottom: '2rem', fontFamily: "'Nunito', sans-serif" }}
          >
            ← Menú principal
          </button>

          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>🏳️</div>
            <h1 style={{ fontSize: '2rem', fontWeight: '800', margin: '0 0 0.5rem' }}>Banderas</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: 0 }}>Elige cuántas banderas quieres adivinar</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {MODES.map((m) => (
              <div
                key={m.value}
                onClick={() => startGame(m.value)}
                style={{
                  background: 'var(--bg-surface)',
                  border: '2px solid var(--border)',
                  borderRadius: '16px',
                  padding: '1.25rem 1.5rem',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'border-color 0.2s, transform 0.15s'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'var(--primary)'
                  e.currentTarget.style.transform = 'translateX(4px)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'var(--border)'
                  e.currentTarget.style.transform = 'translateX(0)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ fontSize: '1.75rem' }}>{m.emoji}</span>
                  <div>
                    <p style={{ fontWeight: '800', margin: '0 0 0.2rem', fontSize: '1rem' }}>{m.label}</p>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', margin: 0 }}>{m.description}</p>
                  </div>
                </div>
                <span style={{ color: 'var(--primary)', fontSize: '1.25rem', fontWeight: '800' }}>→</span>
              </div>
            ))}
          </div>

          {!user && (
            <div style={{
              marginTop: '1.5rem',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              padding: '1rem 1.25rem',
              textAlign: 'center'
            }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '0 0 0.25rem' }}>
                Estás jugando sin cuenta.
              </p>
              <p style={{ fontSize: '0.85rem', margin: 0 }}>
                <span onClick={() => navigate('/register')} style={{ color: 'var(--primary)', cursor: 'pointer', fontWeight: '700' }}>Regístrate</span>
                {' '}para guardar tu progreso.
              </p>
            </div>
          )}

        </div>
      </div>
    )
  }

  if (finished) {
    const pct = Math.round((score / mode) * 100)
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-base)', color: 'var(--text-primary)', fontFamily: "'Nunito', sans-serif", display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
        <div style={{ background: 'var(--bg-surface)', border: '2px solid var(--border)', borderRadius: '24px', padding: '2.5rem 2rem', textAlign: 'center', maxWidth: '380px', width: '100%' }}>

          <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>
            {pct === 100 ? '🏆' : pct >= 75 ? '🌟' : pct >= 50 ? '👏' : pct >= 25 ? '💪' : '📚'}
          </div>

          <h2 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '0.5rem' }}>Partida terminada</h2>

          <div style={{
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            padding: '1rem',
            margin: '1.5rem 0',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '0.5rem',
            textAlign: 'center'
          }}>
            <div>
              <p style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--primary)', margin: '0 0 0.25rem' }}>{score}</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', margin: 0 }}>Aciertos</p>
            </div>
            <div>
              <p style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--primary)', margin: '0 0 0.25rem' }}>{pct}%</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', margin: 0 }}>Precisión</p>
            </div>
            <div>
              <p style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--primary)', margin: '0 0 0.25rem' }}>{formatTime(time)}</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', margin: 0 }}>Tiempo</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {!user && (
              <div style={{
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border)',
                borderRadius: '10px',
                padding: '0.75rem 1rem'
              }}>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '0 0 0.4rem' }}>Tu puntuación no se ha guardado.</p>
                <p style={{ fontSize: '0.85rem', margin: 0 }}>
                  <span onClick={() => navigate('/register')} style={{ color: 'var(--primary)', cursor: 'pointer', fontWeight: '700' }}>Regístrate</span>
                  {' '}o{' '}
                  <span onClick={() => navigate('/login')} style={{ color: 'var(--primary)', cursor: 'pointer', fontWeight: '700' }}>inicia sesión</span>
                  {' '}para guardar tu progreso.
                </p>
              </div>
            )}
            <button
              onClick={() => startGame(mode)}
              disabled={saving}
              style={{
                background: 'var(--primary)',
                color: '#fff',
                border: 'none',
                borderRadius: '10px',
                padding: '0.875rem',
                fontSize: '1rem',
                fontWeight: '700',
                cursor: saving ? 'not-allowed' : 'pointer',
                width: '100%',
                opacity: saving ? 0.6 : 1,
                fontFamily: "'Nunito', sans-serif"
              }}
            >
              {saving ? 'Guardando...' : '🔄 Jugar de nuevo'}
            </button>
            <button
              onClick={() => navigate('/')}
              disabled={saving}
              style={{
                background: 'none',
                color: 'var(--text-primary)',
                border: '1px solid var(--border)',
                borderRadius: '10px',
                padding: '0.875rem',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: saving ? 'not-allowed' : 'pointer',
                width: '100%',
                opacity: saving ? 0.6 : 1,
                fontFamily: "'Nunito', sans-serif"
              }}
            >
              ← Menú principal
            </button>
          </div>
        </div>
      </div>
    )
  }

  const inputBorder = feedback === 'correct' ? '#22c55e' : feedback === 'incorrect' ? '#ef4444' : 'var(--border)'
  const progress = ((current) / mode) * 100

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', color: 'var(--text-primary)', fontFamily: "'Nunito', sans-serif", display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>

      {showExit && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '1rem' }}>
          <div style={{ background: 'var(--bg-surface)', border: '2px solid var(--border)', borderRadius: '20px', padding: '2rem', maxWidth: '340px', width: '100%', textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🚪</div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '0.5rem' }}>¿Salir de la partida?</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>El progreso actual no se guardará.</p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={() => setShowExit(false)}
                style={{ flex: 1, background: 'var(--bg-elevated)', color: 'var(--text-primary)', border: '1px solid var(--border)', borderRadius: '10px', padding: '0.75rem', fontSize: '0.95rem', fontWeight: '600', cursor: 'pointer', fontFamily: "'Nunito', sans-serif" }}
              >
                Cancelar
              </button>
              <button
                onClick={() => navigate('/')}
                style={{ flex: 1, background: '#ef4444', color: '#fff', border: 'none', borderRadius: '10px', padding: '0.75rem', fontSize: '0.95rem', fontWeight: '700', cursor: 'pointer', fontFamily: "'Nunito', sans-serif" }}
              >
                Salir
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ background: 'var(--bg-surface)', border: '2px solid var(--border)', borderRadius: '24px', padding: '2rem', textAlign: 'center', maxWidth: '400px', width: '100%' }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <button
            onClick={() => setShowExit(true)}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.875rem', fontWeight: '600', padding: 0, fontFamily: "'Nunito', sans-serif" }}
          >
            ← Salir
          </button>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: '600' }}>{current + 1} / {mode}</span>
          <span style={{ color: 'var(--primary)', fontWeight: '800', fontSize: '0.875rem' }}>⏱ {formatTime(time)}</span>
        </div>

        <div style={{ background: 'var(--bg-elevated)', borderRadius: '999px', height: '6px', marginBottom: '1.5rem', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${progress}%`, background: 'var(--primary)', borderRadius: '999px', transition: 'width 0.3s ease' }} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <span style={{
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border)',
            borderRadius: '999px',
            padding: '0.3rem 1rem',
            fontSize: '0.85rem',
            fontWeight: '700',
            color: 'var(--primary)'
          }}>
            ⭐ {score} puntos
          </span>
        </div>

        <img
          src={`https://flagcdn.com/w320/${country.code.toLowerCase()}.png`}
          alt="Bandera"
          style={{ width: '100%', maxWidth: '280px', borderRadius: '12px', marginBottom: '1.5rem', border: '2px solid var(--border)' }}
        />

        <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '0.75rem' }}>
          Escribe en español o inglés · Respeta los acentos
        </p>

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Nombre del país..."
          autoFocus
          style={{
            width: '100%',
            background: 'var(--bg-elevated)',
            color: 'var(--text-primary)',
            border: `2px solid ${inputBorder}`,
            borderRadius: '10px',
            padding: '0.875rem 1rem',
            fontSize: '1rem',
            outline: 'none',
            marginBottom: '0.75rem',
            boxSizing: 'border-box',
            transition: 'border-color 0.2s',
            fontFamily: "'Nunito', sans-serif",
            fontWeight: '600'
          }}
        />

        {feedback === 'correct' && (
          <div style={{ background: 'rgba(34,197,94,0.1)', border: '2px solid #22c55e', borderRadius: '10px', padding: '0.75rem', marginBottom: '0.75rem' }}>
            <p style={{ color: '#22c55e', fontSize: '1rem', fontWeight: '800', margin: 0 }}>✓ ¡Correcto!</p>
          </div>
        )}

        {feedback === 'incorrect' && (
          <div style={{ background: 'rgba(239,68,68,0.1)', border: '2px solid #ef4444', borderRadius: '10px', padding: '0.75rem', marginBottom: '0.75rem' }}>
            <p style={{ color: '#ef4444', fontSize: '1rem', fontWeight: '800', margin: '0 0 0.25rem' }}>✗ Incorrecto</p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>Era: {country.name_es} / {country.name_en}</p>
          </div>
        )}

        <button
          onClick={validate}
          disabled={!!feedback}
          style={{
            background: 'var(--primary)',
            color: '#fff',
            border: 'none',
            borderRadius: '10px',
            padding: '0.875rem',
            fontSize: '1rem',
            fontWeight: '700',
            cursor: feedback ? 'not-allowed' : 'pointer',
            width: '100%',
            opacity: feedback ? 0.6 : 1,
            fontFamily: "'Nunito', sans-serif"
          }}
        >
          Comprobar
        </button>

      </div>
    </div>
  )
}

export default Flags