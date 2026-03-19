import { useState, useEffect, useRef, useMemo } from 'react'
import { colors, fonts, radius } from '../theme'

// Clean photos — safe for text overlay
const CLEAN_PHOTOS = [
  '/mudra.jpg', '/leaf-dark.jpg', '/yoga.jpg', '/sage-bowl.jpg',
]

// Photos with text baked in — show standalone only
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
  "I am the creator of my reality.",
  "Every day I am growing into who I was always meant to be.",
  "I radiate confidence, grace, and power.",
  "My peace is my priority and my power.",
  "I am surrounded by love and support.",
  "The best is always coming.",
  "I am open to receiving everything the universe has for me.",
  "My intuition always guides me to the right path.",
  "I am building a life that feels as good as it looks.",
  "I release what was and welcome what is.",
]

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

function pickNote(pageIndex) {
  const seed = getDailySeed() + pageIndex * 9999
  const rng = seededRandom(seed)
  return UNIVERSE_NOTES[Math.floor(rng() * UNIVERSE_NOTES.length)]
}

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const SOUNDSCAPES = ['Rain', 'Ocean', 'Forest', 'Fire', 'Night']

const AUDIO_LIBRARY = [
  { title: 'Body Scan Meditation', practitioner: 'Amara J.', duration: '15 min', color: '#1E2A20' },
  { title: 'Letting Go Practice', practitioner: 'Sarah M.', duration: '12 min', color: '#2A2520' },
  { title: 'Morning Breathwork', practitioner: 'Nadia C.', duration: '10 min', color: '#201E2A' },
  { title: 'Gratitude Meditation', practitioner: 'Amara J.', duration: '8 min', color: '#2A2020' },
  { title: 'Chakra Alignment', practitioner: 'Sarah M.', duration: '20 min', color: '#1E1E2A' },
]

const SLEEP_STORIES = [
  { title: 'The Lavender Field', narrator: 'Sarah M.', duration: '25 min' },
  { title: 'Rain on the Roof', narrator: 'Amara J.', duration: '30 min' },
  { title: 'Mountain Cabin', narrator: 'Nadia C.', duration: '22 min' },
  { title: 'Starlit Garden', narrator: 'Sarah M.', duration: '28 min' },
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
]

export default function Mind() {
  const [breathing, setBreathing] = useState(false)
  const [breathPhase, setBreathPhase] = useState('inhale')
  const [breathScale, setBreathScale] = useState(1)
  const [activeSound, setActiveSound] = useState(null)
  const intervalRef = useRef(null)

  // Pick random photos on mount
  const photos = useMemo(() => {
    const clean = shuffle(CLEAN_PHOTOS)
    const text = shuffle(TEXT_PHOTOS)
    return {
      hero: clean[0],         // text overlay "Stillness"
      dividerQuote: clean[1], // text overlay with quote
    }
  }, [])

  useEffect(() => {
    if (!breathing) {
      setBreathScale(1)
      if (intervalRef.current) clearInterval(intervalRef.current)
      return
    }
    let phase = 0
    const cycle = () => {
      if (phase % 2 === 0) { setBreathPhase('inhale'); setBreathScale(1.5) }
      else { setBreathPhase('exhale'); setBreathScale(1) }
      phase++
    }
    cycle()
    intervalRef.current = setInterval(cycle, 4000)
    return () => clearInterval(intervalRef.current)
  }, [breathing])

  return (
    <div style={{ height: '100%', overflowY: 'auto', paddingBottom: 160, background: colors.bg }}>

      {/* Hero image — rounded, shorter */}
      <div style={{ position: 'relative', height: 300, margin: '8px 16px 0', borderRadius: 20, overflow: 'hidden' }}>
        <img src={photos.hero} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(13,13,13,0.9) 100%)',
        }} />
        <div style={{ position: 'absolute', bottom: 28, left: 24, right: 24 }}>
          <p style={{ fontFamily: fonts.sans, fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.4)', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 6 }}>
            Your sanctuary
          </p>
          <h1 style={{ fontFamily: fonts.sans, fontSize: 28, fontWeight: 300, color: '#fff', lineHeight: 1.2 }}>
            Stillness
          </h1>
        </div>
      </div>

      {/* Breathing Exercise */}
      <div style={{ padding: '36px 24px 32px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div
          onClick={() => setBreathing(!breathing)}
          style={{
            width: 140, height: 140, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 70%)',
            border: '1px solid rgba(255,255,255,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', transform: `scale(${breathScale})`, transition: 'transform 4s ease-in-out',
          }}
        >
          <span style={{ fontFamily: fonts.sans, fontSize: 13, fontWeight: 300, color: colors.text2, letterSpacing: 1 }}>
            {breathing ? breathPhase : 'begin'}
          </span>
        </div>
        <p style={{ fontFamily: fonts.sans, fontSize: 11, color: colors.text3, marginTop: 16 }}>
          {breathing ? 'Tap to stop' : 'Tap to breathe'}
        </p>
      </div>

      {/* Soundscapes */}
      <div style={{ padding: '0 24px 28px' }}>
        <p style={{ fontFamily: fonts.sans, fontSize: 10, fontWeight: 600, color: colors.text3, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 14 }}>
          Soundscapes
        </p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {SOUNDSCAPES.map(s => (
            <button
              key={s}
              onClick={() => setActiveSound(activeSound === s ? null : s)}
              style={{
                fontFamily: fonts.sans, fontSize: 12, fontWeight: 500,
                color: activeSound === s ? '#fff' : colors.text2,
                background: activeSound === s ? 'rgba(255,255,255,0.12)' : colors.surface,
                border: `1px solid ${activeSound === s ? 'rgba(255,255,255,0.2)' : 'transparent'}`,
                borderRadius: radius.pill, padding: '10px 18px', cursor: 'pointer', transition: 'all 0.2s',
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Divider — quote on clean photo */}
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
          <span style={{ fontFamily: fonts.sans, fontSize: 11, fontWeight: 500, color: colors.text3, cursor: 'pointer' }}>See All</span>
        </div>
        <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingLeft: 24, paddingRight: 24, paddingBottom: 4 }}>
          {AUDIO_LIBRARY.map((item, i) => (
            <div key={i} style={{ minWidth: 160, borderRadius: 14, overflow: 'hidden', background: item.color, cursor: 'pointer', flexShrink: 0 }}>
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
            <div key={i} style={{ background: colors.surface, borderRadius: 14, padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer' }}>
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
              <button style={{
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

      {/* Daily Intention Cards */}
      <div style={{ padding: '24px 0 0' }}>
        <p style={{ fontFamily: fonts.sans, fontSize: 10, fontWeight: 600, color: colors.text3, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 14, paddingLeft: 24 }}>
          Daily Intention Cards
        </p>
        <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingLeft: 24, paddingRight: 24, paddingBottom: 4 }}>
          {INTENTION_CARDS.map((text, i) => (
            <div key={i} style={{
              minWidth: 140, width: 140, flexShrink: 0,
              background: colors.surface, borderRadius: 14,
              borderTop: '1px solid rgba(255,255,255,0.08)',
              padding: '24px 16px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <p style={{ fontFamily: fonts.sans, fontSize: 13, fontWeight: 300, fontStyle: 'italic', color: colors.text2, textAlign: 'center', lineHeight: 1.5 }}>
                {text}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Note from the Universe */}
      <div style={{ margin: '24px 16px', background: colors.surface, borderRadius: 16, padding: '32px 28px', textAlign: 'center' }}>
        <div style={{ width: 40, height: 1, background: 'rgba(255,255,255,0.06)', margin: '0 auto 20px' }} />
        <p style={{
          fontFamily: fonts.sans, fontSize: 10, fontWeight: 600,
          color: colors.text3, letterSpacing: 3, textTransform: 'uppercase',
          marginBottom: 16,
        }}>
          Note from the Universe
        </p>
        <p style={{
          fontFamily: fonts.sans, fontSize: 15, fontWeight: 300,
          color: colors.text, fontStyle: 'italic', lineHeight: 1.7,
        }}>
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
    </div>
  )
}
