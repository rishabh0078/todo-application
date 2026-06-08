import { useState } from 'react'

function EyeIcon({ visible }) {
  if (visible) {
    return (
      <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    )
  }
  return (
    <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  )
}

export default function Input({
  label,
  id,
  type = 'text',
  error,
  as,
  options,
  rows = 3,
  className = '',
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false)
  const isPassword = type === 'password'
  const resolvedType = isPassword ? (showPassword ? 'text' : 'password') : type
  const inputClass = `input-base ${error ? 'input-error' : ''} ${className}`
  const padding = { padding: '10px 14px' }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      {label && (
        <label htmlFor={id} style={{ fontSize: '13px', fontWeight: '500', color: '#94a3b8' }}>
          {label}
        </label>
      )}

      <div style={{ position: 'relative' }}>
        {as === 'textarea' ? (
          <textarea
            id={id}
            rows={rows}
            className={inputClass}
            style={{ ...padding, resize: 'vertical', minHeight: '90px' }}
            {...props}
          />
        ) : as === 'select' ? (
          <select id={id} className={inputClass} style={padding} {...props}>
            {options?.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        ) : (
          <input
            id={id}
            type={resolvedType}
            className={inputClass}
            style={{ ...padding, paddingRight: isPassword ? '42px' : '14px' }}
            {...props}
          />
        )}

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            style={{
              position: 'absolute',
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#64748b',
              display: 'flex',
              alignItems: 'center',
              padding: '2px',
            }}
          >
            <EyeIcon visible={showPassword} />
          </button>
        )}
      </div>

      {error && (
        <span style={{ fontSize: '12px', color: '#f87171' }}>{error}</span>
      )}
    </div>
  )
}
