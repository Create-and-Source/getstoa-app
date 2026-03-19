import { useState, useEffect, useMemo } from 'react'
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

  // Water tracking — real, tappable
  const todayKey = new Date().toISOString().split('T')[0]
  const [waterCount, setWaterCount] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('stoa-water') || '{}')
      return stored[todayKey] || 0
    } catch { return 0 }
  })

  function addWater() {
    setWaterCount(prev => {
      const next = Math.min(prev + 1, 12)
      try {
        const stored = JSON.parse(localStorage.getItem('stoa-water') || '{}')
        stored[todayKey] = next
        localStorage.setItem('stoa-water', JSON.stringify(stored))
      } catch {}
      return next
    })
  }

  function removeWater() {
    setWaterCount(prev => {
      const next = Math.max(prev - 1, 0)
      try {
        const stored = JSON.parse(localStorage.getItem('stoa-water') || '{}')
        stored[todayKey] = next
        localStorage.setItem('stoa-water', JSON.stringify(stored))
      } catch {}
      return next
    })
  }

  // Mood check-in
  const MOODS = [
    { emoji: '✨', label: 'Amazing', value: 5 },
    { emoji: '😊', label: 'Good', value: 4 },
    { emoji: '😌', label: 'Okay', value: 3 },
    { emoji: '😔', label: 'Low', value: 2 },
    { emoji: '😣', label: 'Rough', value: 1 },
  ]

  const [todayMood, setTodayMood] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('stoa-moods') || '{}')
      return stored[todayKey] || null
    } catch { return null }
  })

  function setMood(mood) {
    setTodayMood(mood)
    try {
      const stored = JSON.parse(localStorage.getItem('stoa-moods') || '{}')
      stored[todayKey] = mood
      localStorage.setItem('stoa-moods', JSON.stringify(stored))
    } catch {}
  }

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
  const [gratitudeText, setGratitudeText] = useState('')
  const [gratitudeSaved, setGratitudeSaved] = useState(false)

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

  // Ritual system
  const RITUAL_CATALOG = {
    morning: [
      { slug: 'gratitude-journal', title: 'Gratitude Journal', desc: 'Write 3 things you\'re grateful for', duration: 5 },
      { slug: 'morning-breathwork', title: 'Morning Breathwork', desc: 'Box breathing to center your energy', duration: 10 },
      { slug: 'intention-setting', title: 'Intention Setting', desc: 'Choose your focus for the day', duration: 3 },
      { slug: 'morning-movement', title: 'Morning Movement', desc: 'Gentle yoga or stretching flow', duration: 15 },
      { slug: 'hydration-ritual', title: 'Hydration Ritual', desc: 'Warm lemon water + mindful sipping', duration: 5 },
      { slug: 'morning-pages', title: 'Morning Pages', desc: 'Stream of consciousness writing', duration: 20 },
    ],
    afternoon: [
      { slug: 'mindful-walk', title: 'Mindful Walk', desc: 'Step outside, no phone, breathe', duration: 15 },
      { slug: 'body-checkin', title: 'Body Check-In', desc: 'Scan for tension, breathe into it', duration: 5 },
      { slug: 'gratitude-pause', title: 'Gratitude Pause', desc: 'Name 3 good things about today so far', duration: 3 },
      { slug: 'nourishment-break', title: 'Nourishment Break', desc: 'Eat slowly, taste everything', duration: 15 },
      { slug: 'stillness-reset', title: 'Stillness Reset', desc: 'Close your eyes, just breathe', duration: 10 },
    ],
    night: [
      { slug: 'evening-reflection', title: 'Evening Reflection', desc: 'What went well? What did I learn?', duration: 10 },
      { slug: 'digital-sunset', title: 'Digital Sunset', desc: 'All screens off, dim the lights', duration: 5 },
      { slug: 'body-scan', title: 'Body Scan', desc: 'Release tension from head to toe', duration: 15 },
      { slug: 'gratitude-close', title: 'Gratitude Close', desc: '3 things from today I\'m grateful for', duration: 5 },
      { slug: 'sleep-story', title: 'Sleep Story', desc: 'Drift off with a guided narrative', duration: 25 },
      { slug: 'tomorrows-intention', title: 'Tomorrow\'s Intention', desc: 'Set one focus for tomorrow', duration: 3 },
    ],
  }

  const ritualTimeKey = timeOfDay === 'evening' ? 'night' : timeOfDay
  const ritualTimeLabel = timeOfDay === 'evening' || timeOfDay === 'night' ? 'Evening' : timeOfDay === 'morning' ? 'Morning' : 'Afternoon'

  const [savedRituals, setSavedRituals] = useState(() => {
    try {
      const stored = localStorage.getItem('stoa-rituals')
      return stored ? JSON.parse(stored) : { morning: [], afternoon: [], night: [] }
    } catch { return { morning: [], afternoon: [], night: [] } }
  })

  // Read today's completions from localStorage
  const todayStr = new Date().toISOString().split('T')[0]
  const [completions] = useState(() => {
    try {
      const stored = localStorage.getItem('stoa-ritual-completions')
      const all = stored ? JSON.parse(stored) : {}
      return all[todayStr] || []
    } catch { return [] }
  })

  const currentRitualSlugs = savedRituals[ritualTimeKey] || []
  const currentRituals = currentRitualSlugs
    .map(slug => RITUAL_CATALOG[ritualTimeKey]?.find(r => r.slug === slug))
    .filter(Boolean)

  const suggestionSection = currentRituals.length > 0 ? (
    <div style={{ padding: '16px 20px 0' }}>
      <div style={{
        background: colors.surface, borderRadius: 14, padding: '18px 20px',
        border: `1px solid ${colors.border}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <p style={{ fontFamily: fonts.sans, fontSize: 14, fontWeight: 500, color: colors.text }}>
            Your {ritualTimeLabel} Ritual
          </p>
          <p onClick={() => navigate('/rituals')} style={{ fontFamily: fonts.sans, fontSize: 11, color: colors.text3, cursor: 'pointer' }}>
            Edit
          </p>
        </div>
        {currentRituals.map(r => {
          const done = completions.includes(r.slug)
          return (
            <div key={r.slug} onClick={() => !done && navigate(`/ritual/${r.slug}`)} style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0',
              borderTop: `1px solid ${colors.border}`, cursor: done ? 'default' : 'pointer',
            }}>
              <div style={{
                width: 22, height: 22, borderRadius: 6,
                border: done ? 'none' : '1.5px solid rgba(255,255,255,0.25)',
                background: done ? 'rgba(255,255,255,0.15)' : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                {done && (
                  <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{
                  fontFamily: fonts.sans, fontSize: 13, fontWeight: 500, color: colors.text,
                  opacity: done ? 0.4 : 1,
                }}>
                  {r.title}
                </p>
              </div>
              {done ? (
                <p style={{ fontFamily: fonts.sans, fontSize: 10, color: colors.text3 }}>Done</p>
              ) : (
                <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={colors.text3} strokeWidth={2} strokeLinecap="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              )}
            </div>
          )
        })}
      </div>
    </div>
  ) : (
    <div style={{ padding: '16px 20px 0' }}>
      <div onClick={() => navigate('/rituals')} style={{
        background: colors.surface, borderRadius: 14, padding: '18px 20px',
        display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer',
        border: `1px solid ${colors.border}`,
      }}>
        <div style={{
          width: 42, height: 42, borderRadius: 12,
          background: tint !== 'transparent' ? tint : 'rgba(255,255,255,0.06)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={colors.text2} strokeWidth={1.5} strokeLinecap="round">
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" />
          </svg>
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontFamily: fonts.sans, fontSize: 14, fontWeight: 500, color: colors.text, marginBottom: 3 }}>
            Set up your {ritualTimeLabel.toLowerCase()} ritual
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

        {/* Water — tappable */}
        <div onClick={addWater} style={{
          background: colors.surface, borderRadius: 14, padding: '18px 16px',
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
          minHeight: 120, position: 'relative', overflow: 'hidden', cursor: 'pointer',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={colors.text2} strokeWidth={1.5} strokeLinecap="round">
              <path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z" />
            </svg>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {waterCount > 0 && (
                <span onClick={(e) => { e.stopPropagation(); removeWater() }} style={{
                  fontFamily: fonts.sans, fontSize: 14, color: colors.text3, cursor: 'pointer', padding: '0 4px',
                }}>−</span>
              )}
              <span style={{ fontFamily: fonts.sans, fontSize: 9, fontWeight: 600, color: colors.text3, letterSpacing: 1, textTransform: 'uppercase' }}>Water</span>
            </div>
          </div>
          <div>
            <p style={{ fontFamily: fonts.sans, fontSize: 28, fontWeight: 300, color: colors.text, lineHeight: 1 }}>
              {waterCount} <span style={{ fontSize: 13, color: colors.text2 }}>of 8</span>
            </p>
            <p style={{ fontFamily: fonts.sans, fontSize: 11, color: colors.text3, marginTop: 4 }}>
              {waterCount >= 8 ? 'goal reached!' : 'tap to add a glass'}
            </p>
            <StatBar value={waterCount} goal={8} />
          </div>
          {/* Water fill dots */}
          <div style={{ display: 'flex', gap: 3, marginTop: 8 }}>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} style={{
                width: 6, height: 6, borderRadius: 3,
                background: i < waterCount ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.08)',
                transition: 'background 0.2s',
              }} />
            ))}
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

        {/* Gratitude card — fillable */}
        <div style={{ background: colors.surface, borderRadius: 14, padding: '18px 20px' }}>
          <p style={{ fontFamily: fonts.sans, fontSize: 10, fontWeight: 600, color: colors.text3, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 10 }}>
            Today I'm Grateful For
          </p>
          {gratitudeSaved ? (
            <div>
              <p style={{ fontFamily: fonts.sans, fontSize: 14, fontWeight: 300, color: colors.text, lineHeight: 1.6, marginBottom: 10 }}>
                {gratitudeText}
              </p>
              <p style={{ fontFamily: fonts.sans, fontSize: 11, color: colors.text3 }}>
                Saved — {new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
              </p>
            </div>
          ) : (
            <div>
              <textarea
                value={gratitudeText}
                onChange={(e) => setGratitudeText(e.target.value)}
                placeholder={timeCopy.gratitude}
                rows={3}
                style={{
                  width: '100%', fontFamily: fonts.sans, fontSize: 14, fontWeight: 300,
                  color: colors.text, background: 'rgba(255,255,255,0.04)',
                  border: `1px solid ${colors.border}`, borderRadius: 10,
                  padding: '12px 14px', resize: 'none', outline: 'none',
                  lineHeight: 1.6, marginBottom: 12,
                }}
              />
              <button
                onClick={() => { if (gratitudeText.trim()) setGratitudeSaved(true) }}
                style={{
                  width: '100%', fontFamily: fonts.sans, fontSize: 13, fontWeight: 600,
                  color: gratitudeText.trim() ? colors.bg : colors.text3,
                  background: gratitudeText.trim() ? '#fff' : 'rgba(255,255,255,0.06)',
                  border: 'none', borderRadius: radius.pill,
                  padding: '13px 0', cursor: gratitudeText.trim() ? 'pointer' : 'default',
                  transition: 'all 0.2s',
                }}
              >
                Save Gratitude
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  )

  const stillnessSection = (
    <>
      <div onClick={() => navigate('/stillness')} style={{ position: 'relative', height: 220, margin: '24px 16px 4px', borderRadius: 16, overflow: 'hidden', cursor: 'pointer' }}>
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
        <div style={{ position: 'absolute', bottom: 20, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
          <div style={{
            width: 48, height: 48, borderRadius: 24,
            border: '1px solid rgba(255,255,255,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width={16} height={16} viewBox="0 0 24 24" fill="#fff">
              <polygon points="6 3 20 12 6 21" />
            </svg>
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
        color: '#fff', background: 'rgba(255,255,255,0.12)',
        border: '1px solid rgba(255,255,255,0.25)',
        boxShadow: '0 0 20px rgba(255,255,255,0.08), 0 0 40px rgba(255,255,255,0.04)',
        borderRadius: radius.pill, padding: '18px 0', cursor: 'pointer',
      }}>
        I Need Calm Now
      </button>
    </div>
  )

  // Mood check-in section
  const moodSection = (
    <div style={{ padding: '20px 20px 0' }}>
      <div style={{
        background: colors.surface, borderRadius: 14, padding: '18px 20px',
        border: `1px solid ${colors.border}`,
      }}>
        {!todayMood ? (
          <>
            <p style={{ fontFamily: fonts.sans, fontSize: 14, fontWeight: 500, color: colors.text, marginBottom: 14 }}>
              How are you feeling?
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              {MOODS.map(m => (
                <div key={m.value} onClick={() => setMood(m)} style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                  cursor: 'pointer', padding: '8px 4px', borderRadius: 12,
                  flex: 1,
                }}>
                  <span style={{ fontSize: 24 }}>{m.emoji}</span>
                  <span style={{ fontFamily: fonts.sans, fontSize: 10, color: colors.text3 }}>{m.label}</span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 28 }}>{todayMood.emoji}</span>
              <div>
                <p style={{ fontFamily: fonts.sans, fontSize: 14, fontWeight: 500, color: colors.text }}>
                  Feeling {todayMood.label.toLowerCase()}
                </p>
                <p style={{ fontFamily: fonts.sans, fontSize: 11, color: colors.text3, marginTop: 2 }}>
                  Today's check-in
                </p>
              </div>
            </div>
            <p onClick={() => setMood(null)} style={{ fontFamily: fonts.sans, fontSize: 11, color: colors.text3, cursor: 'pointer' }}>
              Change
            </p>
          </div>
        )}
      </div>
    </div>
  )

  // === Time-based section ordering ===
  // Top sections shift; bottom half (standalone1, weekly, ritual, team, playlists, watch, vision, movement, groups, standalone2) stays fixed
  const getTimeSections = () => {
    if (timeOfDay === 'night') {
      return [
        heroSection,
        moodSection,
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
        moodSection,
        suggestionSection,
        journalGratitudeSection,
        statsSection,
        stillnessSection,
      ]
    }
    // morning + afternoon
    return [
      heroSection,
      moodSection,
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
      <div onClick={() => navigate('/rituals')} style={{ position: 'relative', margin: '24px 16px 4px', borderRadius: 16, overflow: 'hidden', height: 200, cursor: 'pointer' }}>
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
