import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import apiClient from '../api/client'
import { GazeResult } from '../types'
import GazeTracker from '../components/GazeTracker'
import '../App.css'

interface GazeDataPoint {
  timestamp: number
  x: number
  y: number
  social_region: boolean
}

interface GazeAnalysisPageProps {
  onComplete: (result: GazeResult) => void
  onSkip: () => void
}

const GazeAnalysisPage: React.FC<GazeAnalysisPageProps> = ({ onComplete, onSkip }) => {
  const [isTracking, setIsTracking] = useState(false)
  const [error, setError] = useState<string>('')
  const navigate = useNavigate()

  const handleGazeData = async (gazeData: GazeDataPoint[]) => {
    if (gazeData.length === 0) {
      setError('No gaze data collected. Please try again.')
      setIsTracking(false)
      return
    }

    try {
      const videoDuration = 60 // 1 minute video
      const response = await apiClient.post('/gaze/analyze', {
        gaze_data: gazeData,
        video_duration: videoDuration
      })
      
      onComplete(response.data)
      setIsTracking(false)
      setTimeout(() => navigate('/report'), 100)
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to analyze gaze data. Please try again.')
      console.error(err)
      setIsTracking(false)
    }
  }

  const handleStartTracking = () => {
    setError('')
    setIsTracking(true)
  }

  const handleComplete = () => {
    // This will be called by GazeTracker when video ends
    // Data is already sent via handleGazeData
  }

  if (isTracking) {
    return (
      <GazeTracker
        onGazeData={handleGazeData}
        videoSrc="/geopref_1min.mp4"
        onComplete={handleComplete}
      />
    )
  }

  return (
    <>
      <div className="privacy-banner">
        <p>🔒 Your data is processed in real time and never stored</p>
      </div>
      <div className="container">
        <div className="card">
          <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#333' }}>
            Gaze Analysis (Optional)
          </h1>
          
          <p style={{ fontSize: '1.1rem', marginBottom: '2rem', color: '#666' }}>
            This gaze tracking analysis uses your webcam to monitor eye movement while watching a video. 
            The video shows social scenes on the left side and geometric patterns on the right side. 
            This analysis provides a supporting signal only and is not a diagnostic tool.
          </p>

          <div className="alert alert-info">
            <div style={{ marginBottom: '1rem' }}>
              <p style={{ margin: '0 0 0.5rem 0', fontWeight: 'bold', fontSize: '1.1rem' }}>
                Instructions:
              </p>
              <ol style={{ marginLeft: '1.5rem', lineHeight: '1.8' }}>
                <li><strong>Calibration:</strong> Before the video starts, you will complete a calibration task in fullscreen mode. <strong>Do not click</strong>—just look at each green target as it appears.</li>
                <li><strong>Blink Handling:</strong> If you blink during a point, that point will automatically restart until enough open-eye samples are collected.</li>
                <li><strong>Video Stimulus:</strong> After calibration, the video will play automatically in fullscreen mode.</li>
                <li><strong>Watch Naturally:</strong> Keep your face visible to the camera and watch the video naturally. The system will track where you're looking.</li>
                <li><strong>Debug Mode:</strong> Press the 'D' key during the video to toggle debug mode, which shows a red circle indicating where the system thinks you're looking.</li>
              </ol>
            </div>
            <p style={{ margin: '1rem 0 0 0', fontSize: '0.95rem', fontStyle: 'italic' }}>
              <strong>Note:</strong> Make sure you allow camera permissions when prompted. All processing happens in real-time and no data is stored.
            </p>
          </div>

          {error && (
            <div className="alert alert-error" style={{ marginTop: '1rem' }}>
              <p style={{ margin: 0 }}>{error}</p>
            </div>
          )}

          <div style={{ 
            backgroundColor: '#f8f9fa',
            padding: '1.5rem',
            borderRadius: '12px',
            margin: '2rem 0',
            border: '1px solid #e0e0e0'
          }}>
            <h3 style={{ color: '#333', marginBottom: '1rem' }}>What to Expect:</h3>
            <ul style={{ marginLeft: '1.5rem', lineHeight: '1.8', color: '#666' }}>
              <li>The screen will go fullscreen for the calibration and video</li>
              <li>Look at each green target during calibration (9 targets total)</li>
              <li>If you blink during a target, it will automatically restart</li>
              <li>Watch the video naturally - no need to focus on a specific side</li>
              <li>Press ESC to exit fullscreen if needed</li>
              <li>Press 'D' key to see where the system thinks you're looking (debug mode)</li>
            </ul>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button
              className="btn btn-secondary"
              onClick={() => {
                onSkip()
                navigate('/report')
              }}
              style={{ flex: 1 }}
            >
              Skip This Step
            </button>
            <button
              className="btn btn-primary"
              onClick={handleStartTracking}
              style={{ flex: 1, fontSize: '1.2rem', padding: '1.2rem' }}
            >
              Start Gaze Tracking
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default GazeAnalysisPage

