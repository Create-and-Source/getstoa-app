import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { colors, fonts, radius } from '../theme'

const categories = [
  { id: 'stillness', label: 'Stillness', description: 'Sit with yourself. No prompts, no guidance — just presence.' },
  { id: 'breathwork', label: 'Breathwork', description: 'Follow the rhythm. 4 seconds in, 4 seconds out.' },
  { id: 'bodyscan', label: 'Body Scan', description: 'Move your attention slowly from head to toe. Notice what arises.' },
  { id: 'gratitude', label: 'Gratitude', description: 'Bring to mind three things you are grateful for right now.' },
  { id: 'visualization', label: 'Visualization', description: 'Picture the version of yourself you are becoming.' },
  { id: 'sleep', label: 'Sleep', description: 'Release the day. Let your body soften into rest.' },
]

const durations = [5, 10, 15, 20, 30]
const ambientOptions = ['Rain', 'Ocean', 'Silence']

export default function Stillness() {
  const navigate = useNavigate()
  const [category, setCategory] = useState('stillness')
  const [duration, setDuration] = useState(10)
  const [ambient, setAmbient] = useState('Silence')
  const [elapsed, setElapsed] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const intervalRef = useRef(null)
  const breathRef = useRef(0)
  const [breathPhase, setBreathPhase] = useState('ready')

  const totalSeconds = duration * 60
  const progress = totalSeconds > 0 ? elapsed / totalSeconds : 0

  // Timer logic
  useEffect(() => {
    if (isRunning && !isComplete) {
      intervalRef.current = setInterval(() => {
        setElapsed(prev => {
          const next = prev + 1
          if (next >= totalSeconds) {
            clearInterval(intervalRef.current)
            setIsRunning(false)
            setIsComplete(true)
            setBreathPhase('ready')
            return totalSeconds
          }
          return next
        })
      }, 1000)
    } else {
      clearInterval(intervalRef.current)
    }
    return () => clearInterval(intervalRef.current)
  }, [isRunning, isComplete, totalSeconds])

  // Breathwork phase tracking
  useEffect(() => {
    if (!isRunning || category !== 'breathwork') {
      if (!isRunning) setBreathPhase('ready')
      return
    }
    const cycleLength = 8000 // 4s inhale + 4s exhale
    let startTime = Date.now()
    const tick = () => {
      const delta = (Date.now() - startTime) % cycleLength
      if (delta < 4000) {
        setBreathPhase('inhale')
      } else {
        setBreathPhase('exhale')
      }
      breathRef.current = requestAnimationFrame(tick)
    }
    breathRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(breathRef.current)
  }, [isRunning, category])

  const formatTime = (s) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
  }

  const handlePlayPause = () => {
    if (isComplete) return
    setIsRunning(prev => !prev)
    if (!isRunning && breathPhase === 'ready' && category === 'breathwork') {
      setBreathPhase('inhale')
    }
  }

  const handleReset = () => {
    clearInterval(intervalRef.current)
    setElapsed(0)
    setIsRunning(false)
    setIsComplete(false)
    setBreathPhase('ready')
  }

  const handleSkip = () => {
    clearInterval(intervalRef.current)
    setElapsed(totalSeconds)
    setIsRunning(false)
    setIsComplete(true)
    setBreathPhase('ready')
  }

  const handleNewSession = () => {
    handleReset()
  }

  const currentCategory = categories.find(c => c.id === category)
  const isBreathwork = category === 'breathwork'
  const circleScale = isBreathwork && isRunning
    ? (breathPhase === 'inhale' ? 1.08 : 0.95)
    : 1

  return (
    <div style={styles.page}>
      {/* Back button */}
      <button onClick={() => navigate(-1)} style={styles.back}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={colors.text2} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Category selector */}
      <div style={styles.categoryScroll}>
        <div style={styles.categoryRow}>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => { setCategory(cat.id); if (!isRunning) setBreathPhase('ready') }}
              style={{
                ...styles.categoryPill,
                background: category === cat.id ? 'rgba(255,255,255,0.12)' : 'transparent',
                color: category === cat.id ? colors.text : colors.text3,
                borderColor: category === cat.id ? 'rgba(255,255,255,0.2)' : colors.border,
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Description */}
      <p style={styles.description}>{currentCategory?.description}</p>

      {/* Central timer area */}
      <div style={styles.centerArea}>
        {!isComplete ? (
          <>
            <div
              style={{
                ...styles.circle,
                transform: `scale(${circleScale})`,
                transition: isBreathwork && isRunning ? 'transform 4s ease-in-out' : 'transform 0.3s ease',
              }}
            >
              <span style={styles.timeDisplay}>{formatTime(elapsed)}</span>
            </div>
            <p style={styles.phaseText}>
              {isRunning && isBreathwork ? breathPhase : (!isRunning && elapsed === 0 ? 'ready' : isRunning ? '' : 'paused')}
            </p>
          </>
        ) : (
          <>
            <div style={{ ...styles.circle, borderColor: 'rgba(255,255,255,0.25)' }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke={colors.text} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <p style={styles.completeText}>Session complete</p>
            <p style={styles.completeTime}>{formatTime(elapsed)}</p>
          </>
        )}

        {/* Progress bar */}
        <div style={styles.progressBar}>
          <div style={{ ...styles.progressFill, width: `${progress * 100}%` }} />
        </div>
      </div>

      {/* Session complete actions */}
      {isComplete ? (
        <div style={styles.completeActions}>
          <button style={styles.saveButton}>Save Session</button>
          <button onClick={handleNewSession} style={styles.newSessionButton}>New Session</button>
        </div>
      ) : (
        <>
          {/* Duration selector */}
          <div style={styles.durationRow}>
            {durations.map(d => (
              <button
                key={d}
                onClick={() => { if (!isRunning) { setDuration(d); setElapsed(0); setIsComplete(false) } }}
                style={{
                  ...styles.durationPill,
                  background: duration === d ? 'rgba(255,255,255,0.12)' : 'transparent',
                  color: duration === d ? colors.text : colors.text3,
                  borderColor: duration === d ? 'rgba(255,255,255,0.2)' : colors.border,
                }}
              >
                {d}m
              </button>
            ))}
          </div>

          {/* Controls */}
          <div style={styles.controls}>
            <button onClick={handleReset} style={styles.smallControl}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={colors.text2} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 4v6h6" />
                <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
              </svg>
            </button>

            <button onClick={handlePlayPause} style={styles.playButton}>
              {isRunning ? (
                <svg width="22" height="22" viewBox="0 0 24 24" fill={colors.text}>
                  <rect x="6" y="4" width="4" height="16" rx="1" />
                  <rect x="14" y="4" width="4" height="16" rx="1" />
                </svg>
              ) : (
                <svg width="22" height="22" viewBox="0 0 24 24" fill={colors.text}>
                  <polygon points="6,3 20,12 6,21" />
                </svg>
              )}
            </button>

            <button onClick={handleSkip} style={styles.smallControl}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={colors.text2} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="5,4 15,12 5,20" fill="none" />
                <line x1="19" y1="5" x2="19" y2="19" />
              </svg>
            </button>
          </div>

          {/* Ambient sound toggle */}
          <div style={styles.ambientRow}>
            {ambientOptions.map(opt => (
              <button
                key={opt}
                onClick={() => setAmbient(opt)}
                style={{
                  ...styles.ambientPill,
                  background: ambient === opt ? 'rgba(255,255,255,0.08)' : 'transparent',
                  color: ambient === opt ? colors.text2 : colors.text3,
                  borderColor: ambient === opt ? 'rgba(255,255,255,0.15)' : 'transparent',
                }}
              >
                {opt}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

const styles = {
  page: {
    height: '100%',
    overflowY: 'auto',
    background: colors.bg,
    fontFamily: fonts.sans,
    color: colors.text,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '0 24px 48px',
    position: 'relative',
    overflow: 'hidden',
  },
  back: {
    position: 'absolute',
    top: 20,
    left: 20,
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 8,
    zIndex: 10,
  },
  categoryScroll: {
    width: '100%',
    overflowX: 'auto',
    marginTop: 60,
    WebkitOverflowScrolling: 'touch',
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
  },
  categoryRow: {
    display: 'flex',
    gap: 8,
    paddingBottom: 4,
    justifyContent: 'center',
    flexWrap: 'nowrap',
    minWidth: 'max-content',
    margin: '0 auto',
  },
  categoryPill: {
    padding: '8px 18px',
    borderRadius: radius.pill,
    border: '1px solid',
    fontSize: 13,
    fontFamily: fonts.sans,
    fontWeight: 500,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    transition: 'all 0.2s ease',
    letterSpacing: '0.02em',
  },
  description: {
    color: colors.text2,
    fontSize: 14,
    lineHeight: 1.6,
    textAlign: 'center',
    maxWidth: 320,
    marginTop: 20,
    marginBottom: 0,
    minHeight: 44,
  },
  centerArea: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 300,
    width: '100%',
  },
  circle: {
    width: 180,
    height: 180,
    borderRadius: '50%',
    border: '1px solid rgba(255,255,255,0.15)',
    background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.04) 0%, transparent 70%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  timeDisplay: {
    fontSize: 36,
    fontWeight: 300,
    fontFamily: fonts.sans,
    letterSpacing: '0.08em',
    color: colors.text,
  },
  phaseText: {
    marginTop: 20,
    fontSize: 13,
    fontWeight: 400,
    color: colors.text3,
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    minHeight: 20,
  },
  completeText: {
    marginTop: 24,
    fontSize: 16,
    fontWeight: 400,
    color: colors.text,
    letterSpacing: '0.04em',
  },
  completeTime: {
    marginTop: 6,
    fontSize: 13,
    color: colors.text2,
  },
  progressBar: {
    width: 180,
    height: 2,
    background: 'rgba(255,255,255,0.06)',
    borderRadius: 1,
    marginTop: 28,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    background: 'rgba(255,255,255,0.4)',
    borderRadius: 1,
    transition: 'width 1s linear',
  },
  durationRow: {
    display: 'flex',
    gap: 8,
    marginTop: 8,
    marginBottom: 28,
  },
  durationPill: {
    padding: '7px 16px',
    borderRadius: radius.pill,
    border: '1px solid',
    fontSize: 13,
    fontFamily: fonts.sans,
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    gap: 32,
    marginBottom: 32,
  },
  smallControl: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButton: {
    width: 56,
    height: 56,
    borderRadius: '50%',
    border: `1px solid rgba(255,255,255,0.2)`,
    background: 'transparent',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
  },
  ambientRow: {
    display: 'flex',
    gap: 8,
    marginTop: 4,
  },
  ambientPill: {
    padding: '6px 14px',
    borderRadius: radius.pill,
    border: '1px solid transparent',
    fontSize: 12,
    fontFamily: fonts.sans,
    fontWeight: 400,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  completeActions: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 16,
    marginTop: 8,
  },
  saveButton: {
    padding: '12px 32px',
    borderRadius: radius.pill,
    border: 'none',
    background: colors.text,
    color: colors.bg,
    fontSize: 14,
    fontFamily: fonts.sans,
    fontWeight: 500,
    cursor: 'pointer',
    letterSpacing: '0.02em',
  },
  newSessionButton: {
    background: 'none',
    border: 'none',
    color: colors.text2,
    fontSize: 13,
    fontFamily: fonts.sans,
    cursor: 'pointer',
    padding: 8,
  },
}
