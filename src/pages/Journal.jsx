import { useState, useMemo } from 'react'
import { colors, fonts, radius } from '../theme'
import { useNavigate } from 'react-router-dom'

function seededRandom(seed) {
  let s = seed
  return () => {
    s = (s * 16807 + 0) % 2147483647
    return (s - 1) / 2147483646
  }
}

const ENTRY_TYPES = ['Gratitude', 'Reflection', 'Free Write']

const STARTER_ENTRIES = [
  { date: '2026-03-17T08:42:00', type: 'Gratitude', content: 'Woke up before my alarm. The light coming through the window felt like a gift. Grateful for slow mornings.' },
  { date: '2026-03-16T21:15:00', type: 'Reflection', content: 'I noticed I was holding tension in my shoulders all day. When I finally stopped and breathed, everything softened.' },
  { date: '2026-03-15T07:30:00', type: 'Gratitude', content: 'The sound of rain. A warm cup of tea. My body feeling strong after yesterday\'s workout.' },
  { date: '2026-03-14T22:00:00', type: 'Free Write', content: 'I keep thinking about the person I\'m becoming. She\'s calmer. More intentional. Less reactive. I like her.' },
  { date: '2026-03-12T06:45:00', type: 'Gratitude', content: 'I\'m grateful for the people who show up for me without being asked.' },
  { date: '2026-03-10T20:00:00', type: 'Reflection', content: 'This week taught me that rest is not the opposite of progress. It\'s part of it.' },
  { date: '2026-03-10T07:00:00', type: 'Gratitude', content: 'My health. My peace. The fact that I get to start over every single morning.' },
]

const sectionLabel = {
  fontFamily: fonts.sans,
  fontSize: 10,
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: 3,
  color: colors.text3,
  marginBottom: 12,
}

const typeBadgeColor = (type) => {
  if (type === 'Gratitude') return '#2A2520'
  if (type === 'Reflection') return '#1E2A20'
  return '#201E2A'
}

function formatEntryDate(dateStr) {
  const d = new Date(dateStr)
  const now = new Date()
  const diffDays = Math.floor((now - d) / (1000 * 60 * 60 * 24))
  const time = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })

  if (diffDays === 0) return `Today, ${time}`
  if (diffDays === 1) return `Yesterday, ${time}`
  if (diffDays < 7) return `${diffDays} days ago, ${time}`
  return `${Math.floor(diffDays / 7)} week${diffDays >= 14 ? 's' : ''} ago, ${time}`
}

function loadEntries() {
  try {
    const stored = localStorage.getItem('stoa-journal-entries')
    if (stored) {
      const parsed = JSON.parse(stored)
      if (parsed.length > 0) return parsed
    }
  } catch {}
  // First time — seed with starter entries
  localStorage.setItem('stoa-journal-entries', JSON.stringify(STARTER_ENTRIES))
  return STARTER_ENTRIES
}

export default function Journal() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('Gratitude')
  const [writing, setWriting] = useState(false)
  const [text, setText] = useState('')
  const [entries, setEntries] = useState(loadEntries)

  const heartCounts = useMemo(() => {
    return entries.map((_, i) => {
      const rng = seededRandom(7742 + i * 331)
      return Math.floor(rng() * 16)
    })
  }, [entries.length])

  function saveEntry() {
    if (!text.trim()) return
    const newEntry = {
      date: new Date().toISOString(),
      type: activeTab,
      content: text.trim(),
    }
    const updated = [newEntry, ...entries]
    setEntries(updated)
    localStorage.setItem('stoa-journal-entries', JSON.stringify(updated))
    setText('')
    setWriting(false)
  }

  // Stats
  const totalEntries = entries.length
  const thisMonth = entries.filter(e => {
    const d = new Date(e.date)
    const now = new Date()
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  }).length

  // Streak calculation
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const entryDates = new Set(entries.map(e => new Date(e.date).toISOString().split('T')[0]))
  let streak = 0
  for (let i = 0; i < 365; i++) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    if (entryDates.has(d.toISOString().split('T')[0])) streak++
    else if (i > 0) break // allow today to not have an entry yet
    else continue
  }

  return (
    <div style={{
      height: '100%',
      overflowY: 'auto',
      background: colors.bg,
      color: colors.text,
      fontFamily: fonts.sans,
      paddingBottom: 160,
      WebkitOverflowScrolling: 'touch',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        padding: '20px 20px 8px',
      }}>
        <div
          onClick={() => navigate(-1)}
          style={{
            width: 36, height: 36, borderRadius: radius.pill,
            border: `1px solid ${colors.border}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', flexShrink: 0,
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={colors.text} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </div>
        <span style={{ fontSize: 18, fontWeight: 600, letterSpacing: -0.3 }}>Journal</span>
      </div>

      <div style={{ padding: '16px 20px 0' }}>

        {/* Writing Area */}
        <div style={{ marginBottom: 28 }}>
          {/* Pill tabs */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
            {ENTRY_TYPES.map(type => (
              <div
                key={type}
                onClick={() => setActiveTab(type)}
                style={{
                  padding: '6px 14px', borderRadius: radius.pill,
                  background: activeTab === type ? 'rgba(255,255,255,0.12)' : 'transparent',
                  border: `1px solid ${activeTab === type ? 'rgba(255,255,255,0.2)' : colors.border}`,
                  fontFamily: fonts.sans, fontSize: 12, fontWeight: 500,
                  color: activeTab === type ? colors.text : colors.text3,
                  cursor: 'pointer', transition: 'all 0.2s ease',
                }}
              >
                {type}
              </div>
            ))}
          </div>

          {/* Writing card */}
          {!writing ? (
            <div
              onClick={() => setWriting(true)}
              style={{
                background: colors.surface, borderRadius: 14,
                border: `1px solid ${colors.border}`,
                padding: '16px 18px', cursor: 'pointer',
              }}
            >
              <span style={{ fontFamily: fonts.sans, fontSize: 15, fontStyle: 'italic', color: colors.text3 }}>
                What's on your mind?
              </span>
            </div>
          ) : (
            <div style={{
              background: colors.surface, borderRadius: 14,
              border: `1px solid ${colors.border}`,
              padding: '4px',
            }}>
              <textarea
                autoFocus
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder={activeTab === 'Gratitude' ? 'What are you grateful for?' : activeTab === 'Reflection' ? 'What\'s on your mind?' : 'Just write...'}
                style={{
                  width: '100%', minHeight: 140, background: 'transparent',
                  border: 'none', outline: 'none', padding: '14px',
                  fontFamily: fonts.sans, fontSize: 15, color: colors.text,
                  resize: 'none', lineHeight: 1.6,
                }}
              />
            </div>
          )}

          {/* Action row */}
          {writing && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 12 }}>
              <div onClick={() => { setWriting(false); setText('') }} style={{
                padding: '10px 18px', borderRadius: radius.pill,
                border: `1px solid ${colors.border}`,
                fontFamily: fonts.sans, fontSize: 13, color: colors.text3, cursor: 'pointer',
              }}>
                Cancel
              </div>
              <div style={{ flex: 1 }} />
              <div onClick={saveEntry} style={{
                padding: '10px 22px', borderRadius: radius.pill,
                background: text.trim() ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${text.trim() ? 'rgba(255,255,255,0.2)' : colors.border}`,
                color: text.trim() ? '#fff' : colors.text3,
                fontFamily: fonts.sans, fontSize: 13, fontWeight: 600,
                cursor: text.trim() ? 'pointer' : 'default', letterSpacing: -0.2,
              }}>
                Save Entry
              </div>
            </div>
          )}
        </div>

        {/* Streak banner */}
        <div style={{
          background: colors.surface, borderRadius: 14,
          border: `1px solid ${colors.border}`,
          padding: '14px 18px', marginBottom: 32,
        }}>
          <span style={{
            fontFamily: fonts.sans, fontSize: 14, fontWeight: 500,
            color: colors.text, letterSpacing: -0.2,
          }}>
            {streak > 0 ? `Day ${streak} — Keep the streak alive.` : 'Start your first streak today.'}
          </span>
        </div>

        {/* Past entries */}
        <div style={{ marginBottom: 32 }}>
          <div style={sectionLabel}>Past Entries</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {entries.map((entry, i) => (
              <div key={i} style={{
                background: colors.surface, borderRadius: 14,
                border: `1px solid ${colors.border}`, padding: '16px 18px',
              }}>
                <div style={{
                  fontFamily: fonts.sans, fontSize: 11, color: colors.text3,
                  marginBottom: 8, letterSpacing: 0.2,
                }}>
                  {formatEntryDate(entry.date)}
                </div>
                <div style={{
                  display: 'inline-block', padding: '3px 10px',
                  borderRadius: radius.pill, background: typeBadgeColor(entry.type),
                  fontFamily: fonts.sans, fontSize: 10, fontWeight: 600,
                  color: colors.text2, marginBottom: 10, letterSpacing: 0.4,
                }}>
                  {entry.type}
                </div>
                <div style={{
                  fontFamily: fonts.sans, fontSize: 14, lineHeight: 1.55,
                  color: colors.text, letterSpacing: -0.1,
                }}>
                  {entry.content}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 12 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={colors.text3} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                  <span style={{ fontFamily: fonts.sans, fontSize: 11, color: colors.text3 }}>
                    {heartCounts[i] || 0}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly summary */}
        <div style={{ marginBottom: 32 }}>
          <div style={sectionLabel}>Monthly Summary</div>
          <div style={{
            background: colors.surface, borderRadius: 14,
            border: `1px solid ${colors.border}`, padding: '18px 18px',
          }}>
            <div style={{
              fontFamily: fonts.sans, fontSize: 16, fontWeight: 600,
              color: colors.text, marginBottom: 16, letterSpacing: -0.3,
            }}>
              {new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' })}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                ['Entries this month', String(thisMonth)],
                ['Total entries', String(totalEntries)],
                ['Current streak', `${streak} day${streak !== 1 ? 's' : ''}`],
              ].map(([label, value]) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontFamily: fonts.sans, fontSize: 13, color: colors.text2 }}>{label}</span>
                  <span style={{ fontFamily: fonts.sans, fontSize: 13, fontWeight: 600, color: colors.text }}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
