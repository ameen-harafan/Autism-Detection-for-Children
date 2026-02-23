"""
Facial analysis router using Vision Transformer model.
Processes images in-memory only, no storage.
"""
from fastapi import APIRouter, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import torch
import torch.nn as nn
from PIL import Image
import io
import numpy as np
from typing import Optional
import cv2
from app.models.vit_model import load_vit_model, predict_autism_risk

router = APIRouter()

# Global model cache (loaded once at startup)
_model = None
_device = torch.device("cuda" if torch.cuda.is_available() else "cpu")


class FacialAnalysisResponse(BaseModel):
    probability: float
    confidence: float
    risk_category: str
    risk_interpretation: str
    image_quality_check: dict


def check_image_quality(image: Image.Image) -> dict:
    """
    Check image quality: face detection, frontal pose, lighting.
    Returns quality metrics and warnings.
    """
    # Convert PIL to OpenCV format
    img_array = np.array(image)
    if img_array.shape[2] == 3:  # RGB
        img_cv = cv2.cvtColor(img_array, cv2.COLOR_RGB2BGR)
    else:
        img_cv = img_array
    
    gray = cv2.cvtColor(img_cv, cv2.COLOR_BGR2GRAY)
    
    # Face detection using Haar Cascade
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
    faces = face_cascade.detectMultiScale(gray, 1.1, 4)
    
    quality_check = {
        "face_detected": len(faces) > 0,
        "num_faces": len(faces),
        "image_resolution": {
            "width": image.width,
            "height": image.height
        },
        "lighting_quality": "adequate",
        "frontal_pose": False,
        "warnings": []
    }
    
    if len(faces) == 0:
        quality_check["warnings"].append("No face detected in image. Please ensure a clear frontal face is visible.")
        quality_check["frontal_pose"] = False
    elif len(faces) > 1:
        quality_check["warnings"].append("Multiple faces detected. Please use an image with only the child's face.")
    else:
        # Single face detected - assume frontal if face is detected well
        quality_check["frontal_pose"] = True
    
    # Check lighting quality (brightness)
    mean_brightness = np.mean(gray)
    if mean_brightness < 50:
        quality_check["lighting_quality"] = "poor"
        quality_check["warnings"].append("Image appears too dark. Please ensure adequate lighting.")
    elif mean_brightness > 200:
        quality_check["lighting_quality"] = "poor"
        quality_check["warnings"].append("Image appears too bright or overexposed.")
    else:
        quality_check["lighting_quality"] = "adequate"
    
    # Check resolution
    if image.width < 224 or image.height < 224:
        quality_check["warnings"].append("Image resolution is low. Higher resolution images may provide better results.")
    
    return quality_check


def load_model_on_startup():
    """Load the ViT model on startup"""
    global _model
    try:
        _model = load_vit_model()
        print(f"ViT model loaded successfully on device: {_device}")
    except Exception as e:
        print(f"Warning: Could not load ViT model: {e}")
        print("Facial analysis will return placeholder values. Please train and save the model first.")
        _model = None

# Load model when module is imported
load_model_on_startup()


@router.post("/analyze")
async def analyze_face(file: UploadFile = File(...)):
    """
    Analyze facial image for autism risk indicators.
    Image is processed in-memory only and immediately discarded.
    """
    try:
        # Read image into memory
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert("RGB")
        
        # Perform image quality checks
        quality_check = check_image_quality(image)
        
        # If no face detected, return error
        if not quality_check["face_detected"]:
            raise HTTPException(
                status_code=400,
                detail="No face detected in image. Please upload a clear frontal facial image."
            )
        
        # If model is not loaded, return placeholder response
        if _model is None:
            return JSONResponse(
                status_code=503,
                content={
                    "probability": 0.5,
                    "confidence": 0.5,
                    "risk_category": "Unable to analyze",
                    "risk_interpretation": "Model not available. Please ensure the model has been trained and saved.",
                    "image_quality_check": quality_check,
                    "warning": "Model not loaded. This is a placeholder response."
                }
            )
        
        # Predict autism risk
        probability, confidence = predict_autism_risk(_model, image, _device)
        
        # Determine risk category based on probability
        # Higher probability indicates higher risk
        if probability >= 0.7:
            risk_category = "High"
            risk_interpretation = f"Facial analysis suggests elevated risk indicators (probability: {probability:.2%}). This is a supporting signal only and not a diagnostic tool."
        elif probability >= 0.5:
            risk_category = "Medium"
            risk_interpretation = f"Facial analysis suggests moderate risk indicators (probability: {probability:.2%}). This is a supporting signal only and not a diagnostic tool."
        else:
            risk_category = "Low"
            risk_interpretation = f"Facial analysis suggests lower risk indicators (probability: {probability:.2%}). This is a supporting signal only and not a diagnostic tool."
        
        # Clear image from memory explicitly
        del image
        del contents
        
        return FacialAnalysisResponse(
            probability=float(probability),
            confidence=float(confidence),
            risk_category=risk_category,
            risk_interpretation=risk_interpretation,
            image_quality_check=quality_check
        )
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing image: {str(e)}")


@router.get("/health")
async def health_check():
    """Check if facial analysis model is loaded"""
    return {
        "model_loaded": _model is not None,
        "device": str(_device)
    }

