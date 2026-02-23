import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'
import HomePage from './pages/Homepage'
import ConsentPage from './pages/ConsentPage'
import AgeCheckPage from './pages/AgeCheckPage'
import QuestionnairePage from './pages/QuestionnairePage'
import FacialAnalysisPage from './pages/FacialAnalysisPage'
import GazeAnalysisPage from './pages/GazeAnalysisPage'
import ReportPage from './pages/ReportPage'
import HistoryPage from './pages/HistoryPage'
import { ScreeningData } from './types'
import { AuthProvider } from './contexts/AuthContext'
import { PinProvider } from './contexts/PinContext'
import PinGate from './components/PinGate'
import './App.css'

const GOOGLE_CLIENT_ID = ""

// Store screening data in sessionStorage for routing (cleared on session end)
const STORAGE_KEY = 'autism_screening_data'

function App() {
  const [screeningData, setScreeningData] = useState<ScreeningData | null>(() => {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })

  useEffect(() => {
    if (screeningData) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(screeningData))
    } else {
      sessionStorage.removeItem(STORAGE_KEY)
    }
  }, [screeningData])

  const clearSession = () => {
    setScreeningData(null)
    sessionStorage.removeItem(STORAGE_KEY)
    window.location.href = '/'
  }

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <PinProvider>
          <Router>
            <div className="App">
              {/* Wrap Routes with PinGate to enforce global PIN security */}
              <PinGate>
                <Routes>
                  {/* Default route is now HomePage */}
                  <Route path="/" element={<HomePage />} />

                  {/* History page */}
                  <Route path="/history" element={<HistoryPage />} />

                  {/* Consent Page is now a separate step, accessed from HomePage */}
                  <Route
                    path="/consent"
                    element={<ConsentPage onConsent={() => { }} />}
                  />

                  <Route
                    path="/age-check"
                    element={
                      <AgeCheckPage
                        onAgeConfirmed={(age) => {
                          const newData: ScreeningData = { childAge: age, questionnaireType: null }
                          setScreeningData(newData)
                        }}
                      />
                    }
                  />
                  <Route
                    path="/questionnaire"
                    element={
                      <QuestionnaireWrapper
                        screeningData={screeningData}
                        onUpdate={(data) => setScreeningData(data)}
                      />
                    }
                  />
                  <Route
                    path="/facial"
                    element={
                      <FacialAnalysisWrapper
                        screeningData={screeningData}
                        onUpdate={(data) => setScreeningData(data)}
                      />
                    }
                  />
                  <Route
                    path="/gaze"
                    element={
                      <GazeAnalysisWrapper
                        screeningData={screeningData}
                        onUpdate={(data) => setScreeningData(data)}
                      />
                    }
                  />
                  <Route
                    path="/report"
                    element={
                      <ReportPage
                        screeningData={screeningData}
                        onClearSession={clearSession}
                      />
                    }
                  />
                </Routes>
              </PinGate>
            </div>
          </Router>
        </PinProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  )
}

function QuestionnaireWrapper({ screeningData, onUpdate }: { screeningData: ScreeningData | null, onUpdate: (data: ScreeningData) => void }) {
  const navigate = useNavigate()
  const [showLowRiskModal, setShowLowRiskModal] = React.useState(false)
  const [questionnaireResult, setQuestionnaireResult] = React.useState<any>(null)

  if (!screeningData?.childAge) {
    return <Navigate to="/age-check" replace />
  }

  const handleQuestionnaireComplete = (result: any) => {
    const newData = { ...screeningData, questionnaire: result }
    onUpdate(newData)

    if (result.risk_category === 'Low') {
      // Show popup for low risk
      setQuestionnaireResult(result)
      setShowLowRiskModal(true)
    } else {
      // Medium/High risk - proceed to facial analysis
      navigate('/facial')
    }
  }

  const handleContinueWithOtherFeatures = () => {
    setShowLowRiskModal(false)
    navigate('/facial')
  }

  const handleGoToReport = () => {
    setShowLowRiskModal(false)
    navigate('/report')
  }

  return (
    <>
      <QuestionnairePage
        childAge={screeningData.childAge}
        onComplete={handleQuestionnaireComplete}
        onSkip={() => navigate('/report')}
      />

      {/* Low Risk Modal/Popup */}
      {showLowRiskModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
          padding: '1rem'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '2.5rem',
            maxWidth: '500px',
            width: '100%',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
            animation: 'fadeIn 0.3s ease-in'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✅</div>
              <h2 style={{ fontSize: '1.8rem', color: '#27ae60', marginBottom: '1rem', fontWeight: 'bold' }}>
                Low Risk Assessment
              </h2>
              <p style={{ fontSize: '1.1rem', color: '#666', lineHeight: '1.6', marginBottom: '0.5rem' }}>
                The questionnaire results indicate a <strong>low risk</strong> of autism spectrum traits.
              </p>
              <p style={{ fontSize: '1rem', color: '#666', lineHeight: '1.6' }}>
                This is a screening tool only and not a medical diagnosis. You can choose to continue with additional screening features (facial analysis and gaze tracking) for a more comprehensive assessment, or proceed directly to view your report.
              </p>
            </div>

            <div style={{
              backgroundColor: '#e8f5e9',
              padding: '1rem',
              borderRadius: '10px',
              marginBottom: '1.5rem',
              border: '1px solid #27ae60'
            }}>
              <p style={{ margin: 0, fontSize: '0.95rem', color: '#2e7d32', textAlign: 'center' }}>
                <strong>Score:</strong> {questionnaireResult?.score}/{questionnaireResult?.max_score} |
                <strong> Risk Category:</strong> {questionnaireResult?.risk_category}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                className="btn btn-secondary"
                onClick={handleGoToReport}
                style={{ flex: 1, padding: '1rem', fontSize: '1.1rem' }}
              >
                View Report
              </button>
              <button
                className="btn btn-primary"
                onClick={handleContinueWithOtherFeatures}
                style={{ flex: 1, padding: '1rem', fontSize: '1.1rem' }}
              >
                Continue Screening
              </button>
            </div>

            <p style={{
              fontSize: '0.85rem',
              color: '#999',
              textAlign: 'center',
              marginTop: '1rem',
              fontStyle: 'italic'
            }}>
              Additional features are optional and can be skipped at any time
            </p>
          </div>
        </div>
      )}
    </>
  )
}

function FacialAnalysisWrapper({ screeningData, onUpdate }: { screeningData: ScreeningData | null, onUpdate: (data: ScreeningData) => void }) {
  const navigate = useNavigate()

  return (
    <FacialAnalysisPage
      onComplete={(result) => {
        const newData = screeningData ? { ...screeningData, facial: result } : null
        onUpdate(newData || { facial: result })
      }}
      onSkip={() => navigate('/gaze')}
    />
  )
}

function GazeAnalysisWrapper({ screeningData, onUpdate }: { screeningData: ScreeningData | null, onUpdate: (data: ScreeningData) => void }) {
  const navigate = useNavigate()

  return (
    <GazeAnalysisPage
      onComplete={(result) => {
        const newData = screeningData ? { ...screeningData, gaze: result } : null
        onUpdate(newData || { gaze: result })
      }}
      onSkip={() => navigate('/report')}
    />
  )
}

export default App