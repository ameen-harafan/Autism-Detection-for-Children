"""
Main FastAPI application for autism screening backend.
Stateless API with no data persistence.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import questionnaire, facial_analysis, gaze_analysis, risk_fusion, auth, vault
from app.services.gaze_tracker import get_gaze_service
from app.database import get_database, close_database

app = FastAPI(
    title="Autism Screening API",
    description="Privacy-first, stateless autism screening API for children (4-18 years)",
    version="1.0.0"
)

@app.on_event("startup")
async def startup_event():
    """Initialize services on startup"""
    print("Initializing services...")
    
    # Initialize database connection
    try:
        db = get_database()
        print("✓ MongoDB connection ready")
    except Exception as e:
        print(f"⚠ Warning: MongoDB connection failed: {e}")
    
    # Initialize gaze tracking service
    try:
        gaze_service = get_gaze_service()
        print("✓ Gaze tracking service ready")
    except Exception as e:
        print(f"⚠ Warning: Gaze tracking service initialization failed: {e}")


@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup on shutdown"""
    close_database()

# CORS middleware for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(questionnaire.router, prefix="/api/questionnaire", tags=["questionnaire"])
app.include_router(facial_analysis.router, prefix="/api/facial", tags=["facial"])
app.include_router(gaze_analysis.router, prefix="/api/gaze", tags=["gaze"])
app.include_router(risk_fusion.router, prefix="/api/risk", tags=["risk"])
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(vault.router, prefix="/api/vault", tags=["vault"])


@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "message": "Autism Screening API - Privacy-first, stateless service",
        "version": "1.0.0"
    }


@app.get("/api/health")
async def health():
    """Health check endpoint"""
    return {"status": "healthy"}

