import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { usePin } from '../contexts/PinContext'
import apiClient from '../api/client'
import '../App.css'

interface PinSetupModalProps {
  onComplete: () => void
}

const PinSetupModal: React.FC<PinSetupModalProps> = ({ onComplete }) => {
  const { logout } = useAuth()
  const { setPin, checkPinStatus } = usePin()
  const [pin, setPinValue] = useState('')
  const [confirmPin, setConfirmPin] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [acknowledged, setAcknowledged] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!acknowledged) {
      setError('Please acknowledge the disclaimer before proceeding')
      return
    }

    if (pin.length < 4) {
      setError('PIN must be at least 4 characters long')
      return
    }

    if (pin !== confirmPin) {
      setError('PINs do not match')
      return
    }

    setLoading(true)
    try {
      await apiClient.post('/auth/pin/set', { pin })
      setPin(pin)
      await checkPinStatus()
      onComplete()
    } catch (error: any) {
      setError(error.response?.data?.detail || 'Failed to set PIN. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content pin-modal">
        <h2>Set Your Privacy PIN</h2>

        <div className="pin-disclaimer" style={{
          border: '2px solid #e74c3c',
          borderRadius: '8px',
          padding: '1rem',
          marginBottom: '1.5rem',
          backgroundColor: '#fee'
        }}>
          <p style={{ margin: 0, fontWeight: 'bold', color: '#c0392b', marginBottom: '0.5rem' }}>
            ⚠️ IMPORTANT: One-Time PIN Setup
          </p>
          <p style={{ margin: 0, color: '#c0392b', fontSize: '0.9rem', lineHeight: '1.6' }}>
            This PIN is a <strong>one-time setting</strong> and cannot be changed or recovered.
            If you lose this PIN, you will <strong>lose access to your secure vault forever</strong>.
            Please choose a PIN you will remember and store it securely.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="pin">Enter PIN:</label>
            <input
              type="password"
              id="pin"
              value={pin}
              onChange={(e) => setPinValue(e.target.value)}
              placeholder="At least 4 characters"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPin">Confirm PIN:</label>
            <input
              type="password"
              id="confirmPin"
              value={confirmPin}
              onChange={(e) => setConfirmPin(e.target.value)}
              placeholder="Re-enter PIN"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={acknowledged}
                onChange={(e) => setAcknowledged(e.target.checked)}
                disabled={loading}
              />
              <span>I understand that losing this PIN means losing access to my vault forever</span>
            </label>
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
              disabled={loading || !acknowledged}
              style={{ flex: 1 }}
            >
              {loading ? 'Setting PIN...' : 'Set PIN'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default PinSetupModal