import { useState, useMemo } from 'react'
import { colors, fonts, radius } from '../theme'

const CLEAN_PHOTOS = [
  '/skin.jpg', '/mudra.jpg', '/palo-santo.jpg', '/mindbody.jpg', '/monstera.jpg',
  '/crystal.jpg', '/leaf-dark.jpg', '/connection.jpg', '/yoga.jpg', '/sage-bowl.jpg',
]

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const JOURNAL_ENTRIES = [
  { user: 'Sarah M.', text: 'Woke up grateful. The sun came through my window and I just sat there for a moment.', hearts: 4, time: '2 hours ago', hasPhoto: false },
  { user: 'Amara J.', text: 'Finished a 30-minute meditation for the first time. My mind kept wandering but I stayed. That counts.', hearts: 7, time: 'Yesterday', hasPhoto: false },
  { user: 'Nadia C.', text: 'I am letting go of who I think I should be and becoming who I am.', hearts: 12, time: '2 days ago', hasPhoto: true },
]

const NOTES = [
  { title: 'Screenshot: breathwork routine', time: '3 hours ago', type: 'screenshot' },
  { title: 'Recipe for golden milk latte', time: 'Yesterday', type: 'note' },
  { title: 'Affirmation board inspo', time: '3 days ago', type: 'screenshot' },
]

const GROUPS = [
  { name: 'Morning Ritual Circle', members: 248, color: '#1E2A20' },
  { name: 'Manifestation Lab', members: 412, color: '#2A2520' },
  { name: 'Pilates Sisters', members: 186, color: '#201E2A' },
  { name: 'Book of the Month', members: 324, color: '#2A2020' },
  { name: 'Mindful Mamas', members: 156, color: '#1E1E2A' },
]

export default function Community() {
  const [activeTab, setActiveTab] = useState('journal')
  const dividerPhoto = useMemo(() => shuffle(CLEAN_PHOTOS)[0], [])

  return (
    <div style={{
      height: '100%',
      overflowY: 'auto',
      paddingBottom: 140,
      background: colors.bg,
    }}>
      {/* Header */}
      <div style={{ padding: '60px 24px 0' }}>
        <p style={{
          fontFamily: fonts.sans, fontSize: 10, fontWeight: 600,
          color: colors.text3, letterSpacing: 3, textTransform: 'uppercase',
          marginBottom: 4,
        }}>
          Your people
        </p>
        <h1 style={{
          fontFamily: fonts.sans, fontSize: 28, fontWeight: 300,
          color: colors.text, lineHeight: 1.2, marginBottom: 24,
        }}>
          Community
        </h1>
      </div>

      {/* Sub-tabs: Journal / Notes */}
      <div style={{ padding: '0 24px 20px', display: 'flex', gap: 8 }}>
        {['journal', 'notes'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              fontFamily: fonts.sans, fontSize: 12, fontWeight: 600,
              letterSpacing: 1, textTransform: 'uppercase',
              color: activeTab === tab ? '#fff' : colors.text3,
              background: activeTab === tab ? 'rgba(255,255,255,0.1)' : 'transparent',
              border: `1px solid ${activeTab === tab ? 'rgba(255,255,255,0.2)' : colors.border}`,
              borderRadius: radius.pill, padding: '10px 20px', cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {tab === 'journal' ? 'Journal Wall' : 'Note Wall'}
          </button>
        ))}
      </div>

      {/* Journal Wall */}
      {activeTab === 'journal' && (
        <div style={{ padding: '0 24px 28px' }}>
          {/* Compose */}
          <div style={{
            background: colors.surface, borderRadius: 14, padding: '16px 18px',
            marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12,
            border: `1px solid ${colors.border}`, cursor: 'pointer',
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: 18,
              background: 'rgba(255,255,255,0.06)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={colors.text3} strokeWidth={1.8} strokeLinecap="round">
                <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
            </div>
            <p style={{
              fontFamily: fonts.sans, fontSize: 14, color: colors.text3, fontStyle: 'italic',
            }}>
              Share a reflection...
            </p>
          </div>

          {/* Entries */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {JOURNAL_ENTRIES.map((entry, i) => (
              <div key={i} style={{
                background: colors.surface, borderRadius: 14, padding: 18,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 16,
                    background: 'rgba(255,255,255,0.06)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <span style={{ fontFamily: fonts.sans, fontSize: 12, color: colors.text2 }}>
                      {entry.user.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p style={{ fontFamily: fonts.sans, fontSize: 13, fontWeight: 500, color: colors.text }}>
                      {entry.user}
                    </p>
                    <p style={{ fontFamily: fonts.sans, fontSize: 10, color: colors.text3 }}>
                      {entry.time}
                    </p>
                  </div>
                </div>

                <p style={{
                  fontFamily: fonts.sans, fontSize: 14, color: colors.text2,
                  lineHeight: 1.6, marginBottom: 14,
                }}>
                  {entry.text}
                </p>

                {entry.hasPhoto && (
                  <div style={{
                    height: 180, borderRadius: 10, marginBottom: 14,
                    background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2520 100%)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke={colors.text3} strokeWidth={1.5} strokeLinecap="round">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                  </div>
                )}

                {/* Heart only */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <button style={{
                    display: 'flex', alignItems: 'center', gap: 4,
                    fontFamily: fonts.sans, fontSize: 12, color: colors.text3,
                    background: 'none', cursor: 'pointer', padding: '4px 8px',
                    borderRadius: 8, transition: 'all 0.2s',
                  }}>
                    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
                      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                    </svg>
                    {entry.hearts}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Note Wall */}
      {activeTab === 'notes' && (
        <div style={{ padding: '0 24px 28px' }}>
          {/* Save new note */}
          <div style={{
            background: colors.surface, borderRadius: 14, padding: '16px 18px',
            marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12,
            border: `1px solid ${colors.border}`, cursor: 'pointer',
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: 18,
              background: 'rgba(255,255,255,0.06)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={colors.text3} strokeWidth={1.8} strokeLinecap="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </div>
            <p style={{
              fontFamily: fonts.sans, fontSize: 14, color: colors.text3, fontStyle: 'italic',
            }}>
              Save a note or screenshot...
            </p>
          </div>

          {/* Notes list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {NOTES.map((note, i) => (
              <div key={i} style={{
                background: colors.surface, borderRadius: 14, padding: '16px 18px',
                display: 'flex', alignItems: 'center', gap: 14,
              }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 10,
                  background: 'rgba(255,255,255,0.04)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  {note.type === 'screenshot' ? (
                    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={colors.text3} strokeWidth={1.5} strokeLinecap="round">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                  ) : (
                    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={colors.text3} strokeWidth={1.5} strokeLinecap="round">
                      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                    </svg>
                  )}
                </div>
                <div>
                  <p style={{ fontFamily: fonts.sans, fontSize: 14, fontWeight: 500, color: colors.text, marginBottom: 2 }}>
                    {note.title}
                  </p>
                  <p style={{ fontFamily: fonts.sans, fontSize: 11, color: colors.text3 }}>
                    {note.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Divider image — rounded, smaller */}
      <div style={{ position: 'relative', margin: '0 16px 4px', borderRadius: 16, overflow: 'hidden', height: 180 }}>
        <img src={dividerPhoto} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.25)' }} />
        <div style={{ position: 'absolute', bottom: 24, left: 0, right: 0, textAlign: 'center' }}>
          <p style={{ fontFamily: fonts.sans, fontSize: 15, fontWeight: 300, color: '#fff', letterSpacing: 0.5 }}>
            We grow together.
          </p>
        </div>
      </div>

      {/* Groups — full view */}
      <div style={{ padding: '24px 24px 0' }}>
        <p style={{
          fontFamily: fonts.sans, fontSize: 10, fontWeight: 600,
          color: colors.text3, letterSpacing: 3, textTransform: 'uppercase',
          marginBottom: 14,
        }}>
          Your Groups
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {GROUPS.map((group, i) => (
            <div key={i} style={{
              background: group.color, borderRadius: 14, padding: '18px 20px',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              cursor: 'pointer',
            }}>
              <div>
                <p style={{ fontFamily: fonts.sans, fontSize: 15, fontWeight: 500, color: '#fff', marginBottom: 3 }}>
                  {group.name}
                </p>
                <p style={{ fontFamily: fonts.sans, fontSize: 11, color: 'rgba(255,255,255,0.45)' }}>
                  {group.members} members
                </p>
              </div>
              <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth={2} strokeLinecap="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </div>
          ))}
          <div style={{
            borderRadius: 14, padding: '18px 20px',
            border: `1px dashed ${colors.border}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
          }}>
            <span style={{ fontFamily: fonts.sans, fontSize: 13, color: colors.text3 }}>+ Create a Group</span>
          </div>
        </div>
      </div>

      {/* Events — coming soon */}
      <div style={{ padding: '28px 24px 0' }}>
        <p style={{
          fontFamily: fonts.sans, fontSize: 10, fontWeight: 600,
          color: colors.text3, letterSpacing: 3, textTransform: 'uppercase',
          marginBottom: 14,
        }}>
          Events
        </p>
        <div style={{
          background: colors.surface, borderRadius: 14,
          padding: '28px 20px', textAlign: 'center',
        }}>
          <svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke={colors.text3} strokeWidth={1.5} strokeLinecap="round" style={{ marginBottom: 10 }}>
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <p style={{ fontFamily: fonts.sans, fontSize: 14, fontWeight: 300, color: colors.text2, marginBottom: 4 }}>
            Live events & workshops
          </p>
          <p style={{ fontFamily: fonts.sans, fontSize: 12, color: colors.text3 }}>Coming soon</p>
        </div>
      </div>

      {/* Challenges — coming soon */}
      <div style={{ padding: '20px 24px 0' }}>
        <p style={{
          fontFamily: fonts.sans, fontSize: 10, fontWeight: 600,
          color: colors.text3, letterSpacing: 3, textTransform: 'uppercase',
          marginBottom: 14,
        }}>
          Challenges
        </p>
        <div style={{
          background: colors.surface, borderRadius: 14,
          padding: '28px 20px', textAlign: 'center',
        }}>
          <svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke={colors.text3} strokeWidth={1.5} strokeLinecap="round" style={{ marginBottom: 10 }}>
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
          <p style={{ fontFamily: fonts.sans, fontSize: 14, fontWeight: 300, color: colors.text2, marginBottom: 4 }}>
            21-day challenges & group goals
          </p>
          <p style={{ fontFamily: fonts.sans, fontSize: 12, color: colors.text3 }}>Coming soon</p>
        </div>
      </div>
    </div>
  )
}
