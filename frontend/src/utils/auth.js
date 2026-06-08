export const getToken = () => localStorage.getItem('token')

export const setToken = (token) => localStorage.setItem('token', token)

export const removeToken = () => localStorage.removeItem('token')

export const parseJWT = (token) => {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const json = window.atob(base64)
    return JSON.parse(json)
  } catch {
    return null
  }
}

export const isTokenValid = (token) => {
  const payload = parseJWT(token)
  if (!payload) return false
  return payload.exp * 1000 > Date.now()
}
