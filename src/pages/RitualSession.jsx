import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { colors, fonts, radius } from '../theme'

const ALL_RITUALS = {
  'gratitude-journal': { title: 'Gratitude Journal', desc: 'Write 3 things you\'re grateful for. Let each one land before moving to the next.', duration: 5, prompt: 'What are you grateful for right now?', type: 'write' },
  'morning-breathwork': { title: 'Morning Breathwork', desc: 'Box breathing: inhale 4 counts, hold 4, exhale 4, hold 4. Repeat until the timer ends.', duration: 10, prompt: 'Close your eyes. Breathe in... 2... 3... 4...', type: 'breathe' },
  'intention-setting': { title: 'Intention Setting', desc: 'Choose one word or phrase that will guide your day. Hold it in your mind.', duration: 3, prompt: 'What is your intention for today?', type: 'write' },
  'morning-movement': { title: 'Morning Movement', desc: 'Gentle stretching or yoga. Move slowly. Listen to your body.', duration: 15, prompt: 'Begin with a deep breath, then move.', type: 'move' },
  'hydration-ritual': { title: 'Hydration Ritual', desc: 'Warm lemon water. Sip slowly. Feel the warmth move through you.', duration: 5, prompt: 'Take your first mindful sip.', type: 'pause' },
  'morning-pages': { title: 'Morning Pages', desc: 'Stream of consciousness. Don\'t think, just write. No editing, no judgment.', duration: 20, prompt: 'Let your thoughts flow freely...', type: 'write' },
  'mindful-walk': { title: 'Mindful Walk', desc: 'Step outside. Leave your phone. Feel the ground beneath you. Notice everything.', duration: 15, prompt: 'Step outside and begin walking slowly.', type: 'move' },
  'body-checkin': { title: 'Body Check-In', desc: 'Scan from your head to your toes. Where are you holding tension? Breathe into it.', duration: 5, prompt: 'Start at the top of your head...', type: 'breathe' },
  'gratitude-pause': { title: 'Gratitude Pause', desc: 'Pause everything. Name 3 good things about today so far. Say them out loud if you can.', duration: 3, prompt: 'What has been good about today?', type: 'pause' },
  'nourishment-break': { title: 'Nourishment Break', desc: 'Eat slowly. Notice textures, flavors, temperature. This is a practice.', duration: 15, prompt: 'Take your first mindful bite.', type: 'pause' },
  'stillness-reset': { title: 'Stillness Reset', desc: 'Close your eyes. Let your breath find its own rhythm. Just be.', duration: 10, prompt: 'Close your eyes now.', type: 'breathe' },
  'evening-reflection': { title: 'Evening Reflection', desc: 'What went well today? What did you learn? What will you release?', duration: 10, prompt: 'Reflect on your day...', type: 'write' },
  'digital-sunset': { title: 'Digital Sunset', desc: 'All screens off. Dim the lights. Light a candle if you have one. Transition into rest.', duration: 5, prompt: 'Put your screens away after this.', type: 'pause' },
  'body-scan': { title: 'Body Scan', desc: 'Lie down. Starting from your feet, slowly release tension all the way up to your head.', duration: 15, prompt: 'Lie down and close your eyes.', type: 'breathe' },
  'gratitude-close': { title: 'Gratitude Close', desc: '3 things from today you\'re grateful for. Let the feeling of gratitude fill you completely.', duration: 5, prompt: 'What are you grateful for from today?', type: 'write' },
  'sleep-story': { title: 'Sleep Story', desc: 'Get comfortable. Close your eyes. Let your mind drift with a calming narrative.', duration: 25, prompt: 'Get comfortable and close your eyes.', type: 'pause' },
  'tomorrows-intention': { title: 'Tomorrow\'s Intention', desc: 'What\'s one thing you want to focus on tomorrow? Just one.', duration: 3, prompt: 'What will tomorrow be about?', type: 'write' },
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

export default function RitualSession() {
  const navigate = useNavigate()
  const { slug } = useParams()
  const ritual = ALL_RITUALS[slug]

  const [phase, setPhase] = useState('ready') // ready, active, done
  const [elapsed, setElapsed] = useState(0)
  const [text, setText] = useState('')
  const intervalRef = useRef(null)

  const totalSeconds = ritual ? ritual.duration * 60 : 0

  useEffect(() => {
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [])

  function start() {
    setPhase('active')
    setElapsed(0)
    intervalRef.current = setInterval(() => {
      setElapsed(prev => {
        if (prev + 1 >= totalSeconds) {
          clearInterval(intervalRef.current)
          return totalSeconds
        }
        return prev + 1
      })
    }, 1000)
  }

  function finish() {
    if (intervalRef.current) clearInterval(intervalRef.current)
    setPhase('done')

    // Save completion to localStorage
    try {
      const today = new Date().toISOString().split('T')[0]
      const key = 'stoa-ritual-completions'
      const stored = localStorage.getItem(key)
      const completions = stored ? JSON.parse(stored) : {}
      if (!completions[today]) completions[today] = []
      if (!completions[today].includes(slug)) completions[today].push(slug)
      localStorage.setItem(key, JSON.stringify(completions))
    } catch {}
  }

  if (!ritual) {
    return (
      <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: colors.bg }}>
        <p style={{ fontFamily: fonts.sans, color: colors.text3 }}>Ritual not found</p>
      </div>
    )
  }

  const progress = totalSeconds > 0 ? Math.min(elapsed / totalSeconds, 1) : 0

  // Breathing animation for breathe-type rituals
  const breathPhase = phase === 'active' && ritual.type === 'breathe'
    ? ['Inhale', 'Hold', 'Exhale', 'Hold'][Math.floor(elapsed / 4) % 4]
    : null

  return (
    <div style={{
      height: '100%',
      overflowY: 'auto',
      background: colors.bg,
      display: 'flex',
      flexDirection: 'column',
      WebkitOverflowScrolling: 'touch',
    }}>
      {/* Header */}
      <div style={{ padding: '20px 20px 0', display: 'flex', alignItems: 'center', gap: 16 }}>
        <svg onClick={() => navigate(-1)} width={24} height={24} viewBox="0 0 24 24" fill="none" stroke={colors.text} strokeWidth={1.5} strokeLinecap="round" style={{ cursor: 'pointer', flexShrink: 0 }}>
          <polyline points="15 18 9 12 15 6" />
        </svg>
        <span style={{ fontFamily: fonts.sans, fontSize: 12, fontWeight: 600, color: colors.text3, letterSpacing: 2, textTransform: 'uppercase' }}>
          Ritual
        </span>
      </div>

      {/* Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 32px' }}>

        {phase === 'ready' && (
          <>
            <p style={{ fontFamily: fonts.sans, fontSize: 24, fontWeight: 300, color: colors.text, textAlign: 'center', marginBottom: 12, letterSpacing: -0.5 }}>
              {ritual.title}
            </p>
            <p style={{ fontFamily: fonts.sans, fontSize: 14, color: colors.text3, textAlign: 'center', lineHeight: 1.6, marginBottom: 8 }}>
              {ritual.desc}
            </p>
            <p style={{ fontFamily: fonts.sans, fontSize: 12, color: colors.text3, marginBottom: 48 }}>
              {ritual.duration} minutes
            </p>
            <button onClick={start} style={{
              fontFamily: fonts.sans, fontSize: 14, fontWeight: 600,
              color: '#fff', background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: radius.pill, padding: '16px 48px', cursor: 'pointer',
              letterSpacing: 0.5,
            }}>
              Begin
            </button>
          </>
        )}

        {phase === 'active' && (
          <>
            {/* Timer circle */}
            <div style={{ position: 'relative', marginBottom: 32 }}>
              <svg width={200} height={200} viewBox="0 0 200 200">
                <circle cx={100} cy={100} r={88} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={3} />
                <circle cx={100} cy={100} r={88} fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth={3}
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 88}
                  strokeDashoffset={2 * Math.PI * 88 * (1 - progress)}
                  transform="rotate(-90 100 100)"
                  style={{ transition: 'stroke-dashoffset 1s linear' }}
                />
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <p style={{ fontFamily: fonts.mono, fontSize: 32, fontWeight: 300, color: colors.text, letterSpacing: 2 }}>
                  {formatTime(totalSeconds - elapsed)}
                </p>
                {breathPhase && (
                  <p style={{ fontFamily: fonts.sans, fontSize: 13, color: colors.text2, marginTop: 8, fontStyle: 'italic' }}>
                    {breathPhase}
                  </p>
                )}
              </div>
            </div>

            {/* Prompt */}
            <p style={{ fontFamily: fonts.sans, fontSize: 16, fontWeight: 300, color: colors.text2, textAlign: 'center', fontStyle: 'italic', marginBottom: 32, lineHeight: 1.6 }}>
              {ritual.prompt}
            </p>

            {/* Writing area for write-type rituals */}
            {ritual.type === 'write' && (
              <textarea
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder="Write here..."
                style={{
                  width: '100%', minHeight: 120, background: colors.surface,
                  border: `1px solid ${colors.border}`, borderRadius: 14,
                  padding: '16px 18px', fontFamily: fonts.sans, fontSize: 14,
                  color: colors.text, resize: 'none', outline: 'none',
                  lineHeight: 1.6, marginBottom: 24,
                }}
              />
            )}

            {/* Done button */}
            <button onClick={finish} style={{
              fontFamily: fonts.sans, fontSize: 13, fontWeight: 600,
              color: '#fff', background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: radius.pill, padding: '14px 40px', cursor: 'pointer',
              letterSpacing: 0.5,
            }}>
              I'm Done
            </button>
          </>
        )}

        {phase === 'done' && (
          <>
            {/* Checkmark */}
            <div style={{
              width: 80, height: 80, borderRadius: 40,
              border: '2px solid rgba(255,255,255,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: 28,
            }}>
              <svg width={36} height={36} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <p style={{ fontFamily: fonts.sans, fontSize: 22, fontWeight: 300, color: colors.text, marginBottom: 8 }}>
              Complete
            </p>
            <p style={{ fontFamily: fonts.sans, fontSize: 14, color: colors.text3, textAlign: 'center', marginBottom: 40 }}>
              {ritual.title} &middot; {elapsed >= 60 ? `${Math.floor(elapsed / 60)} min` : `${elapsed}s`}
            </p>
            <button onClick={() => navigate('/')} style={{
              fontFamily: fonts.sans, fontSize: 14, fontWeight: 600,
              color: '#fff', background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: radius.pill, padding: '16px 48px', cursor: 'pointer',
            }}>
              Back to Home
            </button>
          </>
        )}
      </div>
    </div>
  )
}
