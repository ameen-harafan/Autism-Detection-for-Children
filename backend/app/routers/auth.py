"""
Authentication router for Google OAuth and PIN management.
"""
from fastapi import APIRouter, HTTPException, Depends, Header
from pydantic import BaseModel, EmailStr
from google.auth.transport import requests
from google.oauth2 import id_token
from jose import jwt, JWTError
from datetime import datetime, timedelta
from typing import Optional
from app.models.user import UserModel
from app.utils.crypto import encrypt_data, decrypt_data

router = APIRouter()

# JWT secret key
JWT_SECRET = "autismdetectionchildren"
JWT_ALGORITHM = "HS256"
GOOGLE_CLIENT_ID = ""


class GoogleTokenRequest(BaseModel):
    token: str


class PinSetRequest(BaseModel):
    pin: str


class PinVerifyRequest(BaseModel):
    pin: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_email: str
    user_name: str
    pin_set: bool


class PinStatusResponse(BaseModel):
    pin_set: bool


def verify_google_token(token: str) -> dict:
    """Verify Google OAuth token and return user info."""
    try:
        idinfo = id_token.verify_oauth2_token(
            token,
            requests.Request(),
            GOOGLE_CLIENT_ID
        )
        return {
            "email": idinfo["email"],
            "name": idinfo.get("name", idinfo["email"]),
            "picture": idinfo.get("picture")
        }
    except ValueError as e:
        raise HTTPException(status_code=401, detail=f"Invalid Google token: {str(e)}")


def create_jwt_token(email: str) -> str:
    """Create JWT token for user session."""
    payload = {
        "email": email,
        "exp": datetime.utcnow() + timedelta(days=7),
        "iat": datetime.utcnow()
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


def verify_jwt_token(token: str) -> dict:
    """Verify JWT token and return payload."""
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")


def get_current_user(authorization: Optional[str] = Header(None)) -> dict:
    """Dependency to get current user from JWT token."""
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization header missing")
    
    try:
        token = authorization.replace("Bearer ", "")
        payload = verify_jwt_token(token)
        return payload
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Authentication failed: {str(e)}")


@router.post("/google", response_model=TokenResponse)
async def google_auth(request: GoogleTokenRequest):
    """Verify Google OAuth token and issue JWT session token."""
    try:
        user_info = verify_google_token(request.token)
        
        # Find or create user
        try:
            user = UserModel.find_by_email(user_info["email"])
            if not user:
                user = UserModel.create_user(user_info["email"], user_info["name"])
            
            pin_set = UserModel.is_pin_set(user_info["email"])
        except Exception as db_error:
            # Database connection error
            error_msg = str(db_error)
            if "MongoDB connection failed" in error_msg or "Database error" in error_msg:
                raise HTTPException(
                    status_code=503,
                    detail="Database service unavailable. Please check MongoDB configuration. "
                           "Set MONGODB_PASSWORD environment variable or update MONGODB_URI."
                )
            raise HTTPException(status_code=500, detail=f"Database error: {error_msg}")
        
        # Create JWT token
        access_token = create_jwt_token(user_info["email"])
        
        return TokenResponse(
            access_token=access_token,
            user_email=user_info["email"],
            user_name=user_info["name"],
            pin_set=pin_set
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Authentication error: {str(e)}")


@router.get("/pin/status", response_model=PinStatusResponse)
async def check_pin_status(current_user: dict = Depends(get_current_user)):
    """Check if PIN is set for current user."""
    email = current_user["email"]
    pin_set = UserModel.is_pin_set(email)
    return PinStatusResponse(pin_set=pin_set)


@router.post("/pin/set")
async def set_pin(
    request: PinSetRequest,
    current_user: dict = Depends(get_current_user)
):
    """Set PIN for user (one-time operation)."""
    email = current_user["email"]
    
    # Check if PIN already set
    if UserModel.is_pin_set(email):
        raise HTTPException(status_code=400, detail="PIN already set. Cannot modify PIN.")
    
    # Create sentinel: encrypt "VALID" with PIN
    sentinel = encrypt_data("VALID", request.pin)
    
    # Save sentinel to database
    UserModel.set_pin_sentinel(email, sentinel)
    
    return {"message": "PIN set successfully"}


@router.post("/pin/verify")
async def verify_pin(
    request: PinVerifyRequest,
    current_user: dict = Depends(get_current_user)
):
    """Verify PIN by decrypting sentinel."""
    email = current_user["email"]
    
    # Get sentinel from database
    sentinel = UserModel.get_pin_sentinel(email)
    if not sentinel:
        raise HTTPException(status_code=404, detail="PIN not set for this user")
    
    # Try to decrypt sentinel with provided PIN
    try:
        decrypted = decrypt_data(sentinel, request.pin)
        if decrypted == "VALID":
            return {"verified": True}
        else:
            return {"verified": False}
    except ValueError:
        return {"verified": False}


@router.post("/logout")
async def logout():
    """Logout endpoint (client-side token removal)."""
    return {"message": "Logged out successfully"}

