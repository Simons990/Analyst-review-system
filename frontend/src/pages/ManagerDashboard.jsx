import { useState, useRef, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

// ─── NOTIFICATION BELL ────────────────────────────────────────────────────────

function NotificationBell({ notifications }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const unread = notifications.filter(n => !n.read).length

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button onClick={() => setOpen(p => !p)} style={nb.bellBtn}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        {unread > 0 && <span style={nb.badge}>{unread}</span>}
      </button>
      {open && (
        <div style={nb.dropdown}>
          <div style={nb.dropHeader}>
            <span style={nb.dropTitle}>Notifications</span>
            {unread > 0 && <span style={nb.unreadPill}>{unread} new</span>}
          </div>
          {notifications.length === 0 ? (
            <div style={nb.empty}><p style={nb.emptyText}>No notifications yet</p></div>
          ) : (
            notifications.map(n => (
              <div key={n.id} style={{ ...nb.item, backgroundColor: n.read ? '#fff' : '#f0f6ff' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: n.read ? '#cbd5e1' : '#1046a0', flexShrink: 0, marginTop: 4 }} />
                <div>
                  <p style={nb.msg}>{n.message}</p>
                  <p style={nb.time}>{n.time}</p>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}

const nb = {
  bellBtn: { position: 'relative', background: 'none', border: '1px solid #e2e8f0', borderRadius: '8px', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b' },
  badge: { position: 'absolute', top: '-6px', right: '-6px', backgroundColor: '#dc2626', color: '#fff', fontSize: '10px', fontWeight: '700', width: '16px', height: '16px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #fff' },
  dropdown: { position: 'absolute', top: '44px', right: '0', width: '320px', backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 8px 24px rgba(0,0,0,0.10)', zIndex: 200, overflow: 'hidden' },
  dropHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderBottom: '1px solid #f1f5f9', backgroundColor: '#f8fafc' },
  dropTitle: { fontSize: '13px', fontWeight: '600', color: '#0f1f3d' },
  unreadPill: { fontSize: '11px', fontWeight: '600', color: '#1046a0', backgroundColor: '#e6f1fb', padding: '2px 8px', borderRadius: '20px' },
  empty: { padding: '28px 16px', textAlign: 'center' },
  emptyText: { fontSize: '13px', color: '#94a3b8' },
  item: { display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '12px 16px', borderBottom: '1px solid #f1f5f9', cursor: 'pointer' },
  msg: { fontSize: '13px', color: '#0f1f3d', lineHeight: '1.5', marginBottom: '3px' },
  time: { fontSize: '11px', color: '#94a3b8' },
}

// ─── MANAGER DASHBOARD ────────────────────────────────────────────────────────

function ManagerDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [activeView, setActiveView] = useState('dashboard')
  const [selectedAnalyst, setSelectedAnalyst] = useState(null)

  const handleLogout = () => { logout(); navigate('/') }

  const managerNotifications = [
    { id: 1, message: 'Ama Kusi has submitted their Mid-Semester Review. Review it now.', time: '2 minutes ago', read: false },
    { id: 2, message: 'Kweku Owusu has submitted their End-of-Semester Review.', time: '1 hour ago', read: false },
    { id: 3, message: 'Abena Boateng has submitted their Mid-Semester Review.', time: 'Yesterday', read: true },
  ]

  const [analysts, setAnalysts] = useState([
    {
      id: 1, name: 'Ama Kusi', email: 'ama.kusi@gearupafrica.com', year_group: 1, track: 'Data Analytics / Engineering',
      reviews: [
        { type: 'Mid-Semester Review', period: 'Semester 1 · 2025', status: 'submitted', feedbackStatus: 'pending', feedbackData: null },
        { type: 'End-of-Semester Review', period: 'Semester 2 · 2025', status: 'pending', feedbackStatus: 'waiting', feedbackData: null },
      ],
    },
    {
      id: 2, name: 'Kweku Owusu', email: 'kweku.owusu@gearupafrica.com', year_group: 1, track: 'IB / Corp Finance',
      reviews: [
        { type: 'Mid-Semester Review', period: 'Semester 1 · 2025', status: 'submitted', feedbackStatus: 'done', feedbackData: { rating: 4, strengths: 'Strong delivery and excellent communication with the team.', development: 'Needs to work on financial modelling depth.', goals: 'Complete an advanced modelling course by next semester.' } },
        { type: 'End-of-Semester Review', period: 'Semester 2 · 2025', status: 'submitted', feedbackStatus: 'pending', feedbackData: null },
      ],
    },
    {
      id: 3, name: 'Efua Asante', email: 'efua.asante@gearupafrica.com', year_group: 2, track: 'Data Analytics / Engineering',
      reviews: [
        { type: 'Mid-Semester Review', period: 'Semester 1 · 2025', status: 'pending', feedbackStatus: 'waiting', feedbackData: null },
        { type: 'End-of-Semester Review', period: 'Semester 2 · 2025', status: 'pending', feedbackStatus: 'waiting', feedbackData: null },
      ],
    },
    {
      id: 4, name: 'Kofi Agyeman', email: 'kofi.agyeman@gearupafrica.com', year_group: 2, track: 'IB / Corp Finance',
      reviews: [
        { type: 'Mid-Semester Review', period: 'Semester 1 · 2025', status: 'submitted', feedbackStatus: 'done', feedbackData: { rating: 3, strengths: 'Good attitude and willingness to take feedback.', development: 'Presentation skills need significant improvement.', goals: 'Lead one client-facing presentation next semester.' } },
        { type: 'End-of-Semester Review', period: 'Semester 2 · 2025', status: 'pending', feedbackStatus: 'waiting', feedbackData: null },
      ],
    },
    {
      id: 5, name: 'Abena Boateng', email: 'abena.boateng@gearupafrica.com', year_group: 3, track: 'Data Analytics / Engineering',
      reviews: [
        { type: 'Mid-Semester Review', period: 'Semester 1 · 2025', status: 'submitted', feedbackStatus: 'pending', feedbackData: null },
        { type: 'End-of-Semester Review', period: 'Semester 2 · 2025', status: 'submitted', feedbackStatus: 'done', feedbackData: { rating: 5, strengths: 'Outstanding leadership and technical excellence throughout the semester.', development: 'Continue mentoring junior analysts more formally.', goals: 'Take on a team lead role in the next cohort project.' } },
      ],
    },
  ])

  const yearColors = {
    1: { bg: '#e6f1fb', color: '#0c447c', label: 'Year 1' },
    2: { bg: '#e1f5ee', color: '#085041', label: 'Year 2' },
    3: { bg: '#eeedfe', color: '#3c3489', label: 'Year 3' },
  }

  const totalSubmitted = analysts.reduce((acc, a) => acc + a.reviews.filter(r => r.status === 'submitted').length, 0)
  const totalPending = analysts.reduce((acc, a) => acc + a.reviews.filter(r => r.status === 'pending').length, 0)
  const totalFeedbackDue = analysts.reduce((acc, a) => acc + a.reviews.filter(r => r.feedbackStatus === 'pending').length, 0)

  const groupedByYear = {
    1: analysts.filter(a => a.year_group === 1),
    2: analysts.filter(a => a.year_group === 2),
    3: analysts.filter(a => a.year_group === 3),
  }

  // Updates feedbackStatus and saves the feedback content so manager can read it back
  const handleFeedbackSubmitted = (analystId, reviewType, feedbackData) => {
    setAnalysts(prev => prev.map(a => {
      if (a.id !== analystId) return a
      return {
        ...a,
        reviews: a.reviews.map(r =>
          r.type === reviewType
            ? { ...r, feedbackStatus: 'done', feedbackData }
            : r
        ),
      }
    }))
  }

  // Pass the latest analyst data when opening the view
  const handleViewAnalyst = (analyst) => {
    setSelectedAnalyst(analyst)
    setActiveView('analyst')
  }

  // Keep selectedAnalyst in sync when analysts state updates
  const currentAnalyst = selectedAnalyst
    ? analysts.find(a => a.id === selectedAnalyst.id)
    : null

  if (activeView === 'analyst' && currentAnalyst) {
    return (
      <AnalystReviewView
        analyst={currentAnalyst}
        onBack={() => setActiveView('dashboard')}
        yearColors={yearColors}
        onFeedbackSubmitted={handleFeedbackSubmitted}
      />
    )
  }

  return (
    <div style={s.page}>
      <nav style={s.nav}>
        <div style={s.navLeft}>
          <img src="/logo.png" alt="GearUp Africa" style={s.navLogo} />
          <span style={s.navBrand}>GearUp Africa</span>
        </div>
        <div style={s.navRight}>
          <span style={s.navName}>{user?.name || 'Manager'}</span>
          <div style={s.managerBadge}>Manager</div>
          <NotificationBell notifications={managerNotifications} />
          <button onClick={handleLogout} style={s.logoutBtn}>Sign out</button>
        </div>
      </nav>

      <div style={s.container}>
        <div style={s.pageHeader}>
          <h1 style={s.pageTitle}>Team dashboard</h1>
          <p style={s.pageSub}>GearUp Analyst Programme · 2025</p>
        </div>

        <div style={s.statsRow}>
          <div style={s.statCard}>
            <p style={s.statLabel}>Total analysts</p>
            <p style={s.statValue}>{analysts.length}</p>
          </div>
          <div style={s.statCard}>
            <p style={s.statLabel}>Reviews submitted</p>
            <p style={{ ...s.statValue, color: '#0f6e56' }}>{totalSubmitted}</p>
          </div>
          <div style={s.statCard}>
            <p style={s.statLabel}>Awaiting submission</p>
            <p style={{ ...s.statValue, color: '#854f0b' }}>{totalPending}</p>
          </div>
          <div style={s.statCard}>
            <p style={s.statLabel}>Feedback due</p>
            <p style={{ ...s.statValue, color: '#dc2626' }}>{totalFeedbackDue}</p>
          </div>
        </div>

        {[1, 2, 3].map(year => (
          <div key={year} style={s.yearSection}>
            <div style={s.yearHeader}>
              <div style={{ ...s.yearBadge, backgroundColor: yearColors[year].bg, color: yearColors[year].color }}>
                {yearColors[year].label}
              </div>
              <span style={s.yearCount}>
                {groupedByYear[year].length} analyst{groupedByYear[year].length !== 1 ? 's' : ''}
              </span>
            </div>

            <div style={s.analystTable}>
              <div style={s.tableHeader}>
                <span style={{ flex: 2 }}>Analyst</span>
                <span style={{ flex: 1.5 }}>Track</span>
                <span style={{ flex: 1.5 }}>Mid-semester</span>
                <span style={{ flex: 1.5 }}>End-of-semester</span>
                <span style={{ flex: 1 }}></span>
              </div>

              {groupedByYear[year].map(analyst => {
                const mid = analyst.reviews.find(r => r.type === 'Mid-Semester Review')
                const end = analyst.reviews.find(r => r.type === 'End-of-Semester Review')
                return (
                  <div key={analyst.id} style={s.tableRow}>
                    <div style={{ flex: 2 }}>
                      <div style={s.analystAvatar}>
                        <div style={s.avatarCircle}>
                          {analyst.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div style={s.analystName}>{analyst.name}</div>
                          <div style={s.analystEmail}>{analyst.email}</div>
                        </div>
                      </div>
                    </div>
                    <div style={{ flex: 1.5 }}>
                      <span style={s.trackPill}>
                        {analyst.track === 'Data Analytics / Engineering' ? 'Data & Eng' : 'IB / Corp Fin'}
                      </span>
                    </div>
                    <div style={{ flex: 1.5 }}>
                      <div style={s.statusStack}>
                        <ReviewStatusPill status={mid?.status} />
                        <FeedbackStatusPill feedbackStatus={mid?.feedbackStatus} />
                      </div>
                    </div>
                    <div style={{ flex: 1.5 }}>
                      <div style={s.statusStack}>
                        <ReviewStatusPill status={end?.status} />
                        <FeedbackStatusPill feedbackStatus={end?.feedbackStatus} />
                      </div>
                    </div>
                    <div style={{ flex: 1, textAlign: 'right' }}>
                      <button style={s.viewBtn} onClick={() => handleViewAnalyst(analyst)}>
                        View 
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ReviewStatusPill({ status }) {
  if (status === 'submitted') {
    return <span style={{ ...s.pill, backgroundColor: '#e1f5ee', color: '#085041' }}> Submitted</span>
  }
  return <span style={{ ...s.pill, backgroundColor: '#fff7ed', color: '#92400e', border: '1px solid #fcd34d' }}>○ Pending</span>
}

function FeedbackStatusPill({ feedbackStatus }) {
  if (feedbackStatus === 'done') {
    return <span style={{ ...s.pill, backgroundColor: '#eeedfe', color: '#3c3489' }}> Feedback sent</span>
  }
  if (feedbackStatus === 'pending') {
    return <span style={{ ...s.pill, backgroundColor: '#fff0f0', color: '#dc2626', border: '1px solid #fecaca' }}> Feedback due</span>
  }
  return <span style={{ ...s.pill, backgroundColor: '#f1f5f9', color: '#94a3b8' }}> Awaiting review</span>
}

// ─── ANALYST REVIEW VIEW ──────────────────────────────────────────────────────

function AnalystReviewView({ analyst, onBack, yearColors, onFeedbackSubmitted }) {
  const [activeTab, setActiveTab] = useState('mid')
  const [feedback, setFeedback] = useState({ rating: 0, strengths: '', development: '', goals: '' })
  const [editing, setEditing] = useState(false)

  const yearStyle = yearColors[analyst.year_group]

  const review = analyst.reviews.find(r =>
    activeTab === 'mid' ? r.type === 'Mid-Semester Review' : r.type === 'End-of-Semester Review'
  )

  const handleTabSwitch = (tab) => {
    setActiveTab(tab)
    setFeedback({ rating: 0, strengths: '', development: '', goals: '' })
    setEditing(false)
  }

  const handleFeedbackSubmit = (e) => {
    e.preventDefault()
    onFeedbackSubmitted(analyst.id, review.type, { ...feedback })
    setEditing(false)
  }

  const startEditing = () => {
    // Pre-fill form with existing feedback if already submitted
    if (review?.feedbackData) {
      setFeedback(review.feedbackData)
    }
    setEditing(true)
  }

  const ratingLabels = {
    0: 'Select a rating',
    1: 'Needs improvement',
    2: 'Developing',
    3: 'Meeting expectations',
    4: 'Exceeding expectations',
    5: 'Outstanding',
  }

  // Show read view if feedback already submitted and not currently editing
  const feedbackAlreadySent = review?.feedbackStatus === 'done'
  const showReadView = feedbackAlreadySent && !editing
  const showForm = !feedbackAlreadySent || editing

  return (
    <div style={s.page}>
      <nav style={s.nav}>
        <div style={s.navLeft}>
          <img src="/logo.png" alt="GearUp Africa" style={s.navLogo} />
          <span style={s.navBrand}>GearUp Africa</span>
        </div>
      </nav>

      <div style={s.container}>
        <button onClick={onBack} style={s.backLink}>← Back to dashboard</button>

        {/* ANALYST PROFILE */}
        <div style={s.profileCard}>
          <div style={s.profileAvatar}>
            {analyst.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div style={{ flex: 1 }}>
            <h1 style={s.profileName}>{analyst.name}</h1>
            <p style={s.profileEmail}>{analyst.email}</p>
            <p style={s.profileTrack}>{analyst.track}</p>
          </div>
          <div style={{ ...s.yearBadge, backgroundColor: yearStyle.bg, color: yearStyle.color, fontSize: '13px', padding: '6px 14px' }}>
            {yearStyle.label}
          </div>
        </div>

        {/* TABS */}
        <div style={s.tabRow}>
          {['mid', 'end'].map(tab => (
            <button
              key={tab}
              onClick={() => handleTabSwitch(tab)}
              style={{
                ...s.tabBtn,
                backgroundColor: activeTab === tab ? '#1046a0' : '#fff',
                color: activeTab === tab ? '#fff' : '#64748b',
                border: activeTab === tab ? 'none' : '1.5px solid #e2e8f0',
              }}
            >
              {tab === 'mid' ? '📋 Mid-semester review' : '📝 End-of-semester review'}
            </button>
          ))}
        </div>

        {review?.status === 'pending' ? (
          <div style={s.pendingCard}>
            <p style={{ fontSize: '32px', marginBottom: '12px' }}>⏳</p>
            <p style={{ fontSize: '15px', fontWeight: '600', color: '#0f1f3d', marginBottom: '6px' }}>
              Review not submitted yet
            </p>
            <p style={{ fontSize: '13px', color: '#64748b', maxWidth: '320px', margin: '0 auto', lineHeight: '1.6' }}>
              {analyst.name.split(' ')[0]} has not submitted their {activeTab === 'mid' ? 'mid' : 'end-of'}-semester review yet.
            </p>
          </div>
        ) : (
          <div style={s.reviewContent}>

            {/* ANALYST SUBMISSION — questions and answers */}
            <div style={s.reviewCard}>
              <h3 style={s.reviewSectionTitle}>Analyst submission</h3>

              <ReviewField label="Full name" value={analyst.name} />
              <ReviewField label="Email" value={analyst.email} />
              <ReviewField label="Track" value={analyst.track} />
              <ReviewField label="Semester" value={activeTab === 'mid' ? 'Year 1 Semester 1' : 'Year 1 Semester 2'} />
              <ReviewField label="Date submitted" value="June 10, 2025" />

              <ReviewTextBlock
                label="Top 2–3 accomplishments this semester"
                value="Led the financial modelling workshop for the cohort. Completed Bloomberg terminal certification. Delivered two sector reports ahead of schedule."
              />
              <ReviewTextBlock
                label="Challenges faced"
                value="Managing overlapping deadlines during Q3 earnings season was difficult."
              />
              <ReviewTextBlock
                label="How did you respond to those challenges?"
                value="Implemented time-blocking strategies and communicated capacity issues earlier to the team."
              />
              <ReviewTextBlock
                label="How well did you apply the guidance given to you?"
                value="Acted on structured reporting feedback from previous semester. Still working on conciseness in written deliverables."
              />
              <ReviewTextBlock
                label="Most meaningful real-world contribution"
                value="Delivered a market sizing analysis for a live client brief that was presented to senior partners."
              />
              <ReviewTextBlock
                label="How have you grown personally and professionally?"
                value="More comfortable leading cohort discussions. Started mentoring a Year 1 peer."
              />
              <ReviewTextBlock
                label="How did you contribute to the GearUp community?"
                value="Organized cohort study groups and supported two junior analysts with their modelling assignments."
              />
              <ReviewTextBlock
                label="What do you most want to develop next semester?"
                value="Lead a full sector report independently. Begin CFA Level 1 preparation."
              />

              {/* RATING GRID */}
              <div style={{ marginTop: '12px' }}>
                <p style={s.fieldLabel}>Performance ratings (self)</p>
                <div style={s.ratingDisplay}>
                  {[
                    { label: ' Technical skills', score: 4 },
                    { label: ' Miniships & real-world', score: 4 },
                    { label: ' Personal & prof dev', score: 3 },
                    { label: ' Community contribution', score: 5 },
                    { label: ' Applying guidance given', score: 4 },
                  ].map(r => (
                    <div key={r.label} style={s.ratingRow}>
                      <span style={s.ratingRowLabel}>{r.label}</span>
                      <div style={s.ratingDots}>
                        {[1,2,3,4,5].map(n => (
                          <div key={n} style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: n <= r.score ? '#1046a0' : '#e2e8f0' }} />
                        ))}
                        <span style={s.ratingScore}>{r.score}/5</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* AREAS WORKED ON */}
              <div style={{ marginTop: '16px' }}>
                <p style={s.fieldLabel}>Areas worked on this semester</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
                  {['Financial analysis', 'Data tools & software', 'Leadership & initiative', 'Peer support & mentoring', 'Real-world project delivery'].map(a => (
                    <span key={a} style={s.areaPill}>{a}</span>
                  ))}
                </div>
              </div>

              <ReviewField label="Overall self-rating" value="4 / 5 — Exceeding expectations" />
            </div>

            {/* MANAGER FEEDBACK CARD */}
            <div style={s.feedbackCard}>

              {/* Header with edit button */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '16px', borderBottom: '1px solid #f0f4f8', marginBottom: '20px' }}>
                <div>
                  <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#0f1f3d', marginBottom: '2px' }}>
                    Your feedback
                  </h3>
                  <p style={{ fontSize: '12px', color: '#94a3b8' }}>
                    {feedbackAlreadySent
                      ? `${analyst.name.split(' ')[0]} can see this feedback`
                      : 'Only you and the analyst will see this feedback'}
                  </p>
                </div>
                {/* Edit button — only shows when feedback has been submitted */}
                {showReadView && (
                  <button onClick={startEditing} style={s.editBtn}>
                    Edit feedback
                  </button>
                )}
              </div>

              {/* READ VIEW — manager sees what they wrote */}
              {showReadView && review?.feedbackData && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                  <div style={s.feedbackSentBanner}>
                    <span></span>
                    <span>Feedback submitted · {analyst.name.split(' ')[0]} has been notified</span>
                  </div>

                  {/* Overall rating display */}
                  <div>
                    <p style={{ ...s.fieldLabel, marginBottom: '8px' }}>Overall performance rating</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {[1,2,3,4,5].map(n => (
                        <div key={n} style={{
                          width: '36px', height: '36px', borderRadius: '8px',
                          backgroundColor: review.feedbackData.rating >= n ? '#1046a0' : '#f0f4f8',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '13px', fontWeight: '600',
                          color: review.feedbackData.rating >= n ? '#fff' : '#94a3b8',
                        }}>
                          {n}
                        </div>
                      ))}
                      <span style={s.ratingLabelActive}>
                        {ratingLabels[review.feedbackData.rating]}
                      </span>
                    </div>
                  </div>

                  {/* Written feedback the manager can read back */}
                  <div>
                    <p style={{ ...s.fieldLabel, marginBottom: '6px' }}>Strengths observed</p>
                    <p style={s.feedbackReadText}>{review.feedbackData.strengths}</p>
                  </div>
                  <div>
                    <p style={{ ...s.fieldLabel, marginBottom: '6px' }}>Areas for development</p>
                    <p style={s.feedbackReadText}>{review.feedbackData.development}</p>
                  </div>
                  <div>
                    <p style={{ ...s.fieldLabel, marginBottom: '6px' }}>Goals for next semester</p>
                    <p style={s.feedbackReadText}>{review.feedbackData.goals}</p>
                  </div>
                </div>
              )}

              {/* FORM — writing new feedback or editing existing */}
              {showForm && (
                <form onSubmit={handleFeedbackSubmit} style={s.feedbackForm}>
                  <div style={s.fieldGroup}>
                    <label style={s.label}>
                      Overall performance rating <span style={s.required}>*</span>
                    </label>
                    <div style={s.ratingBtnRow}>
                      {[1,2,3,4,5].map(n => (
                        <button
                          key={n}
                          type="button"
                          onClick={() => setFeedback(p => ({ ...p, rating: n }))}
                          style={{
                            ...s.ratingBtn,
                            backgroundColor: feedback.rating >= n ? '#1046a0' : '#f0f4f8',
                            color: feedback.rating >= n ? '#fff' : '#64748b',
                            border: feedback.rating >= n ? 'none' : '1.5px solid #e2e8f0',
                          }}
                        >
                          {n}
                        </button>
                      ))}
                      {feedback.rating > 0
                        ? <span style={s.ratingLabelActive}>{ratingLabels[feedback.rating]}</span>
                        : <span style={s.ratingLabel}>Select a rating</span>
                      }
                    </div>
                  </div>

                  <div style={s.fieldGroup}>
                    <label style={s.label}>Strengths observed <span style={s.required}>*</span></label>
                    <textarea
                      style={s.textarea}
                      value={feedback.strengths}
                      onChange={e => setFeedback(p => ({ ...p, strengths: e.target.value }))}
                      placeholder="What did this analyst do particularly well this semester?"
                      rows={3}
                      required
                    />
                  </div>

                  <div style={s.fieldGroup}>
                    <label style={s.label}>Areas for development <span style={s.required}>*</span></label>
                    <textarea
                      style={s.textarea}
                      value={feedback.development}
                      onChange={e => setFeedback(p => ({ ...p, development: e.target.value }))}
                      placeholder="What should this analyst focus on improving?"
                      rows={3}
                      required
                    />
                  </div>

                  <div style={s.fieldGroup}>
                    <label style={s.label}>Goals for next semester <span style={s.required}>*</span></label>
                    <textarea
                      style={s.textarea}
                      value={feedback.goals}
                      onChange={e => setFeedback(p => ({ ...p, goals: e.target.value }))}
                      placeholder="Set clear, actionable goals for the next review period..."
                      rows={3}
                      required
                    />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                    {editing && (
                      <button type="button" onClick={() => setEditing(false)} style={s.cancelBtn}>
                        Cancel
                      </button>
                    )}
                    <button type="submit" style={s.submitBtn}>
                      {editing ? 'Save change' : 'Submit feedback'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── HELPER COMPONENTS ────────────────────────────────────────────────────────

function ReviewField({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #f8fafc' }}>
      <span style={s.fieldLabel}>{label}</span>
      <span style={{ fontSize: '13px', color: '#0f1f3d', textAlign: 'right', maxWidth: '60%' }}>{value}</span>
    </div>
  )
}

function ReviewTextBlock({ label, value }) {
  return (
    <div style={{ padding: '10px 0', borderBottom: '1px solid #f8fafc' }}>
      <p style={{ ...s.fieldLabel, marginBottom: '6px' }}>{label}</p>
      <p style={{ fontSize: '13px', color: '#0f1f3d', lineHeight: '1.7', backgroundColor: '#f8fafc', padding: '10px 12px', borderRadius: '8px' }}>{value}</p>
    </div>
  )
}

// ─── STYLES ───────────────────────────────────────────────────────────────────

const s = {
  page: { minHeight: '100vh', backgroundColor: '#f0f4f8' },
  nav: { backgroundColor: '#fff', borderBottom: '1px solid #e2e8f0', padding: '0 32px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' },
  navLeft: { display: 'flex', alignItems: 'center', gap: '10px' },
  navLogo: { height: '28px', objectFit: 'contain' },
  navBrand: { fontSize: '15px', fontWeight: '600', color: '#0f1f3d' },
  navRight: { display: 'flex', alignItems: 'center', gap: '14px' },
  navName: { fontSize: '13px', color: '#64748b' },
  managerBadge: { fontSize: '12px', fontWeight: '600', padding: '4px 10px', borderRadius: '20px', backgroundColor: '#e6f1fb', color: '#0c447c' },
  logoutBtn: { fontSize: '13px', fontWeight: '500', color: '#64748b', background: 'none', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '6px 14px', cursor: 'pointer' },
  container: { maxWidth: '960px', margin: '0 auto', padding: '40px 24px 60px' },
  pageHeader: { marginBottom: '28px' },
  pageTitle: { fontSize: '24px', fontWeight: '700', color: '#0f1f3d', marginBottom: '4px' },
  pageSub: { fontSize: '14px', color: '#64748b' },
  statsRow: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '36px' },
  statCard: { backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '18px 20px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' },
  statLabel: { fontSize: '11px', color: '#94a3b8', fontWeight: '500', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.04em' },
  statValue: { fontSize: '28px', fontWeight: '700', color: '#0f1f3d' },
  yearSection: { marginBottom: '28px' },
  yearHeader: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' },
  yearBadge: { fontSize: '12px', fontWeight: '600', padding: '4px 12px', borderRadius: '20px' },
  yearCount: { fontSize: '13px', color: '#94a3b8' },
  analystTable: { backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' },
  tableHeader: { display: 'flex', alignItems: 'center', padding: '12px 20px', backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', fontSize: '11px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em', gap: '12px' },
  tableRow: { display: 'flex', alignItems: 'center', padding: '14px 20px', borderBottom: '1px solid #f8fafc', gap: '12px' },
  analystAvatar: { display: 'flex', alignItems: 'center', gap: '10px' },
  avatarCircle: { width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#e6f1fb', color: '#0c447c', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '700', flexShrink: 0 },
  analystName: { fontSize: '13px', fontWeight: '500', color: '#0f1f3d', marginBottom: '2px' },
  analystEmail: { fontSize: '11px', color: '#94a3b8' },
  trackPill: { fontSize: '11px', fontWeight: '500', padding: '3px 8px', borderRadius: '20px', backgroundColor: '#f1f5f9', color: '#475569' },
  statusStack: { display: 'flex', flexDirection: 'column', gap: '4px' },
  pill: { fontSize: '11px', fontWeight: '600', padding: '3px 8px', borderRadius: '20px', display: 'inline-block' },
  viewBtn: { fontSize: '13px', fontWeight: '500', color: '#1046a0', backgroundColor: '#e6f1fb', border: 'none', borderRadius: '6px', padding: '6px 14px', cursor: 'pointer' },
  backLink: { background: 'none', border: 'none', fontSize: '13px', color: '#1046a0', fontWeight: '500', cursor: 'pointer', padding: '0', marginBottom: '24px', display: 'block' },
  profileCard: { backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '24px', display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' },
  profileAvatar: { width: '52px', height: '52px', borderRadius: '50%', backgroundColor: '#e6f1fb', color: '#0c447c', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: '700', flexShrink: 0 },
  profileName: { fontSize: '18px', fontWeight: '700', color: '#0f1f3d', marginBottom: '2px' },
  profileEmail: { fontSize: '13px', color: '#64748b', marginBottom: '4px' },
  profileTrack: { fontSize: '12px', color: '#1046a0', fontWeight: '500', backgroundColor: '#e6f1fb', display: 'inline-block', padding: '2px 8px', borderRadius: '20px' },
  tabRow: { display: 'flex', gap: '10px', marginBottom: '20px' },
  tabBtn: { padding: '9px 18px', borderRadius: '8px', fontSize: '13px', fontWeight: '500', cursor: 'pointer', fontFamily: 'inherit' },
  pendingCard: { backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '52px 24px', textAlign: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' },
  reviewContent: { display: 'flex', flexDirection: 'column', gap: '20px' },
  reviewCard: { backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '28px', display: 'flex', flexDirection: 'column', gap: '2px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' },
  reviewSectionTitle: { fontSize: '15px', fontWeight: '600', color: '#0f1f3d', paddingBottom: '14px', borderBottom: '1px solid #f0f4f8', marginBottom: '8px' },
  fieldLabel: { fontSize: '11px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em' },
  ratingDisplay: { marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '10px' },
  ratingRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  ratingRowLabel: { fontSize: '13px', color: '#0f1f3d' },
  ratingDots: { display: 'flex', alignItems: 'center', gap: '4px' },
  ratingScore: { fontSize: '12px', color: '#64748b', marginLeft: '6px' },
  areaPill: { fontSize: '11px', fontWeight: '500', padding: '4px 10px', borderRadius: '20px', backgroundColor: '#e6f1fb', color: '#1046a0' },
  feedbackCard: { backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '28px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' },
  // Green banner confirming feedback was sent — manager sees this when reading back
  feedbackSentBanner: { display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#e1f5ee', border: '1px solid #a7f3d0', borderRadius: '8px', padding: '10px 14px', color: '#085041', fontSize: '13px', fontWeight: '500' },
  // Text box showing the feedback the manager wrote
  feedbackReadText: { fontSize: '13px', color: '#0f1f3d', lineHeight: '1.7', backgroundColor: '#f8fafc', padding: '12px', borderRadius: '8px' },
  // Edit button so manager can update their feedback
  editBtn: { fontSize: '12px', fontWeight: '500', color: '#1046a0', backgroundColor: '#e6f1fb', border: 'none', borderRadius: '6px', padding: '6px 14px', cursor: 'pointer', fontFamily: 'inherit' },
  feedbackForm: { display: 'flex', flexDirection: 'column', gap: '20px' },
  fieldGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '13px', fontWeight: '500', color: '#1e293b' },
  required: { color: '#dc2626' },
  textarea: { padding: '11px 13px', borderRadius: '8px', border: '1.5px solid #e2e8f0', fontSize: '14px', color: '#0f1f3d', backgroundColor: '#f8fafc', outline: 'none', width: '100%', resize: 'vertical', lineHeight: '1.7', fontFamily: 'inherit' },
  ratingBtnRow: { display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' },
  ratingBtn: { width: '42px', height: '42px', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit' },
  ratingLabel: { fontSize: '13px', color: '#94a3b8', marginLeft: '6px' },
  ratingLabelActive: { fontSize: '13px', color: '#1046a0', fontWeight: '500', marginLeft: '6px', backgroundColor: '#e6f1fb', padding: '4px 10px', borderRadius: '20px' },
  cancelBtn: { padding: '11px 24px', borderRadius: '8px', fontSize: '14px', fontWeight: '500', color: '#64748b', backgroundColor: '#fff', border: '1.5px solid #e2e8f0', cursor: 'pointer', fontFamily: 'inherit' },
  submitBtn: { padding: '11px 28px', borderRadius: '8px', fontSize: '14px', fontWeight: '600', color: '#fff', backgroundColor: '#1046a0', border: 'none', cursor: 'pointer', fontFamily: 'inherit' },
}

export default ManagerDashboard

