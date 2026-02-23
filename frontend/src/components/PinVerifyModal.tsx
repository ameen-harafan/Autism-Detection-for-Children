import React, { useState } from 'react'
import { usePin } from '../contexts/PinContext'
import '../App.css'

interface PinVerifyModalProps {
  onVerified: () => void
  onCancel?: () => void
}

const PinVerifyModal: React.FC<PinVerifyModalProps> = ({ onVerified, onCancel }) => {
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
        onVerified()
      } else {
        setError('Invalid PIN. Please try again.')
      }
    } catch (error: any) {
      setError('Failed to verify PIN. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content pin-modal">
        <h2>Enter Your Privacy PIN</h2>
        <p style={{ color: '#666', marginBottom: '1.5rem' }}>
          Please enter your PIN to continue.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="pin">PIN:</label>
            <input
              type="password"
              id="pin"
              value={pin}
              onChange={(e) => setPinValue(e.target.value)}
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
            {onCancel && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onCancel}
                disabled={loading}
                style={{ flex: 1 }}
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ flex: 1 }}
            >
              {loading ? 'Verifying...' : 'Verify PIN'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default PinVerifyModal