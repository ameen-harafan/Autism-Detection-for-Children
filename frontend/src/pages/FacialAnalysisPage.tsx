import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import apiClient from '../api/client'
import { FacialResult } from '../types'
import '../App.css'

interface FacialAnalysisPageProps {
  onComplete: (result: FacialResult) => void
  onSkip: () => void
}

const FacialAnalysisPage: React.FC<FacialAnalysisPageProps> = ({ onComplete, onSkip }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()


  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file.')
        return
      }
      setSelectedFile(file)
      setError('')
      
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async () => {
    if (!selectedFile) {
      setError('Please select an image first.')
      return
    }

    setLoading(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('file', selectedFile)

      const response = await apiClient.post('/facial/analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      onComplete(response.data)
      
      // Clear image from memory
      setPreview(null)
      setSelectedFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      
      // Navigate to gaze analysis page
      setTimeout(() => navigate('/gaze'), 100)
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to analyze image. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="privacy-banner">
        <p>🔒 Your data is processed in real time and never stored</p>
      </div>
      <div className="container">
        <div className="card">
          <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#333' }}>
            Facial Analysis (Optional)
          </h1>
          
          <p style={{ fontSize: '1.1rem', marginBottom: '2rem', color: '#666' }}>
            Upload a clear frontal facial image of the child. This analysis provides a supporting 
            signal only and is not used as a primary diagnostic tool. The image will be processed 
            in real-time and immediately discarded.
          </p>

          <div className="alert alert-info">
            <p style={{ margin: 0 }}>
              <strong>Requirements:</strong> Clear frontal face photo, good lighting, single face visible.
              The image will not be stored.
            </p>
          </div>

          <div style={{ marginTop: '2rem' }}>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
              id="file-input"
            />
            
            <label
              htmlFor="file-input"
              style={{
                display: 'block',
                padding: '2rem',
                border: '2px dashed #667eea',
                borderRadius: '12px',
                textAlign: 'center',
                cursor: 'pointer',
                backgroundColor: preview ? 'transparent' : '#f0f4ff',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                if (!preview) {
                  e.currentTarget.style.backgroundColor = '#e8edff'
                }
              }}
              onMouseLeave={(e) => {
                if (!preview) {
                  e.currentTarget.style.backgroundColor = '#f0f4ff'
                }
              }}
            >
              {preview ? (
                <div>
                  <img
                    src={preview}
                    alt="Preview"
                    style={{
                      maxWidth: '100%',
                      maxHeight: '400px',
                      borderRadius: '8px',
                      marginBottom: '1rem'
                    }}
                  />
                  <p style={{ color: '#667eea', fontWeight: 'bold' }}>
                    Click to change image
                  </p>
                </div>
              ) : (
                <div>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📷</div>
                  <p style={{ fontSize: '1.2rem', color: '#667eea', fontWeight: 'bold' }}>
                    Click to upload image
                  </p>
                  <p style={{ color: '#666', marginTop: '0.5rem' }}>
                    PNG, JPG, JPEG up to 10MB
                  </p>
                </div>
              )}
            </label>
          </div>

          {error && (
            <div className="alert alert-error" style={{ marginTop: '1rem' }}>
              <p style={{ margin: 0 }}>{error}</p>
            </div>
          )}

          {loading && (
            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <div className="spinner"></div>
              <p>Analyzing image...</p>
            </div>
          )}

          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button
              className="btn btn-secondary"
              onClick={() => {
                onSkip()
                navigate('/gaze')
              }}
              disabled={loading}
              style={{ flex: 1 }}
            >
              Skip This Step
            </button>
            <button
              className="btn btn-primary"
              onClick={handleSubmit}
              disabled={!selectedFile || loading}
              style={{ flex: 1 }}
            >
              Analyze Image
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default FacialAnalysisPage

