import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { GoogleLogin, CredentialResponse } from '@react-oauth/google'
import apiClient from '../api/client'

interface User {
  email: string
  name: string
  pin_set: boolean
}

interface AuthContextType {
  user: User | null
  token: string | null
  login: (credentialResponse: CredentialResponse) => Promise<void>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for stored token on mount
    const storedToken = localStorage.getItem('auth_token')
    const storedUser = localStorage.getItem('auth_user')
    
    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const login = async (credentialResponse: CredentialResponse) => {
    try {
      if (!credentialResponse.credential) {
        throw new Error('No credential received')
      }

      const response = await apiClient.post('/auth/google', {
        token: credentialResponse.credential
      })

      const { access_token, user_email, user_name, pin_set } = response.data
      
      const userData: User = {
        email: user_email,
        name: user_name,
        pin_set: pin_set
      }

      setToken(access_token)
      setUser(userData)
      
      // Store in localStorage
      localStorage.setItem('auth_token', access_token)
      localStorage.setItem('auth_user', JSON.stringify(userData))
      
      // Set default authorization header for future requests
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    } catch (error: any) {
      console.error('Login error:', error)
      throw error
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
    delete apiClient.defaults.headers.common['Authorization']
  }

  // Set authorization header if token exists
  useEffect(() => {
    if (token) {
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`
    }
  }, [token])

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}