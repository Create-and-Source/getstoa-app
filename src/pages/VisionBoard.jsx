import { useState } from 'react'
import { colors, fonts, radius } from '../theme'

const SAMPLE_PINS = [
  { type: 'image', src: '/harmony.jpg' },
  { type: 'affirmation', text: 'I am becoming the person I was always meant to be.' },
  { type: 'image', src: '/monstera.jpg' },
  { type: 'affirmation', text: 'She built a life so beautiful, it healed her.' },
  { type: 'image', src: '/palo-santo.jpg' },
  { type: 'affirmation', text: 'My peace is non-negotiable.' },
  { type: 'image', src: '/mindbody.jpg' },
  { type: 'image', src: '/routines.jpg' },
  { type: 'affirmation', text: 'I attract what I am, not what I want.' },
  { type: 'image', src: '/skin.jpg' },
  { type: 'affirmation', text: 'Dear body, I trust you.' },
  { type: 'image', src: '/mudra.jpg' },
]

const SEARCH_RESULTS = [
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80',
  'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=300&q=80',
  'https://images.unsplash.com/photo-1466781783364-36c955e42a7f?w=300&q=80',
  'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=300&q=80',
  'https://images.unsplash.com/photo-1490750967868-88aa4f44baee?w=300&q=80',
  'https://images.unsplash.com/photo-1506792006437-256b665541e2?w=300&q=80',
]

export default function VisionBoard() {
  const [pins, setPins] = useState(SAMPLE_PINS)
  const [showSearch, setShowSearch] = useState(false)
  const [showAddText, setShowAddText] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [newText, setNewText] = useState('')

  const addImagePin = (src) => {
    setPins(prev => [{ type: 'image', src }, ...prev])
    setShowSearch(false)
    setSearchQuery('')
  }

  const addTextPin = () => {
    if (!newText.trim()) return
    setPins(prev => [{ type: 'affirmation', text: newText.trim() }, ...prev])
    setNewText('')
    setShowAddText(false)
  }

  return (
    <div style={{
      height: '100%',
      overflowY: 'auto',
      background: colors.bg,
      paddingBottom: 140,
    }}>

      {/* Header */}
      <div style={{
        padding: '56px 24px 0',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: 20,
      }}>
        <h1 style={{
          fontFamily: fonts.sans, fontSize: 22, fontWeight: 700,
          color: colors.text,
        }}>
          Vision Board
        </h1>
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={() => { setShowSearch(!showSearch); setShowAddText(false) }}
            style={{
              fontFamily: fonts.sans, fontSize: 11, fontWeight: 600,
              color: showSearch ? colors.bg : '#fff',
              background: showSearch ? '#fff' : 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: radius.pill, padding: '8px 16px', cursor: 'pointer',
            }}
          >
            Search Images
          </button>
          <button
            onClick={() => { setShowAddText(!showAddText); setShowSearch(false) }}
            style={{
              fontFamily: fonts.sans, fontSize: 11, fontWeight: 600,
              color: showAddText ? colors.bg : '#fff',
              background: showAddText ? '#fff' : 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: radius.pill, padding: '8px 16px', cursor: 'pointer',
            }}
          >
            + Text
          </button>
        </div>
      </div>

      {/* Search panel */}
      {showSearch && (
        <div style={{ padding: '0 24px 20px' }}>
          <div style={{
            background: colors.surface, borderRadius: 12,
            padding: '12px 16px', marginBottom: 14,
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={colors.text3} strokeWidth={2} strokeLinecap="round">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search images... (wellness, nature, goals)"
              style={{
                flex: 1, fontFamily: fonts.sans, fontSize: 14,
                color: colors.text, background: 'none',
                '::placeholder': { color: colors.text3 },
              }}
            />
          </div>
          <p style={{
            fontFamily: fonts.sans, fontSize: 10, fontWeight: 600,
            color: colors.text3, letterSpacing: 2, textTransform: 'uppercase',
            marginBottom: 10,
          }}>
            Tap to pin
          </p>
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8,
          }}>
            {SEARCH_RESULTS.map((src, i) => (
              <div
                key={i}
                onClick={() => addImagePin(src)}
                style={{
                  height: 100, borderRadius: 10, overflow: 'hidden',
                  cursor: 'pointer', position: 'relative',
                }}
              >
                <img src={src} alt="" style={{
                  width: '100%', height: '100%', objectFit: 'cover',
                }} />
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'rgba(0,0,0,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  opacity: 0, transition: 'opacity 0.2s',
                }}>
                  <span style={{ color: '#fff', fontSize: 20 }}>+</span>
                </div>
              </div>
            ))}
          </div>

          {/* Upload from camera roll */}
          <button style={{
            width: '100%', marginTop: 12,
            fontFamily: fonts.sans, fontSize: 12, fontWeight: 600,
            color: colors.text3, background: 'none',
            border: `1px dashed ${colors.border}`,
            borderRadius: 12, padding: '14px 0', cursor: 'pointer',
          }}>
            Upload from Camera Roll
          </button>
        </div>
      )}

      {/* Add text panel */}
      {showAddText && (
        <div style={{ padding: '0 24px 20px' }}>
          <div style={{
            background: colors.surface, borderRadius: 12,
            padding: 16,
          }}>
            <textarea
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              placeholder="Type your affirmation, goal, or intention..."
              rows={3}
              style={{
                width: '100%', fontFamily: fonts.sans, fontSize: 14,
                color: colors.text, background: 'none', resize: 'none',
                lineHeight: 1.6,
              }}
            />
            <button
              onClick={addTextPin}
              style={{
                marginTop: 10, fontFamily: fonts.sans, fontSize: 12, fontWeight: 600,
                color: colors.bg, background: '#fff',
                borderRadius: radius.pill, padding: '10px 24px', cursor: 'pointer',
              }}
            >
              Add to Board
            </button>
          </div>
        </div>
      )}

      {/* Pinterest-style masonry grid */}
      <div style={{
        padding: '0 20px',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 10,
      }}>
        {pins.map((pin, i) => {
          if (pin.type === 'image') {
            // Alternate heights for masonry feel
            const heights = [200, 260, 180, 240, 220, 280, 190, 250]
            return (
              <div key={i} style={{
                borderRadius: 14, overflow: 'hidden',
                height: heights[i % heights.length],
                cursor: 'pointer',
                position: 'relative',
              }}>
                <img src={pin.src} alt="" style={{
                  width: '100%', height: '100%', objectFit: 'cover',
                }} />
              </div>
            )
          } else {
            // Affirmation card
            const bgs = ['#1A1A1A', '#1E2A20', '#2A2520', '#201E2A', '#2A2020']
            return (
              <div key={i} style={{
                borderRadius: 14, overflow: 'hidden',
                background: bgs[i % bgs.length],
                padding: '24px 18px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                minHeight: 160,
                cursor: 'pointer',
              }}>
                <p style={{
                  fontFamily: fonts.sans, fontSize: 14, fontWeight: 300,
                  color: 'rgba(255,255,255,0.8)', lineHeight: 1.7,
                  textAlign: 'center', letterSpacing: 0.3,
                }}>
                  "{pin.text}"
                </p>
              </div>
            )
          }
        })}
      </div>
    </div>
  )
}
