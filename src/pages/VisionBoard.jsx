import { useState, useEffect, useRef } from 'react'
import { colors, fonts, radius } from '../theme'

const PEXELS_KEY = import.meta.env.VITE_PEXELS_KEY || ''

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

const CURATED_CATEGORIES = ['all', 'wellness', 'movement', 'nature', 'words']

const SEARCH_SUGGESTIONS = [
  'wellness', 'self care', 'meditation', 'nature', 'ocean',
  'flowers', 'sunset', 'yoga', 'crystals', 'journaling',
  'mindfulness', 'aesthetic', 'cozy', 'plants', 'candles',
]

function getDefaultAffirmations(vibe) {
  const vibeAffirmation = vibe === 'her'
    ? 'She built a life so beautiful, it healed her.'
    : vibe === 'his'
      ? 'He built a life so powerful, it freed him.'
      : 'Build a life so beautiful, it heals you.'
  return [
    'I am becoming the person I was always meant to be.',
    vibeAffirmation,
    'My peace is non-negotiable.',
    'I attract what I am, not what I want.',
    'Dear body, I trust you.',
  ]
}

function loadSavedPhotos() {
  try {
    const saved = localStorage.getItem('stoa-vision-photos')
    return saved ? JSON.parse(saved) : []
  } catch { return [] }
}

function loadSavedAffirmations(vibe) {
  try {
    const saved = localStorage.getItem('stoa-vision-affirmations')
    return saved ? JSON.parse(saved) : getDefaultAffirmations(vibe)
  } catch { return getDefaultAffirmations(vibe) }
}

function saveToDisk(photos, affirmations) {
  localStorage.setItem('stoa-vision-photos', JSON.stringify(photos))
  localStorage.setItem('stoa-vision-affirmations', JSON.stringify(affirmations))
}

export default function VisionBoard() {
  const [vibe] = useState(() => {
    try { return localStorage.getItem('stoa-vibe') || 'universal' } catch { return 'universal' }
  })
  const [selectedPhotos, setSelectedPhotos] = useState(loadSavedPhotos)
  const [affirmations, setAffirmations] = useState(() => loadSavedAffirmations(vibe))
  const [showPicker, setShowPicker] = useState(false)
  const [showAddText, setShowAddText] = useState(false)
  const [pickerTab, setPickerTab] = useState('stoa') // 'stoa' | 'search'
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [searching, setSearching] = useState(false)
  const [searchError, setSearchError] = useState('')
  const [newText, setNewText] = useState('')
  const searchTimeout = useRef(null)

  // Save whenever selections change
  useEffect(() => {
    saveToDisk(selectedPhotos, affirmations)
  }, [selectedPhotos, affirmations])

  const searchPexels = async (query) => {
    if (!query.trim()) { setSearchResults([]); return }
    if (!PEXELS_KEY) {
      setSearchError('Pexels API key not configured')
      return
    }
    setSearching(true)
    setSearchError('')
    try {
      const res = await fetch(
        `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=18&orientation=portrait`,
        { headers: { Authorization: PEXELS_KEY } }
      )
      if (!res.ok) throw new Error('Search failed')
      const data = await res.json()
      setSearchResults(data.photos.map(p => ({
        id: p.id,
        src: p.src.medium,
        thumb: p.src.small,
        photographer: p.photographer,
      })))
    } catch {
      setSearchError('Could not load images. Try again.')
    } finally {
      setSearching(false)
    }
  }

  const handleSearchInput = (value) => {
    setSearchQuery(value)
    clearTimeout(searchTimeout.current)
    if (value.trim().length >= 2) {
      searchTimeout.current = setTimeout(() => searchPexels(value), 500)
    } else {
      setSearchResults([])
    }
  }

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

  // Build the board from user selections
  const boardPhotos = selectedPhotos.length > 0
    ? selectedPhotos
    : CURATED_PHOTOS.slice(0, 6).map(p => p.src)

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

  const hasPexels = !!PEXELS_KEY

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

          {/* Source tabs: STOA Collection | Search */}
          <div style={{
            display: 'flex', gap: 0, marginBottom: 16,
            background: colors.surface, borderRadius: 10, overflow: 'hidden',
          }}>
            <button
              onClick={() => setPickerTab('stoa')}
              style={{
                flex: 1, fontFamily: fonts.sans, fontSize: 12, fontWeight: 600,
                letterSpacing: 0.5,
                color: pickerTab === 'stoa' ? '#fff' : colors.text3,
                background: pickerTab === 'stoa' ? 'rgba(255,255,255,0.1)' : 'transparent',
                padding: '12px 0', cursor: 'pointer',
                borderBottom: pickerTab === 'stoa' ? '2px solid #fff' : '2px solid transparent',
              }}
            >
              STOA Collection
            </button>
            <button
              onClick={() => setPickerTab('search')}
              style={{
                flex: 1, fontFamily: fonts.sans, fontSize: 12, fontWeight: 600,
                letterSpacing: 0.5,
                color: pickerTab === 'search' ? '#fff' : colors.text3,
                background: pickerTab === 'search' ? 'rgba(255,255,255,0.1)' : 'transparent',
                padding: '12px 0', cursor: 'pointer',
                borderBottom: pickerTab === 'search' ? '2px solid #fff' : '2px solid transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              }}
            >
              <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              Search
            </button>
          </div>

          {/* STOA Collection tab */}
          {pickerTab === 'stoa' && (
            <>
              {/* Category filters */}
              <div style={{
                display: 'flex', gap: 8, marginBottom: 16,
                overflowX: 'auto', paddingBottom: 4,
              }}>
                {CURATED_CATEGORIES.map(cat => (
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

              {/* Curated photo grid */}
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
            </>
          )}

          {/* Search tab */}
          {pickerTab === 'search' && (
            <>
              {!hasPexels ? (
                <div style={{
                  background: colors.surface, borderRadius: 14, padding: '24px 20px',
                  textAlign: 'center',
                }}>
                  <svg width={32} height={32} viewBox="0 0 24 24" fill="none" stroke={colors.text3} strokeWidth={1.5} strokeLinecap="round" style={{ marginBottom: 12 }}>
                    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                  <p style={{ fontFamily: fonts.sans, fontSize: 14, fontWeight: 500, color: colors.text, marginBottom: 6 }}>
                    Image Search
                  </p>
                  <p style={{ fontFamily: fonts.sans, fontSize: 12, color: colors.text3, lineHeight: 1.6 }}>
                    Search millions of beautiful photos powered by Pexels.
                    Add your free API key to enable.
                  </p>
                  <p style={{ fontFamily: fonts.sans, fontSize: 11, color: colors.text3, marginTop: 12, opacity: 0.6 }}>
                    pexels.com/api &rarr; free key &rarr; add as VITE_PEXELS_KEY
                  </p>
                </div>
              ) : (
                <>
                  {/* Search input */}
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
                      onChange={(e) => handleSearchInput(e.target.value)}
                      placeholder="Search photos..."
                      autoFocus
                      style={{
                        flex: 1, fontFamily: fonts.sans, fontSize: 14,
                        color: colors.text, background: 'none',
                      }}
                    />
                    {searchQuery && (
                      <button
                        onClick={() => { setSearchQuery(''); setSearchResults([]) }}
                        style={{ cursor: 'pointer', display: 'flex' }}
                      >
                        <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={colors.text3} strokeWidth={2} strokeLinecap="round">
                          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    )}
                  </div>

                  {/* Suggestion chips (show when no query) */}
                  {!searchQuery && (
                    <div style={{
                      display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16,
                    }}>
                      {SEARCH_SUGGESTIONS.map(s => (
                        <button
                          key={s}
                          onClick={() => { setSearchQuery(s); searchPexels(s) }}
                          style={{
                            fontFamily: fonts.sans, fontSize: 11, fontWeight: 500,
                            color: colors.text2, background: colors.surface,
                            border: `1px solid ${colors.border}`,
                            borderRadius: radius.pill, padding: '7px 14px', cursor: 'pointer',
                          }}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Loading state */}
                  {searching && (
                    <div style={{ textAlign: 'center', padding: '40px 0' }}>
                      <p style={{ fontFamily: fonts.sans, fontSize: 13, color: colors.text3 }}>
                        Searching...
                      </p>
                    </div>
                  )}

                  {/* Error */}
                  {searchError && (
                    <div style={{ textAlign: 'center', padding: '20px 0' }}>
                      <p style={{ fontFamily: fonts.sans, fontSize: 13, color: colors.text3 }}>
                        {searchError}
                      </p>
                    </div>
                  )}

                  {/* Results grid */}
                  {searchResults.length > 0 && (
                    <>
                      <p style={{
                        fontFamily: fonts.sans, fontSize: 10, fontWeight: 600,
                        color: colors.text3, letterSpacing: 2, textTransform: 'uppercase',
                        marginBottom: 10,
                      }}>
                        Tap to add to your board
                      </p>
                      <div style={{
                        display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8,
                      }}>
                        {searchResults.map((photo) => {
                          const isSelected = selectedPhotos.includes(photo.src)
                          return (
                            <div
                              key={photo.id}
                              onClick={() => togglePhoto(photo.src)}
                              style={{
                                height: 130, borderRadius: 12, overflow: 'hidden',
                                cursor: 'pointer', position: 'relative',
                                border: isSelected ? '2px solid #fff' : '2px solid transparent',
                              }}
                            >
                              <img src={photo.thumb} alt="" style={{
                                width: '100%', height: '100%', objectFit: 'cover',
                              }} />
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
                              {/* Photographer credit */}
                              <div style={{
                                position: 'absolute', bottom: 0, left: 0, right: 0,
                                background: 'linear-gradient(transparent, rgba(0,0,0,0.6))',
                                padding: '12px 6px 4px',
                              }}>
                                <p style={{
                                  fontFamily: fonts.sans, fontSize: 8, color: 'rgba(255,255,255,0.5)',
                                  textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                                }}>
                                  {photo.photographer}
                                </p>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                      <p style={{
                        fontFamily: fonts.sans, fontSize: 10, color: colors.text3,
                        textAlign: 'center', marginTop: 12, opacity: 0.5,
                      }}>
                        Photos by Pexels
                      </p>
                    </>
                  )}
                </>
              )}
            </>
          )}

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
                {/* Remove button for Pexels photos */}
                {pin.src.startsWith('http') && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedPhotos(prev => prev.filter(p => p !== pin.src))
                    }}
                    style={{
                      position: 'absolute', top: 8, right: 8,
                      width: 24, height: 24, borderRadius: 12,
                      background: 'rgba(0,0,0,0.5)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer',
                    }}
                  >
                    <svg width={10} height={10} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2.5} strokeLinecap="round">
                      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                )}
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
