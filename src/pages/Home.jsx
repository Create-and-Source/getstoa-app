import { useState, useRef, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { colors, fonts, radius } from '../theme'

// Clean photos (no baked-in text) — safe for text overlay
const CLEAN_PHOTOS = [
  '/mudra.jpg', '/leaf-dark.jpg', '/yoga.jpg', '/sage-bowl.jpg',
]

// Photos with text baked in — show standalone only, never overlay app text
const TEXT_PHOTOS = [
  '/live-slowly.jpg', '/bodymindssoul.jpg', '/meditation.jpg', '/soul.jpg',
  '/whole.jpg', '/water.jpg', '/harmony.jpg', '/routines.jpg',
  '/connection.jpg', '/mindbody.jpg', '/monstera.jpg',
  '/skin.jpg', '/palo-santo.jpg', '/crystal.jpg',
]

const ALL_PHOTOS = [...CLEAN_PHOTOS, ...TEXT_PHOTOS]

// Time-preferred hero photos — ONLY from CLEAN_PHOTOS (no baked-in text)
const TIME_PHOTOS = {
  morning: ['/sage-bowl.jpg', '/yoga.jpg', '/mudra.jpg'],
  afternoon: ['/yoga.jpg', '/sage-bowl.jpg', '/mudra.jpg'],
  evening: ['/mudra.jpg', '/leaf-dark.jpg', '/yoga.jpg'],
  night: ['/leaf-dark.jpg', '/mudra.jpg', '/sage-bowl.jpg'],
}

// Color atmosphere tints by time of day
const TIME_TINTS = {
  morning: 'rgba(180,140,60,0.08)',
  afternoon: 'transparent',
  evening: 'rgba(100,80,140,0.06)',
  night: 'rgba(40,60,120,0.08)',
}

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
  "The best is always coming.",
  "I am open to receiving everything the universe has for me.",
  "My intuition always guides me to the right path.",
  "I am building a life that feels as good as it looks.",
  "I release what was and welcome what is.",
]

function pickNote(pageIndex) {
  const seed = getDailySeed() + pageIndex * 9999
  const rng = seededRandom(seed)
  return UNIVERSE_NOTES[Math.floor(rng() * UNIVERSE_NOTES.length)]
}

function shuffle(arr, rng) {
  const a = [...arr]
  const rand = rng || Math.random
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// Time-of-day content
function getTimeOfDay() {
  const h = new Date().getHours()
  if (h >= 5 && h < 12) return 'morning'
  if (h >= 12 && h < 17) return 'afternoon'
  if (h >= 17 && h < 21) return 'evening'
  return 'night'
}

// Generate realistic stats based on time of day with a daily seed
function generateStats(hour, rng) {
  const r = (min, max) => Math.round(min + rng() * (max - min))

  if (hour >= 5 && hour < 12) {
    return {
      header: "Today's Intention",
      walk: { value: 0, label: 'min', sub: 'planned: 30 min', goal: 30, progress: 0 },
      stillness: { value: r(0, 8), label: 'min', sub: `Day ${r(30, 45)} streak`, goal: 20, progress: null },
      water: { value: r(1, 3), label: 'of 8', sub: 'glasses today', goal: 8, progress: null },
      sleep: { value: (r(68, 82) / 10).toFixed(1), label: 'hrs', sub: 'quality: good', goal: 8, progress: null },
    }
  }
  if (hour >= 12 && hour < 17) {
    const walkMin = r(15, 32)
    return {
      header: 'Today So Far',
      walk: { value: walkMin, label: 'min', sub: `${(walkMin * 0.056).toFixed(1)} miles`, goal: 30, progress: null },
      stillness: { value: r(8, 15), label: 'min', sub: `Day ${r(30, 45)} streak`, goal: 20, progress: null },
      water: { value: r(4, 6), label: 'of 8', sub: 'glasses today', goal: 8, progress: null },
      sleep: { value: (r(68, 82) / 10).toFixed(1), label: 'hrs', sub: 'quality: good', goal: 8, progress: null },
    }
  }
  if (hour >= 17 && hour < 21) {
    const walkMin = r(28, 35)
    return {
      header: 'Today',
      walk: { value: walkMin, label: 'min', sub: `${(walkMin * 0.056).toFixed(1)} miles`, goal: 30, progress: null },
      stillness: { value: r(12, 18), label: 'min', sub: `Day ${r(30, 45)} streak`, goal: 20, progress: null },
      water: { value: r(6, 7), label: 'of 8', sub: 'glasses today', goal: 8, progress: null },
      sleep: { value: (r(68, 82) / 10).toFixed(1), label: 'hrs', sub: 'quality: good', goal: 8, progress: null },
    }
  }
  // night
  const walkMin = r(32, 38)
  return {
    header: 'Today, Complete',
    walk: { value: walkMin, label: 'min', sub: `${(walkMin * 0.056).toFixed(1)} miles`, goal: 30, progress: null },
    stillness: { value: r(15, 22), label: 'min', sub: `Day ${r(30, 45)} streak`, goal: 20, progress: null },
    water: { value: r(7, 8), label: 'of 8', sub: 'glasses today', goal: 8, progress: null },
    sleep: { value: (r(68, 82) / 10).toFixed(1), label: 'hrs', sub: 'quality: good', goal: 8, progress: null },
  }
}

// Contextual copy
const TIME_COPY = {
  morning: {
    journal: 'Start fresh today',
    gratitude: "What are you grateful for this morning?",
    stillness: 'sit in stillness..',
    quote: '"Day 21, the pathway forms. Day 66, it becomes automatic. Day 90, you are rewired."',
  },
  afternoon: {
    journal: 'Capture this moment',
    gratitude: "What's been good about today?",
    stillness: 'sit in stillness..',
    quote: '"She remembered who she was and the game changed."',
  },
  evening: {
    journal: 'Reflect on your day',
    gratitude: 'Three things that went well...',
    stillness: 'wind down in stillness..',
    quote: '"Almost everything will work again if you unplug it for a few minutes. Including you."',
  },
  night: {
    journal: 'Write before you rest',
    gratitude: 'What brought you peace today?',
    stillness: 'release the day..',
    quote: '"Sleep is the best meditation." — Dalai Lama',
  },
}

const VIBE_QUOTES = {
  afternoon: {
    her: '"She remembered who she was and the game changed."',
    his: '"He remembered who he was and the game changed."',
    universal: '"Remember who you are. The game changes."',
  },
}

const VIBE_VISION_AFFIRMATION = {
  her: 'She built a life so beautiful, it healed her.',
  his: 'He built a life so powerful, it freed him.',
  universal: 'Build a life so beautiful, it heals you.',
}

const TIME_CONFIG = {
  morning: {
    greeting: 'Good morning',
    subtitle: 'Start with intention.',
    suggestion: 'Morning Ritual',
    suggestionDesc: 'Gratitude, breathwork, and setting your intention for the day.',
    suggestionIcon: 'sun',
  },
  afternoon: {
    greeting: 'Good afternoon',
    subtitle: 'Stay present.',
    suggestion: 'Afternoon Walk',
    suggestionDesc: 'Step outside. Move your body. Let your mind wander.',
    suggestionIcon: 'walk',
  },
  evening: {
    greeting: 'Good evening',
    subtitle: 'Begin to wind down.',
    suggestion: 'Evening Reflection',
    suggestionDesc: 'Journal your wins. Release what didn\'t serve you. Breathe.',
    suggestionIcon: 'moon',
  },
  night: {
    greeting: 'Goodnight',
    subtitle: 'Rest is sacred.',
    suggestion: 'Sleep Preparation',
    suggestionDesc: 'Dim the lights. A body scan. Let go of the day.',
    suggestionIcon: 'stars',
  },
}

// Thin progress bar component for stat cards
function StatBar({ value, goal }) {
  const pct = Math.min((value / goal) * 100, 100)
  return (
    <div style={{ height: 2, background: 'rgba(255,255,255,0.06)', borderRadius: 1, marginTop: 10, overflow: 'hidden' }}>
      <div style={{ height: '100%', width: `${pct}%`, background: 'rgba(255,255,255,0.15)', borderRadius: 1, transition: 'width 0.6s ease' }} />
    </div>
  )
}

export default function Home() {
  const navigate = useNavigate()
  const timeOfDay = useMemo(() => getTimeOfDay(), [])
  const timeConfig = TIME_CONFIG[timeOfDay]
  const timeCopy = TIME_COPY[timeOfDay]
  const tint = TIME_TINTS[timeOfDay]
  const [vibe] = useState(() => {
    try { return localStorage.getItem('stoa-vibe') || 'universal' } catch { return 'universal' }
  })
  const displayQuote = VIBE_QUOTES[timeOfDay]?.[vibe] || timeCopy.quote
  const hour = new Date().getHours()

  // Daily seeded stats
  const stats = useMemo(() => {
    const rng = seededRandom(getDailySeed())
    return generateStats(hour, rng)
  }, [hour])

  // Pick ALL photos for the page in one pass — zero repeats, time-aware hero
  const { photos, visionItems } = useMemo(() => {
    const preferred = TIME_PHOTOS[timeOfDay]
    const heroPool = shuffle(preferred)
    const hero = heroPool[0]

    const remainingClean = shuffle(CLEAN_PHOTOS.filter(p => p !== hero))
    const text = shuffle(TEXT_PHOTOS)

    const pagePhotos = {
      hero,
      stillness: remainingClean[0],
      ritual: remainingClean[1],
      standalone2: text[0],
    }

    // Vision board: read user's saved photos from localStorage, fall back to random
    let savedPhotos = []
    let savedAffirmations = []
    try {
      const sp = localStorage.getItem('stoa-vision-photos')
      if (sp) savedPhotos = JSON.parse(sp)
      const sa = localStorage.getItem('stoa-vision-affirmations')
      if (sa) savedAffirmations = JSON.parse(sa)
    } catch {}

    const visionPhotos = savedPhotos.length > 0
      ? shuffle(savedPhotos).slice(0, 5)
      : (() => {
          const used = new Set([hero, remainingClean[0], remainingClean[1], text[0]])
          return shuffle(ALL_PHOTOS.filter(p => !used.has(p))).slice(0, 5)
        })()

    const visionTexts = savedAffirmations.length > 0
      ? shuffle(savedAffirmations).slice(0, 4)
      : [
          'I am becoming the person I was always meant to be.',
          VIBE_VISION_AFFIRMATION[vibe],
          'My peace is non-negotiable.',
          'I attract what I am, not what I want.',
        ]

    const vItems = []
    let pi = 0, ti = 0
    for (let i = 0; i < visionPhotos.length + visionTexts.length; i++) {
      if (i % 3 === 1 && ti < visionTexts.length) {
        vItems.push({ type: 'affirmation', text: visionTexts[ti++] })
      } else if (pi < visionPhotos.length) {
        vItems.push({ type: 'image', src: visionPhotos[pi++] })
      } else if (ti < visionTexts.length) {
        vItems.push({ type: 'affirmation', text: visionTexts[ti++] })
      }
    }

    return { photos: pagePhotos, visionItems: vItems }
  }, [timeOfDay, vibe])

  const [visionIdx, setVisionIdx] = useState(0)
  useEffect(() => {
    const interval = setInterval(() => {
      setVisionIdx(i => (i + 1) % visionItems.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [visionItems.length])

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

  // === Shared section renderers ===

  const heroSection = (
    <div style={{ position: 'relative', height: 320, margin: '0 16px', borderRadius: 20, overflow: 'hidden', marginTop: 8 }}>
      <img src={photos.hero} alt="" style={{
        width: '100%', height: '100%', objectFit: 'cover',
      }} />
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.35) 100%)',
      }} />
      {tint !== 'transparent' && (
        <div style={{ position: 'absolute', inset: 0, background: tint }} />
      )}
      <div style={{
        position: 'absolute', top: 48, left: 0, right: 0,
        display: 'flex', justifyContent: 'center',
      }}>
        <span style={{
          fontFamily: fonts.sans, fontSize: 13, fontWeight: 500,
          color: 'rgba(255,255,255,0.7)', letterSpacing: 6, textTransform: 'uppercase',
        }}>
          Stoa
        </span>
      </div>
      <div style={{ position: 'absolute', bottom: 28, left: 24, right: 24 }}>
        <p style={{ fontFamily: fonts.sans, fontSize: 24, fontWeight: 300, color: '#fff', marginBottom: 4 }}>
          {timeConfig.greeting}
        </p>
        <p style={{ fontFamily: fonts.sans, fontSize: 13, fontWeight: 400, color: 'rgba(255,255,255,0.5)' }}>
          {timeConfig.subtitle}
        </p>
      </div>
    </div>
  )

  const suggestionSection = (
    <div style={{ padding: '16px 20px 0' }}>
      <div onClick={() => {
        if (timeOfDay === 'afternoon') navigate('/workout/walk-breathe')
        else if (timeOfDay === 'evening') navigate('/journal')
        else navigate('/stillness')
      }} style={{
        background: colors.surface, borderRadius: 14, padding: '18px 20px',
        display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer',
        border: `1px solid ${colors.border}`,
      }}>
        <div style={{
          width: 42, height: 42, borderRadius: 12,
          background: tint !== 'transparent' ? tint : 'rgba(255,255,255,0.06)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          {timeOfDay === 'morning' && (
            <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={colors.text2} strokeWidth={1.5} strokeLinecap="round">
              <circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          )}
          {timeOfDay === 'afternoon' && (
            <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={colors.text2} strokeWidth={1.5} strokeLinecap="round">
              <path d="M13 4v4l3 3M9 20l3-6 3 6M12 4a1 1 0 100-2 1 1 0 000 2z" /><path d="M7 20h10" />
            </svg>
          )}
          {timeOfDay === 'evening' && (
            <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={colors.text2} strokeWidth={1.5} strokeLinecap="round">
              <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
            </svg>
          )}
          {timeOfDay === 'night' && (
            <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={colors.text2} strokeWidth={1.5} strokeLinecap="round">
              <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
              <path d="M3 3l1.5 1.5M21 3l-1.5 1.5M12 1v2" />
            </svg>
          )}
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontFamily: fonts.sans, fontSize: 14, fontWeight: 500, color: colors.text, marginBottom: 3 }}>
            {timeConfig.suggestion}
          </p>
          <p style={{ fontFamily: fonts.sans, fontSize: 12, color: colors.text3, lineHeight: 1.4 }}>
            {timeConfig.suggestionDesc}
          </p>
        </div>
        <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={colors.text3} strokeWidth={2} strokeLinecap="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </div>
    </div>
  )

  const statsSection = (
    <div style={{ padding: '24px 20px 0' }}>
      <p style={{
        fontFamily: fonts.sans, fontSize: 10, fontWeight: 600,
        color: colors.text3, letterSpacing: 3, textTransform: 'uppercase',
        marginBottom: 14, paddingLeft: 4,
      }}>
        {stats.header}
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
        {/* Walk */}
        <div style={{
          background: colors.surface, borderRadius: 14, padding: '18px 16px',
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
          minHeight: 120, position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={colors.text2} strokeWidth={1.5} strokeLinecap="round">
              <path d="M13 4v4l3 3M9 20l3-6 3 6M12 4a1 1 0 100-2 1 1 0 000 2z" />
              <path d="M7 20h10" />
            </svg>
            <span style={{ fontFamily: fonts.sans, fontSize: 9, fontWeight: 600, color: colors.text3, letterSpacing: 1, textTransform: 'uppercase' }}>Walk</span>
          </div>
          <div>
            <p style={{ fontFamily: fonts.sans, fontSize: 28, fontWeight: 300, color: colors.text, lineHeight: 1 }}>
              {stats.walk.value} <span style={{ fontSize: 13, color: colors.text2 }}>{stats.walk.label}</span>
            </p>
            <p style={{ fontFamily: fonts.sans, fontSize: 11, color: colors.text3, marginTop: 4 }}>{stats.walk.sub}</p>
            <StatBar value={stats.walk.value} goal={stats.walk.goal} />
          </div>
        </div>

        {/* Stillness */}
        <div style={{
          background: colors.surface, borderRadius: 14, padding: '18px 16px',
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
          minHeight: 120, position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={colors.text2} strokeWidth={1.5} strokeLinecap="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l3 3" />
            </svg>
            <span style={{ fontFamily: fonts.sans, fontSize: 9, fontWeight: 600, color: colors.text3, letterSpacing: 1, textTransform: 'uppercase' }}>Stillness</span>
          </div>
          <div>
            <p style={{ fontFamily: fonts.sans, fontSize: 28, fontWeight: 300, color: colors.text, lineHeight: 1 }}>
              {stats.stillness.value} <span style={{ fontSize: 13, color: colors.text2 }}>{stats.stillness.label}</span>
            </p>
            <p style={{ fontFamily: fonts.sans, fontSize: 11, color: colors.text3, marginTop: 4 }}>{stats.stillness.sub}</p>
            <StatBar value={stats.stillness.value} goal={stats.stillness.goal} />
          </div>
        </div>

        {/* Water */}
        <div style={{
          background: colors.surface, borderRadius: 14, padding: '18px 16px',
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
          minHeight: 120, position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={colors.text2} strokeWidth={1.5} strokeLinecap="round">
              <path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z" />
            </svg>
            <span style={{ fontFamily: fonts.sans, fontSize: 9, fontWeight: 600, color: colors.text3, letterSpacing: 1, textTransform: 'uppercase' }}>Water</span>
          </div>
          <div>
            <p style={{ fontFamily: fonts.sans, fontSize: 28, fontWeight: 300, color: colors.text, lineHeight: 1 }}>
              {stats.water.value} <span style={{ fontSize: 13, color: colors.text2 }}>{stats.water.label}</span>
            </p>
            <p style={{ fontFamily: fonts.sans, fontSize: 11, color: colors.text3, marginTop: 4 }}>{stats.water.sub}</p>
            <StatBar value={stats.water.value} goal={stats.water.goal} />
          </div>
        </div>

        {/* Sleep */}
        <div style={{
          background: colors.surface, borderRadius: 14, padding: '18px 16px',
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
          minHeight: 120, position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={colors.text2} strokeWidth={1.5} strokeLinecap="round">
              <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
            </svg>
            <span style={{ fontFamily: fonts.sans, fontSize: 9, fontWeight: 600, color: colors.text3, letterSpacing: 1, textTransform: 'uppercase' }}>Sleep</span>
          </div>
          <div>
            <p style={{ fontFamily: fonts.sans, fontSize: 28, fontWeight: 300, color: colors.text, lineHeight: 1 }}>
              {stats.sleep.value} <span style={{ fontSize: 13, color: colors.text2 }}>{stats.sleep.label}</span>
            </p>
            <p style={{ fontFamily: fonts.sans, fontSize: 11, color: colors.text3, marginTop: 4 }}>{stats.sleep.sub}</p>
            <StatBar value={parseFloat(stats.sleep.value)} goal={parseFloat(stats.sleep.goal)} />
          </div>
        </div>
      </div>
    </div>
  )

  const journalGratitudeSection = (
    <>
      {/* Journal card */}
      <div style={{ padding: '0 20px' }}>
        <div onClick={() => navigate('/journal')} style={{
          background: colors.surface, borderRadius: 14, padding: '18px 20px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          cursor: 'pointer', marginBottom: 10,
        }}>
          <div>
            <p style={{ fontFamily: fonts.sans, fontSize: 15, fontWeight: 500, color: colors.text, marginBottom: 3 }}>Open Journal</p>
            <p style={{ fontFamily: fonts.sans, fontSize: 12, color: colors.text3 }}>{timeCopy.journal}</p>
          </div>
          <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={colors.text2} strokeWidth={1.5} strokeLinecap="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </div>

        {/* Gratitude card */}
        <div onClick={() => navigate('/journal')} style={{ background: colors.surface, borderRadius: 14, padding: '18px 20px', cursor: 'pointer' }}>
          <p style={{ fontFamily: fonts.sans, fontSize: 10, fontWeight: 600, color: colors.text3, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>
            Today I'm Grateful For
          </p>
          <p style={{ fontFamily: fonts.sans, fontSize: 14, fontWeight: 300, color: colors.text2, fontStyle: 'italic' }}>
            {timeCopy.gratitude}
          </p>
        </div>
      </div>
    </>
  )

  const stillnessSection = (
    <>
      <div style={{ position: 'relative', height: 220, margin: '24px 16px 4px', borderRadius: 16, overflow: 'hidden' }}>
        <img src={photos.stillness} alt="" style={{
          width: '100%', height: '100%', objectFit: 'cover',
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.5) 100%)',
        }} />
        {tint !== 'transparent' && (
          <div style={{ position: 'absolute', inset: 0, background: tint }} />
        )}
        <div style={{ position: 'absolute', top: 20, left: 20 }}>
          <p style={{ fontFamily: fonts.sans, fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.4)', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 6 }}>
            Take a Moment
          </p>
          <p style={{ fontFamily: fonts.sans, fontSize: 18, fontWeight: 300, color: '#fff' }}>
            {timeCopy.stillness}
          </p>
        </div>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0 20px 16px' }}>
          <div style={{ height: 2, background: 'rgba(255,255,255,0.15)', borderRadius: 1, marginBottom: 12, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${Math.min((elapsed / 1800) * 100, 100)}%`, background: '#fff', transition: 'width 1s linear' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 32 }}>
            <button onClick={() => setElapsed(e => Math.max(0, e - 10))} style={{ cursor: 'pointer' }}>
              <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth={2} strokeLinecap="round">
                <path d="M1 4v6h6" /><path d="M3.51 15a9 9 0 102.13-9.36L1 10" />
              </svg>
            </button>
            <button onClick={() => setPlaying(!playing)} style={{
              width: 42, height: 42, borderRadius: 21,
              border: '1px solid rgba(255,255,255,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            }}>
              {playing ? (
                <svg width={14} height={14} viewBox="0 0 24 24" fill="#fff">
                  <rect x="6" y="4" width="4" height="16" rx="1" />
                  <rect x="14" y="4" width="4" height="16" rx="1" />
                </svg>
              ) : (
                <svg width={14} height={14} viewBox="0 0 24 24" fill="#fff">
                  <polygon points="6 3 20 12 6 21" />
                </svg>
              )}
            </button>
            <button onClick={() => setElapsed(e => e + 10)} style={{ cursor: 'pointer' }}>
              <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth={2} strokeLinecap="round">
                <path d="M23 4v6h-6" /><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10" />
              </svg>
            </button>
            <span style={{ position: 'absolute', right: 20, fontFamily: fonts.sans, fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>
              {fmt(elapsed)}
            </span>
          </div>
        </div>
      </div>

      <div style={{ padding: '12px 20px 0' }}>
        <button onClick={() => navigate('/stillness')} style={{
          width: '100%', fontFamily: fonts.sans, fontSize: 13, fontWeight: 600,
          letterSpacing: 1, color: '#fff',
          background: 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: radius.pill, padding: '15px 0', cursor: 'pointer',
        }}>
          Record Stillness
        </button>
      </div>
    </>
  )

  const calmButton = (
    <div style={{ padding: '28px 24px' }}>
      <button onClick={() => navigate('/stillness')} style={{
        width: '100%', fontFamily: fonts.sans, fontSize: 12, fontWeight: 600,
        letterSpacing: 2, textTransform: 'uppercase',
        color: colors.bg, background: '#fff',
        borderRadius: radius.pill, padding: '18px 0', cursor: 'pointer',
      }}>
        I Need Calm Now
      </button>
    </div>
  )

  // === Time-based section ordering ===
  // Top sections shift; bottom half (standalone1, weekly, ritual, team, playlists, watch, vision, movement, groups, standalone2) stays fixed
  const getTimeSections = () => {
    if (timeOfDay === 'night') {
      return [
        heroSection,
        statsSection,
        stillnessSection,
        suggestionSection,
        calmButton,
        journalGratitudeSection,
      ]
    }
    if (timeOfDay === 'evening') {
      return [
        heroSection,
        suggestionSection,
        journalGratitudeSection,
        statsSection,
        stillnessSection,
      ]
    }
    // morning + afternoon
    return [
      heroSection,
      suggestionSection,
      statsSection,
      journalGratitudeSection,
      stillnessSection,
    ]
  }

  const timeSections = getTimeSections()

  return (
    <div style={{
      height: '100%',
      overflowY: 'auto',
      background: colors.bg,
      paddingBottom: 160,
    }}>

      {/* ========== TIME-ORDERED TOP SECTIONS ========== */}
      {timeSections.map((section, i) => (
        <div key={i}>{section}</div>
      ))}

      {/* ========== NOTE FROM THE UNIVERSE ========== */}
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
          "{pickNote(0)}"
        </p>
      </div>

      {/* ========== WEEKLY OVERVIEW ========== */}
      <div style={{ padding: '24px 20px 0' }}>
        <p style={{
          fontFamily: fonts.sans, fontSize: 10, fontWeight: 600,
          color: colors.text3, letterSpacing: 3, textTransform: 'uppercase',
          marginBottom: 14, paddingLeft: 4,
        }}>
          This Week
        </p>
        <div style={{ background: colors.surface, borderRadius: 14, padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', height: 80, marginBottom: 12, padding: '0 4px' }}>
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => {
              const heights = [60, 80, 45, 70, 90, 55, 30]
              const isToday = i === new Date().getDay() - 1
              return (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flex: 1 }}>
                  <div style={{
                    width: 6, borderRadius: 3, height: `${heights[i]}%`,
                    background: isToday ? '#fff' : 'rgba(255,255,255,0.15)',
                    transition: 'all 0.3s ease',
                  }} />
                  <span style={{ fontFamily: fonts.sans, fontSize: 10, color: isToday ? '#fff' : colors.text3, fontWeight: isToday ? 600 : 400 }}>{day}</span>
                </div>
              )
            })}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
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

      {/* ========== DAILY RITUAL — text overlay on clean photo ========== */}
      <div style={{ position: 'relative', margin: '24px 16px 4px', borderRadius: 16, overflow: 'hidden', height: 200 }}>
        <img src={photos.ritual} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.25)' }} />
        <div style={{ position: 'absolute', bottom: 24, left: 0, right: 0, textAlign: 'center' }}>
          <p style={{ fontFamily: fonts.sans, fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.5)', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 6 }}>
            Daily Ritual
          </p>
          <p style={{ fontFamily: fonts.sans, fontSize: 15, fontWeight: 300, color: '#fff', letterSpacing: 0.5 }}>
            Gratitude. Intention. Affirmation.
          </p>
        </div>
      </div>

      {/* ========== MY TEAM ========== */}
      <div style={{ padding: '24px 20px 0' }}>
        <div style={{
          background: colors.surface, borderRadius: 16, padding: '28px 24px', textAlign: 'center',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: 60, background: 'rgba(255,255,255,0.02)' }} />
          <p style={{ fontFamily: fonts.sans, fontSize: 10, fontWeight: 600, color: colors.text3, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 10 }}>
            My Wellness Team
          </p>
          <p style={{ fontFamily: fonts.sans, fontSize: 16, fontWeight: 300, color: colors.text2, lineHeight: 1.6, marginBottom: 16 }}>
            Your trainer. Your therapist.<br />Your meditation guide. One place.
          </p>
          <button style={{
            fontFamily: fonts.sans, fontSize: 11, fontWeight: 600, color: '#fff',
            background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: radius.pill, padding: '10px 22px', cursor: 'pointer', letterSpacing: 0.5,
          }}>
            Coming Soon
          </button>
        </div>
      </div>

      {/* ========== PLAYLISTS — compact list rows ========== */}
      <div style={{ padding: '24px 20px 0' }}>
        <p style={{ fontFamily: fonts.sans, fontSize: 10, fontWeight: 600, color: colors.text3, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 14 }}>Playlists</p>
        <div style={{ background: colors.surface, borderRadius: 14, overflow: 'hidden' }}>
          {[
            { title: 'Morning Ritual', curator: 'Sarah M.', tracks: 12, accent: '#4a6741', slug: 'morning-ritual' },
            { title: 'Deep Focus', curator: 'Amara J.', tracks: 18, accent: '#5c5040', slug: 'deep-focus' },
            { title: 'Wind Down', curator: 'Nadia C.', tracks: 9, accent: '#4a4060', slug: 'wind-down' },
            { title: 'Movement Energy', curator: 'Sarah M.', tracks: 15, accent: '#604040', slug: 'movement-energy' },
          ].map((pl, i, arr) => (
            <div key={i} onClick={() => navigate(`/playlist/${pl.slug}`)} style={{
              padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14,
              borderBottom: i < arr.length - 1 ? `1px solid ${colors.border}` : 'none',
              cursor: 'pointer',
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: 8,
                background: pl.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth={1.5}>
                  <path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" />
                </svg>
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontFamily: fonts.sans, fontSize: 14, fontWeight: 500, color: colors.text, marginBottom: 2 }}>{pl.title}</p>
                <p style={{ fontFamily: fonts.sans, fontSize: 11, color: colors.text3 }}>{pl.curator} &middot; {pl.tracks} tracks</p>
              </div>
              <svg width={14} height={14} viewBox="0 0 24 24" fill="rgba(255,255,255,0.3)"><polygon points="6 3 20 12 6 21" /></svg>
            </div>
          ))}
        </div>
      </div>

      {/* ========== WATCH — wider video cards ========== */}
      <div style={{ padding: '24px 0 0' }}>
        <div style={{ padding: '0 24px', marginBottom: 14 }}>
          <p style={{ fontFamily: fonts.sans, fontSize: 10, fontWeight: 600, color: colors.text3, letterSpacing: 3, textTransform: 'uppercase' }}>Watch</p>
        </div>
        <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingLeft: 24, paddingRight: 24, paddingBottom: 4 }}>
          {[
            { title: 'Morning Breathwork', by: 'Amara J.', duration: '12 min' },
            { title: 'Guided Visualization', by: 'Nadia C.', duration: '20 min' },
            { title: 'Gratitude Practice', by: 'Sarah M.', duration: '8 min' },
          ].map((vid, i) => (
            <div key={i} style={{ minWidth: 260, borderRadius: 14, overflow: 'hidden', background: colors.surface, cursor: 'pointer', flexShrink: 0 }}>
              <div style={{ height: 140, background: `linear-gradient(135deg, #1a1a1a 0%, #252520 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                <div style={{ width: 48, height: 48, borderRadius: 24, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width={16} height={16} viewBox="0 0 24 24" fill="#fff"><polygon points="6 3 20 12 6 21" /></svg>
                </div>
                <span style={{ position: 'absolute', bottom: 10, right: 12, fontFamily: fonts.sans, fontSize: 11, color: 'rgba(255,255,255,0.5)', background: 'rgba(0,0,0,0.4)', padding: '2px 8px', borderRadius: 6 }}>{vid.duration}</span>
              </div>
              <div style={{ padding: '14px 16px 16px' }}>
                <p style={{ fontFamily: fonts.sans, fontSize: 14, fontWeight: 600, color: colors.text, marginBottom: 3 }}>{vid.title}</p>
                <p style={{ fontFamily: fonts.sans, fontSize: 11, color: colors.text3 }}>{vid.by}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========== VISION BOARD ========== */}
      <div style={{ padding: '24px 0 0' }}>
        <div style={{ padding: '0 24px', marginBottom: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <p style={{ fontFamily: fonts.sans, fontSize: 10, fontWeight: 600, color: colors.text3, letterSpacing: 3, textTransform: 'uppercase' }}>Vision Board</p>
          <span onClick={() => navigate('/vision')} style={{ fontFamily: fonts.sans, fontSize: 11, fontWeight: 500, color: colors.text3, cursor: 'pointer' }}>Open</span>
        </div>
        <div style={{ position: 'relative', height: 280, margin: '0 16px', borderRadius: 16, overflow: 'hidden' }}>
          {visionItems.map((item, i) => (
            <div key={i} style={{ position: 'absolute', inset: 0, opacity: i === visionIdx ? 1 : 0, transition: 'opacity 1.2s ease-in-out' }}>
              {item.type === 'image' ? (
                <img src={item.src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '100%', height: '100%', background: colors.surface, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 32px' }}>
                  <p style={{ fontFamily: fonts.sans, fontSize: 18, fontWeight: 300, color: colors.text, lineHeight: 1.7, textAlign: 'center', letterSpacing: 0.3 }}>
                    "{item.text}"
                  </p>
                </div>
              )}
            </div>
          ))}
          <div style={{ position: 'absolute', bottom: 14, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 6, zIndex: 2 }}>
            {visionItems.map((_, i) => (
              <div key={i} onClick={() => setVisionIdx(i)} style={{
                width: i === visionIdx ? 16 : 5, height: 5, borderRadius: 3,
                background: i === visionIdx ? '#fff' : 'rgba(255,255,255,0.3)',
                transition: 'all 0.4s ease', cursor: 'pointer',
              }} />
            ))}
          </div>
        </div>
        <div style={{ padding: '12px 20px 0', display: 'flex', justifyContent: 'center' }}>
          <button onClick={() => navigate('/vision')} style={{
            fontFamily: fonts.sans, fontSize: 11, fontWeight: 500, color: colors.text3,
            background: 'none', cursor: 'pointer', padding: '8px 16px',
            border: `1px solid ${colors.border}`, borderRadius: radius.pill,
          }}>
            Choose Photos
          </button>
        </div>
      </div>

      {/* ========== MOVEMENT — class cards with type badge ========== */}
      <div style={{ padding: '24px 0 0' }}>
        <div style={{ padding: '0 24px', marginBottom: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <p style={{ fontFamily: fonts.sans, fontSize: 10, fontWeight: 600, color: colors.text3, letterSpacing: 3, textTransform: 'uppercase' }}>Movement</p>
          <span style={{ fontFamily: fonts.sans, fontSize: 11, fontWeight: 500, color: colors.text3, cursor: 'pointer' }}>See All</span>
        </div>
        <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingLeft: 24, paddingRight: 24, paddingBottom: 4 }}>
          {[
            { title: 'Morning Flow', type: 'Yoga', duration: '25 min', instructor: 'Sarah M.', slug: 'morning-flow' },
            { title: 'Sculpt & Tone', type: 'Pilates', duration: '30 min', instructor: 'Nadia C.', slug: 'sculpt-tone' },
            { title: 'Walk + Breathe', type: 'Walking', duration: '20 min', instructor: 'Amara J.', slug: 'walk-breathe' },
            { title: 'Full Body Strength', type: 'Strength', duration: '35 min', instructor: 'Sarah M.', slug: 'full-body' },
            { title: 'Stretch & Release', type: 'Recovery', duration: '15 min', instructor: 'Nadia C.', slug: 'stretch-release' },
          ].map((w, i) => (
            <div key={i} onClick={() => navigate(`/workout/${w.slug}`)} style={{
              minWidth: 140, borderRadius: 14, overflow: 'hidden',
              background: colors.surface, cursor: 'pointer', flexShrink: 0,
              border: `1px solid ${colors.border}`,
              padding: '18px 16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
              minHeight: 140,
            }}>
              <div>
                <span style={{
                  fontFamily: fonts.sans, fontSize: 9, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase',
                  color: colors.text3, background: 'rgba(255,255,255,0.06)', padding: '4px 8px', borderRadius: 6,
                  display: 'inline-block', marginBottom: 12,
                }}>
                  {w.type}
                </span>
                <p style={{ fontFamily: fonts.sans, fontSize: 15, fontWeight: 600, color: '#fff', lineHeight: 1.3 }}>{w.title}</p>
              </div>
              <div>
                <p style={{ fontFamily: fonts.sans, fontSize: 10, color: colors.text3, marginTop: 10 }}>{w.instructor}</p>
                <p style={{ fontFamily: fonts.sans, fontSize: 10, color: colors.text3 }}>{w.duration}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========== GROUPS ========== */}
      <div style={{ padding: '24px 0 0' }}>
        <div style={{ padding: '0 24px', marginBottom: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <p style={{ fontFamily: fonts.sans, fontSize: 10, fontWeight: 600, color: colors.text3, letterSpacing: 3, textTransform: 'uppercase' }}>Groups</p>
          <span style={{ fontFamily: fonts.sans, fontSize: 11, fontWeight: 500, color: colors.text3, cursor: 'pointer' }}>See All</span>
        </div>
        <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingLeft: 24, paddingRight: 24, paddingBottom: 4 }}>
          {[
            { name: 'Morning Ritual Circle', members: 248 },
            { name: 'Manifestation Lab', members: 412 },
            { name: 'Pilates Sisters', members: 186 },
            { name: 'Book of the Month', members: 324 },
          ].map((group, i) => (
            <div key={i} style={{ minWidth: 150, height: 90, borderRadius: 14, background: colors.surface, padding: '14px 16px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', cursor: 'pointer', flexShrink: 0 }}>
              <p style={{ fontFamily: fonts.sans, fontSize: 13, fontWeight: 600, color: '#fff', lineHeight: 1.3, marginBottom: 4 }}>{group.name}</p>
              <p style={{ fontFamily: fonts.sans, fontSize: 10, color: colors.text3 }}>{group.members} members</p>
            </div>
          ))}
          <div style={{ minWidth: 100, height: 90, borderRadius: 14, border: `1px dashed ${colors.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
            <div style={{ textAlign: 'center' }}>
              <span style={{ fontFamily: fonts.sans, fontSize: 20, color: colors.text3 }}>+</span>
              <span style={{ fontFamily: fonts.sans, fontSize: 10, color: colors.text3, display: 'block' }}>Create</span>
            </div>
          </div>
        </div>
      </div>

      {/* ========== STANDALONE PHOTO 2 (has its own text — show full image) ========== */}
      <div style={{ margin: '24px 16px 4px', borderRadius: 16, overflow: 'hidden', height: 240, background: '#111' }}>
        <img src={photos.standalone2} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
      </div>

      {/* ========== I NEED CALM NOW (only if not already placed by night layout) ========== */}
      {timeOfDay !== 'night' && calmButton}

      {/* ========== INSIGHT ========== */}
      <div style={{ padding: '0 32px 32px', textAlign: 'center' }}>
        <p style={{ fontFamily: fonts.sans, fontSize: 14, fontWeight: 300, color: colors.text2, lineHeight: 1.8, letterSpacing: 0.3 }}>
          {displayQuote}
        </p>
      </div>
    </div>
  )
}
