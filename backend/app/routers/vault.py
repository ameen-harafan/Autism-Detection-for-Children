"""
Vault router for saving and retrieving encrypted reports.
"""
from fastapi import APIRouter, HTTPException, Depends, Header
from pydantic import BaseModel
from typing import Optional
from app.routers.auth import get_current_user
from app.models.user import UserModel
from app.models.user import VaultModel
from app.utils.crypto import encrypt_data, decrypt_data

router = APIRouter()


class SaveReportRequest(BaseModel):
    encrypted_content: str
    filename: str


class ReportListItem(BaseModel):
    id: str
    filename: str
    created_at: str


class ReportResponse(BaseModel):
    id: str
    encrypted_content: str
    filename: str


@router.post("/save")
async def save_report(
    request: SaveReportRequest,
    current_user: dict = Depends(get_current_user)
):
    """Save encrypted report to vault."""
    email = current_user["email"]
    
    # Verify PIN is set
    if not UserModel.is_pin_set(email):
        raise HTTPException(
            status_code=400,
            detail="PIN must be set before saving reports"
        )
    
    # Save to vault
    report_id = VaultModel.save_report(
        email=email,
        filename=request.filename,
        encrypted_content=request.encrypted_content
    )
    
    return {"message": "Report saved successfully", "report_id": report_id}


@router.get("/list")
async def list_reports(current_user: dict = Depends(get_current_user)):
    """List all reports for current user."""
    email = current_user["email"]
    reports = VaultModel.list_user_reports(email)
    
    return {
        "reports": [
            {
                "id": str(r["_id"]),
                "filename": r["filename"],
                "created_at": r["created_at"].isoformat() + "Z"  # Append Z to indicate UTC
            }
            for r in reports
        ]
    }


@router.get("/get/{report_id}")
async def get_report(
    report_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Get a specific report by ID."""
    email = current_user["email"]
    try:
        report = VaultModel.get_report(report_id, email)
        
        if not report:
            raise HTTPException(status_code=404, detail="Report not found")
        
        return ReportResponse(
            id=report["id"],
            encrypted_content=report["encrypted_content"],
            filename=report["filename"]
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving report: {str(e)}")

