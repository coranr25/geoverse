import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import { useTheme } from '../hooks/useTheme'
import { countries } from '../lib/countries'

function Glossary() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { dark, toggle } = useTheme()
  const [discovered, setDiscovered] = useState(new Set())
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [countryData, setCountryData] = useState(null)
  const [dataLoading, setDataLoading] = useState(false)

  useEffect(() => {
    async function fetchDiscovered() {
      if (!user) {
        setLoading(false)
        return
      }
      const { data } = await supabase
        .from('discovered_countries')
        .select('country_code')
        .eq('user_id', user.id)

      setDiscovered(new Set(data?.map(d => d.country_code) || []))
      setLoading(false)
    }

    fetchDiscovered()
  }, [user])

  async function handleSelect(country) {
    if (!discovered.has(country.code)) return
    setSelected(country)
    setCountryData(null)
    setDataLoading(true)

    try {
      const res = await fetch(`https://restcountries.com/v3.1/alpha/${country.code}`)
      const data = await res.json()
      setCountryData(data[0])
    } catch {
      setCountryData(null)
    }

    setDataLoading(false)
  }

  const discoveredCount = discovered.size
  const totalCount = countries.length

  if (loading) return <div style={{ minHeight: '100vh', background: 'var(--bg-base)' }} />

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

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem' }}>

        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '800', margin: '0 0 0.5rem' }}>🗺️ Glosario</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: '0 0 1rem' }}>
            Descubre los países acertando sus banderas en el juego.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ flex: 1, background: 'var(--bg-elevated)', borderRadius: '999px', height: '8px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${(discoveredCount / totalCount) * 100}%`, background: 'var(--primary)', borderRadius: '999px', transition: 'width 0.3s ease' }} />
            </div>
            <span style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--primary)', whiteSpace: 'nowrap' }}>
              {discoveredCount} / {totalCount}
            </span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '0.75rem' }}>
          {countries.map((country) => {
            const isDiscovered = discovered.has(country.code)
            return (
              <div
                key={country.code}
                onClick={() => handleSelect(country)}
                style={{
                  background: 'var(--bg-surface)',
                  border: `2px solid ${isDiscovered ? 'var(--primary)' : 'var(--border)'}`,
                  borderRadius: '12px',
                  padding: '0.75rem 0.5rem',
                  textAlign: 'center',
                  cursor: isDiscovered ? 'pointer' : 'default',
                  transition: 'border-color 0.2s, transform 0.15s',
                  opacity: isDiscovered ? 1 : 0.5
                }}
                onMouseEnter={e => {
                  if (isDiscovered) e.currentTarget.style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                {isDiscovered ? (
                  <>
                    <img
                      src={`https://flagcdn.com/w80/${country.code.toLowerCase()}.png`}
                      alt={country.name_es}
                      style={{ width: '100%', borderRadius: '4px', marginBottom: '0.4rem' }}
                    />
                    <p style={{ fontSize: '0.7rem', fontWeight: '700', margin: 0, lineHeight: 1.2 }}>
                      {country.name_es}
                    </p>
                  </>
                ) : (
                  <>
                    <div style={{ width: '100%', height: '40px', background: 'var(--bg-elevated)', borderRadius: '4px', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                      🔒
                    </div>
                    <p style={{ fontSize: '0.7rem', fontWeight: '700', margin: 0, color: 'var(--text-muted)', lineHeight: 1.2 }}>
                      ???
                    </p>
                  </>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {selected && (
        <div
          onClick={() => setSelected(null)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '1.5rem' }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{ background: 'var(--bg-surface)', border: '2px solid var(--border)', borderRadius: '24px', padding: '2rem', maxWidth: '400px', width: '100%' }}
          >
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <img
                src={`https://flagcdn.com/w320/${selected.code.toLowerCase()}.png`}
                alt={selected.name_es}
                style={{ width: '100%', maxWidth: '240px', borderRadius: '12px', border: '2px solid var(--border)', marginBottom: '1rem' }}
              />
              <h2 style={{ fontSize: '1.5rem', fontWeight: '800', margin: '0 0 0.25rem' }}>{selected.name_es}</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>{selected.name_en}</p>
            </div>

            {dataLoading ? (
              <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Cargando datos...</p>
            ) : countryData ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {[
                  { label: '🏙️ Capital', value: countryData.capital?.[0] || '—' },
                  { label: '🌍 Continente', value: countryData.continents?.[0] || '—' },
                  { label: '👥 Población', value: countryData.population ? countryData.population.toLocaleString() : '—' },
                  { label: '📐 Superficie', value: countryData.area ? `${countryData.area.toLocaleString()} km²` : '—' },
                  { label: '🗣️ Idiomas', value: countryData.languages ? Object.values(countryData.languages).slice(0, 3).join(', ') : '—' },
                  { label: '💰 Moneda', value: countryData.currencies ? Object.values(countryData.currencies).map(c => `${c.name} (${c.symbol})`).join(', ') : '—' },
                ].map(({ label, value }) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-elevated)', borderRadius: '10px', padding: '0.75rem 1rem' }}>
                    <span style={{ fontSize: '0.875rem', fontWeight: '700' }}>{label}</span>
                    <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)', textAlign: 'right', maxWidth: '60%' }}>{value}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>No se pudieron cargar los datos.</p>
            )}

            <button
              onClick={() => setSelected(null)}
              style={{ marginTop: '1.5rem', width: '100%', background: 'var(--bg-elevated)', color: 'var(--text-primary)', border: '1px solid var(--border)', borderRadius: '10px', padding: '0.75rem', fontSize: '0.95rem', fontWeight: '700', cursor: 'pointer', fontFamily: "'Nunito', sans-serif" }}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

    </div>
  )
}

export default Glossary