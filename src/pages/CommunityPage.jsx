import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { colors, fonts, radius } from '../theme'

const PHOTO_OPTIONS = [
  '/mudra.jpg', '/leaf-dark.jpg', '/yoga.jpg', '/sage-bowl.jpg',
  '/crystal.jpg', '/palo-santo.jpg', '/monstera.jpg', '/skin.jpg',
]

const ACCENT_PRESETS = [
  { label: 'Gold', value: 'rgba(180,140,60,0.15)', solid: '#B48C3C' },
  { label: 'Violet', value: 'rgba(140,100,180,0.15)', solid: '#8C64B4' },
  { label: 'Sage', value: 'rgba(100,160,100,0.12)', solid: '#64A064' },
  { label: 'Earth', value: 'rgba(180,140,100,0.12)', solid: '#B48C64' },
  { label: 'Rose', value: 'rgba(180,100,120,0.12)', solid: '#B46478' },
  { label: 'Neutral', value: 'rgba(255,255,255,0.08)', solid: '#999999' },
]

const DEFAULT_COMMUNITIES = {
  'morning-ritual-circle': {
    name: 'Morning Ritual Circle',
    description: 'Start every day with intention. Breathwork, gratitude, and grounding rituals shared by women who rise with purpose.',
    owner: 'Sarah M.',
    members: 248,
    coverPhoto: '/sage-bowl.jpg',
    accent: 'rgba(180,140,60,0.15)',
    accentSolid: '#B48C3C',
    posts: [
      { user: 'Sarah M.', text: 'This morning I did 10 minutes of breathwork before even checking my phone. The difference in my whole day was unreal.', time: '2 hours ago', hearts: 14 },
      { user: 'Amara J.', text: 'Gratitude list: 1) the quiet before everyone wakes up 2) hot water with lemon 3) this community', time: '5 hours ago', hearts: 22 },
      { user: 'Nadia C.', text: 'Anyone else doing the sunrise meditation? The 5am alarm is brutal but the feeling after is everything.', time: 'Yesterday', hearts: 8 },
    ],
    events: [
      { title: 'Full Moon Meditation', date: 'April 5', time: '8 PM' },
      { title: 'Morning Ritual Workshop', date: 'April 12', time: '7 AM' },
    ],
  },
  'manifestation-lab': {
    name: 'Manifestation Lab',
    description: 'Visualize it. Believe it. Become it. A space for intention-setting, vision boards, and manifestation practices.',
    owner: 'Amara J.',
    members: 412,
    coverPhoto: '/crystal.jpg',
    accent: 'rgba(140,100,180,0.15)',
    accentSolid: '#8C64B4',
    posts: [
      { user: 'Amara J.', text: 'Remember: you don\'t attract what you want. You attract what you ARE. Become the energy of your desires.', time: '1 hour ago', hearts: 31 },
      { user: 'Maya R.', text: 'Updated my vision board today. Putting it here for accountability. This year is about expansion.', time: '4 hours ago', hearts: 18 },
      { user: 'Sarah M.', text: 'Wrote my intention 33 times this morning. My hand hurts but my belief is strong.', time: 'Yesterday', hearts: 15 },
    ],
    events: [
      { title: 'Vision Board Night', date: 'April 8', time: '7 PM' },
    ],
  },
  'pilates-sisters': {
    name: 'Pilates Sisters',
    description: 'Move with grace. Build strength from the inside out. Pilates flows, tips, and accountability.',
    owner: 'Nadia C.',
    members: 186,
    coverPhoto: '/yoga.jpg',
    accent: 'rgba(255,255,255,0.08)',
    accentSolid: '#999999',
    posts: [
      { user: 'Nadia C.', text: 'New 20-minute core flow just dropped. Your deep stabilizers will be on fire. In the best way.', time: '3 hours ago', hearts: 9 },
      { user: 'Sarah M.', text: 'Day 14 of daily Pilates. My posture has literally changed. My shoulders are back where they belong.', time: 'Yesterday', hearts: 16 },
    ],
    events: [
      { title: 'Live Mat Flow', date: 'April 10', time: '6 PM' },
      { title: 'Breathwork & Release', date: 'April 19', time: '6 PM' },
    ],
  },
  'mindful-mamas': {
    name: 'Mindful Mamas',
    description: 'Motherhood meets mindfulness. Breathe through the chaos. Find stillness in the beautiful mess.',
    owner: 'Maya R.',
    members: 156,
    coverPhoto: '/leaf-dark.jpg',
    accent: 'rgba(100,160,100,0.12)',
    accentSolid: '#64A064',
    posts: [
      { user: 'Maya R.', text: 'Today\'s win: I took 3 deep breaths before reacting when my toddler threw her oatmeal. Growth.', time: '1 hour ago', hearts: 28 },
      { user: 'Nadia C.', text: 'Nap time = meditation time. 10 minutes of silence. I guard it fiercely.', time: 'Yesterday', hearts: 19 },
    ],
    events: [],
  },
  'book-of-the-month': {
    name: 'Book of the Month',
    description: 'Nourish your mind. This month: "The Untethered Soul" by Michael Singer.',
    owner: 'Amara J.',
    members: 324,
    coverPhoto: '/palo-santo.jpg',
    accent: 'rgba(180,140,100,0.12)',
    accentSolid: '#B48C64',
    posts: [
      { user: 'Amara J.', text: 'Chapter 3 hit different. "You are not your thoughts." I\'ve heard it a thousand times but this time I felt it.', time: '2 hours ago', hearts: 24 },
      { user: 'Sarah M.', text: 'Reading before bed instead of scrolling. Night and day difference in my sleep quality.', time: 'Yesterday', hearts: 11 },
    ],
    events: [
      { title: 'Book Discussion: Ch 1-5', date: 'April 15', time: '8 PM' },
    ],
  },
  'digital-detox': {
    name: 'Digital Detox',
    description: 'Less screen, more scene. Weekly challenges to unplug, reconnect, and be present.',
    owner: 'Sarah M.',
    members: 89,
    coverPhoto: '/monstera.jpg',
    accent: 'rgba(80,140,100,0.12)',
    accentSolid: '#508C64',
    posts: [
      { user: 'Sarah M.', text: 'This week\'s challenge: no phone for the first hour after waking. Who\'s in?', time: '5 hours ago', hearts: 7 },
    ],
    events: [],
  },
}

export default function CommunityPage() {
  const navigate = useNavigate()
  const { slug } = useParams()

  // Load community customizations from localStorage
  const [customizations, setCustomizations] = useState(() => {
    try {
      const stored = localStorage.getItem(`stoa-community-${slug}`)
      return stored ? JSON.parse(stored) : {}
    } catch { return {} }
  })

  const [showEdit, setShowEdit] = useState(false)
  const [liked, setLiked] = useState({})

  const base = DEFAULT_COMMUNITIES[slug]
  if (!base) {
    return (
      <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: colors.bg }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontFamily: fonts.sans, fontSize: 16, color: colors.text, marginBottom: 12 }}>Community not found</p>
          <p onClick={() => navigate('/community')} style={{ fontFamily: fonts.sans, fontSize: 13, color: colors.text3, cursor: 'pointer' }}>Back to communities</p>
        </div>
      </div>
    )
  }

  const community = { ...base, ...customizations }

  function saveCustomization(key, value) {
    setCustomizations(prev => {
      const next = { ...prev, [key]: value }
      localStorage.setItem(`stoa-community-${slug}`, JSON.stringify(next))
      return next
    })
  }

  return (
    <div style={{
      height: '100%',
      overflowY: 'auto',
      background: colors.bg,
      WebkitOverflowScrolling: 'touch',
    }}>
      {/* Cover Hero */}
      <div style={{ position: 'relative', height: 260 }}>
        <img src={community.coverPhoto} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.1) 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, background: community.accent }} />

        {/* Back button */}
        <div style={{ position: 'absolute', top: 20, left: 20 }}>
          <div onClick={() => navigate('/community')} style={{
            width: 36, height: 36, borderRadius: 18,
            background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(10px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
          }}>
            <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2} strokeLinecap="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </div>
        </div>

        {/* Edit button (owner) */}
        <div style={{ position: 'absolute', top: 20, right: 20 }}>
          <div onClick={() => setShowEdit(!showEdit)} style={{
            width: 36, height: 36, borderRadius: 18,
            background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(10px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
          }}>
            <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2} strokeLinecap="round">
              <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
          </div>
        </div>

        {/* Community info */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '24px' }}>
          <h1 style={{ fontFamily: fonts.sans, fontSize: 24, fontWeight: 300, color: '#fff', marginBottom: 8, letterSpacing: -0.5 }}>
            {community.name}
          </h1>
          <p style={{ fontFamily: fonts.sans, fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>
            {community.description}
          </p>
          <div style={{ display: 'flex', gap: 16, marginTop: 12 }}>
            <p style={{ fontFamily: fonts.sans, fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>
              {community.members} members
            </p>
            <p style={{ fontFamily: fonts.sans, fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>
              By {community.owner}
            </p>
          </div>
        </div>
      </div>

      {/* Edit Panel */}
      {showEdit && (
        <div style={{ padding: '20px', background: colors.surface, borderBottom: `1px solid ${colors.border}` }}>
          <p style={{ fontFamily: fonts.sans, fontSize: 10, fontWeight: 600, color: colors.text3, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 14 }}>
            Customize Look
          </p>

          {/* Cover photo picker */}
          <p style={{ fontFamily: fonts.sans, fontSize: 12, color: colors.text2, marginBottom: 10 }}>Cover Photo</p>
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', marginBottom: 20, scrollbarWidth: 'none' }}>
            {PHOTO_OPTIONS.map(photo => (
              <div key={photo} onClick={() => saveCustomization('coverPhoto', photo)} style={{
                width: 64, height: 64, borderRadius: 10, overflow: 'hidden', flexShrink: 0, cursor: 'pointer',
                border: community.coverPhoto === photo ? '2px solid #fff' : '2px solid transparent',
              }}>
                <img src={photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            ))}
          </div>

          {/* Accent color picker */}
          <p style={{ fontFamily: fonts.sans, fontSize: 12, color: colors.text2, marginBottom: 10 }}>Accent Color</p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {ACCENT_PRESETS.map(preset => (
              <div key={preset.label} onClick={() => { saveCustomization('accent', preset.value); saveCustomization('accentSolid', preset.solid) }} style={{
                display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px',
                borderRadius: radius.pill, cursor: 'pointer',
                background: community.accentSolid === preset.solid ? 'rgba(255,255,255,0.1)' : 'transparent',
                border: `1px solid ${community.accentSolid === preset.solid ? 'rgba(255,255,255,0.2)' : colors.border}`,
              }}>
                <div style={{ width: 14, height: 14, borderRadius: 7, background: preset.solid }} />
                <span style={{ fontFamily: fonts.sans, fontSize: 11, color: colors.text2 }}>{preset.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Feed */}
      <div style={{ padding: '24px 20px 0' }}>
        <p style={{ fontFamily: fonts.sans, fontSize: 10, fontWeight: 600, color: colors.text3, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 14 }}>
          Feed
        </p>

        {/* Compose */}
        <div style={{
          background: colors.surface, borderRadius: 14, padding: '16px 18px',
          marginBottom: 14, display: 'flex', alignItems: 'center', gap: 12,
          border: `1px solid ${colors.border}`, cursor: 'pointer',
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: 16,
            background: 'rgba(255,255,255,0.06)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <span style={{ fontFamily: fonts.sans, fontSize: 12, color: colors.text2 }}>S</span>
          </div>
          <p style={{ fontFamily: fonts.sans, fontSize: 14, color: colors.text3, fontStyle: 'italic' }}>
            Share something...
          </p>
        </div>

        {/* Posts */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {community.posts.map((post, i) => (
            <div key={i} style={{ background: colors.surface, borderRadius: 14, padding: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 16,
                  background: community.accent,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <span style={{ fontFamily: fonts.sans, fontSize: 12, color: '#fff' }}>
                    {post.user.charAt(0)}
                  </span>
                </div>
                <div>
                  <p style={{ fontFamily: fonts.sans, fontSize: 13, fontWeight: 500, color: colors.text }}>{post.user}</p>
                  <p style={{ fontFamily: fonts.sans, fontSize: 10, color: colors.text3 }}>{post.time}</p>
                </div>
              </div>
              <p style={{ fontFamily: fonts.sans, fontSize: 14, color: colors.text2, lineHeight: 1.6, marginBottom: 14 }}>
                {post.text}
              </p>
              <button onClick={() => setLiked(prev => ({ ...prev, [i]: !prev[i] }))} style={{
                display: 'flex', alignItems: 'center', gap: 5,
                fontFamily: fonts.sans, fontSize: 12, color: liked[i] ? '#fff' : colors.text3,
                background: 'none', cursor: 'pointer', padding: '4px 8px', borderRadius: 8,
              }}>
                <svg width={14} height={14} viewBox="0 0 24 24" fill={liked[i] ? '#fff' : 'none'} stroke="currentColor" strokeWidth={1.8}>
                  <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                </svg>
                {post.hearts + (liked[i] ? 1 : 0)}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Events */}
      {community.events.length > 0 && (
        <div style={{ padding: '28px 20px 0' }}>
          <p style={{ fontFamily: fonts.sans, fontSize: 10, fontWeight: 600, color: colors.text3, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 14 }}>
            Upcoming
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {community.events.map((event, i) => (
              <div key={i} style={{
                background: colors.surface, borderRadius: 14, padding: '16px 18px',
                display: 'flex', alignItems: 'center', gap: 14,
                border: `1px solid ${colors.border}`,
              }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 12,
                  background: community.accent,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <span style={{ fontFamily: fonts.sans, fontSize: 11, fontWeight: 600, color: '#fff' }}>
                    {event.date.split(' ')[1]}
                  </span>
                </div>
                <div>
                  <p style={{ fontFamily: fonts.sans, fontSize: 14, fontWeight: 500, color: colors.text, marginBottom: 2 }}>
                    {event.title}
                  </p>
                  <p style={{ fontFamily: fonts.sans, fontSize: 12, color: colors.text3 }}>
                    {event.date} &middot; {event.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Members preview */}
      <div style={{ padding: '28px 20px 0' }}>
        <p style={{ fontFamily: fonts.sans, fontSize: 10, fontWeight: 600, color: colors.text3, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 14 }}>
          Members
        </p>
        <div style={{ display: 'flex', gap: -8 }}>
          {['S', 'A', 'N', 'M'].map((initial, i) => (
            <div key={i} style={{
              width: 40, height: 40, borderRadius: 20,
              background: community.accent,
              border: `2px solid ${colors.bg}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginLeft: i > 0 ? -8 : 0,
              zIndex: 4 - i,
            }}>
              <span style={{ fontFamily: fonts.sans, fontSize: 13, fontWeight: 500, color: '#fff' }}>{initial}</span>
            </div>
          ))}
          <div style={{
            width: 40, height: 40, borderRadius: 20,
            background: 'rgba(255,255,255,0.06)',
            border: `2px solid ${colors.bg}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginLeft: -8,
          }}>
            <span style={{ fontFamily: fonts.sans, fontSize: 10, color: colors.text3 }}>+{community.members - 4}</span>
          </div>
        </div>
      </div>

      {/* Bottom spacer */}
      <div style={{ height: 120 }} />
    </div>
  )
}
