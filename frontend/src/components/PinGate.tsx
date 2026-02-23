import React, { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { usePin } from '../contexts/PinContext'
import PinSetupModal from './PinSetupModal'
import UnlockVaultModal from './UnlockVaultModal'

/**
 * PinGate Component
 * * Enforces PIN security logic:
 * - Trigger 1: Initial Login -> Block UI until Unlock/Setup
 * - Trigger 2: Page Refresh -> PIN wiped from memory -> Block UI until Unlock
 * - Trigger 3: First-Time Setup -> Backend says no PIN -> Show Setup
 */
const PinGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading: authLoading } = useAuth()
  const { pin, pinSet, pinStatusChecked } = usePin()
  const [showPinSetup, setShowPinSetup] = useState(false)
  const [showUnlockVault, setShowUnlockVault] = useState(false)

  useEffect(() => {
    // Do not enforce gates while authentication is loading
    if (authLoading) return

    if (user) {
      // If we haven't checked backend status yet, wait
      if (!pinStatusChecked) return

      // Logic Update: Prioritize having the PIN in memory. 
      // If 'pin' is set in context, it means the user just successfully set it or unlocked it.
      // We check this FIRST to avoid race conditions where 'pinSet' (backend status) might momentarily lag.
      if (pin) {
        // Authenticated, PIN set, and PIN in memory -> Access Granted
        setShowPinSetup(false)
        setShowUnlockVault(false)
      } else if (!pinSet) {
        // Trigger 3: First-Time Setup - PIN is not set on backend
        setShowPinSetup(true)
        setShowUnlockVault(false)
      } else {
        // Trigger 1 & 2: User logged in, PIN set on backend, but not in memory
        setShowUnlockVault(true)
        setShowPinSetup(false)
      }
    } else {
      // User not logged in - hide all modals (allow public home page access)
      setShowPinSetup(false)
      setShowUnlockVault(false)
    }
  }, [user, pin, pinSet, pinStatusChecked, authLoading])

  const handlePinSetupComplete = async () => {
    // Logic Update: Do not await checkPinStatus() here. 
    // PinSetupModal already calls checkPinStatus() and setPin().
    // We must close the modal immediately to prevent UI race conditions where the modal stays open 
    // and causes "PIN already set" errors if the user clicks again.
    setShowPinSetup(false)
  }

  const handleVaultUnlocked = () => {
    // PIN is now in context (set by UnlockVaultModal calling verifyPin)
    setShowUnlockVault(false)
  }

  // Block UI if user is logged in and PIN is missing from memory.
  // Logic Update: We only block if 'pin' is missing. If 'pin' is present, we are secure.
  // This prevents blocking UI when 'pin' is set but 'pinSet' is stale.
  const isBlocked = user && pinStatusChecked && !pin

  return (
    <>
      {/* Block UI overlay */}
      {isBlocked && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 10000,
          pointerEvents: 'none'
        }} />
      )}

      {/* Trigger 3 Modal */}
      {showPinSetup && (
        <PinSetupModal onComplete={handlePinSetupComplete} />
      )}

      {/* Trigger 1 & 2 Modal */}
      {showUnlockVault && (
        <UnlockVaultModal onUnlocked={handleVaultUnlocked} />
      )}

      {/* Render application content */}
      {children}
    </>
  )
}

export default PinGate