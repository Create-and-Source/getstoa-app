import { useState, useMemo } from 'react'
import { colors, fonts, radius } from '../theme'

// --- Seeded random ---
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

// --- Calendar helpers ---
function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfWeek(year, month) {
  return new Date(year, month, 1).getDay()
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

// --- Section label style ---
const sectionLabel = {
  fontFamily: fonts.sans, fontSize: 10, fontWeight: 600,
  color: colors.text3, letterSpacing: 3, textTransform: 'uppercase',
  marginBottom: 14,
}

const DEFAULT_WHEEL = [
  { label: 'Health', score: 7 },
  { label: 'Mind', score: 5 },
  { label: 'Finances', score: 4 },
  { label: 'Relationships', score: 8 },
  { label: 'Spiritual', score: 6 },
  { label: 'Career', score: 5 },
  { label: 'Experiences', score: 3 },
]

const DEFAULT_MANIFESTATIONS = [
  { intention: 'Feel strong and confident in my body', status: 'in progress' },
  { intention: 'Find a meditation practice that sticks', status: 'received' },
  { intention: 'Wake up excited about my life', status: 'in progress' },
]

function loadWheel() {
  try {
    const stored = localStorage.getItem('stoa-life-wheel')
    if (stored) return JSON.parse(stored)
  } catch {}
  return DEFAULT_WHEEL
}

function loadManifestations() {
  try {
    const stored = localStorage.getItem('stoa-manifestations')
    if (stored) return JSON.parse(stored)
  } catch {}
  return DEFAULT_MANIFESTATIONS
}

const NEURAL_PATHWAYS = [
  { name: 'Morning meditation', days: 34 },
  { name: 'Journaling', days: 12 },
  { name: 'Water intake', days: 68 },
]

function getMilestoneText(days) {
  if (days >= 90) return 'Rewired — this is who you are now'
  if (days >= 66) return 'Almost automatic — day 66 milestone reached'
  if (days >= 21) return 'Day 21 passed — the pathway is forming'
  if (days >= 10) return 'Building momentum'
  return 'Just getting started'
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

// --- Activity Ring component ---
function ActivityRing({ size, strokeWidth, progress, color, children }) {
  const r = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * r
  const offset = circumference - Math.min(progress, 1) * circumference
  return (
    <g>
      <circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none"
        stroke="rgba(255,255,255,0.06)"
        strokeWidth={strokeWidth}
      />
      <circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: 'stroke-dashoffset 0.6s ease' }}
      />
      {children}
    </g>
  )
}

export default function Progress() {
  const now = new Date()
  const hour = now.getHours()
  const today = now.getDate()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()

  // --- Daily seeded data ---
  const dailyData = useMemo(() => {
    const rng = seededRandom(getDailySeed())

    // Activity rings — scale by time of day
    const dayProgress = Math.min(hour / 22, 1)
    const movementMin = Math.round((18 + rng() * 14) * dayProgress)
    const stillnessMin = Math.round((10 + rng() * 12) * dayProgress)
    const waterGlasses = Math.round((4 + rng() * 5) * dayProgress)

    // Streak calendar — generate active days for the month
    const daysInMonth = getDaysInMonth(currentYear, currentMonth)
    const activeDays = new Set()
    for (let d = 1; d <= Math.min(today, daysInMonth); d++) {
      const dayRng = seededRandom(getDailySeed() + d * 7)
      if (dayRng() < 0.7) activeDays.add(d)
    }
    // Today is always active if past 8am
    if (hour >= 8) activeDays.add(today)

    // Current streak — count consecutive days ending at today
    let streak = 0
    for (let d = today; d >= 1; d--) {
      if (activeDays.has(d)) streak++
      else break
    }

    // Weekly stats
    const weekMovement = (3.2 + rng() * 2.5).toFixed(1)
    const weekStillness = Math.round(70 + rng() * 60)
    const weekJournals = Math.round(3 + rng() * 5)
    const weekWater = (5.5 + rng() * 2.5).toFixed(1)
    const weekMovementChange = Math.round(-8 + rng() * 30)
    const weekStillnessChange = Math.round(-10 + rng() * 25)

    // Monthly stats
    const monthMovement = (12 + rng() * 10).toFixed(1)
    const monthStillness = Math.round(250 + rng() * 200)
    const monthJournals = Math.round(12 + rng() * 12)
    const monthWater = (6.0 + rng() * 2).toFixed(1)
    const monthMovementChange = Math.round(-5 + rng() * 20)
    const monthStillnessChange = Math.round(-5 + rng() * 20)

    // Personal records
    const longestStreak = Math.round(28 + rng() * 20)
    const mostStillness = Math.round(35 + rng() * 25)
    const monthJournalEntries = Math.round(14 + rng() * 10)

    return {
      movementMin, stillnessMin, waterGlasses,
      activeDays, streak,
      weekMovement, weekStillness, weekJournals, weekWater,
      weekMovementChange, weekStillnessChange,
      monthMovement, monthStillness, monthJournals, monthWater,
      monthMovementChange, monthStillnessChange,
      longestStreak, mostStillness, monthJournalEntries,
    }
  }, [hour, today, currentMonth, currentYear])

  const daysInMonth = getDaysInMonth(currentYear, currentMonth)
  const firstDay = getFirstDayOfWeek(currentYear, currentMonth)

  // Real water data
  const todayWaterKey = now.toISOString().split('T')[0]
  const realWater = (() => {
    try {
      const stored = JSON.parse(localStorage.getItem('stoa-water') || '{}')
      return stored[todayWaterKey] || 0
    } catch { return 0 }
  })()

  const [wheelCategories, setWheelCategories] = useState(loadWheel)
  const [manifestations, setManifestations] = useState(loadManifestations)
  const [newIntention, setNewIntention] = useState('')

  function updateWheelScore(index, delta) {
    setWheelCategories(prev => {
      const next = prev.map((c, i) => i === index ? { ...c, score: Math.max(1, Math.min(10, c.score + delta)) } : c)
      localStorage.setItem('stoa-life-wheel', JSON.stringify(next))
      return next
    })
  }

  function toggleManifestationStatus(index) {
    setManifestations(prev => {
      const next = prev.map((m, i) => i === index ? { ...m, status: m.status === 'received' ? 'in progress' : 'received' } : m)
      localStorage.setItem('stoa-manifestations', JSON.stringify(next))
      return next
    })
  }

  function addManifestation() {
    if (!newIntention.trim()) return
    setManifestations(prev => {
      const next = [...prev, { intention: newIntention.trim(), status: 'in progress' }]
      localStorage.setItem('stoa-manifestations', JSON.stringify(next))
      return next
    })
    setNewIntention('')
  }

  const ringSize = 180

  return (
    <div style={{
      height: '100%',
      overflowY: 'auto',
      paddingBottom: 160,
      background: colors.bg,
    }}>
      {/* Header */}
      <div style={{ padding: '60px 24px 0' }}>
        <p style={{
          fontFamily: fonts.sans, fontSize: 10, fontWeight: 600,
          color: colors.text3, letterSpacing: 3, textTransform: 'uppercase',
          marginBottom: 4,
        }}>
          Your journey
        </p>
        <h1 style={{
          fontFamily: fonts.sans, fontSize: 28, fontWeight: 300,
          color: colors.text, lineHeight: 1.2, marginBottom: 28,
        }}>
          Progress
        </h1>
      </div>

      {/* Activity Rings */}
      <div style={{ padding: '0 24px 28px' }}>
        <p style={sectionLabel}>Today</p>
        <div style={{
          background: colors.surface, borderRadius: 14, padding: 24,
        }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
            <svg width={ringSize} height={ringSize} viewBox={`0 0 ${ringSize} ${ringSize}`}>
              {/* Outer — Movement */}
              <ActivityRing
                size={ringSize}
                strokeWidth={10}
                progress={dailyData.movementMin / 30}
                color="#FFFFFF"
              />
              {/* Middle — Stillness */}
              <ActivityRing
                size={ringSize}
                strokeWidth={10}
                progress={dailyData.stillnessMin / 20}
                color="rgba(255,255,255,0.5)"
              >
                {/* shift inward by adjusting viewbox trick — nest inner rings */}
              </ActivityRing>
              {/* Redraw middle and inner at smaller radii */}
              <circle
                cx={ringSize / 2} cy={ringSize / 2}
                r={(ringSize - 10) / 2 - 14}
                fill="none"
                stroke="rgba(255,255,255,0.06)"
                strokeWidth={10}
              />
              <circle
                cx={ringSize / 2} cy={ringSize / 2}
                r={(ringSize - 10) / 2 - 14}
                fill="none"
                stroke="rgba(255,255,255,0.5)"
                strokeWidth={10}
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * ((ringSize - 10) / 2 - 14)}
                strokeDashoffset={
                  2 * Math.PI * ((ringSize - 10) / 2 - 14) -
                  Math.min(dailyData.stillnessMin / 20, 1) *
                  2 * Math.PI * ((ringSize - 10) / 2 - 14)
                }
                transform={`rotate(-90 ${ringSize / 2} ${ringSize / 2})`}
                style={{ transition: 'stroke-dashoffset 0.6s ease' }}
              />
              {/* Inner — Water */}
              <circle
                cx={ringSize / 2} cy={ringSize / 2}
                r={(ringSize - 10) / 2 - 28}
                fill="none"
                stroke="rgba(255,255,255,0.06)"
                strokeWidth={10}
              />
              <circle
                cx={ringSize / 2} cy={ringSize / 2}
                r={(ringSize - 10) / 2 - 28}
                fill="none"
                stroke="rgba(255,255,255,0.25)"
                strokeWidth={10}
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * ((ringSize - 10) / 2 - 28)}
                strokeDashoffset={
                  2 * Math.PI * ((ringSize - 10) / 2 - 28) -
                  Math.min(realWater / 8, 1) *
                  2 * Math.PI * ((ringSize - 10) / 2 - 28)
                }
                transform={`rotate(-90 ${ringSize / 2} ${ringSize / 2})`}
                style={{ transition: 'stroke-dashoffset 0.6s ease' }}
              />
            </svg>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 28 }}>
            {[
              { label: 'Movement', value: `${dailyData.movementMin}/30 min`, color: '#FFFFFF' },
              { label: 'Stillness', value: `${dailyData.stillnessMin}/20 min`, color: 'rgba(255,255,255,0.5)' },
              { label: 'Water', value: `${realWater}/8 glasses`, color: 'rgba(255,255,255,0.25)' },
            ].map(m => (
              <div key={m.label} style={{ textAlign: 'center' }}>
                <div style={{
                  width: 8, height: 8, borderRadius: 4,
                  background: m.color, margin: '0 auto 6px',
                }} />
                <p style={{
                  fontFamily: fonts.sans, fontSize: 12, fontWeight: 500,
                  color: colors.text, marginBottom: 2,
                }}>
                  {m.value}
                </p>
                <p style={{
                  fontFamily: fonts.sans, fontSize: 10,
                  color: colors.text3,
                }}>
                  {m.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Streak Calendar */}
      <div style={{ padding: '0 24px 28px' }}>
        <p style={sectionLabel}>Streak Calendar</p>
        <div style={{
          background: colors.surface, borderRadius: 14, padding: 20,
        }}>
          <p style={{
            fontFamily: fonts.sans, fontSize: 14, fontWeight: 500,
            color: colors.text, marginBottom: 16, textAlign: 'center',
          }}>
            {MONTH_NAMES[currentMonth]} {currentYear}
          </p>
          {/* Day-of-week headers */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)',
            gap: 4, marginBottom: 8,
          }}>
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
              <div key={i} style={{
                textAlign: 'center',
                fontFamily: fonts.sans, fontSize: 10, color: colors.text3,
              }}>
                {d}
              </div>
            ))}
          </div>
          {/* Calendar grid */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)',
            gap: 4,
          }}>
            {/* Empty cells for offset */}
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} style={{ height: 28 }} />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1
              const isToday = day === today
              const isActive = dailyData.activeDays.has(day)
              const isFuture = day > today
              return (
                <div key={day} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  height: 28,
                }}>
                  <div style={{
                    width: 22, height: 22, borderRadius: 11,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: isActive ? (isToday ? '#fff' : 'rgba(255,255,255,0.7)') : 'transparent',
                    border: isFuture
                      ? 'none'
                      : isActive
                        ? 'none'
                        : '1px solid rgba(255,255,255,0.12)',
                  }}>
                    <span style={{
                      fontFamily: fonts.mono, fontSize: 9,
                      color: isActive
                        ? colors.bg
                        : isFuture
                          ? 'rgba(255,255,255,0.1)'
                          : colors.text3,
                      fontWeight: isToday ? 700 : 400,
                    }}>
                      {day}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
          <p style={{
            fontFamily: fonts.sans, fontSize: 13, color: colors.text2,
            marginTop: 16, textAlign: 'center',
          }}>
            Current streak: <span style={{ color: colors.text, fontWeight: 600 }}>{dailyData.streak} days</span>
          </p>
        </div>
      </div>

      {/* Neural Pathways */}
      <div style={{ padding: '0 24px 28px' }}>
        <p style={sectionLabel}>Neural Pathways</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {NEURAL_PATHWAYS.map((pathway, i) => {
            const pct = Math.min(pathway.days / 90, 1) * 100
            const milestones = [
              { day: 21, label: '21' },
              { day: 66, label: '66' },
              { day: 90, label: '90' },
            ]
            return (
              <div key={i} style={{
                background: colors.surface, borderRadius: 14, padding: 18,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                  <span style={{ fontFamily: fonts.sans, fontSize: 14, fontWeight: 500, color: colors.text }}>
                    {pathway.name}
                  </span>
                  <span style={{ fontFamily: fonts.mono, fontSize: 12, color: '#fff' }}>
                    Day {pathway.days}
                  </span>
                </div>
                {/* Progress bar with milestones */}
                <div style={{ position: 'relative', marginBottom: 10 }}>
                  <div style={{
                    height: 4, borderRadius: 2,
                    background: 'rgba(255,255,255,0.06)',
                    overflow: 'hidden',
                  }}>
                    <div style={{
                      height: '100%',
                      width: `${pct}%`,
                      borderRadius: 2,
                      background: 'rgba(255,255,255,0.5)',
                      transition: 'width 0.5s ease',
                    }} />
                  </div>
                  {/* Milestone markers */}
                  {milestones.map(m => (
                    <div key={m.day} style={{
                      position: 'absolute',
                      left: `${(m.day / 90) * 100}%`,
                      top: -3,
                      transform: 'translateX(-50%)',
                    }}>
                      <div style={{
                        width: 2, height: 10, borderRadius: 1,
                        background: pathway.days >= m.day
                          ? 'rgba(255,255,255,0.6)'
                          : 'rgba(255,255,255,0.15)',
                      }} />
                      <p style={{
                        fontFamily: fonts.mono, fontSize: 8,
                        color: pathway.days >= m.day ? colors.text2 : colors.text3,
                        textAlign: 'center', marginTop: 2,
                        transform: 'translateX(-2px)',
                      }}>
                        {m.label}
                      </p>
                    </div>
                  ))}
                </div>
                <p style={{
                  fontFamily: fonts.sans, fontSize: 12,
                  fontStyle: 'italic', color: colors.text3,
                  marginTop: 18,
                }}>
                  {getMilestoneText(pathway.days)}
                </p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Mood History */}
      {(() => {
        let moodHistory = []
        try {
          const stored = JSON.parse(localStorage.getItem('stoa-moods') || '{}')
          const moodMap = { 5: '✨', 4: '😊', 3: '😌', 2: '😔', 1: '😣' }
          const labelMap = { 5: 'Amazing', 4: 'Good', 3: 'Okay', 2: 'Low', 1: 'Rough' }
          const sorted = Object.entries(stored).sort((a, b) => b[0].localeCompare(a[0])).slice(0, 14)
          moodHistory = sorted.map(([date, mood]) => ({
            date,
            emoji: mood.emoji || moodMap[mood.value] || '😌',
            label: mood.label || labelMap[mood.value] || 'Okay',
            value: mood.value || 3,
          }))
        } catch {}

        if (moodHistory.length === 0) return null

        return (
          <div style={{ padding: '0 24px 28px' }}>
            <p style={sectionLabel}>Mood History</p>
            <div style={{ background: colors.surface, borderRadius: 14, padding: 20 }}>
              {/* Mood bar chart */}
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, marginBottom: 16, height: 80 }}>
                {moodHistory.slice().reverse().map((m, i) => (
                  <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                    <span style={{ fontSize: 14 }}>{m.emoji}</span>
                    <div style={{
                      width: '100%', borderRadius: 3,
                      height: `${(m.value / 5) * 40}px`,
                      background: `rgba(255,255,255,${0.08 + (m.value / 5) * 0.2})`,
                      transition: 'height 0.3s',
                    }} />
                    <span style={{ fontFamily: fonts.mono, fontSize: 7, color: colors.text3 }}>
                      {new Date(m.date + 'T00:00:00').getDate()}
                    </span>
                  </div>
                ))}
              </div>
              {/* Average */}
              {moodHistory.length > 1 && (() => {
                const avg = moodHistory.reduce((s, m) => s + m.value, 0) / moodHistory.length
                const avgLabel = avg >= 4.5 ? 'Amazing' : avg >= 3.5 ? 'Good' : avg >= 2.5 ? 'Okay' : avg >= 1.5 ? 'Low' : 'Rough'
                return (
                  <p style={{ fontFamily: fonts.sans, fontSize: 12, color: colors.text3, textAlign: 'center' }}>
                    Average mood: <span style={{ color: colors.text2, fontWeight: 500 }}>{avgLabel}</span> over {moodHistory.length} days
                  </p>
                )
              })()}
            </div>
          </div>
        )
      })()}

      {/* Note from the Universe */}
      <div style={{ margin: '0 16px 28px', background: colors.surface, borderRadius: 16, padding: '32px 28px', textAlign: 'center' }}>
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
          "{pickNote(3)}"
        </p>
      </div>

      {/* Life Design Wheel */}
      <div style={{ padding: '0 24px 28px' }}>
        <p style={sectionLabel}>Life Design Wheel</p>
        <div style={{
          background: colors.surface, borderRadius: 14, padding: 24,
        }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
            <svg width={220} height={220} viewBox="0 0 220 220">
              {wheelCategories.map((cat, i) => {
                const angle = (i / wheelCategories.length) * Math.PI * 2 - Math.PI / 2
                const maxR = 90
                const r = (cat.score / 10) * maxR
                const x = 110 + Math.cos(angle) * r
                const y = 110 + Math.sin(angle) * r
                const labelR = maxR + 16
                const lx = 110 + Math.cos(angle) * labelR
                const ly = 110 + Math.sin(angle) * labelR
                return (
                  <g key={cat.label}>
                    <line
                      x1={110} y1={110}
                      x2={110 + Math.cos(angle) * maxR}
                      y2={110 + Math.sin(angle) * maxR}
                      stroke={colors.border}
                      strokeWidth={1}
                    />
                    <circle cx={x} cy={y} r={5} fill="#fff" />
                    <text
                      x={lx} y={ly}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill={colors.text2}
                      fontSize={10}
                      fontFamily={fonts.sans}
                    >
                      {cat.label}
                    </text>
                  </g>
                )
              })}
              <polygon
                points={wheelCategories.map((cat, i) => {
                  const angle = (i / wheelCategories.length) * Math.PI * 2 - Math.PI / 2
                  const r = (cat.score / 10) * 90
                  return `${110 + Math.cos(angle) * r},${110 + Math.sin(angle) * r}`
                }).join(' ')}
                fill="rgba(255,255,255,0.06)"
                stroke="rgba(255,255,255,0.3)"
                strokeWidth={1.5}
              />
              <circle cx={110} cy={110} r={90} fill="none" stroke={colors.border} strokeWidth={1} />
            </svg>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
            {wheelCategories.map((cat, i) => (
              <div key={cat.label} style={{
                display: 'flex', alignItems: 'center', gap: 6,
                background: 'rgba(255,255,255,0.04)',
                borderRadius: 8, padding: '4px 6px',
              }}>
                <span onClick={() => updateWheelScore(i, -1)} style={{
                  fontFamily: fonts.mono, fontSize: 14, color: colors.text3,
                  cursor: 'pointer', padding: '0 4px', userSelect: 'none',
                }}>−</span>
                <span style={{ fontFamily: fonts.mono, fontSize: 11, color: colors.text2, minWidth: 52, textAlign: 'center' }}>
                  {cat.label} {cat.score}
                </span>
                <span onClick={() => updateWheelScore(i, 1)} style={{
                  fontFamily: fonts.mono, fontSize: 14, color: colors.text3,
                  cursor: 'pointer', padding: '0 4px', userSelect: 'none',
                }}>+</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Manifestation Log */}
      <div style={{ padding: '0 24px 28px' }}>
        <p style={sectionLabel}>Manifestation Log</p>
        <div style={{ padding: '4px 0', marginBottom: 8 }}>
          <p style={{
            fontFamily: fonts.sans, fontSize: 12, color: colors.text3,
            letterSpacing: 0.5, fontStyle: 'italic',
          }}>
            Ask. Believe. Receive.
          </p>
        </div>
        <div style={{
          background: colors.surface, borderRadius: 14, padding: 20,
          display: 'flex', flexDirection: 'column', gap: 14,
        }}>
          {manifestations.map((item, i) => (
            <div key={i} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              paddingBottom: i < manifestations.length - 1 ? 14 : 0,
              borderBottom: i < manifestations.length - 1 ? `1px solid ${colors.border}` : 'none',
            }}>
              <span style={{
                fontFamily: fonts.sans, fontSize: 14, color: colors.text,
                flex: 1, paddingRight: 12,
              }}>
                {item.intention}
              </span>
              <span onClick={() => toggleManifestationStatus(i)} style={{
                fontFamily: fonts.mono, fontSize: 10,
                color: item.status === 'received' ? '#fff' : colors.text3,
                textTransform: 'uppercase', letterSpacing: 1,
                background: item.status === 'received' ? 'rgba(255,255,255,0.1)' : 'transparent',
                padding: '3px 8px',
                borderRadius: 6, whiteSpace: 'nowrap', cursor: 'pointer',
              }}>
                {item.status}
              </span>
            </div>
          ))}
          {/* Add new */}
          <div style={{
            display: 'flex', gap: 10, alignItems: 'center',
            paddingTop: 14, borderTop: `1px solid ${colors.border}`,
          }}>
            <input
              value={newIntention}
              onChange={e => setNewIntention(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addManifestation()}
              placeholder="Add an intention..."
              style={{
                flex: 1, background: 'transparent', border: 'none', outline: 'none',
                fontFamily: fonts.sans, fontSize: 14, color: colors.text,
              }}
            />
            <span onClick={addManifestation} style={{
              fontFamily: fonts.sans, fontSize: 20, color: newIntention.trim() ? colors.text2 : colors.text3,
              cursor: newIntention.trim() ? 'pointer' : 'default',
            }}>+</span>
          </div>
        </div>
      </div>

      {/* Monthly Stats */}
      <div style={{ padding: '0 24px 28px' }}>
        <p style={sectionLabel}>Monthly Stats</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* This Week */}
          <div style={{
            background: colors.surface, borderRadius: 14, padding: 20,
          }}>
            <p style={{
              fontFamily: fonts.sans, fontSize: 11, fontWeight: 600,
              color: colors.text3, letterSpacing: 1, textTransform: 'uppercase',
              marginBottom: 16,
            }}>
              This Week
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 8 }}>
              {[
                {
                  value: dailyData.weekMovement,
                  unit: 'hrs',
                  label: 'Movement',
                  change: dailyData.weekMovementChange,
                },
                {
                  value: dailyData.weekStillness,
                  unit: 'min',
                  label: 'Stillness',
                  change: dailyData.weekStillnessChange,
                },
                {
                  value: dailyData.weekJournals,
                  unit: '',
                  label: 'Journal',
                  change: null,
                },
                {
                  value: dailyData.weekWater,
                  unit: '/day',
                  label: 'Water avg',
                  change: null,
                },
              ].map((s, i) => (
                <div key={i} style={{ textAlign: 'center' }}>
                  <p style={{
                    fontFamily: fonts.sans, fontSize: 22, fontWeight: 300,
                    color: colors.text, lineHeight: 1.2,
                  }}>
                    {s.value}
                  </p>
                  <p style={{
                    fontFamily: fonts.sans, fontSize: 9, color: colors.text3,
                    marginTop: 2,
                  }}>
                    {s.unit} {s.label}
                  </p>
                  {s.change !== null && (
                    <p style={{
                      fontFamily: fonts.mono, fontSize: 9,
                      color: s.change >= 0 ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.3)',
                      marginTop: 4,
                    }}>
                      {s.change >= 0 ? '\u2191' : '\u2193'} {Math.abs(s.change)}% from last week
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
          {/* This Month */}
          <div style={{
            background: colors.surface, borderRadius: 14, padding: 20,
          }}>
            <p style={{
              fontFamily: fonts.sans, fontSize: 11, fontWeight: 600,
              color: colors.text3, letterSpacing: 1, textTransform: 'uppercase',
              marginBottom: 16,
            }}>
              This Month
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 8 }}>
              {[
                {
                  value: dailyData.monthMovement,
                  unit: 'hrs',
                  label: 'Movement',
                  change: dailyData.monthMovementChange,
                },
                {
                  value: dailyData.monthStillness,
                  unit: 'min',
                  label: 'Stillness',
                  change: dailyData.monthStillnessChange,
                },
                {
                  value: dailyData.monthJournals,
                  unit: '',
                  label: 'Journal',
                  change: null,
                },
                {
                  value: dailyData.monthWater,
                  unit: '/day',
                  label: 'Water avg',
                  change: null,
                },
              ].map((s, i) => (
                <div key={i} style={{ textAlign: 'center' }}>
                  <p style={{
                    fontFamily: fonts.sans, fontSize: 22, fontWeight: 300,
                    color: colors.text, lineHeight: 1.2,
                  }}>
                    {s.value}
                  </p>
                  <p style={{
                    fontFamily: fonts.sans, fontSize: 9, color: colors.text3,
                    marginTop: 2,
                  }}>
                    {s.unit} {s.label}
                  </p>
                  {s.change !== null && (
                    <p style={{
                      fontFamily: fonts.mono, fontSize: 9,
                      color: s.change >= 0 ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.3)',
                      marginTop: 4,
                    }}>
                      {s.change >= 0 ? '\u2191' : '\u2193'} {Math.abs(s.change)}% from last month
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Personal Records */}
      <div style={{ padding: '0 24px 28px' }}>
        <p style={sectionLabel}>Personal Records</p>
        <div style={{
          background: colors.surface, borderRadius: 14, padding: 20,
          display: 'flex', flexDirection: 'column', gap: 16,
        }}>
          {[
            {
              icon: '\u26A1',
              text: `Longest streak: ${dailyData.longestStreak} days`,
              sub: 'Morning meditation',
            },
            {
              icon: '\u23F3',
              text: `Most stillness in a day: ${dailyData.mostStillness} min`,
              sub: 'Deep focus session',
            },
            {
              icon: '\u270F\uFE0F',
              text: `Journal entries this month: ${dailyData.monthJournalEntries}`,
              sub: 'Keep going',
            },
          ].map((record, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'flex-start', gap: 14,
              paddingBottom: i < 2 ? 16 : 0,
              borderBottom: i < 2 ? `1px solid ${colors.border}` : 'none',
            }}>
              <span style={{ fontSize: 18, lineHeight: 1, flexShrink: 0, marginTop: 1 }}>
                {record.icon}
              </span>
              <div>
                <p style={{
                  fontFamily: fonts.sans, fontSize: 14, fontWeight: 500,
                  color: colors.text, lineHeight: 1.3,
                }}>
                  {record.text}
                </p>
                <p style={{
                  fontFamily: fonts.sans, fontSize: 12,
                  color: colors.text3, marginTop: 3,
                }}>
                  {record.sub}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
