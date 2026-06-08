import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useToast } from '../hooks/useToast'
import api from '../api/axiosInstance'
import Navbar from '../components/common/Navbar'
import Spinner from '../components/common/Spinner'
import Button from '../components/common/Button'
import TodoCard from '../components/todos/TodoCard'

const STATS_CONFIG = [
  { label: 'Total Tasks', key: 'total', color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)' },
  { label: 'Completed', key: 'completed', color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
  { label: 'Pending', key: 'pending', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
  { label: 'Urgent', key: 'urgent', color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
]

const getGreeting = () => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

const currentDate = new Date().toLocaleDateString('en-US', {
  weekday: 'long', month: 'long', day: 'numeric',
})

export default function DashboardPage() {
  const { user } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()

  const [todos, setTodos] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    fetchTodos()
  }, [])

  const fetchTodos = async () => {
    try {
      setLoading(true)
      const { data } = await api.get('/todos')
      setTodos(data)
    } catch {
      showToast('Failed to load tasks', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleToggle = async (id, completed) => {
    try {
      await api.put(`/todos/${id}`, { completed })
      setTodos((prev) => prev.map((t) => (t._id === id ? { ...t, completed } : t)))
      showToast(completed ? 'Marked as complete!' : 'Marked as pending', 'success')
    } catch {
      showToast('Failed to update task', 'error')
    }
  }

  const handleEdit = (todo) => {
    navigate(`/todos/edit/${todo._id}`, { state: { todo } })
  }

  const handleDelete = async (id) => {
    try {
      await api.delete(`/todos/${id}`)
      setTodos((prev) => prev.filter((t) => t._id !== id))
      showToast('Task deleted', 'success')
    } catch {
      showToast('Failed to delete task', 'error')
    }
  }

  const filteredTodos = todos
    .filter((t) => categoryFilter === 'all' || t.category === categoryFilter)
    .filter((t) => {
      if (statusFilter === 'completed') return t.completed
      if (statusFilter === 'pending') return !t.completed
      return true
    })
    .filter((t) => t.title.toLowerCase().includes(search.toLowerCase()))

  const stats = {
    total: todos.length,
    completed: todos.filter((t) => t.completed).length,
    pending: todos.filter((t) => !t.completed).length,
    urgent: todos.filter((t) => t.category === 'Urgent' && !t.completed).length,
  }

  const isAdmin = user?.role === 'admin'

  const selectStyle = {
    padding: '9px 14px', fontSize: '13px', borderRadius: '10px', cursor: 'pointer',
    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
    color: '#94a3b8', fontFamily: 'Inter, sans-serif', outline: 'none',
  }

  return (
    <div style={{ minHeight: '100vh', background: '#09090f' }}>
      <Navbar />

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '36px 24px' }}>

        <div className="animate-fade-in" style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '26px', fontWeight: '700', color: '#f1f5f9', marginBottom: '4px' }}>
            {getGreeting()}, <span className="gradient-text">{user?.username}</span> 👋
          </h1>
          <p style={{ fontSize: '14px', color: '#64748b' }}>{currentDate}</p>
          {isAdmin && (
            <span style={{ marginTop: '8px', display: 'inline-block', fontSize: '12px', fontWeight: '600', padding: '3px 10px', borderRadius: '20px', background: 'rgba(139,92,246,0.15)', color: '#a78bfa', border: '1px solid rgba(139,92,246,0.25)' }}>
              Admin View — Showing all users' tasks
            </span>
          )}
        </div>

        <div className="animate-slide-up" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '32px' }}>
          {STATS_CONFIG.map(({ label, key, color, bg }) => (
            <div key={key} className="stat-card">
              <p style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
                {label}
              </p>
              <p style={{ fontSize: '32px', fontWeight: '800', color, lineHeight: 1 }}>
                {stats[key]}
              </p>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
            <svg width="16" height="16" fill="none" stroke="#64748b" strokeWidth="2" viewBox="0 0 24 24" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}>
              <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-base"
              style={{ padding: '9px 14px 9px 38px', fontSize: '14px' }}
            />
          </div>

          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} style={selectStyle}>
            <option value="all">All Categories</option>
            <option value="Urgent">Urgent</option>
            <option value="Non-Urgent">Non-Urgent</option>
          </select>

          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={selectStyle}>
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>

          <Button onClick={() => navigate('/todos/new')} size="md">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            New Task
          </Button>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '80px' }}>
            <Spinner size="lg" />
          </div>
        ) : filteredTodos.length === 0 ? (
          <div className="animate-fade-in" style={{ textAlign: 'center', padding: '80px 20px' }}>
            <svg width="64" height="64" fill="none" stroke="rgba(139,92,246,0.3)" strokeWidth="1.5" viewBox="0 0 24 24" style={{ margin: '0 auto 16px' }}>
              <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
              <rect x="9" y="3" width="6" height="4" rx="1" />
            </svg>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#f1f5f9', marginBottom: '8px' }}>
              {todos.length === 0 ? 'No tasks yet' : 'No tasks match your filters'}
            </h3>
            <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '24px' }}>
              {todos.length === 0 ? 'Create your first task to get started' : 'Try adjusting the search or filters'}
            </p>
            {todos.length === 0 && (
              <Button onClick={() => navigate('/todos/new')}>Create First Task</Button>
            )}
          </div>
        ) : (
          <div className="animate-slide-up" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
            {filteredTodos.map((todo) => (
              <TodoCard
                key={todo._id}
                todo={todo}
                onToggle={handleToggle}
                onEdit={handleEdit}
                onDelete={handleDelete}
                showUser={isAdmin}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
