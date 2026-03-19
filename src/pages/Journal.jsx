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

const PAST_ENTRIES = [
  { date: 'Today, 8:42 AM', type: 'Gratitude', content: 'Woke up before my alarm. The light coming through the window felt like a gift. Grateful for slow mornings.' },
  { date: 'Yesterday, 9:15 PM', type: 'Reflection', content: 'I noticed I was holding tension in my shoulders all day. When I finally stopped and breathed, everything softened.' },
  { date: '2 days ago, 7:30 AM', type: 'Gratitude', content: 'The sound of rain. A warm cup of tea. My body feeling strong after yesterday\'s workout.' },
  { date: '3 days ago, 10:00 PM', type: 'Free Write', content: 'I keep thinking about the person I\'m becoming. She\'s calmer. More intentional. Less reactive. I like her.' },
  { date: '5 days ago, 6:45 AM', type: 'Gratitude', content: 'I\'m grateful for the people who show up for me without being asked.' },
  { date: '1 week ago, 8:00 PM', type: 'Reflection', content: 'This week taught me that rest is not the opposite of progress. It\'s part of it.' },
  { date: '1 week ago, 7:00 AM', type: 'Gratitude', content: 'My health. My peace. The fact that I get to start over every single morning.' },
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

export default function Journal() {
  const navigate = useNavigate()
  const [expanded, setExpanded] = useState(false)
  const [activeTab, setActiveTab] = useState('Gratitude')

  const heartCounts = useMemo(() => {
    return PAST_ENTRIES.map((_, i) => {
      const rng = seededRandom(7742 + i * 331)
      return Math.floor(rng() * 16)
    })
  }, [])

  return (
    <div style={{
      height: '100%',
      overflowY: 'auto',
      background: colors.bg,
      color: colors.text,
      fontFamily: fonts.sans,
      paddingBottom: 160,
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
            width: 36,
            height: 36,
            borderRadius: radius.pill,
            border: `1px solid ${colors.border}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flexShrink: 0,
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
                  padding: '6px 14px',
                  borderRadius: radius.pill,
                  background: activeTab === type ? 'rgba(255,255,255,0.12)' : 'transparent',
                  border: `1px solid ${activeTab === type ? 'rgba(255,255,255,0.2)' : colors.border}`,
                  fontFamily: fonts.sans,
                  fontSize: 12,
                  fontWeight: 500,
                  color: activeTab === type ? colors.text : colors.text3,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                {type}
              </div>
            ))}
          </div>

          {/* Writing card */}
          <div
            onClick={() => setExpanded(!expanded)}
            style={{
              background: colors.surface,
              borderRadius: 14,
              border: `1px solid ${colors.border}`,
              padding: expanded ? '20px 18px' : '16px 18px',
              minHeight: expanded ? 180 : 56,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              position: 'relative',
            }}
          >
            {!expanded ? (
              <span style={{
                fontFamily: fonts.sans,
                fontSize: 15,
                fontStyle: 'italic',
                color: colors.text3,
              }}>
                What's on your mind?
              </span>
            ) : (
              <div>
                <span style={{
                  fontFamily: fonts.sans,
                  fontSize: 15,
                  fontStyle: 'italic',
                  color: colors.text3,
                }}>
                  What's on your mind?
                </span>
                <div style={{
                  display: 'inline-block',
                  width: 1.5,
                  height: 18,
                  background: colors.text,
                  marginLeft: 2,
                  verticalAlign: 'text-bottom',
                  animation: 'journalBlink 1s step-end infinite',
                }} />
              </div>
            )}
          </div>

          {/* Action row */}
          {expanded && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              marginTop: 12,
            }}>
              {/* Photo icon */}
              <div style={{
                width: 38,
                height: 38,
                borderRadius: radius.pill,
                border: `1px solid ${colors.border}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={colors.text2} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
              </div>
              {/* Mic icon */}
              <div style={{
                width: 38,
                height: 38,
                borderRadius: radius.pill,
                border: `1px solid ${colors.border}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={colors.text2} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                  <line x1="12" y1="19" x2="12" y2="23" />
                  <line x1="8" y1="23" x2="16" y2="23" />
                </svg>
              </div>
              <div style={{ flex: 1 }} />
              {/* Save Entry button */}
              <div style={{
                padding: '10px 22px',
                borderRadius: radius.pill,
                background: '#fff',
                color: colors.bg,
                fontFamily: fonts.sans,
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                letterSpacing: -0.2,
              }}>
                Save Entry
              </div>
            </div>
          )}
        </div>

        {/* Streak banner */}
        <div style={{
          background: colors.surface,
          borderRadius: 14,
          border: `1px solid ${colors.border}`,
          padding: '14px 18px',
          marginBottom: 32,
        }}>
          <span style={{
            fontFamily: fonts.sans,
            fontSize: 14,
            fontWeight: 500,
            color: colors.text,
            letterSpacing: -0.2,
          }}>
            Day 38 — You haven't missed a week since February.
          </span>
        </div>

        {/* Past entries */}
        <div style={{ marginBottom: 32 }}>
          <div style={sectionLabel}>Past Entries</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {PAST_ENTRIES.map((entry, i) => (
              <div key={i} style={{
                background: colors.surface,
                borderRadius: 14,
                border: `1px solid ${colors.border}`,
                padding: '16px 18px',
              }}>
                <div style={{
                  fontFamily: fonts.sans,
                  fontSize: 11,
                  color: colors.text3,
                  marginBottom: 8,
                  letterSpacing: 0.2,
                }}>
                  {entry.date}
                </div>
                <div style={{
                  display: 'inline-block',
                  padding: '3px 10px',
                  borderRadius: radius.pill,
                  background: typeBadgeColor(entry.type),
                  fontFamily: fonts.sans,
                  fontSize: 10,
                  fontWeight: 600,
                  color: colors.text2,
                  marginBottom: 10,
                  letterSpacing: 0.4,
                }}>
                  {entry.type}
                </div>
                <div style={{
                  fontFamily: fonts.sans,
                  fontSize: 14,
                  lineHeight: 1.55,
                  color: colors.text,
                  letterSpacing: -0.1,
                }}>
                  {entry.content}
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                  marginTop: 12,
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={colors.text3} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                  <span style={{
                    fontFamily: fonts.sans,
                    fontSize: 11,
                    color: colors.text3,
                  }}>
                    {heartCounts[i]}
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
            background: colors.surface,
            borderRadius: 14,
            border: `1px solid ${colors.border}`,
            padding: '18px 18px',
          }}>
            <div style={{
              fontFamily: fonts.sans,
              fontSize: 16,
              fontWeight: 600,
              color: colors.text,
              marginBottom: 16,
              letterSpacing: -0.3,
            }}>
              March 2026
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                ['Entries this month', '18'],
                ['Most active', 'Mornings'],
                ['Longest streak', '12 days'],
              ].map(([label, value]) => (
                <div key={label} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                  <span style={{
                    fontFamily: fonts.sans,
                    fontSize: 13,
                    color: colors.text2,
                  }}>
                    {label}
                  </span>
                  <span style={{
                    fontFamily: fonts.sans,
                    fontSize: 13,
                    fontWeight: 600,
                    color: colors.text,
                  }}>
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Cursor blink animation */}
      <style>{`
        @keyframes journalBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  )
}
