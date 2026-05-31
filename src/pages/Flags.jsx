import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'

const countries = [
  { code: 'ES', name_es: 'españa', name_en: 'spain' },
  { code: 'FR', name_es: 'francia', name_en: 'france' },
  { code: 'DE', name_es: 'alemania', name_en: 'germany' },
  { code: 'IT', name_es: 'italia', name_en: 'italy' },
  { code: 'PT', name_es: 'portugal', name_en: 'portugal' },
  { code: 'GB', name_es: 'reino unido', name_en: 'united kingdom' },
  { code: 'US', name_es: 'estados unidos', name_en: 'united states' },
  { code: 'MX', name_es: 'méxico', name_en: 'mexico' },
  { code: 'BR', name_es: 'brasil', name_en: 'brazil' },
  { code: 'AR', name_es: 'argentina', name_en: 'argentina' },
  { code: 'JP', name_es: 'japón', name_en: 'japan' },
  { code: 'CN', name_es: 'china', name_en: 'china' },
  { code: 'IN', name_es: 'india', name_en: 'india' },
  { code: 'RU', name_es: 'rusia', name_en: 'russia' },
  { code: 'CA', name_es: 'canadá', name_en: 'canada' },
  { code: 'AU', name_es: 'australia', name_en: 'australia' },
  { code: 'ZA', name_es: 'sudáfrica', name_en: 'south africa' },
  { code: 'NG', name_es: 'nigeria', name_en: 'nigeria' },
  { code: 'EG', name_es: 'egipto', name_en: 'egypt' },
  { code: 'SA', name_es: 'arabia saudí', name_en: 'saudi arabia' },
]

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
    const correct =
      answer === country.name_es || answer === country.name_en

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

  if (queue.length === 0) return <div className="min-h-screen bg-gray-950" />

  if (finished) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <div className="bg-gray-900 p-8 rounded-xl text-center max-w-sm w-full">
          <h2 className="text-2xl font-bold mb-2">Partida terminada</h2>
          <p className="text-gray-400 mb-6">
            Acertaste {score} de {queue.length}
          </p>
          <button
            onClick={saveScore}
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 w-full"
          >
            {saving ? 'Guardando...' : 'Guardar y volver'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
      <div className="bg-gray-900 p-8 rounded-xl text-center max-w-sm w-full">
        <div className="flex justify-between text-sm text-gray-400 mb-6">
          <span>{current + 1} / {queue.length}</span>
          <span>Puntos: {score}</span>
        </div>

        <img
          src={`https://flagcdn.com/w320/${country.code.toLowerCase()}.png`}
          alt="Bandera"
          className="mx-auto mb-6 rounded shadow-lg w-64"
        />

        <p className="text-gray-500 text-xs mb-3">
         Escribe el nombre en español o inglés. Respeta los acentos (México, Brasil...).
        </p>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Nombre del país..."
          autoFocus
          className={`w-full bg-gray-800 text-white px-4 py-3 rounded-lg outline-none focus:ring-2 mb-4 transition-colors ${
            feedback === 'correct'
              ? 'ring-2 ring-green-500'
              : feedback === 'incorrect'
              ? 'ring-2 ring-red-500'
              : 'focus:ring-blue-500'
          }`}
        />

        <button
          onClick={validate}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors"
        >
          Comprobar
        </button>

        {feedback === 'incorrect' && (
          <p className="text-red-400 text-sm mt-3">
            Incorrecto. Era: {country.name_es} / {country.name_en}
          </p>
        )}
      </div>
    </div>
  )
}

export default Flags