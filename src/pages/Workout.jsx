import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { colors, fonts, radius } from '../theme'

const WORKOUTS = {
  'morning-flow': {
    title: 'Morning Flow',
    type: 'Yoga',
    duration: '25 min',
    instructor: 'Sarah M.',
    specialty: 'Vinyasa & Breathwork',
    level: 'All Levels',
    description:
      'A gentle flow to wake up your body and set your intention for the day. Focus on breath-linked movement, hip openers, and heart openers.',
    expect: [
      'Gentle warm-up to ease into movement',
      'Breath-linked flow sequences',
      'Deep hip and heart openers',
      'Closing meditation with intention setting',
    ],
    moves: [
      { name: 'Centering Breath', duration: '2 min' },
      { name: 'Cat-Cow Flow', duration: '3 min' },
      { name: 'Sun Salutation A', duration: '5 min' },
      { name: 'Warrior Flow', duration: '5 min' },
      { name: 'Hip Openers', duration: '4 min' },
      { name: 'Heart Openers', duration: '3 min' },
      { name: 'Savasana', duration: '3 min' },
    ],
  },
  'sculpt-tone': {
    title: 'Sculpt & Tone',
    type: 'Pilates',
    duration: '30 min',
    instructor: 'Alina R.',
    specialty: 'Pilates & Barre',
    level: 'Intermediate',
    description:
      'A targeted pilates session designed to sculpt lean muscle and improve posture. Low-impact, high-intention movement.',
    expect: [
      'Core-focused warm-up',
      'Targeted glute and thigh sculpting',
      'Upper body toning with bodyweight',
      'Cool-down stretch series',
    ],
    moves: [
      { name: 'Pelvic Curls', duration: '3 min' },
      { name: 'Hundred', duration: '3 min' },
      { name: 'Single Leg Stretch', duration: '4 min' },
      { name: 'Side-Lying Leg Series', duration: '5 min' },
      { name: 'Bridge Pulses', duration: '4 min' },
      { name: 'Tricep Push-Ups', duration: '4 min' },
      { name: 'Plank Hold Series', duration: '4 min' },
      { name: 'Stretch & Release', duration: '3 min' },
    ],
  },
  'walk-breathe': {
    title: 'Walk + Breathe',
    type: 'Walking',
    duration: '20 min',
    instructor: 'Dani K.',
    specialty: 'Mindful Movement',
    level: 'All Levels',
    description:
      'A guided walking session pairing intentional movement with breathwork. Perfect for clearing your mind and boosting energy.',
    expect: [
      'Guided breathing to start',
      'Steady-pace mindful walking',
      'Interval bursts for energy',
      'Closing gratitude walk',
    ],
    moves: [
      { name: 'Standing Breathwork', duration: '2 min' },
      { name: 'Easy Pace Walk', duration: '4 min' },
      { name: 'Power Walk Interval', duration: '3 min' },
      { name: 'Recovery Walk', duration: '3 min' },
      { name: 'Power Walk Interval', duration: '3 min' },
      { name: 'Gratitude Walk', duration: '3 min' },
      { name: 'Cool-Down Stroll', duration: '2 min' },
    ],
  },
  'full-body': {
    title: 'Full Body Strength',
    type: 'Strength',
    duration: '35 min',
    instructor: 'Marcus T.',
    specialty: 'Functional Strength',
    level: 'Intermediate',
    description:
      'A full-body strength session using bodyweight and light weights. Build functional strength with compound movements.',
    expect: [
      'Dynamic warm-up to activate muscles',
      'Compound movements for full-body engagement',
      'Core stability work',
      'Guided cool-down and recovery',
    ],
    moves: [
      { name: 'Dynamic Warm-Up', duration: '4 min' },
      { name: 'Squat Variations', duration: '5 min' },
      { name: 'Push-Up Complex', duration: '4 min' },
      { name: 'Lunge Flow', duration: '5 min' },
      { name: 'Row & Pull Series', duration: '5 min' },
      { name: 'Core Circuit', duration: '5 min' },
      { name: 'Plank Finisher', duration: '3 min' },
      { name: 'Cool-Down Stretch', duration: '4 min' },
    ],
  },
  'stretch-release': {
    title: 'Stretch & Release',
    type: 'Recovery',
    duration: '20 min',
    instructor: 'Sarah M.',
    specialty: 'Vinyasa & Breathwork',
    level: 'All Levels',
    description:
      'A slow, restorative session focused on releasing tension and improving flexibility. Perfect for rest days or evening wind-down.',
    expect: [
      'Gentle breathing to calm the nervous system',
      'Long-hold stretches for deep release',
      'Foam roller guidance for tight spots',
      'Closing body scan meditation',
    ],
    moves: [
      { name: 'Breathing Reset', duration: '2 min' },
      { name: 'Neck & Shoulder Release', duration: '3 min' },
      { name: 'Seated Forward Fold', duration: '3 min' },
      { name: 'Supine Twist', duration: '3 min' },
      { name: 'Pigeon Pose Hold', duration: '4 min' },
      { name: 'Legs Up the Wall', duration: '3 min' },
      { name: 'Body Scan', duration: '2 min' },
    ],
  },
}

const PlayIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M4 2.5L13 8L4 13.5V2.5Z" fill={colors.text2} />
  </svg>
)

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path
      d="M3 8.5L6.5 12L13 4"
      stroke="#fff"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const BackArrow = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path
      d="M13 16L7 10L13 4"
      stroke="#fff"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export default function Workout() {
  const navigate = useNavigate()
  const { slug } = useParams()
  const workoutSlug = slug && WORKOUTS[slug] ? slug : 'morning-flow'
  const workout = WORKOUTS[workoutSlug]

  const [started, setStarted] = useState(false)
  const [paused, setPaused] = useState(false)
  const [completed, setCompleted] = useState([])
  const allDone = started && completed.length === workout.moves.length

  const currentIndex = completed.length

  function handleStart() {
    setStarted(true)
    setPaused(false)
    setCompleted([])
  }

  function handlePause() {
    setPaused((p) => !p)
  }

  function handleToggleMove(index) {
    if (!started || paused) return
    if (index !== currentIndex) return
    setCompleted((prev) => [...prev, index])
  }

  function handleSave() {
    // Demo only
    navigate(-1)
  }

  // Styles
  const s = {
    page: {
      height: '100%',
      overflowY: 'auto',
      background: colors.bg,
      color: colors.text,
      fontFamily: fonts.sans,
      paddingBottom: 160,
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '20px 20px 0',
    },
    backBtn: {
      background: 'none',
      border: 'none',
      padding: 4,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
    },
    typeBadge: {
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      color: colors.text2,
      background: colors.surface,
      border: `1px solid ${colors.border}`,
      borderRadius: radius.pill,
      padding: '4px 12px',
    },
    titleArea: {
      padding: '24px 20px 0',
    },
    title: {
      fontSize: 28,
      fontWeight: 700,
      letterSpacing: '-0.02em',
      lineHeight: 1.15,
      margin: 0,
    },
    meta: {
      display: 'flex',
      gap: 16,
      marginTop: 10,
      fontSize: 13,
      color: colors.text2,
    },
    metaDot: {
      color: colors.text3,
    },
    description: {
      fontSize: 14,
      lineHeight: 1.6,
      color: colors.text2,
      margin: '16px 0 0',
    },
    primaryBtn: {
      display: 'block',
      width: '100%',
      padding: '16px 0',
      margin: '28px 20px 0',
      maxWidth: 'calc(100% - 40px)',
      background: '#fff',
      color: '#0D0D0D',
      fontSize: 15,
      fontWeight: 700,
      fontFamily: fonts.sans,
      border: 'none',
      borderRadius: radius.pill,
      cursor: 'pointer',
      letterSpacing: '-0.01em',
    },
    pauseBtn: {
      display: 'block',
      width: '100%',
      padding: '16px 0',
      margin: '28px 20px 0',
      maxWidth: 'calc(100% - 40px)',
      background: 'transparent',
      color: '#fff',
      fontSize: 15,
      fontWeight: 700,
      fontFamily: fonts.sans,
      border: `1.5px solid ${colors.border}`,
      borderRadius: radius.pill,
      cursor: 'pointer',
      letterSpacing: '-0.01em',
    },
    section: {
      padding: '32px 20px 0',
    },
    sectionTitle: {
      fontSize: 15,
      fontWeight: 700,
      letterSpacing: '-0.01em',
      marginBottom: 14,
    },
    expectList: {
      listStyle: 'none',
      margin: 0,
      padding: 0,
    },
    expectItem: {
      fontSize: 14,
      lineHeight: 1.7,
      color: colors.text2,
      paddingLeft: 16,
      position: 'relative',
    },
    expectBullet: {
      position: 'absolute',
      left: 0,
      top: 0,
      color: colors.text3,
    },
    moveCard: {
      background: colors.surface,
      borderRadius: radius.card,
      border: `1px solid ${colors.border}`,
      overflow: 'hidden',
    },
    moveRow: (isActive, isDone) => ({
      display: 'flex',
      alignItems: 'center',
      padding: '14px 16px',
      gap: 12,
      borderBottom: `1px solid ${colors.border}`,
      cursor: started && !paused && isActive ? 'pointer' : 'default',
      background: isActive && started ? 'rgba(255,255,255,0.04)' : 'transparent',
      opacity: isDone ? 0.45 : 1,
      transition: 'background 0.2s, opacity 0.2s',
    }),
    moveNum: (isActive) => ({
      fontSize: 12,
      fontWeight: 700,
      color: isActive && started ? colors.text : colors.text3,
      minWidth: 18,
      textAlign: 'center',
    }),
    moveName: {
      flex: 1,
      fontSize: 14,
      fontWeight: 500,
    },
    moveDur: {
      fontSize: 12,
      color: colors.text3,
      marginRight: 4,
    },
    progress: {
      margin: '20px 20px 0',
      display: 'flex',
      gap: 4,
    },
    progressDot: (done) => ({
      flex: 1,
      height: 3,
      borderRadius: 2,
      background: done ? '#fff' : 'rgba(255,255,255,0.12)',
      transition: 'background 0.3s',
    }),
    instructorCard: {
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      background: colors.surface,
      borderRadius: radius.card,
      border: `1px solid ${colors.border}`,
      padding: '16px',
    },
    avatar: {
      width: 44,
      height: 44,
      borderRadius: '50%',
      background: 'rgba(255,255,255,0.08)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 16,
      fontWeight: 700,
      color: colors.text,
      flexShrink: 0,
    },
    instructorName: {
      fontSize: 14,
      fontWeight: 600,
      margin: 0,
    },
    instructorSpec: {
      fontSize: 12,
      color: colors.text2,
      margin: '2px 0 0',
    },
    viewProfile: {
      fontSize: 12,
      color: colors.text3,
      marginTop: 4,
      cursor: 'pointer',
      background: 'none',
      border: 'none',
      padding: 0,
      fontFamily: fonts.sans,
      textDecoration: 'underline',
      textUnderlineOffset: 2,
    },
    completeOverlay: {
      padding: '48px 20px 32px',
      textAlign: 'center',
    },
    completeTitle: {
      fontSize: 26,
      fontWeight: 700,
      letterSpacing: '-0.02em',
      marginBottom: 8,
    },
    completeTime: {
      fontSize: 14,
      color: colors.text2,
      marginBottom: 32,
    },
    textLink: {
      background: 'none',
      border: 'none',
      color: colors.text2,
      fontSize: 13,
      fontFamily: fonts.sans,
      cursor: 'pointer',
      padding: '12px 0',
      textDecoration: 'underline',
      textUnderlineOffset: 3,
    },
  }

  // ---- COMPLETE STATE ----
  if (allDone) {
    return (
      <div style={s.page}>
        <div style={s.header}>
          <button style={s.backBtn} onClick={() => navigate(-1)}>
            <BackArrow />
          </button>
        </div>
        <div style={s.completeOverlay}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>&#10003;</div>
          <div style={s.completeTitle}>Workout Complete</div>
          <div style={s.completeTime}>{workout.duration} total</div>
          <button style={{ ...s.primaryBtn, margin: '0 auto', maxWidth: 300 }} onClick={handleSave}>
            Save to Log
          </button>
          <div style={{ marginTop: 16 }}>
            <button style={s.textLink} onClick={() => navigate(-1)}>
              Back to Home
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ---- DEFAULT + IN-PROGRESS STATE ----
  return (
    <div style={s.page}>
      {/* Header */}
      <div style={s.header}>
        <button style={s.backBtn} onClick={() => navigate(-1)}>
          <BackArrow />
        </button>
        <span style={s.typeBadge}>{workout.type}</span>
      </div>

      {/* Title + Meta */}
      <div style={s.titleArea}>
        <h1 style={s.title}>{workout.title}</h1>
        <div style={s.meta}>
          <span>{workout.instructor}</span>
          <span style={s.metaDot}>·</span>
          <span>{workout.duration}</span>
          <span style={s.metaDot}>·</span>
          <span>{workout.level}</span>
        </div>
        <p style={s.description}>{workout.description}</p>
      </div>

      {/* Begin / Pause Button */}
      {!started ? (
        <button style={s.primaryBtn} onClick={handleStart}>
          Begin Workout
        </button>
      ) : (
        <button style={s.pauseBtn} onClick={handlePause}>
          {paused ? 'Resume' : 'Pause'}
        </button>
      )}

      {/* Progress indicator */}
      {started && (
        <div style={s.progress}>
          {workout.moves.map((_, i) => (
            <div key={i} style={s.progressDot(completed.includes(i))} />
          ))}
        </div>
      )}

      {/* What to Expect */}
      {!started && (
        <div style={s.section}>
          <div style={s.sectionTitle}>What to Expect</div>
          <ul style={s.expectList}>
            {workout.expect.map((item, i) => (
              <li key={i} style={s.expectItem}>
                <span style={s.expectBullet}>-</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Movement List */}
      <div style={s.section}>
        <div style={s.sectionTitle}>
          {started ? 'Progress' : 'Movements'}
        </div>
        <div style={s.moveCard}>
          {workout.moves.map((move, i) => {
            const isDone = completed.includes(i)
            const isActive = started && i === currentIndex
            return (
              <div
                key={i}
                style={s.moveRow(isActive, isDone)}
                onClick={() => handleToggleMove(i)}
              >
                <span style={s.moveNum(isActive)}>{isDone ? <CheckIcon /> : i + 1}</span>
                <span style={s.moveName}>{move.name}</span>
                <span style={s.moveDur}>{move.duration}</span>
                {!isDone && !started && <PlayIcon />}
              </div>
            )
          })}
        </div>
      </div>

      {/* Instructor Card */}
      <div style={s.section}>
        <div style={s.sectionTitle}>Instructor</div>
        <div style={s.instructorCard}>
          <div style={s.avatar}>{workout.instructor.charAt(0)}</div>
          <div>
            <div style={s.instructorName}>{workout.instructor}</div>
            <div style={s.instructorSpec}>{workout.specialty}</div>
            <button style={s.viewProfile}>View Profile</button>
          </div>
        </div>
      </div>
    </div>
  )
}
