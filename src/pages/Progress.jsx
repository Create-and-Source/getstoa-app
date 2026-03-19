import { colors, fonts, radius } from '../theme'

const WHEEL_CATEGORIES = [
  { label: 'Health', score: 7 },
  { label: 'Mind', score: 5 },
  { label: 'Finances', score: 4 },
  { label: 'Relationships', score: 8 },
  { label: 'Spiritual', score: 6 },
  { label: 'Career', score: 5 },
  { label: 'Experiences', score: 3 },
]

export default function Progress() {
  return (
    <div style={{
      height: '100%',
      overflowY: 'auto',
      paddingBottom: 140,
      background: colors.bg,
    }}>
      <div style={{ padding: '60px 24px 0' }}>
        <p style={{
          fontFamily: fonts.sans, fontSize: 10, fontWeight: 600,
          color: colors.text3, letterSpacing: 3, textTransform: 'uppercase',
          marginBottom: 4,
        }}>
          Your journey
        </p>
        <h1 style={{
          fontFamily: fonts.sans, fontSize: 28, fontWeight: 300,
          color: colors.text, lineHeight: 1.2, marginBottom: 28,
        }}>
          Progress
        </h1>
      </div>

      {/* Life Design Wheel */}
      <div style={{ padding: '0 24px 28px' }}>
        <p style={{
          fontFamily: fonts.sans, fontSize: 10, fontWeight: 600,
          color: colors.text3, letterSpacing: 3, textTransform: 'uppercase',
          marginBottom: 16,
        }}>
          Life Design Wheel
        </p>
        <div style={{
          background: colors.surface, borderRadius: 14, padding: 24,
        }}>
          {/* Wheel visualization */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
            <svg width={220} height={220} viewBox="0 0 220 220">
              {WHEEL_CATEGORIES.map((cat, i) => {
                const angle = (i / WHEEL_CATEGORIES.length) * Math.PI * 2 - Math.PI / 2
                const maxR = 90
                const r = (cat.score / 10) * maxR
                const x = 110 + Math.cos(angle) * r
                const y = 110 + Math.sin(angle) * r
                const labelR = maxR + 16
                const lx = 110 + Math.cos(angle) * labelR
                const ly = 110 + Math.sin(angle) * labelR

                return (
                  <g key={cat.label}>
                    <line
                      x1={110} y1={110}
                      x2={110 + Math.cos(angle) * maxR}
                      y2={110 + Math.sin(angle) * maxR}
                      stroke={colors.border}
                      strokeWidth={1}
                    />
                    <circle cx={x} cy={y} r={5} fill="#fff" />
                    <text
                      x={lx} y={ly}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill={colors.text2}
                      fontSize={10}
                      fontFamily={fonts.sans}
                    >
                      {cat.label}
                    </text>
                  </g>
                )
              })}
              <polygon
                points={WHEEL_CATEGORIES.map((cat, i) => {
                  const angle = (i / WHEEL_CATEGORIES.length) * Math.PI * 2 - Math.PI / 2
                  const r = (cat.score / 10) * 90
                  return `${110 + Math.cos(angle) * r},${110 + Math.sin(angle) * r}`
                }).join(' ')}
                fill="rgba(255,255,255,0.06)"
                stroke="rgba(255,255,255,0.3)"
                strokeWidth={1.5}
              />
              <circle cx={110} cy={110} r={90} fill="none" stroke={colors.border} strokeWidth={1} />
            </svg>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
            {WHEEL_CATEGORIES.map(cat => (
              <span key={cat.label} style={{
                fontFamily: fonts.mono, fontSize: 11,
                color: colors.text2,
                background: 'rgba(255,255,255,0.04)',
                borderRadius: 8, padding: '4px 10px',
              }}>
                {cat.label} {cat.score}/10
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Manifestation Log */}
      <div style={{ padding: '0 24px 28px' }}>
        <p style={{
          fontFamily: fonts.sans, fontSize: 10, fontWeight: 600,
          color: colors.text3, letterSpacing: 3, textTransform: 'uppercase',
          marginBottom: 14,
        }}>
          Manifestation Log
        </p>
        <div style={{ padding: '4px 0', marginBottom: 8 }}>
          <p style={{
            fontFamily: fonts.sans, fontSize: 12, color: colors.text3,
            letterSpacing: 0.5, fontStyle: 'italic',
          }}>
            Ask. Believe. Receive.
          </p>
        </div>
        <div style={{
          background: colors.surface, borderRadius: 14, padding: 20,
          display: 'flex', flexDirection: 'column', gap: 14,
        }}>
          {[
            { intention: 'Feel strong and confident in my body', status: 'in progress' },
            { intention: 'Find a meditation practice that sticks', status: 'received' },
            { intention: 'Wake up excited about my life', status: 'in progress' },
          ].map((item, i) => (
            <div key={i} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              paddingBottom: i < 2 ? 14 : 0,
              borderBottom: i < 2 ? `1px solid ${colors.border}` : 'none',
            }}>
              <span style={{
                fontFamily: fonts.sans, fontSize: 14, color: colors.text,
                flex: 1, paddingRight: 12,
              }}>
                {item.intention}
              </span>
              <span style={{
                fontFamily: fonts.mono, fontSize: 10,
                color: item.status === 'received' ? '#fff' : colors.text3,
                textTransform: 'uppercase', letterSpacing: 1,
                background: item.status === 'received' ? 'rgba(255,255,255,0.1)' : 'transparent',
                padding: item.status === 'received' ? '3px 8px' : 0,
                borderRadius: 6, whiteSpace: 'nowrap',
              }}>
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Neural Pathways */}
      <div style={{ padding: '0 24px 28px' }}>
        <p style={{
          fontFamily: fonts.sans, fontSize: 10, fontWeight: 600,
          color: colors.text3, letterSpacing: 3, textTransform: 'uppercase',
          marginBottom: 14,
        }}>
          Neural Pathways
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[
            { name: 'Morning meditation', days: 34, milestone: 'Day 21 passed — the pathway is forming' },
            { name: 'Journaling', days: 12, milestone: 'Building momentum' },
            { name: 'Water intake', days: 68, milestone: 'Almost automatic — day 66 milestone reached' },
          ].map((pathway, i) => (
            <div key={i} style={{
              background: colors.surface, borderRadius: 14, padding: 18,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                <span style={{ fontFamily: fonts.sans, fontSize: 14, fontWeight: 500, color: colors.text }}>
                  {pathway.name}
                </span>
                <span style={{ fontFamily: fonts.mono, fontSize: 12, color: '#fff' }}>
                  Day {pathway.days}
                </span>
              </div>
              <div style={{
                height: 4, borderRadius: 2,
                background: 'rgba(255,255,255,0.06)',
                marginBottom: 10, overflow: 'hidden',
              }}>
                <div style={{
                  height: '100%',
                  width: `${Math.min(pathway.days / 90 * 100, 100)}%`,
                  borderRadius: 2,
                  background: 'rgba(255,255,255,0.5)',
                  transition: 'width 0.5s ease',
                }} />
              </div>
              <p style={{
                fontFamily: fonts.sans, fontSize: 12,
                fontStyle: 'italic', color: colors.text3,
              }}>
                {pathway.milestone}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly/Monthly Summary */}
      <div style={{ padding: '0 24px 28px' }}>
        <p style={{
          fontFamily: fonts.sans, fontSize: 10, fontWeight: 600,
          color: colors.text3, letterSpacing: 3, textTransform: 'uppercase',
          marginBottom: 14,
        }}>
          This Week
        </p>
        <div style={{
          background: colors.surface, borderRadius: 14, padding: 20,
          display: 'flex', justifyContent: 'space-between',
        }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontFamily: fonts.sans, fontSize: 24, fontWeight: 300, color: colors.text }}>4.2</p>
            <p style={{ fontFamily: fonts.sans, fontSize: 10, color: colors.text3, marginTop: 4 }}>hrs movement</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontFamily: fonts.sans, fontSize: 24, fontWeight: 300, color: colors.text }}>98</p>
            <p style={{ fontFamily: fonts.sans, fontSize: 10, color: colors.text3, marginTop: 4 }}>min stillness</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontFamily: fonts.sans, fontSize: 24, fontWeight: 300, color: colors.text }}>6</p>
            <p style={{ fontFamily: fonts.sans, fontSize: 10, color: colors.text3, marginTop: 4 }}>journal entries</p>
          </div>
        </div>
      </div>
    </div>
  )
}
