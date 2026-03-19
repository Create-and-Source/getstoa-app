import { useState, useRef, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { colors, fonts, radius } from '../theme'

const VISION_ITEMS = [
  { type: 'image', src: '/harmony.jpg', text: '' },
  { type: 'affirmation', text: 'I am becoming the person I was always meant to be.' },
  { type: 'image', src: '/monstera.jpg', text: '' },
  { type: 'affirmation', text: 'She built a life so beautiful, it healed her.' },
  { type: 'image', src: '/palo-santo.jpg', text: '' },
  { type: 'affirmation', text: 'My peace is non-negotiable.' },
  { type: 'image', src: '/mindbody.jpg', text: '' },
  { type: 'affirmation', text: 'I attract what I am, not what I want.' },
  { type: 'image', src: '/routines.jpg', text: '' },
]

export default function Home() {
  const navigate = useNavigate()

  // Vision board carousel
  const [visionIdx, setVisionIdx] = useState(0)
  useEffect(() => {
    const interval = setInterval(() => {
      setVisionIdx(i => (i + 1) % VISION_ITEMS.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

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
      paddingBottom: 140,
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

      {/* ========== MY TEAM — coming soon ========== */}
      <div style={{ padding: '24px 20px 0' }}>
        <div style={{
          background: colors.surface, borderRadius: 16,
          padding: '28px 24px', textAlign: 'center',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: -30, right: -30,
            width: 120, height: 120, borderRadius: 60,
            background: 'rgba(255,255,255,0.02)',
          }} />
          <p style={{
            fontFamily: fonts.sans, fontSize: 10, fontWeight: 600,
            color: colors.text3, letterSpacing: 3, textTransform: 'uppercase',
            marginBottom: 10,
          }}>
            My Wellness Team
          </p>
          <p style={{
            fontFamily: fonts.sans, fontSize: 16, fontWeight: 300,
            color: colors.text2, lineHeight: 1.6, marginBottom: 16,
          }}>
            Your trainer. Your therapist.<br />Your meditation guide. One place.
          </p>
          <button style={{
            fontFamily: fonts.sans, fontSize: 11, fontWeight: 600,
            color: '#fff', background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: radius.pill, padding: '10px 22px', cursor: 'pointer',
            letterSpacing: 0.5,
          }}>
            Coming Soon
          </button>
        </div>
      </div>

      {/* ========== PLAYLISTS — horizontal scroll ========== */}
      <div style={{ padding: '24px 0 0' }}>
        <div style={{ padding: '0 24px', marginBottom: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <p style={{
            fontFamily: fonts.sans, fontSize: 10, fontWeight: 600,
            color: colors.text3, letterSpacing: 3, textTransform: 'uppercase',
          }}>
            Playlists
          </p>
        </div>
        <div style={{
          display: 'flex', gap: 12, overflowX: 'auto',
          paddingLeft: 24, paddingRight: 24, paddingBottom: 4,
        }}>
          {[
            { title: 'Morning Ritual', curator: 'Sarah M.', color: '#2A2520', tracks: 12 },
            { title: 'Deep Focus', curator: 'Amara J.', color: '#1E2A20', tracks: 18 },
            { title: 'Wind Down', curator: 'Nadia C.', color: '#201E2A', tracks: 9 },
            { title: 'Movement Energy', curator: 'Sarah M.', color: '#2A2020', tracks: 15 },
          ].map((pl, i) => (
            <div key={i} style={{
              minWidth: 150, borderRadius: 14, overflow: 'hidden',
              background: pl.color, cursor: 'pointer', flexShrink: 0,
            }}>
              <div style={{
                height: 100, background: `linear-gradient(135deg, ${pl.color} 0%, rgba(255,255,255,0.05) 100%)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth={1.5}>
                  <path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" />
                </svg>
              </div>
              <div style={{ padding: '12px 14px 14px' }}>
                <p style={{
                  fontFamily: fonts.sans, fontSize: 13, fontWeight: 600,
                  color: '#fff', marginBottom: 3,
                }}>
                  {pl.title}
                </p>
                <p style={{
                  fontFamily: fonts.sans, fontSize: 10, color: 'rgba(255,255,255,0.4)',
                }}>
                  {pl.curator} &middot; {pl.tracks} tracks
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========== WATCH — YouTube embeds horizontal scroll ========== */}
      <div style={{ padding: '24px 0 0' }}>
        <div style={{ padding: '0 24px', marginBottom: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <p style={{
            fontFamily: fonts.sans, fontSize: 10, fontWeight: 600,
            color: colors.text3, letterSpacing: 3, textTransform: 'uppercase',
          }}>
            Watch
          </p>
        </div>
        <div style={{
          display: 'flex', gap: 12, overflowX: 'auto',
          paddingLeft: 24, paddingRight: 24, paddingBottom: 4,
        }}>
          {[
            { title: 'Morning Breathwork', by: 'Amara J.', duration: '12 min' },
            { title: 'Guided Visualization', by: 'Nadia C.', duration: '20 min' },
            { title: 'Gratitude Practice', by: 'Sarah M.', duration: '8 min' },
            { title: 'Body Scan Meditation', by: 'Amara J.', duration: '15 min' },
          ].map((vid, i) => (
            <div key={i} style={{
              minWidth: 200, borderRadius: 14, overflow: 'hidden',
              background: colors.surface, cursor: 'pointer', flexShrink: 0,
            }}>
              <div style={{
                height: 112, background: `linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                position: 'relative',
              }}>
                {/* Play button */}
                <div style={{
                  width: 40, height: 40, borderRadius: 20,
                  background: 'rgba(255,255,255,0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <svg width={14} height={14} viewBox="0 0 24 24" fill="#fff">
                    <polygon points="6 3 20 12 6 21" />
                  </svg>
                </div>
                <span style={{
                  position: 'absolute', bottom: 8, right: 10,
                  fontFamily: fonts.sans, fontSize: 10, color: 'rgba(255,255,255,0.5)',
                }}>
                  {vid.duration}
                </span>
              </div>
              <div style={{ padding: '12px 14px 14px' }}>
                <p style={{
                  fontFamily: fonts.sans, fontSize: 13, fontWeight: 600,
                  color: colors.text, marginBottom: 3,
                }}>
                  {vid.title}
                </p>
                <p style={{
                  fontFamily: fonts.sans, fontSize: 10, color: colors.text3,
                }}>
                  {vid.by}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========== VISION BOARD — auto-rotating carousel ========== */}
      <div style={{ padding: '24px 0 0' }}>
        <div style={{ padding: '0 24px', marginBottom: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <p style={{
            fontFamily: fonts.sans, fontSize: 10, fontWeight: 600,
            color: colors.text3, letterSpacing: 3, textTransform: 'uppercase',
          }}>
            Vision Board
          </p>
          <span onClick={() => navigate('/vision')} style={{
            fontFamily: fonts.sans, fontSize: 11, fontWeight: 500,
            color: colors.text3, cursor: 'pointer',
          }}>
            Open
          </span>
        </div>

        {/* Carousel */}
        <div style={{
          position: 'relative', height: 340, margin: '0 20px',
          borderRadius: 16, overflow: 'hidden',
        }}>
          {VISION_ITEMS.map((item, i) => (
            <div key={i} style={{
              position: 'absolute', inset: 0,
              opacity: i === visionIdx ? 1 : 0,
              transition: 'opacity 1.2s ease-in-out',
            }}>
              {item.type === 'image' ? (
                <>
                  <img src={item.src} alt="" style={{
                    width: '100%', height: '100%', objectFit: 'cover',
                  }} />
                </>
              ) : (
                <div style={{
                  width: '100%', height: '100%',
                  background: colors.surface,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  padding: '40px 32px',
                }}>
                  <p style={{
                    fontFamily: fonts.sans, fontSize: 18, fontWeight: 300,
                    color: colors.text, lineHeight: 1.7, textAlign: 'center',
                    letterSpacing: 0.3,
                  }}>
                    "{item.text}"
                  </p>
                </div>
              )}
            </div>
          ))}

          {/* Dots */}
          <div style={{
            position: 'absolute', bottom: 14, left: 0, right: 0,
            display: 'flex', justifyContent: 'center', gap: 6, zIndex: 2,
          }}>
            {VISION_ITEMS.map((_, i) => (
              <div key={i} onClick={() => setVisionIdx(i)} style={{
                width: i === visionIdx ? 16 : 5, height: 5, borderRadius: 3,
                background: i === visionIdx ? '#fff' : 'rgba(255,255,255,0.3)',
                transition: 'all 0.4s ease', cursor: 'pointer',
              }} />
            ))}
          </div>
        </div>

        {/* Upload your own */}
        <div style={{ padding: '12px 20px 0', display: 'flex', justifyContent: 'center' }}>
          <button style={{
            fontFamily: fonts.sans, fontSize: 11, fontWeight: 500,
            color: colors.text3, background: 'none', cursor: 'pointer',
            padding: '8px 16px',
            border: `1px solid ${colors.border}`, borderRadius: radius.pill,
          }}>
            + Add Photo or Affirmation
          </button>
        </div>
      </div>

      {/* ========== MOVEMENT — horizontal scroll (replaces Train tab) ========== */}
      <div style={{ padding: '24px 0 0' }}>
        <div style={{ padding: '0 24px', marginBottom: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <p style={{
            fontFamily: fonts.sans, fontSize: 10, fontWeight: 600,
            color: colors.text3, letterSpacing: 3, textTransform: 'uppercase',
          }}>
            Movement
          </p>
          <span style={{
            fontFamily: fonts.sans, fontSize: 11, fontWeight: 500,
            color: colors.text3, cursor: 'pointer',
          }}>
            See All
          </span>
        </div>
        <div style={{
          display: 'flex', gap: 12, overflowX: 'auto',
          paddingLeft: 24, paddingRight: 24, paddingBottom: 4,
        }}>
          {[
            { title: 'Morning Flow', type: 'Yoga', duration: '25 min', instructor: 'Sarah M.', color: '#1E2A20' },
            { title: 'Sculpt & Tone', type: 'Pilates', duration: '30 min', instructor: 'Nadia C.', color: '#2A2520' },
            { title: 'Walk + Breathe', type: 'Walking', duration: '20 min', instructor: 'Amara J.', color: '#201E2A' },
            { title: 'Full Body Strength', type: 'Strength', duration: '35 min', instructor: 'Sarah M.', color: '#2A2020' },
            { title: 'Stretch & Release', type: 'Recovery', duration: '15 min', instructor: 'Nadia C.', color: '#1E1E2A' },
          ].map((workout, i) => (
            <div key={i} style={{
              minWidth: 170, borderRadius: 14, overflow: 'hidden',
              background: workout.color, cursor: 'pointer', flexShrink: 0,
            }}>
              <div style={{
                height: 100,
                background: `linear-gradient(135deg, ${workout.color} 0%, rgba(255,255,255,0.04) 100%)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                position: 'relative',
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 18,
                  background: 'rgba(255,255,255,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <svg width={14} height={14} viewBox="0 0 24 24" fill="#fff">
                    <polygon points="6 3 20 12 6 21" />
                  </svg>
                </div>
                <span style={{
                  position: 'absolute', top: 10, right: 12,
                  fontFamily: fonts.sans, fontSize: 9, fontWeight: 600,
                  color: 'rgba(255,255,255,0.4)', letterSpacing: 1, textTransform: 'uppercase',
                }}>
                  {workout.type}
                </span>
              </div>
              <div style={{ padding: '12px 14px 14px' }}>
                <p style={{
                  fontFamily: fonts.sans, fontSize: 13, fontWeight: 600,
                  color: '#fff', marginBottom: 3,
                }}>
                  {workout.title}
                </p>
                <p style={{
                  fontFamily: fonts.sans, fontSize: 10, color: 'rgba(255,255,255,0.4)',
                }}>
                  {workout.instructor} &middot; {workout.duration}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========== GROUPS — horizontal scroll ========== */}
      <div style={{ padding: '24px 0 0' }}>
        <div style={{ padding: '0 24px', marginBottom: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <p style={{
            fontFamily: fonts.sans, fontSize: 10, fontWeight: 600,
            color: colors.text3, letterSpacing: 3, textTransform: 'uppercase',
          }}>
            Groups
          </p>
          <span style={{
            fontFamily: fonts.sans, fontSize: 11, fontWeight: 500,
            color: colors.text3, cursor: 'pointer',
          }}>
            See All
          </span>
        </div>
        <div style={{
          display: 'flex', gap: 12, overflowX: 'auto',
          paddingLeft: 24, paddingRight: 24, paddingBottom: 4,
        }}>
          {[
            { name: 'Morning Ritual Circle', members: 248 },
            { name: 'Manifestation Lab', members: 412 },
            { name: 'Pilates Sisters', members: 186 },
            { name: 'Book of the Month', members: 324 },
          ].map((group, i) => (
            <div key={i} style={{
              minWidth: 150, height: 90, borderRadius: 14,
              background: colors.surface, padding: '14px 16px',
              display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
              cursor: 'pointer', flexShrink: 0,
            }}>
              <p style={{ fontFamily: fonts.sans, fontSize: 13, fontWeight: 600, color: '#fff', lineHeight: 1.3, marginBottom: 4 }}>
                {group.name}
              </p>
              <p style={{ fontFamily: fonts.sans, fontSize: 10, color: colors.text3 }}>
                {group.members} members
              </p>
            </div>
          ))}
          <div style={{
            minWidth: 100, height: 90, borderRadius: 14,
            border: `1px dashed ${colors.border}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', flexShrink: 0,
          }}>
            <div style={{ textAlign: 'center' }}>
              <span style={{ fontFamily: fonts.sans, fontSize: 20, color: colors.text3 }}>+</span>
              <span style={{ fontFamily: fonts.sans, fontSize: 10, color: colors.text3, display: 'block' }}>Create</span>
            </div>
          </div>
        </div>
      </div>

      {/* ========== CONNECTING MIND BODY HEART — mood image ========== */}
      <div style={{ position: 'relative', height: 320, marginTop: 24, marginBottom: 4 }}>
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
