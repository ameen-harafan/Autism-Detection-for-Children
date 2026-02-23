import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { usePin } from '../contexts/PinContext'
import PinVerifyModal from './PinVerifyModal'
import apiClient from '../api/client'
import CryptoJS from 'crypto-js'
import '../App.css'

interface SecureSaveButtonProps {
  pdfBlob: Blob | null
  filename?: string
}

const SecureSaveButton: React.FC<SecureSaveButtonProps> = ({ pdfBlob, filename }) => {
  const { user, token } = useAuth()
  const { pin, verifyPin } = usePin()
  const [showPinModal, setShowPinModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const encryptPDF = async (pdfBlob: Blob, pin: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        try {
          const arrayBuffer = reader.result as ArrayBuffer
          const wordArray = CryptoJS.lib.WordArray.create(arrayBuffer)
          const encrypted = CryptoJS.AES.encrypt(wordArray, pin).toString()
          resolve(encrypted)
        } catch (error) {
          reject(error)
        }
      }
      reader.onerror = reject
      reader.readAsArrayBuffer(pdfBlob)
    })
  }

  const handleSave = async () => {
    if (!pdfBlob) {
      setMessage({ type: 'error', text: 'No PDF data available' })
      return
    }

    if (!user || !token) {
      setMessage({ type: 'error', text: 'Please log in to save reports' })
      return
    }

    // Check if PIN is set in context (relying on PinGate to enforce global unlock if required)
    if (!pin) {
      setShowPinModal(true)
      return
    }

    await saveToVault(pin)
  }

  const saveToVault = async (pinToUse: string) => {
    if (!pdfBlob) return

    setLoading(true)
    setMessage(null)

    try {
      // Convert PDF blob to base64
      const reader = new FileReader()
      reader.onload = async () => {
        try {
          // Read as array buffer and convert to base64
          const arrayBuffer = reader.result as ArrayBuffer
          const bytes = new Uint8Array(arrayBuffer)
          let binary = ''
          for (let i = 0; i < bytes.length; i++) {
            binary += String.fromCharCode(bytes[i])
          }
          const base64Data = btoa(binary)
          
          // Encrypt using crypto-js (AES)
          const encrypted = CryptoJS.AES.encrypt(base64Data, pinToUse).toString()
          
          // Generate filename
          const reportFilename = filename || `autism-screening-report-${Date.now()}.pdf`
          
          // Upload to backend
          await apiClient.post('/vault/save', {
            encrypted_content: encrypted,
            filename: reportFilename
          })

          setMessage({ type: 'success', text: 'Report saved to secure vault successfully!' })
          setTimeout(() => setMessage(null), 3000)
        } catch (error: any) {
          console.error('Save error:', error)
          setMessage({ 
            type: 'error', 
            text: error.response?.data?.detail || 'Failed to save report. Please try again.' 
          })
        } finally {
          setLoading(false)
        }
      }
      reader.onerror = () => {
        setMessage({ type: 'error', text: 'Failed to read PDF data' })
        setLoading(false)
      }
      reader.readAsArrayBuffer(pdfBlob)
    } catch (error: any) {
      setMessage({ type: 'error', text: 'Failed to save report. Please try again.' })
      setLoading(false)
    }
  }

  const handlePinVerified = () => {
    setShowPinModal(false)
    if (pin) {
      saveToVault(pin)
    }
  }

  return (
    <>
      <button
        className="btn btn-secondary"
        onClick={handleSave}
        disabled={loading || !pdfBlob}
        style={{ flex: 1 }}
      >
        {loading ? 'Saving...' : 'Save to Secure Vault'}
      </button>

      {message && (
        <div className={`alert alert-${message.type}`} style={{ marginTop: '0.5rem' }}>
          {message.text}
        </div>
      )}

      {showPinModal && (
        <PinVerifyModal
          onVerified={handlePinVerified}
          onCancel={() => setShowPinModal(false)}
        />
      )}
    </>
  )
}

export default SecureSaveButton