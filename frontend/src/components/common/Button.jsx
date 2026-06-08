import Spinner from './Spinner'

const variantClass = {
  primary: 'btn-primary',
  danger: 'btn-danger',
  ghost: 'btn-ghost',
  success: 'btn-success',
}

const sizeStyles = {
  sm: { padding: '6px 14px', fontSize: '13px' },
  md: { padding: '10px 20px', fontSize: '14px' },
  lg: { padding: '13px 28px', fontSize: '15px' },
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  type = 'button',
  disabled = false,
  loading = false,
  onClick,
  className = '',
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${variantClass[variant]} ${className}`}
      style={sizeStyles[size]}
    >
      {loading && <Spinner size="sm" />}
      {children}
    </button>
  )
}
