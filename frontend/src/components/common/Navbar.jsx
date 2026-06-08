import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

function LogoIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <rect width="28" height="28" rx="8" fill="url(#lg)" />
      <path d="M8 9h12M8 14h8M8 19h10" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <circle cx="20" cy="19" r="3" fill="white" fillOpacity="0.9" />
      <defs>
        <linearGradient id="lg" x1="0" y1="0" x2="28" y2="28" gradientUnits="userSpaceOnUse">
          <stop stopColor="#7c3aed" />
          <stop offset="1" stopColor="#a78bfa" />
        </linearGradient>
      </defs>
    </svg>
  )
}

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const navLink = (path, label) => {
    const active = pathname === path
    return (
      <Link
        to={path}
        style={{
          fontSize: '14px',
          fontWeight: '500',
          color: active ? '#a78bfa' : '#64748b',
          textDecoration: 'none',
          padding: '6px 12px',
          borderRadius: '8px',
          background: active ? 'rgba(139, 92, 246, 0.1)' : 'transparent',
          transition: 'all 0.2s ease',
        }}
      >
        {label}
      </Link>
    )
  }

  return (
    <nav
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'rgba(9, 9, 15, 0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 24px',
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <LogoIcon />
          <span className="gradient-text" style={{ fontSize: '18px', fontWeight: '700', letterSpacing: '-0.02em' }}>
            TaskFlow
          </span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {navLink('/dashboard', 'Dashboard')}
          {user?.role === 'admin' && navLink('/admin', 'Admin')}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '6px 12px',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.07)',
              borderRadius: '10px',
            }}
          >
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #7c3aed, #a78bfa)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: '700',
                color: 'white',
                flexShrink: 0,
              }}
            >
              {user?.username?.[0]?.toUpperCase() || 'U'}
            </div>
            <div>
              <p style={{ fontSize: '13px', fontWeight: '600', color: '#f1f5f9', lineHeight: 1, marginBottom: '2px' }}>
                {user?.username}
              </p>
              <p style={{ fontSize: '10px', fontWeight: '600', color: user?.role === 'admin' ? '#a78bfa' : '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', lineHeight: 1 }}>
                {user?.role}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="btn-ghost"
            style={{ padding: '8px 16px', fontSize: '13px' }}
          >
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </div>
    </nav>
  )
}
