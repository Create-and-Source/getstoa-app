import { colors, fonts } from '../theme'

export default function Train() {
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
          Your practice
        </p>
        <h1 style={{
          fontFamily: fonts.serif,
          fontSize: 32,
          fontWeight: 400,
          color: colors.text,
          lineHeight: 1.2,
          marginBottom: 24,
        }}>
          Movement
        </h1>

        <div style={{
          background: colors.surface,
          borderRadius: 20,
          padding: 24,
          boxShadow: '0 2px 20px rgba(26,24,22,0.06)',
          textAlign: 'center',
        }}>
          <p style={{
            fontFamily: fonts.serif,
            fontSize: 18,
            fontStyle: 'italic',
            color: colors.text2,
            lineHeight: 1.6,
          }}>
            Your training library is being built.
          </p>
          <p style={{
            fontFamily: fonts.sans,
            fontSize: 14,
            color: colors.text3,
            marginTop: 12,
          }}>
            Workouts, exercise library, and on-demand classes will live here.
          </p>
        </div>
      </div>
    </div>
  )
}
