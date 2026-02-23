"""
Gaze tracking service using EyeTrax library
Based on https://github.com/ck-zhang/EyeTrax
Uses EyeTrax's GazeEstimator, extract_features, train, and predict methods
"""
import cv2
import numpy as np
from typing import Optional, List, Tuple, Dict
import base64
from io import BytesIO
from PIL import Image
import os
import sys
import pickle

# Add tf_env to path to ensure EyeTrax can be imported
tf_env_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'tf_env', 'Lib', 'site-packages')
if tf_env_path not in sys.path:
    sys.path.insert(0, tf_env_path)

# Import EyeTrax GazeEstimator and calibration utilities
try:
    from eyetrax import GazeEstimator
    EYETRAX_AVAILABLE = True
    print("✓ EyeTrax imported successfully from standard path")
except ImportError:
    print("Warning: EyeTrax not found in standard path. Trying tf_env...")
    try:
        import importlib.util
        eyetrax_init_path = os.path.join(tf_env_path, 'eyetrax', '__init__.py')
        if os.path.exists(eyetrax_init_path):
            spec = importlib.util.spec_from_file_location("eyetrax", eyetrax_init_path)
            eyetrax = importlib.util.module_from_spec(spec)
            sys.modules["eyetrax"] = eyetrax
            spec.loader.exec_module(eyetrax)
            GazeEstimator = eyetrax.GazeEstimator
            EYETRAX_AVAILABLE = True
            print("✓ EyeTrax loaded from tf_env successfully")
        else:
            raise ImportError(f"EyeTrax not found at {eyetrax_init_path}")
    except Exception as e:
        print(f"ERROR: Could not load EyeTrax: {e}")
        import traceback
        traceback.print_exc()
        GazeEstimator = None
        EYETRAX_AVAILABLE = False

def calculate_9_point_calibration_targets(screen_width: int, screen_height: int) -> List[Tuple[int, int]]:
    """
    Calculate 9-point calibration targets using EyeTrax's calibration logic.
    This matches the point calculation from eyetrax.calibration.nine_point.run_9_point_calibration
    
    Returns list of (x, y) pixel coordinates for calibration points.
    """
    mx, my = int(screen_width * 0.1), int(screen_height * 0.1)
    gw, gh = screen_width - 2 * mx, screen_height - 2 * my
    # EyeTrax's 9-point calibration order: center, corners, then edges
    order = [(1, 1), (0, 0), (2, 0), (0, 2), (2, 2), (1, 0), (0, 1), (2, 1), (1, 2)]
    pts = [(mx + int(c * (gw / 2)), my + int(r * (gh / 2))) for (r, c) in order]
    return pts

class GazeTrackingService:
    """
    Service for gaze tracking using EyeTrax library.
    Uses EyeTrax's GazeEstimator with extract_features, train, and predict methods.
    """
    def __init__(self):
        self.estimator: Optional[GazeEstimator] = None
        self.is_calibrated = False
        self.model_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "models", "gaze_model.pkl")
        # Default screen dimensions (will be set from frontend)
        self.screen_width = 1920
        self.screen_height = 1080
    
    def initialize(self) -> bool:
        """Initialize the EyeTrax GazeEstimator"""
        try:
            if not EYETRAX_AVAILABLE or GazeEstimator is None:
                print("ERROR: EyeTrax not available - cannot initialize gaze tracking")
                return False
            
            # Create EyeTrax GazeEstimator instance
            self.estimator = GazeEstimator()
            print("✓ EyeTrax GazeEstimator initialized successfully")
            
            # Try to load existing model if available
            if os.path.exists(self.model_path):
                try:
                    self._load_model(self.model_path)
                    self.is_calibrated = True
                    print(f"✓ Loaded existing gaze model from {self.model_path}")
                except Exception as e:
                    print(f"Could not load existing model: {e}")
                    self.is_calibrated = False
            else:
                print("No existing model found - calibration required")
            
            return True
        except Exception as e:
            print(f"ERROR: Error initializing GazeEstimator: {e}")
            import traceback
            traceback.print_exc()
            return False
    
    def _save_model(self, path: str) -> bool:
        """
        Save the EyeTrax model using pickle.
        EyeTrax's GazeEstimator doesn't have save_model method, so we save manually.
        """
        try:
            if not self.estimator or not self.is_calibrated:
                return False
            
            # Save model, scaler, and variable_scaling
            model_data = {
                'model': self.estimator.model,
                'scaler': self.estimator.scaler,
                'variable_scaling': self.estimator.variable_scaling,
                'screen_width': self.screen_width,
                'screen_height': self.screen_height
            }
            
            with open(path, 'wb') as f:
                pickle.dump(model_data, f)
            
            return True
        except Exception as e:
            print(f"Error saving model: {e}")
            import traceback
            traceback.print_exc()
            return False
    
    def _load_model(self, path: str) -> bool:
        """
        Load the EyeTrax model using pickle.
        EyeTrax's GazeEstimator doesn't have load_model method, so we load manually.
        """
        try:
            with open(path, 'rb') as f:
                model_data = pickle.load(f)
            
            self.estimator.model = model_data['model']
            self.estimator.scaler = model_data['scaler']
            self.estimator.variable_scaling = model_data.get('variable_scaling', None)
            self.screen_width = model_data.get('screen_width', 1920)
            self.screen_height = model_data.get('screen_height', 1080)
            
            return True
        except Exception as e:
            print(f"Error loading model: {e}")
            import traceback
            traceback.print_exc()
            return False
    
    def base64_to_image(self, base64_string: str) -> np.ndarray:
        """
        Convert base64 string to OpenCV image (BGR format).
        EyeTrax's extract_features expects BGR format images.
        """
        try:
            # Remove data URL prefix if present
            if ',' in base64_string:
                base64_string = base64_string.split(',')[1]
            
            image_data = base64.b64decode(base64_string)
            image = Image.open(BytesIO(image_data))
            
            # Convert to RGB numpy array
            image_np = np.array(image)
            
            # Handle different image formats and convert to BGR (EyeTrax requirement)
            if len(image_np.shape) == 2:  # Grayscale
                image_np = cv2.cvtColor(image_np, cv2.COLOR_GRAY2BGR)
            elif len(image_np.shape) == 3:
                if image_np.shape[2] == 4:  # RGBA
                    image_np = cv2.cvtColor(image_np, cv2.COLOR_RGBA2BGR)
                elif image_np.shape[2] == 3:  # RGB
                    image_np = cv2.cvtColor(image_np, cv2.COLOR_RGB2BGR)
            
            return image_np
        except Exception as e:
            print(f"Error converting base64 to image: {e}")
            import traceback
            traceback.print_exc()
            raise
    
    def predict_gaze(self, frame_base64: str) -> Optional[Tuple[float, float]]:
        """
        Predict gaze coordinates from a frame using EyeTrax.
        
        Uses EyeTrax's extract_features and predict methods (same as EyeTrax demo):
        - extract_features(image) -> (features, blink_detected)
        - predict([features]) -> array of predictions in screen pixel coordinates
        
        Returns normalized coordinates (0-1) or None if prediction fails.
        """
        if not self.estimator:
            print("ERROR: GazeEstimator not initialized")
            return None
            
        if not self.is_calibrated:
            print("WARNING: Model not calibrated, cannot predict gaze")
            return None
        
        try:
            # Convert base64 to BGR image (EyeTrax requirement)
            frame = self.base64_to_image(frame_base64)
            
            # Use EyeTrax's extract_features method (same as in EyeTrax demo line 92)
            features, blink_detected = self.estimator.extract_features(frame)
            
            if features is not None and not blink_detected:
                # Use EyeTrax's predict method - expects array of features (same as EyeTrax demo line 94)
                predictions = self.estimator.predict(np.array([features]))
                x, y = predictions[0]  # Get first prediction (matching EyeTrax demo line 95)
                
                # EyeTrax predict returns screen pixel coordinates
                # Convert to normalized (0-1) for frontend
                x_norm = float(x) / self.screen_width
                y_norm = float(y) / self.screen_height
                
                # Clamp to 0-1 range
                x_norm = max(0.0, min(1.0, x_norm))
                y_norm = max(0.0, min(1.0, y_norm))
                
                return (x_norm, y_norm)
            else:
                if features is None:
                    print("DEBUG: No face detected in frame")
                elif blink_detected:
                    print("DEBUG: Blink detected, skipping prediction")
            return None
        except Exception as e:
            print(f"ERROR: Error predicting gaze with EyeTrax: {e}")
            import traceback
            traceback.print_exc()
            return None

    def check_frame(self, frame_base64: str) -> Dict[str, bool]:
        """
        Lightweight per-frame check using EyeTrax only.
        Returns whether a face is detected and whether a blink is detected.

        This mirrors EyeTrax's internal logic in calibration/demo:
        - features is None => no face detected
        - blink_detected True => blink detected
        """
        if not self.estimator:
            return {"face_detected": False, "blink_detected": False}

        try:
            frame = self.base64_to_image(frame_base64)
            features, blink_detected = self.estimator.extract_features(frame)
            face_detected = features is not None
            return {
                "face_detected": bool(face_detected),
                "blink_detected": bool(blink_detected) if face_detected else False,
            }
        except Exception as e:
            print(f"ERROR: check_frame failed: {e}")
            import traceback
            traceback.print_exc()
            return {"face_detected": False, "blink_detected": False}
    
    def calibrate_with_frames(self, calibration_data: List[Dict], screen_width: int = 1920, screen_height: int = 1080) -> bool:
        """
        Perform 9-point calibration with collected frames using EyeTrax.
        
        Uses EyeTrax's calibration point calculation, extract_features and train methods:
        - calculate_9_point_calibration_targets() -> 9 calibration points (from EyeTrax logic)
        - extract_features(image) -> (features, blink_detected)
        - train(X, y) where X is array of features and y is array of target coordinates
        
        calibration_data: List of dicts with keys: 'frame', 'target_x', 'target_y'
        target_x, target_y are normalized coordinates (0-1) from frontend
        """
        if not self.estimator:
            print("ERROR: Estimator not initialized")
            return False
        
        try:
            self.screen_width = screen_width
            self.screen_height = screen_height
            print(f"Calibration screen size: {screen_width}x{screen_height}")
            
            # Calculate 9-point calibration targets using EyeTrax's logic
            calibration_points_px = calculate_9_point_calibration_targets(screen_width, screen_height)
            print(f"9-point calibration targets (pixels): {calibration_points_px}")
            
            # Collect features and targets from calibration data using EyeTrax
            features_list = []
            targets_list = []
            face_not_detected_count = 0
            blink_detected_count = 0
            successful_extractions = 0
            
            for idx, cal_point in enumerate(calibration_data):
                frame_base64 = cal_point.get('frame', '')
                target_x_norm = cal_point.get('target_x', 0.0)  # Normalized (0-1)
                target_y_norm = cal_point.get('target_y', 0.0)  # Normalized (0-1)
                
                if not frame_base64 or len(frame_base64) < 100:  # Check if frame data is valid
                    print(f"Frame {idx}: Invalid or empty frame data")
                    continue
                
                try:
                    # Convert to BGR image
                    frame = self.base64_to_image(frame_base64)
                    
                    if frame is None or frame.size == 0:
                        print(f"Frame {idx}: Failed to convert base64 to image")
                        continue
                    
                    # Use EyeTrax's extract_features method (same as EyeTrax calibration)
                    features, blink = self.estimator.extract_features(frame)
                    
                    if features is not None and not blink:
                        features_list.append(features)
                        # Convert normalized coordinates to screen pixel coordinates
                        # EyeTrax train expects pixel coordinates (as used in run_9_point_calibration)
                        target_x_px = target_x_norm * screen_width
                        target_y_px = target_y_norm * screen_height
                        targets_list.append([target_x_px, target_y_px])
                        successful_extractions += 1
                        
                        if idx % 30 == 0:  # Log every 30th frame
                            print(f"Frame {idx}: Features extracted successfully, target=({target_x_px:.0f}, {target_y_px:.0f})")
                    elif features is None:
                        face_not_detected_count += 1
                        if idx % 30 == 0:
                            print(f"Frame {idx}: No face detected")
                    elif blink:
                        blink_detected_count += 1
                        if idx % 30 == 0:
                            print(f"Frame {idx}: Blink detected")
                except Exception as e:
                    print(f"Error processing calibration frame {idx}: {e}")
                    import traceback
                    traceback.print_exc()
                    continue
            
            print(f"Calibration feature extraction summary:")
            print(f"  - Successful extractions: {successful_extractions}")
            print(f"  - Face not detected: {face_not_detected_count}")
            print(f"  - Blink detected: {blink_detected_count}")
            print(f"  - Total frames processed: {len(calibration_data)}")
            
            if len(features_list) < 9:  # Need at least 9 samples (one per calibration point)
                print(f"ERROR: Not enough calibration samples: {len(features_list)} (need at least 9)")
                print(f"Please ensure your face is clearly visible to the webcam during calibration")
                return False
            
            print(f"Training EyeTrax model with {len(features_list)} calibration samples...")
            
            # Train the model using EyeTrax's train method
            # This is the same method used in run_9_point_calibration
            X = np.array(features_list)
            y = np.array(targets_list)
            
            # EyeTrax train method signature: train(X, y, alpha=1.0, variable_scaling=None)
            self.estimator.train(X, y)
            self.is_calibrated = True
            
            print(f"✓ EyeTrax model trained successfully with {len(features_list)} samples")
            
            # Save model using pickle
            try:
                os.makedirs(os.path.dirname(self.model_path), exist_ok=True)
                if self._save_model(self.model_path):
                    print(f"✓ Model saved to {self.model_path}")
                else:
                    print(f"Warning: Model training succeeded but save failed")
            except Exception as e:
                print(f"Warning: Could not save model: {e}")
                import traceback
                traceback.print_exc()
                # Still consider calibration successful even if save fails
            
            return True
        except Exception as e:
            print(f"ERROR: Error calibrating: {e}")
            import traceback
            traceback.print_exc()
            return False
    
    def get_calibration_status(self) -> bool:
        """Check if the EyeTrax estimator is calibrated"""
        return self.is_calibrated and self.estimator is not None and self.estimator.model is not None
    
    def save_model(self, path: Optional[str] = None) -> bool:
        """Save the calibrated EyeTrax model using pickle"""
        if not self.estimator or not self.is_calibrated:
            return False
        
        try:
            save_path = path or self.model_path
            os.makedirs(os.path.dirname(save_path), exist_ok=True)
            return self._save_model(save_path)
        except Exception as e:
            print(f"Error saving model: {e}")
            return False


# Global instance
_gaze_service: Optional[GazeTrackingService] = None

def get_gaze_service() -> GazeTrackingService:
    """Get or create the global gaze tracking service"""
    global _gaze_service
    if _gaze_service is None:
        _gaze_service = GazeTrackingService()
        success = _gaze_service.initialize()
        if not success:
            print("WARNING: Gaze tracking service initialization failed")
    return _gaze_service
