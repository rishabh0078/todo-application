import { useState, useEffect } from 'react'
import { useNavigate, useLocation, useParams } from 'react-router-dom'
import { useToast } from '../hooks/useToast'
import { useAuth } from '../hooks/useAuth'
import api from '../api/axiosInstance'
import Navbar from '../components/common/Navbar'
import Input from '../components/common/Input'
import Button from '../components/common/Button'

const CATEGORY_OPTIONS = [
  { value: 'Non-Urgent', label: 'Non-Urgent' },
  { value: 'Urgent', label: 'Urgent' },
]

const EMPTY_FORM = { title: '', description: '', dueDate: '', category: 'Non-Urgent', user: '' }

export default function TodoFormPage() {
  const { id } = useParams()
  const { state } = useLocation()
  const navigate = useNavigate()
  const { showToast } = useToast()

  const isEditing = Boolean(id)
  const existingTodo = state?.todo

  const { user: currentUser } = useAuth()
  const isAdmin = currentUser?.role === 'admin'

  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [users, setUsers] = useState([])

  useEffect(() => {
    if (isEditing && existingTodo) {
      setForm({
        title: existingTodo.title || '',
        description: existingTodo.description || '',
        dueDate: existingTodo.dueDate ? existingTodo.dueDate.slice(0, 10) : '',
        category: existingTodo.category || 'Non-Urgent',
        user: existingTodo.user?._id || existingTodo.user || '',
      })
    } else if (currentUser) {
      setForm((prev) => ({ ...prev, user: currentUser.id || '' }))
    }
  }, [isEditing, existingTodo, currentUser])

  useEffect(() => {
    if (isAdmin) {
      api.get('/admin/users')
        .then((res) => {
          setUsers(res.data)
        })
        .catch((err) => {
          console.error('Failed to load users:', err)
        })
    }
  }, [isAdmin])

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setErrors((prev) => ({ ...prev, [e.target.name]: '' }))
  }

  const validate = () => {
    const newErrors = {}
    if (!form.title.trim()) newErrors.title = 'Title is required'
    else if (form.title.length > 100) newErrors.title = 'Title cannot exceed 100 characters'
    if (form.description && form.description.length > 500) newErrors.description = 'Description cannot exceed 500 characters'
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
      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        category: form.category,
        dueDate: form.dueDate || undefined,
        user: isAdmin && form.user ? form.user : undefined,
      }
      if (isEditing) {
        await api.put(`/todos/${id}`, payload)
        showToast('Task updated successfully!', 'success')
      } else {
        await api.post('/todos', payload)
        showToast('Task created successfully!', 'success')
      }
      navigate('/dashboard')
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save task', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#09090f' }}>
      <Navbar />

      <main style={{ maxWidth: '640px', margin: '0 auto', padding: '40px 24px' }}>
        <div className="animate-slide-up">
          <button
            onClick={() => navigate('/dashboard')}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: '#64748b', fontSize: '14px', cursor: 'pointer', marginBottom: '24px', fontFamily: 'Inter, sans-serif', padding: 0 }}
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </button>

          <div className="glass-card" style={{ padding: '36px' }}>
            <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#f1f5f9', marginBottom: '6px' }}>
              {isEditing ? 'Edit Task' : 'Create New Task'}
            </h1>
            <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '28px' }}>
              {isEditing ? 'Update the details of your task' : 'Fill in the details to create a new task'}
            </p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <Input
                id="title"
                name="title"
                label="Title *"
                placeholder="What needs to be done?"
                value={form.title}
                onChange={handleChange}
                error={errors.title}
                maxLength={100}
              />

              <Input
                id="description"
                name="description"
                as="textarea"
                label="Description"
                placeholder="Add more details (optional)..."
                value={form.description}
                onChange={handleChange}
                error={errors.description}
                rows={4}
              />

              {isAdmin && (
                <Input
                  id="user"
                  name="user"
                  as="select"
                  label="Assignee"
                  value={form.user}
                  onChange={handleChange}
                  error={errors.user}
                  options={[
                    { value: '', label: 'Select User' },
                    ...users.map((u) => ({
                      value: u._id,
                      label: `${u.username} (${u.email})`,
                    })),
                  ]}
                />
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <Input
                  id="dueDate"
                  name="dueDate"
                  type="date"
                  label="Due Date"
                  value={form.dueDate}
                  onChange={handleChange}
                />
                <Input
                  id="category"
                  name="category"
                  as="select"
                  label="Category"
                  value={form.category}
                  onChange={handleChange}
                  options={CATEGORY_OPTIONS}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
                <Button variant="ghost" type="button" onClick={() => navigate('/dashboard')}>
                  Cancel
                </Button>
                <Button type="submit" loading={loading}>
                  {isEditing ? 'Save Changes' : 'Create Task'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}
