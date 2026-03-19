import { colors, fonts, radius, shadows } from '../theme'

export default function Profile() {
  return (
    <div style={{
      height: '100%',
      overflowY: 'auto',
      paddingBottom: 100,
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
          Your space
        </p>
        <h1 style={{
          fontFamily: fonts.serif,
          fontSize: 32,
          fontWeight: 400,
          color: colors.text,
          lineHeight: 1.2,
          marginBottom: 28,
        }}>
          Profile
        </h1>
      </div>

      {/* Avatar & Name */}
      <div style={{ padding: '0 24px 28px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{
          width: 80,
          height: 80,
          borderRadius: 40,
          background: colors.accentLight,
          border: `2px solid ${colors.accent}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 14,
        }}>
          <span style={{
            fontFamily: fonts.serif,
            fontSize: 28,
            color: colors.accent,
          }}>
            S
          </span>
        </div>
        <h2 style={{
          fontFamily: fonts.serif,
          fontSize: 22,
          fontWeight: 400,
          color: colors.text,
          marginBottom: 4,
        }}>
          Stoa Member
        </h2>
        <p style={{
          fontFamily: fonts.sans,
          fontSize: 13,
          color: colors.text3,
        }}>
          Member since March 2026
        </p>
      </div>

      {/* Settings List */}
      <div style={{ padding: '0 24px' }}>
        <div style={{
          background: colors.surface,
          borderRadius: radius.card,
          boxShadow: shadows.card,
          overflow: 'hidden',
        }}>
          {[
            'My Practitioners',
            'Notifications',
            'Integrations',
            'Appearance',
            'Practitioner Mode',
            'Privacy',
            'Help',
          ].map((item, i, arr) => (
            <div key={item} style={{
              padding: '16px 20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: i < arr.length - 1 ? `1px solid ${colors.border}` : 'none',
              cursor: 'pointer',
            }}>
              <span style={{
                fontFamily: fonts.sans,
                fontSize: 15,
                color: colors.text,
              }}>
                {item}
              </span>
              <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={colors.text3} strokeWidth={2} strokeLinecap="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
