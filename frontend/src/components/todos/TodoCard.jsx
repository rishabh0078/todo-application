import { useState } from 'react'
import Button from '../common/Button'

const formatDate = (dateStr) => {
  if (!dateStr) return null
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  })
}

export default function TodoCard({ todo, onToggle, onEdit, onDelete, showUser = false }) {
  const [toggling, setToggling] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleToggle = async () => {
    setToggling(true)
    await onToggle(todo._id, !todo.completed)
    setToggling(false)
  }

  const handleDelete = async () => {
    setDeleting(true)
    await onDelete(todo._id)
  }

  const isUrgent = todo.category === 'Urgent'
  const formattedDate = formatDate(todo.dueDate)

  return (
    <div className="glass-card-interactive" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
        <button
          onClick={handleToggle}
          disabled={toggling}
          title={todo.completed ? 'Mark as pending' : 'Mark as complete'}
          style={{
            width: '22px', height: '22px', borderRadius: '50%', flexShrink: 0, marginTop: '2px',
            border: `2px solid ${todo.completed ? '#10b981' : 'rgba(255,255,255,0.2)'}`,
            background: todo.completed ? '#10b981' : 'transparent',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.2s ease',
          }}
        >
          {todo.completed && (
            <svg width="12" height="12" fill="none" stroke="white" strokeWidth="3" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>

        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{
            fontSize: '15px', fontWeight: '600', lineHeight: '1.4', wordBreak: 'break-word',
            color: todo.completed ? '#64748b' : '#f1f5f9',
            textDecoration: todo.completed ? 'line-through' : 'none',
          }}>
            {todo.title}
          </h3>
        </div>

        <span style={{
          fontSize: '11px', fontWeight: '600', padding: '3px 10px', borderRadius: '20px',
          flexShrink: 0, textTransform: 'uppercase', letterSpacing: '0.04em',
          background: isUrgent ? 'rgba(239, 68, 68, 0.15)' : 'rgba(99, 102, 241, 0.15)',
          color: isUrgent ? '#f87171' : '#818cf8',
          border: `1px solid ${isUrgent ? 'rgba(239,68,68,0.25)' : 'rgba(99,102,241,0.25)'}`,
        }}>
          {todo.category}
        </span>
      </div>

      {todo.description && (
        <p style={{
          fontSize: '13px', color: '#64748b', lineHeight: '1.6',
          display: '-webkit-box', WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          {todo.description}
        </p>
      )}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {formattedDate && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: '#64748b' }}>
              <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              {formattedDate}
            </span>
          )}
          {showUser && todo.user?.username && (
            <span style={{ fontSize: '12px', color: '#8b5cf6', fontWeight: '500' }}>
              @{todo.user.username}
            </span>
          )}
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <Button
            variant={todo.completed ? 'ghost' : 'success'}
            size="sm"
            loading={toggling}
            onClick={handleToggle}
          >
            {todo.completed ? (
              <>
                <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" />
                </svg>
                Pending
              </>
            ) : (
              <>
                <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Complete
              </>
            )}
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onEdit(todo)}>
            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            Edit
          </Button>
          <Button variant="danger" size="sm" loading={deleting} onClick={handleDelete}>
            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
              <path d="M10 11v6M14 11v6M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
            </svg>
            Delete
          </Button>
        </div>
      </div>
    </div>
  )
}
