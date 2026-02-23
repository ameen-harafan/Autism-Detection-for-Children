"""
Gaze analysis router for processing gaze tracking results.
Uses EyeTrax library for gaze estimation.
"""
from fastapi import APIRouter, HTTPException, WebSocket, WebSocketDisconnect
from pydantic import BaseModel
from typing import List, Literal, Optional
from app.services.gaze_tracker import get_gaze_service, calculate_9_point_calibration_targets

router = APIRouter()


class GazeDataPoint(BaseModel):
    timestamp: float
    x: float
    y: float
    social_region: bool  # True if gaze is on social (left) side, False if geometric (right) side


class GazeAnalysisRequest(BaseModel):
    gaze_data: List[GazeDataPoint]
    video_duration: float  # Total video duration in seconds


class GazeAnalysisResponse(BaseModel):
    spi: float  # Social Preference Index
    social_frames: int
    geometric_frames: int
    total_valid_frames: int
    risk_category: Literal["Low", "Medium", "High"]
    interpretation: str
    recommendation: str


class CalibrationFrame(BaseModel):
    frame: str  # base64 encoded image
    target_x: float  # Normalized x coordinate (0-1)
    target_y: float  # Normalized y coordinate (0-1)
    point_index: int  # Which calibration point (0-8 for 9-point)


class CalibrationRequest(BaseModel):
    frames: List[CalibrationFrame]
    screen_width: int = 1920  # Screen width in pixels
    screen_height: int = 1080  # Screen height in pixels


class CalibrationPointsResponse(BaseModel):
    points: List[dict]  # List of {x, y} in normalized coordinates (0-1)
    point_order: List[int]  # Order indices for reference


class FrameCheckRequest(BaseModel):
    frame: str  # base64 encoded image (no data-url prefix)


class FrameCheckResponse(BaseModel):
    face_detected: bool
    blink_detected: bool


@router.get("/calibration-points")
async def get_calibration_points(screen_width: int = 1920, screen_height: int = 1080):
    """
    Get EyeTrax 9-point calibration targets.
    Returns calibration points in normalized coordinates (0-1) matching EyeTrax's order.
    """
    try:
        # Calculate pixel coordinates using EyeTrax's logic
        pixel_points = calculate_9_point_calibration_targets(screen_width, screen_height)
        
        # Convert to normalized coordinates (0-1) for frontend
        normalized_points = [
            {"x": float(x) / screen_width, "y": float(y) / screen_height}
            for x, y in pixel_points
        ]
        
        # EyeTrax's point order: (1,1), (0,0), (2,0), (0,2), (2,2), (1,0), (0,1), (2,1), (1,2)
        # This corresponds to: center, top-left, top-right, bottom-left, bottom-right, 
        #                      top-center, middle-left, middle-right, bottom-center
        point_order = [0, 1, 2, 3, 4, 5, 6, 7, 8]  # Indices for reference
        
        return CalibrationPointsResponse(
            points=normalized_points,
            point_order=point_order
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error calculating calibration points: {str(e)}")


@router.post("/check", response_model=FrameCheckResponse)
async def check_frame(request: FrameCheckRequest):
    """
    Lightweight EyeTrax-only per-frame check used by the frontend during calibration:
    returns face detection + blink detection so the UI can restart the current point on blink.
    """
    gaze_service = get_gaze_service()
    result = gaze_service.check_frame(request.frame)
    return FrameCheckResponse(**result)


@router.post("/calibrate")
async def calibrate_gaze(request: CalibrationRequest):
    """
    Calibrate gaze tracking system with collected frames using EyeTrax.
    Uses EyeTrax's extract_features and train methods.
    """
    try:
        gaze_service = get_gaze_service()
        
        calibration_data = [
            {
                'frame': frame.frame,
                'target_x': frame.target_x,
                'target_y': frame.target_y
            }
            for frame in request.frames
        ]
        
        success = gaze_service.calibrate_with_frames(
            calibration_data,
            screen_width=request.screen_width,
            screen_height=request.screen_height
        )
        
        if success:
            return {"status": "calibrated", "message": "Gaze tracking system calibrated using EyeTrax"}
        else:
            raise HTTPException(status_code=500, detail="Calibration failed")
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error during calibration: {str(e)}")


@router.post("/predict")
async def predict_gaze(frame: dict):
    """
    Predict gaze coordinates from a single frame using EyeTrax.
    Input: {"frame": "base64_encoded_image"}
    Output: {"x": float, "y": float} (normalized coordinates 0-1)
    """
    try:
        gaze_service = get_gaze_service()
        
        if not gaze_service.get_calibration_status():
            # If not calibrated, return approximate center (fallback)
            return {"x": 0.5, "y": 0.5, "calibrated": False}
        
        frame_base64 = frame.get("frame", "")
        if not frame_base64:
            raise HTTPException(status_code=400, detail="No frame data provided")
        
        result = gaze_service.predict_gaze(frame_base64)
        
        if result:
            x, y = result
            return {"x": x, "y": y, "calibrated": True}
        else:
            # Fallback to center if prediction fails
            return {"x": 0.5, "y": 0.5, "calibrated": True, "prediction_failed": True}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error predicting gaze: {str(e)}")


@router.websocket("/ws")
async def websocket_gaze_tracking(websocket: WebSocket):
    """
    WebSocket endpoint for real-time gaze tracking using EyeTrax.
    Client sends frames, server responds with gaze coordinates.
    """
    await websocket.accept()
    gaze_service = get_gaze_service()
    
    try:
        while True:
            # Receive frame data
            data = await websocket.receive_json()
            
            if data.get("type") == "frame":
                frame_base64 = data.get("frame", "")
                
                if gaze_service.get_calibration_status():
                    result = gaze_service.predict_gaze(frame_base64)
                    if result:
                        x, y = result
                        await websocket.send_json({
                            "type": "gaze",
                            "x": x,
                            "y": y,
                            "calibrated": True
                        })
                    else:
                        await websocket.send_json({
                            "type": "gaze",
                            "x": 0.5,
                            "y": 0.5,
                            "calibrated": True,
                            "prediction_failed": True
                        })
                else:
                    # Not calibrated, return center
                    await websocket.send_json({
                        "type": "gaze",
                        "x": 0.5,
                        "y": 0.5,
                        "calibrated": False
                    })
            
            elif data.get("type") == "close":
                break
    
    except WebSocketDisconnect:
        pass
    except Exception as e:
        print(f"WebSocket error: {e}")
        await websocket.close()


@router.post("/analyze", response_model=GazeAnalysisResponse)
async def analyze_gaze(request: GazeAnalysisRequest):
    """
    Analyze gaze tracking data and calculate Social Preference Index (SPI).
    SPI = (Social_Frames - Geometric_Frames) / Total_Valid_Frames
    
    Interpretation:
    - SPI >= 0.2: Low Risk (Strong preference for social stimuli)
    - 0.0 <= SPI < 0.2: Moderate Risk (Mixed preference)
    - SPI < 0.0: High Risk (Preference for geometric stimuli)
    """
    if not request.gaze_data:
        raise HTTPException(status_code=400, detail="No gaze data provided")
    
    if request.video_duration <= 0:
        raise HTTPException(status_code=400, detail="Invalid video duration")
    
    # Count frames in each region
    social_frames = sum(1 for point in request.gaze_data if point.social_region)
    geometric_frames = sum(1 for point in request.gaze_data if not point.social_region)
    total_valid_frames = len(request.gaze_data)
    
    if total_valid_frames == 0:
        raise HTTPException(status_code=400, detail="No valid gaze data points")
    
    # Calculate SPI
    spi = (social_frames - geometric_frames) / total_valid_frames
    
    # Determine risk category
    if spi >= 0.2:
        risk_category = "Low"
        interpretation = f"SPI of {spi:.2f} indicates a strong preference for social stimuli, which is typical in neurotypical development. This is a screening signal only and not a diagnostic tool."
        recommendation = "Continue monitoring your child's development. If other concerns arise, consult a healthcare professional."
    elif spi >= 0.0:
        risk_category = "Medium"
        interpretation = f"SPI of {spi:.2f} indicates a mixed preference between social and geometric stimuli. This is a screening signal only and not a diagnostic tool."
        recommendation = "Consider discussing this result along with other screening findings with a healthcare professional."
    else:  # spi < 0.0
        risk_category = "High"
        interpretation = f"SPI of {spi:.2f} indicates a preference for geometric over social stimuli, which may be associated with autism traits. This is a screening signal only and not a diagnostic tool."
        recommendation = "This result, combined with other screening findings, suggests consulting with a healthcare professional for comprehensive evaluation."
    
    return GazeAnalysisResponse(
        spi=float(spi),
        social_frames=social_frames,
        geometric_frames=geometric_frames,
        total_valid_frames=total_valid_frames,
        risk_category=risk_category,
        interpretation=interpretation,
        recommendation=recommendation
    )


@router.get("/status")
async def get_gaze_status():
    """Get calibration status of gaze tracking system"""
    gaze_service = get_gaze_service()
    return {
        "calibrated": gaze_service.get_calibration_status(),
        "model_path": gaze_service.model_path
    }
