import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import apiClient from '../api/client'
import { Questionnaire, QuestionnaireResult } from '../types'
import '../App.css'

interface QuestionnairePageProps {
  childAge: number
  onComplete: (result: QuestionnaireResult) => void
  onSkip: () => void
}

const QuestionnairePage: React.FC<QuestionnairePageProps> = ({ childAge, onComplete, onSkip }) => {
  const [questionnaireType, setQuestionnaireType] = useState<'AQ10' | 'SCQ' | null>(null)
  const [questionnaire, setQuestionnaire] = useState<Questionnaire | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>('')
  const navigate = useNavigate()

  useEffect(() => {
    if (questionnaireType) {
      loadQuestions()
    }
  }, [questionnaireType])

  const loadQuestions = async () => {
    if (!questionnaireType) return
    
    setLoading(true)
    setError('')
    try {
      const response = await apiClient.get(`/questionnaire/questions/${questionnaireType}`)
      setQuestionnaire(response.data)
      setAnswers(new Array(response.data.num_questions).fill(-1))
    } catch (err: any) {
      setError('Failed to load questions. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleAnswer = (answer: number) => {
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = answer
    setAnswers(newAnswers)
  }

  const handleNext = () => {
    if (answers[currentQuestion] === -1) {
      setError('Please select an answer before proceeding.')
      return
    }
    setError('')
    
    if (currentQuestion < questionnaire!.num_questions - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      handleSubmit()
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleSubmit = async () => {
    if (answers.some(a => a === -1)) {
      setError('Please answer all questions before submitting.')
      return
    }

    setLoading(true)
    setError('')
    try {
      const response = await apiClient.post('/questionnaire/submit', {
        questionnaire_type: questionnaireType,
        answers: answers,
        child_age: childAge
      })
      // Let the parent component (QuestionnaireWrapper) handle navigation based on risk category
      onComplete(response.data)
      // Do NOT navigate here - parent will handle it
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to submit questionnaire. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (!questionnaireType) {
    return (
      <>
        <div className="privacy-banner">
          <p>🔒 Your data is processed in real time and never stored</p>
        </div>
        <div className="container">
          <div className="card">
            <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#333' }}>
              Select Questionnaire
            </h1>
            <p style={{ fontSize: '1.1rem', marginBottom: '2rem', color: '#666' }}>
              Please choose which screening questionnaire you would like to complete:
            </p>

            <div style={{ display: 'flex', gap: '2rem', marginTop: '2rem' }}>
              <div
                style={{
                  flex: 1,
                  padding: '2rem',
                  border: '2px solid #e0e0e0',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onClick={() => setQuestionnaireType('AQ10')}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#667eea'
                  e.currentTarget.style.backgroundColor = '#f0f4ff'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#e0e0e0'
                  e.currentTarget.style.backgroundColor = 'white'
                }}
              >
                <h2 style={{ color: '#667eea', marginBottom: '1rem' }}>AQ-10</h2>
                <p style={{ marginBottom: '0.5rem' }}><strong>Autism Spectrum Quotient - 10 items</strong></p>
                <p style={{ color: '#666' }}>10 questions, Yes/No answers</p>
              </div>

              <div
                style={{
                  flex: 1,
                  padding: '2rem',
                  border: '2px solid #e0e0e0',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onClick={() => setQuestionnaireType('SCQ')}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#667eea'
                  e.currentTarget.style.backgroundColor = '#f0f4ff'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#e0e0e0'
                  e.currentTarget.style.backgroundColor = 'white'
                }}
              >
                <h2 style={{ color: '#667eea', marginBottom: '1rem' }}>SCQ</h2>
                <p style={{ marginBottom: '0.5rem' }}><strong>Social Communication Questionnaire</strong></p>
                <p style={{ color: '#666' }}>25 questions, No/Sometimes/Yes answers</p>
              </div>
            </div>

            <button
              className="btn btn-secondary"
              onClick={() => navigate('/age-check')}
              style={{ marginTop: '2rem', width: '100%' }}
            >
              Go Back
            </button>
          </div>
        </div>
      </>
    )
  }

  if (loading && !questionnaire) {
    return (
      <>
        <div className="privacy-banner">
          <p>🔒 Your data is processed in real time and never stored</p>
        </div>
        <div className="container">
          <div className="card">
            <div className="spinner"></div>
            <p style={{ textAlign: 'center' }}>Loading questions...</p>
          </div>
        </div>
      </>
    )
  }

  if (!questionnaire) {
    return null
  }

  const progress = ((currentQuestion + 1) / questionnaire.num_questions) * 100
  const answerOptions = questionnaireType === 'AQ10' 
    ? [
        { value: 0, label: 'No' },
        { value: 1, label: 'Yes' }
      ]
    : [
        { value: 0, label: 'No' },
        { value: 1, label: 'Sometimes' },
        { value: 2, label: 'Yes' }
      ]

  return (
    <>
      <div className="privacy-banner">
        <p>🔒 Your data is processed in real time and never stored</p>
      </div>
      <div className="container">
        <div className="card">
          <div style={{ marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: '#333' }}>
              {questionnaireType} Questionnaire
            </h1>
            <p style={{ color: '#666' }}>
              Question {currentQuestion + 1} of {questionnaire.num_questions}
            </p>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }}></div>
            </div>
          </div>

          <div className="question-card">
            <div className="question-text">
              {questionnaire.questions[currentQuestion]}
            </div>

            {error && (
              <div className="alert alert-error" style={{ marginBottom: '1rem' }}>
                <p style={{ margin: 0 }}>{error}</p>
              </div>
            )}

            <div className="answer-options">
              {answerOptions.map((option) => (
                <button
                  key={option.value}
                  className={`answer-btn ${answers[currentQuestion] === option.value ? 'selected' : ''}`}
                  onClick={() => handleAnswer(option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button
              className="btn btn-secondary"
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              style={{ flex: 1 }}
            >
              Previous
            </button>
            {currentQuestion === questionnaire.num_questions - 1 ? (
              <button
                className="btn btn-primary"
                onClick={handleSubmit}
                disabled={loading || answers[currentQuestion] === -1}
                style={{ flex: 1 }}
              >
                {loading ? 'Submitting...' : 'Submit'}
              </button>
            ) : (
              <button
                className="btn btn-primary"
                onClick={handleNext}
                disabled={answers[currentQuestion] === -1}
                style={{ flex: 1 }}
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default QuestionnairePage

