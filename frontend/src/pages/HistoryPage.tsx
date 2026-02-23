import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { usePin } from '../contexts/PinContext'
import PinVerifyModal from '../components/PinVerifyModal'
import apiClient from '../api/client'
import CryptoJS from 'crypto-js'
import '../App.css'

interface Report {
  id: string
  filename: string
  created_at: string
}

const HistoryPage: React.FC = () => {
  const { user, token } = useAuth()
  const { pin } = usePin()
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showPinModal, setShowPinModal] = useState(false)
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null)

  useEffect(() => {
    if (user && token) {
      loadReports()
    }
  }, [user, token])

  // Effect to handle download once PIN is verified and available
  useEffect(() => {
    if (pin && selectedReportId && !showPinModal) {
      decryptAndDownload(selectedReportId, pin)
    }
  }, [pin, selectedReportId, showPinModal])

  const loadReports = async () => {
    try {
      // Fix for Authorization header missing on refresh:
      // Explicitly set the header here to ensure it's available before the request
      if (token) {
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`
      }

      const response = await apiClient.get('/vault/list')
      setReports(response.data.reports)
    } catch (error: any) {
      setError(error.response?.data?.detail || 'Failed to load reports')
    } finally {
      setLoading(false)
    }
  }

  const decryptAndDownload = async (reportId: string, pinToUse: string) => {
    try {
      // Ensure header is set for this request as well
      if (token) {
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`
      }

      // Get encrypted report
      const response = await apiClient.get(`/vault/get/${reportId}`)
      const { encrypted_content, filename } = response.data
      
      // Decrypt using CryptoJS (AES)
      // Note: encrypted_content is base64 string
      const decryptedBytes = CryptoJS.AES.decrypt(encrypted_content, pinToUse)
      const decryptedBase64 = decryptedBytes.toString(CryptoJS.enc.Utf8)

      if (!decryptedBase64) {
        throw new Error('Decryption failed. Invalid PIN or corrupted data.')
      }
      
      // Convert base64 to binary
      const binaryString = window.atob(decryptedBase64)
      const len = binaryString.length
      const bytes = new Uint8Array(len)
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i)
      }
      
      // Create Blob and download
      const blob = new Blob([bytes], { type: 'application/pdf' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', filename)
      document.body.appendChild(link)
      link.click()
      
      // Cleanup
      link.parentNode?.removeChild(link)
      window.URL.revokeObjectURL(url)
      
      // Reset state
      setShowPinModal(false)
      setSelectedReportId(null)
    } catch (error: any) {
      console.error('Download error:', error)
      setError('Failed to decrypt or download report. Please check if your PIN is correct.')
      // If decryption fails, we might want to reset the selection
      setSelectedReportId(null)
    }
  }

  const handleDownload = (id: string) => {
    setSelectedReportId(id)
    if (pin) {
      // If PIN is already in session, proceed
      decryptAndDownload(id, pin)
    } else {
      // Otherwise, prompt for PIN
      setShowPinModal(true)
    }
  }

  const handlePinVerified = () => {
    // When PIN is verified, the modal closes. 
    // The useEffect [pin, selectedReportId] will trigger the actual download
    setShowPinModal(false)
  }

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ margin: 0, color: '#333' }}>Assessment History</h2>
        </div>
        
        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <div className="spinner"></div>
            <p>Loading history...</p>
          </div>
        ) : error ? (
          <div className="alert alert-error">
            {error}
          </div>
        ) : reports.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p>No saved reports found.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {reports.map((report) => (
              <div
                key={report.id}
                style={{
                  padding: '1.5rem',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: '#fff'
                }}
              >
                <div>
                  <h3 style={{ margin: 0, marginBottom: '0.5rem', fontSize: '1.1rem' }}>{report.filename}</h3>
                  <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>
                    Saved on {new Date(report.created_at).toLocaleString()}
                  </p>
                </div>
                <button
                  className="btn btn-primary"
                  onClick={() => handleDownload(report.id)}
                  style={{ padding: '0.5rem 1.5rem' }}
                >
                  Download
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {showPinModal && (
        <PinVerifyModal
          onVerified={handlePinVerified}
          onCancel={() => {
            setShowPinModal(false)
            setSelectedReportId(null)
          }}
        />
      )}
    </div>
  )
}

export default HistoryPage