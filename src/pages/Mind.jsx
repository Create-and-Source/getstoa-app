import { useState, useEffect, useRef } from 'react'
import { colors, fonts, radius, shadows } from '../theme'

const SOUNDSCAPES = ['Rain', 'Ocean', 'Forest', 'Fire', 'Night']

const JOURNAL_ENTRIES = [
  { text: 'Woke up grateful. The sun came through my window and I just sat there for a moment.', hearts: 4, time: '2 hours ago' },
  { text: 'Finished a 30-minute meditation for the first time. My mind kept wandering but I stayed. That counts.', hearts: 7, time: 'Yesterday' },
  { text: 'I am letting go of who I think I should be and becoming who I am.', hearts: 12, time: '2 days ago' },
]

export default function Mind() {
  const [breathing, setBreathing] = useState(false)
  const [breathPhase, setBreathPhase] = useState('inhale')
  const [breathScale, setBreathScale] = useState(1)
  const intervalRef = useRef(null)

  useEffect(() => {
    if (!breathing) {
      setBreathScale(1)
      if (intervalRef.current) clearInterval(intervalRef.current)
      return
    }

    let phase = 0
    const cycle = () => {
      if (phase % 2 === 0) {
        setBreathPhase('inhale')
        setBreathScale(1.5)
      } else {
        setBreathPhase('exhale')
        setBreathScale(1)
      }
      phase++
    }
    cycle()
    intervalRef.current = setInterval(cycle, 4000)
    return () => clearInterval(intervalRef.current)
  }, [breathing])

  return (
    <div style={{
      height: '100%',
      overflowY: 'auto',
      paddingBottom: 140,
      background: colors.bg,
    }}>
      <div style={{ padding: '60px 24px 0' }}>
        <p style={{
          fontFamily: fonts.sans,
          fontSize: 13,
          fontWeight: 500,
          color: colors.text3,
          letterSpacing: 1.5,
          textTransform: 'uppercase',
          marginBottom: 4,
        }}>
          Your sanctuary
        </p>
        <h1 style={{
          fontFamily: fonts.serif,
          fontSize: 32,
          fontWeight: 400,
          color: colors.text,
          lineHeight: 1.2,
          marginBottom: 28,
        }}>
          Stillness
        </h1>
      </div>

      {/* Breathing Exercise */}
      <div style={{ padding: '0 24px 28px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div
          onClick={() => setBreathing(!breathing)}
          style={{
            width: 140,
            height: 140,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${colors.accentLight} 0%, transparent 70%)`,
            border: `1.5px solid ${colors.accent}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transform: `scale(${breathScale})`,
            transition: 'transform 4s ease-in-out',
          }}
        >
          <span style={{
            fontFamily: fonts.serif,
            fontSize: 14,
            fontStyle: 'italic',
            color: colors.text2,
          }}>
            {breathing ? breathPhase : 'begin'}
          </span>
        </div>
        <p style={{
          fontFamily: fonts.sans,
          fontSize: 12,
          color: colors.text3,
          marginTop: 14,
        }}>
          {breathing ? 'Tap to stop' : 'Tap to breathe'}
        </p>
      </div>

      {/* SOS Button */}
      <div style={{ padding: '0 24px 28px', display: 'flex', justifyContent: 'center' }}>
        <button style={{
          fontFamily: fonts.sans,
          fontSize: 14,
          fontWeight: 600,
          color: colors.accent,
          background: colors.accentLight,
          borderRadius: radius.pill,
          padding: '14px 32px',
          cursor: 'pointer',
          boxShadow: shadows.glow,
        }}>
          I need calm now
        </button>
      </div>

      {/* Soundscapes */}
      <div style={{ padding: '0 24px 28px' }}>
        <h2 style={{
          fontFamily: fonts.serif,
          fontSize: 20,
          fontWeight: 400,
          color: colors.text,
          marginBottom: 14,
        }}>
          Soundscapes
        </h2>
        <div style={{ display: 'flex', gap: 10 }}>
          {SOUNDSCAPES.map(s => (
            <button key={s} style={{
              fontFamily: fonts.sans,
              fontSize: 13,
              color: colors.text2,
              background: colors.surface,
              borderRadius: radius.pill,
              padding: '10px 18px',
              boxShadow: shadows.soft,
              cursor: 'pointer',
            }}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Journal Wall */}
      <div style={{ padding: '0 24px 28px' }}>
        <h2 style={{
          fontFamily: fonts.serif,
          fontSize: 20,
          fontWeight: 400,
          color: colors.text,
          marginBottom: 14,
        }}>
          Journal
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {JOURNAL_ENTRIES.map((entry, i) => (
            <div key={i} style={{
              background: colors.surface,
              borderRadius: radius.card,
              padding: 18,
              boxShadow: shadows.card,
            }}>
              <p style={{
                fontFamily: fonts.sans,
                fontSize: 14,
                color: colors.text,
                lineHeight: 1.6,
                marginBottom: 10,
              }}>
                {entry.text}
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{
                  fontFamily: fonts.sans,
                  fontSize: 12,
                  color: colors.text3,
                }}>
                  {entry.time}
                </span>
                <span style={{
                  fontFamily: fonts.sans,
                  fontSize: 12,
                  color: colors.accent,
                }}>
                  {entry.hearts} hearts
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Micro Lesson */}
      <div style={{ padding: '0 24px 28px' }}>
        <h2 style={{
          fontFamily: fonts.serif,
          fontSize: 20,
          fontWeight: 400,
          color: colors.text,
          marginBottom: 14,
        }}>
          Today's Insight
        </h2>
        <div style={{
          background: colors.surface,
          borderRadius: radius.card,
          padding: 22,
          boxShadow: shadows.card,
        }}>
          <p style={{
            fontFamily: fonts.serif,
            fontSize: 16,
            fontWeight: 500,
            color: colors.text,
            marginBottom: 8,
          }}>
            Why the groove matters more than the streak
          </p>
          <p style={{
            fontFamily: fonts.sans,
            fontSize: 14,
            color: colors.text2,
            lineHeight: 1.6,
          }}>
            When you repeat a behavior, your brain creates a neural pathway. Miss a day? The pathway is still there. You didn't lose anything. The groove is carved. Pick it back up.
          </p>
        </div>
      </div>
    </div>
  )
}
