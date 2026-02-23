"""
Risk fusion router for combining questionnaire, facial, and gaze analysis results.
Uses weighted fusion with questionnaire having the highest weight.
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Literal, Optional

router = APIRouter()

# Weight configuration: Questionnaire > Gaze > Facial
QUESTIONNAIRE_WEIGHT = 0.6
GAZE_WEIGHT = 0.3
FACIAL_WEIGHT = 0.1


class QuestionnaireResult(BaseModel):
    risk_category: Literal["Low", "Medium", "High"]
    score: float


class FacialResult(BaseModel):
    risk_category: Literal["Low", "Medium", "High"]
    probability: float


class GazeResult(BaseModel):
    risk_category: Literal["Low", "Medium", "High"]
    spi: float


class RiskFusionRequest(BaseModel):
    questionnaire: QuestionnaireResult
    facial: Optional[FacialResult] = None
    gaze: Optional[GazeResult] = None


class RiskFusionResponse(BaseModel):
    final_risk_category: Literal["Low", "Medium", "High"]
    confidence_score: float
    interpretation: str
    recommendation: str
    component_scores: dict


def risk_to_numeric(risk: str) -> float:
    """Convert risk category to numeric value for calculation"""
    mapping = {"Low": 1.0, "Medium": 2.0, "High": 3.0}
    return mapping.get(risk, 1.0)


def numeric_to_risk(value: float) -> str:
    """Convert numeric value back to risk category"""
    if value >= 2.5:
        return "High"
    elif value >= 1.5:
        return "Medium"
    else:
        return "Low"


@router.post("/fuse", response_model=RiskFusionResponse)
async def fuse_risks(request: RiskFusionRequest):
    """
    Fuse multiple risk assessments using weighted combination.
    Questionnaire has highest weight (0.6), followed by Gaze (0.3), then Facial (0.1).
    """
    # Normalize weights based on available inputs
    available_weights = {"questionnaire": QUESTIONNAIRE_WEIGHT}
    total_weight = QUESTIONNAIRE_WEIGHT
    
    if request.gaze:
        available_weights["gaze"] = GAZE_WEIGHT
        total_weight += GAZE_WEIGHT
    
    if request.facial:
        available_weights["facial"] = FACIAL_WEIGHT
        total_weight += FACIAL_WEIGHT
    
    # Normalize weights to sum to 1.0
    normalized_weights = {k: v / total_weight for k, v in available_weights.items()}
    
    # Calculate weighted risk score
    questionnaire_score = risk_to_numeric(request.questionnaire.risk_category)
    weighted_score = questionnaire_score * normalized_weights["questionnaire"]
    
    component_scores = {
        "questionnaire": {
            "risk": request.questionnaire.risk_category,
            "weight": normalized_weights["questionnaire"]
        }
    }
    
    if request.gaze:
        gaze_score = risk_to_numeric(request.gaze.risk_category)
        weighted_score += gaze_score * normalized_weights["gaze"]
        component_scores["gaze"] = {
            "risk": request.gaze.risk_category,
            "weight": normalized_weights["gaze"],
            "spi": request.gaze.spi
        }
    
    if request.facial:
        facial_score = risk_to_numeric(request.facial.risk_category)
        weighted_score += facial_score * normalized_weights["facial"]
        component_scores["facial"] = {
            "risk": request.facial.risk_category,
            "weight": normalized_weights["facial"],
            "probability": request.facial.probability
        }
    
    # Determine final risk category
    final_risk = numeric_to_risk(weighted_score)
    
    # Calculate confidence score (inverse of distance from category boundaries)
    if final_risk == "High":
        confidence = min(1.0, (weighted_score - 2.5) / 0.5) if weighted_score >= 2.5 else 0.5
    elif final_risk == "Medium":
        confidence = 1.0 - abs(weighted_score - 2.0) / 0.5
        confidence = max(0.5, min(1.0, confidence))
    else:  # Low
        confidence = min(1.0, (1.5 - weighted_score) / 0.5) if weighted_score <= 1.5 else 0.5
    
    # Generate interpretation and recommendation
    if final_risk == "High":
        interpretation = (
            "Combined screening results indicate elevated risk. "
            "This screening tool is not a diagnostic tool. Multiple assessment methods suggest "
            "that further professional evaluation may be beneficial."
        )
        recommendation = (
            "We strongly recommend consulting with a qualified healthcare professional, "
            "developmental pediatrician, or autism specialist for a comprehensive evaluation. "
            "Early intervention can be very beneficial."
        )
    elif final_risk == "Medium":
        interpretation = (
            "Combined screening results indicate moderate risk. "
            "Some assessment methods suggest possible concerns. This screening tool is not a diagnostic tool."
        )
        recommendation = (
            "Consider discussing these findings with your child's pediatrician or a healthcare professional. "
            "They can help determine if further evaluation is appropriate."
        )
    else:  # Low
        interpretation = (
            "Combined screening results indicate lower risk. "
            "This screening tool is not a diagnostic tool. Continue monitoring your child's development."
        )
        recommendation = (
            "Continue to observe and support your child's development. If new concerns arise "
            "or you notice changes in behavior, consult with a healthcare professional."
        )
    
    return RiskFusionResponse(
        final_risk_category=final_risk,
        confidence_score=float(confidence),
        interpretation=interpretation,
        recommendation=recommendation,
        component_scores=component_scores
    )

