import { useState } from 'react'
import { colors, fonts, radius } from '../theme'

// --- Universe Notes system (same as other pages) ---
function seededRandom(seed) {
  let s = seed
  return () => {
    s = (s * 16807 + 0) % 2147483647
    return (s - 1) / 2147483646
  }
}

function getDailySeed() {
  const d = new Date()
  return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate()
}

const UNIVERSE_NOTES = [
  "Everything is always working out for me.",
  "I am exactly where I need to be.",
  "I am magnetic. I attract what is meant for me.",
  "The universe is rearranging in my favor.",
  "I am becoming the most powerful version of myself.",
  "I am worthy of everything I desire.",
  "My energy speaks before I do.",
  "I am aligned with my highest self.",
  "Abundance flows to me effortlessly.",
  "I trust the timing of my life.",
  "I am the creator of my reality.",
  "Every day I am growing into who I was always meant to be.",
  "I radiate confidence, grace, and power.",
  "My peace is my priority and my power.",
  "I am surrounded by love and support.",
]

function pickNote(pageIndex) {
  const seed = getDailySeed() + pageIndex * 9999
  const rng = seededRandom(seed)
  return UNIVERSE_NOTES[Math.floor(rng() * UNIVERSE_NOTES.length)]
}

// --- Section label style ---
const sectionLabel = {
  fontFamily: fonts.sans, fontSize: 10, fontWeight: 600,
  color: colors.text3, letterSpacing: 3, textTransform: 'uppercase',
  marginBottom: 14,
}

// --- Practitioners data ---
const practitioners = [
  { initial: 'S', name: 'Sarah M.', specialty: 'Yoga & Breathwork', next: 'Tomorrow, 9:00 AM' },
  { initial: 'A', name: 'Amara J.', specialty: 'Meditation & Sound Healing', next: 'Friday, 6:00 PM' },
  { initial: 'N', name: 'Nadia C.', specialty: 'Pilates & Wellness', next: 'Saturday, 10:00 AM' },
]

// --- Integrations data ---
const integrations = [
  { name: 'Apple Health', connected: true },
  { name: 'Spotify', connected: true },
  { name: 'YouTube', connected: false },
]

// --- Settings data ---
const settings = [
  { label: 'Notifications', indicator: 'On' },
  { label: 'Appearance', indicator: 'Dark' },
  { label: 'Practitioner Mode', indicator: 'Off' },
  { label: 'Privacy', indicator: null },
  { label: 'Help', indicator: null },
]

// --- Chevron icon ---
function Chevron({ color = colors.text3 }) {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  )
}

function getProfileStats() {
  // Journal entries
  let journalCount = 0
  try {
    const entries = JSON.parse(localStorage.getItem('stoa-journal-entries') || '[]')
    journalCount = entries.length
  } catch {}

  // Ritual completions — count total completed
  let ritualDays = 0
  try {
    const completions = JSON.parse(localStorage.getItem('stoa-ritual-completions') || '{}')
    ritualDays = Object.keys(completions).length
  } catch {}

  // Streak — days with ritual completions
  let streak = 0
  try {
    const completions = JSON.parse(localStorage.getItem('stoa-ritual-completions') || '{}')
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    for (let i = 0; i < 365; i++) {
      const d = new Date(today)
      d.setDate(d.getDate() - i)
      const key = d.toISOString().split('T')[0]
      if (completions[key] && completions[key].length > 0) streak++
      else if (i > 0) break
    }
  } catch {}

  return { journalCount, ritualDays, streak }
}

export default function Profile() {
  const [vibe, setVibe] = useState(() => {
    try { return localStorage.getItem('stoa-vibe') || 'universal' } catch { return 'universal' }
  })
  const stats = getProfileStats()

  const handleVibeChange = (v) => {
    setVibe(v)
    try { localStorage.setItem('stoa-vibe', v) } catch {}
  }

  return (
    <div style={{
      height: '100%',
      overflowY: 'auto',
      paddingBottom: 160,
      background: colors.bg,
    }}>
      {/* 1. Header */}
      <div style={{ padding: '60px 24px 0' }}>
        <p style={{
          fontFamily: fonts.sans, fontSize: 10, fontWeight: 600,
          color: colors.text3, letterSpacing: 3, textTransform: 'uppercase',
          marginBottom: 4,
        }}>
          Your space
        </p>
        <h1 style={{
          fontFamily: fonts.sans, fontSize: 28, fontWeight: 300,
          color: colors.text, lineHeight: 1.2, marginBottom: 28,
        }}>
          Profile
        </h1>
      </div>

      {/* 2. Avatar & Name */}
      <div style={{ padding: '0 24px 32px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{
          width: 80, height: 80, borderRadius: 40,
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.15)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 14,
        }}>
          <span style={{
            fontFamily: fonts.sans, fontSize: 28, fontWeight: 300, color: colors.text2,
          }}>
            S
          </span>
        </div>
        <h2 style={{
          fontFamily: fonts.sans, fontSize: 20, fontWeight: 400,
          color: colors.text, marginBottom: 4,
        }}>
          Stoa Member
        </h2>
        <p style={{
          fontFamily: fonts.sans, fontSize: 12, color: colors.text3,
        }}>
          Member since March 2026
        </p>
      </div>

      {/* 3. Journey Summary */}
      <div style={{ padding: '0 16px 20px' }}>
        <p style={{ ...sectionLabel, padding: '0 8px' }}>Journey Summary</p>
        <div style={{
          background: colors.surface, borderRadius: 14,
          display: 'flex',
        }}>
          {[
            { value: String(stats.streak || 0), label: 'day streak' },
            { value: String(stats.ritualDays || 0), label: 'ritual days' },
            { value: String(stats.journalCount || 0), label: 'journal entries' },
          ].map((stat, i) => (
            <div key={stat.label} style={{
              flex: 1, padding: '22px 8px', textAlign: 'center',
              borderRight: i < 2 ? `1px solid ${colors.border}` : 'none',
            }}>
              <p style={{
                fontFamily: fonts.sans, fontSize: 24, fontWeight: 300,
                color: colors.text, marginBottom: 4,
              }}>
                {stat.value}
              </p>
              <p style={{
                fontFamily: fonts.sans, fontSize: 10, fontWeight: 500,
                color: colors.text3, letterSpacing: 0.5,
              }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* My Vibe */}
      <div style={{ padding: '0 16px 20px' }}>
        <p style={{ ...sectionLabel, padding: '0 8px' }}>My Vibe</p>
        <div style={{
          background: colors.surface, borderRadius: 14, padding: '18px 20px',
        }}>
          <p style={{
            fontFamily: fonts.sans, fontSize: 13, fontWeight: 300,
            color: colors.text2, marginBottom: 16, lineHeight: 1.5,
          }}>
            Personalizes quotes, affirmations, and language throughout your experience.
          </p>
          <div style={{ display: 'flex', gap: 8 }}>
            {[
              { key: 'her', label: 'Her' },
              { key: 'his', label: 'His' },
              { key: 'universal', label: 'Universal' },
            ].map(opt => (
              <button
                key={opt.key}
                onClick={() => handleVibeChange(opt.key)}
                style={{
                  flex: 1,
                  fontFamily: fonts.sans, fontSize: 13, fontWeight: vibe === opt.key ? 600 : 400,
                  color: vibe === opt.key ? '#fff' : colors.text3,
                  background: vibe === opt.key ? 'rgba(255,255,255,0.1)' : 'transparent',
                  border: `1px solid ${vibe === opt.key ? 'rgba(255,255,255,0.2)' : colors.border}`,
                  borderRadius: radius.pill, padding: '12px 0', cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 4. My Intentions */}
      <div style={{ padding: '0 16px 20px' }}>
        <p style={{ ...sectionLabel, padding: '0 8px' }}>My Intentions</p>
        <div style={{
          background: colors.surface, borderRadius: 14, overflow: 'hidden',
        }}>
          {[
            'I am becoming the most powerful version of myself.',
            'My peace is non-negotiable.',
            'I attract abundance in all areas of my life.',
          ].map((mantra, i, arr) => (
            <div key={i} style={{
              padding: '16px 20px',
              display: 'flex', alignItems: 'center', gap: 14,
              borderBottom: i < arr.length - 1 ? `1px solid ${colors.border}` : 'none',
            }}>
              <div style={{
                width: 24, height: 24, borderRadius: 12,
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke={colors.text2} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <p style={{
                fontFamily: fonts.sans, fontSize: 14, fontWeight: 300,
                color: colors.text, lineHeight: 1.5,
              }}>
                {mantra}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Universe Note */}
      <div style={{ margin: '0 16px 20px', background: colors.surface, borderRadius: 16, padding: '32px 28px', textAlign: 'center' }}>
        <div style={{ width: 40, height: 1, background: 'rgba(255,255,255,0.06)', margin: '0 auto 20px' }} />
        <p style={{ fontFamily: fonts.sans, fontSize: 10, fontWeight: 600, color: colors.text3, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 16 }}>
          Note from the Universe
        </p>
        <p style={{ fontFamily: fonts.sans, fontSize: 15, fontWeight: 300, color: colors.text, fontStyle: 'italic', lineHeight: 1.7 }}>
          "{pickNote(4)}"
        </p>
      </div>

      {/* 6. My Practitioners */}
      <div style={{ padding: '0 16px 20px' }}>
        <p style={{ ...sectionLabel, padding: '0 8px' }}>My Practitioners</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {practitioners.map((p) => (
            <div key={p.name} style={{
              background: colors.surface, borderRadius: 14, padding: '16px 18px',
              display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer',
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: 22,
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <span style={{
                  fontFamily: fonts.sans, fontSize: 17, fontWeight: 300, color: colors.text2,
                }}>
                  {p.initial}
                </span>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{
                  fontFamily: fonts.sans, fontSize: 15, fontWeight: 400, color: colors.text,
                  marginBottom: 2,
                }}>
                  {p.name}
                </p>
                <p style={{
                  fontFamily: fonts.sans, fontSize: 12, fontWeight: 400, color: colors.text2,
                  marginBottom: 2,
                }}>
                  {p.specialty}
                </p>
                <p style={{
                  fontFamily: fonts.sans, fontSize: 11, color: colors.text3,
                }}>
                  Next session: {p.next}
                </p>
              </div>
              <Chevron />
            </div>
          ))}
        </div>
      </div>

      {/* 7. Integrations */}
      <div style={{ padding: '0 16px 20px' }}>
        <p style={{ ...sectionLabel, padding: '0 8px' }}>Integrations</p>
        <div style={{
          background: colors.surface, borderRadius: 14, overflow: 'hidden',
        }}>
          {integrations.map((item, i, arr) => (
            <div key={item.name} style={{
              padding: '16px 20px',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              borderBottom: i < arr.length - 1 ? `1px solid ${colors.border}` : 'none',
            }}>
              <span style={{
                fontFamily: fonts.sans, fontSize: 15, color: colors.text,
              }}>
                {item.name}
              </span>
              {item.connected ? (
                <span style={{
                  fontFamily: fonts.sans, fontSize: 12, fontWeight: 500,
                  color: 'rgba(130,200,130,0.8)',
                }}>
                  Connected
                </span>
              ) : (
                <span style={{
                  fontFamily: fonts.sans, fontSize: 12, fontWeight: 500,
                  color: colors.text2, cursor: 'pointer',
                }}>
                  Connect
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 8. Settings */}
      <div style={{ padding: '0 16px 20px' }}>
        <p style={{ ...sectionLabel, padding: '0 8px' }}>Settings</p>
        <div style={{
          background: colors.surface, borderRadius: 14, overflow: 'hidden',
        }}>
          {settings.map((item, i, arr) => (
            <div key={item.label} style={{
              padding: '16px 20px',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              borderBottom: i < arr.length - 1 ? `1px solid ${colors.border}` : 'none',
              cursor: 'pointer',
            }}>
              <span style={{
                fontFamily: fonts.sans, fontSize: 15, color: colors.text,
              }}>
                {item.label}
              </span>
              {item.indicator ? (
                <span style={{
                  fontFamily: fonts.sans, fontSize: 12, fontWeight: 500,
                  color: colors.text3,
                }}>
                  {item.indicator}
                </span>
              ) : (
                <Chevron />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 9. Account */}
      <div style={{ padding: '20px 16px 40px', textAlign: 'center' }}>
        <p style={{
          fontFamily: fonts.sans, fontSize: 14, fontWeight: 400,
          color: colors.text3, cursor: 'pointer', marginBottom: 12,
        }}>
          Log Out
        </p>
        <p style={{
          fontFamily: fonts.sans, fontSize: 10, color: colors.text3,
        }}>
          Stoa v1.0.0
        </p>
      </div>
    </div>
  )
}
