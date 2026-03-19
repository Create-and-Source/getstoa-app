import { useState } from 'react'
import { colors, fonts, radius } from '../theme'

const CLEAN_PHOTOS = [
  '/skin.jpg', '/mudra.jpg', '/palo-santo.jpg',
  '/crystal.jpg', '/leaf-dark.jpg', '/yoga.jpg', '/sage-bowl.jpg',
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

const EVENTS = [
  { title: 'Full Moon Meditation', date: 'April 5, 2026', month: 'APR', day: '5', time: '8:00 PM', leader: 'Amara J.' },
  { title: 'Morning Ritual Workshop', date: 'April 12, 2026', month: 'APR', day: '12', time: '7:00 AM', leader: 'Sarah M.' },
  { title: 'Breathwork & Release', date: 'April 19, 2026', month: 'APR', day: '19', time: '6:00 PM', leader: 'Nadia C.' },
]

const CHALLENGES = [
  { title: '21 Days of Gratitude', current: 14, total: 21, participants: 312 },
  { title: 'Morning Movement', current: 8, total: 14, participants: 187 },
  { title: 'Digital Sunset', current: 5, total: 7, participants: 94 },
]

const FEATURED_MEMBERS = [
  { name: 'Sarah M.', role: 'Yoga instructor & breathwork guide', followers: '1.2k' },
  { name: 'Amara J.', role: 'Meditation teacher & sound healer', followers: '890' },
  { name: 'Nadia C.', role: 'Pilates instructor & wellness coach', followers: '1.5k' },
  { name: 'Maya R.', role: 'Holistic nutritionist', followers: '640' },
]

export default function Community() {
  const [activeTab, setActiveTab] = useState('journal')

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

      {/* Universe Note */}
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
          "{pickNote(2)}"
        </p>
      </div>

      {/* Groups */}
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

      {/* Events */}
      <div style={{ padding: '28px 24px 0' }}>
        <p style={{
          fontFamily: fonts.sans, fontSize: 10, fontWeight: 600,
          color: colors.text3, letterSpacing: 3, textTransform: 'uppercase',
          marginBottom: 14,
        }}>
          Events
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {EVENTS.map((event, i) => (
            <div key={i} style={{
              background: colors.surface, borderRadius: 14, padding: '18px 20px',
              display: 'flex', gap: 16, alignItems: 'center',
            }}>
              <div style={{
                minWidth: 48, textAlign: 'center', background: 'rgba(255,255,255,0.06)',
                borderRadius: 10, padding: '8px 6px',
              }}>
                <p style={{ fontFamily: fonts.sans, fontSize: 9, fontWeight: 600, color: colors.text3, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 2 }}>
                  {event.month}
                </p>
                <p style={{ fontFamily: fonts.sans, fontSize: 18, fontWeight: 300, color: colors.text }}>
                  {event.day}
                </p>
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontFamily: fonts.sans, fontSize: 15, fontWeight: 500, color: colors.text, marginBottom: 4 }}>
                  {event.title}
                </p>
                <p style={{ fontFamily: fonts.sans, fontSize: 12, color: colors.text3 }}>
                  {event.time} &middot; Led by {event.leader}
                </p>
              </div>
              <button style={{
                fontFamily: fonts.sans, fontSize: 11, fontWeight: 600,
                color: colors.text2, background: 'transparent',
                border: `1px solid ${colors.border}`,
                borderRadius: radius.pill, padding: '7px 14px',
                cursor: 'pointer', whiteSpace: 'nowrap',
              }}>
                Notify Me
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Challenges */}
      <div style={{ padding: '28px 24px 0' }}>
        <p style={{
          fontFamily: fonts.sans, fontSize: 10, fontWeight: 600,
          color: colors.text3, letterSpacing: 3, textTransform: 'uppercase',
          marginBottom: 14,
        }}>
          Challenges
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {CHALLENGES.map((challenge, i) => (
            <div key={i} style={{
              background: colors.surface, borderRadius: 14, padding: '18px 20px',
            }}>
              <p style={{ fontFamily: fonts.sans, fontSize: 15, fontWeight: 500, color: colors.text, marginBottom: 6 }}>
                {challenge.title}
              </p>
              <p style={{ fontFamily: fonts.sans, fontSize: 12, color: colors.text3, marginBottom: 10 }}>
                Day {challenge.current} of {challenge.total}
              </p>
              <div style={{
                height: 2, borderRadius: 1,
                background: 'rgba(255,255,255,0.08)',
                marginBottom: 10,
              }}>
                <div style={{
                  height: '100%', borderRadius: 1,
                  background: '#fff',
                  width: `${Math.round((challenge.current / challenge.total) * 100)}%`,
                }} />
              </div>
              <p style={{ fontFamily: fonts.sans, fontSize: 11, color: colors.text3 }}>
                {challenge.participants} participants
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Members */}
      <div style={{ padding: '28px 0 0' }}>
        <p style={{
          fontFamily: fonts.sans, fontSize: 10, fontWeight: 600,
          color: colors.text3, letterSpacing: 3, textTransform: 'uppercase',
          marginBottom: 14, padding: '0 24px',
        }}>
          Featured Members
        </p>
        <div style={{
          display: 'flex', gap: 10, overflowX: 'auto',
          padding: '0 24px', scrollbarWidth: 'none',
        }}>
          {FEATURED_MEMBERS.map((member, i) => (
            <div key={i} style={{
              minWidth: 140, background: colors.surface, borderRadius: 14,
              padding: '20px 16px', textAlign: 'center', flexShrink: 0,
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: 22,
                background: 'rgba(255,255,255,0.06)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 10px',
              }}>
                <span style={{ fontFamily: fonts.sans, fontSize: 16, fontWeight: 300, color: colors.text2 }}>
                  {member.name.charAt(0)}
                </span>
              </div>
              <p style={{ fontFamily: fonts.sans, fontSize: 13, fontWeight: 500, color: colors.text, marginBottom: 3 }}>
                {member.name}
              </p>
              <p style={{ fontFamily: fonts.sans, fontSize: 10, color: colors.text3, lineHeight: 1.4, marginBottom: 4 }}>
                {member.role}
              </p>
              <p style={{ fontFamily: fonts.sans, fontSize: 10, color: colors.text3, marginBottom: 10 }}>
                {member.followers} followers
              </p>
              <button style={{
                fontFamily: fonts.sans, fontSize: 11, fontWeight: 600,
                color: colors.text2, background: 'transparent',
                border: `1px solid ${colors.border}`,
                borderRadius: radius.pill, padding: '6px 16px',
                cursor: 'pointer', width: '100%',
              }}>
                Follow
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
