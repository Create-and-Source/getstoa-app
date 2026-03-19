import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { colors, fonts, radius } from '../theme'

const PLAYLISTS = {
  'morning-ritual': {
    title: 'Morning Ritual',
    curator: 'Sarah M.',
    description: 'Start your day with intention. Soft acoustic, ambient warmth, and gentle energy.',
    accent: '#4a6741',
    tracks: [
      { title: 'Golden Hour', artist: 'Novo Amor', duration: '4:12' },
      { title: 'Holocene', artist: 'Bon Iver', duration: '5:37' },
      { title: 'Breathe', artist: 'Fleurie', duration: '3:48' },
      { title: 'River', artist: 'Leon Bridges', duration: '4:05' },
      { title: 'i love you', artist: 'Billie Eilish', duration: '4:52' },
      { title: 'Skinny Love', artist: 'Birdy', duration: '3:55' },
      { title: 'Saturn', artist: 'SZA', duration: '3:31' },
      { title: 'Weightless', artist: 'Marconi Union', duration: '8:09' },
      { title: 'Clair de Lune', artist: 'Debussy', duration: '5:12' },
      { title: 'Bloom', artist: 'The Paper Kites', duration: '3:40' },
      { title: 'Northern Lights', artist: 'Ólafur Arnalds', duration: '4:22' },
      { title: 'Sunday Morning', artist: 'Surfaces', duration: '3:18' },
    ]
  },
  'deep-focus': {
    title: 'Deep Focus',
    curator: 'Amara J.',
    description: 'Instrumental and ambient. Disappear into your work or your practice.',
    accent: '#5c5040',
    tracks: [
      { title: 'Experience', artist: 'Ludovico Einaudi', duration: '5:15' },
      { title: 'Intro', artist: 'The xx', duration: '2:07' },
      { title: 'Nuvole Bianche', artist: 'Ludovico Einaudi', duration: '5:57' },
      { title: 'Divenire', artist: 'Ludovico Einaudi', duration: '6:42' },
      { title: 'Opus 23', artist: "Dustin O'Halloran", duration: '3:44' },
      { title: 'On The Nature of Daylight', artist: 'Max Richter', duration: '6:00' },
      { title: 'Time', artist: 'Hans Zimmer', duration: '4:35' },
      { title: 'A Moment Apart', artist: 'ODESZA', duration: '4:48' },
      { title: 'Re: Stacks', artist: 'Bon Iver', duration: '6:41' },
      { title: 'Dawn', artist: 'Ólafur Arnalds', duration: '3:11' },
      { title: 'Gymnopédie No.1', artist: 'Erik Satie', duration: '3:28' },
      { title: 'Arrival of the Birds', artist: 'The Cinematic Orchestra', duration: '5:42' },
      { title: 'Your Hand In Mine', artist: 'Explosions in the Sky', duration: '8:15' },
      { title: 'An Ending, A Beginning', artist: "Dustin O'Halloran", duration: '4:28' },
      { title: 'Sleep', artist: 'Ólafur Arnalds', duration: '3:55' },
      { title: 'Piano Concerto No. 2', artist: 'Rachmaninoff', duration: '4:10' },
      { title: 'Midnight', artist: 'Ólafur Arnalds', duration: '3:33' },
      { title: 'Porz Goret', artist: 'Yann Tiersen', duration: '5:02' },
    ]
  },
  'wind-down': {
    title: 'Wind Down',
    curator: 'Nadia C.',
    description: 'Let the day dissolve. Slow tempo, soft textures, permission to rest.',
    accent: '#4a4060',
    tracks: [
      { title: 'Moon River', artist: 'Frank Ocean', duration: '3:55' },
      { title: 'The Night We Met', artist: 'Lord Huron', duration: '3:28' },
      { title: 'Cherry Wine', artist: 'Hozier', duration: '4:13' },
      { title: 'Mystery of Love', artist: 'Sufjan Stevens', duration: '4:08' },
      { title: 'Solas', artist: 'Jamie Duffy', duration: '3:30' },
      { title: 'White Ferrari', artist: 'Frank Ocean', duration: '4:08' },
      { title: 'Liability', artist: 'Lorde', duration: '2:52' },
      { title: 'Pink + White', artist: 'Frank Ocean', duration: '3:04' },
      { title: 'La Vie En Rose', artist: 'Emily Watts', duration: '3:22' },
    ]
  },
  'movement-energy': {
    title: 'Movement Energy',
    curator: 'Sarah M.',
    description: 'Get your body moving. Upbeat but not aggressive. Energy with intention.',
    accent: '#604040',
    tracks: [
      { title: 'Levitating', artist: 'Dua Lipa', duration: '3:23' },
      { title: 'Electric Feel', artist: 'MGMT', duration: '3:49' },
      { title: 'Good Days', artist: 'SZA', duration: '4:39' },
      { title: 'Feel It Still', artist: 'Portugal. The Man', duration: '2:43' },
      { title: 'Golden', artist: 'Harry Styles', duration: '3:28' },
      { title: 'Sunflower', artist: 'Post Malone', duration: '2:38' },
      { title: 'Best Part', artist: 'Daniel Caesar', duration: '3:29' },
      { title: 'On & On', artist: 'Erykah Badu', duration: '5:21' },
      { title: 'Dreams', artist: 'Fleetwood Mac', duration: '4:14' },
      { title: 'High and Dry', artist: 'Radiohead', duration: '4:17' },
      { title: 'Cocoa Butter Kisses', artist: 'Chance the Rapper', duration: '5:09' },
      { title: 'Get You', artist: 'Daniel Caesar', duration: '4:37' },
      { title: 'Redbone', artist: 'Childish Gambino', duration: '5:26' },
      { title: 'Slide', artist: 'Calvin Harris', duration: '3:51' },
      { title: 'Location', artist: 'Khalid', duration: '3:39' },
    ]
  }
}

function parseDuration(str) {
  const [min, sec] = str.split(':').map(Number)
  return min * 60 + sec
}

function formatTotalDuration(tracks) {
  const totalSeconds = tracks.reduce((sum, t) => sum + parseDuration(t.duration), 0)
  const hrs = Math.floor(totalSeconds / 3600)
  const mins = Math.floor((totalSeconds % 3600) / 60)
  if (hrs > 0) return `${hrs} hr ${mins} min`
  return `${mins} min`
}

function EqBars({ accent }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, width: 14, height: 14 }}>
      {[0, 1, 2].map(i => (
        <div
          key={i}
          style={{
            width: 3,
            borderRadius: 1,
            background: accent,
            animation: `eqBar 0.8s ease-in-out ${i * 0.15}s infinite alternate`,
          }}
        />
      ))}
      <style>{`
        @keyframes eqBar {
          0% { height: 4px; }
          50% { height: 12px; }
          100% { height: 6px; }
        }
      `}</style>
    </div>
  )
}

export default function Playlist() {
  const navigate = useNavigate()
  const { slug } = useParams()
  const playlist = PLAYLISTS[slug] || PLAYLISTS['morning-ritual']
  const [currentTrack, setCurrentTrack] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)

  const totalDuration = formatTotalDuration(playlist.tracks)
  const current = playlist.tracks[currentTrack]

  const handleShuffle = () => {
    const randomIndex = Math.floor(Math.random() * playlist.tracks.length)
    setCurrentTrack(randomIndex)
    setIsPlaying(true)
  }

  const handlePlayAll = () => {
    setCurrentTrack(0)
    setIsPlaying(true)
  }

  const handleSkip = () => {
    setCurrentTrack(prev => (prev + 1) % playlist.tracks.length)
    setIsPlaying(true)
  }

  return (
    <div style={{
      height: '100%',
      overflowY: 'auto',
      background: colors.bg,
      fontFamily: fonts.sans,
      color: colors.text,
      paddingBottom: 160,
    }}>
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        style={{
          position: 'absolute',
          top: 16,
          left: 16,
          zIndex: 10,
          background: 'rgba(0,0,0,0.4)',
          border: 'none',
          borderRadius: radius.pill,
          width: 40,
          height: 40,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          backdropFilter: 'blur(8px)',
        }}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M12.5 15L7.5 10L12.5 5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {/* Header with accent gradient */}
      <div style={{
        background: `linear-gradient(180deg, ${playlist.accent} 0%, ${playlist.accent}88 40%, ${colors.bg} 100%)`,
        padding: '72px 24px 32px',
      }}>
        <h1 style={{
          fontSize: 32,
          fontWeight: 700,
          margin: 0,
          letterSpacing: '-0.02em',
          lineHeight: 1.15,
        }}>
          {playlist.title}
        </h1>
        <p style={{
          margin: '8px 0 0',
          fontSize: 14,
          color: 'rgba(255,255,255,0.7)',
          fontWeight: 400,
        }}>
          Curated by {playlist.curator}
        </p>
        <p style={{
          margin: '12px 0 0',
          fontSize: 13,
          color: 'rgba(255,255,255,0.55)',
          lineHeight: 1.5,
          maxWidth: 340,
        }}>
          {playlist.description}
        </p>
        <p style={{
          margin: '16px 0 0',
          fontSize: 12,
          color: colors.text3,
          fontWeight: 500,
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
        }}>
          {playlist.tracks.length} tracks &middot; {totalDuration}
        </p>
      </div>

      {/* Shuffle + Play buttons */}
      <div style={{
        display: 'flex',
        gap: 12,
        padding: '0 24px',
        marginTop: 8,
        marginBottom: 24,
      }}>
        <button
          onClick={handleShuffle}
          style={{
            flex: 1,
            height: 44,
            borderRadius: radius.pill,
            border: `1px solid ${colors.border}`,
            background: 'transparent',
            color: colors.text,
            fontSize: 14,
            fontWeight: 600,
            fontFamily: fonts.sans,
            cursor: 'pointer',
            letterSpacing: '0.01em',
          }}
        >
          Shuffle
        </button>
        <button
          onClick={handlePlayAll}
          style={{
            flex: 1,
            height: 44,
            borderRadius: radius.pill,
            border: 'none',
            background: '#fff',
            color: '#000',
            fontSize: 14,
            fontWeight: 600,
            fontFamily: fonts.sans,
            cursor: 'pointer',
            letterSpacing: '0.01em',
          }}
        >
          Play All
        </button>
      </div>

      {/* Track list */}
      <div style={{ padding: '0 24px' }}>
        {playlist.tracks.map((track, i) => {
          const isActive = currentTrack === i
          return (
            <div key={i}>
              <div
                onClick={() => { setCurrentTrack(i); setIsPlaying(true) }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '14px 0',
                  cursor: 'pointer',
                  transition: 'opacity 0.15s',
                }}
              >
                {/* Track number or eq bars */}
                <div style={{ width: 28, flexShrink: 0, display: 'flex', alignItems: 'center' }}>
                  {isActive && isPlaying ? (
                    <EqBars accent={playlist.accent} />
                  ) : (
                    <span style={{
                      fontSize: 13,
                      color: isActive ? playlist.accent : colors.text3,
                      fontFamily: fonts.sans,
                      fontWeight: 500,
                      fontVariantNumeric: 'tabular-nums',
                    }}>
                      {i + 1}
                    </span>
                  )}
                </div>

                {/* Title + Artist */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: 14,
                    fontWeight: 500,
                    color: isActive ? '#fff' : 'rgba(255,255,255,0.85)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}>
                    {track.title}
                  </div>
                  <div style={{
                    fontSize: 12,
                    color: isActive ? 'rgba(255,255,255,0.5)' : colors.text3,
                    marginTop: 2,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}>
                    {track.artist}
                  </div>
                </div>

                {/* Duration */}
                <span style={{
                  fontSize: 12,
                  color: colors.text3,
                  fontFamily: '"Source Code Pro", monospace',
                  marginLeft: 12,
                  flexShrink: 0,
                }}>
                  {track.duration}
                </span>
              </div>

              {/* Divider */}
              {i < playlist.tracks.length - 1 && (
                <div style={{
                  height: 1,
                  background: colors.border,
                  marginLeft: 28,
                }} />
              )}
            </div>
          )
        })}
      </div>

      {/* Now Playing bar */}
      {current && (
        <div style={{
          position: 'fixed',
          bottom: 80,
          left: 12,
          right: 12,
          background: colors.surface,
          borderRadius: 14,
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          border: `1px solid ${colors.border}`,
          backdropFilter: 'blur(20px)',
          zIndex: 50,
        }}>
          {/* Accent dot */}
          <div style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: playlist.accent,
            flexShrink: 0,
          }} />

          {/* Track info */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontSize: 13,
              fontWeight: 600,
              color: colors.text,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}>
              {current.title}
            </div>
            <div style={{
              fontSize: 11,
              color: colors.text2,
              marginTop: 1,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}>
              {current.artist}
            </div>
          </div>

          {/* Play/Pause */}
          <button
            onClick={() => setIsPlaying(prev => !prev)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 4,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {isPlaying ? (
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <rect x="5" y="4" width="4" height="14" rx="1" fill="#fff"/>
                <rect x="13" y="4" width="4" height="14" rx="1" fill="#fff"/>
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <path d="M6 4L18 11L6 18V4Z" fill="#fff"/>
              </svg>
            )}
          </button>

          {/* Skip */}
          <button
            onClick={handleSkip}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 4,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M4 4L12 10L4 16V4Z" fill="rgba(255,255,255,0.7)"/>
              <rect x="14" y="4" width="2.5" height="12" rx="0.5" fill="rgba(255,255,255,0.7)"/>
            </svg>
          </button>
        </div>
      )}
    </div>
  )
}
