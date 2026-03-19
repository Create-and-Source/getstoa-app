import { colors, fonts, radius, shadows } from '../theme'

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
          fontFamily: fonts.sans,
          fontSize: 13,
          fontWeight: 500,
          color: colors.text3,
          letterSpacing: 1.5,
          textTransform: 'uppercase',
          marginBottom: 4,
        }}>
          Your journey
        </p>
        <h1 style={{
          fontFamily: fonts.serif,
          fontSize: 32,
          fontWeight: 400,
          color: colors.text,
          lineHeight: 1.2,
          marginBottom: 28,
        }}>
          Progress
        </h1>
      </div>

      {/* Life Design Wheel */}
      <div style={{ padding: '0 24px 28px' }}>
        <h2 style={{
          fontFamily: fonts.serif,
          fontSize: 20,
          fontWeight: 400,
          color: colors.text,
          marginBottom: 16,
        }}>
          Life Design Wheel
        </h2>
        <div style={{
          background: colors.surface,
          borderRadius: radius.card,
          padding: 24,
          boxShadow: shadows.card,
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
                    {/* Grid line */}
                    <line
                      x1={110} y1={110}
                      x2={110 + Math.cos(angle) * maxR}
                      y2={110 + Math.sin(angle) * maxR}
                      stroke={colors.border}
                      strokeWidth={1}
                    />
                    {/* Score dot */}
                    <circle cx={x} cy={y} r={5} fill={colors.accent} />
                    {/* Label */}
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
              {/* Connect the dots */}
              <polygon
                points={WHEEL_CATEGORIES.map((cat, i) => {
                  const angle = (i / WHEEL_CATEGORIES.length) * Math.PI * 2 - Math.PI / 2
                  const r = (cat.score / 10) * 90
                  return `${110 + Math.cos(angle) * r},${110 + Math.sin(angle) * r}`
                }).join(' ')}
                fill={colors.accentLight}
                stroke={colors.accent}
                strokeWidth={1.5}
              />
              {/* Outer ring */}
              <circle cx={110} cy={110} r={90} fill="none" stroke={colors.border} strokeWidth={1} />
            </svg>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
            {WHEEL_CATEGORIES.map(cat => (
              <span key={cat.label} style={{
                fontFamily: fonts.mono,
                fontSize: 11,
                color: colors.text2,
                background: colors.bg,
                borderRadius: 8,
                padding: '4px 10px',
              }}>
                {cat.label} {cat.score}/10
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Manifestation Log */}
      <div style={{ padding: '0 24px 28px' }}>
        <h2 style={{
          fontFamily: fonts.serif,
          fontSize: 20,
          fontWeight: 400,
          color: colors.text,
          marginBottom: 14,
        }}>
          Manifestation Log
        </h2>
        <div style={{
          background: colors.surface,
          borderRadius: radius.card,
          padding: 20,
          boxShadow: shadows.card,
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
        }}>
          {[
            { intention: 'Feel strong and confident in my body', status: 'in progress' },
            { intention: 'Find a meditation practice that sticks', status: 'received' },
            { intention: 'Wake up excited about my life', status: 'in progress' },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{
                fontFamily: fonts.sans,
                fontSize: 14,
                color: colors.text,
              }}>
                {item.intention}
              </span>
              <span style={{
                fontFamily: fonts.mono,
                fontSize: 10,
                color: item.status === 'received' ? colors.accent : colors.text3,
                textTransform: 'uppercase',
                letterSpacing: 1,
              }}>
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Habit Pathways */}
      <div style={{ padding: '0 24px 28px' }}>
        <h2 style={{
          fontFamily: fonts.serif,
          fontSize: 20,
          fontWeight: 400,
          color: colors.text,
          marginBottom: 14,
        }}>
          Neural Pathways
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[
            { name: 'Morning meditation', days: 34, milestone: 'Day 21 passed — the pathway is forming' },
            { name: 'Journaling', days: 12, milestone: 'Building momentum' },
            { name: 'Water intake', days: 68, milestone: 'Almost automatic — day 66 milestone reached' },
          ].map((pathway, i) => (
            <div key={i} style={{
              background: colors.surface,
              borderRadius: radius.card,
              padding: 18,
              boxShadow: shadows.card,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontFamily: fonts.sans, fontSize: 14, fontWeight: 500, color: colors.text }}>
                  {pathway.name}
                </span>
                <span style={{ fontFamily: fonts.mono, fontSize: 12, color: colors.accent }}>
                  Day {pathway.days}
                </span>
              </div>
              {/* Groove visualization */}
              <div style={{
                height: 6,
                borderRadius: 3,
                background: colors.border,
                marginBottom: 8,
                overflow: 'hidden',
              }}>
                <div style={{
                  height: '100%',
                  width: `${Math.min(pathway.days / 90 * 100, 100)}%`,
                  borderRadius: 3,
                  background: `linear-gradient(90deg, ${colors.accent}, ${colors.accent}dd)`,
                  transition: 'width 0.5s ease',
                }} />
              </div>
              <p style={{
                fontFamily: fonts.sans,
                fontSize: 12,
                fontStyle: 'italic',
                color: colors.text3,
              }}>
                {pathway.milestone}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
