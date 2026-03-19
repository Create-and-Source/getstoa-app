import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { colors, fonts, radius } from '../theme'

const STORIES = {
  'lavender-field': {
    title: 'The Lavender Field',
    narrator: 'Sarah M.',
    duration: '25 min',
    durationSec: 1500,
    description: 'Wander through endless rows of lavender under a warm Proven\u00e7al sky. Let the fragrance carry you into deep, restful sleep.',
  },
  'rain-on-roof': {
    title: 'Rain on the Roof',
    narrator: 'Amara J.',
    duration: '30 min',
    durationSec: 1800,
    description: 'Curl up in a cozy cabin while gentle rain patters on the tin roof. The rhythmic sound washes away the day.',
  },
  'mountain-cabin': {
    title: 'Mountain Cabin',
    narrator: 'Nadia C.',
    duration: '22 min',
    durationSec: 1320,
    description: 'A crackling fire, snow falling outside the window, and absolute stillness. Let the mountain air settle your mind.',
  },
  'starlit-garden': {
    title: 'Starlit Garden',
    narrator: 'Sarah M.',
    duration: '28 min',
    durationSec: 1680,
    description: 'Walk barefoot through a moonlit garden filled with night-blooming flowers. Each step brings you closer to stillness.',
  },
}

const SLEEP_TIMER_OPTIONS = [
  { label: 'Off', value: 0 },
  { label: '15 min', value: 900 },
  { label: '30 min', value: 1800 },
  { label: '45 min', value: 2700 },
]

const BG_OPTIONS = ['None', 'Rain']

function formatTime(sec) {
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

// Simple crescent moon SVG
function MoonIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M36 26C36 33.732 29.732 40 22 40C16.078 40 11.018 36.394 8.874 31.286C10.55 31.752 12.318 32 14.14 32C23 32 30.14 24.86 30.14 16C30.14 13.318 29.504 10.786 28.38 8.538C33.016 10.89 36 15.996 36 22V26Z"
        stroke="rgba(255,255,255,0.15)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* tiny stars */}
      <circle cx="38" cy="10" r="1" fill="rgba(255,255,255,0.12)" />
      <circle cx="42" cy="16" r="0.6" fill="rgba(255,255,255,0.08)" />
      <circle cx="34" cy="6" r="0.6" fill="rgba(255,255,255,0.08)" />
    </svg>
  )
}

function RewindIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M10 4V1L6 5l4 4V6a5 5 0 11-4.33 7.5" stroke={colors.text2} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <text x="9" y="13" textAnchor="middle" fill={colors.text2} fontSize="5.5" fontFamily={fonts.sans} fontWeight="500">15</text>
    </svg>
  )
}

function ForwardIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M10 4V1l4 4-4 4V6a5 5 0 014.33 7.5" stroke={colors.text2} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <text x="11" y="13" textAnchor="middle" fill={colors.text2} fontSize="5.5" fontFamily={fonts.sans} fontWeight="500">15</text>
    </svg>
  )
}

function PlayIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M8 5.14v13.72a1 1 0 001.5.86l11.04-6.86a1 1 0 000-1.72L9.5 4.28a1 1 0 00-1.5.86z" fill={colors.bg} />
    </svg>
  )
}

function PauseIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect x="7" y="5" width="3.5" height="14" rx="1" fill={colors.bg} />
      <rect x="13.5" y="5" width="3.5" height="14" rx="1" fill={colors.bg} />
    </svg>
  )
}

function BackArrow() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M12.5 15L7.5 10L12.5 5" stroke={colors.text3} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function SleepStory() {
  const navigate = useNavigate()
  const { slug } = useParams()
  const story = STORIES[slug]

  const [playing, setPlaying] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [sleepTimer, setSleepTimer] = useState(0) // 0 = off
  const [sleepRemaining, setSleepRemaining] = useState(0)
  const [bgSound, setBgSound] = useState('None')
  const intervalRef = useRef(null)

  // Main playback timer
  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(() => {
        setElapsed(prev => {
          if (prev + 1 >= (story?.durationSec || 9999)) {
            setPlaying(false)
            return story?.durationSec || prev
          }
          return prev + 1
        })
      }, 1000)
    } else {
      clearInterval(intervalRef.current)
    }
    return () => clearInterval(intervalRef.current)
  }, [playing, story])

  // Sleep timer countdown
  useEffect(() => {
    if (!playing || sleepRemaining <= 0) return
    const id = setInterval(() => {
      setSleepRemaining(prev => {
        if (prev <= 1) {
          setPlaying(false)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(id)
  }, [playing, sleepRemaining])

  function handleSleepTimer(val) {
    setSleepTimer(val)
    setSleepRemaining(val)
  }

  function handleRewind() {
    setElapsed(prev => Math.max(0, prev - 15))
  }

  function handleForward() {
    setElapsed(prev => Math.min(story?.durationSec || 9999, prev + 15))
  }

  function togglePlay() {
    setPlaying(p => !p)
  }

  if (!story) {
    return (
      <div style={{ ...styles.page, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: colors.text2, fontFamily: fonts.sans }}>Story not found.</p>
      </div>
    )
  }

  const remaining = story.durationSec - elapsed
  const progress = elapsed / story.durationSec

  return (
    <div style={styles.page}>
      {/* Back */}
      <button onClick={() => navigate(-1)} style={styles.backBtn} aria-label="Go back">
        <BackArrow />
      </button>

      {/* Atmospheric hero */}
      <div style={styles.hero}>
        <div style={styles.moonWrap}>
          <MoonIcon />
        </div>
        <h1 style={styles.title}>{story.title}</h1>
        <p style={styles.narrator}>{story.narrator}</p>
      </div>

      {/* Description */}
      <p style={styles.description}>{story.description}</p>

      {/* Progress */}
      <div style={styles.progressSection}>
        <div style={styles.progressTrack}>
          <div style={{ ...styles.progressFill, width: `${progress * 100}%` }} />
        </div>
        <div style={styles.timeRow}>
          <span style={styles.timeLabel}>{formatTime(elapsed)}</span>
          <span style={styles.timeLabel}>-{formatTime(remaining)}</span>
        </div>
      </div>

      {/* Controls */}
      <div style={styles.controls}>
        <button onClick={handleRewind} style={styles.skipBtn} aria-label="Rewind 15 seconds">
          <RewindIcon />
        </button>
        <button onClick={togglePlay} style={styles.playBtn} aria-label={playing ? 'Pause' : 'Play'}>
          {playing ? <PauseIcon /> : <PlayIcon />}
        </button>
        <button onClick={handleForward} style={styles.skipBtn} aria-label="Forward 15 seconds">
          <ForwardIcon />
        </button>
      </div>

      {/* Sleep timer */}
      <div style={styles.section}>
        <p style={styles.sectionLabel}>Sleep Timer</p>
        <div style={styles.pillRow}>
          {SLEEP_TIMER_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => handleSleepTimer(opt.value)}
              style={{
                ...styles.pill,
                ...(sleepTimer === opt.value ? styles.pillActive : {}),
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
        {sleepRemaining > 0 && (
          <p style={styles.sleepCountdown}>Pausing in {formatTime(sleepRemaining)}</p>
        )}
      </div>

      {/* Background sound */}
      <div style={styles.section}>
        <p style={styles.sectionLabel}>Background</p>
        <div style={styles.pillRow}>
          {BG_OPTIONS.map(opt => (
            <button
              key={opt}
              onClick={() => setBgSound(opt)}
              style={{
                ...styles.pill,
                ...(bgSound === opt ? styles.pillActive : {}),
              }}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
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
    paddingBottom: 64,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative',
  },
  backBtn: {
    position: 'absolute',
    top: 20,
    left: 20,
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 8,
    zIndex: 10,
  },
  hero: {
    width: '100%',
    paddingTop: 80,
    paddingBottom: 48,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    background: 'linear-gradient(180deg, #0D0D1A 0%, #0D0D0D 100%)',
  },
  moonWrap: {
    marginBottom: 32,
    opacity: 0.9,
  },
  title: {
    fontSize: 24,
    fontWeight: 300,
    letterSpacing: '0.02em',
    margin: 0,
    textAlign: 'center',
    color: colors.text,
  },
  narrator: {
    fontSize: 13,
    color: colors.text3,
    marginTop: 8,
    fontWeight: 400,
    letterSpacing: '0.03em',
  },
  description: {
    fontSize: 14,
    lineHeight: 1.7,
    color: colors.text2,
    fontStyle: 'italic',
    textAlign: 'center',
    maxWidth: 340,
    padding: '0 32px',
    marginTop: 8,
    marginBottom: 40,
    fontWeight: 300,
  },
  progressSection: {
    width: '100%',
    maxWidth: 320,
    padding: '0 32px',
    marginBottom: 32,
  },
  progressTrack: {
    width: '100%',
    height: 2,
    background: colors.border,
    borderRadius: 1,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    background: 'rgba(255,255,255,0.35)',
    borderRadius: 1,
    transition: 'width 0.3s ease',
  },
  timeRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  timeLabel: {
    fontSize: 11,
    fontFamily: fonts.mono,
    color: colors.text3,
    fontWeight: 400,
    letterSpacing: '0.04em',
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    gap: 32,
    marginBottom: 48,
  },
  skipBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playBtn: {
    width: 56,
    height: 56,
    borderRadius: '50%',
    background: colors.text,
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'opacity 0.2s ease',
  },
  section: {
    width: '100%',
    maxWidth: 320,
    padding: '0 32px',
    marginBottom: 28,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: 500,
    color: colors.text3,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    marginBottom: 12,
  },
  pillRow: {
    display: 'flex',
    gap: 8,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  pill: {
    padding: '6px 16px',
    borderRadius: radius.pill,
    border: `1px solid ${colors.border}`,
    background: 'transparent',
    color: colors.text3,
    fontSize: 12,
    fontFamily: fonts.sans,
    fontWeight: 400,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    letterSpacing: '0.02em',
  },
  pillActive: {
    background: 'rgba(255,255,255,0.08)',
    color: colors.text2,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  sleepCountdown: {
    fontSize: 11,
    color: colors.text3,
    fontFamily: fonts.mono,
    marginTop: 10,
    fontWeight: 400,
  },
}
