import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { colors, fonts, radius } from '../theme'

const RITUAL_CATALOG = {
  morning: [
    { slug: 'gratitude-journal', title: 'Gratitude Journal', desc: 'Write 3 things you\'re grateful for', duration: 5 },
    { slug: 'morning-breathwork', title: 'Morning Breathwork', desc: 'Box breathing to center your energy', duration: 10 },
    { slug: 'intention-setting', title: 'Intention Setting', desc: 'Choose your focus for the day', duration: 3 },
    { slug: 'morning-movement', title: 'Morning Movement', desc: 'Gentle yoga or stretching flow', duration: 15 },
    { slug: 'hydration-ritual', title: 'Hydration Ritual', desc: 'Warm lemon water + mindful sipping', duration: 5 },
    { slug: 'morning-pages', title: 'Morning Pages', desc: 'Stream of consciousness writing', duration: 20 },
  ],
  afternoon: [
    { slug: 'mindful-walk', title: 'Mindful Walk', desc: 'Step outside, no phone, breathe', duration: 15 },
    { slug: 'body-checkin', title: 'Body Check-In', desc: 'Scan for tension, breathe into it', duration: 5 },
    { slug: 'gratitude-pause', title: 'Gratitude Pause', desc: 'Name 3 good things about today so far', duration: 3 },
    { slug: 'nourishment-break', title: 'Nourishment Break', desc: 'Eat slowly, taste everything', duration: 15 },
    { slug: 'stillness-reset', title: 'Stillness Reset', desc: 'Close your eyes, just breathe', duration: 10 },
  ],
  night: [
    { slug: 'evening-reflection', title: 'Evening Reflection', desc: 'What went well? What did I learn?', duration: 10 },
    { slug: 'digital-sunset', title: 'Digital Sunset', desc: 'All screens off, dim the lights', duration: 5 },
    { slug: 'body-scan', title: 'Body Scan', desc: 'Release tension from head to toe', duration: 15 },
    { slug: 'gratitude-close', title: 'Gratitude Close', desc: '3 things from today I\'m grateful for', duration: 5 },
    { slug: 'sleep-story', title: 'Sleep Story', desc: 'Drift off with a guided narrative', duration: 25 },
    { slug: 'tomorrows-intention', title: 'Tomorrow\'s Intention', desc: 'Set one focus for tomorrow', duration: 3 },
  ],
}

const SECTIONS = [
  { key: 'morning', label: 'MORNING' },
  { key: 'afternoon', label: 'AFTERNOON' },
  { key: 'night', label: 'NIGHT' },
]

export default function Rituals() {
  const navigate = useNavigate()

  const [selections, setSelections] = useState(() => {
    try {
      const stored = localStorage.getItem('stoa-rituals')
      return stored ? JSON.parse(stored) : { morning: [], afternoon: [], night: [] }
    } catch { return { morning: [], afternoon: [], night: [] } }
  })

  function toggle(timeKey, slug) {
    setSelections(prev => {
      const arr = prev[timeKey] || []
      const next = arr.includes(slug)
        ? arr.filter(s => s !== slug)
        : [...arr, slug]
      const updated = { ...prev, [timeKey]: next }
      localStorage.setItem('stoa-rituals', JSON.stringify(updated))
      return updated
    })
  }

  const totalSelected = Object.values(selections).reduce((sum, arr) => sum + arr.length, 0)

  return (
    <div style={{
      height: '100%',
      overflowY: 'auto',
      background: colors.bg,
      WebkitOverflowScrolling: 'touch',
    }}>
      {/* Header */}
      <div style={{
        padding: '60px 20px 20px',
        display: 'flex', alignItems: 'center', gap: 16,
      }}>
        <svg onClick={() => navigate(-1)} width={24} height={24} viewBox="0 0 24 24" fill="none" stroke={colors.text} strokeWidth={1.5} strokeLinecap="round" style={{ cursor: 'pointer', flexShrink: 0 }}>
          <polyline points="15 18 9 12 15 6" />
        </svg>
        <div>
          <h1 style={{ fontFamily: fonts.sans, fontSize: 22, fontWeight: 300, color: colors.text, letterSpacing: -0.5 }}>
            My Rituals
          </h1>
          {totalSelected > 0 && (
            <p style={{ fontFamily: fonts.sans, fontSize: 12, color: colors.text3, marginTop: 4 }}>
              {totalSelected} ritual{totalSelected !== 1 ? 's' : ''} selected
            </p>
          )}
        </div>
      </div>

      {/* Sections */}
      {SECTIONS.map(({ key, label }) => (
        <div key={key} style={{ padding: '8px 20px 24px' }}>
          <p style={{
            fontFamily: fonts.sans, fontSize: 10, fontWeight: 600,
            color: colors.text3, letterSpacing: 3, textTransform: 'uppercase',
            marginBottom: 14, paddingLeft: 4,
          }}>
            {label}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {RITUAL_CATALOG[key].map(ritual => {
              const selected = (selections[key] || []).includes(ritual.slug)
              return (
                <div key={ritual.slug} onClick={() => toggle(key, ritual.slug)} style={{
                  background: colors.surface, borderRadius: 14, padding: '16px 18px',
                  display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer',
                  border: selected ? '1px solid rgba(255,255,255,0.2)' : `1px solid ${colors.border}`,
                  boxShadow: selected ? '0 0 12px rgba(255,255,255,0.04)' : 'none',
                  transition: 'border 0.2s, box-shadow 0.2s',
                }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontFamily: fonts.sans, fontSize: 14, fontWeight: 500, color: colors.text, marginBottom: 4 }}>
                      {ritual.title}
                    </p>
                    <p style={{ fontFamily: fonts.sans, fontSize: 12, color: colors.text3, lineHeight: 1.4 }}>
                      {ritual.desc}
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
                    <span style={{ fontFamily: fonts.sans, fontSize: 11, color: colors.text3 }}>
                      {ritual.duration} min
                    </span>
                    <div style={{
                      width: 24, height: 24, borderRadius: 12,
                      border: selected ? 'none' : '1.5px solid rgba(255,255,255,0.2)',
                      background: selected ? 'rgba(255,255,255,0.15)' : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'background 0.2s, border 0.2s',
                    }}>
                      {selected && (
                        <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ))}

      {/* Bottom spacer for tab bar */}
      <div style={{ height: 100 }} />
    </div>
  )
}
