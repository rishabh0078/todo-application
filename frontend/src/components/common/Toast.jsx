import { useEffect, useState } from 'react'
import { useToast } from '../../hooks/useToast'

const TYPE_CONFIG = {
  success: {
    icon: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>,
    color: '#10b981',
    bg: 'rgba(16, 185, 129, 0.1)',
    border: 'rgba(16, 185, 129, 0.25)',
  },
  error: {
    icon: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>,
    color: '#ef4444',
    bg: 'rgba(239, 68, 68, 0.1)',
    border: 'rgba(239, 68, 68, 0.25)',
  },
  warning: {
    icon: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /></svg>,
    color: '#f59e0b',
    bg: 'rgba(245, 158, 11, 0.1)',
    border: 'rgba(245, 158, 11, 0.25)',
  },
  info: {
    icon: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 16v-4m0-4h.01" /></svg>,
    color: '#8b5cf6',
    bg: 'rgba(139, 92, 246, 0.1)',
    border: 'rgba(139, 92, 246, 0.25)',
  },
}

function ToastItem({ toast, onRemove }) {
  const [leaving, setLeaving] = useState(false)
  const config = TYPE_CONFIG[toast.type] || TYPE_CONFIG.info

  const dismiss = () => {
    setLeaving(true)
    setTimeout(() => onRemove(toast.id), 250)
  }

  useEffect(() => {
    const timer = setTimeout(dismiss, 3800)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div
      className={leaving ? 'animate-toast-out' : 'animate-toast-in'}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '14px 16px',
        background: config.bg,
        border: `1px solid ${config.border}`,
        borderRadius: '12px',
        backdropFilter: 'blur(16px)',
        minWidth: '300px',
        maxWidth: '380px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      }}
    >
      <span style={{ color: config.color, flexShrink: 0 }}>{config.icon}</span>
      <span style={{ fontSize: '14px', fontWeight: '500', color: '#f1f5f9', flex: 1, lineHeight: '1.4' }}>
        {toast.message}
      </span>
      <button
        onClick={dismiss}
        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', flexShrink: 0, display: 'flex', padding: '2px' }}
      >
        <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}

export default function Toast() {
  const { toasts, removeToast } = useToast()

  return (
    <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
      ))}
    </div>
  )
}
