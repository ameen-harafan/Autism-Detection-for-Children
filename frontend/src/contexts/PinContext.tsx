import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useAuth } from './AuthContext'
import apiClient from '../api/client'

interface PinContextType {
  pin: string | null
  setPin: (pin: string) => void
  clearPin: () => void
  pinSet: boolean
  pinStatusChecked: boolean
  checkPinStatus: () => Promise<void>
  verifyPin: (pin: string) => Promise<boolean>
}

const PinContext = createContext<PinContextType | undefined>(undefined)

export const usePin = () => {
  const context = useContext(PinContext)
  if (!context) {
    throw new Error('usePin must be used within PinProvider')
  }
  return context
}

interface PinProviderProps {
  children: ReactNode
}

export const PinProvider: React.FC<PinProviderProps> = ({ children }) => {
  const { user, token } = useAuth()
  const [pin, setPinState] = useState<string | null>(null)
  const [pinSet, setPinSet] = useState(false)
  const [pinStatusChecked, setPinStatusChecked] = useState(false)

  // Trigger 2 & 3 Support: Check PIN status from backend whenever user/token is available
  useEffect(() => {
    if (user && token) {
      checkPinStatus()
    } else {
      // Logout Logic: Clear PIN immediately when user logs out
      setPinState(null)
      setPinSet(false)
      setPinStatusChecked(false)
    }
  }, [user, token])

  const checkPinStatus = async () => {
    if (!token) return
    
    try {
      // Fix for 401 Race Condition:
      // Explicitly set the header here before making the request. 
      // This ensures the token is attached even if AuthContext's useEffect hasn't run yet.
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`

      const response = await apiClient.get('/auth/pin/status')
      setPinSet(response.data.pin_set)
    } catch (error) {
      console.error('Error checking PIN status:', error)
    } finally {
      setPinStatusChecked(true)
    }
  }

  const setPin = (newPin: string) => {
    // Storage Logic: Only store in React State (Memory)
    setPinState(newPin)
  }

  const clearPin = () => {
    setPinState(null)
  }

  const verifyPin = async (pinToVerify: string): Promise<boolean> => {
    if (!token) return false
    
    try {
      // Ensure header is set for verification too, just in case
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`
      
      const response = await apiClient.post('/auth/pin/verify', {
        pin: pinToVerify
      })
      
      if (response.data.verified) {
        // Persistence: Keep in context once verified
        setPin(pinToVerify)
        return true
      }
      return false
    } catch (error) {
      console.error('Error verifying PIN:', error)
      return false
    }
  }

  return (
    <PinContext.Provider value={{
      pin,
      setPin,
      clearPin,
      pinSet,
      pinStatusChecked,
      checkPinStatus,
      verifyPin
    }}>
      {children}
    </PinContext.Provider>
  )
}