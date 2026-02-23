"""
Questionnaire router for AQ-10 and SCQ screening.
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import List, Literal

router = APIRouter()


class QuestionnaireRequest(BaseModel):
    questionnaire_type: Literal["AQ10", "SCQ"]
    answers: List[int] = Field(..., description="List of answers: 0=No, 1=Yes for AQ10; 0=No, 1=Sometimes, 2=Yes for SCQ")
    child_age: int = Field(..., ge=4, lt=18, description="Child age in years")


class QuestionnaireResponse(BaseModel):
    risk_category: Literal["Low", "Medium", "High"]
    score: float
    max_score: float
    interpretation: str
    recommendation: str


# AQ-10 Questions (Autism Spectrum Quotient - 10 item version)
AQ10_QUESTIONS = [
    "She/He often notices small sounds when others do not",
    "She/He usually concentrates more on the whole picture, rather than the small details",
    "In a social group, she/he can easily keep track of several different people's conversations",
    "She/he finds it easy to go back and forth between different activities",
    "If there is an interruption, she/he can easily return to what she/he was doing",
    "She/he knows how to tell if someone listening to him/her is getting bored",
    "When she/he reads a story, she/he finds it difficult to work out the characters' intentions",
    "She/he likes to collect information about categories of things (e.g., types of car, types of bird, types of train, types of plant, etc.)",
    "She/he finds it easy to work out what someone is thinking or feeling just by looking at their face",
    "She/he finds it difficult to work out people's intentions"
]

# AQ-10 Scoring: Items 1, 7, 8, 10 score 1 for "Yes", items 2, 3, 4, 5, 6, 9 are reversed (score 1 for "No")
AQ10_REVERSED_ITEMS = [2, 3, 4, 5, 6, 9]  # 0-indexed: [1, 2, 3, 4, 5, 8]


# SCQ Questions (Social Communication Questionnaire)
SCQ_QUESTIONS = [
    "Is she/he now able to talk using short phrases or sentences?",
    "Does she/he have any particular friends or a best friend?",
    "Does she/he usually look at you directly for the purpose of communication or interaction?",
    "Can she/he keep a two-way conversation going?",
    "Can she/he read appropriately for her/his age?",
    "Does she/he mostly use simple gestures (like waving goodbye, pushing away, or pointing)?",
    "Does she/he have an interest in how things work or in taking things apart?",
    "Does s/he have an interest in music?",
    "Does she/he have any unusually repetitive or hand or finger movements?",
    "Does she/he have any mannerisms or odd ways of moving her/his hands or fingers?",
    "Does she/he have any complex whole-body movements?",
    "Does she/he have any unusual finger movements near her/his face?",
    "Does she/he show an unusual interest in the sight, feel, sound, smell or taste of things or people?",
    "Does she/he show an interest in other children of approximately the same age?",
    "When she/he was younger, did she/he look at things from unusual angles?",
    "Does she/he have a particular interest that she/he talks about over and over again?",
    "Does she/he have any particular interests that could be called 'circumscribed' or 'unusual'?",
    "Does she/he have an interest that takes up so much time that she/he has little time for other interests?",
    "Does she/he follow your pointing with her/his gaze when you point at something nearby?",
    "Does she/he look at you to check your reaction when faced with something unfamiliar or a difficult situation?",
    "Does she/he imitate others (e.g., you)?",
    "Does she/he respond to her/his name when called?",
    "When you smile at her/him, does she/he smile back at you?",
    "Does she/he try to copy what you do?",
    "Does she/he point to indicate interest in something?"
]

# SCQ Scoring: Items 2, 5, 12, 19, 20, 21, 22, 23, 24, 25 are reversed (score 1 for "No" or "Sometimes")
# Items 9, 10, 11, 16, 17, 18 score 1 for "Yes"
# Items 1, 3, 4, 6, 7, 8, 13, 14, 15 score 1 for "No"
SCQ_REVERSED_ITEMS = [1, 4, 11, 18, 19, 20, 21, 22, 23, 24]  # 0-indexed
SCQ_YES_SCORING_ITEMS = [8, 9, 10, 15, 16, 17]  # 0-indexed


def calculate_aq10_score(answers: List[int]) -> tuple[float, str, str]:
    """
    Calculate AQ-10 score and determine risk category.
    Returns: (score, risk_category, interpretation)
    """
    if len(answers) != 10:
        raise HTTPException(status_code=400, detail="AQ-10 requires exactly 10 answers")
    
    score = 0
    for i, answer in enumerate(answers):
        if answer not in [0, 1]:
            raise HTTPException(status_code=400, detail=f"Invalid answer at position {i+1}. Must be 0 (No) or 1 (Yes)")
        
        item_num = i + 1
        if item_num in AQ10_REVERSED_ITEMS:
            # Reversed items: score 1 for "No" (answer=0)
            if answer == 0:
                score += 1
        else:
            # Normal items: score 1 for "Yes" (answer=1)
            if answer == 1:
                score += 1
    
    max_score = 10.0
    
    # AQ-10 scoring thresholds (clinical cutoff is typically 6+)
    if score >= 6:
        risk = "High"
        interpretation = f"Score of {score}/{int(max_score)} suggests elevated autism traits. This is a screening tool and not a diagnosis."
        recommendation = "Consider consulting with a healthcare professional for further evaluation."
    elif score >= 4:
        risk = "Medium"
        interpretation = f"Score of {score}/{int(max_score)} suggests some autism traits. This is a screening tool and not a diagnosis."
        recommendation = "Consider discussing concerns with a healthcare professional."
    else:
        risk = "Low"
        interpretation = f"Score of {score}/{int(max_score)} suggests fewer autism traits. This is a screening tool and not a diagnosis."
        recommendation = "Continue monitoring your child's development. If concerns arise, consult a healthcare professional."
    
    return score, risk, interpretation, recommendation


def calculate_scq_score(answers: List[int], child_age: int) -> tuple[float, str, str, str]:
    """
    Calculate SCQ score and determine risk category.
    SCQ uses 0=No, 1=Sometimes, 2=Yes
    Returns: (score, risk_category, interpretation, recommendation)
    """
    if len(answers) != 25:
        raise HTTPException(status_code=400, detail="SCQ requires exactly 25 answers")
    
    score = 0
    for i, answer in enumerate(answers):
        if answer not in [0, 1, 2]:
            raise HTTPException(status_code=400, detail=f"Invalid answer at position {i+1}. Must be 0 (No), 1 (Sometimes), or 2 (Yes)")
        
        item_num = i + 1
        if item_num in SCQ_REVERSED_ITEMS:
            # Reversed items: score 1 for "No" (answer=0)
            if answer == 0:
                score += 1
        elif item_num in SCQ_YES_SCORING_ITEMS:
            # Yes-scoring items: score 1 for "Yes" (answer=2)
            if answer == 2:
                score += 1
        else:
            # No-scoring items: score 1 for "No" (answer=0)
            if answer == 0:
                score += 1
    
    max_score = 25.0
    
    # SCQ scoring thresholds (clinical cutoff is typically 15+ for children 4-17 years)
    if score >= 15:
        risk = "High"
        interpretation = f"Score of {score}/{int(max_score)} suggests elevated social communication difficulties. This is a screening tool and not a diagnosis."
        recommendation = "Consider consulting with a healthcare professional for comprehensive evaluation."
    elif score >= 11:
        risk = "Medium"
        interpretation = f"Score of {score}/{int(max_score)} suggests some social communication concerns. This is a screening tool and not a diagnosis."
        recommendation = "Consider discussing concerns with a healthcare professional."
    else:
        risk = "Low"
        interpretation = f"Score of {score}/{int(max_score)} suggests fewer social communication concerns. This is a screening tool and not a diagnosis."
        recommendation = "Continue monitoring your child's development. If concerns arise, consult a healthcare professional."
    
    return score, risk, interpretation, recommendation


@router.get("/questions/{questionnaire_type}")
async def get_questions(questionnaire_type: Literal["AQ10", "SCQ"]):
    """Get questionnaire questions"""
    if questionnaire_type == "AQ10":
        return {
            "type": "AQ10",
            "questions": AQ10_QUESTIONS,
            "answer_format": "0=No, 1=Yes",
            "num_questions": 10
        }
    else:  # SCQ
        return {
            "type": "SCQ",
            "questions": SCQ_QUESTIONS,
            "answer_format": "0=No, 1=Sometimes, 2=Yes",
            "num_questions": 25
        }


@router.post("/submit", response_model=QuestionnaireResponse)
async def submit_questionnaire(request: QuestionnaireRequest):
    """Submit questionnaire answers and get risk assessment"""
    try:
        if request.questionnaire_type == "AQ10":
            score, risk, interpretation, recommendation = calculate_aq10_score(request.answers)
            max_score = 10.0
        else:  # SCQ
            score, risk, interpretation, recommendation = calculate_scq_score(request.answers, request.child_age)
            max_score = 25.0
        
        return QuestionnaireResponse(
            risk_category=risk,
            score=float(score),
            max_score=max_score,
            interpretation=interpretation,
            recommendation=recommendation
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing questionnaire: {str(e)}")

