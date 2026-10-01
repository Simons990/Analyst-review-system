// import { useState } from 'react'
// import { useNavigate } from 'react-router-dom'
// import { useAuth } from '../contexts/AuthContext'
// import { loginUser } from '../services/api'

// function LoginPage() {
//   const [email, setEmail] = useState('')
//   const [password, setPassword] = useState('')
//   const [error, setError] = useState('')
//   const [loading, setLoading] = useState(false)
//   const [showPassword, setShowPassword] = useState(false)

//   const { login } = useAuth()
//   const navigate = useNavigate()

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     setError('')
//     setLoading(true)

//     try {
//       const response = await loginUser(email, password)
//       const { user, token, refresh } = response.data
//       login(user, token, refresh)
//       if (user.role === 'analyst') {
//         navigate('/analyst')
//       } else if (user.role === 'manager') {
//         navigate('/manager')
//       }
//     } catch (err) {
//       const message = err.response?.data?.message || 'Invalid email or password'
//       setError(message)
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <div style={styles.page}>

//       {/* LEFT PANEL — smaller, 45% width */}
//       <div style={styles.leftPanel}>
//         <div style={styles.leftContent}>
//           <div style={styles.brandRow}>
//             <img src="/logo.png" alt="GearUp Africa" style={styles.leftLogo} />
//             <p style={styles.leftBrandName}>GearUp Africa</p>
//           </div>
//           <h2 style={styles.leftHeading}>
//             Empowering Africa's<br />next generation of<br />analysts.
//           </h2>
//           <p style={styles.leftSubtext}>
//             Track your growth, receive feedback, and build the skills that matter — one semester at a time.
//           </p>
//           <div style={styles.statsRow}>
//             <div style={styles.statItem}>
//               <span style={styles.statNumber}>3</span>
//               <span style={styles.statLabel}>Year programme</span>
//             </div>
//             <div style={styles.statDivider} />
//             <div style={styles.statItem}>
//               <span style={styles.statNumber}>2×</span>
//               <span style={styles.statLabel}>Reviews per semester</span>
//             </div>
//             <div style={styles.statDivider} />
//             <div style={styles.statItem}>
//               <span style={styles.statNumber}>100%</span>
//               <span style={styles.statLabel}>Personalised feedback</span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* RIGHT PANEL — login form */}
//       <div style={styles.rightPanel}>
//         <div style={styles.card}>

//           <div style={styles.cardHeader}>
//             <img src="/logo.png" alt="GearUp Africa" style={styles.cardLogo} />
//             <h1 style={styles.cardTitle}>Welcome back</h1>
//             <p style={styles.cardSubtitle}>
//               Sign in to the GearUp Analyst Review Portal
//             </p>
//           </div>

//           {error && (
//             <div style={styles.errorBox}>
//               <span style={styles.errorIcon}>⚠</span>
//               {error}
//             </div>
//           )}

//           <form onSubmit={handleSubmit} style={styles.form}>

//             <div style={styles.fieldGroup}>
//               <label style={styles.label}>Email address</label>
//               <input
//                 type="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 placeholder="you@gearupafrica.com"
//                 required
//                 style={styles.input}
//               />
//             </div>

//             <div style={styles.fieldGroup}>
//               <label style={styles.label}>Password</label>
//               <div style={styles.passwordWrapper}>
//                 <input
//                   type={showPassword ? 'text' : 'password'}
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   placeholder="Enter your password"
//                   required
//                   style={{ ...styles.input, paddingRight: '44px' }}
//                 />
//                 {/* Proper SVG eye icon — not an emoji */}
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   style={styles.eyeButton}
//                   aria-label={showPassword ? 'Hide password' : 'Show password'}
//                 >
//                   {showPassword ? (
//                     // Eye with slash — password visible, click to hide
//                     <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                       <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
//                       <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
//                       <line x1="1" y1="1" x2="23" y2="23" />
//                     </svg>
//                   ) : (
//                     // Open eye — password hidden, click to show
//                     <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                       <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
//                       <circle cx="12" cy="12" r="3" />
//                     </svg>
//                   )}
//                 </button>
//               </div>
//             </div>

//             <button
//               type="submit"
//               disabled={loading}
//               style={{
//                 ...styles.submitButton,
//                 opacity: loading ? 0.75 : 1,
//                 cursor: loading ? 'not-allowed' : 'pointer',
//               }}
//             >
//               {loading ? 'Signing in...' : 'Sign in'}
//             </button>

//           </form>

//           <div style={styles.divider} />

//           <p style={styles.footerNote}>
//             Don't have an account?{' '}
//             <span style={styles.footerLink}>Contact your manager</span>
//           </p>

//         </div>
//       </div>

//     </div>
//   )
// }

// const styles = {
//   page: {
//     minHeight: '100vh',
//     display: 'flex',
//     flexDirection: 'row',
//   },
//   // Left panel — 42% width, not taking up too much space
//   leftPanel: {
//     width: '42%',
//     backgroundColor: '#1046a0',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'flex-start', // content aligned left not center
//     padding: '60px 48px',
//   },
//   leftContent: {
//     maxWidth: '380px',
//   },
//   brandRow: {
//     display: 'flex',
//     alignItems: 'center',
//     gap: '12px',
//     marginBottom: '48px',
//   },
//   leftLogo: {
//     height: '42px',
//     objectFit: 'contain',
//   },
//   leftBrandName: {
//     fontSize: '18px',
//     fontWeight: '700',
//     color: '#ffffff',
//   },
//   leftHeading: {
//     fontSize: '32px',
//     fontWeight: '700',
//     color: '#ffffff',
//     lineHeight: '1.25',
//     marginBottom: '20px',
//     letterSpacing: '-0.5px',
//   },
//   leftSubtext: {
//     fontSize: '14px',
//     color: '#a8c4f0',
//     lineHeight: '1.7',
//     marginBottom: '48px',
//     fontWeight: '300',
//   },
//   statsRow: {
//     display: 'flex',
//     alignItems: 'center',
//     gap: '20px',
//   },
//   statItem: {
//     display: 'flex',
//     flexDirection: 'column',
//     gap: '4px',
//   },
//   statNumber: {
//     fontSize: '20px',
//     fontWeight: '700',
//     color: '#ffffff',
//   },
//   statLabel: {
//     fontSize: '11px',
//     color: '#a8c4f0',
//     fontWeight: '400',
//   },
//   statDivider: {
//     width: '1px',
//     height: '36px',
//     backgroundColor: '#2d5faa',
//   },
//   // Right panel takes the remaining space
//   rightPanel: {
//     flex: 1,
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: '#f0f4f8',
//     padding: '40px 32px',
//   },
//   card: {
//     backgroundColor: '#ffffff',
//     borderRadius: '16px',
//     border: '1px solid #e2e8f0',
//     padding: '40px 36px',
//     width: '100%',
//     maxWidth: '400px',
//   },
//   cardHeader: {
//     marginBottom: '28px',
//   },
//   cardLogo: {
//     height: '32px',
//     objectFit: 'contain',
//     marginBottom: '20px',
//   },
//   cardTitle: {
//     fontSize: '24px',
//     fontWeight: '700',
//     color: '#0f1f3d',
//     marginBottom: '6px',
//     letterSpacing: '-0.3px',
//   },
//   cardSubtitle: {
//     fontSize: '14px',
//     color: '#64748b',
//     fontWeight: '400',
//     lineHeight: '1.5',
//   },
//   errorBox: {
//     display: 'flex',
//     alignItems: 'center',
//     gap: '8px',
//     backgroundColor: '#fef2f2',
//     border: '1px solid #fecaca',
//     borderRadius: '8px',
//     padding: '12px 14px',
//     fontSize: '13px',
//     color: '#dc2626',
//     marginBottom: '20px',
//     fontWeight: '400',
//   },
//   errorIcon: {
//     fontSize: '14px',
//     flexShrink: 0,
//   },
//   form: {
//     display: 'flex',
//     flexDirection: 'column',
//     gap: '20px',
//   },
//   fieldGroup: {
//     display: 'flex',
//     flexDirection: 'column',
//     gap: '7px',
//   },
//   label: {
//     fontSize: '13px',
//     fontWeight: '500',
//     color: '#0f1f3d',
//   },
//   input: {
//     padding: '11px 14px',
//     borderRadius: '8px',
//     border: '1.5px solid #e2e8f0',
//     fontSize: '14px',
//     color: '#0f1f3d',
//     backgroundColor: '#f8fafc',
//     outline: 'none',
//     width: '100%',
//     fontFamily: 'inherit',
//   },
//   passwordWrapper: {
//     position: 'relative',
//     width: '100%',
//   },
//   eyeButton: {
//     position: 'absolute',
//     right: '12px',
//     top: '50%',
//     transform: 'translateY(-50%)',
//     background: 'none',
//     border: 'none',
//     cursor: 'pointer',
//     padding: '0',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   submitButton: {
//     backgroundColor: '#1046a0',
//     color: '#ffffff',
//     border: 'none',
//     borderRadius: '8px',
//     padding: '13px',
//     fontSize: '14px',
//     fontWeight: '600',
//     width: '100%',
//     marginTop: '4px',
//     fontFamily: 'inherit',
//   },
//   divider: {
//     height: '1px',
//     backgroundColor: '#e2e8f0',
//     margin: '24px 0 20px',
//   },
//   footerNote: {
//     textAlign: 'center',
//     fontSize: '13px',
//     color: '#64748b',
//   },
//   footerLink: {
//     color: '#1046a0',
//     fontWeight: '500',
//     cursor: 'pointer',
//   },
// }

// export default LoginPage

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { loginUser, checkEmail } from '../services/api'
import SetPasswordForm from '../components/SetPasswordForm'
import { useMaxWidth } from '../hooks/useMaxWidth'

function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // 'login'  = the normal email + password form
  // 'setup'  = the email belongs to a pre-registered analyst who has no password
  //            yet, so we show the "Create your password" form instead
  const [mode, setMode] = useState('login')

  const { login } = useAuth()
  const navigate = useNavigate()

  // Only on phone-sized screens is the blue side panel hidden, so the
  // sign-in card gets the whole screen. Laptop windows, even half-width
  // ones, keep both panels.
  const isNarrow = useMaxWidth(500)

  // Used by BOTH a normal sign-in and a first-time password setup:
  // save the session, then send the person to the right dashboard.
  const finishLogin = ({ user, token, refresh }) => {
    login(user, token, refresh)
    if (user.role === 'analyst') {
      navigate('/analyst')
    } else if (user.role === 'manager') {
      navigate('/manager')
    }
  }

  // Runs when the person leaves the email box. We quietly ask Django whether
  // this email is a pre-registered account that still needs a password.
  const handleEmailBlur = () => {
    const value = email.trim()
    if (!value.includes('@')) return

    checkEmail(value)
      .then((res) => {
        if (res.data.needs_setup) {
          setError('')
          setMode('setup')
        }
      })
      .catch(() => {
        // If the check fails, do nothing. Normal sign-in still works.
      })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await loginUser(email, password)
      finishLogin(response.data)
    } catch (err) {
      const message = err.response?.data?.message || 'Invalid email or password'

      // Safety net: if the sign-in failed because this analyst has no password
      // yet (they submitted before the check above finished), switch to setup.
      try {
        const res = await checkEmail(email.trim())
        if (res.data.needs_setup) {
          setMode('setup')
          return
        }
      } catch {
        // ignore, fall through to showing the normal error
      }

      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.page}>

      {/* LEFT PANEL — hidden on narrow screens */}
      {!isNarrow && (
      <div style={styles.leftPanel}>
        <div style={styles.leftContent}>
          <div style={styles.brandRow}>
            <img src="/logo.png" alt="GearUp Africa" style={styles.leftLogo} />
            <p style={styles.leftBrandName}>GearUp Africa</p>
          </div>
          <h2 style={styles.leftHeading}>
            Empowering Africa's next generation of analysts.
          </h2>
          <p style={styles.leftSubtext}>
            Track your growth, receive feedback, and build the skills that matter — one semester at a time.
          </p>
          <div style={styles.statsRow}>
            <div style={styles.statItem}>
              <span style={styles.statNumber}>3</span>
              <span style={styles.statLabel}>Year programme</span>
            </div>
            <div style={styles.statDivider} />
            <div style={styles.statItem}>
              <span style={styles.statNumber}>2×</span>
              <span style={styles.statLabel}>Reviews per semester</span>
            </div>
            <div style={styles.statDivider} />
            <div style={styles.statItem}>
              <span style={styles.statNumber}>100%</span>
              <span style={styles.statLabel}>Personalised feedback</span>
            </div>
          </div>
        </div>
      </div>
      )}

      {/* RIGHT PANEL — login form */}
      <div style={isNarrow ? { ...styles.rightPanel, padding: '24px 16px' } : styles.rightPanel}>
        <div style={isNarrow ? { ...styles.card, padding: '32px 24px' } : styles.card}>

          {mode === 'setup' ? (
            /* FIRST-TIME SETUP — the analyst creates their own password */
            <>
              <div style={styles.cardHeader}>
                <img src="/logo.png" alt="GearUp Africa" style={styles.cardLogo} />
              </div>
              <SetPasswordForm
                email={email.trim()}
                onSuccess={finishLogin}
                onCancel={() => {
                  setMode('login')
                  setPassword('')
                  setError('')
                }}
              />
            </>
          ) : (
            /* NORMAL SIGN-IN */
            <>
              <div style={styles.cardHeader}>
                <img src="/logo.png" alt="GearUp Africa" style={styles.cardLogo} />
                <h1 style={styles.cardTitle}>Welcome back</h1>
                <p style={styles.cardSubtitle}>
                  Sign in to the GearUp Analyst Review Portal
                </p>
              </div>

              {error && (
                <div style={styles.errorBox}>
                  <span style={styles.errorIcon}>⚠</span>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} style={styles.form}>

                <div style={styles.fieldGroup}>
                  <label style={styles.label}>Email address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={handleEmailBlur}
                    placeholder="you@gearupafrica.com"
                    required
                    style={styles.input}
                  />
                </div>

                <div style={styles.fieldGroup}>
                  <label style={styles.label}>Password</label>
                  <div style={styles.passwordWrapper}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      required
                      style={{ ...styles.input, paddingRight: '44px' }}
                    />
                    {/* Proper SVG eye icon — not an emoji */}
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={styles.eyeButton}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? (
                        // Eye with slash — password visible, click to hide
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                          <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                          <line x1="1" y1="1" x2="23" y2="23" />
                        </svg>
                      ) : (
                        // Open eye — password hidden, click to show
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    ...styles.submitButton,
                    opacity: loading ? 0.75 : 1,
                    cursor: loading ? 'not-allowed' : 'pointer',
                  }}
                >
                  {loading ? 'Signing in...' : 'Sign in'}
                </button>

              </form>
            </>
          )}

          <div style={styles.divider} />

          <p style={styles.footerNote}>
            Don't have an account?{' '}
            <span style={styles.footerLink}>Contact your manager</span>
          </p>

        </div>
      </div>

    </div>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'row',
  },
  // Left panel — 42% width, not taking up too much space
  leftPanel: {
    width: '45%',
    backgroundColor: '#1046a0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start', // content aligned left not center
    padding: '60px clamp(24px, 4vw, 48px)',
    boxSizing: 'border-box',
    minWidth: 0,
    overflow: 'hidden',
  },
  leftContent: {
    maxWidth: '460px',
    width: '100%',
    minWidth: 0,
  },
  brandRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '48px',
  },
  leftLogo: {
    height: '42px',
    objectFit: 'contain',
  },
  leftBrandName: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#ffffff',
  },
  leftHeading: {
    fontSize: 'clamp(24px, 2.8vw, 32px)', // shrinks with the window
    fontWeight: '700',
    color: '#ffffff',
    lineHeight: '1.25',
    overflowWrap: 'break-word',
    marginBottom: '20px',
    letterSpacing: '-0.5px',
  },
  leftSubtext: {
    fontSize: '14px',
    color: '#a8c4f0',
    lineHeight: '1.7',
    marginBottom: '48px',
    fontWeight: '300',
  },
  statsRow: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'nowrap', // always one row
    gap: 'clamp(10px, 1.6vw, 20px)',
  },
  statItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    minWidth: 0, // lets the label wrap onto two lines when space is tight
  },
  statNumber: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#ffffff',
  },
  statLabel: {
    fontSize: '11px',
    color: '#a8c4f0',
    fontWeight: '400',
  },
  statDivider: {
    width: '1px',
    height: '36px',
    backgroundColor: '#2d5faa',
    flexShrink: 0,
  },
  // Right panel takes the remaining space
  rightPanel: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f4f8',
    padding: '40px clamp(16px, 3vw, 32px)',
    boxSizing: 'border-box',
    minWidth: 0,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    border: '1px solid #e2e8f0',
    padding: '40px clamp(20px, 3vw, 36px)',
    width: '100%',
    maxWidth: '400px',
    boxSizing: 'border-box',
  },
  cardHeader: {
    marginBottom: '28px',
  },
  cardLogo: {
    height: '32px',
    objectFit: 'contain',
    marginBottom: '20px',
  },
  cardTitle: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#0f1f3d',
    marginBottom: '6px',
    letterSpacing: '-0.3px',
  },
  cardSubtitle: {
    fontSize: '14px',
    color: '#64748b',
    fontWeight: '400',
    lineHeight: '1.5',
  },
  errorBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: '#fef2f2',
    border: '1px solid #fecaca',
    borderRadius: '8px',
    padding: '12px 14px',
    fontSize: '13px',
    color: '#dc2626',
    marginBottom: '20px',
    fontWeight: '400',
  },
  errorIcon: {
    fontSize: '14px',
    flexShrink: 0,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '7px',
  },
  label: {
    fontSize: '13px',
    fontWeight: '500',
    color: '#0f1f3d',
  },
  input: {
    padding: '11px 14px',
    borderRadius: '8px',
    border: '1.5px solid #e2e8f0',
    fontSize: '14px',
    color: '#0f1f3d',
    backgroundColor: '#f8fafc',
    outline: 'none',
    width: '100%',
    fontFamily: 'inherit',
  },
  passwordWrapper: {
    position: 'relative',
    width: '100%',
  },
  eyeButton: {
    position: 'absolute',
    right: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButton: {
    backgroundColor: '#1046a0',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    padding: '13px',
    fontSize: '14px',
    fontWeight: '600',
    width: '100%',
    marginTop: '4px',
    fontFamily: 'inherit',
  },
  divider: {
    height: '1px',
    backgroundColor: '#e2e8f0',
    margin: '24px 0 20px',
  },
  footerNote: {
    textAlign: 'center',
    fontSize: '13px',
    color: '#64748b',
  },
  footerLink: {
    color: '#1046a0',
    fontWeight: '500',
    cursor: 'pointer',
  },
}

export default LoginPage