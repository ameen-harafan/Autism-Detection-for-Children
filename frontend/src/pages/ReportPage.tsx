import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import apiClient from '../api/client'
import { ScreeningData, RiskFusionResult } from '../types'
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import SecureSaveButton from '../components/SecureSaveButton'
import '../App.css'

interface ReportPageProps {
  screeningData: ScreeningData | null
  onClearSession: () => void
}

const RiskGauge: React.FC<{ category: 'Low' | 'Medium' | 'High' }> = ({ category }) => {
  // Slightly smaller gauge so it doesn't dominate the section
  const width = 220
  const height = 110
  const cx = width / 2
  const cy = height - 8
  const r = 90

  const toXY = (deg: number) => {
    const rad = (deg * Math.PI) / 180
    return {
      x: cx + r * Math.cos(rad),
      y: cy + r * Math.sin(rad)
    }
  }

  const segments = [
    { from: 180, to: 240, color: '#27ae60' },  // Low
    { from: 240, to: 300, color: '#f39c12' },  // Medium
    { from: 300, to: 360, color: '#e74c3c' }   // High
  ]

  const categoryAngle = category === 'Low'
    ? 210
    : category === 'Medium'
      ? 270
      : 330

  const needleLength = 70
  const needleRad = (categoryAngle * Math.PI) / 180
  const needleX = cx + needleLength * Math.cos(needleRad)
  const needleY = cy + needleLength * Math.sin(needleRad)

  return (
    <div className="risk-gauge-wrapper">
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        {/* Colored arcs */}
        {segments.map((seg, idx) => {
          const start = toXY(seg.from)
          const end = toXY(seg.to)
          return (
            <path
              key={idx}
              d={`M ${start.x} ${start.y} A ${r} ${r} 0 0 1 ${end.x} ${end.y}`}
              stroke={seg.color}
              strokeWidth={14}
              fill="none"
              strokeLinecap="butt"
            />
          )
        })}

        {/* Needle */}
        <line
          x1={cx}
          y1={cy}
          x2={needleX}
          y2={needleY}
          stroke="#333"
          strokeWidth={4}
          strokeLinecap="round"
        />
        <circle cx={cx} cy={cy} r={6} fill="#333" />

        {/* Center label */}
        <text
          x={cx}
          y={cy - 18}
          textAnchor="middle"
          fontSize="12"
          fontWeight="bold"
          fill="#333"
        >
          {category} Risk
        </text>
      </svg>
      <div className="risk-gauge-labels">
        <span>Low</span>
        <span>Medium</span>
        <span>High</span>
      </div>
    </div>
  )
}

const ReportPage: React.FC<ReportPageProps> = ({ screeningData, onClearSession }) => {
  const [finalRisk, setFinalRisk] = useState<RiskFusionResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>('')
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null)
  const navigate = useNavigate()
  const reportRef = React.useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!screeningData) {
      navigate('/')
      return
    }

    // Generate final risk fusion if we have questionnaire data
    if (screeningData.questionnaire) {
      generateFinalRisk()
    }
  }, [screeningData])

  const generateFinalRisk = async () => {
    if (!screeningData?.questionnaire) return

    setLoading(true)
    setError('')

    try {
      const response = await apiClient.post('/risk/fuse', {
        questionnaire: {
          risk_category: screeningData.questionnaire.risk_category,
          score: screeningData.questionnaire.score
        },
        facial: screeningData.facial ? {
          risk_category: screeningData.facial.risk_category,
          probability: screeningData.facial.probability
        } : null,
        gaze: screeningData.gaze ? {
          risk_category: screeningData.gaze.risk_category,
          spi: screeningData.gaze.spi
        } : null
      })

      setFinalRisk(response.data)
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to generate final risk assessment.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const generatePDFBlob = async (): Promise<Blob> => {
    if (!reportRef.current) throw new Error('Report ref not available')

    const pdf = new jsPDF('p', 'mm', 'a4')
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = pdf.internal.pageSize.getHeight()

    // Word-like margins (approx): 25mm top/bottom, 20mm left/right
    const marginLeft = 20
    const marginRight = 20
    const marginTop = 25
    const marginBottom = 25

    const printableWidth = pdfWidth - marginLeft - marginRight
    const printableHeight = pdfHeight - marginTop - marginBottom

    const sections = Array.from(
      reportRef.current.querySelectorAll<HTMLElement>('.report-section')
    )

    // Fallback: capture entire report if no section markers found
    if (sections.length === 0) {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
      })
      const imgData = canvas.toDataURL('image/jpeg')
      const ratio = printableWidth / canvas.width
      const scaledHeight = canvas.height * ratio
      pdf.addImage(
        imgData,
        'JPEG',
        marginLeft,
        marginTop,
        printableWidth,
        scaledHeight
      )
      return pdf.output('blob')
    }

    let firstPage = true
    let yCursor = marginTop

    for (const section of sections) {
      const canvas = await html2canvas(section, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
      })

      const imgData = canvas.toDataURL('image/jpeg')
      const ratio = printableWidth / canvas.width
      const scaledHeight = canvas.height * ratio

      // If this section won't fit in remaining space, move to a new page
      if (!firstPage && yCursor + scaledHeight > pdfHeight - marginBottom) {
        pdf.addPage()
        yCursor = marginTop
      }

      // If the section itself is taller than a page, allow it to span pages
      if (scaledHeight > printableHeight) {
        let heightLeft = scaledHeight
        let offset = 0

        while (heightLeft > 0) {
          pdf.addImage(
            imgData,
            'JPEG',
            marginLeft,
            marginTop + offset,
            printableWidth,
            scaledHeight
          )
          heightLeft -= printableHeight
          offset -= printableHeight
          if (heightLeft > 0) {
            pdf.addPage()
          }
        }

        // After a tall section, reset cursor to start of next page
        yCursor = marginTop
      } else {
        pdf.addImage(
          imgData,
          'JPEG',
          marginLeft,
          yCursor,
          printableWidth,
          scaledHeight
        )
        yCursor += scaledHeight + 5 // small spacing between sections
      }

      firstPage = false
    }

    return pdf.output('blob')
  }

  const downloadPDF = async () => {
    try {
      const blob = await generatePDFBlob()
      setPdfBlob(blob)
      
      // Also trigger download
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `autism-screening-report ${new Date().toISOString().split('T')[0]}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Error generating PDF:', err)
      alert('Failed to generate PDF. Please try again.')
    }
  }

  // Generate PDF blob when report is ready
  useEffect(() => {
    if (finalRisk && reportRef.current) {
      generatePDFBlob().then(blob => {
        setPdfBlob(blob)
      }).catch(err => {
        console.error('Error generating PDF blob:', err)
      })
    }
  }, [finalRisk])

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'High':
        return '#e74c3c'
      case 'Medium':
        return '#f39c12'
      case 'Low':
        return '#27ae60'
      default:
        return '#95a5a6'
    }
  }

  if (!screeningData) {
    return null
  }

  // Build spider (radar) chart data with baselines
  const axes = ['Questionnaire', 'Facial Analysis', 'Gaze Analysis'] as const
  const baselineLow = 1
  const baselineMedium = 2
  const baselineHigh = 3

  const radarData = axes.map(axis => {
    let featureRisk = 0
    if (axis === 'Questionnaire' && screeningData.questionnaire) {
      featureRisk = screeningData.questionnaire.risk_category === 'High' ? 3 :
                    screeningData.questionnaire.risk_category === 'Medium' ? 2 : 1
    }
    if (axis === 'Facial Analysis' && screeningData.facial) {
      featureRisk = screeningData.facial.risk_category === 'High' ? 3 :
                    screeningData.facial.risk_category === 'Medium' ? 2 : 1
    }
    if (axis === 'Gaze Analysis' && screeningData.gaze) {
      featureRisk = screeningData.gaze.risk_category === 'High' ? 3 :
                    screeningData.gaze.risk_category === 'Medium' ? 2 : 1
    }

    return {
      feature: axis,
      Low: baselineLow,
      Medium: baselineMedium,
      High: baselineHigh,
      Child: featureRisk || 0
    }
  })

  return (
    <>
      <div className="privacy-banner">
        <p>🔒 Your data is processed in real time and never stored</p>
      </div>
      <div className="container">
        <div className="card" ref={reportRef} style={{ backgroundColor: 'white', color: '#333' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#333', textAlign: 'center' }}>
            Screening Report
          </h1>

          <div className="alert alert-info" style={{ marginBottom: '2rem' }}>
            <p style={{ margin: 0, fontWeight: 'bold' }}>
              This is a screening report, not a medical diagnosis. Please consult with a healthcare 
              professional for comprehensive evaluation.
            </p>
          </div>

          {loading && (
            <div style={{ textAlign: 'center', margin: '2rem 0' }}>
              <div className="spinner"></div>
              <p>Generating final assessment...</p>
            </div>
          )}

          {error && (
            <div className="alert alert-error">
              <p style={{ margin: 0 }}>{error}</p>
            </div>
          )}

          {finalRisk && (
            <div className="report-section" style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ color: '#333', marginBottom: '1.25rem', textAlign: 'center' }}>Final Risk Assessment</h2>

              {/* Gauge-style risk indicator, centered (semi-circle with three zones) */}
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.75rem' }}>
                <RiskGauge category={finalRisk.final_risk_category as 'Low' | 'Medium' | 'High'} />
              </div>

              {/* Overall screening result text, styled consistently */}
              <div
                style={{
                  padding: '1.75rem',
                  borderRadius: '12px',
                  backgroundColor: `${getRiskColor(finalRisk.final_risk_category)}15`,
                  border: `3px solid ${getRiskColor(finalRisk.final_risk_category)}`,
                  textAlign: 'left',
                  marginBottom: '1.75rem'
                }}
              >
                <div style={{
                  fontSize: '1.3rem',
                  fontWeight: 'bold',
                  color: getRiskColor(finalRisk.final_risk_category),
                  marginBottom: '0.5rem'
                }}>
                  Overall screening result: {finalRisk.final_risk_category} risk
                </div>
                <p style={{ fontSize: '1.1rem', color: '#555', margin: 0, lineHeight: '1.6' }}>
                  This combines questionnaire, facial, and gaze information into a single overall risk level.
                </p>
              </div>

              <p style={{ fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '1rem' }}>
                {finalRisk.interpretation}
              </p>

              <div className="alert alert-warning" style={{ marginTop: '1rem' }}>
                <p style={{ margin: 0, fontWeight: 'bold' }}>
                  {finalRisk.recommendation}
                </p>
              </div>
            </div>
          )}

          {/* Questionnaire Results */}
          {screeningData.questionnaire && (
            <div className="report-section" style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ color: '#333', marginBottom: '1rem' }}>Questionnaire Results</h2>
              <div style={{
                padding: '1.5rem',
                backgroundColor: '#f8f9fa',
                borderRadius: '12px',
                marginBottom: '1rem'
              }}>
                <p><strong>Type:</strong> {screeningData.questionnaireType}</p>
                <p><strong>Score:</strong> {screeningData.questionnaire.score.toFixed(1)} / {screeningData.questionnaire.max_score.toFixed(0)}</p>
                <p><strong>Risk Category:</strong> 
                  <span style={{ 
                    color: getRiskColor(screeningData.questionnaire.risk_category),
                    fontWeight: 'bold',
                    marginLeft: '0.5rem'
                  }}>
                    {screeningData.questionnaire.risk_category}
                  </span>
                </p>
                <p style={{ marginTop: '1rem' }}>{screeningData.questionnaire.interpretation}</p>
              </div>
            </div>
          )}

          {/* Facial Analysis Results */}
          {screeningData.facial && (
            <div className="report-section" style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ color: '#333', marginBottom: '1rem' }}>Facial Analysis (Supporting Signal)</h2>
              <div style={{
                padding: '1.5rem',
                backgroundColor: '#f8f9fa',
                borderRadius: '12px',
                marginBottom: '1rem'
              }}>
                <p><strong>Probability:</strong> {(screeningData.facial.probability * 100).toFixed(1)}%</p>
                <p><strong>Risk Category:</strong> 
                  <span style={{ 
                    color: getRiskColor(screeningData.facial.risk_category),
                    fontWeight: 'bold',
                    marginLeft: '0.5rem'
                  }}>
                    {screeningData.facial.risk_category}
                  </span>
                </p>
                <p style={{ marginTop: '1rem' }}>{screeningData.facial.risk_interpretation}</p>
              </div>
            </div>
          )}

          {/* Gaze Analysis Results */}
          {screeningData.gaze && (
            <div className="report-section" style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ color: '#333', marginBottom: '1rem' }}>Gaze Analysis (Supporting Signal)</h2>
              <div style={{
                padding: '1.5rem',
                backgroundColor: '#f8f9fa',
                borderRadius: '12px',
                marginBottom: '1rem'
              }}>
                <p><strong>Social Preference Index (SPI):</strong> {screeningData.gaze.spi.toFixed(3)}</p>
                <p><strong>Social Frames:</strong> {screeningData.gaze.social_frames}</p>
                <p><strong>Geometric Frames:</strong> {screeningData.gaze.geometric_frames}</p>
                <p><strong>Risk Category:</strong> 
                  <span style={{ 
                    color: getRiskColor(screeningData.gaze.risk_category),
                    fontWeight: 'bold',
                    marginLeft: '0.5rem'
                  }}>
                    {screeningData.gaze.risk_category}
                  </span>
                </p>
                <p style={{ marginTop: '1rem' }}>{screeningData.gaze.interpretation}</p>
              </div>
            </div>
          )}

          {/* Spider chart overview – always shown based on available features */}
          <div className="report-section" style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ color: '#333', marginBottom: '1rem' }}>Screening Signals Overview</h2>
            <p style={{ marginBottom: '1rem', color: '#555', fontSize: '0.95rem' }}>
              This spider chart compares typical low, medium, and high risk profiles with this screening across
              questionnaire, facial analysis, and gaze analysis (where available).
            </p>
            <div style={{ marginTop: '0.5rem', height: '320px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid radialLines />
                  <PolarAngleAxis dataKey="feature" tickLine={false} />
                  <PolarRadiusAxis angle={30} domain={[0, 3]} tick={false} axisLine={false} />
                  <Tooltip cursor={false} />
                  <Legend />
                  <Radar name="Typical Low" dataKey="Low" stroke="#27ae60" fill="#27ae60" fillOpacity={0.2} />
                  <Radar name="Typical Medium" dataKey="Medium" stroke="#f39c12" fill="#f39c12" fillOpacity={0.15} />
                  <Radar name="Typical High" dataKey="High" stroke="#e74c3c" fill="#e74c3c" fillOpacity={0.1} />
                  <Radar name="This Screening" dataKey="Child" stroke="#667eea" fill="#667eea" fillOpacity={0.4} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Disclaimers */}
          <div className="report-section" style={{ marginTop: '3rem', padding: '1.5rem', backgroundColor: '#fff3cd', borderRadius: '12px', border: '2px solid #ffc107' }}>
            <h3 style={{ color: '#856404', marginBottom: '1rem' }}>Important Disclaimers</h3>
            <ul style={{ marginLeft: '1.5rem', lineHeight: '1.8', color: '#856404' }}>
              <li>This screening tool is NOT a diagnostic tool and does not provide a medical diagnosis.</li>
              <li>Results are based on screening assessments and should be interpreted by qualified healthcare professionals.</li>
              <li>No personal data, images, videos, or results were stored during this screening.</li>
              <li>All processing was done in real-time and all data has been discarded.</li>
              <li>If you have concerns about your child's development, please consult with a qualified healthcare professional, developmental pediatrician, or autism specialist.</li>
            </ul>
          </div>

          <div style={{ marginTop: '2rem', textAlign: 'center' }}>
            <p style={{ color: '#666', fontSize: '0.9rem' }}>
              Report generated on {new Date().toLocaleString()}
            </p>
          </div>
        </div>

        {/* Action buttons (outside report card for PDF) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '2rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              className="btn btn-primary"
              onClick={downloadPDF}
              style={{ flex: 1 }}
            >
              Download PDF Report
            </button>
            <SecureSaveButton
              pdfBlob={pdfBlob}
              filename={`autism-screening-report ${new Date().toISOString().split('T')[0]}.pdf`}
            />
          </div>
          <button
            className="btn btn-danger"
            onClick={onClearSession}
            style={{ width: '100%' }}
          >
            Clear Session & Start Over
          </button>
        </div>
      </div>
    </>
  )
}

export default ReportPage

