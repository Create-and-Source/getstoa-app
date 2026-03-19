import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
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

export default function CreateCommunity() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [coverPhoto, setCoverPhoto] = useState(PHOTO_OPTIONS[0])
  const [accent, setAccent] = useState(ACCENT_PRESETS[0])

  const userName = (() => {
    try { return localStorage.getItem('stoa-profile-name') || 'You' } catch { return 'You' }
  })()

  function create() {
    if (!name.trim()) return

    const slug = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

    // Add to communities list
    try {
      const stored = localStorage.getItem('stoa-communities')
      const communities = stored ? JSON.parse(stored) : []

      // Check if slug already exists in stored list, if not add
      if (!communities.find(c => c.slug === slug)) {
        communities.push({
          slug,
          name: name.trim(),
          description: description.trim() || 'A new community.',
          owner: userName,
          members: 1,
          coverPhoto,
          accent: accent.value,
          accentSolid: accent.solid,
          joined: true,
        })
        localStorage.setItem('stoa-communities', JSON.stringify(communities))
      }
    } catch {}

    // Save community page customization
    localStorage.setItem(`stoa-community-${slug}`, JSON.stringify({
      coverPhoto,
      accent: accent.value,
      accentSolid: accent.solid,
    }))

    navigate(`/community/${slug}`)
  }

  return (
    <div style={{
      height: '100%',
      overflowY: 'auto',
      background: colors.bg,
      WebkitOverflowScrolling: 'touch',
    }}>
      {/* Header */}
      <div style={{ padding: '20px 20px 0', display: 'flex', alignItems: 'center', gap: 16 }}>
        <svg onClick={() => navigate(-1)} width={24} height={24} viewBox="0 0 24 24" fill="none" stroke={colors.text} strokeWidth={1.5} strokeLinecap="round" style={{ cursor: 'pointer', flexShrink: 0 }}>
          <polyline points="15 18 9 12 15 6" />
        </svg>
        <h1 style={{ fontFamily: fonts.sans, fontSize: 20, fontWeight: 300, color: colors.text }}>
          Create Community
        </h1>
      </div>

      {/* Cover preview */}
      <div style={{ position: 'relative', height: 180, margin: '24px 16px 0', borderRadius: 16, overflow: 'hidden' }}>
        <img src={coverPhoto} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.1) 60%, transparent 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, background: accent.value }} />
        <div style={{ position: 'absolute', bottom: 20, left: 22, right: 22 }}>
          <p style={{ fontFamily: fonts.sans, fontSize: 20, fontWeight: 400, color: '#fff' }}>
            {name || 'Community Name'}
          </p>
          <p style={{ fontFamily: fonts.sans, fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>
            By {userName}
          </p>
        </div>
      </div>

      {/* Form */}
      <div style={{ padding: '28px 20px' }}>
        {/* Name */}
        <p style={{ fontFamily: fonts.sans, fontSize: 12, color: colors.text2, marginBottom: 8 }}>Name</p>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Give it a name..."
          style={{
            width: '100%', background: colors.surface, border: `1px solid ${colors.border}`,
            borderRadius: 14, padding: '14px 18px', fontFamily: fonts.sans, fontSize: 15,
            color: colors.text, outline: 'none', marginBottom: 24,
          }}
        />

        {/* Description */}
        <p style={{ fontFamily: fonts.sans, fontSize: 12, color: colors.text2, marginBottom: 8 }}>Description</p>
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="What is this community about?"
          rows={3}
          style={{
            width: '100%', background: colors.surface, border: `1px solid ${colors.border}`,
            borderRadius: 14, padding: '14px 18px', fontFamily: fonts.sans, fontSize: 14,
            color: colors.text, outline: 'none', resize: 'none', lineHeight: 1.6, marginBottom: 24,
          }}
        />

        {/* Cover photo */}
        <p style={{ fontFamily: fonts.sans, fontSize: 12, color: colors.text2, marginBottom: 10 }}>Cover Photo</p>
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', marginBottom: 24, scrollbarWidth: 'none' }}>
          {PHOTO_OPTIONS.map(photo => (
            <div key={photo} onClick={() => setCoverPhoto(photo)} style={{
              width: 64, height: 64, borderRadius: 10, overflow: 'hidden', flexShrink: 0, cursor: 'pointer',
              border: coverPhoto === photo ? '2px solid #fff' : '2px solid transparent',
            }}>
              <img src={photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          ))}
        </div>

        {/* Accent color */}
        <p style={{ fontFamily: fonts.sans, fontSize: 12, color: colors.text2, marginBottom: 10 }}>Accent Color</p>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 36 }}>
          {ACCENT_PRESETS.map(preset => (
            <div key={preset.label} onClick={() => setAccent(preset)} style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px',
              borderRadius: radius.pill, cursor: 'pointer',
              background: accent.solid === preset.solid ? 'rgba(255,255,255,0.1)' : 'transparent',
              border: `1px solid ${accent.solid === preset.solid ? 'rgba(255,255,255,0.2)' : colors.border}`,
            }}>
              <div style={{ width: 14, height: 14, borderRadius: 7, background: preset.solid }} />
              <span style={{ fontFamily: fonts.sans, fontSize: 11, color: colors.text2 }}>{preset.label}</span>
            </div>
          ))}
        </div>

        {/* Create button */}
        <button onClick={create} style={{
          width: '100%', fontFamily: fonts.sans, fontSize: 14, fontWeight: 600,
          color: name.trim() ? '#fff' : colors.text3,
          background: name.trim() ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.04)',
          border: `1px solid ${name.trim() ? 'rgba(255,255,255,0.25)' : colors.border}`,
          borderRadius: radius.pill, padding: '16px 0', cursor: name.trim() ? 'pointer' : 'default',
          transition: 'all 0.2s',
        }}>
          Create Community
        </button>
      </div>

      <div style={{ height: 100 }} />
    </div>
  )
}
