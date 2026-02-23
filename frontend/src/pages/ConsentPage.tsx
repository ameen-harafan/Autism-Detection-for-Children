import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../App.css'

interface ConsentPageProps {
  onConsent: () => void
}

const ConsentPage: React.FC<ConsentPageProps> = ({ onConsent }) => {
  const [consented, setConsented] = useState(false)
  const navigate = useNavigate()

  const handleConsent = () => {
    if (consented) {
      navigate('/age-check')
      onConsent()
    }
  }

  return (
    <div className="privacy-banner">
      <div className="container">
        <div className="card">
          <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#333' }}>
            Early Autism Screening Tool
          </h1>
          <div className="alert alert-info" style={{ marginBottom: '2rem' }}>
            <p style={{ margin: 0, fontWeight: 'bold', fontSize: '1.1rem' }}>
              🔒 Your privacy is our priority. All data is processed in real-time and never stored.
            </p>
          </div>

          <div style={{ textAlign: 'left', marginBottom: '2rem', lineHeight: '1.8' }}>
            <h2 style={{ color: '#667eea', marginBottom: '1rem' }}>Important Disclaimer</h2>
            <p style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>
              This tool is designed for <strong>early screening purposes only</strong> and is 
              <strong> NOT a medical diagnosis</strong>. It is intended to help identify potential 
              signs that may warrant further professional evaluation.
            </p>

            <h3 style={{ color: '#333', marginTop: '1.5rem', marginBottom: '0.5rem' }}>Privacy & Data Protection</h3>
            <ul style={{ marginLeft: '1.5rem', fontSize: '1.05rem' }}>
              <li>✓ No personal data, images, videos, or results are stored</li>
              <li>✓ All processing occurs in real-time, in memory only</li>
              <li>✓ All data is immediately discarded after the session ends</li>
              <li>✓ No user accounts or tracking systems</li>
              <li>✓ HTTPS-only secure communication</li>
            </ul>

            <h3 style={{ color: '#333', marginTop: '1.5rem', marginBottom: '0.5rem' }}>Who Should Use This Tool</h3>
            <p style={{ fontSize: '1.05rem' }}>
              This screening tool is designed for children aged <strong>4 to under 18 years</strong>. 
              It is not suitable for toddlers, infants, or adults.
            </p>

            <h3 style={{ color: '#333', marginTop: '1.5rem', marginBottom: '0.5rem' }}>What This Tool Does</h3>
            <p style={{ fontSize: '1.05rem' }}>
              The screening combines multiple assessment methods:
            </p>
            <ul style={{ marginLeft: '1.5rem', fontSize: '1.05rem' }}>
              <li>Questionnaire-based screening (AQ-10 or SCQ)</li>
              <li>Optional facial analysis (supporting signal only)</li>
              <li>Optional gaze tracking analysis (supporting signal only)</li>
            </ul>

            <div className="alert alert-warning" style={{ marginTop: '2rem' }}>
              <p style={{ margin: 0, fontWeight: 'bold' }}>
                ⚠️ This tool does not provide a diagnosis. If you have concerns about your child's 
                development, please consult with a qualified healthcare professional, developmental 
                pediatrician, or autism specialist.
              </p>
            </div>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', fontSize: '1.1rem' }}>
              <input
                type="checkbox"
                checked={consented}
                onChange={(e) => setConsented(e.target.checked)}
                style={{ width: '24px', height: '24px', marginRight: '1rem', cursor: 'pointer' }}
              />
              <span>
                I am a parent or legal caregiver, and I understand that this is a screening tool 
                only, not a diagnosis. I consent to using this tool and understand that no data 
                will be stored.
              </span>
            </label>
          </div>

          <button
            className="btn btn-primary"
            onClick={handleConsent}
            disabled={!consented}
            style={{ width: '100%', fontSize: '1.2rem', padding: '1.2rem' }}
          >
            I Consent - Proceed to Screening
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConsentPage

