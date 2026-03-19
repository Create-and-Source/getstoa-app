import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { colors, fonts, radius } from '../theme'

const DEFAULT_COMMUNITIES = [
  {
    slug: 'morning-ritual-circle',
    name: 'Morning Ritual Circle',
    description: 'Start every day with intention. Breathwork, gratitude, and grounding rituals shared by women who rise with purpose.',
    owner: 'Sarah M.',
    members: 248,
    coverPhoto: '/sage-bowl.jpg',
    accent: 'rgba(180,140,60,0.15)',
    accentSolid: '#B48C3C',
    joined: true,
  },
  {
    slug: 'manifestation-lab',
    name: 'Manifestation Lab',
    description: 'Visualize it. Believe it. Become it. A space for intention-setting, vision boards, and manifestation practices.',
    owner: 'Amara J.',
    members: 412,
    coverPhoto: '/crystal.jpg',
    accent: 'rgba(140,100,180,0.15)',
    accentSolid: '#8C64B4',
    joined: true,
  },
  {
    slug: 'pilates-sisters',
    name: 'Pilates Sisters',
    description: 'Move with grace. Build strength from the inside out. Pilates flows, tips, and accountability.',
    owner: 'Nadia C.',
    members: 186,
    coverPhoto: '/yoga.jpg',
    accent: 'rgba(255,255,255,0.08)',
    accentSolid: '#999999',
    joined: true,
  },
  {
    slug: 'mindful-mamas',
    name: 'Mindful Mamas',
    description: 'Motherhood meets mindfulness. Breathe through the chaos. Find stillness in the beautiful mess.',
    owner: 'Maya R.',
    members: 156,
    coverPhoto: '/leaf-dark.jpg',
    accent: 'rgba(100,160,100,0.12)',
    accentSolid: '#64A064',
    joined: false,
  },
  {
    slug: 'book-of-the-month',
    name: 'Book of the Month',
    description: 'Nourish your mind. This month: "The Untethered Soul" by Michael Singer.',
    owner: 'Amara J.',
    members: 324,
    coverPhoto: '/palo-santo.jpg',
    accent: 'rgba(180,140,100,0.12)',
    accentSolid: '#B48C64',
    joined: false,
  },
  {
    slug: 'digital-detox',
    name: 'Digital Detox',
    description: 'Less screen, more scene. Weekly challenges to unplug, reconnect, and be present.',
    owner: 'Sarah M.',
    members: 89,
    coverPhoto: '/monstera.jpg',
    accent: 'rgba(80,140,100,0.12)',
    accentSolid: '#508C64',
    joined: false,
  },
]

function getCommunities() {
  try {
    const stored = localStorage.getItem('stoa-communities')
    if (stored) return JSON.parse(stored)
  } catch {}
  return DEFAULT_COMMUNITIES
}

export default function Community() {
  const navigate = useNavigate()
  const [communities, setCommunities] = useState(getCommunities)

  const joined = communities.filter(c => c.joined)
  const discover = communities.filter(c => !c.joined)

  function handleJoin(slug) {
    setCommunities(prev => {
      const next = prev.map(c => c.slug === slug ? { ...c, joined: true } : c)
      localStorage.setItem('stoa-communities', JSON.stringify(next))
      return next
    })
  }

  return (
    <div style={{
      height: '100%',
      overflowY: 'auto',
      paddingBottom: 160,
      background: colors.bg,
      WebkitOverflowScrolling: 'touch',
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
          color: colors.text, lineHeight: 1.2, marginBottom: 28,
        }}>
          Communities
        </h1>
      </div>

      {/* Joined communities */}
      <div style={{ padding: '0 16px 28px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {joined.map(c => (
            <div
              key={c.slug}
              onClick={() => navigate(`/community/${c.slug}`)}
              style={{
                position: 'relative', borderRadius: 16, overflow: 'hidden',
                height: 180, cursor: 'pointer',
              }}
            >
              <img src={c.coverPhoto} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.1) 60%, transparent 100%)' }} />
              <div style={{ position: 'absolute', inset: 0, background: c.accent }} />
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px 22px' }}>
                <p style={{ fontFamily: fonts.sans, fontSize: 18, fontWeight: 400, color: '#fff', marginBottom: 4 }}>
                  {c.name}
                </p>
                <p style={{ fontFamily: fonts.sans, fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>
                  {c.members} members &middot; {c.owner}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Discover */}
      {discover.length > 0 && (
        <div style={{ padding: '0 16px 28px' }}>
          <p style={{
            fontFamily: fonts.sans, fontSize: 10, fontWeight: 600,
            color: colors.text3, letterSpacing: 3, textTransform: 'uppercase',
            marginBottom: 14, paddingLeft: 8,
          }}>
            Discover
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {discover.map(c => (
              <div key={c.slug} style={{
                background: colors.surface, borderRadius: 14, overflow: 'hidden',
                border: `1px solid ${colors.border}`,
              }}>
                <div style={{ position: 'relative', height: 100 }}>
                  <img src={c.coverPhoto} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', inset: 0, background: c.accent }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)' }} />
                </div>
                <div style={{ padding: '16px 18px' }}>
                  <p style={{ fontFamily: fonts.sans, fontSize: 16, fontWeight: 500, color: colors.text, marginBottom: 4 }}>
                    {c.name}
                  </p>
                  <p style={{ fontFamily: fonts.sans, fontSize: 12, color: colors.text3, lineHeight: 1.4, marginBottom: 12 }}>
                    {c.description}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <p style={{ fontFamily: fonts.sans, fontSize: 11, color: colors.text3 }}>
                      {c.members} members
                    </p>
                    <button onClick={(e) => { e.stopPropagation(); handleJoin(c.slug) }} style={{
                      fontFamily: fonts.sans, fontSize: 12, fontWeight: 600,
                      color: '#fff', background: 'rgba(255,255,255,0.1)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: radius.pill, padding: '8px 20px', cursor: 'pointer',
                    }}>
                      Join
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create */}
      <div style={{ padding: '0 16px 28px' }}>
        <div onClick={() => navigate('/community/create')} style={{
          borderRadius: 14, padding: '24px 20px',
          border: `1px dashed ${colors.border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          cursor: 'pointer',
        }}>
          <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={colors.text3} strokeWidth={1.5} strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          <span style={{ fontFamily: fonts.sans, fontSize: 14, color: colors.text3 }}>Create a Community</span>
        </div>
      </div>
    </div>
  )
}
