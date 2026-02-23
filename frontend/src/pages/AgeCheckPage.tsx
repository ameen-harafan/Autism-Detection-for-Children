import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../App.css'

interface AgeCheckPageProps {
  onAgeConfirmed: (age: number) => void
}

const AgeCheckPage: React.FC<AgeCheckPageProps> = ({ onAgeConfirmed }) => {
  const [age, setAge] = useState<string>('')
  const [error, setError] = useState<string>('')
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const ageNum = parseInt(age)
    
    if (isNaN(ageNum) || ageNum < 1) {
      setError('Please enter a valid age.')
      return
    }

    if (ageNum < 4) {
      setError(
        'This tool is not designed for children under 4 years of age. ' +
        'We recommend consulting with a pediatric professional for children in this age group.'
      )
      return
    }

    if (ageNum >= 18) {
      setError(
        'This tool is not designed for children above 18 years of age. We recommend consulting with a professional for adults in this age group.'
      )
      return
    }

    // Age is valid (4 to 17)
    onAgeConfirmed(ageNum)
    navigate('/questionnaire')
  }

  return (
    <>
      <div className="privacy-banner">
        <p>🔒 Your data is processed in real time and never stored</p>
      </div>
      <div className="container">
        <div className="card">
          <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#333' }}>
            Age Verification
          </h1>
          
          <p style={{ fontSize: '1.1rem', marginBottom: '2rem', color: '#666' }}>
            Please enter the child's age to proceed with the screening. This tool is designed 
            for children aged 4 to under 18 years.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Child's Age (in years)</label>
              <input
                type="number"
                className="form-input"
                value={age}
                onChange={(e) => {
                  setAge(e.target.value)
                  setError('')
                }}
                min="1"
                max="25"
                placeholder="Enter age (4-18)"
                style={{ fontSize: '1.2rem', padding: '1rem' }}
                autoFocus
              />
            </div>

            {error && (
              <div className="alert alert-error">
                <p style={{ margin: 0 }}>{error}</p>
              </div>
            )}

            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate('/')}
                style={{ flex: 1 }}
              >
                Go Back
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                style={{ flex: 1 }}
              >
                Continue
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default AgeCheckPage

