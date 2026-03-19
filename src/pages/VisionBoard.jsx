import { useState, useEffect } from 'react'
import { colors, fonts, radius } from '../theme'

const CURATED_PHOTOS = [
  { src: '/skin.jpg', category: 'wellness' },
  { src: '/crystal.jpg', category: 'wellness' },
  { src: '/sage-bowl.jpg', category: 'wellness' },
  { src: '/palo-santo.jpg', category: 'wellness' },
  { src: '/mudra.jpg', category: 'movement' },
  { src: '/yoga.jpg', category: 'movement' },
  { src: '/mindbody.jpg', category: 'movement' },
  { src: '/connection.jpg', category: 'movement' },
  { src: '/monstera.jpg', category: 'nature' },
  { src: '/leaf-dark.jpg', category: 'nature' },
  { src: '/water.jpg', category: 'nature' },
  { src: '/live-slowly.jpg', category: 'words' },
  { src: '/bodymindssoul.jpg', category: 'words' },
  { src: '/meditation.jpg', category: 'words' },
  { src: '/soul.jpg', category: 'words' },
  { src: '/whole.jpg', category: 'words' },
  { src: '/harmony.jpg', category: 'words' },
  { src: '/routines.jpg', category: 'words' },
]

const CATEGORIES = ['all', 'wellness', 'movement', 'nature', 'words']

const DEFAULT_AFFIRMATIONS = [
  'I am becoming the person I was always meant to be.',
  'She built a life so beautiful, it healed her.',
  'My peace is non-negotiable.',
  'I attract what I am, not what I want.',
  'Dear body, I trust you.',
]

function loadSavedPhotos() {
  try {
    const saved = localStorage.getItem('stoa-vision-photos')
    return saved ? JSON.parse(saved) : []
  } catch { return [] }
}

function loadSavedAffirmations() {
  try {
    const saved = localStorage.getItem('stoa-vision-affirmations')
    return saved ? JSON.parse(saved) : DEFAULT_AFFIRMATIONS
  } catch { return DEFAULT_AFFIRMATIONS }
}

function saveToDisk(photos, affirmations) {
  localStorage.setItem('stoa-vision-photos', JSON.stringify(photos))
  localStorage.setItem('stoa-vision-affirmations', JSON.stringify(affirmations))
}

export default function VisionBoard() {
  const [selectedPhotos, setSelectedPhotos] = useState(loadSavedPhotos)
  const [affirmations, setAffirmations] = useState(loadSavedAffirmations)
  const [showPicker, setShowPicker] = useState(false)
  const [showAddText, setShowAddText] = useState(false)
  const [activeCategory, setActiveCategory] = useState('all')
  const [newText, setNewText] = useState('')

  // Save whenever selections change
  useEffect(() => {
    saveToDisk(selectedPhotos, affirmations)
  }, [selectedPhotos, affirmations])

  const togglePhoto = (src) => {
    setSelectedPhotos(prev =>
      prev.includes(src)
        ? prev.filter(p => p !== src)
        : [...prev, src]
    )
  }

  const addAffirmation = () => {
    if (!newText.trim()) return
    setAffirmations(prev => [newText.trim(), ...prev])
    setNewText('')
    setShowAddText(false)
  }

  const removeAffirmation = (idx) => {
    setAffirmations(prev => prev.filter((_, i) => i !== idx))
  }

  const filteredPhotos = activeCategory === 'all'
    ? CURATED_PHOTOS
    : CURATED_PHOTOS.filter(p => p.category === activeCategory)

  // Build the board items from user selections
  const boardPhotos = selectedPhotos.length > 0
    ? selectedPhotos
    : CURATED_PHOTOS.slice(0, 6).map(p => p.src)

  // Interleave photos and affirmations for the masonry grid
  const boardItems = []
  let photoIdx = 0
  let affIdx = 0
  for (let i = 0; i < boardPhotos.length + affirmations.length; i++) {
    if (i % 3 === 2 && affIdx < affirmations.length) {
      boardItems.push({ type: 'affirmation', text: affirmations[affIdx++] })
    } else if (photoIdx < boardPhotos.length) {
      boardItems.push({ type: 'image', src: boardPhotos[photoIdx++] })
    } else if (affIdx < affirmations.length) {
      boardItems.push({ type: 'affirmation', text: affirmations[affIdx++] })
    }
  }

  return (
    <div style={{
      height: '100%',
      overflowY: 'auto',
      background: colors.bg,
      paddingBottom: 160,
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
            onClick={() => { setShowPicker(!showPicker); setShowAddText(false) }}
            style={{
              fontFamily: fonts.sans, fontSize: 11, fontWeight: 600,
              color: showPicker ? colors.bg : '#fff',
              background: showPicker ? '#fff' : 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: radius.pill, padding: '8px 16px', cursor: 'pointer',
            }}
          >
            Choose Photos
          </button>
          <button
            onClick={() => { setShowAddText(!showAddText); setShowPicker(false) }}
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

      {/* Photo Picker */}
      {showPicker && (
        <div style={{ padding: '0 24px 20px' }}>
          {/* Selection count */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            marginBottom: 14,
          }}>
            <p style={{
              fontFamily: fonts.sans, fontSize: 12, color: colors.text2,
            }}>
              {selectedPhotos.length} photo{selectedPhotos.length !== 1 ? 's' : ''} selected
            </p>
            {selectedPhotos.length > 0 && (
              <button
                onClick={() => setSelectedPhotos([])}
                style={{
                  fontFamily: fonts.sans, fontSize: 11, color: colors.text3,
                  background: 'none', cursor: 'pointer',
                }}
              >
                Clear all
              </button>
            )}
          </div>

          {/* Category tabs */}
          <div style={{
            display: 'flex', gap: 8, marginBottom: 16,
            overflowX: 'auto', paddingBottom: 4,
          }}>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  fontFamily: fonts.sans, fontSize: 11, fontWeight: 600,
                  letterSpacing: 1, textTransform: 'uppercase',
                  color: activeCategory === cat ? '#fff' : colors.text3,
                  background: activeCategory === cat ? 'rgba(255,255,255,0.12)' : 'transparent',
                  border: `1px solid ${activeCategory === cat ? 'rgba(255,255,255,0.2)' : colors.border}`,
                  borderRadius: radius.pill, padding: '8px 16px', cursor: 'pointer',
                  whiteSpace: 'nowrap', flexShrink: 0,
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Photo grid */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8,
          }}>
            {filteredPhotos.map((photo, i) => {
              const isSelected = selectedPhotos.includes(photo.src)
              return (
                <div
                  key={i}
                  onClick={() => togglePhoto(photo.src)}
                  style={{
                    height: 110, borderRadius: 12, overflow: 'hidden',
                    cursor: 'pointer', position: 'relative',
                    border: isSelected ? '2px solid #fff' : '2px solid transparent',
                  }}
                >
                  <img src={photo.src} alt="" style={{
                    width: '100%', height: '100%', objectFit: 'cover',
                  }} />
                  {/* Selected overlay */}
                  {isSelected && (
                    <div style={{
                      position: 'absolute', inset: 0,
                      background: 'rgba(0,0,0,0.3)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <div style={{
                        width: 28, height: 28, borderRadius: 14,
                        background: '#fff', display: 'flex',
                        alignItems: 'center', justifyContent: 'center',
                      }}>
                        <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Done button */}
          <button
            onClick={() => setShowPicker(false)}
            style={{
              width: '100%', marginTop: 16,
              fontFamily: fonts.sans, fontSize: 13, fontWeight: 600,
              color: colors.bg, background: '#fff',
              borderRadius: radius.pill, padding: '14px 0', cursor: 'pointer',
            }}
          >
            Done
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
              onClick={addAffirmation}
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
        {boardItems.map((pin, i) => {
          if (pin.type === 'image') {
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
            const bgs = ['#1A1A1A', '#1E2A20', '#2A2520', '#201E2A', '#2A2020']
            return (
              <div key={i} style={{
                borderRadius: 14, overflow: 'hidden',
                background: bgs[i % bgs.length],
                padding: '24px 18px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                minHeight: 160,
                cursor: 'pointer',
                position: 'relative',
              }}>
                <p style={{
                  fontFamily: fonts.sans, fontSize: 14, fontWeight: 300,
                  color: 'rgba(255,255,255,0.8)', lineHeight: 1.7,
                  textAlign: 'center', letterSpacing: 0.3,
                }}>
                  "{pin.text}"
                </p>
                {/* Remove button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    const affIndex = affirmations.indexOf(pin.text)
                    if (affIndex > -1) removeAffirmation(affIndex)
                  }}
                  style={{
                    position: 'absolute', top: 8, right: 8,
                    width: 24, height: 24, borderRadius: 12,
                    background: 'rgba(0,0,0,0.4)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', opacity: 0.5,
                  }}
                >
                  <svg width={10} height={10} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2.5} strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            )
          }
        })}
      </div>
    </div>
  )
}
