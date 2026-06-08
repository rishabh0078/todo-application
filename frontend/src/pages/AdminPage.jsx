import { useState, useEffect } from 'react'
import { useToast } from '../hooks/useToast'
import api from '../api/axiosInstance'
import Navbar from '../components/common/Navbar'
import Spinner from '../components/common/Spinner'
import Button from '../components/common/Button'

const formatDate = (dateStr) => {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function TabButton({ label, active, onClick, count }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '9px 20px', fontSize: '14px', fontWeight: '600', borderRadius: '10px',
        border: 'none', cursor: 'pointer', fontFamily: 'Inter, sans-serif',
        background: active ? 'rgba(139,92,246,0.15)' : 'transparent',
        color: active ? '#a78bfa' : '#64748b',
        transition: 'all 0.2s ease',
        display: 'flex', alignItems: 'center', gap: '8px',
      }}
    >
      {label}
      <span style={{
        fontSize: '11px', fontWeight: '700', padding: '2px 7px', borderRadius: '20px',
        background: active ? 'rgba(139,92,246,0.2)' : 'rgba(255,255,255,0.06)',
        color: active ? '#a78bfa' : '#64748b',
      }}>
        {count}
      </span>
    </button>
  )
}

const thStyle = {
  padding: '12px 16px', fontSize: '11px', fontWeight: '600', color: '#64748b',
  textTransform: 'uppercase', letterSpacing: '0.06em', textAlign: 'left',
  borderBottom: '1px solid rgba(255,255,255,0.06)',
}

const tdStyle = {
  padding: '14px 16px', fontSize: '13px', color: '#f1f5f9',
  borderBottom: '1px solid rgba(255,255,255,0.04)',
}

export default function AdminPage() {
  const { showToast } = useToast()

  const [activeTab, setActiveTab] = useState('users')
  const [users, setUsers] = useState([])
  const [todos, setTodos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAdminData()
  }, [])

  const fetchAdminData = async () => {
    try {
      setLoading(true)
      const [usersRes, todosRes] = await Promise.all([
        api.get('/admin/users'),
        api.get('/admin/todos'),
      ])
      setUsers(usersRes.data)
      setTodos(todosRes.data)
    } catch {
      showToast('Failed to load admin data', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleRoleChange = async (userId, newRole) => {
    try {
      await api.patch(`/admin/users/${userId}/role`, { role: newRole })
      setUsers((prev) => prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u)))
      showToast('User role updated', 'success')
    } catch {
      showToast('Failed to update role', 'error')
    }
  }

  const handleDeleteTodo = async (todoId) => {
    try {
      await api.delete(`/todos/${todoId}`)
      setTodos((prev) => prev.filter((t) => t._id !== todoId))
      showToast('Task deleted', 'success')
    } catch {
      showToast('Failed to delete task', 'error')
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#09090f' }}>
      <Navbar />

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '36px 24px' }}>
        <div className="animate-fade-in" style={{ marginBottom: '28px' }}>
          <h1 style={{ fontSize: '26px', fontWeight: '700', color: '#f1f5f9', marginBottom: '4px' }}>Admin Dashboard</h1>
          <p style={{ fontSize: '14px', color: '#64748b' }}>Manage all users and tasks across the platform</p>
        </div>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', padding: '6px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)', width: 'fit-content' }}>
          <TabButton label="Users" active={activeTab === 'users'} onClick={() => setActiveTab('users')} count={users.length} />
          <TabButton label="All Tasks" active={activeTab === 'todos'} onClick={() => setActiveTab('todos')} count={todos.length} />
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '80px' }}>
            <Spinner size="lg" />
          </div>
        ) : (
          <div className="glass-card animate-slide-up" style={{ overflow: 'hidden' }}>
            {activeTab === 'users' && (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th style={thStyle}>Username</th>
                      <th style={thStyle}>Email</th>
                      <th style={thStyle}>Role</th>
                      <th style={thStyle}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u._id} style={{ transition: 'background 0.15s' }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        <td style={tdStyle}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg,#7c3aed,#a78bfa)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '700', color: 'white', flexShrink: 0 }}>
                              {u.username?.[0]?.toUpperCase()}
                            </div>
                            {u.username}
                          </div>
                        </td>
                        <td style={{ ...tdStyle, color: '#94a3b8' }}>{u.email}</td>
                        <td style={tdStyle}>
                          <span style={{
                            fontSize: '11px', fontWeight: '600', padding: '3px 10px', borderRadius: '20px',
                            textTransform: 'uppercase', letterSpacing: '0.04em',
                            background: u.role === 'admin' ? 'rgba(139,92,246,0.15)' : 'rgba(255,255,255,0.06)',
                            color: u.role === 'admin' ? '#a78bfa' : '#64748b',
                            border: `1px solid ${u.role === 'admin' ? 'rgba(139,92,246,0.25)' : 'rgba(255,255,255,0.08)'}`,
                          }}>
                            {u.role}
                          </span>
                        </td>
                        <td style={tdStyle}>
                          <Button
                            variant={u.role === 'admin' ? 'ghost' : 'primary'}
                            size="sm"
                            onClick={() => handleRoleChange(u._id, u.role === 'admin' ? 'user' : 'admin')}
                          >
                            {u.role === 'admin' ? 'Demote to User' : 'Promote to Admin'}
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {users.length === 0 && (
                  <p style={{ textAlign: 'center', padding: '40px', color: '#64748b', fontSize: '14px' }}>No users found</p>
                )}
              </div>
            )}

            {activeTab === 'todos' && (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th style={thStyle}>Title</th>
                      <th style={thStyle}>Owner</th>
                      <th style={thStyle}>Category</th>
                      <th style={thStyle}>Status</th>
                      <th style={thStyle}>Due Date</th>
                      <th style={thStyle}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {todos.map((t) => (
                      <tr key={t._id}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        <td style={{ ...tdStyle, maxWidth: '240px' }}>
                          <span style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: t.completed ? '#64748b' : '#f1f5f9', textDecoration: t.completed ? 'line-through' : 'none' }}>
                            {t.title}
                          </span>
                        </td>
                        <td style={{ ...tdStyle, color: '#8b5cf6', fontWeight: '500' }}>
                          @{t.user?.username || '—'}
                        </td>
                        <td style={tdStyle}>
                          <span style={{
                            fontSize: '11px', fontWeight: '600', padding: '3px 10px', borderRadius: '20px',
                            background: t.category === 'Urgent' ? 'rgba(239,68,68,0.15)' : 'rgba(99,102,241,0.15)',
                            color: t.category === 'Urgent' ? '#f87171' : '#818cf8',
                          }}>
                            {t.category}
                          </span>
                        </td>
                        <td style={tdStyle}>
                          <span style={{ fontSize: '12px', color: t.completed ? '#10b981' : '#f59e0b', fontWeight: '600' }}>
                            {t.completed ? 'Completed' : 'Pending'}
                          </span>
                        </td>
                        <td style={{ ...tdStyle, color: '#94a3b8' }}>{formatDate(t.dueDate)}</td>
                        <td style={tdStyle}>
                          <Button variant="danger" size="sm" onClick={() => handleDeleteTodo(t._id)}>
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {todos.length === 0 && (
                  <p style={{ textAlign: 'center', padding: '40px', color: '#64748b', fontSize: '14px' }}>No tasks found</p>
                )}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
