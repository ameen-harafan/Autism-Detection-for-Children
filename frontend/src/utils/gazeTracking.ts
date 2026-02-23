/**
 * Gaze tracking utilities using MediaPipe Face Mesh
 * Based on EyeTrax approach: https://github.com/ck-zhang/EyeTrax
 */

// MediaPipe imports - using CDN to avoid bundling issues
declare global {
  interface Window {
    FaceMesh: any;
    Camera: any;
    FACEMESH_LEFT_EYE: any;
    FACEMESH_RIGHT_EYE: any;
  }
}

export interface GazePoint {
  x: number;
  y: number;
  timestamp: number;
}

export interface CalibrationPoint {
  x: number;
  y: number;
  gazeSamples: GazePoint[];
}

export class GazeTracker {
  private faceMesh: FaceMesh;
  private camera: Camera | null = null;
  private videoElement: HTMLVideoElement | null = null;
  private canvasElement: HTMLCanvasElement | null = null;
  private calibrationPoints: CalibrationPoint[] = [];
  private isCalibrating: boolean = false;
  private currentCalibrationIndex: number = 0;
  private calibrationSamplesPerPoint: number = 30;
  private currentCalibrationSamples: GazePoint[] = [];
  private calibrationCallback: ((pointIndex: number) => void) | null = null;
  private gazeCallback: ((gaze: GazePoint) => void) | null = null;
  private isTracking: boolean = false;

  constructor(videoElement: HTMLVideoElement, canvasElement: HTMLCanvasElement) {
    this.videoElement = videoElement;
    this.canvasElement = canvasElement;

    this.faceMesh = new FaceMesh({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
      }
    });

    this.faceMesh.setOptions({
      maxNumFaces: 1,
      refineLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5
    });

    this.faceMesh.onResults(this.onResults.bind(this));
  }

  private onResults(results: any) {
    if (!this.canvasElement) return;

    const ctx = this.canvasElement.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.save();
    ctx.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);
    ctx.drawImage(results.image, 0, 0, this.canvasElement.width, this.canvasElement.height);

    if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
      const landmarks = results.multiFaceLandmarks[0];
      
      // Draw face mesh (optional, for debugging)
      // drawConnectors(ctx, landmarks, FACEMESH_LEFT_EYE, { color: '#C0C0C070', lineWidth: 1 });
      // drawConnectors(ctx, landmarks, FACEMESH_RIGHT_EYE, { color: '#C0C0C070', lineWidth: 1 });

      // Calculate gaze point
      const gazePoint = this.calculateGaze(landmarks, this.canvasElement.width, this.canvasElement.height);
      
      if (gazePoint) {
        if (this.isCalibrating) {
          // Collect calibration samples
          this.currentCalibrationSamples.push(gazePoint);
          
          if (this.currentCalibrationSamples.length >= this.calibrationSamplesPerPoint) {
            // Calibration point complete
            this.calibrationPoints.push({
              x: 0, // Will be set by calibration target
              y: 0,
              gazeSamples: [...this.currentCalibrationSamples]
            });
            
            this.currentCalibrationSamples = [];
            if (this.calibrationCallback) {
              this.calibrationCallback(this.currentCalibrationIndex);
            }
            this.currentCalibrationIndex++;
          }
        } else if (this.isTracking && this.gazeCallback) {
          // Normal gaze tracking
          this.gazeCallback(gazePoint);
        }

        // Draw gaze point (for debug mode)
        ctx.fillStyle = '#FF0000';
        ctx.beginPath();
        ctx.arc(gazePoint.x, gazePoint.y, 5, 0, 2 * Math.PI);
        ctx.fill();
      }
    }

    ctx.restore();
  }

  /**
   * Calculate gaze point from face landmarks
   * Uses left and right eye center positions to estimate gaze
   */
  private calculateGaze(landmarks: any, canvasWidth: number, canvasHeight: number): GazePoint | null {
    // Eye landmark indices (MediaPipe Face Mesh)
    const LEFT_EYE_TOP = 159;
    const LEFT_EYE_BOTTOM = 145;
    const LEFT_EYE_LEFT = 33;
    const LEFT_EYE_RIGHT = 133;
    const RIGHT_EYE_TOP = 386;
    const RIGHT_EYE_BOTTOM = 374;
    const RIGHT_EYE_LEFT = 362;
    const RIGHT_EYE_RIGHT = 263;

    // Get eye centers
    const leftEyeCenter = {
      x: (landmarks[LEFT_EYE_LEFT].x + landmarks[LEFT_EYE_RIGHT].x) / 2,
      y: (landmarks[LEFT_EYE_TOP].y + landmarks[LEFT_EYE_BOTTOM].y) / 2
    };

    const rightEyeCenter = {
      x: (landmarks[RIGHT_EYE_LEFT].x + landmarks[RIGHT_EYE_RIGHT].x) / 2,
      y: (landmarks[RIGHT_EYE_TOP].y + landmarks[RIGHT_EYE_BOTTOM].y) / 2
    };

    // Convert normalized coordinates to screen coordinates
    const screenX = ((leftEyeCenter.x + rightEyeCenter.x) / 2) * canvasWidth;
    const screenY = ((leftEyeCenter.y + rightEyeCenter.y) / 2) * canvasHeight;

    // For now, use center of eyes as gaze estimate
    // In production, you could use iris landmarks for better accuracy
    return {
      x: screenX,
      y: screenY,
      timestamp: Date.now()
    };
  }

  /**
   * Start calibration
   * User should look at each calibration target (dot) on screen
   */
  public startCalibration(
    calibrationTargets: Array<{ x: number; y: number }>,
    onCalibrationProgress: (pointIndex: number) => void
  ): Promise<void> {
    return new Promise((resolve) => {
      this.isCalibrating = true;
      this.currentCalibrationIndex = 0;
      this.calibrationPoints = [];
      this.calibrationCallback = (pointIndex: number) => {
        onCalibrationProgress(pointIndex);
        
        if (pointIndex >= calibrationTargets.length - 1) {
          // Calibration complete
          this.isCalibrating = false;
          this.calibrationCallback = null;
          resolve();
        }
      };

      // Set calibration target positions
      calibrationTargets.forEach((target, index) => {
        if (this.calibrationPoints[index]) {
          this.calibrationPoints[index].x = target.x;
          this.calibrationPoints[index].y = target.y;
        }
      });
    });
  }

  /**
   * Start gaze tracking
   */
  public startTracking(onGaze: (gaze: GazePoint) => void) {
    this.isTracking = true;
    this.gazeCallback = onGaze;
  }

  /**
   * Stop gaze tracking
   */
  public stopTracking() {
    this.isTracking = false;
    this.gazeCallback = null;
  }

  /**
   * Start camera and processing
   */
  public async start() {
    if (!this.videoElement) {
      throw new Error('Video element not set');
    }

    this.camera = new Camera(this.videoElement, {
      onFrame: async () => {
        if (this.videoElement) {
          await this.faceMesh.send({ image: this.videoElement });
        }
      },
      width: 1280,
      height: 720
    });

    await this.camera.start();
  }

  /**
   * Stop camera and cleanup
   */
  public stop() {
    if (this.camera) {
      this.camera.stop();
      this.camera = null;
    }
    this.stopTracking();
  }

  /**
   * Get calibration data (for sending to backend if needed)
   */
  public getCalibrationData(): CalibrationPoint[] {
    return this.calibrationPoints;
  }
}

