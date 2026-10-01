// import { useState, useRef, useEffect } from 'react'
// import { useAuth } from '../contexts/AuthContext'
// import { useNavigate } from 'react-router-dom'

// // ─── NOTIFICATION BELL COMPONENT (NEW) ───────────────────────────────────────
// // This is a brand new component that shows a bell icon with a dropdown list
// // of notifications. It is used in the nav bar.

// function NotificationBell({ notifications }) {
//   const [open, setOpen] = useState(false)
//   const ref = useRef(null)

//   // NEW: Close dropdown when clicking outside of it
//   useEffect(() => {
//     function handleClickOutside(e) {
//       if (ref.current && !ref.current.contains(e.target)) {
//         setOpen(false)
//       }
//     }
//     document.addEventListener('mousedown', handleClickOutside)
//     return () => document.removeEventListener('mousedown', handleClickOutside)
//   }, [])

//   const unread = notifications.filter(n => !n.read).length // NEW: count unread

//   return (
//     <div ref={ref} style={styles.bellWrapper}>
//       <button
//         onClick={() => setOpen(prev => !prev)}
//         style={styles.bellBtn}
//         aria-label="Notifications"
//       >
//         {/* NEW: Bell icon */}
//         <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//           <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
//           <path d="M13.73 21a2 2 0 0 1-3.46 0" />
//         </svg>
//         {/* NEW: Red dot badge showing unread count */}
//         {unread > 0 && (
//           <span style={styles.bellBadge}>{unread}</span>
//         )}
//       </button>

//       {/* NEW: Dropdown panel */}
//       {open && (
//         <div style={styles.notifDropdown}>
//           <div style={styles.notifHeader}>
//             <span style={styles.notifTitle}>Notifications</span>
//             {unread > 0 && (
//               <span style={styles.notifUnreadCount}>{unread} new</span>
//             )}
//           </div>
//           {notifications.length === 0 ? (
//             <div style={styles.notifEmpty}>
//               <p style={styles.notifEmptyText}>No notifications yet</p>
//             </div>
//           ) : (
//             <div>
//               {notifications.map(n => (
//                 <div key={n.id} style={{
//                   ...styles.notifItem,
//                   backgroundColor: n.read ? '#ffffff' : '#f0f6ff', // NEW: unread items have blue tint
//                 }}>
//                   <div style={styles.notifDot(n.read)} /> {/* NEW: blue dot for unread */}
//                   <div style={styles.notifBody}>
//                     <p style={styles.notifMessage}>{n.message}</p>
//                     <p style={styles.notifTime}>{n.time}</p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   )
// }

// // ─── MAIN DASHBOARD ───────────────────────────────────────────────────────────

// function AnalystDashboard() {
//   const { user, logout } = useAuth()
//   const navigate = useNavigate()
//   const [activeView, setActiveView] = useState('dashboard')
//   const [selectedReview, setSelectedReview] = useState(null)

//   const handleLogout = () => {
//     logout()
//     navigate('/')
//   }

//   const reviewPeriods = [
//     {
//       id: 'mid',
//       type: 'Mid-Semester Review',
//       status: 'pending',
//       deadline: 'June 15, 2025',
//       icon: '📋',
//       description: 'Reflect on your first half of the semester — achievements, challenges and growth.',
//     },
//     {
//       id: 'end',
//       type: 'End-of-Semester Review',
//       status: 'pending',
//       deadline: 'November 30, 2025',
//       icon: '📝',
//       description: 'Complete your full semester review and set goals for the next period.',
//     },
//   ]

//   const yearColors = {
//     1: { bg: '#e6f1fb', color: '#0c447c', label: 'Year 1' },
//     2: { bg: '#e1f5ee', color: '#085041', label: 'Year 2' },
//     3: { bg: '#eeedfe', color: '#3c3489', label: 'Year 3' },
//   }

//   const yearStyle = yearColors[user?.year_group] || yearColors[1]

//   // NEW: Sample notifications for the analyst.
//   // When the backend is connected, these will come from the API.
//   // Analysts see notifications when their manager submits feedback.
//   const analystNotifications = [
//     {
//       id: 1,
//       message: 'Your manager has submitted feedback on your Mid-Semester Review.',
//       time: 'Just now',
//       read: false, // NEW: unread = shows blue dot and badge
//     },
//   ]

//   if (activeView === 'form') {
//     return (
//       <ReviewForm
//         review={selectedReview}
//         user={user}
//         onBack={() => setActiveView('dashboard')}
//         yearColors={yearColors}
//       />
//     )
//   }

//   return (
//     <div style={styles.page}>

//       {/* NAV — added NotificationBell (NEW) */}
//       <nav style={styles.nav}>
//         <div style={styles.navLeft}>
//           <img src="/logo.png" alt="GearUp Africa" style={styles.navLogo} />
//           <span style={styles.navBrand}>GearUp Africa</span>
//         </div>
//         <div style={styles.navRight}>
//           <span style={styles.navName}>{user?.name || 'Analyst'}</span>
//           <div style={{ ...styles.yearBadge, backgroundColor: yearStyle.bg, color: yearStyle.color }}>
//             {yearStyle.label}
//           </div>
//           {/* NEW: Notification bell with analyst notifications */}
//           <NotificationBell notifications={analystNotifications} />
//           <button onClick={handleLogout} style={styles.logoutBtn}>Sign out</button>
//         </div>
//       </nav>

//       <div style={styles.container}>

//         {/* WELCOME BANNER */}
//         <div style={styles.welcomeSection}>
//           <div>
//             <p style={styles.welcomeEyebrow}>Welcome </p>
//             <h1 style={styles.welcomeTitle}>
//               {user?.name?.split(' ')[0] || 'Analyst'} 
//             </h1>
//             <p style={styles.welcomeSub}>
//               GearUp Analyst Programme · {yearStyle.label} · 2025
//             </p>
//           </div>
//           <div style={styles.progressCard}>
//             <p style={styles.progressLabel}>Programme progress</p>
//             <div style={styles.progressBar}>
//               <div style={{
//                 ...styles.progressFill,
//                 width: `${((user?.year_group || 1) / 3) * 100}%`,
//               }} />
//             </div>
//             <p style={styles.progressText}>Year {user?.year_group || 1} of 3</p>
//           </div>
//         </div>

//         {/* REVIEWS */}
//         <div style={styles.sectionHeader}>
//           <div>
//             <h2 style={styles.sectionTitle}>Your reviews</h2>
//             <p style={styles.sectionSub}>
//               Complete both reviews each semester. Your manager will review and provide personalised feedback.
//             </p>
//           </div>
//         </div>

//         <div style={styles.reviewGrid}>
//           {reviewPeriods.map((review) => (
//             <div key={review.id} style={styles.reviewCard}>
//               <div style={styles.reviewCardTop}>
//                 <span style={styles.reviewIcon}>{review.icon}</span>
//                 <span style={{
//                   ...styles.statusPill,
//                   backgroundColor: review.status === 'submitted' ? '#e1f5ee' : '#fff7ed',
//                   color: review.status === 'submitted' ? '#085041' : '#92400e',
//                   border: `1px solid ${review.status === 'submitted' ? '#a7f3d0' : '#fcd34d'}`,
//                 }}>
//                   {review.status === 'submitted' ? '✓ Submitted' : '○ Pending'}
//                 </span>
//               </div>
//               <h3 style={styles.reviewCardTitle}>{review.type}</h3>
//               <p style={styles.reviewCardDesc}>{review.description}</p>
//               <div style={styles.reviewCardMeta}>
//                 <span style={styles.metaLabel}>Deadline</span>
//                 <span style={styles.metaValue}>{review.deadline}</span>
//               </div>
//               <button
//                 style={{
//                   ...styles.reviewBtn,
//                   backgroundColor: review.status === 'submitted' ? '#ffffff' : '#1046a0',
//                   color: review.status === 'submitted' ? '#1046a0' : '#ffffff',
//                   border: review.status === 'submitted' ? '1.5px solid #1046a0' : 'none',
//                 }}
//                 onClick={() => {
//                   setSelectedReview(review)
//                   setActiveView('form')
//                 }}
//               >
//                 {review.status === 'submitted' ? 'View submission →' : 'Start review '}
//               </button>
//             </div>
//           ))}
//         </div>

//         {/* FEEDBACK SECTION */}
//         <div style={{ ...styles.sectionHeader, marginTop: '48px' }}>
//           <div>
//             <h2 style={styles.sectionTitle}>Feedback from your manager</h2>
//             <p style={styles.sectionSub}>
//               Feedback is private — only you and your manager can see it.
//             </p>
//           </div>
//         </div>

//         <div style={styles.feedbackEmpty}>
//           <div style={styles.feedbackEmptyIconWrap}>💬</div>
//           <p style={styles.feedbackEmptyText}>No feedback yet</p>
//           <p style={styles.feedbackEmptySub}>
//             Your manager's feedback will appear here once they review your submission.
//             You will be notified when it is ready.
//           </p>
//         </div>

//       </div>
//     </div>
//   )
// }

// // ─── REVIEW FORM ──────────────────────────────────────────────────────────────

// function ReviewForm({ review, user, onBack }) {
//   const isMid = review.id === 'mid'

//   const semesterOptions = isMid
//     ? ['Year 1 Semester 1', 'Year 2 Semester 1', 'Year 3 Semester 1']
//     : ['Year 1 Semester 2', 'Year 2 Semester 2', 'Year 3 Semester 2']

//   const trackOptions = [
//     'Data Analytics / Engineering',
//     'IB / Corp Finance',
//   ]

//   const ratingCategories = [
//     { key: 'technical', label: 'Technical skills' },
//     { key: 'miniships', label: ' Miniships & real-world' },
//     { key: 'personal', label: ' Personal & prof dev' },
//     { key: 'community', label: ' Community contribution' },
//     { key: 'guidance', label: ' Applying guidance given' },
//   ]

//   const areasOptions = [
//     'Financial analysis', 'Data tools & software',
//     'Real-world project delivery', 'Stakeholder communication',
//     'Leadership & initiative', 'Volunteering & service',
//     'Peer support & mentoring', 'Certifications',
//     'Extracurriculars', 'Mindset & adaptability',
//   ]

//   const ratingLabels = {
//     0: 'Select a rating',
//     1: 'Needs improvement',
//     2: 'Developing',
//     3: 'Meeting expectations',
//     4: 'Exceeding expectations',
//     5: 'Outstanding',
//   }

//   const [form, setForm] = useState({
//     fullName: user?.name || '',
//     email: user?.email || '',
//     semester: '',
//     track: '',
//     dateSubmitted: new Date().toISOString().split('T')[0],
//     accomplishments: '',
//     challenges: '',
//     response: '',
//     guidance: '',
//     contribution: '',
//     growth: '',
//     communityContribution: '',
//     development: '',
//     ratings: { technical: 0, miniships: 0, personal: 0, community: 0, guidance: 0 },
//     areas: [],
//     rating: 0,
//   })

//   const [submitted, setSubmitted] = useState(false)

//   const handleChange = (field, value) => {
//     setForm(prev => ({ ...prev, [field]: value }))
//   }

//   const handleRating = (category, value) => {
//     setForm(prev => ({
//       ...prev,
//       ratings: { ...prev.ratings, [category]: value },
//     }))
//   }

//   const handleAreaToggle = (area) => {
//     setForm(prev => ({
//       ...prev,
//       areas: prev.areas.includes(area)
//         ? prev.areas.filter(a => a !== area)
//         : [...prev.areas, area],
//     }))
//   }

//   const handleSubmit = (e) => {
//     e.preventDefault()
//     console.log('Review submitted:', form)
//     setSubmitted(true)
//   }

//   if (submitted) {
//     return (
//       <div style={styles.page}>
//         <div style={styles.container}>
//           <div style={styles.successCard}>
//             <div style={styles.successIconWrap}>✓</div>
//             <h2 style={styles.successTitle}>Review submitted!</h2>
//             <p style={styles.successSub}>
//               Your <strong>{review.type}</strong> has been submitted successfully.
//               Your manager will review it and provide feedback soon.
//             </p>
//             <button onClick={onBack} style={styles.submitBtn}>
//               ← Back to dashboard
//             </button>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div style={styles.page}>

//       {/* FORM NAV */}
//       <nav style={styles.nav}>
//         <div style={styles.navLeft}>
//           <img src="/logo.png" alt="GearUp Africa" style={styles.navLogo} />
//           <span style={styles.navBrand}>GearUp Africa</span>
//         </div>
//         <div style={styles.navRight}>
//           <span style={styles.navName}>{user?.name || 'Analyst'}</span>
//         </div>
//       </nav>

//       <div style={styles.container}>

//         <button onClick={onBack} style={styles.backLink}>
//           ← Back to dashboard
//         </button>

//         <div style={styles.formHeader}>
//           <div style={styles.formHeaderBadge}>
//             {isMid ? '📋 Mid-Semester' : '📝 End-of-Semester'}
//           </div>
//           <h1 style={styles.formTitle}>{review.type}</h1>
//           <p style={styles.formSub}>
//             Complete all sections honestly and specifically.
//           </p>
//         </div>

//         <form onSubmit={handleSubmit} style={styles.form}>

//           {/* ── CARD 1: PERSONAL INFORMATION ── */}
//           <div style={styles.formCard}>
//             <div style={styles.formCardHeader}>
//               <span style={styles.cardStep}>01</span>
//               <div>
//                 <h3 style={styles.formSectionTitle}>Personal information</h3>
//                 <p style={styles.formSectionSub}>Your basic details for this submission</p>
//               </div>
//             </div>

//             <div style={styles.formGrid}>
//               <Field label="Full name" required hint="As it appears on your GearUp profile">
//                 <input
//                   style={styles.input}
//                   value={form.fullName}
//                   onChange={e => handleChange('fullName', e.target.value)}
//                   placeholder="Your full name"
//                   required
//                 />
//               </Field>

//               <Field label="Email address" required hint="Your email for GearUp">
//                 <input
//                   style={styles.input}
//                   type="email"
//                   value={form.email}
//                   onChange={e => handleChange('email', e.target.value)}
//                   placeholder="your@email.com"
//                   required
//                 />
//               </Field>

//               <Field
//                 label="Year & Semester"
//                 required
//                 hint={isMid ? 'Select your current mid-year semester' : 'Select your current end-of-year semester'}
//               >
//                 <select
//                   style={styles.input}
//                   value={form.semester}
//                   onChange={e => handleChange('semester', e.target.value)}
//                   required
//                 >
//                   <option value="">Select your year & semester</option>
//                   {semesterOptions.map(opt => (
//                     <option key={opt} value={opt}>{opt}</option>
//                   ))}
//                 </select>
//               </Field>

//               <Field label="Track" required hint="Select the division you belong to">
//                 <select
//                   style={styles.input}
//                   value={form.track}
//                   onChange={e => handleChange('track', e.target.value)}
//                   required
//                 >
//                   <option value="">Select your track</option>
//                   {trackOptions.map(opt => (
//                     <option key={opt} value={opt}>{opt}</option>
//                   ))}
//                 </select>
//               </Field>

//               <Field label="Date submitted">
//                 <input
//                   style={styles.input}
//                   type="date"
//                   value={form.dateSubmitted}
//                   onChange={e => handleChange('dateSubmitted', e.target.value)}
//                 />
//               </Field>
//             </div>
//           </div>

//           {/* ── CARD 2: SELF REFLECTION ── */}
//           <div style={styles.formCard}>
//             <div style={styles.formCardHeader}>
//               <span style={styles.cardStep}>02</span>
//               <div>
//                 <h3 style={styles.formSectionTitle}>Analyst self-reflection</h3>
//                 <p style={styles.formSectionSub}>Completed by the analyst. Be specific and honest.</p>
//               </div>
//             </div>

//             <Field
//               label="Top 2–3 accomplishments this semester"
//               required
//               hint="Be specific — mention projects, skills learned, or measurable results achieved."
//             >
//               <textarea
//                 style={styles.textarea}
//                 value={form.accomplishments}
//                 onChange={e => handleChange('accomplishments', e.target.value)}
//                 placeholder="e.g. Led the financial modelling workshop for the cohort, completed Bloomberg certification..."
//                 rows={5}
//                 required
//               />
//             </Field>

//             <Field
//               label="Challenges faced"
//               required
//               hint="What obstacles did you encounter this semester?"
//             >
//               <textarea
//                 style={styles.textarea}
//                 value={form.challenges}
//                 onChange={e => handleChange('challenges', e.target.value)}
//                 placeholder="e.g. Struggled with time management during overlapping project deadlines..."
//                 rows={4}
//                 required
//               />
//             </Field>

//             <Field
//               label="How did you respond to those challenges?"
//               required
//               hint="What steps did you take? What would you do differently next time?"
//             >
//               <textarea
//                 style={styles.textarea}
//                 value={form.response}
//                 onChange={e => handleChange('response', e.target.value)}
//                 placeholder="e.g. Struggled to translate data findings into a clear narrative..."
//                 rows={4}
//                 required
//               />
//             </Field>

//             <Field
//               label="How well did you apply the guidance given to you?"
//               required
//               hint="Where did you act on feedback and where did you fall short?"
//             >
//               <textarea
//                 style={styles.textarea}
//                 value={form.guidance}
//                 onChange={e => handleChange('guidance', e.target.value)}
//                 placeholder="e.g. Implemented structured reporting feedback from my manager..."
//                 rows={4}
//                 required
//               />
//             </Field>

//             <Field
//               label="Most meaningful real-world contribution"
//               required
//               hint="A project, miniship, or deliverable with genuine impact"
//             >
//               <textarea
//                 style={styles.textarea}
//                 value={form.contribution}
//                 onChange={e => handleChange('contribution', e.target.value)}
//                 placeholder="e.g. Delivered market sizing analysis for a live client brief..."
//                 rows={4}
//                 required
//               />
//             </Field>

//             <Field
//               label="How have you grown personally and professionally?"
//               required
//               hint="Mindset shifts, leadership moments, volunteering, workshops, analyst identity"
//             >
//               <textarea
//                 style={styles.textarea}
//                 value={form.growth}
//                 onChange={e => handleChange('growth', e.target.value)}
//                 placeholder="e.g. More comfortable leading conversations, started mentoring junior peers..."
//                 rows={4}
//                 required
//               />
//             </Field>

//             <Field
//               label="How did you contribute to the GearUp community?"
//               required
//               hint="Peer support, extracurriculars, culture, mentoring, events"
//             >
//               <textarea
//                 style={styles.textarea}
//                 value={form.communityContribution}
//                 onChange={e => handleChange('communityContribution', e.target.value)}
//                 placeholder="e.g. Organized cohort study groups, supported two junior analysts..."
//                 rows={4}
//                 required
//               />
//             </Field>

//             <Field
//               label="What do you most want to develop next semester?"
//               required
//             >
//               <textarea
//                 style={styles.textarea}
//                 value={form.development}
//                 onChange={e => handleChange('development', e.target.value)}
//                 placeholder="e.g. Deepen financial modelling skills, take on a solo miniship brief..."
//                 rows={4}
//                 required
//               />
//             </Field>
//           </div>

//           {/* ── CARD 3: RATINGS ── */}
//           <div style={styles.formCard}>
//             <div style={styles.formCardHeader}>
//               <span style={styles.cardStep}>03</span>
//               <div>
//                 <h3 style={styles.formSectionTitle}>Rate your performance this semester</h3>
//                 <p style={styles.formSectionSub}>1 = Needs significant improvement · 5 = Exceeded expectations</p>
//               </div>
//             </div>

//             <div style={styles.ratingGrid}>
//               <div style={styles.ratingGridHeader}>
//                 <span style={{ flex: 2 }} />
//                 {[1,2,3,4,5].map(n => (
//                   <span key={n} style={styles.ratingGridNum}>{n}</span>
//                 ))}
//               </div>
//               {ratingCategories.map((cat, idx) => (
//                 <div
//                   key={cat.key}
//                   style={{
//                     ...styles.ratingGridRow,
//                     backgroundColor: idx % 2 === 0 ? '#ffffff' : '#fafbfd',
//                   }}
//                 >
//                   <span style={styles.ratingGridLabel}>{cat.label}</span>
//                   {[1, 2, 3, 4, 5].map(n => (
//                     <button
//                       key={n}
//                       type="button"
//                       onClick={() => handleRating(cat.key, n)}
//                       style={{
//                         ...styles.ratingGridBtn,
//                         backgroundColor: form.ratings[cat.key] === n ? '#1046a0' : '#f0f4f8',
//                         border: form.ratings[cat.key] === n
//                           ? '2px solid #1046a0'
//                           : '1.5px solid #e2e8f0',
//                       }}
//                     />
//                   ))}
//                 </div>
//               ))}
//             </div>

//             {/* AREAS WORKED ON */}
//             <div style={{ marginTop: '28px' }}>
//               <Field
//                 label="Areas worked on this semester"
//                 required
//                 hint="Select all that apply."
//               >
//                 <div style={styles.areasGrid}>
//                   {areasOptions.map(area => (
//                     <button
//                       key={area}
//                       type="button"
//                       onClick={() => handleAreaToggle(area)}
//                       style={{
//                         ...styles.areaBtn,
//                         backgroundColor: form.areas.includes(area) ? '#e6f1fb' : '#f8fafc',
//                         borderColor: form.areas.includes(area) ? '#1046a0' : '#e2e8f0',
//                         color: form.areas.includes(area) ? '#1046a0' : '#475569',
//                       }}
//                     >
//                       <span style={{
//                         ...styles.areaCheckbox,
//                         backgroundColor: form.areas.includes(area) ? '#1046a0' : '#ffffff',
//                         borderColor: form.areas.includes(area) ? '#1046a0' : '#cbd5e1',
//                       }}>
//                         {form.areas.includes(area) && (
//                           <span style={styles.areaCheckmark}>✓</span>
//                         )}
//                       </span>
//                       {area}
//                     </button>
//                   ))}
//                 </div>
//               </Field>
//             </div>

//             {/* OVERALL SELF RATING */}
//             <div style={{ marginTop: '28px' }}>
//               <Field
//                 label="Overall self-rating"
//                 required
//                 hint="How would you rate your overall performance this semester?"
//               >
//                 <div style={styles.ratingRow}>
//                   {[1, 2, 3, 4, 5].map(n => (
//                     <button
//                       key={n}
//                       type="button"
//                       onClick={() => handleChange('rating', n)}
//                       style={{
//                         ...styles.ratingBtn,
//                         backgroundColor: form.rating >= n ? '#1046a0' : '#f0f4f8',
//                         color: form.rating >= n ? '#ffffff' : '#64748b',
//                         border: form.rating >= n ? 'none' : '1.5px solid #e2e8f0',
//                       }}
//                     >
//                       {n}
//                     </button>
//                   ))}
//                   {form.rating > 0 && (
//                     <span style={styles.ratingLabelActive}>
//                       {ratingLabels[form.rating]}
//                     </span>
//                   )}
//                   {form.rating === 0 && (
//                     <span style={styles.ratingLabel}></span>
//                   )}
//                 </div>
//               </Field>
//             </div>
//           </div>

//           {/* FORM ACTIONS */}
//           <div style={styles.formActions}>
//             <button type="button" onClick={onBack} style={styles.cancelBtn}>
//               Cancel
//             </button>
//             <button type="submit" style={styles.submitBtn}>
//               Submit review 
//             </button>
//           </div>

//         </form>
//       </div>
//     </div>
//   )
// }

// // ─── HELPER COMPONENT ─────────────────────────────────────────────────────────

// function Field({ label, required, hint, children }) {
//   return (
//     <div style={styles.fieldGroup}>
//       <label style={styles.label}>
//         {label}
//         {required && <span style={styles.required}> *</span>}
//       </label>
//       {hint && <p style={styles.fieldHint}>{hint}</p>}
//       {children}
//     </div>
//   )
// }

// // ─── STYLES ───────────────────────────────────────────────────────────────────

// const styles = {
//   page: {
//     minHeight: '100vh',
//     backgroundColor: '#f0f4f8',
//   },
//   nav: {
//     backgroundColor: '#ffffff',
//     borderBottom: '1px solid #e2e8f0',
//     padding: '0 32px',
//     height: '60px',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     position: 'sticky',
//     top: 0,
//     zIndex: 100,
//     boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
//   },
//   navLeft: {
//     display: 'flex',
//     alignItems: 'center',
//     gap: '10px',
//   },
//   navLogo: {
//     height: '28px',
//     objectFit: 'contain',
//   },
//   navBrand: {
//     fontSize: '15px',
//     fontWeight: '600',
//     color: '#0f1f3d',
//   },
//   navRight: {
//     display: 'flex',
//     alignItems: 'center',
//     gap: '14px',
//   },
//   navName: {
//     fontSize: '13px',
//     color: '#64748b',
//     fontWeight: '400',
//   },
//   yearBadge: {
//     fontSize: '12px',
//     fontWeight: '600',
//     padding: '4px 12px',
//     borderRadius: '20px',
//   },
//   logoutBtn: {
//     fontSize: '13px',
//     fontWeight: '500',
//     color: '#64748b',
//     background: 'none',
//     border: '1px solid #e2e8f0',
//     borderRadius: '6px',
//     padding: '6px 14px',
//     cursor: 'pointer',
//   },

//   // NEW: Notification bell styles
//   bellWrapper: {
//     position: 'relative',
//   },
//   bellBtn: {
//     position: 'relative',
//     background: 'none',
//     border: '1px solid #e2e8f0',
//     borderRadius: '8px',
//     width: '36px',
//     height: '36px',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     cursor: 'pointer',
//     color: '#64748b',
//   },
//   bellBadge: {
//     // NEW: Red badge showing number of unread notifications
//     position: 'absolute',
//     top: '-6px',
//     right: '-6px',
//     backgroundColor: '#dc2626',
//     color: '#ffffff',
//     fontSize: '10px',
//     fontWeight: '700',
//     width: '16px',
//     height: '16px',
//     borderRadius: '50%',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     border: '2px solid #ffffff',
//   },
//   notifDropdown: {
//     // NEW: Dropdown panel that appears when bell is clicked
//     position: 'absolute',
//     top: '44px',
//     right: '0',
//     width: '320px',
//     backgroundColor: '#ffffff',
//     borderRadius: '12px',
//     border: '1px solid #e2e8f0',
//     boxShadow: '0 8px 24px rgba(0,0,0,0.10)',
//     zIndex: 200,
//     overflow: 'hidden',
//   },
//   notifHeader: {
//     // NEW: Top bar of dropdown showing title and unread count
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     padding: '14px 16px',
//     borderBottom: '1px solid #f1f5f9',
//     backgroundColor: '#f8fafc',
//   },
//   notifTitle: {
//     fontSize: '13px',
//     fontWeight: '600',
//     color: '#0f1f3d',
//   },
//   notifUnreadCount: {
//     // NEW: Shows how many unread notifications there are
//     fontSize: '11px',
//     fontWeight: '600',
//     color: '#1046a0',
//     backgroundColor: '#e6f1fb',
//     padding: '2px 8px',
//     borderRadius: '20px',
//   },
//   notifEmpty: {
//     padding: '28px 16px',
//     textAlign: 'center',
//   },
//   notifEmptyText: {
//     fontSize: '13px',
//     color: '#94a3b8',
//   },
//   notifItem: {
//     // NEW: Individual notification row
//     display: 'flex',
//     alignItems: 'flex-start',
//     gap: '10px',
//     padding: '12px 16px',
//     borderBottom: '1px solid #f1f5f9',
//     cursor: 'pointer',
//   },
//   notifDot: (read) => ({
//     // NEW: Blue dot for unread, grey for read
//     width: '8px',
//     height: '8px',
//     borderRadius: '50%',
//     backgroundColor: read ? '#cbd5e1' : '#1046a0',
//     flexShrink: 0,
//     marginTop: '4px',
//   }),
//   notifBody: {
//     flex: 1,
//   },
//   notifMessage: {
//     fontSize: '13px',
//     color: '#0f1f3d',
//     lineHeight: '1.5',
//     marginBottom: '3px',
//   },
//   notifTime: {
//     fontSize: '11px',
//     color: '#94a3b8',
//   },

//   container: {
//     maxWidth: '860px',
//     margin: '0 auto',
//     padding: '40px 24px 60px',
//   },
//   welcomeSection: {
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     background: 'linear-gradient(135deg, #0f3d8c 0%, #1046a0 60%, #1a5bbf 100%)',
//     borderRadius: '16px',
//     padding: '32px 36px',
//     marginBottom: '40px',
//     gap: '20px',
//     boxShadow: '0 4px 24px rgba(16,70,160,0.18)',
//   },
//   welcomeEyebrow: {
//     fontSize: '12px',
//     fontWeight: '500',
//     color: '#93c5fd',
//     textTransform: 'uppercase',
//     letterSpacing: '0.08em',
//     marginBottom: '6px',
//   },
//   welcomeTitle: {
//     fontSize: '28px',
//     fontWeight: '700',
//     color: '#ffffff',
//     marginBottom: '6px',
//     letterSpacing: '-0.3px',
//   },
//   welcomeSub: {
//     fontSize: '13px',
//     color: '#bfdbfe',
//     fontWeight: '400',
//   },
//   progressCard: {
//     backgroundColor: 'rgba(255,255,255,0.12)',
//     borderRadius: '12px',
//     padding: '18px 24px',
//     minWidth: '190px',
//     textAlign: 'center',
//     border: '1px solid rgba(255,255,255,0.15)',
//   },
//   progressLabel: {
//     fontSize: '11px',
//     color: '#93c5fd',
//     fontWeight: '500',
//     textTransform: 'uppercase',
//     letterSpacing: '0.06em',
//     marginBottom: '10px',
//   },
//   progressBar: {
//     height: '6px',
//     backgroundColor: 'rgba(255,255,255,0.2)',
//     borderRadius: '3px',
//     marginBottom: '8px',
//     overflow: 'hidden',
//   },
//   progressFill: {
//     height: '100%',
//     backgroundColor: '#ffffff',
//     borderRadius: '3px',
//     transition: 'width 0.4s ease',
//   },
//   progressText: {
//     fontSize: '13px',
//     color: '#ffffff',
//     fontWeight: '600',
//   },
//   sectionHeader: {
//     marginBottom: '16px',
//   },
//   sectionTitle: {
//     fontSize: '17px',
//     fontWeight: '600',
//     color: '#0f1f3d',
//     marginBottom: '4px',
//   },
//   sectionSub: {
//     fontSize: '13px',
//     color: '#64748b',
//     lineHeight: '1.5',
//   },
//   reviewGrid: {
//     display: 'grid',
//     gridTemplateColumns: '1fr 1fr',
//     gap: '16px',
//   },
//   reviewCard: {
//     backgroundColor: '#ffffff',
//     borderRadius: '14px',
//     border: '1px solid #e2e8f0',
//     padding: '24px',
//     boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
//   },
//   reviewCardTop: {
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     marginBottom: '16px',
//   },
//   reviewIcon: {
//     fontSize: '26px',
//   },
//   statusPill: {
//     fontSize: '11px',
//     fontWeight: '600',
//     padding: '4px 10px',
//     borderRadius: '20px',
//   },
//   reviewCardTitle: {
//     fontSize: '16px',
//     fontWeight: '600',
//     color: '#0f1f3d',
//     marginBottom: '6px',
//   },
//   reviewCardDesc: {
//     fontSize: '13px',
//     color: '#64748b',
//     lineHeight: '1.6',
//     marginBottom: '18px',
//   },
//   reviewCardMeta: {
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     backgroundColor: '#f8fafc',
//     borderRadius: '8px',
//     padding: '10px 14px',
//     marginBottom: '18px',
//     border: '1px solid #f1f5f9',
//   },
//   metaLabel: {
//     fontSize: '12px',
//     color: '#94a3b8',
//     fontWeight: '500',
//   },
//   metaValue: {
//     fontSize: '12px',
//     color: '#0f1f3d',
//     fontWeight: '600',
//   },
//   reviewBtn: {
//     width: '100%',
//     padding: '11px',
//     borderRadius: '8px',
//     fontSize: '13px',
//     fontWeight: '600',
//     cursor: 'pointer',
//   },
//   feedbackEmpty: {
//     backgroundColor: '#ffffff',
//     borderRadius: '14px',
//     border: '1px solid #e2e8f0',
//     padding: '52px 24px',
//     textAlign: 'center',
//     boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
//   },
//   feedbackEmptyIconWrap: {
//     fontSize: '36px',
//     marginBottom: '14px',
//   },
//   feedbackEmptyText: {
//     fontSize: '15px',
//     fontWeight: '600',
//     color: '#0f1f3d',
//     marginBottom: '8px',
//   },
//   feedbackEmptySub: {
//     fontSize: '13px',
//     color: '#64748b',
//     maxWidth: '360px',
//     margin: '0 auto',
//     lineHeight: '1.7',
//   },
//   backLink: {
//     background: 'none',
//     border: 'none',
//     fontSize: '13px',
//     color: '#1046a0',
//     fontWeight: '500',
//     cursor: 'pointer',
//     padding: '0',
//     marginBottom: '28px',
//     display: 'inline-flex',
//     alignItems: 'center',
//     gap: '4px',
//   },
//   formHeader: {
//     marginBottom: '32px',
//   },
//   formHeaderBadge: {
//     display: 'inline-block',
//     fontSize: '12px',
//     fontWeight: '600',
//     color: '#1046a0',
//     backgroundColor: '#e6f1fb',
//     padding: '4px 12px',
//     borderRadius: '20px',
//     marginBottom: '12px',
//   },
//   formTitle: {
//     fontSize: '26px',
//     fontWeight: '700',
//     color: '#0f1f3d',
//     marginBottom: '8px',
//     letterSpacing: '-0.3px',
//   },
//   formSub: {
//     fontSize: '14px',
//     color: '#64748b',
//     lineHeight: '1.6',
//   },
//   form: {
//     display: 'flex',
//     flexDirection: 'column',
//     gap: '20px',
//   },
//   formCard: {
//     backgroundColor: '#ffffff',
//     borderRadius: '14px',
//     border: '1px solid #e2e8f0',
//     padding: '28px 32px',
//     display: 'flex',
//     flexDirection: 'column',
//     gap: '24px',
//     boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
//   },
//   formCardHeader: {
//     display: 'flex',
//     alignItems: 'flex-start',
//     gap: '14px',
//     paddingBottom: '20px',
//     borderBottom: '1px solid #f1f5f9',
//   },
//   cardStep: {
//     fontSize: '11px',
//     fontWeight: '700',
//     color: '#1046a0',
//     backgroundColor: '#e6f1fb',
//     width: '28px',
//     height: '28px',
//     borderRadius: '8px',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     flexShrink: 0,
//     marginTop: '2px',
//     letterSpacing: '0.04em',
//   },
//   formSectionTitle: {
//     fontSize: '15px',
//     fontWeight: '600',
//     color: '#0f1f3d',
//     marginBottom: '2px',
//   },
//   formSectionSub: {
//     fontSize: '12px',
//     color: '#94a3b8',
//   },
//   formGrid: {
//     display: 'grid',
//     gridTemplateColumns: '1fr 1fr',
//     gap: '18px',
//   },
//   fieldGroup: {
//     display: 'flex',
//     flexDirection: 'column',
//     gap: '5px',
//   },
//   label: {
//     fontSize: '13px',
//     fontWeight: '500',
//     color: '#1e293b',
//   },
//   required: {
//     color: '#dc2626',
//   },
//   fieldHint: {
//     fontSize: '12px',
//     color: '#94a3b8',
//     lineHeight: '1.5',
//   },
//   input: {
//     padding: '10px 13px',
//     borderRadius: '8px',
//     border: '1.5px solid #e2e8f0',
//     fontSize: '14px',
//     color: '#0f1f3d',
//     backgroundColor: '#f8fafc',
//     outline: 'none',
//     width: '100%',
//     fontFamily: 'inherit',
//   },
//   textarea: {
//     padding: '11px 13px',
//     borderRadius: '8px',
//     border: '1.5px solid #e2e8f0',
//     fontSize: '14px',
//     color: '#0f1f3d',
//     backgroundColor: '#f8fafc',
//     outline: 'none',
//     width: '100%',
//     resize: 'vertical',
//     lineHeight: '1.7',
//     fontFamily: 'inherit',
//   },
//   ratingGrid: {
//     borderRadius: '10px',
//     border: '1.5px solid #e2e8f0',
//     overflow: 'hidden',
//   },
//   ratingGridHeader: {
//     display: 'flex',
//     alignItems: 'center',
//     padding: '10px 16px',
//     backgroundColor: '#f8fafc',
//     borderBottom: '1px solid #e2e8f0',
//     gap: '0.4px',
//   },
//   ratingGridNum: {
//     width: '36px',
//     textAlign: 'center',
//     fontSize: '12px',
//     fontWeight: '700',
//     color: '#64748b',
//     flexShrink: 0,
//   },
//   ratingGridRow: {
//     display: 'flex',
//     alignItems: 'center',
//     padding: '11px 16px',
//     borderBottom: '1px solid #f1f5f9',
//     gap: '8px',
//   },
//   ratingGridLabel: {
//     flex: 2,
//     fontSize: '13px',
//     color: '#0f1f3d',
//     fontWeight: '400',
//   },
//   ratingGridBtn: {
//     width: '28px',
//     height: '28px',
//     borderRadius: '6px',
//     cursor: 'pointer',
//     flexShrink: 0,
//   },
//   areasGrid: {
//     display: 'grid',
//     gridTemplateColumns: '1fr 1fr',
//     gap: '8px',
//     marginTop: '4px',
//   },
//   areaBtn: {
//     display: 'flex',
//     alignItems: 'center',
//     gap: '10px',
//     padding: '11px 14px',
//     borderRadius: '8px',
//     border: '1.5px solid',
//     fontSize: '13px',
//     cursor: 'pointer',
//     textAlign: 'left',
//     fontFamily: 'inherit',
//   },
//   areaCheckbox: {
//     width: '16px',
//     height: '16px',
//     borderRadius: '4px',
//     border: '1.5px solid',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     flexShrink: 0,
//   },
//   areaCheckmark: {
//     fontSize: '10px',
//     color: '#ffffff',
//     fontWeight: '700',
//   },
//   ratingRow: {
//     display: 'flex',
//     alignItems: 'center',
//     gap: '8px',
//     flexWrap: 'wrap',
//   },
//   ratingBtn: {
//     width: '42px',
//     height: '42px',
//     borderRadius: '8px',
//     fontSize: '14px',
//     fontWeight: '600',
//     cursor: 'pointer',
//     fontFamily: 'inherit',
//   },
//   ratingLabel: {
//     fontSize: '13px',
//     color: '#94a3b8',
//     marginLeft: '6px',
//   },
//   ratingLabelActive: {
//     fontSize: '13px',
//     color: '#1046a0',
//     fontWeight: '500',
//     marginLeft: '6px',
//     backgroundColor: '#e6f1fb',
//     padding: '4px 10px',
//     borderRadius: '20px',
//   },
//   formActions: {
//     display: 'flex',
//     justifyContent: 'flex-end',
//     gap: '12px',
//     paddingTop: '4px',
//   },
//   cancelBtn: {
//     padding: '11px 24px',
//     borderRadius: '8px',
//     fontSize: '14px',
//     fontWeight: '500',
//     color: '#64748b',
//     backgroundColor: '#ffffff',
//     border: '1.5px solid #e2e8f0',
//     cursor: 'pointer',
//     fontFamily: 'inherit',
//   },
//   submitBtn: {
//     padding: '11px 28px',
//     borderRadius: '8px',
//     fontSize: '14px',
//     fontWeight: '600',
//     color: '#ffffff',
//     backgroundColor: '#1046a0',
//     border: 'none',
//     cursor: 'pointer',
//     fontFamily: 'inherit',
//   },
//   successCard: {
//     backgroundColor: '#ffffff',
//     borderRadius: '16px',
//     border: '1px solid #e2e8f0',
//     padding: '64px 48px',
//     textAlign: 'center',
//     maxWidth: '480px',
//     margin: '60px auto',
//     boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
//   },
//   successIconWrap: {
//     width: '60px',
//     height: '60px',
//     backgroundColor: '#e1f5ee',
//     color: '#0f6e56',
//     borderRadius: '50%',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     fontSize: '26px',
//     fontWeight: '700',
//     margin: '0 auto 20px',
//   },
//   successTitle: {
//     fontSize: '24px',
//     fontWeight: '700',
//     color: '#0f1f3d',
//     marginBottom: '12px',
//   },
//   successSub: {
//     fontSize: '14px',
//     color: '#64748b',
//     lineHeight: '1.7',
//     marginBottom: '32px',
//   },
// }

// export default AnalystDashboard

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { api, reviewToForm } from '../services/api'
import NotificationBell from '../components/NotificationBell'

const RATING_LABELS = {
  0: 'Select a rating',
  1: 'Needs improvement',
  2: 'Developing',
  3: 'Meeting expectations',
  4: 'Exceeding expectations',
  5: 'Outstanding',
}

// Static copy for each review type. Status, deadline and feedback come from the API.
const PERIOD_META = [
  {
    id: 'mid',
    type: 'Mid-Semester Review',
    icon: '📋',
    description: 'Reflect on your first half of the semester — achievements, challenges and growth.',
  },
  {
    id: 'end',
    type: 'End-of-Semester Review',
    icon: '📝',
    description: 'Complete your full semester review and set goals for the next period.',
  },
]

const YEAR_COLORS = {
  1: { bg: '#e6f1fb', color: '#0c447c', label: 'Year 1' },
  2: { bg: '#e1f5ee', color: '#085041', label: 'Year 2' },
  3: { bg: '#eeedfe', color: '#3c3489', label: 'Year 3' },
}

function formatDate(value) {
  if (!value) return 'No deadline set'
  const d = new Date(/^\d{4}-\d{2}-\d{2}$/.test(value) ? `${value}T00:00:00` : value)
  if (isNaN(d)) return String(value)
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

// ─── MAIN DASHBOARD ───────────────────────────────────────────────────────────

function AnalystDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [activeView, setActiveView] = useState('dashboard')
  const [selectedReview, setSelectedReview] = useState(null)

  const [reviews, setReviews] = useState([])
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const handleLogout = useCallback(() => {
    logout()
    navigate('/')
  }, [logout, navigate])

  // An expired or invalid session sends the person back to sign in
  const handleError = useCallback((err) => {
    if (err.status === 401) {
      handleLogout()
      return
    }
    setError(err.message)
  }, [handleLogout])

  // State is only set inside the promise callbacks (never directly in the body),
  // which is what the React hooks lint rule expects for data loading.
  const loadReviews = useCallback(() => {
    return api.getMyReviews()
      .then(data => {
        setReviews(Array.isArray(data) ? data : [])
        setError('')
      })
      .catch(handleError)
      .finally(() => setLoading(false))
  }, [handleError])

  const loadNotifications = useCallback(() => {
    return api.getNotifications()
      .then(data => setNotifications(Array.isArray(data) ? data : []))
      .catch(err => {
        // Notification failures are non-critical, so they don't block the page
        if (err.status === 401) handleLogout()
      })
  }, [handleLogout])

  useEffect(() => {
    loadReviews()
    loadNotifications()
    const timer = setInterval(loadNotifications, 60000) // refresh every minute
    return () => clearInterval(timer)
  }, [loadReviews, loadNotifications])

  const handleMarkAllRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
    api.markAllNotificationsRead().catch(() => {})
  }, [])

  const handleBackToDashboard = () => {
    setActiveView('dashboard')
    loadReviews()
    loadNotifications()
  }

  // Merge static copy with what the server knows about each review
  const reviewPeriods = PERIOD_META.map(meta => {
    const r = reviews.find(x => x.period === meta.id)
    return {
      ...meta,
      reviewId: r?.id || null,
      status: r?.status || 'pending',
      deadline: formatDate(r?.deadline),
      feedback: r?.feedback || null,
    }
  })

  const reviewsWithFeedback = reviewPeriods.filter(r => r.feedback)
  const yearStyle = YEAR_COLORS[user?.year_group] || YEAR_COLORS[1]

  if (activeView === 'form') {
    return (
      <ReviewForm
        review={selectedReview}
        user={user}
        onBack={handleBackToDashboard}
        onUnauthorized={handleLogout}
      />
    )
  }

  return (
    <div style={styles.page}>

      <nav style={styles.nav}>
        <div style={styles.navLeft}>
          <img src="/logo.png" alt="GearUp Africa" style={styles.navLogo} />
          <span style={styles.navBrand}>GearUp Africa</span>
        </div>
        <div style={styles.navRight}>
          <span style={styles.navName}>{user?.name || 'Analyst'}</span>
          <div style={{ ...styles.yearBadge, backgroundColor: yearStyle.bg, color: yearStyle.color }}>
            {yearStyle.label}
          </div>
          <NotificationBell notifications={notifications} onMarkAllRead={handleMarkAllRead} />
          <button onClick={handleLogout} style={styles.logoutBtn}>Sign out</button>
        </div>
      </nav>

      <div style={styles.container}>

        <div style={styles.welcomeSection}>
          <div>
            <p style={styles.welcomeEyebrow}>Welcome </p>
            <h1 style={styles.welcomeTitle}>
              {user?.name?.split(' ')[0] || 'Analyst'}
            </h1>
            <p style={styles.welcomeSub}>
              GearUp Analyst Programme · {yearStyle.label} · {new Date().getFullYear()}
            </p>
          </div>
          <div style={styles.progressCard}>
            <p style={styles.progressLabel}>Programme progress</p>
            <div style={styles.progressBar}>
              <div style={{
                ...styles.progressFill,
                width: `${((user?.year_group || 1) / 3) * 100}%`,
              }} />
            </div>
            <p style={styles.progressText}>Year {user?.year_group || 1} of 3</p>
          </div>
        </div>

        {error && (
          <div style={styles.errorBanner} role="alert">
            <span>{error}</span>
            <button onClick={() => { setLoading(true); loadReviews() }} style={styles.retryBtn}>
              Try again
            </button>
          </div>
        )}

        <div style={styles.sectionHeader}>
          <div>
            <h2 style={styles.sectionTitle}>Your reviews</h2>
            <p style={styles.sectionSub}>
              Complete both reviews each semester. Your manager will review and provide personalised feedback.
            </p>
          </div>
        </div>

        {loading ? (
          <div style={styles.loadingBox}>Loading your reviews…</div>
        ) : (
          <div style={styles.reviewGrid}>
            {reviewPeriods.map((review) => (
              <div key={review.id} style={styles.reviewCard}>
                <div style={styles.reviewCardTop}>
                  <span style={styles.reviewIcon}>{review.icon}</span>
                  <span style={{
                    ...styles.statusPill,
                    backgroundColor: review.status === 'submitted' ? '#e1f5ee' : '#fff7ed',
                    color: review.status === 'submitted' ? '#085041' : '#92400e',
                    border: `1px solid ${review.status === 'submitted' ? '#a7f3d0' : '#fcd34d'}`,
                  }}>
                    {review.status === 'submitted' ? '✓ Submitted' : '○ Pending'}
                  </span>
                </div>
                <h3 style={styles.reviewCardTitle}>{review.type}</h3>
                <p style={styles.reviewCardDesc}>{review.description}</p>
                <div style={styles.reviewCardMeta}>
                  <span style={styles.metaLabel}>Deadline</span>
                  <span style={styles.metaValue}>{review.deadline}</span>
                </div>
                <button
                  style={{
                    ...styles.reviewBtn,
                    backgroundColor: review.status === 'submitted' ? '#ffffff' : '#1046a0',
                    color: review.status === 'submitted' ? '#1046a0' : '#ffffff',
                    border: review.status === 'submitted' ? '1.5px solid #1046a0' : 'none',
                  }}
                  onClick={() => {
                    setSelectedReview(review)
                    setActiveView('form')
                  }}
                >
                  {review.status === 'submitted' ? 'View submission' : 'Start review'}
                </button>
              </div>
            ))}
          </div>
        )}

        <div style={{ ...styles.sectionHeader, marginTop: '48px' }}>
          <div>
            <h2 style={styles.sectionTitle}>Feedback from your manager</h2>
            <p style={styles.sectionSub}>
              Feedback is private — only you and your manager can see it.
            </p>
          </div>
        </div>

        {!loading && reviewsWithFeedback.length === 0 ? (
          <div style={styles.feedbackEmpty}>
            <div style={styles.feedbackEmptyIconWrap}>💬</div>
            <p style={styles.feedbackEmptyText}>No feedback yet</p>
            <p style={styles.feedbackEmptySub}>
              Your manager's feedback will appear here once they review your submission.
              You will be notified when it is ready.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {reviewsWithFeedback.map(r => (
              <div key={r.id} style={styles.feedbackCard}>
                <div style={styles.feedbackCardHeader}>
                  <h3 style={styles.feedbackCardTitle}>{r.type}</h3>
                  <span style={styles.ratingLabelActive}>
                    {r.feedback.rating}/5 · {RATING_LABELS[r.feedback.rating]}
                  </span>
                </div>
                <div style={styles.feedbackBlock}>
                  <p style={styles.feedbackBlockLabel}>Strengths observed</p>
                  <p style={styles.feedbackBlockText}>{r.feedback.strengths}</p>
                </div>
                <div style={styles.feedbackBlock}>
                  <p style={styles.feedbackBlockLabel}>Areas for development</p>
                  <p style={styles.feedbackBlockText}>{r.feedback.development}</p>
                </div>
                <div style={styles.feedbackBlock}>
                  <p style={styles.feedbackBlockLabel}>Goals for next semester</p>
                  <p style={styles.feedbackBlockText}>{r.feedback.goals}</p>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}

// ─── REVIEW FORM ──────────────────────────────────────────────────────────────

const EMPTY_RATINGS = { technical: 0, miniships: 0, personal: 0, community: 0, guidance: 0 }

function ReviewForm({ review, user, onBack, onUnauthorized }) {
  const isMid = review.id === 'mid'
  const readOnly = review.status === 'submitted'

  const semesterOptions = isMid
    ? ['Year 1 Semester 1', 'Year 2 Semester 1', 'Year 3 Semester 1']
    : ['Year 1 Semester 2', 'Year 2 Semester 2', 'Year 3 Semester 2']

  const trackOptions = ['Data Analytics / Engineering', 'IB / Corp Finance']

  const ratingCategories = [
    { key: 'technical', label: 'Technical skills' },
    { key: 'miniships', label: 'Miniships & real-world' },
    { key: 'personal', label: 'Personal & prof dev' },
    { key: 'community', label: 'Community contribution' },
    { key: 'guidance', label: 'Applying guidance given' },
  ]

  const areasOptions = [
    'Financial analysis', 'Data tools & software',
    'Real-world project delivery', 'Stakeholder communication',
    'Leadership & initiative', 'Volunteering & service',
    'Peer support & mentoring', 'Certifications',
    'Extracurriculars', 'Mindset & adaptability',
  ]

  const [form, setForm] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    semester: '',
    track: user?.track_display || '',
    dateSubmitted: new Date().toISOString().split('T')[0],
    accomplishments: '',
    challenges: '',
    response: '',
    guidance: '',
    contribution: '',
    growth: '',
    communityContribution: '',
    development: '',
    ratings: { ...EMPTY_RATINGS },
    areas: [],
    rating: 0,
  })

  const [loadingExisting, setLoadingExisting] = useState(readOnly)
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState('')
  const [submitted, setSubmitted] = useState(false)

  // Viewing a past submission: load what the analyst originally wrote
  useEffect(() => {
    if (!readOnly || !review.reviewId) return
    let cancelled = false
    api.getMyReview(review.reviewId)
      .then(data => { if (!cancelled) setForm(reviewToForm(data)) })
      .catch(err => {
        if (cancelled) return
        if (err.status === 401) return onUnauthorized()
        setFormError(err.message)
      })
      .finally(() => { if (!cancelled) setLoadingExisting(false) })
    return () => { cancelled = true }
  }, [readOnly, review.reviewId, onUnauthorized])

  const handleChange = (field, value) => setForm(prev => ({ ...prev, [field]: value }))

  const handleRating = (category, value) => {
    setForm(prev => ({ ...prev, ratings: { ...prev.ratings, [category]: value } }))
  }

  const handleAreaToggle = (area) => {
    setForm(prev => ({
      ...prev,
      areas: prev.areas.includes(area)
        ? prev.areas.filter(a => a !== area)
        : [...prev.areas, area],
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError('')

    // The browser checks text fields; these custom controls need manual checks
    if (Object.values(form.ratings).some(v => v === 0)) {
      return setFormError('Rate every category in section 03 before submitting.')
    }
    if (form.areas.length === 0) {
      return setFormError('Select at least one area you worked on this semester.')
    }
    if (form.rating === 0) {
      return setFormError('Choose an overall self-rating before submitting.')
    }

    setSubmitting(true)
    try {
      await api.submitReview(form, review.id)
      setSubmitted(true)
    } catch (err) {
      if (err.status === 401) return onUnauthorized()
      setFormError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.successCard}>
            <div style={styles.successIconWrap}>✓</div>
            <h2 style={styles.successTitle}>Review submitted!</h2>
            <p style={styles.successSub}>
              Your <strong>{review.type}</strong> has been submitted successfully.
              Your manager will review it and provide feedback soon.
            </p>
            <button onClick={onBack} style={styles.submitBtn}>
              ← Back to dashboard
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={styles.page}>

      <nav style={styles.nav}>
        <div style={styles.navLeft}>
          <img src="/logo.png" alt="GearUp Africa" style={styles.navLogo} />
          <span style={styles.navBrand}>GearUp Africa</span>
        </div>
        <div style={styles.navRight}>
          <span style={styles.navName}>{user?.name || 'Analyst'}</span>
        </div>
      </nav>

      <div style={styles.container}>

        <button onClick={onBack} style={styles.backLink}>
          ← Back to dashboard
        </button>

        <div style={styles.formHeader}>
          <div style={styles.formHeaderBadge}>
            {isMid ? '📋 Mid-Semester' : '📝 End-of-Semester'}
          </div>
          <h1 style={styles.formTitle}>{review.type}</h1>
          <p style={styles.formSub}>
            {readOnly
              ? 'This review has been submitted and can no longer be edited.'
              : 'Complete all sections honestly and specifically.'}
          </p>
        </div>

        {loadingExisting ? (
          <div style={styles.loadingBox}>Loading your submission…</div>
        ) : (
          <form onSubmit={handleSubmit}>
            <fieldset disabled={readOnly || submitting} style={styles.fieldset}>

              {/* ── CARD 1: PERSONAL INFORMATION ── */}
              <div style={styles.formCard}>
                <div style={styles.formCardHeader}>
                  <span style={styles.cardStep}>01</span>
                  <div>
                    <h3 style={styles.formSectionTitle}>Personal information</h3>
                    <p style={styles.formSectionSub}>Your basic details for this submission</p>
                  </div>
                </div>

                <div style={styles.formGrid}>
                  <Field label="Full name" required hint="As it appears on your GearUp profile">
                    <input
                      style={styles.input}
                      value={form.fullName}
                      onChange={e => handleChange('fullName', e.target.value)}
                      placeholder="Your full name"
                      required
                    />
                  </Field>

                  <Field label="Email address" required hint="Your email for GearUp">
                    <input
                      style={styles.input}
                      type="email"
                      value={form.email}
                      onChange={e => handleChange('email', e.target.value)}
                      placeholder="your@email.com"
                      required
                    />
                  </Field>

                  <Field
                    label="Year & Semester"
                    required
                    hint={isMid ? 'Select your current mid-year semester' : 'Select your current end-of-year semester'}
                  >
                    <select
                      style={styles.input}
                      value={form.semester}
                      onChange={e => handleChange('semester', e.target.value)}
                      required
                    >
                      <option value="">Select your year & semester</option>
                      {semesterOptions.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </Field>

                  <Field label="Track" required hint="Select the division you belong to">
                    <select
                      style={styles.input}
                      value={form.track}
                      onChange={e => handleChange('track', e.target.value)}
                      required
                    >
                      <option value="">Select your track</option>
                      {trackOptions.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </Field>

                  <Field label="Date submitted">
                    <input
                      style={styles.input}
                      type="date"
                      value={form.dateSubmitted}
                      onChange={e => handleChange('dateSubmitted', e.target.value)}
                    />
                  </Field>
                </div>
              </div>

              {/* ── CARD 2: SELF REFLECTION ── */}
              <div style={styles.formCard}>
                <div style={styles.formCardHeader}>
                  <span style={styles.cardStep}>02</span>
                  <div>
                    <h3 style={styles.formSectionTitle}>Analyst self-reflection</h3>
                    <p style={styles.formSectionSub}>Completed by the analyst. Be specific and honest.</p>
                  </div>
                </div>

                <Field
                  label="Top 2–3 accomplishments this semester"
                  required
                  hint="Be specific — mention projects, skills learned, or measurable results achieved."
                >
                  <textarea
                    style={styles.textarea}
                    value={form.accomplishments}
                    onChange={e => handleChange('accomplishments', e.target.value)}
                    placeholder="e.g. Led the financial modelling workshop for the cohort, completed Bloomberg certification..."
                    rows={5}
                    required
                  />
                </Field>

                <Field label="Challenges faced" required hint="What obstacles did you encounter this semester?">
                  <textarea
                    style={styles.textarea}
                    value={form.challenges}
                    onChange={e => handleChange('challenges', e.target.value)}
                    placeholder="e.g. Struggled with time management during overlapping project deadlines..."
                    rows={4}
                    required
                  />
                </Field>

                <Field
                  label="How did you respond to those challenges?"
                  required
                  hint="What steps did you take? What would you do differently next time?"
                >
                  <textarea
                    style={styles.textarea}
                    value={form.response}
                    onChange={e => handleChange('response', e.target.value)}
                    placeholder="e.g. Struggled to translate data findings into a clear narrative..."
                    rows={4}
                    required
                  />
                </Field>

                <Field
                  label="How well did you apply the guidance given to you?"
                  required
                  hint="Where did you act on feedback and where did you fall short?"
                >
                  <textarea
                    style={styles.textarea}
                    value={form.guidance}
                    onChange={e => handleChange('guidance', e.target.value)}
                    placeholder="e.g. Implemented structured reporting feedback from my manager..."
                    rows={4}
                    required
                  />
                </Field>

                <Field
                  label="Most meaningful real-world contribution"
                  required
                  hint="A project, miniship, or deliverable with genuine impact"
                >
                  <textarea
                    style={styles.textarea}
                    value={form.contribution}
                    onChange={e => handleChange('contribution', e.target.value)}
                    placeholder="e.g. Delivered market sizing analysis for a live client brief..."
                    rows={4}
                    required
                  />
                </Field>

                <Field
                  label="How have you grown personally and professionally?"
                  required
                  hint="Mindset shifts, leadership moments, volunteering, workshops, analyst identity"
                >
                  <textarea
                    style={styles.textarea}
                    value={form.growth}
                    onChange={e => handleChange('growth', e.target.value)}
                    placeholder="e.g. More comfortable leading conversations, started mentoring junior peers..."
                    rows={4}
                    required
                  />
                </Field>

                <Field
                  label="How did you contribute to the GearUp community?"
                  required
                  hint="Peer support, extracurriculars, culture, mentoring, events"
                >
                  <textarea
                    style={styles.textarea}
                    value={form.communityContribution}
                    onChange={e => handleChange('communityContribution', e.target.value)}
                    placeholder="e.g. Organized cohort study groups, supported two junior analysts..."
                    rows={4}
                    required
                  />
                </Field>

                <Field label="What do you most want to develop next semester?" required>
                  <textarea
                    style={styles.textarea}
                    value={form.development}
                    onChange={e => handleChange('development', e.target.value)}
                    placeholder="e.g. Deepen financial modelling skills, take on a solo miniship brief..."
                    rows={4}
                    required
                  />
                </Field>
              </div>

              {/* ── CARD 3: RATINGS ── */}
              <div style={styles.formCard}>
                <div style={styles.formCardHeader}>
                  <span style={styles.cardStep}>03</span>
                  <div>
                    <h3 style={styles.formSectionTitle}>Rate your performance this semester</h3>
                    <p style={styles.formSectionSub}>1 = Needs significant improvement · 5 = Exceeded expectations</p>
                  </div>
                </div>

                <div style={styles.ratingGrid}>
                  <div style={styles.ratingGridHeader}>
                    <span style={{ flex: 2 }} />
                    {[1, 2, 3, 4, 5].map(n => (
                      <span key={n} style={styles.ratingGridNum}>{n}</span>
                    ))}
                  </div>
                  {ratingCategories.map((cat, idx) => (
                    <div
                      key={cat.key}
                      style={{
                        ...styles.ratingGridRow,
                        backgroundColor: idx % 2 === 0 ? '#ffffff' : '#fafbfd',
                      }}
                    >
                      <span style={styles.ratingGridLabel}>{cat.label}</span>
                      {[1, 2, 3, 4, 5].map(n => (
                        <button
                          key={n}
                          type="button"
                          aria-label={`${cat.label}: ${n}`}
                          onClick={() => handleRating(cat.key, n)}
                          style={{
                            ...styles.ratingGridBtn,
                            backgroundColor: form.ratings[cat.key] === n ? '#1046a0' : '#f0f4f8',
                            border: form.ratings[cat.key] === n
                              ? '2px solid #1046a0'
                              : '1.5px solid #e2e8f0',
                          }}
                        />
                      ))}
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: '28px' }}>
                  <Field label="Areas worked on this semester" required hint="Select all that apply.">
                    <div style={styles.areasGrid}>
                      {areasOptions.map(area => (
                        <button
                          key={area}
                          type="button"
                          onClick={() => handleAreaToggle(area)}
                          style={{
                            ...styles.areaBtn,
                            backgroundColor: form.areas.includes(area) ? '#e6f1fb' : '#f8fafc',
                            borderColor: form.areas.includes(area) ? '#1046a0' : '#e2e8f0',
                            color: form.areas.includes(area) ? '#1046a0' : '#475569',
                          }}
                        >
                          <span style={{
                            ...styles.areaCheckbox,
                            backgroundColor: form.areas.includes(area) ? '#1046a0' : '#ffffff',
                            borderColor: form.areas.includes(area) ? '#1046a0' : '#cbd5e1',
                          }}>
                            {form.areas.includes(area) && (
                              <span style={styles.areaCheckmark}>✓</span>
                            )}
                          </span>
                          {area}
                        </button>
                      ))}
                    </div>
                  </Field>
                </div>

                <div style={{ marginTop: '28px' }}>
                  <Field
                    label="Overall self-rating"
                    required
                    hint="How would you rate your overall performance this semester?"
                  >
                    <div style={styles.ratingRow}>
                      {[1, 2, 3, 4, 5].map(n => (
                        <button
                          key={n}
                          type="button"
                          onClick={() => handleChange('rating', n)}
                          style={{
                            ...styles.ratingBtn,
                            backgroundColor: form.rating >= n ? '#1046a0' : '#f0f4f8',
                            color: form.rating >= n ? '#ffffff' : '#64748b',
                            border: form.rating >= n ? 'none' : '1.5px solid #e2e8f0',
                          }}
                        >
                          {n}
                        </button>
                      ))}
                      {form.rating > 0 && (
                        <span style={styles.ratingLabelActive}>{RATING_LABELS[form.rating]}</span>
                      )}
                    </div>
                  </Field>
                </div>
              </div>

            </fieldset>

            {formError && (
              <div style={{ ...styles.errorBanner, marginTop: '20px', marginBottom: 0 }} role="alert">
                <span>{formError}</span>
              </div>
            )}

            <div style={{ ...styles.formActions, marginTop: '20px' }}>
              {readOnly ? (
                <button type="button" onClick={onBack} style={styles.submitBtn}>
                  Back to dashboard
                </button>
              ) : (
                <>
                  <button type="button" onClick={onBack} disabled={submitting} style={styles.cancelBtn}>
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    style={{ ...styles.submitBtn, opacity: submitting ? 0.7 : 1 }}
                  >
                    {submitting ? 'Submitting…' : 'Submit review'}
                  </button>
                </>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

// ─── HELPER COMPONENT ─────────────────────────────────────────────────────────

function Field({ label, required, hint, children }) {
  return (
    <div style={styles.fieldGroup}>
      <label style={styles.label}>
        {label}
        {required && <span style={styles.required}> *</span>}
      </label>
      {hint && <p style={styles.fieldHint}>{hint}</p>}
      {children}
    </div>
  )
}

// ─── STYLES ───────────────────────────────────────────────────────────────────

const styles = {
  page: { minHeight: '100vh', backgroundColor: '#f0f4f8' },
  nav: {
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #e2e8f0',
    padding: '0 32px',
    height: '60px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
  },
  navLeft: { display: 'flex', alignItems: 'center', gap: '10px' },
  navLogo: { height: '28px', objectFit: 'contain' },
  navBrand: { fontSize: '15px', fontWeight: '600', color: '#0f1f3d' },
  navRight: { display: 'flex', alignItems: 'center', gap: '14px' },
  navName: { fontSize: '13px', color: '#64748b', fontWeight: '400' },
  yearBadge: { fontSize: '12px', fontWeight: '600', padding: '4px 12px', borderRadius: '20px' },
  logoutBtn: {
    fontSize: '13px',
    fontWeight: '500',
    color: '#64748b',
    background: 'none',
    border: '1px solid #e2e8f0',
    borderRadius: '6px',
    padding: '6px 14px',
    cursor: 'pointer',
  },

  container: { maxWidth: '860px', margin: '0 auto', padding: '40px 24px 60px' },
  welcomeSection: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: 'linear-gradient(135deg, #0f3d8c 0%, #1046a0 60%, #1a5bbf 100%)',
    borderRadius: '16px',
    padding: '32px 36px',
    marginBottom: '40px',
    gap: '20px',
    boxShadow: '0 4px 24px rgba(16,70,160,0.18)',
  },
  welcomeEyebrow: {
    fontSize: '12px',
    fontWeight: '500',
    color: '#93c5fd',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    marginBottom: '6px',
  },
  welcomeTitle: { fontSize: '28px', fontWeight: '700', color: '#ffffff', marginBottom: '6px', letterSpacing: '-0.3px' },
  welcomeSub: { fontSize: '13px', color: '#bfdbfe', fontWeight: '400' },
  progressCard: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: '12px',
    padding: '18px 24px',
    minWidth: '190px',
    textAlign: 'center',
    border: '1px solid rgba(255,255,255,0.15)',
  },
  progressLabel: {
    fontSize: '11px',
    color: '#93c5fd',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    marginBottom: '10px',
  },
  progressBar: {
    height: '6px',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: '3px',
    marginBottom: '8px',
    overflow: 'hidden',
  },
  progressFill: { height: '100%', backgroundColor: '#ffffff', borderRadius: '3px', transition: 'width 0.4s ease' },
  progressText: { fontSize: '13px', color: '#ffffff', fontWeight: '600' },

  // Loading and error states
  loadingBox: {
    backgroundColor: '#ffffff',
    borderRadius: '14px',
    border: '1px solid #e2e8f0',
    padding: '40px 24px',
    textAlign: 'center',
    fontSize: '13px',
    color: '#64748b',
  },
  errorBanner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '12px',
    backgroundColor: '#fff0f0',
    border: '1px solid #fecaca',
    color: '#b91c1c',
    borderRadius: '10px',
    padding: '12px 16px',
    fontSize: '13px',
    marginBottom: '24px',
  },
  retryBtn: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#b91c1c',
    background: '#ffffff',
    border: '1px solid #fecaca',
    borderRadius: '6px',
    padding: '5px 12px',
    cursor: 'pointer',
    fontFamily: 'inherit',
  },

  sectionHeader: { marginBottom: '16px' },
  sectionTitle: { fontSize: '17px', fontWeight: '600', color: '#0f1f3d', marginBottom: '4px' },
  sectionSub: { fontSize: '13px', color: '#64748b', lineHeight: '1.5' },
  reviewGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' },
  reviewCard: {
    backgroundColor: '#ffffff',
    borderRadius: '14px',
    border: '1px solid #e2e8f0',
    padding: '24px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
  },
  reviewCardTop: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' },
  reviewIcon: { fontSize: '26px' },
  statusPill: { fontSize: '11px', fontWeight: '600', padding: '4px 10px', borderRadius: '20px' },
  reviewCardTitle: { fontSize: '16px', fontWeight: '600', color: '#0f1f3d', marginBottom: '6px' },
  reviewCardDesc: { fontSize: '13px', color: '#64748b', lineHeight: '1.6', marginBottom: '18px' },
  reviewCardMeta: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
    padding: '10px 14px',
    marginBottom: '18px',
    border: '1px solid #f1f5f9',
  },
  metaLabel: { fontSize: '12px', color: '#94a3b8', fontWeight: '500' },
  metaValue: { fontSize: '12px', color: '#0f1f3d', fontWeight: '600' },
  reviewBtn: { width: '100%', padding: '11px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' },

  feedbackEmpty: {
    backgroundColor: '#ffffff',
    borderRadius: '14px',
    border: '1px solid #e2e8f0',
    padding: '52px 24px',
    textAlign: 'center',
    boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
  },
  feedbackEmptyIconWrap: { fontSize: '36px', marginBottom: '14px' },
  feedbackEmptyText: { fontSize: '15px', fontWeight: '600', color: '#0f1f3d', marginBottom: '8px' },
  feedbackEmptySub: { fontSize: '13px', color: '#64748b', maxWidth: '360px', margin: '0 auto', lineHeight: '1.7' },

  // Feedback received from the manager
  feedbackCard: {
    backgroundColor: '#ffffff',
    borderRadius: '14px',
    border: '1px solid #e2e8f0',
    padding: '24px 28px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
  },
  feedbackCardHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '12px',
    flexWrap: 'wrap',
    paddingBottom: '14px',
    borderBottom: '1px solid #f1f5f9',
  },
  feedbackCardTitle: { fontSize: '15px', fontWeight: '600', color: '#0f1f3d' },
  feedbackBlock: {},
  feedbackBlockLabel: {
    fontSize: '11px',
    fontWeight: '600',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    marginBottom: '6px',
  },
  feedbackBlockText: {
    fontSize: '13px',
    color: '#0f1f3d',
    lineHeight: '1.7',
    backgroundColor: '#f8fafc',
    padding: '12px',
    borderRadius: '8px',
  },

  backLink: {
    background: 'none',
    border: 'none',
    fontSize: '13px',
    color: '#1046a0',
    fontWeight: '500',
    cursor: 'pointer',
    padding: '0',
    marginBottom: '28px',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
  },
  formHeader: { marginBottom: '32px' },
  formHeaderBadge: {
    display: 'inline-block',
    fontSize: '12px',
    fontWeight: '600',
    color: '#1046a0',
    backgroundColor: '#e6f1fb',
    padding: '4px 12px',
    borderRadius: '20px',
    marginBottom: '12px',
  },
  formTitle: { fontSize: '26px', fontWeight: '700', color: '#0f1f3d', marginBottom: '8px', letterSpacing: '-0.3px' },
  formSub: { fontSize: '14px', color: '#64748b', lineHeight: '1.6' },
  // <fieldset> replaces the old <form> wrapper so the whole form can be disabled when read-only
  fieldset: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    border: 'none',
    padding: 0,
    margin: 0,
    minWidth: 0,
  },
  formCard: {
    backgroundColor: '#ffffff',
    borderRadius: '14px',
    border: '1px solid #e2e8f0',
    padding: '28px 32px',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
  },
  formCardHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '14px',
    paddingBottom: '20px',
    borderBottom: '1px solid #f1f5f9',
  },
  cardStep: {
    fontSize: '11px',
    fontWeight: '700',
    color: '#1046a0',
    backgroundColor: '#e6f1fb',
    width: '28px',
    height: '28px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: '2px',
    letterSpacing: '0.04em',
  },
  formSectionTitle: { fontSize: '15px', fontWeight: '600', color: '#0f1f3d', marginBottom: '2px' },
  formSectionSub: { fontSize: '12px', color: '#94a3b8' },
  formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' },
  fieldGroup: { display: 'flex', flexDirection: 'column', gap: '5px' },
  label: { fontSize: '13px', fontWeight: '500', color: '#1e293b' },
  required: { color: '#dc2626' },
  fieldHint: { fontSize: '12px', color: '#94a3b8', lineHeight: '1.5' },
  input: {
    padding: '10px 13px',
    borderRadius: '8px',
    border: '1.5px solid #e2e8f0',
    fontSize: '14px',
    color: '#0f1f3d',
    backgroundColor: '#f8fafc',
    outline: 'none',
    width: '100%',
    fontFamily: 'inherit',
  },
  textarea: {
    padding: '11px 13px',
    borderRadius: '8px',
    border: '1.5px solid #e2e8f0',
    fontSize: '14px',
    color: '#0f1f3d',
    backgroundColor: '#f8fafc',
    outline: 'none',
    width: '100%',
    resize: 'vertical',
    lineHeight: '1.7',
    fontFamily: 'inherit',
  },
  ratingGrid: { borderRadius: '10px', border: '1.5px solid #e2e8f0', overflow: 'hidden' },
  ratingGridHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: '10px 16px',
    backgroundColor: '#f8fafc',
    borderBottom: '1px solid #e2e8f0',
    gap: '8px',
  },
  ratingGridNum: { width: '28px', textAlign: 'center', fontSize: '12px', fontWeight: '700', color: '#64748b', flexShrink: 0 },
  ratingGridRow: { display: 'flex', alignItems: 'center', padding: '11px 16px', borderBottom: '1px solid #f1f5f9', gap: '8px' },
  ratingGridLabel: { flex: 2, fontSize: '13px', color: '#0f1f3d', fontWeight: '400' },
  ratingGridBtn: { width: '28px', height: '28px', borderRadius: '6px', cursor: 'pointer', flexShrink: 0 },
  areasGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '4px' },
  areaBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '11px 14px',
    borderRadius: '8px',
    border: '1.5px solid',
    fontSize: '13px',
    cursor: 'pointer',
    textAlign: 'left',
    fontFamily: 'inherit',
  },
  areaCheckbox: {
    width: '16px',
    height: '16px',
    borderRadius: '4px',
    border: '1.5px solid',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  areaCheckmark: { fontSize: '10px', color: '#ffffff', fontWeight: '700' },
  ratingRow: { display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' },
  ratingBtn: { width: '42px', height: '42px', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit' },
  ratingLabelActive: {
    fontSize: '13px',
    color: '#1046a0',
    fontWeight: '500',
    marginLeft: '6px',
    backgroundColor: '#e6f1fb',
    padding: '4px 10px',
    borderRadius: '20px',
  },
  formActions: { display: 'flex', justifyContent: 'flex-end', gap: '12px', paddingTop: '4px' },
  cancelBtn: {
    padding: '11px 24px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#64748b',
    backgroundColor: '#ffffff',
    border: '1.5px solid #e2e8f0',
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
  submitBtn: {
    padding: '11px 28px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#ffffff',
    backgroundColor: '#1046a0',
    border: 'none',
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
  successCard: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    border: '1px solid #e2e8f0',
    padding: '64px 48px',
    textAlign: 'center',
    maxWidth: '480px',
    margin: '60px auto',
    boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
  },
  successIconWrap: {
    width: '60px',
    height: '60px',
    backgroundColor: '#e1f5ee',
    color: '#0f6e56',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '26px',
    fontWeight: '700',
    margin: '0 auto 20px',
  },
  successTitle: { fontSize: '24px', fontWeight: '700', color: '#0f1f3d', marginBottom: '12px' },
  successSub: { fontSize: '14px', color: '#64748b', lineHeight: '1.7', marginBottom: '32px' },
}

export default AnalystDashboard