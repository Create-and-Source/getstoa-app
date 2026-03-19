import { useState, useRef, useEffect } from 'react'
import { colors, fonts, radius } from '../theme'

export default function Home() {
  // Stillness timer
  const [playing, setPlaying] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const timerRef = useRef(null)

  useEffect(() => {
    if (playing) {
      timerRef.current = setInterval(() => setElapsed(e => e + 1), 1000)
    } else {
      clearInterval(timerRef.current)
    }
    return () => clearInterval(timerRef.current)
  }, [playing])

  const fmt = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`

  return (
    <div style={{
      height: '100%',
      overflowY: 'auto',
      background: colors.bg,
      paddingBottom: 100,
    }}>

      {/* ========== HERO — "Dear body, I trust you." ========== */}
      <div style={{ position: 'relative', height: 520 }}>
        <img src="/skin.jpg" alt="" style={{
          width: '100%', height: '100%', objectFit: 'cover',
        }} />
        <div style={{
          position: 'absolute', top: 56, left: 0, right: 0,
          display: 'flex', justifyContent: 'center',
        }}>
          <span style={{
            fontFamily: fonts.sans, fontSize: 13, fontWeight: 500,
            color: 'rgba(255,255,255,0.7)', letterSpacing: 6, textTransform: 'uppercase',
          }}>
            Stoa
          </span>
        </div>
      </div>

      {/* ========== TODAY'S STATS — beautiful cards ========== */}
      <div style={{ padding: '24px 20px 0' }}>
        <p style={{
          fontFamily: fonts.sans, fontSize: 10, fontWeight: 600,
          color: colors.text3, letterSpacing: 3, textTransform: 'uppercase',
          marginBottom: 14, paddingLeft: 4,
        }}>
          Today
        </p>

        {/* Two-col stat cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>

          {/* Walk */}
          <div style={{
            background: colors.surface, borderRadius: 14, padding: '18px 16px',
            display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
            minHeight: 120,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={colors.text2} strokeWidth={1.5} strokeLinecap="round">
                <path d="M13 4v4l3 3M9 20l3-6 3 6M12 4a1 1 0 100-2 1 1 0 000 2z" />
                <path d="M7 20h10" />
              </svg>
              <span style={{
                fontFamily: fonts.sans, fontSize: 9, fontWeight: 600,
                color: colors.text3, letterSpacing: 1, textTransform: 'uppercase',
              }}>
                Walk
              </span>
            </div>
            <div>
              <p style={{
                fontFamily: fonts.sans, fontSize: 28, fontWeight: 300,
                color: colors.text, lineHeight: 1,
              }}>
                32 <span style={{ fontSize: 13, color: colors.text2 }}>min</span>
              </p>
              <p style={{
                fontFamily: fonts.sans, fontSize: 11, color: colors.text3, marginTop: 4,
              }}>
                1.8 miles
              </p>
            </div>
          </div>

          {/* Meditated */}
          <div style={{
            background: colors.surface, borderRadius: 14, padding: '18px 16px',
            display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
            minHeight: 120,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={colors.text2} strokeWidth={1.5} strokeLinecap="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l3 3" />
              </svg>
              <span style={{
                fontFamily: fonts.sans, fontSize: 9, fontWeight: 600,
                color: colors.text3, letterSpacing: 1, textTransform: 'uppercase',
              }}>
                Stillness
              </span>
            </div>
            <div>
              <p style={{
                fontFamily: fonts.sans, fontSize: 28, fontWeight: 300,
                color: colors.text, lineHeight: 1,
              }}>
                15 <span style={{ fontSize: 13, color: colors.text2 }}>min</span>
              </p>
              <p style={{
                fontFamily: fonts.sans, fontSize: 11, color: colors.text3, marginTop: 4,
              }}>
                Day 34 streak
              </p>
            </div>
          </div>

          {/* Water */}
          <div style={{
            background: colors.surface, borderRadius: 14, padding: '18px 16px',
            display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
            minHeight: 120,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={colors.text2} strokeWidth={1.5} strokeLinecap="round">
                <path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z" />
              </svg>
              <span style={{
                fontFamily: fonts.sans, fontSize: 9, fontWeight: 600,
                color: colors.text3, letterSpacing: 1, textTransform: 'uppercase',
              }}>
                Water
              </span>
            </div>
            <div>
              <p style={{
                fontFamily: fonts.sans, fontSize: 28, fontWeight: 300,
                color: colors.text, lineHeight: 1,
              }}>
                5 <span style={{ fontSize: 13, color: colors.text2 }}>of 8</span>
              </p>
              <p style={{
                fontFamily: fonts.sans, fontSize: 11, color: colors.text3, marginTop: 4,
              }}>
                glasses today
              </p>
            </div>
          </div>

          {/* Sleep */}
          <div style={{
            background: colors.surface, borderRadius: 14, padding: '18px 16px',
            display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
            minHeight: 120,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={colors.text2} strokeWidth={1.5} strokeLinecap="round">
                <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
              </svg>
              <span style={{
                fontFamily: fonts.sans, fontSize: 9, fontWeight: 600,
                color: colors.text3, letterSpacing: 1, textTransform: 'uppercase',
              }}>
                Sleep
              </span>
            </div>
            <div>
              <p style={{
                fontFamily: fonts.sans, fontSize: 28, fontWeight: 300,
                color: colors.text, lineHeight: 1,
              }}>
                7.5 <span style={{ fontSize: 13, color: colors.text2 }}>hrs</span>
              </p>
              <p style={{
                fontFamily: fonts.sans, fontSize: 11, color: colors.text3, marginTop: 4,
              }}>
                quality: good
              </p>
            </div>
          </div>
        </div>

        {/* Journal card — full width, tappable */}
        <div style={{
          background: colors.surface, borderRadius: 14, padding: '18px 20px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          cursor: 'pointer', marginBottom: 10,
        }}>
          <div>
            <p style={{
              fontFamily: fonts.sans, fontSize: 15, fontWeight: 500,
              color: colors.text, marginBottom: 3,
            }}>
              Open Journal
            </p>
            <p style={{
              fontFamily: fonts.sans, fontSize: 12, color: colors.text3,
            }}>
              Last entry: 2 hours ago
            </p>
          </div>
          <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={colors.text2} strokeWidth={1.5} strokeLinecap="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </div>

        {/* Gratitude card */}
        <div style={{
          background: colors.surface, borderRadius: 14, padding: '18px 20px',
          cursor: 'pointer',
        }}>
          <p style={{
            fontFamily: fonts.sans, fontSize: 10, fontWeight: 600,
            color: colors.text3, letterSpacing: 2, textTransform: 'uppercase',
            marginBottom: 8,
          }}>
            Today I'm Grateful For
          </p>
          <p style={{
            fontFamily: fonts.sans, fontSize: 14, fontWeight: 300,
            color: colors.text2, fontStyle: 'italic',
          }}>
            Tap to write...
          </p>
        </div>
      </div>

      {/* ========== STILLNESS PLAYER — mudra image ========== */}
      <div style={{ position: 'relative', height: 320, marginTop: 24, marginBottom: 4 }}>
        <img src="/mudra.jpg" alt="" style={{
          width: '100%', height: '100%', objectFit: 'cover',
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.45) 100%)',
        }} />
        <div style={{ position: 'absolute', top: 28, left: 28 }}>
          <p style={{
            fontFamily: fonts.sans, fontSize: 10, fontWeight: 600,
            color: 'rgba(255,255,255,0.4)', letterSpacing: 3, textTransform: 'uppercase',
            marginBottom: 8,
          }}>
            Take a Moment
          </p>
          <p style={{
            fontFamily: fonts.sans, fontSize: 20, fontWeight: 300,
            color: '#fff',
          }}>
            sit in stillness..
          </p>
        </div>
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          padding: '0 24px 20px',
        }}>
          <div style={{
            height: 2, background: 'rgba(255,255,255,0.15)',
            borderRadius: 1, marginBottom: 14, overflow: 'hidden',
          }}>
            <div style={{
              height: '100%', width: `${Math.min((elapsed / 1800) * 100, 100)}%`,
              background: '#fff', transition: 'width 1s linear',
            }} />
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 32,
          }}>
            <button onClick={() => setElapsed(e => Math.max(0, e - 10))} style={{ cursor: 'pointer' }}>
              <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth={2} strokeLinecap="round">
                <path d="M1 4v6h6" /><path d="M3.51 15a9 9 0 102.13-9.36L1 10" />
              </svg>
            </button>
            <button
              onClick={() => setPlaying(!playing)}
              style={{
                width: 48, height: 48, borderRadius: 24,
                border: '1px solid rgba(255,255,255,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              {playing ? (
                <svg width={16} height={16} viewBox="0 0 24 24" fill="#fff">
                  <rect x="6" y="4" width="4" height="16" rx="1" />
                  <rect x="14" y="4" width="4" height="16" rx="1" />
                </svg>
              ) : (
                <svg width={16} height={16} viewBox="0 0 24 24" fill="#fff">
                  <polygon points="6 3 20 12 6 21" />
                </svg>
              )}
            </button>
            <button onClick={() => setElapsed(e => e + 10)} style={{ cursor: 'pointer' }}>
              <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth={2} strokeLinecap="round">
                <path d="M23 4v6h-6" /><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10" />
              </svg>
            </button>
            <span style={{
              position: 'absolute', right: 24,
              fontFamily: fonts.sans, fontSize: 12, color: 'rgba(255,255,255,0.4)',
            }}>
              {fmt(elapsed)}
            </span>
          </div>
        </div>
      </div>

      <div style={{ padding: '12px 24px 0' }}>
        <button style={{
          width: '100%', fontFamily: fonts.sans, fontSize: 13, fontWeight: 600,
          letterSpacing: 1, color: '#fff',
          background: 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: radius.pill, padding: '15px 0', cursor: 'pointer',
        }}>
          Record Stillness
        </button>
      </div>

      {/* ========== HARMONY ========== */}
      <div style={{ position: 'relative', height: 420, marginTop: 24, marginBottom: 4 }}>
        <img src="/harmony.jpg" alt="" style={{
          width: '100%', height: '100%', objectFit: 'cover',
        }} />
      </div>

      {/* ========== WEEKLY OVERVIEW — minimal stats ========== */}
      <div style={{ padding: '24px 20px 0' }}>
        <p style={{
          fontFamily: fonts.sans, fontSize: 10, fontWeight: 600,
          color: colors.text3, letterSpacing: 3, textTransform: 'uppercase',
          marginBottom: 14, paddingLeft: 4,
        }}>
          This Week
        </p>

        <div style={{
          background: colors.surface, borderRadius: 14, padding: '20px',
        }}>
          {/* Mini bar chart */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
            height: 80, marginBottom: 12, padding: '0 4px',
          }}>
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => {
              const heights = [60, 80, 45, 70, 90, 55, 30]
              const isToday = i === new Date().getDay() - 1
              return (
                <div key={i} style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                  flex: 1,
                }}>
                  <div style={{
                    width: 6, borderRadius: 3,
                    height: `${heights[i]}%`,
                    background: isToday ? '#fff' : 'rgba(255,255,255,0.15)',
                    transition: 'all 0.3s ease',
                  }} />
                  <span style={{
                    fontFamily: fonts.sans, fontSize: 10,
                    color: isToday ? '#fff' : colors.text3,
                    fontWeight: isToday ? 600 : 400,
                  }}>
                    {day}
                  </span>
                </div>
              )
            })}
          </div>

          <div style={{
            display: 'flex', justifyContent: 'space-between', paddingTop: 12,
            borderTop: '1px solid rgba(255,255,255,0.06)',
          }}>
            <div>
              <p style={{ fontFamily: fonts.sans, fontSize: 20, fontWeight: 300, color: colors.text }}>4.2</p>
              <p style={{ fontFamily: fonts.sans, fontSize: 10, color: colors.text3, marginTop: 2 }}>hrs movement</p>
            </div>
            <div>
              <p style={{ fontFamily: fonts.sans, fontSize: 20, fontWeight: 300, color: colors.text }}>98</p>
              <p style={{ fontFamily: fonts.sans, fontSize: 10, color: colors.text3, marginTop: 2 }}>min stillness</p>
            </div>
            <div>
              <p style={{ fontFamily: fonts.sans, fontSize: 20, fontWeight: 300, color: colors.text }}>6</p>
              <p style={{ fontFamily: fonts.sans, fontSize: 10, color: colors.text3, marginTop: 2 }}>journal entries</p>
            </div>
          </div>
        </div>
      </div>

      {/* ========== PALO SANTO — ritual ========== */}
      <div style={{ position: 'relative', height: 360, marginTop: 24, marginBottom: 4 }}>
        <img src="/palo-santo.jpg" alt="" style={{
          width: '100%', height: '100%', objectFit: 'cover',
        }} />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.15)' }} />
        <div style={{
          position: 'absolute', bottom: 32, left: 0, right: 0, textAlign: 'center',
        }}>
          <p style={{
            fontFamily: fonts.sans, fontSize: 10, fontWeight: 600,
            color: 'rgba(255,255,255,0.5)', letterSpacing: 3, textTransform: 'uppercase',
            marginBottom: 6,
          }}>
            Daily Ritual
          </p>
          <p style={{
            fontFamily: fonts.sans, fontSize: 16, fontWeight: 300,
            color: '#fff', letterSpacing: 0.5,
          }}>
            Gratitude. Intention. Affirmation.
          </p>
        </div>
      </div>

      {/* ========== MONSTERA ========== */}
      <div style={{ position: 'relative', height: 480, marginBottom: 4 }}>
        <img src="/monstera.jpg" alt="" style={{
          width: '100%', height: '100%', objectFit: 'cover',
        }} />
      </div>

      {/* ========== MIND BODY HEART ========== */}
      <div style={{ position: 'relative', height: 420, marginBottom: 4 }}>
        <img src="/mindbody.jpg" alt="" style={{
          width: '100%', height: '100%', objectFit: 'cover',
        }} />
      </div>

      {/* ========== I NEED CALM NOW ========== */}
      <div style={{ padding: '28px 24px' }}>
        <button style={{
          width: '100%', fontFamily: fonts.sans, fontSize: 12, fontWeight: 600,
          letterSpacing: 2, textTransform: 'uppercase',
          color: colors.bg, background: '#fff',
          borderRadius: radius.pill, padding: '18px 0', cursor: 'pointer',
        }}>
          I Need Calm Now
        </button>
      </div>

      {/* ========== INSIGHT ========== */}
      <div style={{ padding: '0 32px 32px', textAlign: 'center' }}>
        <p style={{
          fontFamily: fonts.sans, fontSize: 14, fontWeight: 300,
          color: colors.text2, lineHeight: 1.8, letterSpacing: 0.3,
        }}>
          "Day 21, the pathway forms. Day 66, it becomes automatic. Day 90, you are rewired."
        </p>
      </div>
    </div>
  )
}
