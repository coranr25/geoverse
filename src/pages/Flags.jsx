import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import { countries } from '../lib/countries'

function shuffle(array) {
  return [...array].sort(() => Math.random() - 0.5)
}

function Flags() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [queue, setQueue] = useState([])
  const [current, setCurrent] = useState(0)
  const [input, setInput] = useState('')
  const [feedback, setFeedback] = useState(null)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setQueue(shuffle(countries))
  }, [])

  const country = queue[current]

  function validate() {
    if (!input.trim()) return

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

  async function saveScore() {
    setSaving(true)
    await supabase.from('scores').insert({
      user_id: user.id,
      game: 'flags',
      score,
    })
    setSaving(false)
    navigate('/')
  }

  if (queue.length === 0) return <div style={{ minHeight: '100vh', background: 'var(--bg-base)' }} />

  if (finished) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-base)', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '16px', padding: '2rem', textAlign: 'center', maxWidth: '360px', width: '100%' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>Partida terminada</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            Acertaste <span style={{ color: 'var(--primary)', fontWeight: '700' }}>{score}</span> de {queue.length}
          </p>
          <button
            onClick={saveScore}
            disabled={saving}
            style={{ background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '8px', padding: '0.75rem 1.5rem', fontSize: '0.95rem', fontWeight: '600', cursor: 'pointer', width: '100%', opacity: saving ? 0.6 : 1 }}
          >
            {saving ? 'Guardando...' : 'Guardar y volver'}
          </button>
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
      <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '16px', padding: '2rem', textAlign: 'center', maxWidth: '380px', width: '100%' }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <button
            onClick={() => navigate('/')}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.85rem' }}
          >
            ← Volver
          </button>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{current + 1} / {queue.length}</span>
          <span style={{ color: 'var(--primary)', fontWeight: '700', fontSize: '0.85rem' }}>{score} pts</span>
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

        {feedback === 'incorrect' && (
          <p style={{ color: '#ef4444', fontSize: '0.85rem', marginBottom: '0.75rem' }}>
            Incorrecto. Era: {country.name_es} / {country.name_en}
          </p>
        )}

        <button
          onClick={validate}
          style={{ background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '8px', padding: '0.75rem', fontSize: '0.95rem', fontWeight: '600', cursor: 'pointer', width: '100%' }}
        >
          Comprobar
        </button>

      </div>
    </div>
  )
}

export default Flags