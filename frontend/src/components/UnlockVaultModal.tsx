import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { usePin } from '../contexts/PinContext'
import '../App.css'

interface UnlockVaultModalProps {
  onUnlocked: () => void
}

const UnlockVaultModal: React.FC<UnlockVaultModalProps> = ({ onUnlocked }) => {
  const { logout } = useAuth()
  const { verifyPin } = usePin()
  const [pin, setPinValue] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (pin.length < 4) {
      setError('PIN must be at least 4 characters long')
      return
    }

    setLoading(true)
    try {
      const verified = await verifyPin(pin)
      if (verified) {
        onUnlocked()
      } else {
        setError('Invalid PIN. Please try again.')
        setPinValue('') // Clear PIN on error
      }
    } catch (error: any) {
      setError('Failed to verify PIN. Please try again.')
      setPinValue('') // Clear PIN on error
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" style={{ zIndex: 10001 }}>
      <div className="modal-content pin-modal">
        <h2>Unlock Secure Vault</h2>
        <p style={{ color: '#666', marginBottom: '1.5rem' }}>
          Please enter your PIN to access your secure vault and continue.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="pin">PIN:</label>
            <input
              type="password"
              id="pin"
              value={pin}
              onChange={(e) => {
                setPinValue(e.target.value)
                setError('') // Clear error when user types
              }}
              placeholder="Enter your PIN"
              required
              disabled={loading}
              autoFocus
            />
          </div>

          {error && (
            <div className="alert alert-error" style={{ marginTop: '1rem' }}>
              {error}
            </div>
          )}

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={logout}
              style={{ flex: 1 }}
            >
              Logout
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ flex: 1 }}
            >
              {loading ? 'Verifying...' : 'Unlock Vault'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default UnlockVaultModal