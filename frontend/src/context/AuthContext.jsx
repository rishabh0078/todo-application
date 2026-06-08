import { createContext, useState, useEffect, useCallback } from 'react'
import api from '../api/axiosInstance'
import { getToken, setToken, removeToken, parseJWT, isTokenValid } from '../utils/auth'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = getToken()
    if (token && isTokenValid(token)) {
      const payload = parseJWT(token)
      setUser(payload)
    } else {
      removeToken()
    }
    setLoading(false)
  }, [])

  const login = useCallback(async (credentials) => {
    const res = await api.post('/auth/login', credentials)
    const { token } = res.data
    setToken(token)
    const payload = parseJWT(token)
    setUser(payload)
    return res.data
  }, [])

  const register = useCallback(async (data) => {
    const res = await api.post('/auth/register', data)
    return res.data
  }, [])

  const logout = useCallback(() => {
    removeToken()
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
