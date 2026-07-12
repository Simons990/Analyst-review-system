import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('http://localhost:8000/api/auth/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || 'Invalid email or password')
        return
      }

      login(data.user, data.token)

      if (data.user.role === 'analyst') {
        navigate('/analyst')
      } else if (data.user.role === 'manager') {
        navigate('/manager')
      }

    } catch (err) {
      setError('Unable to connect. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.page}>

      <div style={styles.leftPanel}>
        <div style={styles.leftContent}>
        <div style={styles.brandRow}>
  <img src="/logo.png" alt="GearUp Africa" style={styles.leftLogo} />
  <p style={styles.leftBrandName}>GearUp Africa</p>
</div>
          <h2 style={styles.leftHeading}>
            Empowering Africa's<br />next generation of<br />analysts.
          </h2>
          <p style={styles.leftSubtext}>
            Track your growth, receive feedback, and build the skills that matter 
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

      <div style={styles.rightPanel}>
        <div style={styles.card}>

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
                placeholder="you@gearupafrica.com"
                required
                style={styles.input}
                onFocus={e => Object.assign(e.target.style, styles.inputFocus)}
                onBlur={e => Object.assign(e.target.style, styles.input)}
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
                  onFocus={e => Object.assign(e.target.style, styles.inputFocus)}
                  onBlur={e => Object.assign(e.target.style, { ...styles.input, paddingRight: '44px' })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={styles.eyeButton}
                >
                  {showPassword ? '🙈' : '👁'}
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
              {loading ? (
                <span style={styles.loadingRow}>
                  <span style={styles.spinner} /> Signing in...
                </span>
              ) : (
                'Sign in'
              )}
            </button>

          </form>

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

  leftPanel: {
    flex: 1,
    backgroundColor: '#1046a0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 48px',
    '@media (max-width: 768px)': {
      display: 'none',
    },
  },
  leftContent: {
    maxWidth: '400px',
  },
  leftLogo: {
    height: '52px',
    objectFit: 'contain',
  },
  leftBrandName: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: '0.01em',
  },
  brandRow: {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  marginBottom: '48px',
},
  leftHeading: {
    fontSize: '36px',
    fontWeight: '700',
    color: '#ffffff',
    lineHeight: '1.25',
    marginBottom: '20px',
    letterSpacing: '-0.5px',
  },
  leftSubtext: {
    fontSize: '15px',
    color: '#a8c4f0',
    lineHeight: '1.7',
    marginBottom: '48px',
    fontWeight: '300',
  },
  statsRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
  },
  statItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  statNumber: {
    fontSize: '22px',
    fontWeight: '700',
    color: '#ffffff',
  },
  statLabel: {
    fontSize: '12px',
    color: '#a8c4f0',
    fontWeight: '400',
  },
  statDivider: {
    width: '1px',
    height: '36px',
    backgroundColor: '#2d5faa',
  },

  rightPanel: {
    width: '480px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f4f8',
    padding: '40px 32px',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    border: '1px solid #e2e8f0',
    padding: '40px 36px',
    width: '100%',
    maxWidth: '400px',
  },
  cardHeader: {
    marginBottom: '32px',
  },
  cardLogo: {
    height: '32px',
    objectFit: 'contain',
    marginBottom: '24px',
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
    letterSpacing: '0.01em',
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
    transition: 'border-color 0.15s ease',
    fontWeight: '400',
  },
  inputFocus: {
    padding: '11px 14px',
    borderRadius: '8px',
    border: '1.5px solid #1046a0',
    fontSize: '14px',
    color: '#0f1f3d',
    backgroundColor: '#ffffff',
    outline: 'none',
    width: '100%',
    fontWeight: '400',
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
    fontSize: '16px',
    padding: '0',
    lineHeight: '1',
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
    letterSpacing: '0.01em',
  },
  loadingRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  },
  spinner: {
    width: '14px',
    height: '14px',
    border: '2px solid rgba(255,255,255,0.3)',
    borderTopColor: '#ffffff',
    borderRadius: '50%',
    display: 'inline-block',
    animation: 'spin 0.7s linear infinite',
  },
  divider: {
    height: '1px',
    backgroundColor: '#e2e8f0',
    margin: '28px 0 20px',
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