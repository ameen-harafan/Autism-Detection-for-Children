import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { GoogleLogin } from '@react-oauth/google'
import { useAuth } from '../contexts/AuthContext'
import '../App.css'

const HomePage: React.FC = () => {
  const navigate = useNavigate()
  const { user, login, logout } = useAuth()
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // NOTE: Manual PIN setup logic removed. 
  // PinGate.tsx now handles Global Triggers for PIN Setup and Unlock.

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLoginSuccess = async (credentialResponse: any) => {
    try {
      await login(credentialResponse)
      // PinGate will detect the login state and trigger the appropriate modal automatically
    } catch (error) {
      console.error('Login failed:', error)
    }
  }

  const handleLogout = () => {
    logout()
    setShowDropdown(false)
  }

  const handleHistory = () => {
    navigate('/history')
    setShowDropdown(false)
  }

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="home-page">
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="logo">
            <span className="logo-icon">🧠</span>
            <span className="logo-text">NeuroScreen</span>
          </div>
          <div className="nav-links">
            <button className="text-link" onClick={() => scrollToSection('features')}>Features</button>
            <button className="text-link" onClick={() => scrollToSection('how-it-works')}>How it Works</button>
            <button className="text-link" onClick={() => scrollToSection('about')}>About</button>
            {user ? (
              <div className="user-menu" ref={dropdownRef}>
                <button
                  className="btn-nav user-btn"
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  {user.name}
                </button>
                {showDropdown && (
                  <div className="user-dropdown">
                    <button className="dropdown-item" onClick={handleHistory}>
                      History
                    </button>
                    <button className="dropdown-item" onClick={handleLogout}>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <GoogleLogin
                onSuccess={handleLoginSuccess}
                onError={() => console.error('Login Failed')}
                useOneTap={false}
              />
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Empowering Parents with <br />
              <span className="highlight-text">Early Insight</span>
            </h1>
            <p className="hero-subtitle">
              A privacy-first, AI-powered screening tool for autism detection in children. 
              Combine clinical questionnaires with advanced facial and gaze analysis for a comprehensive preliminary assessment.
            </p>
            <div className="hero-buttons">
              <button 
                className="btn btn-primary btn-lg"
                onClick={() => navigate('/consent')}
              >
                Start Screening Now
              </button>
              <button 
                className="btn btn-outline btn-lg" 
                onClick={() => scrollToSection('features')}
              >
                Learn More
              </button>
            </div>
            <p className="privacy-note">
              🔒 Privacy Guaranteed: No data is stored or recorded.
            </p>
          </div>
          
          <div className="hero-visual-container">
            {/* New Synaptic Network Visualization */}
            <div className="neural-network-viz">
              {/* SVG Layer for Connections */}
              <svg className="network-connections" viewBox="0 0 500 500">
                {/* Defs for gradients */}
                <defs>
                  <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" style={{stopColor:'#667eea', stopOpacity:1}} />
                    <stop offset="100%" style={{stopColor:'#764ba2', stopOpacity:1}} />
                  </linearGradient>
                </defs>
                
                {/* Animated Lines connecting center to nodes (Coordinates roughly match the % positions) */}
                {/* Center is 250,250. Top Node approx (250, 80). Right Node (420, 380). Left Node (80, 380) */}
                
                <line x1="250" y1="250" x2="250" y2="90" className="connection-line line-1" />
                <line x1="250" y1="250" x2="400" y2="380" className="connection-line line-2" />
                <line x1="250" y1="250" x2="100" y2="380" className="connection-line line-3" />
                
                {/* Pulse Circles (Data Packets) */}
                <circle r="4" className="data-packet packet-1">
                  <animateMotion dur="2.5s" repeatCount="indefinite" path="M250,250 L250,90" keyPoints="0;1" keyTimes="0;1" />
                </circle>
                <circle r="4" className="data-packet packet-2">
                  <animateMotion dur="3s" repeatCount="indefinite" begin="0.5s" path="M250,250 L400,380" keyPoints="0;1" keyTimes="0;1" />
                </circle>
                <circle r="4" className="data-packet packet-3">
                  <animateMotion dur="3s" repeatCount="indefinite" begin="1s" path="M250,250 L100,380" keyPoints="0;1" keyTimes="0;1" />
                </circle>
              </svg>

              {/* Central Core */}
              <div className="network-core">
                <div className="core-inner">
                  <span className="core-icon">🧠</span>
                </div>
                <div className="core-ring"></div>
              </div>

              {/* Node 1: Top (Questionnaire) */}
              <div className="network-node node-top">
                <div className="icon-badge blue-badge">📝</div>
                <div className="node-text">
                  <span className="node-title">Questionnaire</span>
                  <span className="node-desc">Standardized (AQ-10)</span>
                </div>
              </div>

              {/* Node 2: Bottom Right (Gaze) */}
              <div className="network-node node-right">
                <div className="icon-badge green-badge">👁️</div>
                <div className="node-text">
                  <span className="node-title">Gaze Tracking</span>
                  <span className="node-desc">Visual Preference</span>
                </div>
              </div>

              {/* Node 3: Bottom Left (Facial) */}
              <div className="network-node node-left">
                <div className="icon-badge purple-badge">👤</div>
                <div className="node-text">
                  <span className="node-title">Facial Analysis</span>
                  <span className="node-desc">AI Assessment</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="section-header">
          <h2>Comprehensive Screening Suite</h2>
          <p>Our multi-modal approach combines three powerful assessment methods.</p>
        </div>
        
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon-wrapper blue">
              <span className="feature-icon">📋</span>
            </div>
            <h3>Clinical Questionnaires</h3>
            <p>
              Utilizes the renowned <strong>AQ-10</strong> and <strong>SCQ</strong> (Social Communication Questionnaire) standards to assess behavioral traits.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper purple">
              <span className="feature-icon">😶</span>
            </div>
            <h3>Facial Analysis</h3>
            <p>
              Optional AI-driven analysis that identifies potential facial markers often associated with developmental conditions.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper green">
              <span className="feature-icon">👀</span>
            </div>
            <h3>Gaze Tracking</h3>
            <p>
              Analyzes visual preference between social and geometric stimuli using just your webcam—a key indicator in early development.
            </p>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="steps-section">
        <div className="container">
          <div className="section-header">
            <h2>How It Works</h2>
            <p>Simple, fast, and completely private.</p>
          </div>
          <div className="steps-row">
            <div className="step-item">
              <div className="step-number">1</div>
              <h4>Consent & Age</h4>
              <p>Confirm eligibility and review our strict privacy policy.</p>
            </div>
            <div className="step-connector"></div>
            <div className="step-item">
              <div className="step-number">2</div>
              <h4>Questionnaire</h4>
              <p>Answer standard behavioral questions about the child.</p>
            </div>
            <div className="step-connector"></div>
            <div className="step-item">
              <div className="step-number">3</div>
              <h4>AI Analysis</h4>
              <p>Perform optional camera-based assessments.</p>
            </div>
            <div className="step-connector"></div>
            <div className="step-item">
              <div className="step-number">4</div>
              <h4>Instant Report</h4>
              <p>Get a comprehensive PDF report immediately.</p>
            </div>
          </div>
        </div>
      </section>

      {/* About / CTA Section */}
      <section id="about" className="cta-section">
        <div className="cta-content">
          <h2>Ready to start the assessment?</h2>
          <p>It takes approximately 5-10 minutes and is completely free.</p>
          <button 
            className="btn btn-light btn-lg"
            onClick={() => navigate('/consent')}
          >
            Begin Screening Session
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-col">
            <h4>NeuroScreen</h4>
            <p>Advanced early detection tools accessible to everyone.</p>
          </div>
          
          <div className="footer-col">
            <h4>Legal</h4>
            <span>Privacy Policy</span>
            <span>Terms of Use</span>
            <span className="disclaimer-text">Not a medical diagnosis tool.</span>
          </div>
          
          <div className="footer-col">
            <h4>Contact</h4>
            <span>Support</span>
            <span>FAQ</span>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} NeuroScreen Project. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default HomePage