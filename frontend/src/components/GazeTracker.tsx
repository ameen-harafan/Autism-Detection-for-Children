import React, { useRef, useEffect, useState, useCallback } from 'react'
import apiClient from '../api/client'

interface GazeDataPoint {
  timestamp: number
  x: number
  y: number
  social_region: boolean
}

interface GazeTrackerProps {
  onGazeData: (data: GazeDataPoint[]) => void
  videoSrc: string
  onComplete: () => void
}

interface CalibrationPoint {
  x: number
  y: number
}

const GazeTracker: React.FC<GazeTrackerProps> = ({ onGazeData, videoSrc, onComplete }) => {
  const videoRef = useRef<HTMLVideoElement>(null) // stimuli video
  const calibrationCanvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const webcamVideoRef = useRef<HTMLVideoElement>(null) // persistent hidden webcam feed
  const webcamStreamRef = useRef<MediaStream | null>(null)
  const frameIntervalRef = useRef<number | null>(null)
  
  const [phase, setPhase] = useState<'calibration' | 'video' | 'complete'>('calibration')
  const [currentCalibrationIndex, setCurrentCalibrationIndex] = useState(0)
  const [gazeData, setGazeData] = useState<GazeDataPoint[]>([])
  const [debugMode, setDebugMode] = useState(false)
  const [currentGaze, setCurrentGaze] = useState<{x: number, y: number} | null>(null)
  const [error, setError] = useState<string>('')
  const [isInitialized, setIsInitialized] = useState(false)
  const [calibrationPoints, setCalibrationPoints] = useState<CalibrationPoint[]>([])
  const [calibrationPhase, setCalibrationPhase] = useState<'pulse' | 'countdown'>('pulse')
  const [pulseProgress, setPulseProgress] = useState(0)
  const [countdownProgress, setCountdownProgress] = useState(0)
  const [calibrationStatusText, setCalibrationStatusText] = useState<string>('')
  const [videoStatusText, setVideoStatusText] = useState<string>('')

  // Load calibration points from backend (EyeTrax's exact order)
  useEffect(() => {
    const loadCalibrationPoints = async () => {
      try {
        const screenWidth = window.screen.width || window.innerWidth
        const screenHeight = window.screen.height || window.innerHeight
        const response = await apiClient.get('/gaze/calibration-points', {
          params: { screen_width: screenWidth, screen_height: screenHeight }
        })
        setCalibrationPoints(response.data.points)
        console.log('Loaded EyeTrax calibration points:', response.data.points)
      } catch (err) {
        console.error('Error loading calibration points:', err)
        // Fallback to default points if API fails
        setCalibrationPoints([
          { x: 0.5, y: 0.5 }, { x: 0.1, y: 0.1 }, { x: 0.9, y: 0.1 },
          { x: 0.1, y: 0.9 }, { x: 0.9, y: 0.9 }, { x: 0.5, y: 0.1 },
          { x: 0.1, y: 0.5 }, { x: 0.9, y: 0.5 }, { x: 0.5, y: 0.9 }
        ])
      }
    }
    loadCalibrationPoints()
  }, [])

  // Convert video frame to base64 (for EyeTrax processing)
  const videoFrameToBase64 = (video: HTMLVideoElement): string => {
    try {
      if (!video || video.readyState < video.HAVE_CURRENT_DATA) {
        return ''
      }
      
      const canvas = document.createElement('canvas')
      const width = video.videoWidth || 640
      const height = video.videoHeight || 480
      
      if (width === 0 || height === 0) {
        return ''
      }
      
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d', { willReadFrequently: true })
      
      if (ctx) {
        ctx.drawImage(video, 0, 0, width, height)
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8)
        // Remove data:image/jpeg;base64, prefix
        return dataUrl.split(',')[1] || ''
      }
      return ''
    } catch (err) {
      console.error('Error converting video frame to base64:', err)
      return ''
    }
  }

  const checkFrame = useCallback(async (frameBase64: string): Promise<{ face_detected: boolean; blink_detected: boolean }> => {
    const resp = await apiClient.post('/gaze/check', { frame: frameBase64 })
    return {
      face_detected: !!resp.data?.face_detected,
      blink_detected: !!resp.data?.blink_detected,
    }
  }, [])

  // Request fullscreen
  const requestFullscreen = useCallback(async () => {
    const element = containerRef.current
    if (!element) return

    try {
      if (element.requestFullscreen) {
        await element.requestFullscreen()
      } else if ((element as any).webkitRequestFullscreen) {
        await (element as any).webkitRequestFullscreen()
      } else if ((element as any).mozRequestFullScreen) {
        await (element as any).mozRequestFullScreen()
      } else if ((element as any).msRequestFullscreen) {
        await (element as any).msRequestFullscreen()
      }
    } catch (err) {
      console.error('Error requesting fullscreen:', err)
    }
  }, [])

  // Exit fullscreen
  const exitFullscreen = useCallback(() => {
    if (document.exitFullscreen) {
      document.exitFullscreen()
    } else if ((document as any).webkitExitFullscreen) {
      (document as any).webkitExitFullscreen()
    } else if ((document as any).mozCancelFullScreen) {
      (document as any).mozCancelFullScreen()
    } else if ((document as any).msExitFullscreen) {
      (document as any).msExitFullscreen()
    }
  }, [])

  // Debug mode toggle (press 'D' key)
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'd' || e.key === 'D') {
        setDebugMode(prev => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [])

  // Send calibration data to backend
  const sendCalibrationData = useCallback(async (samples: Array<{frame: string, target_x: number, target_y: number}>) => {
    try {
      const calibrationFrames = samples.map((sample, idx) => {
        const pointIndex = calibrationPoints.findIndex(p => 
          Math.abs(p.x - sample.target_x) < 0.05 && Math.abs(p.y - sample.target_y) < 0.05
        )
        return {
          frame: sample.frame,
          target_x: sample.target_x,
          target_y: sample.target_y,
          point_index: pointIndex >= 0 ? pointIndex : Math.floor(idx / 30)
        }
      })

      console.log(`Sending ${calibrationFrames.length} calibration frames to backend`)

      const response = await apiClient.post('/gaze/calibrate', {
        frames: calibrationFrames,
        screen_width: window.screen.width || window.innerWidth,
        screen_height: window.screen.height || window.innerHeight
      })

      if (response.data.status === 'calibrated') {
        console.log('✓ EyeTrax calibration successful, starting video phase')
        setPhase('video')
        
        // Ensure webcam continues running
        if (webcamVideoRef.current && webcamVideoRef.current.paused) {
          webcamVideoRef.current.play().catch(err => {
            console.error('Error keeping webcam running:', err)
          })
        }
        
        // Start video and gaze tracking
        setTimeout(() => {
          if (videoRef.current) {
            // Ensure video is loaded
            const video = videoRef.current
            if (video.readyState < 2) {
              video.addEventListener('canplay', () => {
                video.play().then(() => {
                  console.log('Stimuli video playing, starting gaze tracking')
                  startGazeTracking()
                }).catch(err => {
                  console.error('Error playing video:', err)
                  setError('Failed to play video. Please try again.')
                })
              }, { once: true })
              video.load()
            } else {
              video.play().then(() => {
                console.log('Stimuli video playing, starting gaze tracking')
                startGazeTracking()
              }).catch(err => {
                console.error('Error playing video:', err)
                setError('Failed to play video. Please try again.')
              })
            }
          }
        }, 500)
      } else {
        setError('Calibration failed. Please try again.')
      }
    } catch (err: any) {
      console.error('Calibration error:', err)
      setError(`Calibration error: ${err.response?.data?.detail || err.message}`)
    }
  }, [calibrationPoints])

  // Collect calibration samples for all points sequentially (EyeTrax style)
  const collectAllCalibrationSamples = useCallback(async () => {
    if (calibrationPoints.length === 0) {
      console.error('Calibration points not loaded yet')
      return
    }

    console.log('Starting EyeTrax-style calibration sample collection')
    const allSamples: Array<{frame: string, target_x: number, target_y: number}> = []
    const PULSE_DURATION = 1000 // 1 second pulse animation (matching EyeTrax)
    const COUNTDOWN_DURATION = 1000 // 1 second countdown/collection (matching EyeTrax)
    const MIN_GOOD_FRAMES_PER_POINT = 12
    const MAX_POINT_MS = 5000

    for (let pointIndex = 0; pointIndex < calibrationPoints.length; pointIndex++) {
      const target = calibrationPoints[pointIndex]
      console.log(`Calibrating point ${pointIndex + 1}/${calibrationPoints.length}`)
      setCurrentCalibrationIndex(pointIndex)

      // Restart-on-blink logic:
      // - If blink occurs during the countdown, redo the same point.
      // - Only keep frames where EyeTrax reports face_detected=true AND blink_detected=false.
      let goodFrames: Array<{frame: string, target_x: number, target_y: number}> = []

      while (true) {
        setCalibrationStatusText('')
        setPulseProgress(0)
        setCountdownProgress(0)

        // Phase 1: Pulse animation (1 second) - matching EyeTrax
        setCalibrationPhase('pulse')
        const pulseStart = Date.now()
        while (Date.now() - pulseStart < PULSE_DURATION) {
          const elapsed = Date.now() - pulseStart
          setPulseProgress(elapsed / PULSE_DURATION)
          await new Promise(resolve => setTimeout(resolve, 16)) // ~60fps
        }
        setPulseProgress(1)

        // Phase 2: Countdown and collection (EyeTrax-style)
        setCalibrationPhase('countdown')
        const countdownStart = Date.now()
        let blinkRestart = false
        goodFrames = []

        while ((Date.now() - countdownStart < COUNTDOWN_DURATION || goodFrames.length < MIN_GOOD_FRAMES_PER_POINT) && (Date.now() - countdownStart < MAX_POINT_MS)) {
          const elapsed = Date.now() - countdownStart
          setCountdownProgress(Math.min(1, elapsed / COUNTDOWN_DURATION))

          if (!webcamVideoRef.current) {
            await new Promise(resolve => setTimeout(resolve, 100))
            continue
          }

          const video = webcamVideoRef.current
          if (video.readyState >= video.HAVE_CURRENT_DATA && video.videoWidth > 0 && video.videoHeight > 0) {
            const frameBase64 = videoFrameToBase64(video)
            if (frameBase64 && frameBase64.length > 100) {
              try {
                const status = await checkFrame(frameBase64)
                if (!status.face_detected) {
                  setCalibrationStatusText('Face not detected — please center your face in view.')
                } else if (status.blink_detected) {
                  setCalibrationStatusText('Blink detected — restarting this point…')
                  blinkRestart = true
                  break
                } else {
                  goodFrames.push({ frame: frameBase64, target_x: target.x, target_y: target.y })
                  setCalibrationStatusText(`Collecting… ${goodFrames.length}/${MIN_GOOD_FRAMES_PER_POINT}`)
                }
              } catch (err) {
                console.error('Frame check failed:', err)
              }
            }
          }

          // ~10fps to keep backend load reasonable
          await new Promise(resolve => setTimeout(resolve, 100))
        }

        if (blinkRestart) {
          // redo same point
          continue
        }

        if (goodFrames.length >= MIN_GOOD_FRAMES_PER_POINT) {
          break
        }

        setCalibrationStatusText('Not enough good frames — holding a bit longer…')
        // If we got here without blink but not enough frames, loop again (pulse+countdown) to keep UX consistent.
      }

      allSamples.push(...goodFrames)
      console.log(`Collected ${goodFrames.length} good (open-eye) samples for point ${pointIndex + 1}`)
    }

    console.log(`Calibration complete. Total samples: ${allSamples.length}`)
    await sendCalibrationData(allSamples)
  }, [calibrationPoints, sendCalibrationData, checkFrame])

  // Start gaze tracking during video
  const startGazeTracking = useCallback(() => {
    if (!webcamVideoRef.current || !videoRef.current) {
      console.error('Webcam or video not available for tracking')
      return
    }

    console.log('Starting gaze tracking during video using EyeTrax')

    // Ensure webcam is still running
    if (webcamVideoRef.current.paused) {
      webcamVideoRef.current.play().catch(err => {
        console.error('Error playing webcam:', err)
      })
    }

    const trackGaze = async () => {
      if (!webcamVideoRef.current || !videoRef.current) {
        if (frameIntervalRef.current) {
          clearInterval(frameIntervalRef.current)
          frameIntervalRef.current = null
        }
        return
      }

      // Check if stimuli video ended
      if (videoRef.current.ended) {
        if (frameIntervalRef.current) {
          clearInterval(frameIntervalRef.current)
          frameIntervalRef.current = null
        }
        console.log('Video ended, processing gaze data')
        
        // Get final gaze data
        const finalGazeData = [...gazeData]
        setPhase('complete')
        onGazeData(finalGazeData)
        onComplete()
        exitFullscreen()
        return
      }

      // Only track when video is playing
      if (videoRef.current.paused || videoRef.current.ended) {
        return
      }

      // Use EyeTrax to predict gaze from webcam frame
      if (webcamVideoRef.current.readyState >= webcamVideoRef.current.HAVE_CURRENT_DATA) {
        try {
          const frameBase64 = videoFrameToBase64(webcamVideoRef.current)
          if (frameBase64 && frameBase64.length > 0) {
            const response = await apiClient.post('/gaze/predict', {
              frame: frameBase64
            })

            if (response.data && response.data.x !== undefined && response.data.y !== undefined) {
              // Always show pointer (debug) when we have coordinates.
              // Only *record* gaze data when calibrated is true.
              const screenX = response.data.x * window.innerWidth
              const screenY = response.data.y * window.innerHeight

              setCurrentGaze({ x: screenX, y: screenY })

              if (response.data.calibrated) {
                const isSocial = screenX < window.innerWidth / 2
                const dataPoint: GazeDataPoint = {
                  timestamp: Date.now(),
                  x: screenX,
                  y: screenY,
                  social_region: isSocial
                }

                setGazeData(prev => [...prev, dataPoint])
              } else {
                console.warn('Gaze tracking not calibrated (showing pointer only)')
              }
            }
          }
        } catch (err: any) {
          console.error('Error predicting gaze with EyeTrax:', err)
          if (err.response) {
            console.error('Response error:', err.response.data)
          }
        }
      }
    }

    // Track at ~10fps (100ms interval) - matching EyeTrax demo frequency
    frameIntervalRef.current = window.setInterval(trackGaze, 100)
  }, [gazeData, onGazeData, onComplete, exitFullscreen])

  // Initialize webcam and start calibration
  useEffect(() => {
    if (phase !== 'calibration' || isInitialized || calibrationPoints.length === 0) return

    console.log('GazeTracker: Calibration phase - starting initialization')
    setIsInitialized(true)

    const initCalibration = async () => {
      try {
        console.log('Initializing calibration - requesting webcam access')
        
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { 
            facingMode: 'user',
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }
        })

        webcamStreamRef.current = stream
        console.log('Webcam access granted')

        if (webcamVideoRef.current) {
          const video = webcamVideoRef.current
          
          if (video.srcObject) {
            const oldStream = video.srcObject as MediaStream
            oldStream.getTracks().forEach(track => track.stop())
          }
          
          video.srcObject = stream
          
          await new Promise<void>((resolve, reject) => {
            if (!video) {
              reject(new Error('Video element not available'))
              return
            }

            const timeout = setTimeout(() => {
              video.removeEventListener('loadedmetadata', onMetadata)
              video.removeEventListener('canplay', onCanPlay)
              reject(new Error('Video ready timeout'))
            }, 10000)

            const onMetadata = () => {
              console.log('Video metadata loaded')
            }

            const onCanPlay = async () => {
              console.log('Video can play')
              clearTimeout(timeout)
              video.removeEventListener('loadedmetadata', onMetadata)
              video.removeEventListener('canplay', onCanPlay)
              
              try {
                await video.play()
                console.log('Video playing successfully')
                resolve()
              } catch (playError: any) {
                console.error('Video play error:', playError)
                setTimeout(async () => {
                  try {
                    await video.play()
                    resolve()
                  } catch (retryError) {
                    reject(retryError)
                  }
                }, 200)
              }
            }

            video.addEventListener('loadedmetadata', onMetadata)
            video.addEventListener('canplay', onCanPlay)
          })

          console.log('Webcam ready, requesting fullscreen')
          
          try {
            await requestFullscreen()
          } catch (fsErr) {
            console.warn('Fullscreen request failed, continuing anyway:', fsErr)
          }

          setTimeout(() => {
            console.log('Starting calibration sample collection')
            collectAllCalibrationSamples().catch(err => {
              console.error('Error in calibration collection:', err)
              setError(`Calibration error: ${err.message}`)
            })
          }, 1000)
        }
      } catch (err: any) {
        console.error('Error initializing calibration:', err)
        setError(`Could not access webcam: ${err.message}. Please ensure camera permissions are granted.`)
        setIsInitialized(false)
      }
    }

    initCalibration()

    return () => {
      if (frameIntervalRef.current) {
        clearInterval(frameIntervalRef.current)
        frameIntervalRef.current = null
      }
    }
  }, [phase, isInitialized, calibrationPoints, requestFullscreen, collectAllCalibrationSamples])

  // Draw calibration target (EyeTrax style: green pulsing circle, then green circle with white countdown)
  useEffect(() => {
    if (phase !== 'calibration' || calibrationPoints.length === 0) return

    const canvas = calibrationCanvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const draw = () => {
      const width = window.innerWidth || 1920
      const height = window.innerHeight || 1080
      
      canvas.width = width
      canvas.height = height

      const target = calibrationPoints[currentCalibrationIndex]
      const x = target.x * width
      const y = target.y * height

      // Black background
      ctx.fillStyle = '#000000'
      ctx.fillRect(0, 0, width, height)

      if (calibrationPhase === 'pulse') {
        // EyeTrax pulse: pulsing green circle (radius 15-30)
        const pulseRadius = 15 + 15 * Math.abs(Math.sin(pulseProgress * 2 * Math.PI))
        ctx.fillStyle = '#00ff00' // Green (matching EyeTrax)
        ctx.beginPath()
        ctx.arc(x, y, pulseRadius, 0, 2 * Math.PI)
        ctx.fill()
      } else if (calibrationPhase === 'countdown') {
        // EyeTrax countdown: green circle with white countdown ellipse
        const finalRadius = 20
        ctx.fillStyle = '#00ff00' // Green circle
        ctx.beginPath()
        ctx.arc(x, y, finalRadius, 0, 2 * Math.PI)
        ctx.fill()

        // White countdown ellipse (matching EyeTrax)
        const ease = countdownProgress * countdownProgress * (3 - 2 * countdownProgress)
        const angle = 360 * (1 - ease)
        ctx.strokeStyle = '#ffffff'
        ctx.lineWidth = 4
        ctx.beginPath()
        ctx.ellipse(x, y, 40, 40, 0, -90 * Math.PI / 180, (-90 + angle) * Math.PI / 180)
        ctx.stroke()
      }
    }

    draw()
    const interval = setInterval(draw, 16) // ~60fps

    return () => clearInterval(interval)
  }, [phase, currentCalibrationIndex, calibrationPoints, calibrationPhase, pulseProgress, countdownProgress])

  // Handle video end
  useEffect(() => {
    if (!videoRef.current || phase !== 'video') return

    const handleEnded = () => {
      console.log('Video ended event fired')
      if (frameIntervalRef.current) {
        clearInterval(frameIntervalRef.current)
        frameIntervalRef.current = null
      }
      setPhase('complete')
      onGazeData(gazeData)
      onComplete()
      exitFullscreen()
    }

    videoRef.current.addEventListener('ended', handleEnded)
    return () => {
      videoRef.current?.removeEventListener('ended', handleEnded)
    }
  }, [phase, gazeData, onGazeData, onComplete, exitFullscreen])

  // Ensure stimuli video is actually playing once we enter video phase.
  // (Some browsers can miss the earlier play() call if the <video> mounts slightly later.)
  useEffect(() => {
    if (phase !== 'video') return
    const video = videoRef.current
    if (!video) return

    // Keep muted to satisfy autoplay policies; this is a screening stimulus video.
    video.muted = true
    video.playsInline = true

    const tryPlay = async () => {
      try {
        await video.play()
        setVideoStatusText('')
      } catch (e) {
        setVideoStatusText('Tap/click once if the video does not start automatically.')
      }
    }

    // If already ready, attempt immediately; otherwise wait for canplay.
    if (video.readyState >= 2) {
      void tryPlay()
    } else {
      const onCanPlay = () => void tryPlay()
      video.addEventListener('canplay', onCanPlay, { once: true })
      video.load()
      return () => video.removeEventListener('canplay', onCanPlay)
    }
  }, [phase])

  // Cleanup
  useEffect(() => {
    return () => {
      if (frameIntervalRef.current) {
        clearInterval(frameIntervalRef.current)
        frameIntervalRef.current = null
      }
      if (webcamStreamRef.current) {
        webcamStreamRef.current.getTracks().forEach(track => track.stop())
      }
      exitFullscreen()
    }
  }, [exitFullscreen])

  // Single persistent container so fullscreen + webcam stream aren't lost when phase changes.
  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: '#000',
        zIndex: 10000
      }}
    >
      {/* Persistent hidden webcam video (never visible) */}
      <video
        ref={webcamVideoRef}
        style={{ position: 'fixed', top: '-9999px', left: '-9999px', width: '1px', height: '1px', opacity: 0, visibility: 'hidden' }}
        autoPlay
        playsInline
        muted
      />

      {/* Stimuli video (visible only in video phase) */}
      {phase === 'video' && (
        <video
          ref={videoRef}
          src={videoSrc}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            objectFit: 'contain',
            backgroundColor: '#000',
            zIndex: 1000
          }}
          autoPlay
          playsInline
          muted
          preload="auto"
        />
      )}

      {/* Calibration canvas (visible only in calibration phase) */}
      <canvas
        ref={calibrationCanvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          pointerEvents: 'none',
          display: phase === 'calibration' ? 'block' : 'none',
          zIndex: 1
        }}
      />

      {phase === 'calibration' && !!calibrationStatusText && (
        <div style={{
          position: 'absolute',
          top: 20,
          left: '50%',
          transform: 'translateX(-50%)',
          color: '#fff',
          background: 'rgba(0,0,0,0.6)',
          padding: '10px 14px',
          borderRadius: 10,
          zIndex: 10002,
          fontSize: '1rem'
        }}>
          {calibrationStatusText}
        </div>
      )}

      {phase === 'calibration' && error && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'rgba(255, 0, 0, 0.9)',
          color: '#fff',
          padding: '20px 30px',
          borderRadius: '10px',
          zIndex: 10001,
          maxWidth: '500px',
          textAlign: 'center'
        }}>
          <p style={{ margin: 0, fontSize: '1.1rem' }}>{error}</p>
          <button
            onClick={() => {
              setError('')
              setIsInitialized(false)
              setPhase('calibration')
            }}
            style={{
              marginTop: '15px',
              padding: '10px 20px',
              fontSize: '1rem',
              backgroundColor: '#fff',
              color: '#000',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Try Again
          </button>
        </div>
      )}

      {phase === 'calibration' && !error && !isInitialized && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: '#fff',
          textAlign: 'center',
          fontSize: '1.2rem',
          zIndex: 10001
        }}>
          Initializing calibration... Please allow camera access.
        </div>
      )}

      {phase === 'video' && (
        <>
          {/* Visual divider between social (left) and geometric (right) */}
          <div style={{
            position: 'absolute',
            left: '50%',
            top: 0,
            bottom: 0,
            width: '2px',
            background: 'rgba(255, 255, 255, 0.5)',
            pointerEvents: 'none',
            zIndex: 1001
          }} />

          {/* Debug gaze pointer */}
          {debugMode && currentGaze && (
            <div
              style={{
                position: 'absolute',
                left: `${currentGaze.x}px`,
                top: `${currentGaze.y}px`,
                transform: 'translate(-50%, -50%)',
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                border: '2px solid #ff0000',
                backgroundColor: 'rgba(255, 0, 0, 0.3)',
                pointerEvents: 'none',
                zIndex: 2002
              }}
            />
          )}

          {debugMode && !currentGaze && (
            <div style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: 'rgba(0, 0, 0, 0.6)',
              color: '#fff',
              padding: '10px 14px',
              borderRadius: 10,
              fontSize: '0.95rem',
              zIndex: 2003
            }}>
              Waiting for gaze predictions…
            </div>
          )}

          {debugMode && (
            <div style={{
              position: 'absolute',
              top: '20px',
              left: '20px',
              background: 'rgba(255, 0, 0, 0.8)',
              color: '#fff',
              padding: '10px 20px',
              borderRadius: '8px',
              fontSize: '1rem',
              zIndex: 2003
            }}>
              Debug Mode: ON (Press 'D' to toggle) | Gaze points: {gazeData.length}
            </div>
          )}

          {!!videoStatusText && (
            <div style={{
              position: 'absolute',
              bottom: 20,
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'rgba(0,0,0,0.6)',
              color: '#fff',
              padding: '10px 14px',
              borderRadius: 10,
              fontSize: '1rem',
              zIndex: 2003
            }}>
              {videoStatusText}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default GazeTracker
