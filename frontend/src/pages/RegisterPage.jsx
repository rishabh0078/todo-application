import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useToast } from '../hooks/useToast'
import Input from '../components/common/Input'
import Button from '../components/common/Button'

export default function RegisterPage() {
  const { register } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()

  const [form, setForm] = useState({ email: '', username: '', password: '', role: 'user' })
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
    if (!form.email.trim()) newErrors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Enter a valid email address'
    if (!form.username.trim()) newErrors.username = 'Username is required'
    else if (form.username.length < 3) newErrors.username = 'Username must be at least 3 characters'
    if (!form.password) newErrors.password = 'Password is required'
    else if (form.password.length < 8) newErrors.password = 'Password must be at least 8 characters'
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
      await register(form)
      showToast('Account created! Please sign in.', 'success')
      navigate('/login')
    } catch (err) {
      setApiError(err.response?.data?.message || 'Registration failed. Please try again.')
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
              <rect width="28" height="28" rx="8" fill="url(#lg3)" />
              <path d="M8 9h12M8 14h8M8 19h10" stroke="white" strokeWidth="2" strokeLinecap="round" />
              <circle cx="20" cy="19" r="3" fill="white" fillOpacity="0.9" />
              <defs>
                <linearGradient id="lg3" x1="0" y1="0" x2="28" y2="28" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#7c3aed" /><stop offset="1" stopColor="#a78bfa" />
                </linearGradient>
              </defs>
            </svg>
            <span className="gradient-text" style={{ fontSize: '22px', fontWeight: '800', letterSpacing: '-0.02em' }}>TaskFlow</span>
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#f1f5f9', marginBottom: '6px' }}>Create an account</h1>
          <p style={{ fontSize: '14px', color: '#64748b' }}>Join TaskFlow and get organized</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <Input
            id="email"
            name="email"
            type="email"
            label="Email"
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange}
            error={errors.email}
            autoComplete="email"
          />
          <Input
            id="username"
            name="username"
            label="Username"
            placeholder="Choose a username"
            value={form.username}
            onChange={handleChange}
            error={errors.username}
            autoComplete="username"
          />
          <Input
            id="password"
            name="password"
            type="password"
            label="Password"
            placeholder="Min. 8 characters"
            value={form.password}
            onChange={handleChange}
            error={errors.password}
            autoComplete="new-password"
          />

          <Input
            id="role"
            name="role"
            as="select"
            label="Role"
            value={form.role}
            onChange={handleChange}
            options={[
              { value: 'user', label: 'User' },
              { value: 'admin', label: 'Admin' },
            ]}
          />

          {apiError && (
            <div style={{ padding: '12px 14px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '10px', fontSize: '13px', color: '#f87171' }}>
              {apiError}
            </div>
          )}

          <Button type="submit" loading={loading} size="lg" style={{ width: '100%', marginTop: '4px' }}>
            Create Account
          </Button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: '#64748b' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#a78bfa', fontWeight: '600', textDecoration: 'none' }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
