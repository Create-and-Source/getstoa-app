import { useState, useEffect, useRef, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { colors, fonts, radius } from '../theme'

const CLEAN_PHOTOS = ['/mudra.jpg', '/leaf-dark.jpg', '/yoga.jpg', '/sage-bowl.jpg']
const TEXT_PHOTOS = [
  '/live-slowly.jpg', '/bodymindssoul.jpg', '/meditation.jpg', '/soul.jpg',
  '/whole.jpg', '/water.jpg', '/harmony.jpg', '/routines.jpg',
  '/connection.jpg', '/mindbody.jpg', '/monstera.jpg',
  '/skin.jpg', '/palo-santo.jpg', '/crystal.jpg',
]

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
]

function seededRandom(seed) {
  let s = seed
  return () => { s = (s * 16807 + 0) % 2147483647; return (s - 1) / 2147483646 }
}
function getDailySeed() {
  const d = new Date()
  return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate()
}
function pickNote(pageIndex) {
  const seed = getDailySeed() + pageIndex * 9999
  const rng = seededRandom(seed)
  return UNIVERSE_NOTES[Math.floor(rng() * UNIVERSE_NOTES.length)]
}
function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]] }
  return a
}

const SOUNDSCAPES = [
  { name: 'Rain', type: 'brown', filterFreq: 400 },
  { name: 'Ocean', type: 'brown', filterFreq: 250 },
  { name: 'Forest', type: 'pink', filterFreq: 800 },
  { name: 'Fire', type: 'brown', filterFreq: 180 },
  { name: 'Night', type: 'pink', filterFreq: 350 },
]

const AUDIO_LIBRARY = [
  { title: 'Body Scan Meditation', practitioner: 'Amara J.', duration: '15 min', color: '#1E2A20' },
  { title: 'Letting Go Practice', practitioner: 'Sarah M.', duration: '12 min', color: '#2A2520' },
  { title: 'Morning Breathwork', practitioner: 'Nadia C.', duration: '10 min', color: '#201E2A' },
  { title: 'Gratitude Meditation', practitioner: 'Amara J.', duration: '8 min', color: '#2A2020' },
  { title: 'Chakra Alignment', practitioner: 'Sarah M.', duration: '20 min', color: '#1E1E2A' },
]

const SLEEP_STORIES = [
  { title: 'The Lavender Field', narrator: 'Sarah M.', duration: '25 min', slug: 'lavender-field' },
  { title: 'Rain on the Roof', narrator: 'Amara J.', duration: '30 min', slug: 'rain-on-roof' },
  { title: 'Mountain Cabin', narrator: 'Nadia C.', duration: '22 min', slug: 'mountain-cabin' },
  { title: 'Starlit Garden', narrator: 'Sarah M.', duration: '28 min', slug: 'starlit-garden' },
]

const GUIDED_PROGRAMS = [
  { title: '21-Day Meditation Journey', host: 'Amara J.', sessions: 21 },
  { title: 'Breathwork Fundamentals', host: 'Nadia C.', sessions: 7 },
  { title: 'Sleep Reset', host: 'Sarah M.', sessions: 14 },
]

const INTENTION_CARDS = [
  'I choose peace over perfection.',
  'My body is my home. I treat it with love.',
  'I am exactly where I need to be.',
  'Today I release what no longer serves me.',
  'I trust the process.',
  'I am allowed to take up space.',
]

// Web Audio noise generator
function createNoise(audioCtx, type) {
  const bufferSize = audioCtx.sampleRate * 2
  const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate)
  const data = buffer.getChannelData(0)

  if (type === 'brown') {
    let lastOut = 0
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1
      data[i] = (lastOut + (0.02 * white)) / 1.02
      lastOut = data[i]
      data[i] *= 3.5
    }
  } else {
    // pink noise approximation
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1
      b0 = 0.99886 * b0 + white * 0.0555179
      b1 = 0.99332 * b1 + white * 0.0750759
      b2 = 0.96900 * b2 + white * 0.1538520
      b3 = 0.86650 * b3 + white * 0.3104856
      b4 = 0.55000 * b4 + white * 0.5329522
      b5 = -0.7616 * b5 - white * 0.0168980
      data[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362
      data[i] *= 0.11
      b6 = white * 0.115926
    }
  }

  const source = audioCtx.createBufferSource()
  source.buffer = buffer
  source.loop = true

  return source
}

export default function Mind() {
  const navigate = useNavigate()
  const [breathing, setBreathing] = useState(false)
  const [breathPhase, setBreathPhase] = useState('inhale')
  const [breathCount, setBreathCount] = useState(4)
  const [breathScale, setBreathScale] = useState(1)
  const [activeSound, setActiveSound] = useState(null)
  const breathIntervalRef = useRef(null)
  const breathCountRef = useRef(null)
  const audioCtxRef = useRef(null)
  const audioSourceRef = useRef(null)
  const gainRef = useRef(null)

  // Daily intention
  const todayKey = new Date().toISOString().split('T')[0]
  const [savedIntention, setSavedIntention] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('stoa-daily-intention') || '{}')
      return stored[todayKey] || null
    } catch { return null }
  })

  function saveIntention(text) {
    setSavedIntention(text)
    try {
      const stored = JSON.parse(localStorage.getItem('stoa-daily-intention') || '{}')
      stored[todayKey] = text
      localStorage.setItem('stoa-daily-intention', JSON.stringify(stored))
    } catch {}
  }

  const photos = useMemo(() => {
    const clean = shuffle(CLEAN_PHOTOS)
    return { hero: clean[0], dividerQuote: clean[1] }
  }, [])

  // Breathing exercise with 4-count phases
  useEffect(() => {
    if (!breathing) {
      setBreathScale(1)
      setBreathPhase('inhale')
      setBreathCount(4)
      if (breathIntervalRef.current) clearInterval(breathIntervalRef.current)
      if (breathCountRef.current) clearInterval(breathCountRef.current)
      return
    }

    const phases = ['inhale', 'hold', 'exhale', 'hold']
    const scales = [1.5, 1.5, 1, 1]
    let phaseIdx = 0
    let count = 4

    function startPhase() {
      setBreathPhase(phases[phaseIdx])
      setBreathScale(scales[phaseIdx])
      count = 4
      setBreathCount(4)
    }

    startPhase()

    breathCountRef.current = setInterval(() => {
      count--
      if (count <= 0) {
        phaseIdx = (phaseIdx + 1) % 4
        startPhase()
      } else {
        setBreathCount(count)
      }
    }, 1000)

    return () => {
      if (breathCountRef.current) clearInterval(breathCountRef.current)
    }
  }, [breathing])

  // Soundscape audio
  function toggleSound(soundName) {
    if (activeSound === soundName) {
      // Stop
      if (audioSourceRef.current) { audioSourceRef.current.stop(); audioSourceRef.current = null }
      if (audioCtxRef.current) { audioCtxRef.current.close(); audioCtxRef.current = null }
      setActiveSound(null)
      return
    }

    // Stop previous
    if (audioSourceRef.current) { audioSourceRef.current.stop(); audioSourceRef.current = null }
    if (audioCtxRef.current) { audioCtxRef.current.close(); audioCtxRef.current = null }

    try {
      const sound = SOUNDSCAPES.find(s => s.name === soundName)
      const ctx = new (window.AudioContext || window.webkitAudioContext)()
      audioCtxRef.current = ctx

      const source = createNoise(ctx, sound.type)
      audioSourceRef.current = source

      // Filter to shape the sound
      const filter = ctx.createBiquadFilter()
      filter.type = 'lowpass'
      filter.frequency.value = sound.filterFreq

      // Gain
      const gain = ctx.createGain()
      gain.gain.value = 0.3
      gainRef.current = gain

      source.connect(filter)
      filter.connect(gain)
      gain.connect(ctx.destination)
      source.start()

      setActiveSound(soundName)
    } catch {
      setActiveSound(null)
    }
  }

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioSourceRef.current) try { audioSourceRef.current.stop() } catch {}
      if (audioCtxRef.current) try { audioCtxRef.current.close() } catch {}
    }
  }, [])

  return (
    <div style={{ height: '100%', overflowY: 'auto', paddingBottom: 160, background: colors.bg, WebkitOverflowScrolling: 'touch' }}>

      {/* Hero */}
      <div style={{ position: 'relative', height: 300, margin: '8px 16px 0', borderRadius: 20, overflow: 'hidden' }}>
        <img src={photos.hero} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(13,13,13,0.9) 100%)' }} />
        <div style={{ position: 'absolute', bottom: 28, left: 24, right: 24 }}>
          <p style={{ fontFamily: fonts.sans, fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.4)', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 6 }}>
            Your sanctuary
          </p>
          <h1 style={{ fontFamily: fonts.sans, fontSize: 28, fontWeight: 300, color: '#fff', lineHeight: 1.2 }}>
            Stillness
          </h1>
        </div>
      </div>

      {/* Breathing Exercise — with count */}
      <div style={{ padding: '36px 24px 32px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div
          onClick={() => setBreathing(!breathing)}
          style={{
            width: 140, height: 140, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 70%)',
            border: '1px solid rgba(255,255,255,0.15)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', transform: `scale(${breathScale})`, transition: 'transform 4s ease-in-out',
          }}
        >
          <span style={{ fontFamily: fonts.sans, fontSize: 13, fontWeight: 300, color: colors.text2, letterSpacing: 1 }}>
            {breathing ? breathPhase : 'begin'}
          </span>
          {breathing && (
            <span style={{ fontFamily: fonts.mono, fontSize: 24, fontWeight: 300, color: colors.text, marginTop: 4 }}>
              {breathCount}
            </span>
          )}
        </div>
        <p style={{ fontFamily: fonts.sans, fontSize: 11, color: colors.text3, marginTop: 16 }}>
          {breathing ? 'Tap to stop · Box breathing (4-4-4-4)' : 'Tap to breathe'}
        </p>
      </div>

      {/* Soundscapes — real audio */}
      <div style={{ padding: '0 24px 28px' }}>
        <p style={{ fontFamily: fonts.sans, fontSize: 10, fontWeight: 600, color: colors.text3, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 14 }}>
          Soundscapes
        </p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {SOUNDSCAPES.map(s => (
            <button
              key={s.name}
              onClick={() => toggleSound(s.name)}
              style={{
                fontFamily: fonts.sans, fontSize: 12, fontWeight: 500,
                color: activeSound === s.name ? '#fff' : colors.text2,
                background: activeSound === s.name ? 'rgba(255,255,255,0.12)' : colors.surface,
                border: `1px solid ${activeSound === s.name ? 'rgba(255,255,255,0.2)' : 'transparent'}`,
                borderRadius: radius.pill, padding: '10px 18px', cursor: 'pointer', transition: 'all 0.2s',
                display: 'flex', alignItems: 'center', gap: 6,
              }}
            >
              {activeSound === s.name && (
                <span style={{ display: 'flex', gap: 2, alignItems: 'flex-end', height: 12 }}>
                  {[0, 1, 2].map(i => (
                    <span key={i} style={{
                      width: 2, background: '#fff', borderRadius: 1,
                      animation: `eqBar 0.8s ${i * 0.15}s ease-in-out infinite alternate`,
                    }} />
                  ))}
                </span>
              )}
              {s.name}
            </button>
          ))}
        </div>
        {activeSound && (
          <p style={{ fontFamily: fonts.sans, fontSize: 11, color: colors.text3, marginTop: 10, fontStyle: 'italic' }}>
            Playing {activeSound.toLowerCase()} sounds...
          </p>
        )}
      </div>

      {/* Daily Intention — saveable */}
      <div style={{ padding: '0 24px 28px' }}>
        <p style={{ fontFamily: fonts.sans, fontSize: 10, fontWeight: 600, color: colors.text3, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 14 }}>
          {savedIntention ? 'Today\'s Intention' : 'Choose Your Intention'}
        </p>
        {savedIntention ? (
          <div style={{
            background: colors.surface, borderRadius: 14, padding: '24px 20px',
            border: '1px solid rgba(255,255,255,0.1)', textAlign: 'center',
          }}>
            <p style={{ fontFamily: fonts.sans, fontSize: 16, fontWeight: 300, color: colors.text, fontStyle: 'italic', lineHeight: 1.6, marginBottom: 12 }}>
              "{savedIntention}"
            </p>
            <p onClick={() => saveIntention(null)} style={{ fontFamily: fonts.sans, fontSize: 11, color: colors.text3, cursor: 'pointer' }}>
              Change intention
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 4, scrollbarWidth: 'none' }}>
            {INTENTION_CARDS.map((text, i) => (
              <div key={i} onClick={() => saveIntention(text)} style={{
                minWidth: 150, width: 150, flexShrink: 0,
                background: colors.surface, borderRadius: 14,
                border: `1px solid ${colors.border}`,
                padding: '24px 16px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', transition: 'border 0.2s',
              }}>
                <p style={{ fontFamily: fonts.sans, fontSize: 13, fontWeight: 300, fontStyle: 'italic', color: colors.text2, textAlign: 'center', lineHeight: 1.5 }}>
                  {text}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Divider quote */}
      <div style={{ position: 'relative', margin: '0 16px 4px', borderRadius: 16, overflow: 'hidden', height: 180 }}>
        <img src={photos.dividerQuote} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.35)' }} />
        <div style={{ position: 'absolute', bottom: 24, left: 0, right: 0, textAlign: 'center', padding: '0 24px' }}>
          <p style={{ fontFamily: fonts.sans, fontSize: 14, fontWeight: 300, color: 'rgba(255,255,255,0.8)', letterSpacing: 0.5, fontStyle: 'italic' }}>
            "The quieter you become, the more you can hear."
          </p>
        </div>
      </div>

      {/* Audio Library */}
      <div style={{ padding: '24px 0 0' }}>
        <div style={{ padding: '0 24px', marginBottom: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <p style={{ fontFamily: fonts.sans, fontSize: 10, fontWeight: 600, color: colors.text3, letterSpacing: 3, textTransform: 'uppercase' }}>Audio Library</p>
        </div>
        <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingLeft: 24, paddingRight: 24, paddingBottom: 4, scrollbarWidth: 'none' }}>
          {AUDIO_LIBRARY.map((item, i) => (
            <div key={i} onClick={() => navigate('/stillness')} style={{ minWidth: 160, borderRadius: 14, overflow: 'hidden', background: item.color, cursor: 'pointer', flexShrink: 0 }}>
              <div style={{ height: 90, background: `linear-gradient(135deg, ${item.color} 0%, rgba(255,255,255,0.04) 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: 36, height: 36, borderRadius: 18, background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width={14} height={14} viewBox="0 0 24 24" fill="#fff"><polygon points="6 3 20 12 6 21" /></svg>
                </div>
              </div>
              <div style={{ padding: '12px 14px 14px' }}>
                <p style={{ fontFamily: fonts.sans, fontSize: 13, fontWeight: 600, color: '#fff', marginBottom: 4, lineHeight: 1.3 }}>{item.title}</p>
                <p style={{ fontFamily: fonts.sans, fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>{item.practitioner} &middot; {item.duration}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sleep Stories */}
      <div style={{ padding: '24px 24px 0' }}>
        <p style={{ fontFamily: fonts.sans, fontSize: 10, fontWeight: 600, color: colors.text3, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 14 }}>
          Sleep Stories
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {SLEEP_STORIES.map((story, i) => (
            <div key={i} onClick={() => navigate(`/sleep/${story.slug}`)} style={{ background: colors.surface, borderRadius: 14, padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer' }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: 'rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={colors.text3} strokeWidth={1.5} strokeLinecap="round">
                  <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
                </svg>
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontFamily: fonts.sans, fontSize: 14, fontWeight: 500, color: colors.text, marginBottom: 2 }}>{story.title}</p>
                <p style={{ fontFamily: fonts.sans, fontSize: 11, color: colors.text3 }}>{story.narrator} &middot; {story.duration}</p>
              </div>
              <svg width={14} height={14} viewBox="0 0 24 24" fill="rgba(255,255,255,0.3)"><polygon points="6 3 20 12 6 21" /></svg>
            </div>
          ))}
        </div>
      </div>

      {/* Guided Programs */}
      <div style={{ padding: '24px 24px 0' }}>
        <p style={{ fontFamily: fonts.sans, fontSize: 10, fontWeight: 600, color: colors.text3, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 14 }}>
          Guided Programs
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {GUIDED_PROGRAMS.map((program, i) => (
            <div key={i} style={{ background: colors.surface, borderRadius: 14, padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ flex: 1 }}>
                <p style={{ fontFamily: fonts.sans, fontSize: 14, fontWeight: 500, color: colors.text, marginBottom: 2 }}>{program.title}</p>
                <p style={{ fontFamily: fonts.sans, fontSize: 11, color: colors.text3 }}>{program.host} &middot; {program.sessions} sessions</p>
              </div>
              <button onClick={() => navigate('/stillness')} style={{
                fontFamily: fonts.sans, fontSize: 11, fontWeight: 600, color: '#fff',
                background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: radius.pill, padding: '8px 18px', cursor: 'pointer', flexShrink: 0,
              }}>
                Begin
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Universe Note */}
      <div style={{ margin: '24px 16px', background: colors.surface, borderRadius: 16, padding: '32px 28px', textAlign: 'center' }}>
        <div style={{ width: 40, height: 1, background: 'rgba(255,255,255,0.06)', margin: '0 auto 20px' }} />
        <p style={{ fontFamily: fonts.sans, fontSize: 10, fontWeight: 600, color: colors.text3, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 16 }}>
          Note from the Universe
        </p>
        <p style={{ fontFamily: fonts.sans, fontSize: 15, fontWeight: 300, color: colors.text, fontStyle: 'italic', lineHeight: 1.7 }}>
          "{pickNote(1)}"
        </p>
      </div>

      {/* Today's Insight */}
      <div style={{ padding: '24px 24px 0' }}>
        <p style={{ fontFamily: fonts.sans, fontSize: 10, fontWeight: 600, color: colors.text3, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 14 }}>
          Today's Insight
        </p>
        <div style={{ background: colors.surface, borderRadius: 14, padding: 22 }}>
          <p style={{ fontFamily: fonts.sans, fontSize: 15, fontWeight: 500, color: colors.text, marginBottom: 10 }}>
            Why the groove matters more than the streak
          </p>
          <p style={{ fontFamily: fonts.sans, fontSize: 14, fontWeight: 300, color: colors.text2, lineHeight: 1.7 }}>
            When you repeat a behavior, your brain creates a neural pathway. Miss a day? The pathway is still there. You didn't lose anything. The groove is carved. Pick it back up.
          </p>
        </div>
      </div>

      {/* EQ animation */}
      <style>{`
        @keyframes eqBar {
          0% { height: 3px; }
          100% { height: 12px; }
        }
      `}</style>
    </div>
  )
}
