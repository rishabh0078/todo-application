export default function Spinner({ size = 'md', className = '' }) {
  const sizes = {
    sm: '16px',
    md: '24px',
    lg: '36px',
  }
  const dim = sizes[size] || sizes.md

  return (
    <div
      className={className}
      style={{
        width: dim,
        height: dim,
        borderRadius: '50%',
        border: '2px solid rgba(139, 92, 246, 0.2)',
        borderTopColor: '#8b5cf6',
        animation: 'spin 0.65s linear infinite',
        flexShrink: 0,
      }}
    />
  )
}
