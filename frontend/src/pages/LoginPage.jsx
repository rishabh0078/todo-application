import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useToast } from '../hooks/useToast'
import Input from '../components/common/Input'
import Button from '../components/common/Button'

export default function LoginPage() {
  const { login } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()

  const [form, setForm] = useState({ identifier: '', password: '' })
  const [errors, setErrors] = useState({})
  const [apiError, setApiError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setErrors((prev) => ({ ...prev, [e.target.name]: '' }))
    setApiError('')
  }

  const validate = () => {
    const newErrors = {}
    if (!form.identifier.trim()) newErrors.identifier = 'Email or username is required'
    if (!form.password) newErrors.password = 'Password is required'
    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    try {
      setLoading(true)
      await login(form)
      showToast('Welcome back!', 'success')
      navigate('/dashboard')
    } catch (err) {
      setApiError(err.response?.data?.message || 'Invalid credentials. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#09090f', padding: '24px', position: 'relative', overflow: 'hidden' }}>
      <div className="blob" style={{ width: '500px', height: '500px', top: '-150px', right: '-150px', background: 'radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 70%)' }} />
      <div className="blob" style={{ width: '400px', height: '400px', bottom: '-120px', left: '-120px', background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)' }} />

      <div className="glass-card animate-slide-up" style={{ width: '100%', maxWidth: '420px', padding: '40px', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '20px' }}>
            <svg width="32" height="32" viewBox="0 0 28 28" fill="none">
              <rect width="28" height="28" rx="8" fill="url(#lg2)" />
              <path d="M8 9h12M8 14h8M8 19h10" stroke="white" strokeWidth="2" strokeLinecap="round" />
              <circle cx="20" cy="19" r="3" fill="white" fillOpacity="0.9" />
              <defs>
                <linearGradient id="lg2" x1="0" y1="0" x2="28" y2="28" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#7c3aed" /><stop offset="1" stopColor="#a78bfa" />
                </linearGradient>
              </defs>
            </svg>
            <span className="gradient-text" style={{ fontSize: '22px', fontWeight: '800', letterSpacing: '-0.02em' }}>TaskFlow</span>
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#f1f5f9', marginBottom: '6px' }}>Welcome back</h1>
          <p style={{ fontSize: '14px', color: '#64748b' }}>Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <Input
            id="identifier"
            name="identifier"
            label="Email or Username"
            placeholder="Enter your email or username"
            value={form.identifier}
            onChange={handleChange}
            error={errors.identifier}
            autoComplete="username"
          />
          <Input
            id="password"
            name="password"
            type="password"
            label="Password"
            placeholder="Enter your password"
            value={form.password}
            onChange={handleChange}
            error={errors.password}
            autoComplete="current-password"
          />

          {apiError && (
            <div style={{ padding: '12px 14px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '10px', fontSize: '13px', color: '#f87171' }}>
              {apiError}
            </div>
          )}

          <Button type="submit" loading={loading} size="lg" style={{ width: '100%', marginTop: '4px' }}>
            Sign In
          </Button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: '#64748b' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: '#a78bfa', fontWeight: '600', textDecoration: 'none' }}>
            Create one
          </Link>
        </p>
      </div>
    </div>
  )
}
