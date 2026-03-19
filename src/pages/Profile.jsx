import { colors, fonts, radius } from '../theme'

export default function Profile() {
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
          Your space
        </p>
        <h1 style={{
          fontFamily: fonts.sans, fontSize: 28, fontWeight: 300,
          color: colors.text, lineHeight: 1.2, marginBottom: 28,
        }}>
          Profile
        </h1>
      </div>

      {/* Avatar & Name */}
      <div style={{ padding: '0 24px 32px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{
          width: 80, height: 80, borderRadius: 40,
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.15)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 14,
        }}>
          <span style={{
            fontFamily: fonts.sans, fontSize: 28, fontWeight: 300, color: colors.text2,
          }}>
            S
          </span>
        </div>
        <h2 style={{
          fontFamily: fonts.sans, fontSize: 20, fontWeight: 400,
          color: colors.text, marginBottom: 4,
        }}>
          Stoa Member
        </h2>
        <p style={{
          fontFamily: fonts.sans, fontSize: 12, color: colors.text3,
        }}>
          Member since March 2026
        </p>
      </div>

      {/* My Practitioners — coming soon */}
      <div style={{ padding: '0 24px 20px' }}>
        <div style={{
          background: colors.surface, borderRadius: 14,
          padding: '20px', textAlign: 'center',
          border: `1px solid ${colors.border}`,
        }}>
          <p style={{
            fontFamily: fonts.sans, fontSize: 10, fontWeight: 600,
            color: colors.text3, letterSpacing: 3, textTransform: 'uppercase',
            marginBottom: 8,
          }}>
            My Practitioners
          </p>
          <p style={{
            fontFamily: fonts.sans, fontSize: 13, fontWeight: 300,
            color: colors.text2, lineHeight: 1.5,
          }}>
            Your trainer, therapist, and guides — all in one place.
          </p>
          <p style={{
            fontFamily: fonts.sans, fontSize: 11, color: colors.text3, marginTop: 8,
          }}>
            Coming soon
          </p>
        </div>
      </div>

      {/* Settings List */}
      <div style={{ padding: '0 24px' }}>
        <div style={{
          background: colors.surface, borderRadius: 14, overflow: 'hidden',
        }}>
          {[
            { label: 'Notifications', icon: 'bell' },
            { label: 'Integrations', icon: 'link', desc: 'Spotify, YouTube, Wearables' },
            { label: 'Appearance', icon: 'eye' },
            { label: 'Practitioner Mode', icon: 'toggle' },
            { label: 'Privacy', icon: 'lock' },
            { label: 'Help', icon: 'help' },
          ].map((item, i, arr) => (
            <div key={item.label} style={{
              padding: '16px 20px',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              borderBottom: i < arr.length - 1 ? `1px solid ${colors.border}` : 'none',
              cursor: 'pointer',
            }}>
              <div>
                <span style={{
                  fontFamily: fonts.sans, fontSize: 15, color: colors.text,
                }}>
                  {item.label}
                </span>
                {item.desc && (
                  <p style={{
                    fontFamily: fonts.sans, fontSize: 11, color: colors.text3, marginTop: 2,
                  }}>
                    {item.desc}
                  </p>
                )}
              </div>
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
