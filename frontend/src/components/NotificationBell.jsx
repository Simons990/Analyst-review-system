import { useState, useRef, useEffect } from 'react'

// Turns an ISO timestamp into "2 minutes ago", "Yesterday", etc.
function timeAgo(iso) {
  if (!iso) return ''
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins} minute${mins === 1 ? '' : 's'} ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`
  const days = Math.floor(hours / 24)
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days} days ago`
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

// notifications: [{ id, message, created_at, read }]
// onMarkAllRead: called when the dropdown closes and there were unread items
function NotificationBell({ notifications, onMarkAllRead }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  const unread = notifications.filter(n => !n.is_read).length

  // Mark everything read when the dropdown closes (not while it is open),
  // so the unread highlights stay visible while the person reads them.
  const closeDropdown = () => {
    setOpen(false)
    if (unread > 0) onMarkAllRead?.()
  }

  const toggleDropdown = () => {
    if (open) closeDropdown()
    else setOpen(true)
  }

  // While open, a click anywhere outside the bell closes it
  useEffect(() => {
    if (!open) return
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false)
        if (unread > 0) onMarkAllRead?.()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open, unread, onMarkAllRead])

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button onClick={toggleDropdown} style={nb.bellBtn} aria-label="Notifications">
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
            <div style={{ maxHeight: '360px', overflowY: 'auto' }}>
              {notifications.map(n => (
                <div key={n.id} style={{ ...nb.item, backgroundColor: n.is_read ? '#fff' : '#f0f6ff' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: n.is_read ? '#cbd5e1' : '#1046a0', flexShrink: 0, marginTop: 4 }} />
                  <div>
                    <p style={nb.msg}>{n.message}</p>
                    <p style={nb.time}>{timeAgo(n.created_at)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

const nb = {
  bellBtn: { position: 'relative', background: 'none', border: '1px solid #e2e8f0', borderRadius: '8px', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b' },
  badge: { position: 'absolute', top: '-6px', right: '-6px', backgroundColor: '#dc2626', color: '#fff', fontSize: '10px', fontWeight: '700', minWidth: '16px', height: '16px', padding: '0 3px', boxSizing: 'border-box', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #fff' },
  dropdown: { position: 'absolute', top: '44px', right: '0', width: '320px', backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 8px 24px rgba(0,0,0,0.10)', zIndex: 200, overflow: 'hidden' },
  dropHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderBottom: '1px solid #f1f5f9', backgroundColor: '#f8fafc' },
  dropTitle: { fontSize: '13px', fontWeight: '600', color: '#0f1f3d' },
  unreadPill: { fontSize: '11px', fontWeight: '600', color: '#1046a0', backgroundColor: '#e6f1fb', padding: '2px 8px', borderRadius: '20px' },
  empty: { padding: '28px 16px', textAlign: 'center' },
  emptyText: { fontSize: '13px', color: '#94a3b8' },
  item: { display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '12px 16px', borderBottom: '1px solid #f1f5f9' },
  msg: { fontSize: '13px', color: '#0f1f3d', lineHeight: '1.5', marginBottom: '3px' },
  time: { fontSize: '11px', color: '#94a3b8' },
}

export default NotificationBell