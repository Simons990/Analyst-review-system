import { useState } from 'react'
import { activateAccount } from '../services/api'

// Shown on the login page when the email the analyst typed is a pre-registered
// account that has no password yet. The analyst picks their own password here.
//
// Props:
//   email      - the email already typed on the login page
//   onSuccess  - called with { token, refresh, user } (same shape as a normal login)
//   onCancel   - called if they want to go back and use a different email
function SetPasswordForm({ email, onSuccess, onCancel }) {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Quick checks in the browser. Django checks again (it is the real gatekeeper).
    if (password.length < 8) return setError('Your password must be at least 8 characters.')
    if (password !== confirm) return setError('The two passwords do not match.')

    setSaving(true)
    try {
      const res = await activateAccount(email, password)
      onSuccess(res.data) // the parent logs them in and moves to their dashboard
    } catch (err) {
      setError(err.response?.data?.message || 'Could not set your password. Please try again.')
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <div>
        <h2 style={styles.title}>Create your password</h2>
        <p style={styles.sub}>
          We found your GearUp account for <strong>{email}</strong>.
          Choose a password to finish setting it up. You will use it every time you sign in.
        </p>
      </div>

      <div style={styles.fieldGroup}>
        <label style={styles.label} htmlFor="new-password">New password</label>
        <input
          id="new-password"
          style={styles.input}
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="At least 8 characters"
          autoComplete="new-password"
          autoFocus
          required
        />
      </div>

      <div style={styles.fieldGroup}>
        <label style={styles.label} htmlFor="confirm-password">Confirm password</label>
        <input
          id="confirm-password"
          style={styles.input}
          type="password"
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
          placeholder="Type it again"
          autoComplete="new-password"
          required
        />
      </div>

      {error && <div style={styles.error} role="alert">{error}</div>}

      <button type="submit" disabled={saving} style={{ ...styles.submitBtn, opacity: saving ? 0.7 : 1 }}>
        {saving ? 'Setting up…' : 'Create password and sign in'}
      </button>

      <button type="button" onClick={onCancel} disabled={saving} style={styles.backBtn}>
        Use a different email
      </button>
    </form>
  )
}

const styles = {
  form: { display: 'flex', flexDirection: 'column', gap: '18px' },
  title: { fontSize: '22px', fontWeight: '700', color: '#0f1f3d', marginBottom: '6px', letterSpacing: '-0.3px' },
  sub: { fontSize: '14px', color: '#64748b', lineHeight: '1.6' },
  fieldGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '13px', fontWeight: '500', color: '#1e293b' },
  input: { padding: '11px 13px', borderRadius: '8px', border: '1.5px solid #e2e8f0', fontSize: '14px', color: '#0f1f3d', backgroundColor: '#f8fafc', outline: 'none', width: '100%', fontFamily: 'inherit', boxSizing: 'border-box' },
  error: { backgroundColor: '#fff0f0', border: '1px solid #fecaca', color: '#b91c1c', borderRadius: '8px', padding: '10px 14px', fontSize: '13px' },
  submitBtn: { padding: '12px', borderRadius: '8px', fontSize: '14px', fontWeight: '600', color: '#ffffff', backgroundColor: '#1046a0', border: 'none', cursor: 'pointer', fontFamily: 'inherit' },
  backBtn: { background: 'none', border: 'none', fontSize: '13px', color: '#1046a0', fontWeight: '500', cursor: 'pointer', padding: 0, fontFamily: 'inherit' },
}

export default SetPasswordForm