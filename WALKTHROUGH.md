# 🎓 Complete Code Walkthrough for Freshers

**Welcome to the Autism Screening Application!**

This guide explains EVERY file in simple terms. If you're new to programming or this project, start here.

---

# Table of Contents

1. [What This App Does (Simple Explanation)](#1-what-this-app-does)
2. [Libraries Used (Complete List)](#2-libraries-used)
3. [Folder Structure](#3-folder-structure)
4. [Backend Code Explained](#4-backend-code-explained)
5. [Frontend Code Explained](#5-frontend-code-explained)
6. [How Data Flows](#6-how-data-flows)
7. [Glossary of Terms](#7-glossary-of-terms)


---

# 1. What This App Does

Imagine you're a doctor screening a child for autism. You would:
1. Ask parents questions about the child's behavior
2. Look at the child's facial expressions
3. Watch where the child's eyes look (do they prefer faces or objects?)

This app does the SAME THING digitally:
- **Questionnaire**: 10-25 questions about behavior
- **Facial Analysis**: AI looks at a photo
- **Gaze Tracking**: Tracks where eyes look during a video

Then it gives a risk score: **Low**, **Medium**, or **High**.

> ⚠️ This is a SCREENING tool, not a diagnosis!

---

# 2. Libraries Used (Complete List)

This section explains EVERY library/package used in the project and what each one does.

## Backend Libraries (Python)

These are listed in `backend/requirements.txt`:

### Web Framework & Server

| Library | Version | What It Does | Why We Need It |
|---------|---------|--------------|----------------|
| **fastapi** | 0.104.1 | Web framework for building APIs | The main framework that handles all HTTP requests. It's like Express.js for Python but faster. Creates endpoints like `/api/questionnaire/submit`. |
| **uvicorn** | 0.24.0 | ASGI web server | The "engine" that runs FastAPI. When you run `python run.py`, uvicorn starts and listens for requests. Think of it as the waiter that receives orders. |
| **python-multipart** | 0.0.6 | Parse form data | Needed to handle file uploads (like photos). When user uploads an image, this parses the multipart form data. |
| **aiofiles** | 23.2.1 | Async file operations | Allows reading/writing files without blocking. Used for handling uploaded images efficiently. |

### Machine Learning & AI

| Library | Version | What It Does | Why We Need It |
|---------|---------|--------------|----------------|
| **torch** | 2.1.0 | PyTorch deep learning framework | The brain behind AI models. Used to load and run the Vision Transformer (ViT) for facial analysis. Like TensorFlow but more Pythonic. |
| **torchvision** | 0.16.0 | Computer vision utilities for PyTorch | Image transformations (resize, normalize) and pre-trained models. Prepares images before feeding to AI. |
| **transformers** | 4.35.0 | Hugging Face's transformer library | Loads Google's pre-trained ViT model. Instead of training from scratch (months), we fine-tune their model (hours). |
| **numpy** | 1.24.3 | Numerical computing | Handles arrays and math operations. Every ML library depends on it. Think of it as Excel for Python. |

### Image & Video Processing

| Library | Version | What It Does | Why We Need It |
|---------|---------|--------------|----------------|
| **opencv-python** | 4.8.1.78 | Computer vision library | Face detection using Haar Cascades, image quality checks, color conversions. Like Photoshop for code. |
| **pillow** | 10.1.0 | Image handling library | Opens, resizes, and converts image files (JPEG, PNG). The Swiss army knife for image files. |
| **face-recognition** | 1.3.0 | Face detection/recognition | Advanced face detection using deep learning. More accurate than OpenCV for complex cases. |
| **mediapipe** | 0.10.8 | Google's ML solutions | Detects facial landmarks (468 points on face). Used by gaze tracking to find eye positions. |
| **eyetrax** | 0.2.2 | Eye gaze tracking | Specialized library to predict where someone is looking on screen. Calibrates and predicts gaze coordinates. |

### Database & Security

| Library | Version | What It Does | Why We Need It |
|---------|---------|--------------|----------------|
| **pymongo** | 4.6.0 | MongoDB driver | Connects Python to MongoDB database. Saves/retrieves user data and encrypted reports. |
| **cryptography** | 41.0.7 | Encryption library | AES-256 encryption for protecting saved reports. Uses PIN to derive encryption key. |
| **python-jose** | 3.3.0 | JWT handling | Creates and verifies JSON Web Tokens for user sessions. After Google login, we issue a JWT. |
| **google-auth** | 2.25.2 | Google authentication | Verifies Google OAuth tokens. When user clicks "Sign in with Google", this validates the token. |
| **passlib** | 1.7.4 | Password hashing | Secure password hashing with bcrypt. Could be used for additional auth methods. |

### Data Validation

| Library | Version | What It Does | Why We Need It |
|---------|---------|--------------|----------------|
| **pydantic** | 2.5.0 | Data validation | Ensures incoming data is correct type. If someone sends "hello" instead of age `10`, Pydantic catches it and returns error. |

---

## Frontend Libraries (JavaScript/TypeScript)

These are listed in `frontend/package.json`:

### Core Framework

| Library | Version | What It Does | Why We Need It |
|---------|---------|--------------|----------------|
| **react** | 18.2.0 | UI framework | The main framework for building the user interface. Everything you see is a React component. |
| **react-dom** | 18.2.0 | React DOM rendering | Renders React components to the browser. The bridge between React and the actual webpage. |
| **react-router-dom** | 6.20.0 | Navigation/Routing | Handles page navigation without full page reload. Maps URLs like `/consent` to components like `ConsentPage`. |
| **typescript** | 5.3.3 | Type-safe JavaScript | JavaScript with types. Catches bugs like `"5" + 5 = "55"` before runtime. Makes code more reliable. |

### HTTP & API

| Library | Version | What It Does | Why We Need It |
|---------|---------|--------------|----------------|
| **axios** | 1.6.2 | HTTP client | Sends requests to backend API. Better than native `fetch()` with automatic JSON parsing and error handling. |

### UI & Visualization

| Library | Version | What It Does | Why We Need It |
|---------|---------|--------------|----------------|
| **recharts** | 2.10.3 | Charts library | Draws bar charts, pie charts in the report page. Shows visual representation of risk scores. |
| **html2canvas** | 1.4.1 | Screenshot capture | Takes "screenshot" of HTML elements. Used to capture the report for PDF generation. |
| **jspdf** | 2.5.1 | PDF generation | Creates PDF documents in the browser. Combines with html2canvas to generate downloadable reports. |

### Authentication & Security

| Library | Version | What It Does | Why We Need It |
|---------|---------|--------------|----------------|
| **@react-oauth/google** | 0.12.1 | Google Sign-In | Provides the "Sign in with Google" button. Handles entire OAuth flow automatically. |
| **crypto-js** | 4.2.0 | Browser encryption | AES encryption in the browser. Encrypts reports before sending to server. |

### Development Tools

| Library | Version | What It Does | Why We Need It |
|---------|---------|--------------|----------------|
| **vite** | 5.0.8 | Build tool & dev server | Makes development fast with instant hot reload. When you save a file, changes appear immediately. |
| **@vitejs/plugin-react** | 4.2.1 | Vite React plugin | Enables React support in Vite. Handles JSX transformation. |
| **@types/react** | 18.2.42 | TypeScript types for React | Type definitions so TypeScript understands React. No runtime code, just for IDE intelligence. |
| **@types/react-dom** | 18.2.17 | TypeScript types for ReactDOM | Type definitions for react-dom. |
| **@types/crypto-js** | 4.2.2 | TypeScript types for crypto-js | Type definitions for crypto-js. |
| **@types/node** | 20.10.5 | TypeScript types for Node.js | Type definitions for Node.js APIs used by Vite. |

---

## How Libraries Work Together (All Features)

### Flow 1: User Authentication (Google Sign-In)

```
USER clicks "Sign in with Google"
        │
        ▼
FRONTEND: @react-oauth/google shows Google popup
        │ User selects Google account
        ▼
Google returns credential token to frontend
        │
        ▼
FRONTEND: axios sends token to /api/auth/google
        │
        ▼
BACKEND: google-auth verifies the token with Google servers
        │
        ▼
pymongo checks/creates user in MongoDB
        │
        ▼
python-jose creates JWT session token
        │
        ▼
FRONTEND: stores token in localStorage
        │
        ▼
USER is now logged in ✓
```

### Flow 2: Questionnaire Submission

```
STEP A: User enters age on AgeCheckPage (BEFORE questionnaire)
        │ User enters: child_age = 7
        │ Frontend stores this in React state
        │ Navigates to /questionnaire
        ▼
STEP B: User selects questionnaire type on QuestionnairePage
        │ Options: AQ-10 (10 questions) or SCQ (25 questions)
        │ User clicks: AQ-10
        ▼
STEP C: User answers 10 questions and clicks "Submit"
        │
        ▼
FRONTEND: react collects answers [1,0,1,0,0,1,1,0,0,1]
        │ Combines with previously stored child_age
        ▼
axios.post('/api/questionnaire/submit', {
    questionnaire_type: 'AQ10',
    answers: [1,0,1,0,0,1,1,0,0,1],
    child_age: 7  ← from previous page
})
        │
        ▼
BACKEND: fastapi + uvicorn receives request
        │
        ▼
pydantic validates data format:
        │ - Is child_age between 4-17? ✓
        │ - Are all answers 0 or 1? ✓
        │ - Are there exactly 10 answers? ✓
        ▼
questionnaire.py calculates score using scoring algorithm
        │ (Some items are "reversed" - No gives a point)
        ▼
Determines risk: 0-3=Low, 4-5=Medium, 6-10=High
        │
        ▼
fastapi returns JSON: {risk_category, score, interpretation}
        │
        ▼
FRONTEND: react updates state, shows result to user
        │
        ▼
USER sees: "Medium Risk - Score 5/10"
```

### Flow 3: Facial Analysis (AI Photo Analysis)

```
USER uploads photo of child's face
        │
        ▼
FRONTEND: react creates FormData with image
        │
        ▼
axios.post('/api/facial/analyze', formData)
        │
        ▼
BACKEND: python-multipart parses multipart form data
        │
        ▼
pillow opens image in memory (never saved to disk!)
        │
        ▼
opencv-python runs Haar Cascade face detection
        │ Checks: face found? brightness ok? resolution ok?
        ▼
If no face → return error to user
        │
        ▼
torch loads ViT model to GPU/CPU
        │
        ▼
torchvision transforms image: resize to 224x224, normalize
        │
        ▼
transformers runs pre-trained Vision Transformer
        │ Model outputs probability 0.0 to 1.0
        ▼
Map probability to risk: <0.5=Low, 0.5-0.7=Medium, >0.7=High
        │
        ▼
del image (delete from memory for privacy)
        │
        ▼
pydantic validates response format
        │
        ▼
FRONTEND: react shows result + recharts draws chart
        │
        ▼
USER sees: "Low Risk - Probability 32%"
```

### Flow 4: Gaze Tracking (Eye Movement Analysis)

```
USER clicks "Start Gaze Tracking"
        │
        ▼
FRONTEND: Browser asks for webcam permission
        │
        ▼
GazeTracker.tsx starts 9-point calibration
        │ Shows dots on screen, user looks at each dot
        │ Captures webcam frames for each point
        ▼
axios.post('/api/gaze/calibrate', calibration_frames)
        │
        ▼
BACKEND: eyetrax.GazeEstimator processes frames
        │ mediapipe detects facial landmarks (468 points)
        │ Extracts eye features for each calibration point
        ▼
eyetrax.train() builds personalized gaze model
        │
        ▼
pickle saves model to gaze_model.pkl
        │
        ▼
FRONTEND: Shows split-screen video
        │ Left side: social content (people)
        │ Right side: geometric content (shapes)
        ▼
During video: Every 100ms, capture webcam frame
        │
        ▼
axios.post('/api/gaze/predict', {frame: base64_image})
        │
        ▼
BACKEND: eyetrax.predict() returns (x, y) coordinates
        │
        ▼
FRONTEND: Tracks if gaze is LEFT (social) or RIGHT (geometric)
        │ Records: social_frames=540, geometric_frames=60
        ▼
After video: axios.post('/api/gaze/analyze', gaze_data)
        │
        ▼
BACKEND: Calculates SPI = (social - geometric) / total
        │ SPI = (540-60)/600 = 0.8
        │
        │ SPI RISK THRESHOLDS:
        │ ┌────────────────┬──────────┬─────────────────────────────┐
        │ │ SPI Value      │ Risk     │ Meaning                     │
        │ ├────────────────┼──────────┼─────────────────────────────┤
        │ │ >= 0.2         │ Low      │ Strong social preference    │
        │ │ 0.0 to 0.2     │ Medium   │ Mixed preference            │
        │ │ < 0.0          │ High     │ Prefers geometric/shapes    │
        │ └────────────────┴──────────┴─────────────────────────────┘
        │
        │ 0.8 >= 0.2 → "Low Risk"
        ▼
USER sees: "Low Risk - SPI 0.8 (Strong social preference)"
```

### Flow 5: Risk Fusion (Combining All Scores)

```
USER has completed all assessments
        │
        ▼
FRONTEND: Collects all results
        │ questionnaire: {risk: "Medium", score: 5}
        │ facial: {risk: "Low", probability: 0.32}
        │ gaze: {risk: "Low", spi: 0.8}
        ▼
axios.post('/api/risk/fuse', all_results)
        │
        ▼
BACKEND: risk_fusion.py applies weighted average
        │
        │ STEP 1: Convert risk categories to numbers
        │ ┌──────────────┬─────────────────┐
        │ │ Risk Category │ Numeric Value  │
        │ ├──────────────┼─────────────────┤
        │ │ Low          │ 1.0            │
        │ │ Medium       │ 2.0            │
        │ │ High         │ 3.0            │
        │ └──────────────┴─────────────────┘
        │
        │ STEP 2: Apply weights
        │ ┌───────────────┬────────┬─────────────┐
        │ │ Component     │ Weight │ Why         │
        │ ├───────────────┼────────┼─────────────┤
        │ │ Questionnaire │ 60%    │ Most reliable (research-validated) │
        │ │ Gaze tracking │ 30%    │ Behavioral signal │
        │ │ Facial        │ 10%    │ Supporting signal only │
        │ └───────────────┴────────┴─────────────┘
        │
        │ STEP 3: Calculate weighted average
        │   Questionnaire: Medium = 2.0 × 0.6 = 1.2
        │   Gaze:          Low    = 1.0 × 0.3 = 0.3
        │   Facial:        Low    = 1.0 × 0.1 = 0.1
        │   ─────────────────────────────────────
        │   Total:                         = 1.6
        │
        │ STEP 4: Convert back to risk category
        │ ┌─────────────────────┬──────────────┐
        │ │ Weighted Score      │ Final Risk   │
        │ ├─────────────────────┼──────────────┤
        │ │ >= 2.5              │ High         │
        │ │ >= 1.5 and < 2.5    │ Medium       │
        │ │ < 1.5               │ Low          │
        │ └─────────────────────┴──────────────┘
        │
        │ 1.6 >= 1.5 → "Medium"
        ▼
Returns: {final_risk: "Medium", confidence: 0.75}
        │
        ▼
FRONTEND: ReportPage.tsx displays final result
        │
        ▼
USER sees comprehensive report with all scores
```

### Flow 6: Saving Report (Encrypted Storage)

```
USER clicks "Save Report to Vault"
        │
        ▼
Check: Is PIN already verified this session?
        │
        ├── YES → Skip to encryption (PIN stored in React state)
        │
        └── NO → PinVerifyModal asks for 4-digit PIN
                  │
                  ▼
            axios.post('/api/auth/pin/verify', {pin})
                  │
                  ▼
            BACKEND: Verifies PIN against stored sentinel
                  │
                  ▼
            If correct → PIN stored in PinContext (React state)
                       → Persists until logout or page refresh
        │
        ▼
FRONTEND: crypto-js encrypts report using PIN (from memory)
        │ AES-256 encryption (same as banks use)
        ▼
axios.post('/api/vault/save', {encrypted_content, filename})
        │
        ▼
BACKEND: pymongo stores in MongoDB using GridFS
        │ (GridFS handles large files)
        ▼
Only encrypted blob is stored - server never sees content

═══════════════════════════════════════════════════════════

PIN PERSISTENCE RULES:
┌────────────────────────────────┬────────────────────────────┐
│ Event                          │ PIN Status                 │
├────────────────────────────────┼────────────────────────────┤
│ User enters correct PIN        │ Stored in React state      │
│ User saves another report      │ No need to re-enter PIN    │
│ User views history             │ No need to re-enter PIN    │
│ User refreshes page (F5)       │ PIN cleared - must re-enter│
│ User logs out                  │ PIN cleared - must re-enter│
│ User closes browser            │ PIN cleared - must re-enter│
└────────────────────────────────┴────────────────────────────┘

═══════════════════════════════════════════════════════════

LATER: User wants to view saved report
        │
        ▼
axios.get('/api/vault/get/{report_id}')
        │
        ▼
BACKEND: Returns encrypted blob
        │
        ▼
FRONTEND: Uses PIN from memory (if still in session)
        │ Or prompts for PIN if session was refreshed
        ▼
crypto-js decrypts report using PIN
        │
        ▼
USER sees their saved report
```

### Flow 7: PDF Report Generation (Browser-Only)

```
USER clicks "Download PDF"
        │
        ▼
FRONTEND: ReportPage.tsx prepares report content
        │
        ▼
html2canvas takes "screenshot" of HTML report
        │ Converts DOM elements to canvas image
        ▼
jspdf creates new PDF document
        │
        ▼
Adds: title, date, child age, all risk scores
        │ Adds: charts (from recharts as images)
        │ Adds: recommendations, disclaimers
        ▼
jspdf.save('autism_screening_report.pdf')
        │
        ▼
Browser downloads PDF file
        │
        ▼
NOTE: This happens 100% in browser!
      Server never sees the PDF content.
```

---

## Complete User Journey (All Features Combined)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         COMPLETE USER JOURNEY                                │
└─────────────────────────────────────────────────────────────────────────────┘

STEP 1: Homepage
    │   User lands on http://localhost:3000
    │   Sees: "Early Autism Screening Tool"
    ▼
STEP 2: Consent Page
    │   User reads privacy policy & disclaimer
    │   Checks "I consent" checkbox
    │   Clicks "Proceed to Screening"
    ▼
STEP 3: Age Check
    │   User enters child's age (4-17 years)
    │   Selects questionnaire type: AQ-10 or SCQ
    ▼
STEP 4: Questionnaire
    │   User answers 10 (AQ-10) or 25 (SCQ) questions
    │   Clicks "Submit"
    │   RESULT: Low/Medium/High risk
    │
    │   If Low Risk → popup: "Continue or View Report?"
    │   If Medium/High → automatically continues
    ▼
STEP 5: Facial Analysis (Optional)
    │   User uploads clear frontal photo of child
    │   AI analyzes facial features
    │   RESULT: Low/Medium/High risk + probability
    ▼
STEP 6: Gaze Tracking (Optional)
    │   9-point calibration (user looks at dots)
    │   Split-screen video plays
    │   Eye movements tracked in real-time
    │   RESULT: Low/Medium/High risk + SPI score
    ▼
STEP 7: Report Page
    │   Shows ALL results combined:
    │   ├── Questionnaire score
    │   ├── Facial analysis probability
    │   ├── Gaze tracking SPI
    │   └── FINAL RISK (weighted average)
    │
    │   Options:
    │   ├── Download PDF
    │   ├── Save to Vault (requires PIN)
    │   └── Start New Screening
    ▼
STEP 8: History (If Logged In)
        User can view past saved reports
        (Reports are encrypted with PIN)
```

---

# 3. Folder Structure


```
Autism Detection Project Final/
│
├── backend/                 ← PYTHON CODE (Server/API)
│   ├── app/
│   │   ├── main.py          ← Entry point - starts the server
│   │   ├── database.py      ← Connects to MongoDB
│   │   ├── routers/         ← API endpoints (like /api/questionnaire)
│   │   │   ├── questionnaire.py
│   │   │   ├── facial_analysis.py
│   │   │   ├── gaze_analysis.py
│   │   │   ├── risk_fusion.py
│   │   │   ├── auth.py
│   │   │   └── vault.py
│   │   ├── models/          ← Data models & AI
│   │   │   ├── vit_model.py
│   │   │   └── user.py
│   │   ├── services/        ← Business logic
│   │   │   └── gaze_tracker.py
│   │   └── utils/           ← Helper functions
│   │       └── crypto.py
│   ├── run.py               ← Command to start server
│   ├── train_model.py       ← Train the AI model
│   └── requirements.txt     ← Python packages needed
│
├── frontend/                ← REACT CODE (Website UI)
│   ├── src/
│   │   ├── App.tsx          ← Main component + routing
│   │   ├── App.css          ← All the styles
│   │   ├── types.ts         ← TypeScript data shapes
│   │   ├── api/
│   │   │   └── client.ts    ← Talks to backend
│   │   ├── pages/           ← Each screen
│   │   │   ├── Homepage.tsx
│   │   │   ├── ConsentPage.tsx
│   │   │   ├── AgeCheckPage.tsx
│   │   │   ├── QuestionnairePage.tsx
│   │   │   ├── FacialAnalysisPage.tsx
│   │   │   ├── GazeAnalysisPage.tsx
│   │   │   ├── ReportPage.tsx
│   │   │   └── HistoryPage.tsx
│   │   ├── components/      ← Reusable UI pieces
│   │   │   ├── GazeTracker.tsx
│   │   │   ├── PinGate.tsx
│   │   │   ├── PinSetupModal.tsx
│   │   │   └── ...
│   │   └── contexts/        ← Global state management
│   │       ├── AuthContext.tsx
│   │       └── PinContext.tsx
│   └── package.json         ← Node.js packages needed
│
├── dataset/                 ← Training data for AI
└── stimuli/                 ← Videos for gaze tracking
```

---

# 4. Backend Code Explained

## 4.1 run.py - Starting the Server (Complete - 15 lines)

This is the entry point to start the FastAPI backend server using Uvicorn.

```python
"""
Run the FastAPI server

This is the entry point file. When you run `python run.py`, it starts
the web server that listens for HTTP requests.
"""
import uvicorn  # Uvicorn is an ASGI server - the "engine" that runs FastAPI

if __name__ == "__main__":
    # This block only runs when you execute `python run.py` directly
    # It won't run if this file is imported as a module
    
    uvicorn.run(
        "app.main:app",      # Path to the FastAPI app: "module.path:variable_name"
                             # This loads the `app` variable from app/main.py
        host="0.0.0.0",      # Listen on all network interfaces
                             # 0.0.0.0 means accept connections from any IP
                             # Use "127.0.0.1" to only allow local connections
        port=8000,           # Port number the server listens on
                             # Frontend will send requests to http://localhost:8000
        reload=True,         # Hot reload: auto-restart when code changes
                             # Set to False in production for better performance
        log_level="info"     # Logging verbosity: "debug", "info", "warning", "error"
                             # "info" shows request logs without too much noise
    )

```

**Key Concepts Explained:**

| Concept | Explanation |
|---------|-------------|
| **`if __name__ == "__main__"`** | Python idiom that runs code only when file is executed directly, not when imported |
| **Uvicorn** | ASGI server that runs FastAPI apps. Like nginx/Apache but for Python async apps |
| **ASGI** | Asynchronous Server Gateway Interface - modern Python web server protocol |
| **`0.0.0.0`** | Binds to all network interfaces, allowing external connections |
| **`reload=True`** | Development feature - auto-restarts server when code changes |

**How to start the server:**
```bash
cd backend
python run.py
# Server starts at http://localhost:8000
```

---

## 4.2 app/main.py - The Heart of the Backend (Complete - 76 lines)

This is the main FastAPI application file that configures the server, registers routes, and handles lifecycle events.

```python
"""
Main FastAPI application for autism screening backend.
Stateless API with no data persistence.

This file is the "control center" that:
1. Creates the FastAPI application instance
2. Configures middleware (CORS, etc.)
3. Registers all route handlers (routers)
4. Defines startup/shutdown lifecycle events
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Import all routers - each handles a specific feature
from app.routers import questionnaire, facial_analysis, gaze_analysis, risk_fusion, auth, vault
# Import services for initialization
from app.services.gaze_tracker import get_gaze_service
from app.database import get_database, close_database


# =============================================================================
# CREATE THE FASTAPI APPLICATION
# =============================================================================

app = FastAPI(
    title="Autism Screening API",
    description="Privacy-first, stateless autism screening API for children (4-18 years)",
    version="1.0.0"
)


# =============================================================================
# LIFECYCLE EVENTS - Run code at startup and shutdown
# =============================================================================

@app.on_event("startup")
async def startup_event():
    """
    Initialize services when server starts.
    
    This runs ONCE when you start the server with `python run.py`.
    Used to:
    - Establish database connections
    - Load ML models into memory
    - Initialize any service that's expensive to create per-request
    """
    print("Initializing services...")
    
    # Initialize database connection
    try:
        db = get_database()
        print("✓ MongoDB connection ready")
    except Exception as e:
        print(f"⚠ Warning: MongoDB connection failed: {e}")
    
    # Initialize gaze tracking service (loads EyeTrax model)
    try:
        gaze_service = get_gaze_service()
        print("✓ Gaze tracking service ready")
    except Exception as e:
        print(f"⚠ Warning: Gaze tracking service initialization failed: {e}")


@app.on_event("shutdown")
async def shutdown_event():
    """
    Cleanup when server stops.
    
    This runs when you press Ctrl+C or the server shuts down.
    Important for:
    - Closing database connections gracefully
    - Releasing file handles
    - Saving any cached data
    """
    close_database()


# =============================================================================
# MIDDLEWARE CONFIGURATION
# =============================================================================

# CORS (Cross-Origin Resource Sharing) middleware
# This allows the frontend (on localhost:3000) to make requests to the backend (localhost:8000)
# Without CORS, browsers block cross-origin requests for security
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://localhost:3000"],  # Allowed frontend URLs
    allow_credentials=True,        # Allow cookies and auth headers
    allow_methods=["*"],           # Allow all HTTP methods (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],           # Allow all headers (including Authorization)
)


# =============================================================================
# ROUTER REGISTRATION - Map URLs to handlers
# =============================================================================

# Each router handles a group of related endpoints
# prefix="/api/questionnaire" means all endpoints in that router start with /api/questionnaire

app.include_router(questionnaire.router, prefix="/api/questionnaire", tags=["questionnaire"])
# Endpoints: GET /api/questionnaire/questions/{type}, POST /api/questionnaire/submit

app.include_router(facial_analysis.router, prefix="/api/facial", tags=["facial"])
# Endpoints: POST /api/facial/analyze, GET /api/facial/health

app.include_router(gaze_analysis.router, prefix="/api/gaze", tags=["gaze"])
# Endpoints: GET /api/gaze/calibration-points, POST /api/gaze/calibrate, POST /api/gaze/analyze

app.include_router(risk_fusion.router, prefix="/api/risk", tags=["risk"])
# Endpoints: POST /api/risk/fuse

app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
# Endpoints: POST /api/auth/google, GET /api/auth/pin/status, POST /api/auth/pin/set

app.include_router(vault.router, prefix="/api/vault", tags=["vault"])
# Endpoints: POST /api/vault/save, GET /api/vault/list, GET /api/vault/get/{id}


# =============================================================================
# ROOT ENDPOINTS - Health checks
# =============================================================================

@app.get("/")
async def root():
    """
    Root health check endpoint.
    
    Used by monitoring systems to verify the server is running.
    Returns basic status and version information.
    """
    return {
        "status": "healthy",
        "message": "Autism Screening API - Privacy-first, stateless service",
        "version": "1.0.0"
    }


@app.get("/api/health")
async def health():
    """
    Simple health check endpoint.
    
    Returns just the status for quick health monitoring.
    """
    return {"status": "healthy"}

```

**Key Concepts Explained:**

| Concept | Explanation |
|---------|-------------|
| **FastAPI** | Modern Python web framework with automatic API documentation and type validation |
| **Router** | Groups related endpoints together - like controllers in MVC |
| **CORS** | Security mechanism that controls which websites can access the API |
| **@app.on_event** | Decorator for lifecycle hooks (startup/shutdown) |
| **Middleware** | Code that runs on every request before reaching route handlers |
| **tags** | Categories for API documentation at `/docs` |

**CORS Explained:**
```
Without CORS:
Browser blocks: localhost:3000 → localhost:8000 ❌

With CORS configured:
Browser allows: localhost:3000 → localhost:8000 ✓
```

---

## 4.3 app/database.py - MongoDB Connection (Complete - 78 lines)

This file manages the MongoDB database connection with proper error handling and connection pooling.

```python
"""
MongoDB database connection and configuration.

This module provides:
1. Connection string configuration (from environment or default)
2. Connection establishment with timeouts
3. Connection pooling (reuse connections)
4. Graceful error handling with helpful messages
"""
from pymongo import MongoClient
from pymongo.database import Database
from pymongo.errors import ConnectionFailure, OperationFailure, ConfigurationError
import os


# =============================================================================
# CONFIGURATION
# =============================================================================

# MongoDB connection string
# Can be overridden with MONGODB_URI environment variable
# Default uses MongoDB Atlas cluster (cloud-hosted MongoDB)
MONGODB_URI = os.getenv(
    "MONGODB_URI",
    ""
)

# Global variables for connection pooling
# These are reused across requests to avoid creating new connections each time
client: MongoClient = None      # The MongoDB client (connection pool)
db: Database = None              # The database instance
_db_connection_error = None      # Cache connection errors to avoid repeated attempts


# =============================================================================
# CONNECTION FUNCTIONS
# =============================================================================

def get_database() -> Database:
    """
    Get MongoDB database instance.
    
    Uses singleton pattern - creates connection once, reuses thereafter.
    If connection previously failed, raises cached error immediately.
    
    Returns:
        Database instance for 'autism_screening' database
        
    Raises:
        Exception: If connection fails (with helpful error message)
    """
    global client, db, _db_connection_error
    
    # If already connected, return existing database
    if db is not None:
        return db
    
    # If previous connection attempt failed, don't retry (fail fast)
    if _db_connection_error:
        raise _db_connection_error
    
    try:
        # Create MongoDB client with timeouts
        # serverSelectionTimeoutMS: How long to wait for server discovery
        # connectTimeoutMS: How long to wait for initial connection
        client = MongoClient(
            MONGODB_URI,
            serverSelectionTimeoutMS=5000,  # 5 seconds max for server selection
            connectTimeoutMS=5000           # 5 seconds max for connection
        )
        
        # Test the connection by pinging the server
        # This will raise an exception if MongoDB is unreachable
        client.admin.command('ping')
        
        # Get the specific database for this application
        db = client.get_database("autism_screening")
        print("✓ MongoDB connection successful")
        return db
        
    except (ConnectionFailure, OperationFailure, ConfigurationError) as e:
        # Known MongoDB errors - provide helpful troubleshooting
        error_msg = f"MongoDB connection failed: {str(e)}"
        print(f"✗ {error_msg}")
        print("\nTo fix this:")
        print("1. Set MONGODB_PASSWORD environment variable with your MongoDB password")
        print("   Example: export MONGODB_PASSWORD=your_password")
        print("2. Or set MONGODB_URI environment variable with full connection string")
        print("   Example: export MONGODB_URI='mongodb+srv://admin:password@cluster0.qjd6rib.mongodb.net/?appName=Cluster0'")
        print("3. Make sure your MongoDB Atlas cluster allows connections from your IP address")
        
        # Cache the error to avoid repeated connection attempts
        _db_connection_error = Exception(error_msg)
        raise _db_connection_error
        
    except Exception as e:
        # Unexpected errors
        error_msg = f"Unexpected MongoDB error: {str(e)}"
        print(f"✗ {error_msg}")
        _db_connection_error = Exception(error_msg)
        raise _db_connection_error


def close_database():
    """
    Close MongoDB connection gracefully.
    
    Called during server shutdown to release resources.
    Safe to call multiple times.
    """
    global client, db, _db_connection_error
    
    if client:
        try:
            client.close()
            print("✓ MongoDB connection closed")
        except:
            pass  # Ignore errors during cleanup
    
    # Reset global state
    client = None
    db = None
    _db_connection_error = None  # Allow reconnection attempts after close

```

**Key Concepts Explained:**

| Concept | Explanation |
|---------|-------------|
| **Connection Pooling** | Reuse connections instead of creating new ones per request (faster, less resource-intensive) |
| **Singleton Pattern** | Only one database connection exists, shared across all requests |
| **MongoDB Atlas** | Cloud-hosted MongoDB service (the connection string points to Atlas) |
| **Timeout Configuration** | Prevents server from hanging if MongoDB is unreachable |
| **Environment Variables** | Configuration that can be changed without modifying code |

**Connection String Format:**
```
mongodb+srv://username:password@cluster.mongodb.net/database?options
```

**Why connection pooling?**
```
Without pooling:
Request 1 → new connection → close → (slow)
Request 2 → new connection → close → (slow)

With pooling:
Request 1 → reuse connection → (fast)
Request 2 → reuse connection → (fast)
```

---

## 4.4 app/routers/questionnaire.py - Questionnaire Logic (Complete - 210 lines)

This file handles both AQ-10 (10-question) and SCQ (25-question) autism screening questionnaires with complete scoring logic.

```python
"""
Questionnaire router for AQ-10 and SCQ screening.

This module provides:
1. AQ-10: 10-item Autism Spectrum Quotient questionnaire
2. SCQ: 25-item Social Communication Questionnaire
3. Scoring logic with reversed items
4. Risk categorization (Low/Medium/High)
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import List, Literal

router = APIRouter()


# =============================================================================
# PYDANTIC MODELS - Request/Response data structures
# =============================================================================

class QuestionnaireRequest(BaseModel):
    """Request body for questionnaire submission."""
    questionnaire_type: Literal["AQ10", "SCQ"]  # Only these two types allowed
    answers: List[int] = Field(
        ..., 
        description="List of answers: 0=No, 1=Yes for AQ10; 0=No, 1=Sometimes, 2=Yes for SCQ"
    )
    child_age: int = Field(..., ge=4, lt=18, description="Child age in years (4-17)")


class QuestionnaireResponse(BaseModel):
    """Response body for questionnaire results."""
    risk_category: Literal["Low", "Medium", "High"]
    score: float           # Raw score (0-10 for AQ10, 0-25 for SCQ)
    max_score: float       # Maximum possible score
    interpretation: str    # Human-readable explanation
    recommendation: str    # Next steps suggestion


# =============================================================================
# AQ-10 QUESTIONNAIRE (Autism Spectrum Quotient - 10 item version)
# =============================================================================

# The 10 AQ-10 questions (shortened for display)
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

# AQ-10 Scoring: These items are "reversed" (score 1 for "No" instead of "Yes")
# Items 2, 3, 4, 5, 6, 9 are reversed (in 1-indexed; 1, 2, 3, 4, 5, 8 in 0-indexed)
AQ10_REVERSED_ITEMS = [2, 3, 4, 5, 6, 9]


# =============================================================================
# SCQ QUESTIONNAIRE (Social Communication Questionnaire)
# =============================================================================

# The 25 SCQ questions
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

# SCQ Scoring rules (complex because different items score differently)
SCQ_REVERSED_ITEMS = [1, 4, 11, 18, 19, 20, 21, 22, 23, 24]  # 0-indexed
SCQ_YES_SCORING_ITEMS = [8, 9, 10, 15, 16, 17]  # 0-indexed


# =============================================================================
# SCORING FUNCTIONS
# =============================================================================

def calculate_aq10_score(answers: List[int]) -> tuple[float, str, str, str]:
    """
    Calculate AQ-10 score and determine risk category.
    
    Scoring logic:
    - Normal items (1, 7, 8, 10): Score 1 for "Yes" (answer=1)
    - Reversed items (2, 3, 4, 5, 6, 9): Score 1 for "No" (answer=0)
    - Total possible: 0-10 points
    - Clinical cutoff: 6+ suggests elevated autism traits
    
    Returns:
        tuple: (score, risk_category, interpretation, recommendation)
    """
    if len(answers) != 10:
        raise HTTPException(status_code=400, detail="AQ-10 requires exactly 10 answers")
    
    score = 0
    for i, answer in enumerate(answers):
        # Validate answer values
        if answer not in [0, 1]:
            raise HTTPException(
                status_code=400, 
                detail=f"Invalid answer at position {i+1}. Must be 0 (No) or 1 (Yes)"
            )
        
        item_num = i + 1  # Convert to 1-indexed for comparison with reversed items list
        
        if item_num in AQ10_REVERSED_ITEMS:
            # Reversed items: score 1 for "No" (answer=0)
            if answer == 0:
                score += 1
        else:
            # Normal items: score 1 for "Yes" (answer=1)
            if answer == 1:
                score += 1
    
    max_score = 10.0
    
    # Determine risk category based on clinical cutoffs
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
    
    SCQ uses 3-point scale: 0=No, 1=Sometimes, 2=Yes
    Clinical cutoff: 15+ for children 4-17 years
    
    Returns:
        tuple: (score, risk_category, interpretation, recommendation)
    """
    if len(answers) != 25:
        raise HTTPException(status_code=400, detail="SCQ requires exactly 25 answers")
    
    score = 0
    for i, answer in enumerate(answers):
        # Validate answer values
        if answer not in [0, 1, 2]:
            raise HTTPException(
                status_code=400, 
                detail=f"Invalid answer at position {i+1}. Must be 0 (No), 1 (Sometimes), or 2 (Yes)"
            )
        
        item_num = i + 1  # 1-indexed for comparison
        
        # Apply different scoring rules based on item type
        if item_num in SCQ_REVERSED_ITEMS:
            if answer == 0:  # Score 1 for "No"
                score += 1
        elif item_num in SCQ_YES_SCORING_ITEMS:
            if answer == 2:  # Score 1 for "Yes"
                score += 1
        else:
            if answer == 0:  # Score 1 for "No"
                score += 1
    
    max_score = 25.0
    
    # Determine risk category (clinical cutoff is typically 15+)
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


# =============================================================================
# API ENDPOINTS
# =============================================================================

@router.get("/questions/{questionnaire_type}")
async def get_questions(questionnaire_type: Literal["AQ10", "SCQ"]):
    """
    Get questionnaire questions by type.
    
    Returns the list of questions and answer format for the requested questionnaire.
    """
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
    """
    Submit questionnaire answers and get risk assessment.
    
    Validates answers, calculates score, and returns risk category with interpretation.
    """
    try:
        if request.questionnaire_type == "AQ10":
            score, risk, interpretation, recommendation = calculate_aq10_score(request.answers)
            max_score = 10.0
        else:  # SCQ
            score, risk, interpretation, recommendation = calculate_scq_score(
                request.answers, 
                request.child_age
            )
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

```

**Key Concepts Explained:**

| Concept | Explanation |
|---------|-------------|
| **AQ-10** | Autism Spectrum Quotient - 10 question screening tool developed by Simon Baron-Cohen |
| **SCQ** | Social Communication Questionnaire - more comprehensive 25-question screening |
| **Reversed Items** | Some questions are phrased negatively, so "No" indicates autism traits |
| **Clinical Cutoff** | Score threshold (6+ for AQ-10) that suggests further evaluation |
| **Pydantic Field** | Validation rules for request data (e.g., `ge=4` means "greater than or equal to 4") |

**Scoring Example (AQ-10):**
```
Question 1 (Normal): "notices small sounds" - Yes → 1 point
Question 2 (Reversed): "concentrates on whole picture" - No → 1 point
...
Total: 7/10 → "High" risk → Recommend professional evaluation
```

---

## 4.5 app/routers/facial_analysis.py - AI Photo Analysis (Complete - 180 lines)

This file handles facial image analysis using a Vision Transformer (ViT) model with complete privacy features.

```python
"""
Facial analysis router using Vision Transformer model.
Processes images in-memory only, no storage.

This module provides:
1. Image upload and validation
2. Face detection using OpenCV
3. Autism risk prediction using ViT model
4. Privacy-first processing (no disk storage)
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


# =============================================================================
# GLOBAL MODEL CACHE - Load once, reuse for all requests
# =============================================================================

# The ViT model is loaded once at startup and cached globally
# This avoids expensive model loading on each request
_model = None
_device = torch.device("cuda" if torch.cuda.is_available() else "cpu")


# =============================================================================
# PYDANTIC MODELS
# =============================================================================

class FacialAnalysisResponse(BaseModel):
    """Response body for facial analysis endpoint."""
    probability: float        # Probability of autism traits (0-1)
    confidence: float         # Model confidence in prediction
    risk_category: str        # "Low", "Medium", or "High"
    risk_interpretation: str  # Human-readable explanation
    image_quality_check: dict # Quality metrics and warnings


# =============================================================================
# IMAGE QUALITY CHECKING
# =============================================================================

def check_image_quality(image: Image.Image) -> dict:
    """
    Check image quality: face detection, frontal pose, lighting.
    
    Quality checks performed:
    1. Face detection using Haar Cascade classifier
    2. Lighting quality (mean brightness check)
    3. Resolution adequacy (minimum 224x224)
    
    Returns:
        dict with quality metrics and any warnings
    """
    # Convert PIL Image to OpenCV format (BGR)
    img_array = np.array(image)
    if img_array.shape[2] == 3:  # RGB
        img_cv = cv2.cvtColor(img_array, cv2.COLOR_RGB2BGR)
    else:
        img_cv = img_array
    
    gray = cv2.cvtColor(img_cv, cv2.COLOR_BGR2GRAY)
    
    # Face detection using Haar Cascade (classic but reliable method)
    face_cascade = cv2.CascadeClassifier(
        cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'
    )
    faces = face_cascade.detectMultiScale(gray, 1.1, 4)
    
    # Build quality check result
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
    
    # Check face detection results
    if len(faces) == 0:
        quality_check["warnings"].append(
            "No face detected in image. Please ensure a clear frontal face is visible."
        )
        quality_check["frontal_pose"] = False
    elif len(faces) > 1:
        quality_check["warnings"].append(
            "Multiple faces detected. Please use an image with only the child's face."
        )
    else:
        # Single face detected - assume frontal if detected well
        quality_check["frontal_pose"] = True
    
    # Check lighting quality using mean brightness
    mean_brightness = np.mean(gray)
    if mean_brightness < 50:
        quality_check["lighting_quality"] = "poor"
        quality_check["warnings"].append(
            "Image appears too dark. Please ensure adequate lighting."
        )
    elif mean_brightness > 200:
        quality_check["lighting_quality"] = "poor"
        quality_check["warnings"].append(
            "Image appears too bright or overexposed."
        )
    else:
        quality_check["lighting_quality"] = "adequate"
    
    # Check resolution
    if image.width < 224 or image.height < 224:
        quality_check["warnings"].append(
            "Image resolution is low. Higher resolution images may provide better results."
        )
    
    return quality_check


# =============================================================================
# MODEL LOADING
# =============================================================================

def load_model_on_startup():
    """
    Load the ViT model when the module is imported.
    
    This is called once when the server starts, keeping the model
    in memory for fast inference on requests.
    """
    global _model
    try:
        _model = load_vit_model()
        print(f"ViT model loaded successfully on device: {_device}")
    except Exception as e:
        print(f"Warning: Could not load ViT model: {e}")
        print("Facial analysis will return placeholder values. Please train and save the model first.")
        _model = None


# Load model when module is imported (server startup)
load_model_on_startup()


# =============================================================================
# API ENDPOINTS
# =============================================================================

@router.post("/analyze")
async def analyze_face(file: UploadFile = File(...)):
    """
    Analyze facial image for autism risk indicators.
    
    PRIVACY FIRST: Image is processed in-memory only and immediately discarded.
    No image is ever saved to disk.
    
    Process:
    1. Read uploaded image into memory
    2. Validate image format and perform quality checks
    3. Run through ViT model for prediction
    4. Immediately delete image from memory
    5. Return results
    """
    try:
        # Read image into memory (never saved to disk!)
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
        
        # Predict autism risk using ViT model
        probability, confidence = predict_autism_risk(_model, image, _device)
        
        # Determine risk category based on probability thresholds
        if probability >= 0.7:
            risk_category = "High"
            risk_interpretation = f"Facial analysis suggests elevated risk indicators (probability: {probability:.2%}). This is a supporting signal only and not a diagnostic tool."
        elif probability >= 0.5:
            risk_category = "Medium"
            risk_interpretation = f"Facial analysis suggests moderate risk indicators (probability: {probability:.2%}). This is a supporting signal only and not a diagnostic tool."
        else:
            risk_category = "Low"
            risk_interpretation = f"Facial analysis suggests lower risk indicators (probability: {probability:.2%}). This is a supporting signal only and not a diagnostic tool."
        
        # Clear image from memory explicitly (privacy protection)
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
    """
    Check if facial analysis model is loaded and ready.
    
    Returns model status and device information.
    """
    return {
        "model_loaded": _model is not None,
        "device": str(_device)
    }

```

**Key Concepts Explained:**

| Concept | Explanation |
|---------|-------------|
| **Vision Transformer (ViT)** | Google's transformer architecture applied to images, breaks image into 16×16 patches |
| **In-Memory Processing** | Images never touch disk - loaded, processed, and deleted in RAM only |
| **Haar Cascade** | Classical face detection algorithm using pattern matching |
| **Global Model Cache** | Model loaded once at startup, reused for all requests (efficiency) |
| **CUDA/CPU Selection** | Automatically uses GPU if available, falls back to CPU |

**Privacy Architecture:**
```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Upload    │────▶│  Process    │────▶│   Delete    │
│  (to RAM)   │     │  (in RAM)   │     │  from RAM   │
└─────────────┘     └─────────────┘     └─────────────┘
                          │
                    Never saved
                     to disk!
```

---

## 4.6 app/routers/risk_fusion.py - Combining All Scores (Complete - 163 lines)

This file combines results from questionnaire, facial analysis, and gaze tracking using a weighted average approach.

```python
"""
Risk fusion router for combining questionnaire, facial, and gaze analysis results.
Uses weighted fusion with questionnaire having the highest weight.

This module provides:
1. Weighted score combination (questionnaire 60%, gaze 30%, facial 10%)
2. Dynamic weight normalization when components are missing
3. Confidence score calculation
4. Final risk categorization with recommendations
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Literal, Optional

router = APIRouter()


# =============================================================================
# WEIGHT CONFIGURATION
# =============================================================================

# Weight distribution: Questionnaire > Gaze > Facial
# These weights reflect the clinical importance of each assessment
QUESTIONNAIRE_WEIGHT = 0.6  # 60% - Most important (gold-standard screening)
GAZE_WEIGHT = 0.3           # 30% - Second most important (behavioral marker)
FACIAL_WEIGHT = 0.1         # 10% - Supporting signal only


# =============================================================================
# PYDANTIC MODELS
# =============================================================================

class QuestionnaireResult(BaseModel):
    """Questionnaire assessment result."""
    risk_category: Literal["Low", "Medium", "High"]
    score: float  # Raw score from questionnaire


class FacialResult(BaseModel):
    """Facial analysis result."""
    risk_category: Literal["Low", "Medium", "High"]
    probability: float  # Probability from ViT model (0-1)


class GazeResult(BaseModel):
    """Gaze tracking result."""
    risk_category: Literal["Low", "Medium", "High"]
    spi: float  # Social Preference Index (-1 to 1)


class RiskFusionRequest(BaseModel):
    """Request body for risk fusion endpoint."""
    questionnaire: QuestionnaireResult  # Required - questionnaire is mandatory
    facial: Optional[FacialResult] = None  # Optional - may skip facial analysis
    gaze: Optional[GazeResult] = None      # Optional - may skip gaze tracking


class RiskFusionResponse(BaseModel):
    """Response body with combined risk assessment."""
    final_risk_category: Literal["Low", "Medium", "High"]
    confidence_score: float       # How confident we are in this result (0-1)
    interpretation: str           # Human-readable explanation
    recommendation: str           # Next steps suggestion
    component_scores: dict        # Breakdown of each component's contribution


# =============================================================================
# HELPER FUNCTIONS
# =============================================================================

def risk_to_numeric(risk: str) -> float:
    """
    Convert risk category to numeric value for weighted calculation.
    
    Mapping:
    - "Low" → 1.0
    - "Medium" → 2.0
    - "High" → 3.0
    """
    mapping = {"Low": 1.0, "Medium": 2.0, "High": 3.0}
    return mapping.get(risk, 1.0)


def numeric_to_risk(value: float) -> str:
    """
    Convert numeric value back to risk category.
    
    Thresholds:
    - >= 2.5 → "High"
    - >= 1.5 → "Medium"
    - < 1.5  → "Low"
    """
    if value >= 2.5:
        return "High"
    elif value >= 1.5:
        return "Medium"
    else:
        return "Low"


# =============================================================================
# API ENDPOINT
# =============================================================================

@router.post("/fuse", response_model=RiskFusionResponse)
async def fuse_risks(request: RiskFusionRequest):
    """
    Fuse multiple risk assessments using weighted combination.
    
    Algorithm:
    1. Start with mandatory questionnaire score
    2. Add optional gaze and facial scores if provided
    3. Normalize weights to sum to 1.0 based on available inputs
    4. Calculate weighted average
    5. Map to final risk category
    6. Generate confidence score and recommendations
    
    Example (all components present):
    - Questionnaire: "Medium" (2.0) × 0.6 = 1.2
    - Gaze: "Low" (1.0) × 0.3 = 0.3
    - Facial: "Low" (1.0) × 0.1 = 0.1
    - Total: 1.6 → "Medium"
    """
    # Build available weights based on which components are present
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
    
    # Track component scores for transparency
    component_scores = {
        "questionnaire": {
            "risk": request.questionnaire.risk_category,
            "weight": normalized_weights["questionnaire"]
        }
    }
    
    # Add gaze score if provided
    if request.gaze:
        gaze_score = risk_to_numeric(request.gaze.risk_category)
        weighted_score += gaze_score * normalized_weights["gaze"]
        component_scores["gaze"] = {
            "risk": request.gaze.risk_category,
            "weight": normalized_weights["gaze"],
            "spi": request.gaze.spi
        }
    
    # Add facial score if provided
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
    
    # Calculate confidence score
    # Based on distance from category boundaries (higher = more confident)
    if final_risk == "High":
        confidence = min(1.0, (weighted_score - 2.5) / 0.5) if weighted_score >= 2.5 else 0.5
    elif final_risk == "Medium":
        confidence = 1.0 - abs(weighted_score - 2.0) / 0.5
        confidence = max(0.5, min(1.0, confidence))
    else:  # Low
        confidence = min(1.0, (1.5 - weighted_score) / 0.5) if weighted_score <= 1.5 else 0.5
    
    # Generate interpretation and recommendation based on final risk
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

```

**Key Concepts Explained:**

| Concept | Explanation |
|---------|-------------|
| **Weighted Average** | Each component contributes proportionally to its weight (60/30/10) |
| **Dynamic Normalization** | If gaze or facial is skipped, remaining weights are rescaled to sum to 1.0 |
| **Confidence Score** | Measures how "certain" the final category is (based on distance from thresholds) |
| **Optional Components** | Only questionnaire is required; facial and gaze can be skipped |

**Weight Distribution Rationale:**
```
┌────────────────────────────────────────────────────────┐
│ Questionnaire: 60% │ Gold-standard screening method      │
├────────────────────────────────────────────────────────┤
│ Gaze Tracking: 30% │ Behavioral marker (SPI)             │
├────────────────────────────────────────────────────────┤
│ Facial: 10%        │ Supporting signal only              │
└────────────────────────────────────────────────────────┘
```

**Fusion Example:**
```
Questionnaire: Medium (2.0) × 0.6 = 1.20
Gaze:          Low    (1.0) × 0.3 = 0.30
Facial:        Low    (1.0) × 0.1 = 0.10
                                   ─────
Total weighted score:              1.60 → "Medium" risk
```

---

## 4.7 app/models/vit_model.py - The AI Brain (Complete - 105 lines)

This file defines the Vision Transformer model architecture for autism facial analysis.

```python
"""
Vision Transformer model for autism facial analysis.
Based on ViT (Vision Transformer) architecture.

This module provides:
1. ViTASDModel class - Vision Transformer for ASD detection
2. Image preprocessing pipeline matching training
3. Model loading with fallback to pretrained weights
4. Prediction function returning probability and confidence
"""
import torch
import torch.nn as nn
from torchvision import transforms
from PIL import Image
import os
from transformers import ViTForImageClassification


# =============================================================================
# MODEL CONFIGURATION
# =============================================================================

# Path to saved model weights (trained on autism dataset)
MODEL_SAVE_PATH = "backend/models/vitasd_model.pth"
IMAGE_SIZE = 224   # ViT expects 224x224 images
BATCH_SIZE = 32    # Training batch size (for reference)


# =============================================================================
# MODEL DEFINITION
# =============================================================================

class ViTASDModel(nn.Module):
    """
    Vision Transformer model fine-tuned for autism spectrum disorder detection.
    
    Architecture:
    1. Image is split into 16×16 patches (14×14 grid for 224×224 image)
    2. Each patch is linearly embedded into a vector
    3. Position embeddings are added
    4. Transformer encoder processes the sequence
    5. Classification head outputs 2-class probabilities
    
    We use Google's pre-trained ViT-Base model and fine-tune it on autism data.
    This transfer learning approach leverages features learned from millions of images.
    """
    
    def __init__(self, num_classes=2, pretrained=True):
        """
        Initialize the ViT model.
        
        Args:
            num_classes: Number of output classes (2 for autism/non-autism)
            pretrained: Whether to load pretrained weights from Hugging Face
        """
        super(ViTASDModel, self).__init__()
        # Load Google's pre-trained ViT model from Hugging Face
        self.vit = ViTForImageClassification.from_pretrained(
            "google/vit-base-patch16-224",  # Pre-trained on ImageNet (millions of images)
            num_labels=num_classes,          # Replace final layer for our 2 classes
            ignore_mismatched_sizes=True     # Allow different classifier head size
        )
    
    def forward(self, x):
        """
        Forward pass through the network.
        
        Args:
            x: Batch of images, shape (batch_size, 3, 224, 224)
            
        Returns:
            ViT output containing logits for each class
        """
        return self.vit(x)


# =============================================================================
# IMAGE PREPROCESSING PIPELINE
# =============================================================================

# Preprocessing must EXACTLY match what was used during training
# Using ImageNet normalization values (standard for transfer learning)
transform = transforms.Compose([
    transforms.Resize((IMAGE_SIZE, IMAGE_SIZE)),  # Resize to 224×224
    transforms.ToTensor(),                         # Convert PIL Image to tensor (0-1)
    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],  # ImageNet RGB means
        std=[0.229, 0.224, 0.225]    # ImageNet RGB standard deviations
    )
])


# =============================================================================
# MODEL LOADING
# =============================================================================

def load_vit_model(model_path: str = None):
    """
    Load the trained ViT model from disk.
    
    Falls back to pretrained weights if trained model doesn't exist.
    
    Args:
        model_path: Path to saved model weights (.pth file)
        
    Returns:
        Loaded model in evaluation mode
    """
    if model_path is None:
        model_path = MODEL_SAVE_PATH
    
    # Convert to absolute path if relative
    if not os.path.isabs(model_path):
        # Get the backend directory (parent of app directory)
        backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        model_path = os.path.join(backend_dir, "models", "vitasd_model.pth")
    
    print(f"Attempting to load model from: {model_path}")
    
    if os.path.exists(model_path):
        try:
            # Load our trained model
            model = ViTASDModel(num_classes=2, pretrained=False)
            model.load_state_dict(torch.load(model_path, map_location=torch.device('cpu')))
            model.eval()  # Set to evaluation mode (disables dropout)
            print(f"Successfully loaded trained model from {model_path}")
            return model
        except Exception as e:
            print(f"Error loading model: {e}. Using pretrained model as fallback.")
            model = ViTASDModel(num_classes=2, pretrained=True)
            model.eval()
            return model
    else:
        # Return pretrained model as fallback (not fine-tuned on autism data)
        print(f"Warning: Trained model not found at {model_path}. Using pretrained model.")
        model = ViTASDModel(num_classes=2, pretrained=True)
        model.eval()
        return model


# =============================================================================
# PREDICTION FUNCTION
# =============================================================================

def predict_autism_risk(model, image: Image.Image, device: torch.device) -> tuple[float, float]:
    """
    Predict autism risk from a facial image.
    
    Process:
    1. Preprocess image (resize, normalize)
    2. Add batch dimension
    3. Run through model (forward pass)
    4. Apply softmax to get probabilities
    5. Calculate confidence as difference between top-2 probabilities
    
    Args:
        model: Loaded ViTASDModel
        image: PIL Image of face
        device: torch device (CPU or CUDA)
        
    Returns:
        tuple: (autism_probability, confidence)
            - autism_probability: 0-1 probability of autism traits
            - confidence: 0-1 measure of model certainty
    """
    model.to(device)
    model.eval()
    
    # Preprocess image
    img_tensor = transform(image).unsqueeze(0).to(device)  # Add batch dimension
    
    with torch.no_grad():  # Disable gradient computation (faster, less memory)
        outputs = model(img_tensor)
        # Handle different output formats (direct tensor or object with logits)
        logits = outputs.logits if hasattr(outputs, 'logits') else outputs
        probabilities = torch.nn.functional.softmax(logits, dim=1)
        
        # Get probability of autism class (assuming class 1 is autism)
        autism_prob = probabilities[0][1].item()
        
        # Calculate confidence as the difference between top-2 probabilities
        # Higher difference = more confident prediction
        sorted_probs = torch.sort(probabilities[0], descending=True)[0]
        confidence = (sorted_probs[0] - sorted_probs[1]).item()
    
    return autism_prob, confidence

```

**Key Concepts Explained:**

| Concept | Explanation |
|---------|-------------|
| **Vision Transformer (ViT)** | Google's transformer architecture for images - treats images as sequences of patches |
| **Transfer Learning** | Use pretrained weights from ImageNet, fine-tune on autism dataset |
| **Patch Embedding** | 224×224 image → 14×14 grid of 16×16 patches → 196 vectors |
| **ImageNet Normalization** | Standard mean/std values used for all models pretrained on ImageNet |
| **Softmax** | Converts raw logits into probabilities that sum to 1.0 |

**How ViT Processes Images:**
```
┌─────────────────────────┐
│ Input Image (224×224)   │
├─────────────────────────┤
│ Split into 16×16 Patches│  → 196 patches (14×14 grid)
├─────────────────────────┤
│ Linear Embedding        │  → Each patch → vector
├─────────────────────────┤
│ + Position Embeddings   │  → Add position information
├─────────────────────────┤
│ 12 Transformer Layers   │  → Self-attention magic
├─────────────────────────┤
│ Classification Head     │  → 2 outputs (autism/non-autism)
├─────────────────────────┤
│ Softmax                 │  → Probabilities [0.3, 0.7]
└─────────────────────────┘
```

---

## 4.8 app/utils/crypto.py - Encryption (Complete - 74 lines)

This file provides AES-256 encryption for protecting sensitive screening reports with user PINs.

```python
"""
Cryptography utilities for PIN-based encryption.

This module provides:
1. PIN-to-key derivation using SHA-256
2. AES-256-CBC encryption with random IV
3. PKCS7 padding for block alignment
4. Base64 encoding for safe storage/transmission
"""
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives import padding
import hashlib
import os
import base64


# =============================================================================
# KEY DERIVATION
# =============================================================================

def derive_key(pin: str) -> bytes:
    """
    Derive a 32-byte encryption key from PIN using SHA-256.
    
    Why SHA-256?
    - AES-256 requires exactly 32 bytes (256 bits) key
    - SHA-256 produces exactly 32 bytes
    - One-way: can't recover PIN from key
    
    Note: In production, use PBKDF2 or Argon2 for stronger key derivation.
    
    Args:
        pin: User's PIN (typically 4-6 digits)
        
    Returns:
        32-byte key for AES-256 encryption
    """
    return hashlib.sha256(pin.encode()).digest()


# =============================================================================
# ENCRYPTION
# =============================================================================

def encrypt_data(data: str, pin: str) -> str:
    """
    Encrypt data using AES-256-CBC with PIN-derived key.
    
    Process:
    1. Derive 32-byte key from PIN using SHA-256
    2. Generate random 16-byte IV (Initialization Vector)
    3. Pad data to multiple of 16 bytes (AES block size)
    4. Encrypt using AES-256-CBC mode
    5. Prepend IV to ciphertext (needed for decryption)
    6. Base64 encode for safe storage
    
    Args:
        data: Plain text to encrypt
        pin: User's PIN for key derivation
        
    Returns:
        Base64-encoded encrypted string (IV + ciphertext)
    """
    key = derive_key(pin)
    iv = os.urandom(16)  # 16 bytes for AES block size (128 bits)
    
    # Pad the data to be a multiple of 16 bytes
    # PKCS7 padding: add N bytes of value N
    padder = padding.PKCS7(128).padder()  # 128 = AES block size in bits
    padded_data = padder.update(data.encode())
    padded_data += padder.finalize()
    
    # Create cipher and encrypt
    cipher = Cipher(
        algorithms.AES(key),
        modes.CBC(iv),
        backend=default_backend()
    )
    encryptor = cipher.encryptor()
    encrypted = encryptor.update(padded_data) + encryptor.finalize()
    
    # Combine IV + encrypted data, then base64 encode
    # IV is prepended so we can extract it during decryption
    combined = iv + encrypted
    return base64.b64encode(combined).decode()


# =============================================================================
# DECRYPTION
# =============================================================================

def decrypt_data(encrypted_data: str, pin: str) -> str:
    """
    Decrypt data using AES-256-CBC with PIN-derived key.
    
    Process (reverse of encryption):
    1. Base64 decode the input
    2. Extract IV (first 16 bytes)
    3. Derive key from PIN
    4. Decrypt using AES-256-CBC
    5. Remove PKCS7 padding
    6. Return original text
    
    Args:
        encrypted_data: Base64-encoded encrypted string
        pin: User's PIN for key derivation
        
    Returns:
        Decrypted plain text
        
    Raises:
        ValueError: If decryption fails (wrong PIN or corrupted data)
    """
    try:
        # Decode base64 and extract IV
        combined = base64.b64decode(encrypted_data)
        iv = combined[:16]         # First 16 bytes = IV
        encrypted = combined[16:]  # Rest = ciphertext
        
        key = derive_key(pin)
        
        # Create cipher and decrypt
        cipher = Cipher(
            algorithms.AES(key),
            modes.CBC(iv),
            backend=default_backend()
        )
        decryptor = cipher.decryptor()
        padded_data = decryptor.update(encrypted) + decryptor.finalize()
        
        # Remove PKCS7 padding
        unpadder = padding.PKCS7(128).unpadder()
        data = unpadder.update(padded_data)
        data += unpadder.finalize()
        
        return data.decode()
    except Exception as e:
        raise ValueError(f"Decryption failed: {str(e)}")

```

**Key Concepts Explained:**

| Concept | Explanation |
|---------|-------------|
| **AES-256** | Advanced Encryption Standard with 256-bit key - military-grade encryption |
| **CBC Mode** | Cipher Block Chaining - each block XORed with previous (needs IV) |
| **IV (Initialization Vector)** | Random bytes prepended to make same plaintext encrypt differently each time |
| **PKCS7 Padding** | Adds bytes to make data a multiple of block size (16 bytes for AES) |
| **SHA-256** | Secure Hash Algorithm that produces 32 bytes (256 bits) - perfect for AES-256 key |

**Encryption Flow:**
```
PIN: "1234"
         │
         ▼
┌─────────────────┐
│  SHA-256 Hash   │ → 32-byte key
└─────────────────┘
         │
         ▼
┌─────────────────┐     ┌─────────────┐
│   Plain Text    │ + IV + AES-256-CBC │ → Encrypted
└─────────────────┘     └─────────────┘
         │
         ▼
    Base64 Encode → "xK9f2aB7+..."  (safe to store in database)
```

**Why Encryption is Needed:**
Screening reports contain sensitive health information. Even if database is compromised, reports remain unreadable without the user's PIN.

---

## 4.9 app/routers/auth.py - Authentication & PIN Management (COMPLETE CODE)

This file handles Google OAuth login and PIN management. **Complete file: 194 lines.**

```python
"""
Authentication router for Google OAuth and PIN management.

This module provides:
1. Google OAuth token verification
2. JWT-based session management
3. Secure PIN storage using sentinel pattern
4. Protected endpoint access via dependencies
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

# Create the router instance - will be mounted at /api/auth in main.py
router = APIRouter()

# =============================================================================
# CONFIGURATION CONSTANTS
# =============================================================================

# JWT (JSON Web Token) Configuration
JWT_SECRET = "autismdetectionchildren"      # Secret key for signing JWTs (in production, use environment variable)
JWT_ALGORITHM = "HS256"                      # HMAC-SHA256 algorithm for signing

# Google OAuth Configuration (from Google Cloud Console)
GOOGLE_CLIENT_ID = ""


# =============================================================================
# PYDANTIC MODELS - Define request/response data structures
# =============================================================================

class GoogleTokenRequest(BaseModel):
    """Request body for Google authentication endpoint."""
    token: str  # The credential token from Google Sign-In on frontend


class PinSetRequest(BaseModel):
    """Request body for setting a new PIN."""
    pin: str  # The 4-digit PIN to set


class PinVerifyRequest(BaseModel):
    """Request body for verifying a PIN."""
    pin: str  # The PIN to verify


class TokenResponse(BaseModel):
    """Response body for successful authentication."""
    access_token: str       # Our JWT token for subsequent requests
    token_type: str = "bearer"  # Token type (always "bearer")
    user_email: str         # User's email from Google
    user_name: str          # User's display name from Google
    pin_set: bool           # Whether user has set up a PIN


class PinStatusResponse(BaseModel):
    """Response body for PIN status check."""
    pin_set: bool  # True if user has set a PIN, False otherwise


# =============================================================================
# HELPER FUNCTIONS
# =============================================================================

def verify_google_token(token: str) -> dict:
    """
    Verify Google OAuth token with Google's servers.
    
    This function:
    1. Sends the token to Google's verification endpoint
    2. Google checks if the token is valid and not expired
    3. If valid, Google returns the user's information
    
    Args:
        token: The credential token from Google Sign-In
        
    Returns:
        dict with keys: email, name, picture
        
    Raises:
        HTTPException 401 if token is invalid
    """
    try:
        # Verify the token with Google's servers
        # This makes an HTTP request to Google to validate the token
        idinfo = id_token.verify_oauth2_token(
            token,                    # The token to verify
            requests.Request(),       # HTTP adapter for making requests
            GOOGLE_CLIENT_ID          # Our app's client ID (must match)
        )
        # Extract user information from the verified token
        return {
            "email": idinfo["email"],
            "name": idinfo.get("name", idinfo["email"]),  # Fallback to email if no name
            "picture": idinfo.get("picture")              # Profile picture URL (optional)
        }
    except ValueError as e:
        # Token is invalid (expired, wrong audience, etc.)
        raise HTTPException(status_code=401, detail=f"Invalid Google token: {str(e)}")


def create_jwt_token(email: str) -> str:
    """
    Create our own JWT token for the user session.
    
    JWT = JSON Web Token, a signed piece of data that proves identity.
    Structure: header.payload.signature (base64 encoded)
    
    Args:
        email: User's email to include in the token
        
    Returns:
        Signed JWT token string
    """
    payload = {
        "email": email,                                    # User identifier
        "exp": datetime.utcnow() + timedelta(days=7),     # Expiration time (7 days)
        "iat": datetime.utcnow()                           # Issued at time
    }
    # Sign the payload with our secret key
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


def verify_jwt_token(token: str) -> dict:
    """
    Verify JWT token and return its payload.
    
    Args:
        token: JWT token string
        
    Returns:
        Decoded payload dictionary
        
    Raises:
        HTTPException 401 if token is invalid or expired
    """
    try:
        # Decode and verify the token signature
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")


def get_current_user(authorization: Optional[str] = Header(None)) -> dict:
    """
    FastAPI Dependency: Get current user from JWT token in Authorization header.
    
    This function is used with Depends() to protect endpoints.
    It extracts the JWT from the Authorization header and verifies it.
    
    Usage in endpoints:
        @router.get("/protected")
        async def protected_endpoint(current_user: dict = Depends(get_current_user)):
            email = current_user["email"]
            ...
    
    Args:
        authorization: The Authorization header value (injected by FastAPI)
        
    Returns:
        Decoded JWT payload containing user info
        
    Raises:
        HTTPException 401 if header missing or token invalid
    """
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization header missing")
    
    try:
        # Remove "Bearer " prefix from header
        token = authorization.replace("Bearer ", "")
        # Verify and decode the token
        payload = verify_jwt_token(token)
        return payload
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Authentication failed: {str(e)}")


# =============================================================================
# API ENDPOINTS
# =============================================================================

@router.post("/google", response_model=TokenResponse)
async def google_auth(request: GoogleTokenRequest):
    """
    Main login endpoint - Verify Google OAuth token and issue JWT session token.
    
    Flow:
    1. Frontend sends Google credential token
    2. We verify it with Google's servers
    3. Find or create user in our database
    4. Issue our own JWT for subsequent requests
    5. Return JWT and user info to frontend
    
    URL: POST /api/auth/google
    """
    try:
        # Step 1: Verify Google token
        user_info = verify_google_token(request.token)
        
        # Step 2: Find or create user in database
        try:
            user = UserModel.find_by_email(user_info["email"])
            if not user:
                user = UserModel.create_user(user_info["email"], user_info["name"])
            
            # Check if user has set a PIN
            pin_set = UserModel.is_pin_set(user_info["email"])
        except Exception as db_error:
            # Handle database connection errors gracefully
            error_msg = str(db_error)
            if "MongoDB connection failed" in error_msg or "Database error" in error_msg:
                raise HTTPException(
                    status_code=503,
                    detail="Database service unavailable. Please check MongoDB configuration. "
                           "Set MONGODB_PASSWORD environment variable or update MONGODB_URI."
                )
            raise HTTPException(status_code=500, detail=f"Database error: {error_msg}")
        
        # Step 3: Create our own JWT token
        access_token = create_jwt_token(user_info["email"])
        
        # Step 4: Return response to frontend
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
    """
    Check if PIN is set for current user.
    
    URL: GET /api/auth/pin/status
    Requires: Authorization header with valid JWT
    """
    email = current_user["email"]
    pin_set = UserModel.is_pin_set(email)
    return PinStatusResponse(pin_set=pin_set)


@router.post("/pin/set")
async def set_pin(
    request: PinSetRequest,
    current_user: dict = Depends(get_current_user)
):
    """
    Set PIN for user (one-time operation).
    
    SECURITY: We DON'T store the PIN directly (security risk!).
    Instead, we use the "sentinel pattern":
    1. Encrypt a known value ("VALID") with the PIN
    2. Store the encrypted result (sentinel)
    3. To verify later: try to decrypt sentinel with entered PIN
    4. If decryption produces "VALID", the PIN is correct
    
    URL: POST /api/auth/pin/set
    Requires: Authorization header with valid JWT
    """
    email = current_user["email"]
    
    # Check if PIN already set (can only set once)
    if UserModel.is_pin_set(email):
        raise HTTPException(status_code=400, detail="PIN already set. Cannot modify PIN.")
    
    # Create sentinel: encrypt "VALID" with the PIN
    sentinel = encrypt_data("VALID", request.pin)
    
    # Save sentinel to database
    UserModel.set_pin_sentinel(email, sentinel)
    
    return {"message": "PIN set successfully"}


@router.post("/pin/verify")
async def verify_pin(
    request: PinVerifyRequest,
    current_user: dict = Depends(get_current_user)
):
    """
    Verify PIN by attempting to decrypt sentinel.
    
    If decryption succeeds and produces "VALID", the PIN is correct.
    This way, we never store the actual PIN.
    
    URL: POST /api/auth/pin/verify
    Requires: Authorization header with valid JWT
    """
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
        # Decryption failed (wrong PIN)
        return {"verified": False}


@router.post("/logout")
async def logout():
    """
    Logout endpoint.
    
    Note: JWT tokens are stateless, so logout is handled client-side
    by removing the token from localStorage. This endpoint exists
    for API completeness and future server-side session invalidation.
    
    URL: POST /api/auth/logout
    """
    return {"message": "Logged out successfully"}
```

**Key Concepts Explained:**

| Concept | Explanation |
|---------|-------------|
| **JWT** | JSON Web Token - a signed string that proves user identity without database lookup |
| **Sentinel Pattern** | Store encrypted known value to verify PIN without storing the actual PIN |
| **Depends()** | FastAPI's dependency injection - functions that run before the endpoint |
| **Header()** | FastAPI's way to extract HTTP headers |
| **@router.post/get** | Decorators that map URLs to functions |
| **response_model** | Pydantic model that validates and documents the response |

**Security Features:**
- PIN is **never stored** directly
- Tokens expire after 7 days
- All protected endpoints require valid JWT
- Database errors handled gracefully


---

## 4.10 app/routers/vault.py - Encrypted Report Storage (COMPLETE CODE)

This file handles saving and retrieving encrypted reports. **Complete file: 98 lines.**

```python
"""
Vault router for saving and retrieving encrypted reports.

This module provides endpoints for:
1. Saving encrypted reports to MongoDB (via GridFS)
2. Listing user's saved reports
3. Retrieving specific reports by ID

SECURITY: All content is encrypted CLIENT-SIDE before sending.
The server NEVER sees decrypted report data.
"""
from fastapi import APIRouter, HTTPException, Depends, Header
from pydantic import BaseModel
from typing import Optional
from app.routers.auth import get_current_user
from app.models.user import UserModel
from app.models.user import VaultModel
from app.utils.crypto import encrypt_data, decrypt_data

# Create router instance - mounted at /api/vault in main.py
router = APIRouter()


# =============================================================================
# PYDANTIC MODELS
# =============================================================================

class SaveReportRequest(BaseModel):
    """Request body for saving a report."""
    encrypted_content: str   # Already encrypted by frontend using CryptoJS
    filename: str            # e.g., "autism-screening-report 2024-01-24.pdf"


class ReportListItem(BaseModel):
    """Single item in report list response."""
    id: str             # MongoDB ObjectId as string
    filename: str       # Original filename
    created_at: str     # ISO format datetime string


class ReportResponse(BaseModel):
    """Response body for retrieving a single report."""
    id: str                  # MongoDB ObjectId as string
    encrypted_content: str   # Still encrypted - frontend decrypts with PIN
    filename: str            # Original filename


# =============================================================================
# API ENDPOINTS
# =============================================================================

@router.post("/save")
async def save_report(
    request: SaveReportRequest,
    current_user: dict = Depends(get_current_user)  # Requires valid JWT
):
    """
    Save encrypted report to vault.
    
    IMPORTANT: The content is ALREADY encrypted by the frontend!
    We just store the encrypted blob - we never see the actual report.
    This is end-to-end encryption controlled by the user's PIN.
    
    URL: POST /api/vault/save
    Requires: Authorization header with valid JWT
    """
    email = current_user["email"]
    
    # Verify PIN is set (required to encrypt/decrypt)
    if not UserModel.is_pin_set(email):
        raise HTTPException(
            status_code=400,
            detail="PIN must be set before saving reports"
        )
    
    # Save to MongoDB GridFS (handles large files)
    report_id = VaultModel.save_report(
        email=email,
        filename=request.filename,
        encrypted_content=request.encrypted_content
    )
    
    return {"message": "Report saved successfully", "report_id": report_id}


@router.get("/list")
async def list_reports(current_user: dict = Depends(get_current_user)):
    """
    List all reports for current user.
    
    Returns METADATA only (id, filename, date).
    Does NOT return encrypted content (too large for list response).
    
    URL: GET /api/vault/list
    Requires: Authorization header with valid JWT
    """
    email = current_user["email"]
    reports = VaultModel.list_user_reports(email)
    
    # Transform MongoDB documents to serializable format
    return {
        "reports": [
            {
                "id": str(r["_id"]),                    # ObjectId to string
                "filename": r["filename"],
                "created_at": r["created_at"].isoformat()  # datetime to ISO string
            }
            for r in reports
        ]
    }


@router.get("/get/{report_id}")
async def get_report(
    report_id: str,
    current_user: dict = Depends(get_current_user)
):
    """
    Get a specific report by ID.
    
    Returns the encrypted blob - frontend must decrypt with user's PIN.
    The server NEVER decrypts the content.
    
    URL: GET /api/vault/get/{report_id}
    Requires: Authorization header with valid JWT
    """
    email = current_user["email"]
    try:
        # Get report (includes ownership verification)
        report = VaultModel.get_report(report_id, email)
        
        if not report:
            raise HTTPException(status_code=404, detail="Report not found")
        
        # Return encrypted content for frontend to decrypt
        return ReportResponse(
            id=report["id"],
            encrypted_content=report["encrypted_content"],  # Still encrypted!
            filename=report["filename"]
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving report: {str(e)}")
```

**Key Design Principles:**

| Principle | Implementation |
|-----------|----------------|
| **End-to-End Encryption** | Content encrypted by frontend before sending, server never sees plaintext |
| **Zero-Knowledge** | Even database administrators cannot read user reports |
| **Ownership Verification** | Reports only accessible to their owner (checked via email) |
| **GridFS Storage** | MongoDB's solution for storing files larger than 16MB |

**Why this design?**
- Server **never sees decrypted data** (end-to-end encryption)
- Even if database is hacked, reports are useless without user's PIN
- User controls their own privacy


---

## 4.11 app/routers/gaze_analysis.py - Eye Tracking Endpoints (Complete - 281 lines)

This file handles all gaze tracking endpoints including calibration, prediction, real-time WebSocket tracking, and SPI analysis. It uses the EyeTrax library for eye tracking functionality.

```python
"""
Gaze analysis router for processing gaze tracking results.
Uses EyeTrax library for gaze estimation.

This router provides endpoints for:
1. Getting calibration points (9-point calibration)
2. Checking individual frames for face/blink detection
3. Calibrating the gaze model with collected frames
4. Predicting gaze from single frames
5. Real-time WebSocket-based gaze tracking
6. Analyzing gaze data to calculate Social Preference Index (SPI)
"""
from fastapi import APIRouter, HTTPException, WebSocket, WebSocketDisconnect
from pydantic import BaseModel
from typing import List, Literal, Optional
from app.services.gaze_tracker import get_gaze_service, calculate_9_point_calibration_targets

router = APIRouter()


# ============================================================================
# PYDANTIC MODELS - Define the shape of request/response data
# ============================================================================

class GazeDataPoint(BaseModel):
    """
    Represents a single gaze data point collected during video watching.
    
    Attributes:
        timestamp: Time in seconds when this gaze point was recorded
        x: Normalized x coordinate (0-1, where 0 is left edge)
        y: Normalized y coordinate (0-1, where 0 is top edge)
        social_region: True if gaze is on social (left) side of screen,
                      False if on geometric (right) side
    """
    timestamp: float
    x: float
    y: float
    social_region: bool  # True if gaze is on social (left) side, False if geometric (right) side


class GazeAnalysisRequest(BaseModel):
    """Request body for gaze analysis endpoint."""
    gaze_data: List[GazeDataPoint]  # All gaze points collected during video
    video_duration: float            # Total video duration in seconds


class GazeAnalysisResponse(BaseModel):
    """
    Response from gaze analysis endpoint.
    
    The SPI (Social Preference Index) is the key metric:
    - Positive SPI = prefers looking at social stimuli (faces)
    - Negative SPI = prefers looking at geometric stimuli (shapes)
    """
    spi: float                                    # Social Preference Index (-1 to 1)
    social_frames: int                            # Count of frames looking at social side
    geometric_frames: int                         # Count of frames looking at geometric side
    total_valid_frames: int                       # Total valid gaze points
    risk_category: Literal["Low", "Medium", "High"]  # Risk assessment
    interpretation: str                           # Human-readable interpretation
    recommendation: str                           # Suggested next steps


class CalibrationFrame(BaseModel):
    """
    A single frame captured during calibration.
    
    During 9-point calibration, user looks at dots on screen while
    we capture their eye images. This maps eye appearance → screen position.
    """
    frame: str         # base64 encoded image from webcam
    target_x: float    # Normalized x coordinate (0-1) of dot they're looking at
    target_y: float    # Normalized y coordinate (0-1) of dot they're looking at
    point_index: int   # Which calibration point (0-8 for 9-point calibration)


class CalibrationRequest(BaseModel):
    """Request body for calibration endpoint."""
    frames: List[CalibrationFrame]   # All frames collected during calibration
    screen_width: int = 1920         # Screen width in pixels (for coordinate conversion)
    screen_height: int = 1080        # Screen height in pixels


class CalibrationPointsResponse(BaseModel):
    """Response containing the 9 calibration point positions."""
    points: List[dict]      # List of {x, y} in normalized coordinates (0-1)
    point_order: List[int]  # Order indices for reference


class FrameCheckRequest(BaseModel):
    """Request for lightweight frame check."""
    frame: str  # base64 encoded image (no data-url prefix)


class FrameCheckResponse(BaseModel):
    """Response from frame check - used during calibration."""
    face_detected: bool   # Was a face found in the frame?
    blink_detected: bool  # Were eyes closed (blinking)?


# ============================================================================
# CALIBRATION ENDPOINTS
# ============================================================================

@router.get("/calibration-points")
async def get_calibration_points(screen_width: int = 1920, screen_height: int = 1080):
    """
    Get EyeTrax 9-point calibration targets.
    
    Returns calibration points in normalized coordinates (0-1) matching EyeTrax's order.
    The 9 points form a 3×3 grid covering the screen, but in a specific order
    that EyeTrax expects for optimal calibration.
    
    EyeTrax's point order:
    - center, top-left, top-right, bottom-left, bottom-right
    - top-center, middle-left, middle-right, bottom-center
    """
    try:
        # Calculate pixel coordinates using EyeTrax's logic
        pixel_points = calculate_9_point_calibration_targets(screen_width, screen_height)
        
        # Convert to normalized coordinates (0-1) for frontend
        normalized_points = [
            {"x": float(x) / screen_width, "y": float(y) / screen_height}
            for x, y in pixel_points
        ]
        
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
    Lightweight EyeTrax-only per-frame check.
    
    Used by the frontend during calibration to:
    1. Verify user's face is visible in camera
    2. Detect if user is blinking (restart current point if so)
    
    This ensures we only collect quality calibration data.
    """
    gaze_service = get_gaze_service()
    result = gaze_service.check_frame(request.frame)
    return FrameCheckResponse(**result)


@router.post("/calibrate")
async def calibrate_gaze(request: CalibrationRequest):
    """
    Calibrate gaze tracking system with collected frames using EyeTrax.
    
    Process:
    1. For each frame, extract eye features using EyeTrax
    2. Associate features with the screen position user was looking at
    3. Train a regression model: eye features → screen coordinates
    4. Save the trained model for future predictions
    
    A successful calibration requires at least 9 valid samples (one per point).
    """
    try:
        gaze_service = get_gaze_service()
        
        # Convert request frames to format expected by gaze service
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


# ============================================================================
# PREDICTION ENDPOINTS
# ============================================================================

@router.post("/predict")
async def predict_gaze(frame: dict):
    """
    Predict gaze coordinates from a single frame using EyeTrax.
    
    Input: {"frame": "base64_encoded_image"}
    Output: {"x": float, "y": float} (normalized coordinates 0-1)
    
    If not calibrated or prediction fails, returns center (0.5, 0.5) as fallback.
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
    
    Benefits over HTTP:
    - Persistent connection (no handshake overhead per frame)
    - Bidirectional communication
    - Lower latency for real-time tracking
    
    Protocol:
    - Client sends: {"type": "frame", "frame": "base64_image"}
    - Server responds: {"type": "gaze", "x": float, "y": float, "calibrated": bool}
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
        pass  # Client disconnected normally
    except Exception as e:
        print(f"WebSocket error: {e}")
        await websocket.close()


# ============================================================================
# ANALYSIS ENDPOINT - The Core SPI Calculation
# ============================================================================

@router.post("/analyze", response_model=GazeAnalysisResponse)
async def analyze_gaze(request: GazeAnalysisRequest):
    """
    Analyze gaze tracking data and calculate Social Preference Index (SPI).
    
    SPI Formula:
        SPI = (Social_Frames - Geometric_Frames) / Total_Valid_Frames
    
    SPI Interpretation:
    ┌───────────────────┬──────────────┬─────────────────────────────────────┐
    │ SPI Range         │ Risk Level   │ Meaning                             │
    ├───────────────────┼──────────────┼─────────────────────────────────────┤
    │ SPI >= 0.2        │ Low Risk     │ Strong preference for social stimuli│
    │ 0.0 <= SPI < 0.2  │ Medium Risk  │ Mixed/balanced preference           │
    │ SPI < 0.0         │ High Risk    │ Preference for geometric stimuli    │
    └───────────────────┴──────────────┴─────────────────────────────────────┘
    
    Note: This is a screening tool, NOT a diagnostic instrument.
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
    
    # Calculate SPI: positive = prefers social, negative = prefers geometric
    spi = (social_frames - geometric_frames) / total_valid_frames
    
    # Determine risk category and generate interpretation
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


# ============================================================================
# STATUS ENDPOINT
# ============================================================================

@router.get("/status")
async def get_gaze_status():
    """Get calibration status of gaze tracking system."""
    gaze_service = get_gaze_service()
    return {
        "calibrated": gaze_service.get_calibration_status(),
        "model_path": gaze_service.model_path
    }
```

**Key Concepts Explained:**

| Concept | Explanation |
|---------|-------------|
| **WebSocket** | Persistent two-way connection (vs HTTP request-response). Ideal for real-time streaming of gaze data |
| **SPI** | Social Preference Index - measures whether someone prefers looking at social (faces) vs geometric (shapes) stimuli |
| **Normalized Coordinates** | 0-1 scale independent of screen resolution. (0,0) = top-left, (1,1) = bottom-right |
| **9-Point Calibration** | Standard technique that maps eye appearance when looking at 9 known screen positions |
| **Pydantic Models** | Python classes that validate request/response data and generate API documentation |

**SPI Risk Thresholds:**

| SPI Value | Risk Category | Interpretation |
|-----------|---------------|----------------|
| >= 0.2 | Low Risk | Strong social preference (typical development) |
| 0.0 to 0.2 | Medium Risk | Mixed/balanced preference |
| < 0.0 | High Risk | Geometric preference (may warrant evaluation) |

---

## 4.12 app/services/gaze_tracker.py - EyeTrax Integration (Complete - 416 lines)

This is the core gaze tracking service using the EyeTrax library. It handles all low-level eye tracking operations including initialization, calibration, prediction, and model persistence.

```python
"""
Gaze tracking service using EyeTrax library
Based on https://github.com/ck-zhang/EyeTrax
Uses EyeTrax's GazeEstimator, extract_features, train, and predict methods

This service provides:
1. Initialization of EyeTrax's GazeEstimator
2. 9-point calibration using collected frames
3. Real-time gaze prediction from webcam frames
4. Model persistence (save/load trained models)
5. Frame quality checking (face/blink detection)
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

# ============================================================================
# EYETRAX IMPORT HANDLING
# ============================================================================
# EyeTrax may be installed in a custom environment (tf_env)
# This code handles both standard and custom installation paths

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


# ============================================================================
# CALIBRATION POINT CALCULATION
# ============================================================================

def calculate_9_point_calibration_targets(screen_width: int, screen_height: int) -> List[Tuple[int, int]]:
    """
    Calculate 9-point calibration targets using EyeTrax's calibration logic.
    This matches the point calculation from eyetrax.calibration.nine_point.run_9_point_calibration
    
    The 9 points form a 3×3 grid with 10% margin from screen edges:
    
    ┌─────────────────────────────────────┐
    │  (1)        (5)        (2)          │  <- 10% from top
    │                                     │
    │  (6)        (0)        (7)          │  <- Center row
    │                                     │
    │  (3)        (8)        (4)          │  <- 10% from bottom
    └─────────────────────────────────────┘
       ↑                        ↑
    10% left                 10% right
    
    Order: center first (0), then corners (1-4), then edges (5-8)
    
    Returns list of (x, y) pixel coordinates for calibration points.
    """
    mx, my = int(screen_width * 0.1), int(screen_height * 0.1)  # 10% margin
    gw, gh = screen_width - 2 * mx, screen_height - 2 * my      # Grid dimensions
    
    # EyeTrax's 9-point calibration order: center, corners, then edges
    # (row, col) where 0=left/top, 1=center, 2=right/bottom
    order = [(1, 1), (0, 0), (2, 0), (0, 2), (2, 2), (1, 0), (0, 1), (2, 1), (1, 2)]
    
    # Convert grid positions to pixel coordinates
    pts = [(mx + int(c * (gw / 2)), my + int(r * (gh / 2))) for (r, c) in order]
    return pts


# ============================================================================
# GAZE TRACKING SERVICE CLASS
# ============================================================================

class GazeTrackingService:
    """
    Service for gaze tracking using EyeTrax library.
    
    Uses EyeTrax's GazeEstimator with these core methods:
    - extract_features(image) -> (features, blink_detected)
    - train(X, y) -> Train regression model
    - predict(features) -> Predicted screen coordinates
    
    Workflow:
    1. Initialize: Create GazeEstimator, load existing model if available
    2. Calibrate: Collect frames at 9 points, train model
    3. Predict: For each new frame, extract features and predict gaze
    """
    
    def __init__(self):
        """Initialize service with default values."""
        self.estimator: Optional[GazeEstimator] = None
        self.is_calibrated = False
        self.model_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "models", "gaze_model.pkl")
        # Default screen dimensions (will be updated from frontend during calibration)
        self.screen_width = 1920
        self.screen_height = 1080
    
    def initialize(self) -> bool:
        """
        Initialize the EyeTrax GazeEstimator.
        
        Steps:
        1. Check if EyeTrax is available
        2. Create GazeEstimator instance
        3. Try to load existing calibrated model
        
        Returns True if initialization succeeds.
        """
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
        
        EyeTrax's GazeEstimator doesn't have a built-in save method,
        so we manually save the trained model components:
        - model: The trained Ridge regression model
        - scaler: StandardScaler for feature normalization
        - variable_scaling: Optional per-variable scaling
        - screen dimensions: For coordinate conversion
        """
        try:
            if not self.estimator or not self.is_calibrated:
                return False
            
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
        
        Restores all model components saved by _save_model.
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
        
        Frontend sends webcam frames as base64-encoded strings.
        EyeTrax's extract_features expects BGR format images.
        
        Handles:
        - Data URL prefix removal (data:image/jpeg;base64,...)
        - Various image formats (RGB, RGBA, Grayscale)
        - Conversion to BGR (OpenCV/EyeTrax requirement)
        """
        try:
            # Remove data URL prefix if present
            if ',' in base64_string:
                base64_string = base64_string.split(',')[1]
            
            # Decode base64 to bytes, then to PIL Image
            image_data = base64.b64decode(base64_string)
            image = Image.open(BytesIO(image_data))
            
            # Convert to numpy array
            image_np = np.array(image)
            
            # Handle different image formats and convert to BGR
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
        
        EyeTrax pipeline (matching their demo code):
        1. extract_features(image) -> (features, blink_detected)
        2. predict([features]) -> array of [x, y] in screen pixels
        3. Normalize to 0-1 range for frontend
        
        Returns:
            Tuple of (x, y) normalized coordinates (0-1), or None if prediction fails
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
            
            # Use EyeTrax's extract_features method
            features, blink_detected = self.estimator.extract_features(frame)
            
            if features is not None and not blink_detected:
                # Use EyeTrax's predict method - expects array of features
                predictions = self.estimator.predict(np.array([features]))
                x, y = predictions[0]  # Get first prediction
                
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
        
        Used during calibration to verify frame quality:
        - Is a face detected?
        - Is the user blinking?
        
        If either check fails, the frame should be discarded.
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
        
        Process:
        1. For each calibration frame:
           - Extract eye features using EyeTrax
           - Associate with target screen position
        2. Train Ridge regression model: features → screen coordinates
        3. Save trained model for future use
        
        Args:
            calibration_data: List of dicts with keys: 'frame', 'target_x', 'target_y'
                             target_x, target_y are normalized coordinates (0-1)
            screen_width: Screen width in pixels
            screen_height: Screen height in pixels
        
        Returns:
            True if calibration succeeds (at least 9 valid samples)
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
            
            # Collect features and targets from calibration data
            features_list = []
            targets_list = []
            face_not_detected_count = 0
            blink_detected_count = 0
            successful_extractions = 0
            
            for idx, cal_point in enumerate(calibration_data):
                frame_base64 = cal_point.get('frame', '')
                target_x_norm = cal_point.get('target_x', 0.0)  # Normalized (0-1)
                target_y_norm = cal_point.get('target_y', 0.0)
                
                if not frame_base64 or len(frame_base64) < 100:
                    print(f"Frame {idx}: Invalid or empty frame data")
                    continue
                
                try:
                    # Convert to BGR image
                    frame = self.base64_to_image(frame_base64)
                    
                    if frame is None or frame.size == 0:
                        print(f"Frame {idx}: Failed to convert base64 to image")
                        continue
                    
                    # Use EyeTrax's extract_features method
                    features, blink = self.estimator.extract_features(frame)
                    
                    if features is not None and not blink:
                        features_list.append(features)
                        # Convert normalized coordinates to screen pixel coordinates
                        target_x_px = target_x_norm * screen_width
                        target_y_px = target_y_norm * screen_height
                        targets_list.append([target_x_px, target_y_px])
                        successful_extractions += 1
                        
                        if idx % 30 == 0:  # Log every 30th frame
                            print(f"Frame {idx}: Features extracted, target=({target_x_px:.0f}, {target_y_px:.0f})")
                    elif features is None:
                        face_not_detected_count += 1
                    elif blink:
                        blink_detected_count += 1
                except Exception as e:
                    print(f"Error processing calibration frame {idx}: {e}")
                    continue
            
            print(f"Calibration summary:")
            print(f"  - Successful extractions: {successful_extractions}")
            print(f"  - Face not detected: {face_not_detected_count}")
            print(f"  - Blink detected: {blink_detected_count}")
            
            if len(features_list) < 9:  # Need at least 9 samples
                print(f"ERROR: Not enough samples: {len(features_list)} (need 9)")
                return False
            
            print(f"Training EyeTrax model with {len(features_list)} samples...")
            
            # Train the model using EyeTrax's train method
            X = np.array(features_list)
            y = np.array(targets_list)
            self.estimator.train(X, y)
            self.is_calibrated = True
            
            print(f"✓ EyeTrax model trained successfully")
            
            # Save model
            try:
                os.makedirs(os.path.dirname(self.model_path), exist_ok=True)
                if self._save_model(self.model_path):
                    print(f"✓ Model saved to {self.model_path}")
            except Exception as e:
                print(f"Warning: Could not save model: {e}")
            
            return True
        except Exception as e:
            print(f"ERROR: Error calibrating: {e}")
            import traceback
            traceback.print_exc()
            return False
    
    def get_calibration_status(self) -> bool:
        """Check if the EyeTrax estimator is calibrated and ready."""
        return self.is_calibrated and self.estimator is not None and self.estimator.model is not None
    
    def save_model(self, path: Optional[str] = None) -> bool:
        """Public method to save the calibrated model."""
        if not self.estimator or not self.is_calibrated:
            return False
        
        try:
            save_path = path or self.model_path
            os.makedirs(os.path.dirname(save_path), exist_ok=True)
            return self._save_model(save_path)
        except Exception as e:
            print(f"Error saving model: {e}")
            return False


# ============================================================================
# SINGLETON INSTANCE
# ============================================================================

# Global instance - ensures only one GazeTrackingService exists
_gaze_service: Optional[GazeTrackingService] = None

def get_gaze_service() -> GazeTrackingService:
    """
    Get or create the global gaze tracking service.
    
    Uses singleton pattern because:
    1. Only one webcam can be used at a time
    2. Calibrated model should persist across requests
    3. No need to re-initialize EyeTrax repeatedly
    """
    global _gaze_service
    if _gaze_service is None:
        _gaze_service = GazeTrackingService()
        success = _gaze_service.initialize()
        if not success:
            print("WARNING: Gaze tracking service initialization failed")
    return _gaze_service
```

**Key Concepts Explained:**

| Concept | Explanation |
|---------|-------------|
| **EyeTrax** | Open-source gaze estimation library that uses facial landmarks and eye features |
| **Singleton Pattern** | Only one instance of gaze service exists, shared across all requests |
| **Pickle** | Python's serialization format for saving/loading trained models |
| **BGR Format** | OpenCV's default color format (Blue-Green-Red instead of RGB) |
| **Ridge Regression** | Linear model used by EyeTrax for gaze prediction |
| **Feature Extraction** | EyeTrax detects face, extracts eye regions, computes features |

**9-Point Calibration Grid:**
```
┌─────────────────────────────────────┐
│  (1)        (5)        (2)          │
│                                     │
│  (6)        (0)        (7)          │
│                                     │
│  (3)        (8)        (4)          │
└─────────────────────────────────────┘
```
- Point 0: Center (calibrated first)
- Points 1-4: Corners
- Points 5-8: Edge midpoints

---

## 4.13 app/models/user.py - Database Models (Complete - 157 lines)

This file defines MongoDB data models and operations for users and the encrypted vault.

```python
"""
User and Vault models for MongoDB.

This module provides:
1. UserModel - User account management and PIN storage
2. VaultModel - Encrypted report storage using GridFS

Key Design Principles:
- PIN is never stored directly (only encrypted sentinel)
- Reports are stored encrypted (server never sees plaintext)
- GridFS handles large files (PDFs can be several MB)
"""
from pymongo.collection import Collection
from pymongo.errors import OperationFailure
from gridfs import GridFS
from datetime import datetime
from typing import Optional
from app.database import get_database


# ============================================================================
# COLLECTION ACCESSORS
# ============================================================================

def get_users_collection() -> Collection:
    """
    Get users collection.
    
    Collection stores:
    - email: User's email (unique identifier)
    - name: User's display name
    - pin_sentinel: Encrypted sentinel for PIN verification
    - pin_set: Boolean flag indicating if PIN is configured
    - created_at: Account creation timestamp
    """
    return get_database()["users"]


def get_vault_collection() -> Collection:
    """
    Get vault collection for report metadata.
    
    Collection stores:
    - gridfs_id: Reference to encrypted content in GridFS
    - owner_email: User who owns this report
    - filename: Original filename
    - created_at: When report was saved
    """
    return get_database()["vault"]


def get_gridfs() -> GridFS:
    """
    Get GridFS instance for storing large files.
    
    GridFS is MongoDB's solution for files > 16MB:
    - Splits files into 255KB chunks
    - Stores chunks in fs.chunks collection
    - Stores metadata in fs.files collection
    
    We use it for encrypted PDFs which can be several MB.
    """
    return GridFS(get_database())


# ============================================================================
# USER MODEL
# ============================================================================

class UserModel:
    """
    User model operations.
    
    All methods are static - called on class, not instance.
    Example: UserModel.find_by_email("user@example.com")
    """
    
    @staticmethod
    def find_by_email(email: str) -> Optional[dict]:
        """
        Find user by email.
        
        Returns user document or None if not found.
        """
        try:
            return get_users_collection().find_one({"email": email})
        except Exception as e:
            raise Exception(f"Database error: {str(e)}")
    
    @staticmethod
    def create_user(email: str, name: str) -> dict:
        """
        Create a new user.
        
        Initial state:
        - pin_set: False (user hasn't set up vault PIN yet)
        - created_at: Current UTC time
        
        Returns the created user document with _id included.
        """
        try:
            user = {
                "email": email,
                "name": name,
                "created_at": datetime.utcnow(),
                "pin_set": False
            }
            result = get_users_collection().insert_one(user)
            user["_id"] = result.inserted_id
            return user
        except Exception as e:
            raise Exception(f"Database error: {str(e)}")
    
    @staticmethod
    def set_pin_sentinel(email: str, encrypted_sentinel: str):
        """
        Set PIN sentinel for user.
        
        The sentinel pattern:
        1. Frontend encrypts known text "AUTISM_SCREENING_PIN_CHECK" with user's PIN
        2. This encrypted sentinel is stored in database
        3. To verify PIN later, frontend encrypts same text and compares
        
        This way, the actual PIN is NEVER stored anywhere!
        """
        get_users_collection().update_one(
            {"email": email},
            {
                "$set": {
                    "pin_sentinel": encrypted_sentinel,
                    "pin_set": True,
                    "pin_set_at": datetime.utcnow()
                }
            }
        )
    
    @staticmethod
    def get_pin_sentinel(email: str) -> Optional[str]:
        """
        Get PIN sentinel for user.
        
        Returns the encrypted sentinel string, or None if not set.
        Frontend uses this to verify if entered PIN is correct.
        """
        user = get_users_collection().find_one(
            {"email": email},
            {"pin_sentinel": 1}  # Projection: only return pin_sentinel field
        )
        return user.get("pin_sentinel") if user else None
    
    @staticmethod
    def is_pin_set(email: str) -> bool:
        """
        Check if PIN is set for user.
        
        Used to determine whether to show PIN setup or PIN verify modal.
        """
        user = get_users_collection().find_one(
            {"email": email},
            {"pin_set": 1}
        )
        return user.get("pin_set", False) if user else False


# ============================================================================
# VAULT MODEL
# ============================================================================

class VaultModel:
    """
    Vault model operations using GridFS for large files.
    
    IMPORTANT: All content stored here is ENCRYPTED.
    The server never sees decrypted content.
    
    Storage architecture:
    - Metadata (filename, owner, dates) in 'vault' collection
    - Encrypted content in GridFS (handles large files)
    """
    
    @staticmethod
    def save_report(email: str, filename: str, encrypted_content: str) -> str:
        """
        Save encrypted report to vault using GridFS.
        
        Steps:
        1. Store encrypted content in GridFS (handles large files)
        2. Store metadata in vault collection (for quick queries)
        3. Return metadata ID for future reference
        
        Args:
            email: Owner's email
            filename: Original filename (e.g., "Screening_Report_2024-01-20.pdf")
            encrypted_content: AES-encrypted PDF content (base64 string)
        
        Returns:
            String ID of the saved report (metadata ID)
        """
        try:
            fs = get_gridfs()
            
            # Store encrypted content in GridFS
            grid_file_id = fs.put(
                encrypted_content.encode('utf-8'),  # Convert string to bytes
                filename=filename,
                owner_email=email,
                upload_date=datetime.utcnow()
            )
            
            # Store metadata in regular collection for querying
            metadata = {
                "gridfs_id": grid_file_id,  # Link to GridFS content
                "owner_email": email,
                "filename": filename,
                "created_at": datetime.utcnow()
            }
            result = get_vault_collection().insert_one(metadata)
            
            # Return the metadata ID (not GridFS ID) for consistency
            return str(result.inserted_id)
        except Exception as e:
            raise Exception(f"Database error saving report: {str(e)}")
    
    @staticmethod
    def list_user_reports(email: str) -> list:
        """
        List all reports for a user.
        
        Returns list of report metadata, sorted newest first.
        Does NOT include encrypted content (for performance).
        """
        try:
            reports = get_vault_collection().find(
                {"owner_email": email},
                {"filename": 1, "created_at": 1, "_id": 1, "gridfs_id": 1}
            ).sort("created_at", -1)  # -1 = descending (newest first)
            return list(reports)
        except Exception as e:
            raise Exception(f"Database error listing reports: {str(e)}")
    
    @staticmethod
    def get_report(report_id: str, email: str) -> Optional[dict]:
        """
        Get a specific report by ID.
        
        Security: Requires matching email (ownership verification).
        Returns encrypted content for frontend to decrypt.
        
        Args:
            report_id: The metadata ID (string)
            email: Owner's email (for verification)
        
        Returns:
            Dict with id, encrypted_content, filename
            Or None if not found or wrong owner
        """
        from bson import ObjectId
        try:
            # Get metadata (verify ownership by email)
            metadata = get_vault_collection().find_one({
                "_id": ObjectId(report_id),
                "owner_email": email  # Security: only return if owner matches
            })
            
            if not metadata:
                return None
            
            # Get encrypted content from GridFS
            fs = get_gridfs()
            grid_file = fs.get(metadata["gridfs_id"])
            encrypted_content = grid_file.read().decode('utf-8')
            
            return {
                "id": str(metadata["_id"]),
                "encrypted_content": encrypted_content,  # Still encrypted!
                "filename": metadata["filename"]
            }
        except Exception as e:
            raise Exception(f"Database error retrieving report: {str(e)}")
```

**Key Concepts Explained:**

| Concept | Explanation |
|---------|-------------|
| **GridFS** | MongoDB feature for storing files > 16MB, splits into 255KB chunks |
| **Static Methods** | Called on class, not instance: `UserModel.find_by_email()` |
| **ObjectId** | MongoDB's unique 12-byte identifier for documents |
| **PIN Sentinel** | Known text encrypted with PIN - used to verify PIN without storing it |
| **Projection** | MongoDB query optimization - only fetch needed fields |

**Data Flow for Vault:**

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Frontend   │────▶│   server    │────▶│  MongoDB    │
│ (encrypts)  │     │ (stores)    │     │  (GridFS)   │
└─────────────┘     └─────────────┘     └─────────────┘
      │                    │                   │
   User's PIN        Never sees           Encrypted
   encrypts PDF      decrypted            content only
                     content
```

---

# 5. Frontend Code Explained


## 5.1 src/App.tsx - The Main Component (Complete - 277 lines)

This is the root component that sets up routing, providers, and manages screening data state.

```tsx
/**
 * App.tsx - Main Application Component
 * 
 * Responsibilities:
 * 1. Set up React Router for navigation
 * 2. Wrap app with providers (Google OAuth, Auth, PIN)
 * 3. Manage screening data state in sessionStorage
 * 4. Define all application routes
 */
import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'
import HomePage from './pages/Homepage'
import ConsentPage from './pages/ConsentPage'
import AgeCheckPage from './pages/AgeCheckPage'
import QuestionnairePage from './pages/QuestionnairePage'
import FacialAnalysisPage from './pages/FacialAnalysisPage'
import GazeAnalysisPage from './pages/GazeAnalysisPage'
import ReportPage from './pages/ReportPage'
import HistoryPage from './pages/HistoryPage'
import { ScreeningData } from './types'
import { AuthProvider } from './contexts/AuthContext'
import { PinProvider } from './contexts/PinContext'
import PinGate from './components/PinGate'
import './App.css'

// Google OAuth Client ID (from Google Cloud Console)
const GOOGLE_CLIENT_ID = ""

// Store screening data in sessionStorage for routing (cleared on session end)
const STORAGE_KEY = 'autism_screening_data'

function App() {
  // Initialize state from sessionStorage (survives page refresh)
  const [screeningData, setScreeningData] = useState<ScreeningData | null>(() => {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })

  // Sync state to sessionStorage whenever it changes
  useEffect(() => {
    if (screeningData) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(screeningData))
    } else {
      sessionStorage.removeItem(STORAGE_KEY)
    }
  }, [screeningData])

  // Clear all session data and redirect to home
  const clearSession = () => {
    setScreeningData(null)
    sessionStorage.removeItem(STORAGE_KEY)
    window.location.href = '/'
  }

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <PinProvider>
          <Router>
            <div className="App">
              {/* PinGate wraps Routes to enforce global PIN security */}
              <PinGate>
                <Routes>
                  {/* Home page - landing with Google Sign-In */}
                  <Route path="/" element={<HomePage />} />
                  
                  {/* History page - view saved reports */}
                  <Route path="/history" element={<HistoryPage />} />
                  
                  {/* Consent page - privacy agreement */}
                  <Route 
                    path="/consent" 
                    element={<ConsentPage onConsent={() => {}} />} 
                  />
                  
                  {/* Age verification - validates child is 4-17 */}
                  <Route 
                    path="/age-check" 
                    element={
                      <AgeCheckPage 
                        onAgeConfirmed={(age) => {
                          const newData: ScreeningData = { childAge: age, questionnaireType: null }
                          setScreeningData(newData)
                        }} 
                      />
                    } 
                  />
                  
                  {/* Questionnaire - AQ-10 or SCQ */}
                  <Route 
                    path="/questionnaire" 
                    element={
                      <QuestionnaireWrapper 
                        screeningData={screeningData}
                        onUpdate={(data) => setScreeningData(data)}
                      />
                    } 
                  />
                  
                  {/* Facial analysis - optional photo upload */}
                  <Route 
                    path="/facial" 
                    element={
                      <FacialAnalysisWrapper 
                        screeningData={screeningData}
                        onUpdate={(data) => setScreeningData(data)}
                      />
                    } 
                  />
                  
                  {/* Gaze analysis - webcam-based tracking */}
                  <Route 
                    path="/gaze" 
                    element={
                      <GazeAnalysisWrapper 
                        screeningData={screeningData}
                        onUpdate={(data) => setScreeningData(data)}
                      />
                    } 
                  />
                  
                  {/* Report - final results and PDF generation */}
                  <Route 
                    path="/report" 
                    element={
                      <ReportPage 
                        screeningData={screeningData}
                        onClearSession={clearSession}
                      />
                    } 
                  />
                </Routes>
              </PinGate>
            </div>
          </Router>
        </PinProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  )
}

/**
 * QuestionnaireWrapper - Handles questionnaire flow with low-risk modal
 * 
 * When questionnaire shows "Low" risk, displays modal offering choice
 * to continue with additional screening or go directly to report.
 */
function QuestionnaireWrapper({ screeningData, onUpdate }: { 
  screeningData: ScreeningData | null, 
  onUpdate: (data: ScreeningData) => void 
}) {
  const navigate = useNavigate()
  const [showLowRiskModal, setShowLowRiskModal] = React.useState(false)
  const [questionnaireResult, setQuestionnaireResult] = React.useState<any>(null)
  
  // Redirect if no age was entered
  if (!screeningData?.childAge) {
    return <Navigate to="/age-check" replace />
  }

  const handleQuestionnaireComplete = (result: any) => {
    const newData = { ...screeningData, questionnaire: result }
    onUpdate(newData)
    
    if (result.risk_category === 'Low') {
      // Show popup for low risk - user can choose to continue or view report
      setQuestionnaireResult(result)
      setShowLowRiskModal(true)
    } else {
      // Medium/High risk - automatically proceed to facial analysis
      navigate('/facial')
    }
  }

  const handleContinueWithOtherFeatures = () => {
    setShowLowRiskModal(false)
    navigate('/facial')
  }

  const handleGoToReport = () => {
    setShowLowRiskModal(false)
    navigate('/report')
  }

  return (
    <>
      <QuestionnairePage
        childAge={screeningData.childAge}
        onComplete={handleQuestionnaireComplete}
        onSkip={() => navigate('/report')}
      />
      
      {/* Low Risk Modal/Popup */}
      {showLowRiskModal && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
          padding: '1rem'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '2.5rem',
            maxWidth: '500px',
            width: '100%',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✅</div>
              <h2 style={{ fontSize: '1.8rem', color: '#27ae60', marginBottom: '1rem' }}>
                Low Risk Assessment
              </h2>
              <p style={{ fontSize: '1.1rem', color: '#666', lineHeight: '1.6' }}>
                The questionnaire results indicate a <strong>low risk</strong> of autism spectrum traits.
              </p>
              <p style={{ fontSize: '1rem', color: '#666' }}>
                You can continue with additional screening features or proceed to your report.
              </p>
            </div>

            <div style={{ 
              backgroundColor: '#e8f5e9', 
              padding: '1rem', 
              borderRadius: '10px',
              marginBottom: '1.5rem',
              border: '1px solid #27ae60'
            }}>
              <p style={{ margin: 0, fontSize: '0.95rem', color: '#2e7d32', textAlign: 'center' }}>
                <strong>Score:</strong> {questionnaireResult?.score}/{questionnaireResult?.max_score} | 
                <strong> Risk Category:</strong> {questionnaireResult?.risk_category}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button className="btn btn-secondary" onClick={handleGoToReport} style={{ flex: 1 }}>
                View Report
              </button>
              <button className="btn btn-primary" onClick={handleContinueWithOtherFeatures} style={{ flex: 1 }}>
                Continue Screening
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

/**
 * FacialAnalysisWrapper - Passes callbacks to FacialAnalysisPage
 */
function FacialAnalysisWrapper({ screeningData, onUpdate }: { 
  screeningData: ScreeningData | null, 
  onUpdate: (data: ScreeningData) => void 
}) {
  const navigate = useNavigate()
  
  return (
    <FacialAnalysisPage
      onComplete={(result) => {
        const newData = screeningData ? { ...screeningData, facial: result } : null
        onUpdate(newData || { facial: result })
      }}
      onSkip={() => navigate('/gaze')}
    />
  )
}

/**
 * GazeAnalysisWrapper - Passes callbacks to GazeAnalysisPage
 */
function GazeAnalysisWrapper({ screeningData, onUpdate }: { 
  screeningData: ScreeningData | null, 
  onUpdate: (data: ScreeningData) => void 
}) {
  const navigate = useNavigate()
  
  return (
    <GazeAnalysisPage
      onComplete={(result) => {
        const newData = screeningData ? { ...screeningData, gaze: result } : null
        onUpdate(newData || { gaze: result })
      }}
      onSkip={() => navigate('/report')}
    />
  )
}

export default App
```

**Key Concepts Explained:**

| Concept | Explanation |
|---------|-------------|
| **Provider Pattern** | GoogleOAuthProvider, AuthProvider, PinProvider wrap app to share state |
| **sessionStorage** | Browser storage cleared when tab closes (unlike localStorage) |
| **Navigate component** | Redirects user to another route (like server redirect) |
| **Wrapper components** | QuestionnaireWrapper etc. add logic around page components |
| **Conditional rendering** | `showLowRiskModal && (...)` only renders when condition is true |

---

## 5.2 src/api/client.ts - API Client (Complete - 14 lines)

This file creates a configured Axios instance for all backend API calls.

```typescript
/**
 * client.ts - Axios API Client Configuration
 * 
 * Creates a pre-configured axios instance with:
 * - Base URL pointing to /api (proxied to backend)
 * - Default JSON content type header
 * 
 * Usage: import apiClient from '../api/client'
 *        apiClient.post('/questionnaire/submit', { answers: [...] })
 */
import axios from 'axios';

// All API calls go through /api prefix (Vite proxy forwards to backend)
const API_BASE_URL = '/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;
```

**Why Axios?**
- Simpler than fetch() for most use cases
- Automatic JSON parsing
- Easy error handling with try/catch
- Can set default headers (like Authorization)

---

## 5.3 src/types.ts - TypeScript Type Definitions (Complete - 76 lines)

This file defines all TypeScript interfaces used throughout the frontend.

```typescript
/**
 * types.ts - TypeScript Type Definitions
 * 
 * TypeScript interfaces define the SHAPE of data.
 * - Catches typos at compile time
 * - Enables autocomplete in editors
 * - Documents data structures
 */

/**
 * ScreeningData - Main state object for a screening session
 * Stored in sessionStorage, passed between pages
 */
export interface ScreeningData {
  childAge?: number;                            // Child's age (4-17)
  questionnaireType?: 'AQ10' | 'SCQ' | null;    // Selected questionnaire
  questionnaire?: QuestionnaireResult;          // Questionnaire results
  facial?: FacialResult;                        // Facial analysis results
  gaze?: GazeResult;                            // Gaze tracking results
  finalRisk?: RiskFusionResult;                 // Combined risk assessment
}

/**
 * QuestionnaireResult - Response from /questionnaire/submit endpoint
 */
export interface QuestionnaireResult {
  risk_category: 'Low' | 'Medium' | 'High';     // Risk classification
  score: number;                                 // Raw score
  max_score: number;                            // Maximum possible score
  interpretation: string;                        // Human-readable explanation
  recommendation: string;                        // Next steps advice
}

/**
 * FacialResult - Response from /facial/analyze endpoint
 */
export interface FacialResult {
  probability: number;                          // 0-1 probability of autism features
  confidence: number;                           // Model confidence level
  risk_category: 'Low' | 'Medium' | 'High';    // Risk classification
  risk_interpretation: string;                  // Human-readable explanation
  image_quality_check: {                        // Image validation info
    face_detected: boolean;
    num_faces: number;
    image_resolution: {
      width: number;
      height: number;
    };
    lighting_quality: string;
    frontal_pose: boolean;
    warnings: string[];
  };
}

/**
 * GazeResult - Response from /gaze/analyze endpoint
 */
export interface GazeResult {
  spi: number;                                  // Social Preference Index (-1 to +1)
  social_frames: number;                        // Frames looking at social content
  geometric_frames: number;                     // Frames looking at geometric content
  total_valid_frames: number;                   // Total valid gaze samples
  risk_category: 'Low' | 'Medium' | 'High';    // Risk classification
  interpretation: string;                        // Human-readable explanation
  recommendation: string;                        // Next steps advice
}

/**
 * RiskFusionResult - Response from /risk/fuse endpoint
 * Combines all assessment results into final risk
 */
export interface RiskFusionResult {
  final_risk_category: 'Low' | 'Medium' | 'High';
  confidence_score: number;
  interpretation: string;
  recommendation: string;
  component_scores: {
    questionnaire: {
      risk: string;
      weight: number;
    };
    gaze?: {
      risk: string;
      weight: number;
      spi: number;
    };
    facial?: {
      risk: string;
      weight: number;
      probability: number;
    };
  };
}

/**
 * Questionnaire - Structure of questionnaire data from backend
 */
export interface Questionnaire {
  type: 'AQ10' | 'SCQ';                         // Questionnaire type
  questions: string[];                           // Array of question texts
  answer_format: string;                         // Description of answer format
  num_questions: number;                         // Total number of questions
}
```

**Key TypeScript Concepts:**

| Concept | Explanation |
|---------|-------------|
| **interface** | Defines the shape of an object |
| **?:** | Optional property (may be undefined) |
| **'A' \| 'B'** | Union type - value must be one of these |
| **nested interfaces** | Objects within objects (like image_quality_check) |

---

## 5.4 src/contexts/AuthContext.tsx - User Authentication (Complete - 103 lines)

This React Context manages user authentication state across the entire application using Google OAuth.

```tsx
/**
 * AuthContext.tsx - User Authentication Context
 * 
 * This context provides:
 * 1. User state (email, name, pin_set status)
 * 2. JWT token management
 * 3. Google OAuth login flow
 * 4. Logout functionality
 * 5. Token persistence in localStorage
 */
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { GoogleLogin, CredentialResponse } from '@react-oauth/google'
import apiClient from '../api/client'

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface User {
  email: string
  name: string
  pin_set: boolean  // Whether user has set up a vault PIN
}

interface AuthContextType {
  user: User | null
  token: string | null
  login: (credentialResponse: CredentialResponse) => Promise<void>
  logout: () => void
  loading: boolean
}

// Create the context with undefined as default
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// ============================================================================
// CUSTOM HOOK - Use this in components to access auth state
// ============================================================================

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

// ============================================================================
// AUTH PROVIDER COMPONENT
// ============================================================================

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // On mount: Check for stored token (survives page refresh)
  useEffect(() => {
    const storedToken = localStorage.getItem('auth_token')
    const storedUser = localStorage.getItem('auth_user')
    
    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  /**
   * Login with Google OAuth
   * 
   * Flow:
   * 1. Google returns credential token
   * 2. We send it to our backend for verification
   * 3. Backend returns our own JWT + user info
   * 4. We store both in state and localStorage
   */
  const login = async (credentialResponse: CredentialResponse) => {
    try {
      if (!credentialResponse.credential) {
        throw new Error('No credential received')
      }

      // Send Google token to our backend
      const response = await apiClient.post('/auth/google', {
        token: credentialResponse.credential
      })

      const { access_token, user_email, user_name, pin_set } = response.data
      
      const userData: User = {
        email: user_email,
        name: user_name,
        pin_set: pin_set
      }

      setToken(access_token)
      setUser(userData)
      
      // Persist to localStorage (survives browser close)
      localStorage.setItem('auth_token', access_token)
      localStorage.setItem('auth_user', JSON.stringify(userData))
      
      // Set default authorization header for all future API requests
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    } catch (error: any) {
      console.error('Login error:', error)
      throw error
    }
  }

  /**
   * Logout - Clear all authentication state
   */
  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
    delete apiClient.defaults.headers.common['Authorization']
  }

  // Keep authorization header in sync with token
  useEffect(() => {
    if (token) {
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`
    }
  }, [token])

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}
```

**Key Concepts Explained:**

| Concept | Explanation |
|---------|-------------|
| **React Context** | Global state that any component can access without prop drilling |
| **Custom Hook** | `useAuth()` provides typed access to auth state |
| **localStorage** | Browser storage that persists across sessions/refreshes |
| **Bearer Token** | JWT sent with every API request for authentication |
| **CredentialResponse** | Object returned by Google Sign-In containing the credential token |

**Usage in Components:**
```tsx
// Any component can access auth state
const { user, login, logout, loading } = useAuth()

if (loading) return <Spinner />
if (!user) return <LoginButton />
return <UserMenu name={user.name} />
```

---

## 5.5 src/pages/ConsentPage.tsx - First Screen (Complete - 107 lines)

This is the first screen users see after clicking "Start Screening". It displays important disclaimers about privacy, data handling, and the nature of this screening tool. Users must check a consent checkbox before proceeding.

```tsx
/**
 * ConsentPage.tsx - Consent and Disclaimer Screen
 * 
 * This page provides:
 * 1. Privacy assurances (no data storage)
 * 2. Medical disclaimers (screening only, not diagnosis)
 * 3. Age range information (4-17 years)
 * 4. Consent checkbox requirement
 * 5. Navigation to age verification on consent
 */
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../App.css'

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface ConsentPageProps {
  onConsent: () => void  // Callback when user consents (passed from App.tsx)
}

// ============================================================================
// COMPONENT DEFINITION
// ============================================================================

const ConsentPage: React.FC<ConsentPageProps> = ({ onConsent }) => {
  // State: Track whether the consent checkbox is checked
  const [consented, setConsented] = useState(false)
  
  // Hook for programmatic navigation
  const navigate = useNavigate()

  /**
   * Handle consent button click
   * Only proceeds if checkbox is checked
   */
  const handleConsent = () => {
    if (consented) {
      navigate('/age-check')  // Navigate to age verification page
      onConsent()            // Notify parent component (App.tsx)
    }
  }

  return (
    <div className="privacy-banner">
      <div className="container">
        <div className="card">
          {/* Page Title */}
          <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#333' }}>
            Early Autism Screening Tool
          </h1>
          
          {/* Privacy Alert Banner */}
          <div className="alert alert-info" style={{ marginBottom: '2rem' }}>
            <p style={{ margin: 0, fontWeight: 'bold', fontSize: '1.1rem' }}>
              🔒 Your privacy is our priority. All data is processed in real-time and never stored.
            </p>
          </div>

          {/* Disclaimer Content Section */}
          <div style={{ textAlign: 'left', marginBottom: '2rem', lineHeight: '1.8' }}>
            <h2 style={{ color: '#667eea', marginBottom: '1rem' }}>Important Disclaimer</h2>
            <p style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>
              This tool is designed for <strong>early screening purposes only</strong> and is 
              <strong> NOT a medical diagnosis</strong>. It is intended to help identify potential 
              signs that may warrant further professional evaluation.
            </p>

            {/* Privacy & Data Protection List */}
            <h3 style={{ color: '#333', marginTop: '1.5rem', marginBottom: '0.5rem' }}>Privacy & Data Protection</h3>
            <ul style={{ marginLeft: '1.5rem', fontSize: '1.05rem' }}>
              <li>✓ No personal data, images, videos, or results are stored</li>
              <li>✓ All processing occurs in real-time, in memory only</li>
              <li>✓ All data is immediately discarded after the session ends</li>
              <li>✓ No user accounts or tracking systems</li>
              <li>✓ HTTPS-only secure communication</li>
            </ul>

            {/* Age Range Information */}
            <h3 style={{ color: '#333', marginTop: '1.5rem', marginBottom: '0.5rem' }}>Who Should Use This Tool</h3>
            <p style={{ fontSize: '1.05rem' }}>
              This screening tool is designed for children aged <strong>4 to under 18 years</strong>. 
              It is not suitable for toddlers, infants, or adults.
            </p>

            {/* Screening Methods Description */}
            <h3 style={{ color: '#333', marginTop: '1.5rem', marginBottom: '0.5rem' }}>What This Tool Does</h3>
            <p style={{ fontSize: '1.05rem' }}>
              The screening combines multiple assessment methods:
            </p>
            <ul style={{ marginLeft: '1.5rem', fontSize: '1.05rem' }}>
              <li>Questionnaire-based screening (AQ-10 or SCQ)</li>
              <li>Optional facial analysis (supporting signal only)</li>
              <li>Optional gaze tracking analysis (supporting signal only)</li>
            </ul>

            {/* Warning Alert */}
            <div className="alert alert-warning" style={{ marginTop: '2rem' }}>
              <p style={{ margin: 0, fontWeight: 'bold' }}>
                ⚠️ This tool does not provide a diagnosis. If you have concerns about your child's 
                development, please consult with a qualified healthcare professional, developmental 
                pediatrician, or autism specialist.
              </p>
            </div>
          </div>

          {/* Consent Checkbox */}
          <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', fontSize: '1.1rem' }}>
              <input
                type="checkbox"
                checked={consented}
                onChange={(e) => setConsented(e.target.checked)}
                style={{ width: '24px', height: '24px', marginRight: '1rem', cursor: 'pointer' }}
              />
              <span>
                I am a parent or legal caregiver, and I understand that this is a screening tool 
                only, not a diagnosis. I consent to using this tool and understand that no data 
                will be stored.
              </span>
            </label>
          </div>

          {/* Consent Button - Disabled until checkbox is checked */}
          <button
            className="btn btn-primary"
            onClick={handleConsent}
            disabled={!consented}
            style={{ width: '100%', fontSize: '1.2rem', padding: '1.2rem' }}
          >
            I Consent - Proceed to Screening
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConsentPage
```

**Key Concepts Explained:**

| Concept | Explanation |
|---------|-------------|
| **Props with callback** | `onConsent` function passed from parent to notify when consent is given |
| **Controlled checkbox** | `checked={consented}` + `onChange` keeps React in control of checkbox state |
| **Conditional button** | `disabled={!consented}` prevents proceeding without consent |
| **Inline styles** | Used for specific styling that doesn't warrant separate CSS classes |
| **Privacy-first design** | Clear communication that no data is stored or tracked |

---

## 5.6 src/pages/Homepage.tsx - Landing Page (Complete - 315 lines)

The main landing page featuring Google Sign-In integration, animated synaptic network visualization, feature cards, and "How it Works" steps. This is the first page users see when visiting the application.

```tsx
/**
 * Homepage.tsx - Main Landing Page
 * 
 * This page provides:
 * 1. Navigation bar with Google Sign-In
 * 2. Hero section with animated neural network visualization
 * 3. Feature cards showcasing screening methods
 * 4. Step-by-step "How it Works" section
 * 5. Call-to-action section
 * 6. Footer with legal links
 */
import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { GoogleLogin } from '@react-oauth/google'
import { useAuth } from '../contexts/AuthContext'
import '../App.css'

const HomePage: React.FC = () => {
  const navigate = useNavigate()
  const { user, login, logout } = useAuth()
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // NOTE: Manual PIN setup logic removed. 
  // PinGate.tsx now handles Global Triggers for PIN Setup and Unlock.

  // ============================================================================
  // CLICK OUTSIDE HANDLER - Close dropdown when clicking elsewhere
  // ============================================================================
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================
  
  const handleLoginSuccess = async (credentialResponse: any) => {
    try {
      await login(credentialResponse)
      // PinGate will detect the login state and trigger the appropriate modal automatically
    } catch (error) {
      console.error('Login failed:', error)
    }
  }

  const handleLogout = () => {
    logout()
    setShowDropdown(false)
  }

  const handleHistory = () => {
    navigate('/history')
    setShowDropdown(false)
  }

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  // ============================================================================
  // RENDER
  // ============================================================================
  return (
    <div className="home-page">
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="logo">
            <span className="logo-icon">🧠</span>
            <span className="logo-text">NeuroScreen</span>
          </div>
          <div className="nav-links">
            <button className="text-link" onClick={() => scrollToSection('features')}>Features</button>
            <button className="text-link" onClick={() => scrollToSection('how-it-works')}>How it Works</button>
            <button className="text-link" onClick={() => scrollToSection('about')}>About</button>
            {user ? (
              <div className="user-menu" ref={dropdownRef}>
                <button
                  className="btn-nav user-btn"
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  {user.name}
                </button>
                {showDropdown && (
                  <div className="user-dropdown">
                    <button className="dropdown-item" onClick={handleHistory}>
                      History
                    </button>
                    <button className="dropdown-item" onClick={handleLogout}>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <GoogleLogin
                onSuccess={handleLoginSuccess}
                onError={() => console.error('Login Failed')}
                useOneTap={false}
              />
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section with Animated Neural Network Visualization */}
      <header className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Empowering Parents with <br />
              <span className="highlight-text">Early Insight</span>
            </h1>
            <p className="hero-subtitle">
              A privacy-first, AI-powered screening tool for autism detection in children. 
              Combine clinical questionnaires with advanced facial and gaze analysis for a comprehensive preliminary assessment.
            </p>
            <div className="hero-buttons">
              <button 
                className="btn btn-primary btn-lg"
                onClick={() => navigate('/consent')}
              >
                Start Screening Now
              </button>
              <button 
                className="btn btn-outline btn-lg" 
                onClick={() => scrollToSection('features')}
              >
                Learn More
              </button>
            </div>
            <p className="privacy-note">
              🔒 Privacy Guaranteed: No data is stored or recorded.
            </p>
          </div>
          
          {/* Synaptic Network Visualization - Shows 3 connected nodes */}
          <div className="hero-visual-container">
            <div className="neural-network-viz">
              {/* SVG Layer for Animated Connections */}
              <svg className="network-connections" viewBox="0 0 500 500">
                <defs>
                  <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" style={{stopColor:'#667eea', stopOpacity:1}} />
                    <stop offset="100%" style={{stopColor:'#764ba2', stopOpacity:1}} />
                  </linearGradient>
                </defs>
                
                {/* Animated Lines connecting center to nodes */}
                <line x1="250" y1="250" x2="250" y2="90" className="connection-line line-1" />
                <line x1="250" y1="250" x2="400" y2="380" className="connection-line line-2" />
                <line x1="250" y1="250" x2="100" y2="380" className="connection-line line-3" />
                
                {/* Animated Data Packets traveling along connections */}
                <circle r="4" className="data-packet packet-1">
                  <animateMotion dur="2.5s" repeatCount="indefinite" path="M250,250 L250,90" keyPoints="0;1" keyTimes="0;1" />
                </circle>
                <circle r="4" className="data-packet packet-2">
                  <animateMotion dur="3s" repeatCount="indefinite" begin="0.5s" path="M250,250 L400,380" keyPoints="0;1" keyTimes="0;1" />
                </circle>
                <circle r="4" className="data-packet packet-3">
                  <animateMotion dur="3s" repeatCount="indefinite" begin="1s" path="M250,250 L100,380" keyPoints="0;1" keyTimes="0;1" />
                </circle>
              </svg>

              {/* Central Brain Core */}
              <div className="network-core">
                <div className="core-inner">
                  <span className="core-icon">🧠</span>
                </div>
                <div className="core-ring"></div>
              </div>

              {/* Node 1: Questionnaire (Top) */}
              <div className="network-node node-top">
                <div className="icon-badge blue-badge">📝</div>
                <div className="node-text">
                  <span className="node-title">Questionnaire</span>
                  <span className="node-desc">Standardized (AQ-10)</span>
                </div>
              </div>

              {/* Node 2: Gaze Tracking (Bottom Right) */}
              <div className="network-node node-right">
                <div className="icon-badge green-badge">👁️</div>
                <div className="node-text">
                  <span className="node-title">Gaze Tracking</span>
                  <span className="node-desc">Visual Preference</span>
                </div>
              </div>

              {/* Node 3: Facial Analysis (Bottom Left) */}
              <div className="network-node node-left">
                <div className="icon-badge purple-badge">👤</div>
                <div className="node-text">
                  <span className="node-title">Facial Analysis</span>
                  <span className="node-desc">AI Assessment</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section - Three Screening Methods */}
      <section id="features" className="features-section">
        <div className="section-header">
          <h2>Comprehensive Screening Suite</h2>
          <p>Our multi-modal approach combines three powerful assessment methods.</p>
        </div>
        
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon-wrapper blue">
              <span className="feature-icon">📋</span>
            </div>
            <h3>Clinical Questionnaires</h3>
            <p>
              Utilizes the renowned <strong>AQ-10</strong> and <strong>SCQ</strong> (Social Communication Questionnaire) standards to assess behavioral traits.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper purple">
              <span className="feature-icon">😶</span>
            </div>
            <h3>Facial Analysis</h3>
            <p>
              Optional AI-driven analysis that identifies potential facial markers often associated with developmental conditions.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper green">
              <span className="feature-icon">👀</span>
            </div>
            <h3>Gaze Tracking</h3>
            <p>
              Analyzes visual preference between social and geometric stimuli using just your webcam—a key indicator in early development.
            </p>
          </div>
        </div>
      </section>

      {/* How it Works - Step by Step Process */}
      <section id="how-it-works" className="steps-section">
        <div className="container">
          <div className="section-header">
            <h2>How It Works</h2>
            <p>Simple, fast, and completely private.</p>
          </div>
          <div className="steps-row">
            <div className="step-item">
              <div className="step-number">1</div>
              <h4>Consent & Age</h4>
              <p>Confirm eligibility and review our strict privacy policy.</p>
            </div>
            <div className="step-connector"></div>
            <div className="step-item">
              <div className="step-number">2</div>
              <h4>Questionnaire</h4>
              <p>Answer standard behavioral questions about the child.</p>
            </div>
            <div className="step-connector"></div>
            <div className="step-item">
              <div className="step-number">3</div>
              <h4>AI Analysis</h4>
              <p>Perform optional camera-based assessments.</p>
            </div>
            <div className="step-connector"></div>
            <div className="step-item">
              <div className="step-number">4</div>
              <h4>Instant Report</h4>
              <p>Get a comprehensive PDF report immediately.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section id="about" className="cta-section">
        <div className="cta-content">
          <h2>Ready to start the assessment?</h2>
          <p>It takes approximately 5-10 minutes and is completely free.</p>
          <button 
            className="btn btn-light btn-lg"
            onClick={() => navigate('/consent')}
          >
            Begin Screening Session
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-col">
            <h4>NeuroScreen</h4>
            <p>Advanced early detection tools accessible to everyone.</p>
          </div>
          
          <div className="footer-col">
            <h4>Legal</h4>
            <span>Privacy Policy</span>
            <span>Terms of Use</span>
            <span className="disclaimer-text">Not a medical diagnosis tool.</span>
          </div>
          
          <div className="footer-col">
            <h4>Contact</h4>
            <span>Support</span>
            <span>FAQ</span>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} NeuroScreen Project. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default HomePage
```

**Key Concepts Explained:**

| Concept | Explanation |
|---------|-------------|
| **useRef** | Creates a reference to DOM elements (for dropdown click-outside detection) |
| **useEffect cleanup** | Returns a function to remove event listeners when component unmounts |
| **Conditional rendering** | `{user ? ... : ...}` shows different content based on login status |
| **SVG animations** | `<animateMotion>` creates data packet animations along paths |
| **Smooth scroll** | `scrollIntoView({ behavior: 'smooth' })` animates navigation to sections |
| **Google OAuth integration** | `<GoogleLogin>` component handles the entire OAuth flow |

---

---

## 5.7 src/pages/AgeCheckPage.tsx - Age Verification (Complete - 112 lines)

Collects and validates the child's age before proceeding with the screening. The tool is designed for children aged 4 to under 18 years.

```tsx
/**
 * AgeCheckPage.tsx - Age Verification Screen
 * 
 * This page provides:
 * 1. Age input field with validation
 * 2. Clear error messages for invalid ages
 * 3. Navigation back to home or forward to questionnaire
 * 4. Callback to parent component with verified age
 */
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../App.css'

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface AgeCheckPageProps {
  onAgeConfirmed: (age: number) => void  // Callback when age is valid
}

// ============================================================================
// COMPONENT DEFINITION
// ============================================================================

const AgeCheckPage: React.FC<AgeCheckPageProps> = ({ onAgeConfirmed }) => {
  const [age, setAge] = useState<string>('')
  const [error, setError] = useState<string>('')
  const navigate = useNavigate()

  /**
   * Validate age and proceed if valid
   * - Under 4: Too young, recommend pediatric consultation
   * - 4-17: Valid range, proceed to questionnaire
   * - 18+: Too old, recommend adult-focused resources
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const ageNum = parseInt(age)
    
    // Basic validation
    if (isNaN(ageNum) || ageNum < 1) {
      setError('Please enter a valid age.')
      return
    }

    // Too young
    if (ageNum < 4) {
      setError(
        'This tool is not designed for children under 4 years of age. ' +
        'We recommend consulting with a pediatric professional for children in this age group.'
      )
      return
    }

    // Too old (adult)
    if (ageNum >= 18) {
      setError(
        'This tool is not designed for children above 18 years of age. We recommend consulting with a professional for adults in this age group.'
      )
      return
    }

    // Age is valid (4 to 17)
    onAgeConfirmed(ageNum)  // Notify parent component (App.tsx)
    navigate('/questionnaire')
  }

  return (
    <>
      {/* Privacy reminder banner */}
      <div className="privacy-banner">
        <p>🔒 Your data is processed in real time and never stored</p>
      </div>
      
      <div className="container">
        <div className="card">
          <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#333' }}>
            Age Verification
          </h1>
          
          <p style={{ fontSize: '1.1rem', marginBottom: '2rem', color: '#666' }}>
            Please enter the child's age to proceed with the screening. This tool is designed 
            for children aged 4 to under 18 years.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Child's Age (in years)</label>
              <input
                type="number"
                className="form-input"
                value={age}
                onChange={(e) => {
                  setAge(e.target.value)
                  setError('')  // Clear error on input change
                }}
                min="1"
                max="25"
                placeholder="Enter age (4-18)"
                style={{ fontSize: '1.2rem', padding: '1rem' }}
                autoFocus
              />
            </div>

            {/* Error message display */}
            {error && (
              <div className="alert alert-error">
                <p style={{ margin: 0 }}>{error}</p>
              </div>
            )}

            {/* Navigation buttons */}
            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate('/')}
                style={{ flex: 1 }}
              >
                Go Back
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                style={{ flex: 1 }}
              >
                Continue
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default AgeCheckPage
```

**Key Concepts Explained:**

| Concept | Explanation |
|---------|-------------|
| **Props with callbacks** | Parent component passes `onAgeConfirmed` function to receive the validated age |
| **Form validation** | Multiple validation rules checked before allowing navigation |
| **Controlled input** | `value={age}` and `onChange` keep React in control of input value |
| **Fragment** | `<></>` allows returning multiple JSX elements without a wrapper div |
| **Error clearing** | Error is cleared when user starts typing to provide fresh feedback |

---

## 5.8 src/pages/QuestionnairePage.tsx - Questionnaire (Complete - 286 lines)

Handles questionnaire type selection (AQ-10 or SCQ), question display, answer tracking, and submission to the backend for scoring.

```tsx
/**
 * QuestionnairePage.tsx - Screening Questionnaire
 * 
 * This page provides:
 * 1. Questionnaire type selection (AQ-10 or SCQ)
 * 2. Question display with progress bar
 * 3. Answer selection with visual feedback
 * 4. Navigation between questions
 * 5. Submission to backend for scoring
 * 6. Parent notification via callback with results
 */
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import apiClient from '../api/client'
import { Questionnaire, QuestionnaireResult } from '../types'
import '../App.css'

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface QuestionnairePageProps {
  childAge: number                              // Age validated from previous screen
  onComplete: (result: QuestionnaireResult) => void  // Callback with results
  onSkip: () => void                           // Skip questionnaire
}

// ============================================================================
// COMPONENT DEFINITION
// ============================================================================

const QuestionnairePage: React.FC<QuestionnairePageProps> = ({ childAge, onComplete, onSkip }) => {
  // State for questionnaire selection and navigation
  const [questionnaireType, setQuestionnaireType] = useState<'AQ10' | 'SCQ' | null>(null)
  const [questionnaire, setQuestionnaire] = useState<Questionnaire | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>('')
  const navigate = useNavigate()

  // ============================================================================
  // LOAD QUESTIONS ON TYPE SELECTION
  // ============================================================================
  useEffect(() => {
    if (questionnaireType) {
      loadQuestions()
    }
  }, [questionnaireType])

  const loadQuestions = async () => {
    if (!questionnaireType) return
    
    setLoading(true)
    setError('')
    try {
      const response = await apiClient.get(`/questionnaire/questions/${questionnaireType}`)
      setQuestionnaire(response.data)
      // Initialize answers array with -1 (unanswered) for each question
      setAnswers(new Array(response.data.num_questions).fill(-1))
    } catch (err: any) {
      setError('Failed to load questions. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // ============================================================================
  // ANSWER HANDLERS
  // ============================================================================
  const handleAnswer = (answer: number) => {
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = answer
    setAnswers(newAnswers)
  }

  const handleNext = () => {
    if (answers[currentQuestion] === -1) {
      setError('Please select an answer before proceeding.')
      return
    }
    setError('')
    
    if (currentQuestion < questionnaire!.num_questions - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      handleSubmit()
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  // ============================================================================
  // SUBMIT QUESTIONNAIRE
  // ============================================================================
  const handleSubmit = async () => {
    if (answers.some(a => a === -1)) {
      setError('Please answer all questions before submitting.')
      return
    }

    setLoading(true)
    setError('')
    try {
      const response = await apiClient.post('/questionnaire/submit', {
        questionnaire_type: questionnaireType,
        answers: answers,
        child_age: childAge
      })
      // Let the parent component (QuestionnaireWrapper) handle navigation based on risk category
      onComplete(response.data)
      // Do NOT navigate here - parent will handle it
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to submit questionnaire. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // ============================================================================
  // RENDER: QUESTIONNAIRE TYPE SELECTION
  // ============================================================================
  if (!questionnaireType) {
    return (
      <>
        <div className="privacy-banner">
          <p>🔒 Your data is processed in real time and never stored</p>
        </div>
        <div className="container">
          <div className="card">
            <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#333' }}>
              Select Questionnaire
            </h1>
            <p style={{ fontSize: '1.1rem', marginBottom: '2rem', color: '#666' }}>
              Please choose which screening questionnaire you would like to complete:
            </p>

            <div style={{ display: 'flex', gap: '2rem', marginTop: '2rem' }}>
              {/* AQ-10 Option */}
              <div
                style={{
                  flex: 1,
                  padding: '2rem',
                  border: '2px solid #e0e0e0',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onClick={() => setQuestionnaireType('AQ10')}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#667eea'
                  e.currentTarget.style.backgroundColor = '#f0f4ff'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#e0e0e0'
                  e.currentTarget.style.backgroundColor = 'white'
                }}
              >
                <h2 style={{ color: '#667eea', marginBottom: '1rem' }}>AQ-10</h2>
                <p style={{ marginBottom: '0.5rem' }}><strong>Autism Spectrum Quotient - 10 items</strong></p>
                <p style={{ color: '#666' }}>10 questions, Yes/No answers</p>
              </div>

              {/* SCQ Option */}
              <div
                style={{
                  flex: 1,
                  padding: '2rem',
                  border: '2px solid #e0e0e0',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onClick={() => setQuestionnaireType('SCQ')}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#667eea'
                  e.currentTarget.style.backgroundColor = '#f0f4ff'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#e0e0e0'
                  e.currentTarget.style.backgroundColor = 'white'
                }}
              >
                <h2 style={{ color: '#667eea', marginBottom: '1rem' }}>SCQ</h2>
                <p style={{ marginBottom: '0.5rem' }}><strong>Social Communication Questionnaire</strong></p>
                <p style={{ color: '#666' }}>25 questions, No/Sometimes/Yes answers</p>
              </div>
            </div>

            <button
              className="btn btn-secondary"
              onClick={() => navigate('/age-check')}
              style={{ marginTop: '2rem', width: '100%' }}
            >
              Go Back
            </button>
          </div>
        </div>
      </>
    )
  }

  // ============================================================================
  // RENDER: LOADING STATE
  // ============================================================================
  if (loading && !questionnaire) {
    return (
      <>
        <div className="privacy-banner">
          <p>🔒 Your data is processed in real time and never stored</p>
        </div>
        <div className="container">
          <div className="card">
            <div className="spinner"></div>
            <p style={{ textAlign: 'center' }}>Loading questions...</p>
          </div>
        </div>
      </>
    )
  }

  if (!questionnaire) {
    return null
  }

  // ============================================================================
  // RENDER: QUESTION DISPLAY
  // ============================================================================
  const progress = ((currentQuestion + 1) / questionnaire.num_questions) * 100
  const answerOptions = questionnaireType === 'AQ10' 
    ? [
        { value: 0, label: 'No' },
        { value: 1, label: 'Yes' }
      ]
    : [
        { value: 0, label: 'No' },
        { value: 1, label: 'Sometimes' },
        { value: 2, label: 'Yes' }
      ]

  return (
    <>
      <div className="privacy-banner">
        <p>🔒 Your data is processed in real time and never stored</p>
      </div>
      <div className="container">
        <div className="card">
          {/* Header with progress */}
          <div style={{ marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: '#333' }}>
              {questionnaireType} Questionnaire
            </h1>
            <p style={{ color: '#666' }}>
              Question {currentQuestion + 1} of {questionnaire.num_questions}
            </p>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }}></div>
            </div>
          </div>

          {/* Question Card */}
          <div className="question-card">
            <div className="question-text">
              {questionnaire.questions[currentQuestion]}
            </div>

            {error && (
              <div className="alert alert-error" style={{ marginBottom: '1rem' }}>
                <p style={{ margin: 0 }}>{error}</p>
              </div>
            )}

            {/* Answer Buttons */}
            <div className="answer-options">
              {answerOptions.map((option) => (
                <button
                  key={option.value}
                  className={`answer-btn ${answers[currentQuestion] === option.value ? 'selected' : ''}`}
                  onClick={() => handleAnswer(option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button
              className="btn btn-secondary"
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              style={{ flex: 1 }}
            >
              Previous
            </button>
            {currentQuestion === questionnaire.num_questions - 1 ? (
              <button
                className="btn btn-primary"
                onClick={handleSubmit}
                disabled={loading || answers[currentQuestion] === -1}
                style={{ flex: 1 }}
              >
                {loading ? 'Submitting...' : 'Submit'}
              </button>
            ) : (
              <button
                className="btn btn-primary"
                onClick={handleNext}
                disabled={answers[currentQuestion] === -1}
                style={{ flex: 1 }}
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default QuestionnairePage
```

**Key Concepts Explained:**

| Concept | Explanation |
|---------|-------------|
| **Multi-step form** | Navigate between questions using `currentQuestion` index |
| **Conditional rendering** | Different screens based on state (`questionnaireType`, loading, questions) |
| **Array state** | Track all answers in array, update specific index when answered |
| **useEffect with dependency** | Load questions only when `questionnaireType` changes |
| **Dynamic answer options** | Different answer sets (Yes/No vs Yes/Sometimes/No) based on questionnaire type |
| **Visual selection feedback** | CSS class `selected` highlights the chosen answer |

---

## 5.9 src/pages/FacialAnalysisPage.tsx - Photo Upload (Complete - 207 lines)

Handles image selection with drag-and-drop style upload, preview, and submission to the backend for AI-powered facial analysis.

```tsx
/**
 * FacialAnalysisPage.tsx - Facial Image Analysis
 * 
 * This page provides:
 * 1. Styled file upload with drag-and-drop appearance
 * 2. Image preview before submission
 * 3. FormData submission to backend
 * 4. Memory cleanup after submission (privacy)
 * 5. Skip option for optional analysis
 */
import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import apiClient from '../api/client'
import { FacialResult } from '../types'
import '../App.css'

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface FacialAnalysisPageProps {
  onComplete: (result: FacialResult) => void  // Callback with analysis results
  onSkip: () => void                          // Skip this optional step
}

// ============================================================================
// COMPONENT DEFINITION
// ============================================================================

const FacialAnalysisPage: React.FC<FacialAnalysisPageProps> = ({ onComplete, onSkip }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  // ============================================================================
  // FILE SELECTION HANDLER
  // ============================================================================
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file.')
        return
      }
      setSelectedFile(file)
      setError('')
      
      // Create preview using FileReader
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // ============================================================================
  // SUBMIT FOR ANALYSIS
  // ============================================================================
  const handleSubmit = async () => {
    if (!selectedFile) {
      setError('Please select an image first.')
      return
    }

    setLoading(true)
    setError('')

    try {
      // Create FormData for file upload
      const formData = new FormData()
      formData.append('file', selectedFile)

      // Send to backend
      const response = await apiClient.post('/facial/analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      onComplete(response.data)
      
      // PRIVACY: Clear image from memory after submission
      setPreview(null)
      setSelectedFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      
      // Navigate to gaze analysis page
      setTimeout(() => navigate('/gaze'), 100)
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to analyze image. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // ============================================================================
  // RENDER
  // ============================================================================
  return (
    <>
      <div className="privacy-banner">
        <p>🔒 Your data is processed in real time and never stored</p>
      </div>
      <div className="container">
        <div className="card">
          <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#333' }}>
            Facial Analysis (Optional)
          </h1>
          
          <p style={{ fontSize: '1.1rem', marginBottom: '2rem', color: '#666' }}>
            Upload a clear frontal facial image of the child. This analysis provides a supporting 
            signal only and is not used as a primary diagnostic tool. The image will be processed 
            in real-time and immediately discarded.
          </p>

          {/* Requirements info box */}
          <div className="alert alert-info">
            <p style={{ margin: 0 }}>
              <strong>Requirements:</strong> Clear frontal face photo, good lighting, single face visible.
              The image will not be stored.
            </p>
          </div>

          {/* Upload Area */}
          <div style={{ marginTop: '2rem' }}>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
              id="file-input"
            />
            
            {/* Styled Label as Upload Button */}
            <label
              htmlFor="file-input"
              style={{
                display: 'block',
                padding: '2rem',
                border: '2px dashed #667eea',
                borderRadius: '12px',
                textAlign: 'center',
                cursor: 'pointer',
                backgroundColor: preview ? 'transparent' : '#f0f4ff',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                if (!preview) {
                  e.currentTarget.style.backgroundColor = '#e8edff'
                }
              }}
              onMouseLeave={(e) => {
                if (!preview) {
                  e.currentTarget.style.backgroundColor = '#f0f4ff'
                }
              }}
            >
              {preview ? (
                <div>
                  <img
                    src={preview}
                    alt="Preview"
                    style={{
                      maxWidth: '100%',
                      maxHeight: '400px',
                      borderRadius: '8px',
                      marginBottom: '1rem'
                    }}
                  />
                  <p style={{ color: '#667eea', fontWeight: 'bold' }}>
                    Click to change image
                  </p>
                </div>
              ) : (
                <div>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📷</div>
                  <p style={{ fontSize: '1.2rem', color: '#667eea', fontWeight: 'bold' }}>
                    Click to upload image
                  </p>
                  <p style={{ color: '#666', marginTop: '0.5rem' }}>
                    PNG, JPG, JPEG up to 10MB
                  </p>
                </div>
              )}
            </label>
          </div>

          {/* Error Display */}
          {error && (
            <div className="alert alert-error" style={{ marginTop: '1rem' }}>
              <p style={{ margin: 0 }}>{error}</p>
            </div>
          )}

          {/* Loading Indicator */}
          {loading && (
            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <div className="spinner"></div>
              <p>Analyzing image...</p>
            </div>
          )}

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button
              className="btn btn-secondary"
              onClick={() => {
                onSkip()
                navigate('/gaze')
              }}
              disabled={loading}
              style={{ flex: 1 }}
            >
              Skip This Step
            </button>
            <button
              className="btn btn-primary"
              onClick={handleSubmit}
              disabled={!selectedFile || loading}
              style={{ flex: 1 }}
            >
              Analyze Image
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default FacialAnalysisPage
```

**Key Concepts Explained:**

| Concept | Explanation |
|---------|-------------|
| **FormData** | Special object for sending files over HTTP multipart requests |
| **FileReader** | Reads file content to create base64 preview without uploading |
| **Hidden input** | Styled label triggers hidden file input for better UX |
| **useRef** | `fileInputRef` lets us programmatically reset the input after submission |
| **Memory cleanup** | Preview and file are cleared after submission for privacy |

---

## 5.10 src/pages/GazeAnalysisPage.tsx - Gaze Tracking (Complete - 155 lines)

Integrates the GazeTracker component for webcam-based gaze tracking during a visual preference video. Includes detailed user instructions and calibration guidance.

```tsx
/**
 * GazeAnalysisPage.tsx - Gaze Tracking Analysis
 * 
 * This page provides:
 * 1. Pre-tracking instructions and requirements
 * 2. Integration with GazeTracker component
 * 3. Gaze data collection during video playback
 * 4. Submission to backend for SPI calculation
 * 5. Skip option for optional analysis
 */
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import apiClient from '../api/client'
import { GazeResult } from '../types'
import GazeTracker from '../components/GazeTracker'
import '../App.css'

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface GazeDataPoint {
  timestamp: number      // Time in milliseconds
  x: number              // Normalized X coordinate (0-1)
  y: number              // Normalized Y coordinate (0-1)
  social_region: boolean // Whether looking at social side (left)
}

interface GazeAnalysisPageProps {
  onComplete: (result: GazeResult) => void  // Callback with analysis results
  onSkip: () => void                        // Skip this optional step
}

// ============================================================================
// COMPONENT DEFINITION
// ============================================================================

const GazeAnalysisPage: React.FC<GazeAnalysisPageProps> = ({ onComplete, onSkip }) => {
  const [isTracking, setIsTracking] = useState(false)
  const [error, setError] = useState<string>('')
  const navigate = useNavigate()

  /**
   * Handle gaze data from GazeTracker component
   * Submits to backend for Social Preference Index (SPI) calculation
   */
  const handleGazeData = async (gazeData: GazeDataPoint[]) => {
    if (gazeData.length === 0) {
      setError('No gaze data collected. Please try again.')
      setIsTracking(false)
      return
    }

    try {
      const videoDuration = 60 // 1 minute video
      const response = await apiClient.post('/gaze/analyze', {
        gaze_data: gazeData,
        video_duration: videoDuration
      })
      
      onComplete(response.data)
      setIsTracking(false)
      setTimeout(() => navigate('/report'), 100)
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to analyze gaze data. Please try again.')
      console.error(err)
      setIsTracking(false)
    }
  }

  const handleStartTracking = () => {
    setError('')
    setIsTracking(true)
  }

  const handleComplete = () => {
    // This will be called by GazeTracker when video ends
    // Data is already sent via handleGazeData
  }

  // ============================================================================
  // RENDER: GAZE TRACKER (FULLSCREEN MODE)
  // ============================================================================
  if (isTracking) {
    return (
      <GazeTracker
        onGazeData={handleGazeData}
        videoSrc="/geopref_1min.mp4"
        onComplete={handleComplete}
      />
    )
  }

  // ============================================================================
  // RENDER: INSTRUCTIONS SCREEN
  // ============================================================================
  return (
    <>
      <div className="privacy-banner">
        <p>🔒 Your data is processed in real time and never stored</p>
      </div>
      <div className="container">
        <div className="card">
          <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#333' }}>
            Gaze Analysis (Optional)
          </h1>
          
          <p style={{ fontSize: '1.1rem', marginBottom: '2rem', color: '#666' }}>
            This gaze tracking analysis uses your webcam to monitor eye movement while watching a video. 
            The video shows social scenes on the left side and geometric patterns on the right side. 
            This analysis provides a supporting signal only and is not a diagnostic tool.
          </p>

          {/* Detailed Instructions */}
          <div className="alert alert-info">
            <div style={{ marginBottom: '1rem' }}>
              <p style={{ margin: '0 0 0.5rem 0', fontWeight: 'bold', fontSize: '1.1rem' }}>
                Instructions:
              </p>
              <ol style={{ marginLeft: '1.5rem', lineHeight: '1.8' }}>
                <li><strong>Calibration:</strong> Before the video starts, you will complete a calibration task in fullscreen mode. <strong>Do not click</strong>—just look at each green target as it appears.</li>
                <li><strong>Blink Handling:</strong> If you blink during a point, that point will automatically restart until enough open-eye samples are collected.</li>
                <li><strong>Video Stimulus:</strong> After calibration, the video will play automatically in fullscreen mode.</li>
                <li><strong>Watch Naturally:</strong> Keep your face visible to the camera and watch the video naturally. The system will track where you're looking.</li>
                <li><strong>Debug Mode:</strong> Press the 'D' key during the video to toggle debug mode, which shows a red circle indicating where the system thinks you're looking.</li>
              </ol>
            </div>
            <p style={{ margin: '1rem 0 0 0', fontSize: '0.95rem', fontStyle: 'italic' }}>
              <strong>Note:</strong> Make sure you allow camera permissions when prompted. All processing happens in real-time and no data is stored.
            </p>
          </div>

          {/* Error Display */}
          {error && (
            <div className="alert alert-error" style={{ marginTop: '1rem' }}>
              <p style={{ margin: 0 }}>{error}</p>
            </div>
          )}

          {/* What to Expect Section */}
          <div style={{ 
            backgroundColor: '#f8f9fa',
            padding: '1.5rem',
            borderRadius: '12px',
            margin: '2rem 0',
            border: '1px solid #e0e0e0'
          }}>
            <h3 style={{ color: '#333', marginBottom: '1rem' }}>What to Expect:</h3>
            <ul style={{ marginLeft: '1.5rem', lineHeight: '1.8', color: '#666' }}>
              <li>The screen will go fullscreen for the calibration and video</li>
              <li>Look at each green target during calibration (9 targets total)</li>
              <li>If you blink during a target, it will automatically restart</li>
              <li>Watch the video naturally - no need to focus on a specific side</li>
              <li>Press ESC to exit fullscreen if needed</li>
              <li>Press 'D' key to see where the system thinks you're looking (debug mode)</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button
              className="btn btn-secondary"
              onClick={() => {
                onSkip()
                navigate('/report')
              }}
              style={{ flex: 1 }}
            >
              Skip This Step
            </button>
            <button
              className="btn btn-primary"
              onClick={handleStartTracking}
              style={{ flex: 1, fontSize: '1.2rem', padding: '1.2rem' }}
            >
              Start Gaze Tracking
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default GazeAnalysisPage
```

**Key Concepts Explained:**

| Concept | Explanation |
|---------|-------------|
| **State machine** | `isTracking` toggles between instructions and GazeTracker component |
| **Component composition** | GazeTracker handles all complex webcam and calibration logic |
| **Callbacks** | `onGazeData` receives collected gaze points when video ends |
| **Social/Geometric split** | Video shows social content on left, geometric on right to measure preference |
| **SPI calculation** | Backend calculates Social Preference Index from gaze data |

---

## 5.11 src/pages/ReportPage.tsx - Results Display (Complete - 559 lines)

Displays the final screening report with risk gauge, radar chart visualization, PDF generation, and secure vault saving.

```tsx
/**
 * ReportPage.tsx - Screening Report Display
 * 
 * This page provides:
 * 1. Final risk assessment with visual gauge
 * 2. Individual component results (questionnaire, facial, gaze)
 * 3. Spider/radar chart comparing to typical risk profiles
 * 4. PDF generation and download
 * 5. Secure save to encrypted vault
 * 6. Important disclaimers
 */
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import apiClient from '../api/client'
import { ScreeningData, RiskFusionResult } from '../types'
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import SecureSaveButton from '../components/SecureSaveButton'
import '../App.css'


// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface ReportPageProps {
  screeningData: ScreeningData | null  // All collected screening data
  onClearSession: () => void           // Callback to reset and start over
}


// ============================================================================
// RISK GAUGE COMPONENT - Visual semicircle gauge
// ============================================================================

const RiskGauge: React.FC<{ category: 'Low' | 'Medium' | 'High' }> = ({ category }) => {
  // SVG dimensions for semi-circle gauge
  const width = 220
  const height = 110
  const cx = width / 2      // Center X
  const cy = height - 8     // Center Y
  const r = 90              // Radius

  // Convert degrees to SVG coordinates
  const toXY = (deg: number) => {
    const rad = (deg * Math.PI) / 180
    return {
      x: cx + r * Math.cos(rad),
      y: cy + r * Math.sin(rad)
    }
  }

  // Three colored segments: Low (green), Medium (yellow), High (red)
  const segments = [
    { from: 180, to: 240, color: '#27ae60' },  // Low
    { from: 240, to: 300, color: '#f39c12' },  // Medium
    { from: 300, to: 360, color: '#e74c3c' }   // High
  ]

  // Needle angle based on risk category
  const categoryAngle = category === 'Low' ? 210
    : category === 'Medium' ? 270
    : 330

  // Needle endpoint calculation
  const needleLength = 70
  const needleRad = (categoryAngle * Math.PI) / 180
  const needleX = cx + needleLength * Math.cos(needleRad)
  const needleY = cy + needleLength * Math.sin(needleRad)

  return (
    <div className="risk-gauge-wrapper">
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        {/* Colored arc segments */}
        {segments.map((seg, idx) => {
          const start = toXY(seg.from)
          const end = toXY(seg.to)
          return (
            <path
              key={idx}
              d={`M ${start.x} ${start.y} A ${r} ${r} 0 0 1 ${end.x} ${end.y}`}
              stroke={seg.color}
              strokeWidth={14}
              fill="none"
              strokeLinecap="butt"
            />
          )
        })}

        {/* Needle pointing to current risk */}
        <line
          x1={cx}
          y1={cy}
          x2={needleX}
          y2={needleY}
          stroke="#333"
          strokeWidth={4}
          strokeLinecap="round"
        />
        <circle cx={cx} cy={cy} r={6} fill="#333" />

        {/* Center label */}
        <text
          x={cx}
          y={cy - 18}
          textAnchor="middle"
          fontSize="12"
          fontWeight="bold"
          fill="#333"
        >
          {category} Risk
        </text>
      </svg>
      <div className="risk-gauge-labels">
        <span>Low</span>
        <span>Medium</span>
        <span>High</span>
      </div>
    </div>
  )
}


// ============================================================================
// MAIN REPORT PAGE COMPONENT
// ============================================================================

const ReportPage: React.FC<ReportPageProps> = ({ screeningData, onClearSession }) => {
  const [finalRisk, setFinalRisk] = useState<RiskFusionResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>('')
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null)
  const navigate = useNavigate()
  const reportRef = React.useRef<HTMLDivElement>(null)

  // Redirect to home if no screening data
  useEffect(() => {
    if (!screeningData) {
      navigate('/')
      return
    }

    // Generate final risk fusion if we have questionnaire data
    if (screeningData.questionnaire) {
      generateFinalRisk()
    }
  }, [screeningData])

  // ============================================================================
  // RISK FUSION - Combine all assessments
  // ============================================================================
  const generateFinalRisk = async () => {
    if (!screeningData?.questionnaire) return

    setLoading(true)
    setError('')

    try {
      const response = await apiClient.post('/risk/fuse', {
        questionnaire: {
          risk_category: screeningData.questionnaire.risk_category,
          score: screeningData.questionnaire.score
        },
        facial: screeningData.facial ? {
          risk_category: screeningData.facial.risk_category,
          probability: screeningData.facial.probability
        } : null,
        gaze: screeningData.gaze ? {
          risk_category: screeningData.gaze.risk_category,
          spi: screeningData.gaze.spi
        } : null
      })

      setFinalRisk(response.data)
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to generate final risk assessment.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // ============================================================================
  // PDF GENERATION
  // ============================================================================
  const generatePDFBlob = async (): Promise<Blob> => {
    if (!reportRef.current) throw new Error('Report ref not available')

    const pdf = new jsPDF('p', 'mm', 'a4')
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = pdf.internal.pageSize.getHeight()

    // Word-like margins (approx): 25mm top/bottom, 20mm left/right
    const marginLeft = 20
    const marginRight = 20
    const marginTop = 25
    const marginBottom = 25

    const printableWidth = pdfWidth - marginLeft - marginRight
    const printableHeight = pdfHeight - marginTop - marginBottom

    // Find all report sections for multi-page PDF
    const sections = Array.from(
      reportRef.current.querySelectorAll<HTMLElement>('.report-section')
    )

    // Fallback: capture entire report if no section markers found
    if (sections.length === 0) {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
      })
      const imgData = canvas.toDataURL('image/jpeg')
      const ratio = printableWidth / canvas.width
      const scaledHeight = canvas.height * ratio
      pdf.addImage(
        imgData,
        'JPEG',
        marginLeft,
        marginTop,
        printableWidth,
        scaledHeight
      )
      return pdf.output('blob')
    }

    let firstPage = true
    let yCursor = marginTop

    // Process each section for multi-page support
    for (const section of sections) {
      const canvas = await html2canvas(section, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
      })

      const imgData = canvas.toDataURL('image/jpeg')
      const ratio = printableWidth / canvas.width
      const scaledHeight = canvas.height * ratio

      // Move to new page if section won't fit
      if (!firstPage && yCursor + scaledHeight > pdfHeight - marginBottom) {
        pdf.addPage()
        yCursor = marginTop
      }

      // Handle sections taller than a page
      if (scaledHeight > printableHeight) {
        let heightLeft = scaledHeight
        let offset = 0

        while (heightLeft > 0) {
          pdf.addImage(
            imgData,
            'JPEG',
            marginLeft,
            marginTop + offset,
            printableWidth,
            scaledHeight
          )
          heightLeft -= printableHeight
          offset -= printableHeight
          if (heightLeft > 0) {
            pdf.addPage()
          }
        }
        yCursor = marginTop
      } else {
        pdf.addImage(
          imgData,
          'JPEG',
          marginLeft,
          yCursor,
          printableWidth,
          scaledHeight
        )
        yCursor += scaledHeight + 5 // spacing between sections
      }

      firstPage = false
    }

    return pdf.output('blob')
  }

  const downloadPDF = async () => {
    try {
      const blob = await generatePDFBlob()
      setPdfBlob(blob)
      
      // Trigger download
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `autism-screening-report ${new Date().toISOString().split('T')[0]}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Error generating PDF:', err)
      alert('Failed to generate PDF. Please try again.')
    }
  }

  // Generate PDF blob when report is ready (for save button)
  useEffect(() => {
    if (finalRisk && reportRef.current) {
      generatePDFBlob().then(blob => {
        setPdfBlob(blob)
      }).catch(err => {
        console.error('Error generating PDF blob:', err)
      })
    }
  }, [finalRisk])

  // ============================================================================
  // HELPER FUNCTIONS
  // ============================================================================
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'High': return '#e74c3c'
      case 'Medium': return '#f39c12'
      case 'Low': return '#27ae60'
      default: return '#95a5a6'
    }
  }

  if (!screeningData) {
    return null
  }

  // ============================================================================
  // RADAR CHART DATA - Compare to typical risk profiles
  // ============================================================================
  const axes = ['Questionnaire', 'Facial Analysis', 'Gaze Analysis'] as const
  const baselineLow = 1
  const baselineMedium = 2
  const baselineHigh = 3

  const radarData = axes.map(axis => {
    let featureRisk = 0
    if (axis === 'Questionnaire' && screeningData.questionnaire) {
      featureRisk = screeningData.questionnaire.risk_category === 'High' ? 3 :
                    screeningData.questionnaire.risk_category === 'Medium' ? 2 : 1
    }
    if (axis === 'Facial Analysis' && screeningData.facial) {
      featureRisk = screeningData.facial.risk_category === 'High' ? 3 :
                    screeningData.facial.risk_category === 'Medium' ? 2 : 1
    }
    if (axis === 'Gaze Analysis' && screeningData.gaze) {
      featureRisk = screeningData.gaze.risk_category === 'High' ? 3 :
                    screeningData.gaze.risk_category === 'Medium' ? 2 : 1
    }

    return {
      feature: axis,
      Low: baselineLow,
      Medium: baselineMedium,
      High: baselineHigh,
      Child: featureRisk || 0
    }
  })

  // ============================================================================
  // RENDER
  // ============================================================================
  return (
    <>
      <div className="privacy-banner">
        <p>🔒 Your data is processed in real time and never stored</p>
      </div>
      <div className="container">
        <div className="card" ref={reportRef} style={{ backgroundColor: 'white', color: '#333' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#333', textAlign: 'center' }}>
            Screening Report
          </h1>

          <div className="alert alert-info" style={{ marginBottom: '2rem' }}>
            <p style={{ margin: 0, fontWeight: 'bold' }}>
              This is a screening report, not a medical diagnosis. Please consult with a healthcare 
              professional for comprehensive evaluation.
            </p>
          </div>

          {loading && (
            <div style={{ textAlign: 'center', margin: '2rem 0' }}>
              <div className="spinner"></div>
              <p>Generating final assessment...</p>
            </div>
          )}

          {error && (
            <div className="alert alert-error">
              <p style={{ margin: 0 }}>{error}</p>
            </div>
          )}

          {/* Final Risk Assessment with Gauge */}
          {finalRisk && (
            <div className="report-section" style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ color: '#333', marginBottom: '1.25rem', textAlign: 'center' }}>
                Final Risk Assessment
              </h2>

              {/* Visual gauge */}
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.75rem' }}>
                <RiskGauge category={finalRisk.final_risk_category as 'Low' | 'Medium' | 'High'} />
              </div>

              {/* Risk summary box */}
              <div
                style={{
                  padding: '1.75rem',
                  borderRadius: '12px',
                  backgroundColor: `${getRiskColor(finalRisk.final_risk_category)}15`,
                  border: `3px solid ${getRiskColor(finalRisk.final_risk_category)}`,
                  textAlign: 'left',
                  marginBottom: '1.75rem'
                }}
              >
                <div style={{
                  fontSize: '1.3rem',
                  fontWeight: 'bold',
                  color: getRiskColor(finalRisk.final_risk_category),
                  marginBottom: '0.5rem'
                }}>
                  Overall screening result: {finalRisk.final_risk_category} risk
                </div>
                <p style={{ fontSize: '1.1rem', color: '#555', margin: 0, lineHeight: '1.6' }}>
                  This combines questionnaire, facial, and gaze information into a single overall risk level.
                </p>
              </div>

              <p style={{ fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '1rem' }}>
                {finalRisk.interpretation}
              </p>

              <div className="alert alert-warning" style={{ marginTop: '1rem' }}>
                <p style={{ margin: 0, fontWeight: 'bold' }}>
                  {finalRisk.recommendation}
                </p>
              </div>
            </div>
          )}

          {/* Questionnaire Results */}
          {screeningData.questionnaire && (
            <div className="report-section" style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ color: '#333', marginBottom: '1rem' }}>Questionnaire Results</h2>
              <div style={{
                padding: '1.5rem',
                backgroundColor: '#f8f9fa',
                borderRadius: '12px',
                marginBottom: '1rem'
              }}>
                <p><strong>Type:</strong> {screeningData.questionnaireType}</p>
                <p><strong>Score:</strong> {screeningData.questionnaire.score.toFixed(1)} / {screeningData.questionnaire.max_score.toFixed(0)}</p>
                <p><strong>Risk Category:</strong> 
                  <span style={{ 
                    color: getRiskColor(screeningData.questionnaire.risk_category),
                    fontWeight: 'bold',
                    marginLeft: '0.5rem'
                  }}>
                    {screeningData.questionnaire.risk_category}
                  </span>
                </p>
                <p style={{ marginTop: '1rem' }}>{screeningData.questionnaire.interpretation}</p>
              </div>
            </div>
          )}

          {/* Facial Analysis Results */}
          {screeningData.facial && (
            <div className="report-section" style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ color: '#333', marginBottom: '1rem' }}>Facial Analysis (Supporting Signal)</h2>
              <div style={{
                padding: '1.5rem',
                backgroundColor: '#f8f9fa',
                borderRadius: '12px',
                marginBottom: '1rem'
              }}>
                <p><strong>Probability:</strong> {(screeningData.facial.probability * 100).toFixed(1)}%</p>
                <p><strong>Risk Category:</strong> 
                  <span style={{ 
                    color: getRiskColor(screeningData.facial.risk_category),
                    fontWeight: 'bold',
                    marginLeft: '0.5rem'
                  }}>
                    {screeningData.facial.risk_category}
                  </span>
                </p>
                <p style={{ marginTop: '1rem' }}>{screeningData.facial.risk_interpretation}</p>
              </div>
            </div>
          )}

          {/* Gaze Analysis Results */}
          {screeningData.gaze && (
            <div className="report-section" style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ color: '#333', marginBottom: '1rem' }}>Gaze Analysis (Supporting Signal)</h2>
              <div style={{
                padding: '1.5rem',
                backgroundColor: '#f8f9fa',
                borderRadius: '12px',
                marginBottom: '1rem'
              }}>
                <p><strong>Social Preference Index (SPI):</strong> {screeningData.gaze.spi.toFixed(3)}</p>
                <p><strong>Social Frames:</strong> {screeningData.gaze.social_frames}</p>
                <p><strong>Geometric Frames:</strong> {screeningData.gaze.geometric_frames}</p>
                <p><strong>Risk Category:</strong> 
                  <span style={{ 
                    color: getRiskColor(screeningData.gaze.risk_category),
                    fontWeight: 'bold',
                    marginLeft: '0.5rem'
                  }}>
                    {screeningData.gaze.risk_category}
                  </span>
                </p>
                <p style={{ marginTop: '1rem' }}>{screeningData.gaze.interpretation}</p>
              </div>
            </div>
          )}

          {/* Spider/Radar Chart - Visual Comparison */}
          <div className="report-section" style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ color: '#333', marginBottom: '1rem' }}>Screening Signals Overview</h2>
            <p style={{ marginBottom: '1rem', color: '#555', fontSize: '0.95rem' }}>
              This spider chart compares typical low, medium, and high risk profiles with this screening across
              questionnaire, facial analysis, and gaze analysis (where available).
            </p>
            <div style={{ marginTop: '0.5rem', height: '320px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid radialLines />
                  <PolarAngleAxis dataKey="feature" tickLine={false} />
                  <PolarRadiusAxis angle={30} domain={[0, 3]} tick={false} axisLine={false} />
                  <Tooltip cursor={false} />
                  <Legend />
                  <Radar name="Typical Low" dataKey="Low" stroke="#27ae60" fill="#27ae60" fillOpacity={0.2} />
                  <Radar name="Typical Medium" dataKey="Medium" stroke="#f39c12" fill="#f39c12" fillOpacity={0.15} />
                  <Radar name="Typical High" dataKey="High" stroke="#e74c3c" fill="#e74c3c" fillOpacity={0.1} />
                  <Radar name="This Screening" dataKey="Child" stroke="#667eea" fill="#667eea" fillOpacity={0.4} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Disclaimers */}
          <div className="report-section" style={{ marginTop: '3rem', padding: '1.5rem', backgroundColor: '#fff3cd', borderRadius: '12px', border: '2px solid #ffc107' }}>
            <h3 style={{ color: '#856404', marginBottom: '1rem' }}>Important Disclaimers</h3>
            <ul style={{ marginLeft: '1.5rem', lineHeight: '1.8', color: '#856404' }}>
              <li>This screening tool is NOT a diagnostic tool and does not provide a medical diagnosis.</li>
              <li>Results are based on screening assessments and should be interpreted by qualified healthcare professionals.</li>
              <li>No personal data, images, videos, or results were stored during this screening.</li>
              <li>All processing was done in real-time and all data has been discarded.</li>
              <li>If you have concerns about your child's development, please consult with a qualified healthcare professional, developmental pediatrician, or autism specialist.</li>
            </ul>
          </div>

          <div style={{ marginTop: '2rem', textAlign: 'center' }}>
            <p style={{ color: '#666', fontSize: '0.9rem' }}>
              Report generated on {new Date().toLocaleString()}
            </p>
          </div>
        </div>

        {/* Action buttons (outside report card for PDF) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '2rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              className="btn btn-primary"
              onClick={downloadPDF}
              style={{ flex: 1 }}
            >
              Download PDF Report
            </button>
            <SecureSaveButton
              pdfBlob={pdfBlob}
              filename={`autism-screening-report ${new Date().toISOString().split('T')[0]}.pdf`}
            />
          </div>
          <button
            className="btn btn-danger"
            onClick={onClearSession}
            style={{ width: '100%' }}
          >
            Clear Session & Start Over
          </button>
        </div>
      </div>
    </>
  )
}

export default ReportPage

```

**Key Concepts Explained:**

| Concept | Explanation |
|---------|-------------|
| **RiskGauge Component** | Custom SVG semicircle gauge with needle pointing to risk level |
| **html2canvas** | Captures HTML elements as images for PDF generation |
| **jsPDF** | Creates PDF documents from captured images |
| **Recharts RadarChart** | Spider/radar chart comparing child's results to typical profiles |
| **useRef** | React hook to get reference to DOM element for PDF capture |
| **Multi-page PDF** | Section-by-section capture allows proper page breaks |

**Visual Components:**
```
┌────────────────────────────────────────┐
│        Risk Gauge (Semicircle)         │
│    ┌───┬───┬───┐                       │
│    │Low│Med│High│  ← Colored segments  │
│    └───┴─▲─┴───┘  ← Needle points      │
│          │                             │
├────────────────────────────────────────┤
│        Individual Results              │
│   - Questionnaire: Score & Risk        │
│   - Facial: Probability & Risk         │
│   - Gaze: SPI & Risk                   │
├────────────────────────────────────────┤
│        Radar Chart                     │
│   Compares to Low/Medium/High profiles │
├────────────────────────────────────────┤
│        Disclaimers                     │
└────────────────────────────────────────┘
```

---

## 5.12 src/pages/HistoryPage.tsx - Saved Reports (Complete - 190 lines)

Displays and manages user's saved encrypted reports with PIN verification and decryption.

```tsx
/**
 * HistoryPage.tsx - Assessment History
 * 
 * This page provides:
 * 1. List of saved encrypted reports from vault
 * 2. PIN verification before viewing
 * 3. CryptoJS AES decryption of report content
 * 4. PDF download functionality
 * 5. Proper error handling for decryption failures
 */
import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { usePin } from '../contexts/PinContext'
import PinVerifyModal from '../components/PinVerifyModal'
import apiClient from '../api/client'
import CryptoJS from 'crypto-js'
import '../App.css'


// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface Report {
  id: string
  filename: string
  created_at: string
}


// ============================================================================
// COMPONENT
// ============================================================================

const HistoryPage: React.FC = () => {
  const { user, token } = useAuth()
  const { pin } = usePin()
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showPinModal, setShowPinModal] = useState(false)
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null)

  // Load reports when user is authenticated
  useEffect(() => {
    if (user && token) {
      loadReports()
    }
  }, [user, token])

  // Effect to handle download once PIN is verified and available
  useEffect(() => {
    if (pin && selectedReportId && !showPinModal) {
      decryptAndDownload(selectedReportId, pin)
    }
  }, [pin, selectedReportId, showPinModal])

  // ============================================================================
  // LOAD REPORTS FROM VAULT
  // ============================================================================
  const loadReports = async () => {
    try {
      // Fix for Authorization header missing on refresh:
      // Explicitly set the header here to ensure it's available before the request
      if (token) {
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`
      }

      const response = await apiClient.get('/vault/list')
      setReports(response.data.reports)
    } catch (error: any) {
      setError(error.response?.data?.detail || 'Failed to load reports')
    } finally {
      setLoading(false)
    }
  }

  // ============================================================================
  // DECRYPT AND DOWNLOAD REPORT
  // ============================================================================
  const decryptAndDownload = async (reportId: string, pinToUse: string) => {
    try {
      // Ensure header is set for this request as well
      if (token) {
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`
      }

      // Get encrypted report from vault
      const response = await apiClient.get(`/vault/get/${reportId}`)
      const { encrypted_content, filename } = response.data
      
      // Decrypt using CryptoJS (AES)
      // Note: encrypted_content is base64 string
      const decryptedBytes = CryptoJS.AES.decrypt(encrypted_content, pinToUse)
      const decryptedBase64 = decryptedBytes.toString(CryptoJS.enc.Utf8)

      if (!decryptedBase64) {
        throw new Error('Decryption failed. Invalid PIN or corrupted data.')
      }
      
      // Convert base64 to binary
      const binaryString = window.atob(decryptedBase64)
      const len = binaryString.length
      const bytes = new Uint8Array(len)
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i)
      }
      
      // Create Blob and trigger download
      const blob = new Blob([bytes], { type: 'application/pdf' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', filename)
      document.body.appendChild(link)
      link.click()
      
      // Cleanup
      link.parentNode?.removeChild(link)
      window.URL.revokeObjectURL(url)
      
      // Reset state
      setShowPinModal(false)
      setSelectedReportId(null)
    } catch (error: any) {
      console.error('Download error:', error)
      setError('Failed to decrypt or download report. Please check if your PIN is correct.')
      // If decryption fails, reset the selection
      setSelectedReportId(null)
    }
  }

  // ============================================================================
  // HANDLE DOWNLOAD BUTTON CLICK
  // ============================================================================
  const handleDownload = (id: string) => {
    setSelectedReportId(id)
    if (pin) {
      // If PIN is already in session, proceed
      decryptAndDownload(id, pin)
    } else {
      // Otherwise, prompt for PIN verification
      setShowPinModal(true)
    }
  }

  const handlePinVerified = () => {
    // When PIN is verified, the modal closes. 
    // The useEffect [pin, selectedReportId] will trigger the actual download
    setShowPinModal(false)
  }

  // ============================================================================
  // RENDER
  // ============================================================================
  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ margin: 0, color: '#333' }}>Assessment History</h2>
        </div>
        
        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <div className="spinner"></div>
            <p>Loading history...</p>
          </div>
        ) : error ? (
          <div className="alert alert-error">
            {error}
          </div>
        ) : reports.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p>No saved reports found.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {reports.map((report) => (
              <div
                key={report.id}
                style={{
                  padding: '1.5rem',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: '#fff'
                }}
              >
                <div>
                  <h3 style={{ margin: 0, marginBottom: '0.5rem', fontSize: '1.1rem' }}>{report.filename}</h3>
                  <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>
                    Saved on {new Date(report.created_at).toLocaleString()}
                  </p>
                </div>
                <button
                  className="btn btn-primary"
                  onClick={() => handleDownload(report.id)}
                  style={{ padding: '0.5rem 1.5rem' }}
                >
                  Download
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* PIN Verification Modal */}
      {showPinModal && (
        <PinVerifyModal
          onVerified={handlePinVerified}
          onCancel={() => {
            setShowPinModal(false)
            setSelectedReportId(null)
          }}
        />
      )}
    </div>
  )
}

export default HistoryPage
```

**Key Concepts Explained:**

| Concept | Explanation |
|---------|-------------|
| **CryptoJS.AES.decrypt** | Decrypts content using user's PIN as the key |
| **window.atob** | Converts base64 string to binary data |
| **Uint8Array** | Typed array for handling binary PDF data |
| **Blob** | Binary Large Object for creating downloadable files |
| **URL.createObjectURL** | Creates a temporary URL for the Blob to enable download |
| **PIN verification flow** | Only prompts for PIN if not already verified this session |

**Decryption Flow:**
```
Encrypted Report (base64)
         │
         ▼
┌─────────────────────────┐
│ CryptoJS.AES.decrypt()  │ ← Uses PIN as key
└─────────────────────────┘
         │
         ▼
    Decrypted Base64
         │
         ▼
┌─────────────────────────┐
│      window.atob()      │ ← Base64 → Binary
└─────────────────────────┘
         │
         ▼
     Uint8Array → Blob
         │
         ▼
    Download PDF
```

---

## 5.13 src/components/GazeTracker.tsx - Webcam & Gaze Tracking (Complete - 865 lines)

This is the most complex frontend component, handling webcam access, EyeTrax calibration, and real-time gaze prediction during video playback.

```tsx
/**
 * GazeTracker.tsx - Webcam Gaze Tracking Component
 * 
 * This component provides:
 * 1. Webcam initialization and management
 * 2. EyeTrax-style 9-point calibration
 * 3. Real-time gaze prediction during video playback
 * 4. Blink detection and restart logic
 * 5. Fullscreen mode for accurate tracking
 * 6. Debug mode with visual gaze pointer (press 'D')
 * 
 * Flow: Calibration Phase → Video Phase → Complete
 */
import React, { useRef, useEffect, useState, useCallback } from 'react'
import apiClient from '../api/client'


// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface GazeDataPoint {
  timestamp: number
  x: number
  y: number
  social_region: boolean  // Left side = social content
}

interface GazeTrackerProps {
  onGazeData: (data: GazeDataPoint[]) => void  // Callback with collected gaze data
  videoSrc: string                              // Stimuli video URL
  onComplete: () => void                        // Callback when tracking completes
}

interface CalibrationPoint {
  x: number  // 0-1 normalized screen position
  y: number
}


// ============================================================================
// MAIN COMPONENT
// ============================================================================

const GazeTracker: React.FC<GazeTrackerProps> = ({ onGazeData, videoSrc, onComplete }) => {
  // ============================================================================
  // REFS - DOM element and stream references
  // ============================================================================
  const videoRef = useRef<HTMLVideoElement>(null)           // Stimuli video
  const calibrationCanvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const webcamVideoRef = useRef<HTMLVideoElement>(null)     // Hidden webcam feed
  const webcamStreamRef = useRef<MediaStream | null>(null)
  const frameIntervalRef = useRef<number | null>(null)
  
  // ============================================================================
  // STATE
  // ============================================================================
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

  // ============================================================================
  // LOAD CALIBRATION POINTS FROM BACKEND
  // ============================================================================
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
        // Fallback to default 9 points if API fails
        setCalibrationPoints([
          { x: 0.5, y: 0.5 }, { x: 0.1, y: 0.1 }, { x: 0.9, y: 0.1 },
          { x: 0.1, y: 0.9 }, { x: 0.9, y: 0.9 }, { x: 0.5, y: 0.1 },
          { x: 0.1, y: 0.5 }, { x: 0.9, y: 0.5 }, { x: 0.5, y: 0.9 }
        ])
      }
    }
    loadCalibrationPoints()
  }, [])

  // ============================================================================
  // CONVERT VIDEO FRAME TO BASE64 (for EyeTrax processing)
  // ============================================================================
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

  // ============================================================================
  // CHECK FRAME FOR FACE/BLINK DETECTION
  // ============================================================================
  const checkFrame = useCallback(async (frameBase64: string): Promise<{ face_detected: boolean; blink_detected: boolean }> => {
    const resp = await apiClient.post('/gaze/check', { frame: frameBase64 })
    return {
      face_detected: !!resp.data?.face_detected,
      blink_detected: !!resp.data?.blink_detected,
    }
  }, [])

  // ============================================================================
  // FULLSCREEN MANAGEMENT
  // ============================================================================
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

  // ============================================================================
  // DEBUG MODE TOGGLE (Press 'D' key)
  // ============================================================================
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'd' || e.key === 'D') {
        setDebugMode(prev => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [])

  // ============================================================================
  // SEND CALIBRATION DATA TO BACKEND
  // ============================================================================
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

  // ============================================================================
  // COLLECT CALIBRATION SAMPLES (EyeTrax style with blink restart)
  // ============================================================================
  const collectAllCalibrationSamples = useCallback(async () => {
    if (calibrationPoints.length === 0) {
      console.error('Calibration points not loaded yet')
      return
    }

    console.log('Starting EyeTrax-style calibration sample collection')
    const allSamples: Array<{frame: string, target_x: number, target_y: number}> = []
    const PULSE_DURATION = 1000    // 1 second pulse animation
    const COUNTDOWN_DURATION = 1000 // 1 second countdown/collection
    const MIN_GOOD_FRAMES_PER_POINT = 12
    const MAX_POINT_MS = 5000

    for (let pointIndex = 0; pointIndex < calibrationPoints.length; pointIndex++) {
      const target = calibrationPoints[pointIndex]
      console.log(`Calibrating point ${pointIndex + 1}/${calibrationPoints.length}`)
      setCurrentCalibrationIndex(pointIndex)

      // Blink restart logic: redo same point if blink occurs
      let goodFrames: Array<{frame: string, target_x: number, target_y: number}> = []

      while (true) {
        setCalibrationStatusText('')
        setPulseProgress(0)
        setCountdownProgress(0)

        // Phase 1: Pulse animation (1 second)
        setCalibrationPhase('pulse')
        const pulseStart = Date.now()
        while (Date.now() - pulseStart < PULSE_DURATION) {
          const elapsed = Date.now() - pulseStart
          setPulseProgress(elapsed / PULSE_DURATION)
          await new Promise(resolve => setTimeout(resolve, 16)) // ~60fps
        }
        setPulseProgress(1)

        // Phase 2: Countdown and collection
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
          // Redo same point
          continue
        }

        if (goodFrames.length >= MIN_GOOD_FRAMES_PER_POINT) {
          break
        }

        setCalibrationStatusText('Not enough good frames — holding a bit longer…')
      }

      allSamples.push(...goodFrames)
      console.log(`Collected ${goodFrames.length} good (open-eye) samples for point ${pointIndex + 1}`)
    }

    console.log(`Calibration complete. Total samples: ${allSamples.length}`)
    await sendCalibrationData(allSamples)
  }, [calibrationPoints, sendCalibrationData, checkFrame])

  // ============================================================================
  // START GAZE TRACKING DURING VIDEO
  // ============================================================================
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
        }
      }
    }

    // Track at ~10fps (100ms interval)
    frameIntervalRef.current = window.setInterval(trackGaze, 100)
  }, [gazeData, onGazeData, onComplete, exitFullscreen])

  // ============================================================================
  // INITIALIZE WEBCAM AND START CALIBRATION
  // ============================================================================
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

  // ============================================================================
  // DRAW CALIBRATION TARGET (EyeTrax style: green pulsing circle)
  // ============================================================================
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
        ctx.fillStyle = '#00ff00' // Green
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

        // White countdown ellipse
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

  // ============================================================================
  // HANDLE VIDEO END
  // ============================================================================
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

  // ============================================================================
  // ENSURE VIDEO PLAYS IN VIDEO PHASE
  // ============================================================================
  useEffect(() => {
    if (phase !== 'video') return
    const video = videoRef.current
    if (!video) return

    // Keep muted to satisfy autoplay policies
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

    if (video.readyState >= 2) {
      void tryPlay()
    } else {
      const onCanPlay = () => void tryPlay()
      video.addEventListener('canplay', onCanPlay, { once: true })
      video.load()
      return () => video.removeEventListener('canplay', onCanPlay)
    }
  }, [phase])

  // ============================================================================
  // CLEANUP ON UNMOUNT
  // ============================================================================
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

  // ============================================================================
  // RENDER
  // ============================================================================
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

      {/* Calibration status text */}
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

      {/* Error display */}
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

      {/* Initialization message */}
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

      {/* Video phase overlays */}
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
```

**Key Concepts Explained:**

| Concept | Explanation |
|---------|-------------|
| **navigator.mediaDevices.getUserMedia** | Browser API to access webcam with user's permission |
| **Canvas.toDataURL** | Captures video frame as base64 JPEG for API transmission |
| **EyeTrax Calibration** | 9-point calibration where user looks at dots while webcam captures eye positions |
| **Blink Detection** | Backend detects blinks; if blink occurs during calibration, that point restarts |
| **Fullscreen Mode** | Required for accurate gaze mapping to known screen coordinates |
| **Social vs Geometric** | Left half of screen = social content, right half = geometric (autism study paradigm) |
| **useCallback** | React hook that memoizes functions to prevent unnecessary re-renders |
| **useRef** | Maintains references to DOM elements and values across renders without triggering re-renders |

**Calibration Flow:**
```
┌─────────────────────────────────────────────────────────────┐
│                     CALIBRATION PHASE                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  For each of 9 calibration points:                          │
│                                                             │
│  1. Pulse Phase (1s)                                        │
│     ╭───╮                                                   │
│     │ ● │ ← Green circle pulses (attracts attention)        │
│     ╰───╯                                                   │
│                                                             │
│  2. Countdown Phase (1s)                                    │
│     ╭───╮                                                   │
│     │ ● │ ← White arc shrinks as frames collected           │
│     ╰───╯                                                   │
│                                                             │
│  3. Blink Check                                             │
│     If blink detected → Restart this point                  │
│     If no face → Show warning                               │
│     If OK → Collect frames, move to next point              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                       VIDEO PHASE                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────┬─────────────────┐                      │
│  │                 │                 │                      │
│  │   SOCIAL        │   GEOMETRIC     │                      │
│  │   (Left)        │   (Right)       │                      │
│  │                 │                 │                      │
│  └─────────────────┴─────────────────┘                      │
│                                                             │
│  Every 100ms:                                               │
│  1. Capture webcam frame                                    │
│  2. POST /gaze/predict → Get (x, y) coordinates             │
│  3. Determine if gaze is on social (left) or geometric      │
│  4. Record GazeDataPoint { timestamp, x, y, social_region } │
│                                                             │
│  Press 'D' for debug mode (shows red gaze pointer)          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                      COMPLETE PHASE                         │
├─────────────────────────────────────────────────────────────┤
│  1. Video ends                                              │
│  2. Stop gaze tracking interval                             │
│  3. Call onGazeData(allCollectedPoints)                     │
│  4. Exit fullscreen                                         │
│  5. Navigate to results page                                │
└─────────────────────────────────────────────────────────────┘
```

**Data Flow Diagram:**
```
Webcam                     Frontend                     Backend
  │                           │                            │
  │ Frame (720p)              │                            │
  ├──────────────────────────►│                            │
  │                           │ Base64 JPEG                │
  │                           ├───────────────────────────►│
  │                           │                            │ EyeTrax Model
  │                           │                            │ (Eye Detection +
  │                           │                            │  Gaze Prediction)
  │                           │          {x, y}            │
  │                           │◄───────────────────────────┤
  │                           │                            │
  │                           │ Store in gazeData[]        │
  │                           │                            │
```

---

## 5.14 src/components/PinGate.tsx - PIN Modal Controller (Complete - 101 lines)

Enforces PIN security by blocking UI until user sets up or unlocks their vault PIN.

```tsx
/**
 * PinGate.tsx - PIN Security Enforcement
 * 
 * This component enforces PIN security logic:
 * - Trigger 1: Initial Login -> Block UI until Unlock/Setup
 * - Trigger 2: Page Refresh -> PIN wiped from memory -> Block UI until Unlock
 * - Trigger 3: First-Time Setup -> Backend says no PIN -> Show Setup
 */
import React, { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { usePin } from '../contexts/PinContext'
import PinSetupModal from './PinSetupModal'
import UnlockVaultModal from './UnlockVaultModal'


const PinGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading: authLoading } = useAuth()
  const { pin, pinSet, pinStatusChecked } = usePin()
  const [showPinSetup, setShowPinSetup] = useState(false)
  const [showUnlockVault, setShowUnlockVault] = useState(false)

  useEffect(() => {
    // Do not enforce gates while authentication is loading
    if (authLoading) return

    if (user) {
      // If we haven't checked backend status yet, wait
      if (!pinStatusChecked) return

      // Logic Update: Prioritize having the PIN in memory. 
      // If 'pin' is set in context, it means the user just successfully set it or unlocked it.
      // We check this FIRST to avoid race conditions where 'pinSet' (backend status) might momentarily lag.
      if (pin) {
        // Authenticated, PIN set, and PIN in memory -> Access Granted
        setShowPinSetup(false)
        setShowUnlockVault(false)
      } else if (!pinSet) {
        // Trigger 3: First-Time Setup - PIN is not set on backend
        setShowPinSetup(true)
        setShowUnlockVault(false)
      } else {
        // Trigger 1 & 2: User logged in, PIN set on backend, but not in memory
        setShowUnlockVault(true)
        setShowPinSetup(false)
      }
    } else {
      // User not logged in - hide all modals (allow public home page access)
      setShowPinSetup(false)
      setShowUnlockVault(false)
    }
  }, [user, pin, pinSet, pinStatusChecked, authLoading])

  const handlePinSetupComplete = async () => {
    // Logic Update: Do not await checkPinStatus() here. 
    // PinSetupModal already calls checkPinStatus() and setPin().
    // We must close the modal immediately to prevent UI race conditions where the modal stays open 
    // and causes "PIN already set" errors if the user clicks again.
    setShowPinSetup(false)
  }

  const handleVaultUnlocked = () => {
    // PIN is now in context (set by UnlockVaultModal calling verifyPin)
    setShowUnlockVault(false)
  }

  // Block UI if user is logged in and PIN is missing from memory.
  // Logic Update: We only block if 'pin' is missing. If 'pin' is present, we are secure.
  // This prevents blocking UI when 'pin' is set but 'pinSet' is stale.
  const isBlocked = user && pinStatusChecked && !pin

  return (
    <>
      {/* Block UI overlay - prevents interaction until PIN is verified */}
      {isBlocked && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 10000,
          pointerEvents: 'none'
        }} />
      )}

      {/* Trigger 3 Modal: First-time PIN setup */}
      {showPinSetup && (
        <PinSetupModal onComplete={handlePinSetupComplete} />
      )}

      {/* Trigger 1 & 2 Modal: Unlock existing vault */}
      {showUnlockVault && (
        <UnlockVaultModal onUnlocked={handleVaultUnlocked} />
      )}

      {/* Render application content (behind overlay if blocked) */}
      {children}
    </>
  )
}

export default PinGate
```

**Key Concepts Explained:**

| Concept | Explanation |
|---------|-------------|
| **Three Triggers** | Initial login, page refresh (PIN wiped), first-time setup (no PIN yet) |
| **Memory-only PIN** | PIN never stored in localStorage - wiped on refresh for security |
| **UI Blocking Overlay** | Semi-transparent overlay prevents interaction until unlocked |
| **Race Condition Handling** | Checks `pin` in context first before backend status to avoid lag issues |

**PIN Enforcement Flow:**
```
User Logs In
      │
      ▼
┌─────────────────────┐
│ Check pinStatusCheck │ ← Has backend been queried?
└─────────────────────┘
      │
      ▼
┌─────────────────────┐
│ Is 'pin' in memory? │
└─────────────────────┘
      │
   Yes │ No
      │      │
      ▼      ▼
   Access  ┌─────────────────────┐
  Granted  │ Is 'pinSet' true?   │ ← Does user have PIN on backend?
           └─────────────────────┘
                 │
              Yes│ No
                 │    │
                 ▼    ▼
         Show Unlock  Show Setup
         Modal        Modal
```

---

## 5.15 src/components/SecureSaveButton.tsx - Save to Vault (Complete - 148 lines)

Encrypts PDF reports using user's PIN and saves them to the secure vault.

```tsx
/**
 * SecureSaveButton.tsx - Encrypted Report Saving
 * 
 * This component provides:
 * 1. PDF blob encryption using CryptoJS AES
 * 2. Base64 conversion for binary data
 * 3. Upload to backend vault storage
 * 4. PIN verification if not already in session
 */
import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { usePin } from '../contexts/PinContext'
import PinVerifyModal from './PinVerifyModal'
import apiClient from '../api/client'
import CryptoJS from 'crypto-js'
import '../App.css'


// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface SecureSaveButtonProps {
  pdfBlob: Blob | null   // PDF data from report generation
  filename?: string      // Optional custom filename
}


// ============================================================================
// COMPONENT
// ============================================================================

const SecureSaveButton: React.FC<SecureSaveButtonProps> = ({ pdfBlob, filename }) => {
  const { user, token } = useAuth()
  const { pin, verifyPin } = usePin()
  const [showPinModal, setShowPinModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  // ============================================================================
  // PDF ENCRYPTION UTILITY
  // ============================================================================
  const encryptPDF = async (pdfBlob: Blob, pin: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        try {
          const arrayBuffer = reader.result as ArrayBuffer
          const wordArray = CryptoJS.lib.WordArray.create(arrayBuffer)
          const encrypted = CryptoJS.AES.encrypt(wordArray, pin).toString()
          resolve(encrypted)
        } catch (error) {
          reject(error)
        }
      }
      reader.onerror = reject
      reader.readAsArrayBuffer(pdfBlob)
    })
  }

  // ============================================================================
  // SAVE HANDLER
  // ============================================================================
  const handleSave = async () => {
    if (!pdfBlob) {
      setMessage({ type: 'error', text: 'No PDF data available' })
      return
    }

    if (!user || !token) {
      setMessage({ type: 'error', text: 'Please log in to save reports' })
      return
    }

    // Check if PIN is set in context (relying on PinGate to enforce global unlock if required)
    if (!pin) {
      setShowPinModal(true)
      return
    }

    await saveToVault(pin)
  }

  // ============================================================================
  // VAULT UPLOAD
  // ============================================================================
  const saveToVault = async (pinToUse: string) => {
    if (!pdfBlob) return

    setLoading(true)
    setMessage(null)

    try {
      // Convert PDF blob to base64
      const reader = new FileReader()
      reader.onload = async () => {
        try {
          // Read as array buffer and convert to base64
          const arrayBuffer = reader.result as ArrayBuffer
          const bytes = new Uint8Array(arrayBuffer)
          let binary = ''
          for (let i = 0; i < bytes.length; i++) {
            binary += String.fromCharCode(bytes[i])
          }
          const base64Data = btoa(binary)
          
          // Encrypt using crypto-js (AES)
          const encrypted = CryptoJS.AES.encrypt(base64Data, pinToUse).toString()
          
          // Generate filename
          const reportFilename = filename || `autism-screening-report-${Date.now()}.pdf`
          
          // Upload to backend
          await apiClient.post('/vault/save', {
            encrypted_content: encrypted,
            filename: reportFilename
          })

          setMessage({ type: 'success', text: 'Report saved to secure vault successfully!' })
          setTimeout(() => setMessage(null), 3000)
        } catch (error: any) {
          console.error('Save error:', error)
          setMessage({ 
            type: 'error', 
            text: error.response?.data?.detail || 'Failed to save report. Please try again.' 
          })
        } finally {
          setLoading(false)
        }
      }
      reader.onerror = () => {
        setMessage({ type: 'error', text: 'Failed to read PDF data' })
        setLoading(false)
      }
      reader.readAsArrayBuffer(pdfBlob)
    } catch (error: any) {
      setMessage({ type: 'error', text: 'Failed to save report. Please try again.' })
      setLoading(false)
    }
  }

  const handlePinVerified = () => {
    setShowPinModal(false)
    if (pin) {
      saveToVault(pin)
    }
  }

  // ============================================================================
  // RENDER
  // ============================================================================
  return (
    <>
      <button
        className="btn btn-secondary"
        onClick={handleSave}
        disabled={loading || !pdfBlob}
        style={{ flex: 1 }}
      >
        {loading ? 'Saving...' : 'Save to Secure Vault'}
      </button>

      {message && (
        <div className={`alert alert-${message.type}`} style={{ marginTop: '0.5rem' }}>
          {message.text}
        </div>
      )}

      {showPinModal && (
        <PinVerifyModal
          onVerified={handlePinVerified}
          onCancel={() => setShowPinModal(false)}
        />
      )}
    </>
  )
}

export default SecureSaveButton
```

**Key Concepts Explained:**

| Concept | Explanation |
|---------|-------------|
| **FileReader.readAsArrayBuffer** | Reads PDF blob as binary array buffer |
| **Uint8Array** | Converts buffer to byte array for base64 encoding |
| **btoa()** | Encodes binary string to base64 |
| **CryptoJS.AES.encrypt** | Encrypts base64 string using PIN as key |
| **Conditional PIN verification** | Only prompts for PIN if not already in session |

**Encryption Flow:**
```
PDF Blob (binary)
      │
      ▼
┌──────────────────────┐
│ FileReader.readAs    │
│ ArrayBuffer()        │
└──────────────────────┘
      │
      ▼
┌──────────────────────┐
│ Uint8Array → btoa()  │ → Base64 string
└──────────────────────┘
      │
      ▼
┌──────────────────────┐
│ CryptoJS.AES.encrypt │ ← Uses PIN as key
└──────────────────────┘
      │
      ▼
┌──────────────────────┐
│ POST /vault/save     │ → Backend storage
└──────────────────────┘
```

---

## 5.16 src/contexts/PinContext.tsx - PIN State Management (Complete - 110 lines)

Manages PIN state and verification across the app using React Context API.

```tsx
/**
 * PinContext.tsx - Centralized PIN State Management
 * 
 * This context provides:
 * 1. PIN storage in memory only (security - never localStorage)
 * 2. Backend PIN status checking
 * 3. PIN verification against hashed backend value
 * 4. Automatic cleanup on logout
 */
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useAuth } from './AuthContext'
import apiClient from '../api/client'


// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface PinContextType {
  pin: string | null            // Current verified PIN (memory only)
  setPin: (pin: string) => void // Store PIN in context
  clearPin: () => void          // Clear PIN from memory
  pinSet: boolean               // Has user ever set a PIN on backend?
  pinStatusChecked: boolean     // Have we checked backend status yet?
  checkPinStatus: () => Promise<void>  // Re-check PIN status from backend
  verifyPin: (pin: string) => Promise<boolean>  // Verify PIN with backend
}


// ============================================================================
// CONTEXT CREATION
// ============================================================================

const PinContext = createContext<PinContextType | undefined>(undefined)


// ============================================================================
// CUSTOM HOOK
// ============================================================================

export const usePin = () => {
  const context = useContext(PinContext)
  if (!context) {
    throw new Error('usePin must be used within PinProvider')
  }
  return context
}


// ============================================================================
// PROVIDER COMPONENT
// ============================================================================

interface PinProviderProps {
  children: ReactNode
}

export const PinProvider: React.FC<PinProviderProps> = ({ children }) => {
  const { user, token } = useAuth()
  const [pin, setPinState] = useState<string | null>(null)
  const [pinSet, setPinSet] = useState(false)
  const [pinStatusChecked, setPinStatusChecked] = useState(false)

  // Trigger 2 & 3 Support: Check PIN status from backend whenever user/token is available
  useEffect(() => {
    if (user && token) {
      checkPinStatus()
    } else {
      // Logout Logic: Clear PIN immediately when user logs out
      setPinState(null)
      setPinSet(false)
      setPinStatusChecked(false)
    }
  }, [user, token])

  // ============================================================================
  // CHECK PIN STATUS FROM BACKEND
  // ============================================================================
  const checkPinStatus = async () => {
    if (!token) return
    
    try {
      // Fix for 401 Race Condition:
      // Explicitly set the header here before making the request. 
      // This ensures the token is attached even if AuthContext's useEffect hasn't run yet.
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`

      const response = await apiClient.get('/auth/pin/status')
      setPinSet(response.data.pin_set)
    } catch (error) {
      console.error('Error checking PIN status:', error)
    } finally {
      setPinStatusChecked(true)
    }
  }

  // ============================================================================
  // PIN STATE MANAGEMENT
  // ============================================================================
  const setPin = (newPin: string) => {
    // Storage Logic: Only store in React State (Memory)
    // Never stored in localStorage for security
    setPinState(newPin)
  }

  const clearPin = () => {
    setPinState(null)
  }

  // ============================================================================
  // PIN VERIFICATION WITH BACKEND
  // ============================================================================
  const verifyPin = async (pinToVerify: string): Promise<boolean> => {
    if (!token) return false
    
    try {
      // Ensure header is set for verification too, just in case
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`
      
      const response = await apiClient.post('/auth/pin/verify', {
        pin: pinToVerify
      })
      
      if (response.data.verified) {
        // Persistence: Keep in context once verified
        setPin(pinToVerify)
        return true
      }
      return false
    } catch (error) {
      console.error('Error verifying PIN:', error)
      return false
    }
  }

  // ============================================================================
  // PROVIDER RENDER
  // ============================================================================
  return (
    <PinContext.Provider value={{
      pin,
      setPin,
      clearPin,
      pinSet,
      pinStatusChecked,
      checkPinStatus,
      verifyPin
    }}>
      {children}
    </PinContext.Provider>
  )
}
```

**Key Concepts Explained:**

| Concept | Explanation |
|---------|-------------|
| **Context API** | Share state across entire app without prop drilling |
| **Memory-only storage** | PIN stored in useState, never localStorage (security) |
| **Token header injection** | Fixes race condition where header isn't set in time |
| **Async verification** | Check with backend, then store locally on success |
| **Logout cleanup** | Clears PIN immediately when user signs out |

**PIN State Lifecycle:**
```
User Logs In
      │
      ▼
┌─────────────────────────┐
│ checkPinStatus()        │ → GET /auth/pin/status
└─────────────────────────┘
      │
      ▼
┌─────────────────────────┐
│ setPinSet(true/false)   │ ← Backend response
└─────────────────────────┘
      │
      ▼ (User unlocks vault)
┌─────────────────────────┐
│ verifyPin(pin)          │ → POST /auth/pin/verify
└─────────────────────────┘
      │
      ▼ (Verified)
┌─────────────────────────┐
│ setPin(pin)             │ → Store in memory
└─────────────────────────┘
      │
      ▼ (User logs out)
┌─────────────────────────┐
│ clearPin()              │ → Wipe from memory
└─────────────────────────┘
```

---

## 5.17 src/main.tsx - React Entry Point (Complete - 12 lines)

The entry point that bootstraps the entire React application.

```tsx
/**
 * main.tsx - Application Entry Point
 * 
 * This file:
 * 1. Creates the React root element
 * 2. Enables StrictMode for development warnings
 * 3. Renders the main App component
 */
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

**Key Concepts Explained:**

| Concept | Explanation |
|---------|-------------|
| **ReactDOM.createRoot** | React 18 API for concurrent rendering (replaces ReactDOM.render) |
| **document.getElementById('root')!** | The `!` is TypeScript non-null assertion - we know this element exists in index.html |
| **React.StrictMode** | Development tool that highlights potential problems (double-invokes effects) |
| **import './index.css'** | Global CSS styles applied to entire app |

---

## 5.18 src/components/PinSetupModal.tsx - First-Time PIN Setup (Complete - 135 lines)

Modal for first-time users to set up their secure vault PIN.

```tsx
/**
 * PinSetupModal.tsx - First-Time PIN Setup
 * 
 * This modal appears when:
 * 1. User logs in for the first time
 * 2. Backend reports no PIN is set
 * 
 * Features:
 * - PIN validation (minimum 4 characters)
 * - Confirmation field to prevent typos
 * - Disclaimer acknowledgment required
 * - Warning about unrecoverable PIN
 */
import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { usePin } from '../contexts/PinContext'
import apiClient from '../api/client'
import '../App.css'


// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface PinSetupModalProps {
  onComplete: () => void  // Called after successful PIN setup
}


// ============================================================================
// COMPONENT
// ============================================================================

const PinSetupModal: React.FC<PinSetupModalProps> = ({ onComplete }) => {
  const { token } = useAuth()
  const { setPin, checkPinStatus } = usePin()
  const [pin, setPinValue] = useState('')
  const [confirmPin, setConfirmPin] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [acknowledged, setAcknowledged] = useState(false)

  // ============================================================================
  // FORM SUBMISSION
  // ============================================================================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validation: Disclaimer must be acknowledged
    if (!acknowledged) {
      setError('Please acknowledge the disclaimer before proceeding')
      return
    }

    // Validation: Minimum length
    if (pin.length < 4) {
      setError('PIN must be at least 4 characters long')
      return
    }

    // Validation: PINs must match
    if (pin !== confirmPin) {
      setError('PINs do not match')
      return
    }

    // Submit to backend
    setLoading(true)
    try {
      await apiClient.post('/auth/pin/set', { pin })
      setPin(pin)                    // Store in context memory
      await checkPinStatus()         // Refresh PIN status from backend
      onComplete()                   // Close modal
    } catch (error: any) {
      setError(error.response?.data?.detail || 'Failed to set PIN. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // ============================================================================
  // RENDER
  // ============================================================================
  return (
    <div className="modal-overlay">
      <div className="modal-content pin-modal">
        <h2>Set Your Privacy PIN</h2>
        
        {/* Critical Warning Box */}
        <div className="pin-disclaimer" style={{
          border: '2px solid #e74c3c',
          borderRadius: '8px',
          padding: '1rem',
          marginBottom: '1.5rem',
          backgroundColor: '#fee'
        }}>
          <p style={{ margin: 0, fontWeight: 'bold', color: '#c0392b', marginBottom: '0.5rem' }}>
            ⚠️ IMPORTANT: One-Time PIN Setup
          </p>
          <p style={{ margin: 0, color: '#c0392b', fontSize: '0.9rem', lineHeight: '1.6' }}>
            This PIN is a <strong>one-time setting</strong> and cannot be changed or recovered. 
            If you lose this PIN, you will <strong>lose access to your secure vault forever</strong>. 
            Please choose a PIN you will remember and store it securely.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* PIN Input */}
          <div className="form-group">
            <label htmlFor="pin">Enter PIN:</label>
            <input
              type="password"
              id="pin"
              value={pin}
              onChange={(e) => setPinValue(e.target.value)}
              placeholder="At least 4 characters"
              required
              disabled={loading}
            />
          </div>

          {/* Confirm PIN Input */}
          <div className="form-group">
            <label htmlFor="confirmPin">Confirm PIN:</label>
            <input
              type="password"
              id="confirmPin"
              value={confirmPin}
              onChange={(e) => setConfirmPin(e.target.value)}
              placeholder="Re-enter PIN"
              required
              disabled={loading}
            />
          </div>

          {/* Acknowledgment Checkbox */}
          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={acknowledged}
                onChange={(e) => setAcknowledged(e.target.checked)}
                disabled={loading}
              />
              <span>I understand that losing this PIN means losing access to my vault forever</span>
            </label>
          </div>

          {/* Error Display */}
          {error && (
            <div className="alert alert-error" style={{ marginTop: '1rem' }}>
              {error}
            </div>
          )}

          {/* Submit Button */}
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || !acknowledged}
              style={{ flex: 1 }}
            >
              {loading ? 'Setting PIN...' : 'Set PIN'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default PinSetupModal
```

**Key Concepts Explained:**

| Concept | Explanation |
|---------|-------------|
| **Controlled Inputs** | React manages input values via state (pin, confirmPin) |
| **Form Validation** | Multiple checks before submission (length, match, acknowledgment) |
| **apiClient.post** | Sends PIN to backend for hashing and storage |
| **setPin(pin)** | Stores plain PIN in context memory for encryption operations |
| **checkPinStatus()** | Refreshes backend status to confirm PIN is set |

---

## 5.19 src/components/PinVerifyModal.tsx - PIN Verification (Complete - 96 lines)

Modal for verifying user's PIN when needed (e.g., before viewing saved reports).

```tsx
/**
 * PinVerifyModal.tsx - PIN Verification Modal
 * 
 * This modal appears when:
 * 1. User tries to access encrypted content
 * 2. PIN is needed but not in session memory
 * 
 * Features:
 * - Single PIN input field
 * - Cancel button (optional, for non-blocking operations)
 * - Error handling for invalid PINs
 */
import React, { useState } from 'react'
import { usePin } from '../contexts/PinContext'
import '../App.css'


// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface PinVerifyModalProps {
  onVerified: () => void     // Called after successful verification
  onCancel?: () => void      // Optional cancel handler
}


// ============================================================================
// COMPONENT
// ============================================================================

const PinVerifyModal: React.FC<PinVerifyModalProps> = ({ onVerified, onCancel }) => {
  const { verifyPin } = usePin()
  const [pin, setPinValue] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // ============================================================================
  // FORM SUBMISSION
  // ============================================================================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (pin.length < 4) {
      setError('PIN must be at least 4 characters long')
      return
    }

    setLoading(true)
    try {
      const verified = await verifyPin(pin)
      if (verified) {
        onVerified()
      } else {
        setError('Invalid PIN. Please try again.')
      }
    } catch (error: any) {
      setError('Failed to verify PIN. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // ============================================================================
  // RENDER
  // ============================================================================
  return (
    <div className="modal-overlay">
      <div className="modal-content pin-modal">
        <h2>Enter Your Privacy PIN</h2>
        <p style={{ color: '#666', marginBottom: '1.5rem' }}>
          Please enter your PIN to continue.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="pin">PIN:</label>
            <input
              type="password"
              id="pin"
              value={pin}
              onChange={(e) => setPinValue(e.target.value)}
              placeholder="Enter your PIN"
              required
              disabled={loading}
              autoFocus
            />
          </div>

          {error && (
            <div className="alert alert-error" style={{ marginTop: '1rem' }}>
              {error}
            </div>
          )}

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            {onCancel && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onCancel}
                disabled={loading}
                style={{ flex: 1 }}
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ flex: 1 }}
            >
              {loading ? 'Verifying...' : 'Verify PIN'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default PinVerifyModal
```

**Key Concepts Explained:**

| Concept | Explanation |
|---------|-------------|
| **verifyPin()** | Context function that checks PIN with backend and stores if valid |
| **autoFocus** | HTML attribute that focuses the input when modal opens |
| **Optional onCancel** | Allows dismissing modal without verifying (for non-blocking flows) |

---

## 5.20 src/components/UnlockVaultModal.tsx - Vault Unlock (Complete - 89 lines)

Modal that blocks the entire UI until user unlocks their vault with their PIN.

```tsx
/**
 * UnlockVaultModal.tsx - Vault Unlock Modal
 * 
 * This modal appears on:
 * 1. Initial login (PIN set but not in memory)
 * 2. Page refresh (PIN wiped from memory)
 * 
 * Unlike PinVerifyModal:
 * - No cancel button (blocking operation)
 * - Higher z-index (blocks entire UI)
 * - Required before accessing any protected content
 */
import React, { useState } from 'react'
import { usePin } from '../contexts/PinContext'
import '../App.css'


// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface UnlockVaultModalProps {
  onUnlocked: () => void  // Called after successful unlock
}


// ============================================================================
// COMPONENT
// ============================================================================

const UnlockVaultModal: React.FC<UnlockVaultModalProps> = ({ onUnlocked }) => {
  const { verifyPin } = usePin()
  const [pin, setPinValue] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // ============================================================================
  // FORM SUBMISSION
  // ============================================================================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (pin.length < 4) {
      setError('PIN must be at least 4 characters long')
      return
    }

    setLoading(true)
    try {
      const verified = await verifyPin(pin)
      if (verified) {
        onUnlocked()
      } else {
        setError('Invalid PIN. Please try again.')
        setPinValue('') // Clear PIN on error for security
      }
    } catch (error: any) {
      setError('Failed to verify PIN. Please try again.')
      setPinValue('') // Clear PIN on error
    } finally {
      setLoading(false)
    }
  }

  // ============================================================================
  // RENDER
  // ============================================================================
  return (
    <div className="modal-overlay" style={{ zIndex: 10001 }}>
      <div className="modal-content pin-modal">
        <h2>Unlock Secure Vault</h2>
        <p style={{ color: '#666', marginBottom: '1.5rem' }}>
          Please enter your PIN to access your secure vault and continue.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="pin">PIN:</label>
            <input
              type="password"
              id="pin"
              value={pin}
              onChange={(e) => {
                setPinValue(e.target.value)
                setError('') // Clear error when user types
              }}
              placeholder="Enter your PIN"
              required
              disabled={loading}
              autoFocus
            />
          </div>

          {error && (
            <div className="alert alert-error" style={{ marginTop: '1rem' }}>
              {error}
            </div>
          )}

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ flex: 1 }}
            >
              {loading ? 'Verifying...' : 'Unlock Vault'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default UnlockVaultModal
```

**Key Concepts Explained:**

| Concept | Explanation |
|---------|-------------|
| **zIndex: 10001** | Higher than other modals to ensure it blocks everything |
| **No Cancel Button** | User must unlock - no way to bypass |
| **setPinValue('')** | Clears PIN on error for security |
| **Error Clearing** | Clears error message when user starts typing again |

---

## 5.21 src/utils/gazeTracking.ts - MediaPipe Gaze Utilities (Complete - 246 lines)

Utility class for browser-based gaze tracking using MediaPipe Face Mesh.

```tsx
/**
 * gazeTracking.ts - MediaPipe Face Mesh Gaze Tracking
 * 
 * Alternative gaze tracking approach using MediaPipe directly in browser.
 * Based on EyeTrax approach: https://github.com/ck-zhang/EyeTrax
 * 
 * Note: The main app uses GazeTracker.tsx with backend EyeTrax.
 * This file provides a pure frontend alternative.
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


// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

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


// ============================================================================
// GAZE TRACKER CLASS
// ============================================================================

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

    // Initialize MediaPipe FaceMesh
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

  // ============================================================================
  // PROCESS FACE MESH RESULTS
  // ============================================================================
  private onResults(results: any) {
    if (!this.canvasElement) return;

    const ctx = this.canvasElement.getContext('2d');
    if (!ctx) return;

    ctx.save();
    ctx.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);
    ctx.drawImage(results.image, 0, 0, this.canvasElement.width, this.canvasElement.height);

    if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
      const landmarks = results.multiFaceLandmarks[0];
      
      // Calculate gaze point from landmarks
      const gazePoint = this.calculateGaze(landmarks, this.canvasElement.width, this.canvasElement.height);
      
      if (gazePoint) {
        if (this.isCalibrating) {
          this.currentCalibrationSamples.push(gazePoint);
          
          if (this.currentCalibrationSamples.length >= this.calibrationSamplesPerPoint) {
            this.calibrationPoints.push({
              x: 0,
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
          this.gazeCallback(gazePoint);
        }

        // Draw gaze point (debug visualization)
        ctx.fillStyle = '#FF0000';
        ctx.beginPath();
        ctx.arc(gazePoint.x, gazePoint.y, 5, 0, 2 * Math.PI);
        ctx.fill();
      }
    }

    ctx.restore();
  }

  // ============================================================================
  // CALCULATE GAZE FROM EYE LANDMARKS
  // ============================================================================
  private calculateGaze(landmarks: any, canvasWidth: number, canvasHeight: number): GazePoint | null {
    // Eye landmark indices (MediaPipe Face Mesh 468 points)
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

    return {
      x: screenX,
      y: screenY,
      timestamp: Date.now()
    };
  }

  // ============================================================================
  // CALIBRATION API
  // ============================================================================
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
          this.isCalibrating = false;
          this.calibrationCallback = null;
          resolve();
        }
      };

      calibrationTargets.forEach((target, index) => {
        if (this.calibrationPoints[index]) {
          this.calibrationPoints[index].x = target.x;
          this.calibrationPoints[index].y = target.y;
        }
      });
    });
  }

  // ============================================================================
  // TRACKING API
  // ============================================================================
  public startTracking(onGaze: (gaze: GazePoint) => void) {
    this.isTracking = true;
    this.gazeCallback = onGaze;
  }

  public stopTracking() {
    this.isTracking = false;
    this.gazeCallback = null;
  }

  // ============================================================================
  // CAMERA CONTROL
  // ============================================================================
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

  public stop() {
    if (this.camera) {
      this.camera.stop();
      this.camera = null;
    }
    this.stopTracking();
  }

  public getCalibrationData(): CalibrationPoint[] {
    return this.calibrationPoints;
  }
}
```

**Key Concepts Explained:**

| Concept | Explanation |
|---------|-------------|
| **MediaPipe FaceMesh** | Google's ML model with 468 facial landmark points |
| **CDN Loading** | Loads MediaPipe from CDN to avoid heavy npm dependencies |
| **Eye Landmark Indices** | Specific point numbers for eye corners and centers |
| **Normalized Coordinates** | MediaPipe returns 0-1 values, we convert to screen pixels |
| **Promise-based Calibration** | Async calibration that resolves when all points collected |

---

## 5.22 train_model.py - Model Training Script (Complete - 256 lines)

Backend script for training the Vision Transformer (ViT) model on autism facial dataset.

```python
"""
train_model.py - ViT Model Training Script

This script:
1. Loads Autistic/Non_Autistic facial images
2. Applies data augmentation
3. Fine-tunes a pre-trained ViT model
4. Saves the best model based on validation accuracy

Target: Achieve at least 90% validation accuracy.
"""
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import Dataset, DataLoader, random_split
from torchvision import transforms
from PIL import Image
import os
from pathlib import Path
import numpy as np
from tqdm import tqdm
from app.models.vit_model import ViTASDModel


# ============================================================================
# CONFIGURATION
# ============================================================================

DATA_DIR = "dataset/facial recognition/AutismDataset"
MODEL_SAVE_PATH = "backend/models/vitasd_model.pth"
IMAGE_SIZE = 224
BATCH_SIZE = 32
LEARNING_RATE = 2e-5
NUM_EPOCHS = 10
VALIDATION_SPLIT = 0.2
NUM_CLASSES = 2

# Device selection (GPU if available, else CPU)
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print(f"Using device: {device}")


# ============================================================================
# DATASET CLASS
# ============================================================================

class AutismDataset(Dataset):
    """Dataset class for autism facial images"""
    def __init__(self, data_dir, transform=None):
        self.data_dir = Path(data_dir)
        self.transform = transform
        self.images = []
        self.labels = []
        
        # Load autistic images (label 1 = positive class)
        autistic_dir = self.data_dir / "Autistic"
        if autistic_dir.exists():
            for img_path in autistic_dir.glob("*.jpg"):
                self.images.append(str(img_path))
                self.labels.append(1)
        
        # Load non-autistic images (label 0 = negative class)
        non_autistic_dir = self.data_dir / "Non_Autistic"
        if non_autistic_dir.exists():
            for img_path in non_autistic_dir.glob("*.jpg"):
                self.images.append(str(img_path))
                self.labels.append(0)
        
        print(f"Loaded {len(self.images)} images: {sum(self.labels)} autistic, {len(self.labels) - sum(self.labels)} non-autistic")
    
    def __len__(self):
        return len(self.images)
    
    def __getitem__(self, idx):
        img_path = self.images[idx]
        label = self.labels[idx]
        
        try:
            image = Image.open(img_path).convert("RGB")
            if self.transform:
                image = self.transform(image)
            return image, label
        except Exception as e:
            print(f"Error loading image {img_path}: {e}")
            # Return a black image if loading fails
            image = Image.new("RGB", (IMAGE_SIZE, IMAGE_SIZE), (0, 0, 0))
            if self.transform:
                image = self.transform(image)
            return image, label


# ============================================================================
# TRAINING FUNCTION
# ============================================================================

def train_epoch(model, train_loader, criterion, optimizer, device):
    """Train for one epoch"""
    model.train()
    running_loss = 0.0
    correct = 0
    total = 0
    
    progress_bar = tqdm(train_loader, desc="Training")
    for images, labels in progress_bar:
        images = images.to(device)
        labels = labels.to(device)
        
        optimizer.zero_grad()
        outputs = model(images)
        logits = outputs.logits if hasattr(outputs, 'logits') else outputs
        loss = criterion(logits, labels)
        loss.backward()
        optimizer.step()
        
        running_loss += loss.item()
        _, predicted = torch.max(logits.data, 1)
        total += labels.size(0)
        correct += (predicted == labels).sum().item()
        
        progress_bar.set_postfix({
            'loss': running_loss / total,
            'acc': 100 * correct / total
        })
    
    epoch_loss = running_loss / len(train_loader)
    epoch_acc = 100 * correct / total
    return epoch_loss, epoch_acc


# ============================================================================
# VALIDATION FUNCTION
# ============================================================================

def validate(model, val_loader, criterion, device):
    """Validate model"""
    model.eval()
    running_loss = 0.0
    correct = 0
    total = 0
    
    with torch.no_grad():
        for images, labels in tqdm(val_loader, desc="Validation"):
            images = images.to(device)
            labels = labels.to(device)
            
            outputs = model(images)
            logits = outputs.logits if hasattr(outputs, 'logits') else outputs
            loss = criterion(logits, labels)
            
            running_loss += loss.item()
            _, predicted = torch.max(logits.data, 1)
            total += labels.size(0)
            correct += (predicted == labels).sum().item()
    
    epoch_loss = running_loss / len(val_loader)
    epoch_acc = 100 * correct / total
    return epoch_loss, epoch_acc


# ============================================================================
# MAIN TRAINING LOOP
# ============================================================================

def main():
    """Main training function"""
    print("=" * 60)
    print("ViT Model Training for Autism Detection")
    print("=" * 60)
    
    # Data augmentation for training (helps prevent overfitting)
    train_transform = transforms.Compose([
        transforms.Resize((IMAGE_SIZE, IMAGE_SIZE)),
        transforms.RandomHorizontalFlip(0.5),
        transforms.RandomRotation(10),
        transforms.ColorJitter(brightness=0.2, contrast=0.2),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
    ])
    
    # No augmentation for validation (clean evaluation)
    val_transform = transforms.Compose([
        transforms.Resize((IMAGE_SIZE, IMAGE_SIZE)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
    ])
    
    # Load and split dataset
    print("\nLoading dataset...")
    full_dataset = AutismDataset(DATA_DIR, transform=None)
    
    dataset_size = len(full_dataset)
    val_size = int(VALIDATION_SPLIT * dataset_size)
    train_size = dataset_size - val_size
    train_indices, val_indices = random_split(range(dataset_size), [train_size, val_size])
    
    # Wrapper class to apply different transforms to subsets
    class TransformSubset(torch.utils.data.Dataset):
        def __init__(self, subset, transform):
            self.subset = subset
            self.transform = transform
            
        def __getitem__(self, index):
            x, y = self.subset[index]
            if self.transform:
                x = self.transform(x)
            return x, y
            
        def __len__(self):
            return len(self.subset)
    
    # Create data loaders
    train_subset = torch.utils.data.Subset(full_dataset, train_indices.indices)
    val_subset = torch.utils.data.Subset(full_dataset, val_indices.indices)
    
    train_dataset = TransformSubset(train_subset, train_transform)
    val_dataset = TransformSubset(val_subset, val_transform)
    
    train_loader = DataLoader(train_dataset, batch_size=BATCH_SIZE, shuffle=True, num_workers=4, pin_memory=True)
    val_loader = DataLoader(val_dataset, batch_size=BATCH_SIZE, shuffle=False, num_workers=4, pin_memory=True)
    
    print(f"Training samples: {len(train_dataset)}")
    print(f"Validation samples: {len(val_dataset)}")
    
    # Initialize model
    print("\nInitializing model...")
    model = ViTASDModel(num_classes=NUM_CLASSES, pretrained=True)
    model.to(device)
    
    # Loss function and optimizer
    criterion = nn.CrossEntropyLoss()
    optimizer = optim.AdamW(model.parameters(), lr=LEARNING_RATE, weight_decay=0.01)
    scheduler = optim.lr_scheduler.ReduceLROnPlateau(optimizer, mode='min', factor=0.5, patience=2, verbose=True)
    
    # Training loop
    print("\nStarting training...")
    best_val_acc = 0.0
    
    for epoch in range(NUM_EPOCHS):
        print(f"\nEpoch {epoch + 1}/{NUM_EPOCHS}")
        print("-" * 60)
        
        # Train
        train_loss, train_acc = train_epoch(model, train_loader, criterion, optimizer, device)
        
        # Validate
        val_loss, val_acc = validate(model, val_loader, criterion, device)
        
        scheduler.step(val_loss)
        
        print(f"Train Loss: {train_loss:.4f}, Train Acc: {train_acc:.2f}%")
        print(f"Val Loss: {val_loss:.4f}, Val Acc: {val_acc:.2f}%")
        
        # Save best model
        if val_acc > best_val_acc:
            best_val_acc = val_acc
            os.makedirs(os.path.dirname(MODEL_SAVE_PATH), exist_ok=True)
            torch.save(model.state_dict(), MODEL_SAVE_PATH)
            print(f"✓ Saved best model with validation accuracy: {best_val_acc:.2f}%")
        
        # Early stopping if target accuracy achieved
        if val_acc >= 90.0:
            print(f"\n✓ Target validation accuracy of 90% achieved!")
            break
    
    print("\n" + "=" * 60)
    print("Training Complete!")
    print(f"Best Validation Accuracy: {best_val_acc:.2f}%")
    print(f"Model saved to: {MODEL_SAVE_PATH}")
    print("=" * 60)


if __name__ == "__main__":
    main()
```

**Key Concepts Explained:**

| Concept | Explanation |
|---------|-------------|
| **PyTorch Dataset** | Custom class that loads images and returns (image, label) pairs |
| **Data Augmentation** | RandomHorizontalFlip, RandomRotation, ColorJitter - creates variations to prevent overfitting |
| **transforms.Normalize** | Uses ImageNet mean/std ([0.485, 0.456, 0.406], [0.229, 0.224, 0.225]) for pre-trained models |
| **model.train() / model.eval()** | Switches between training mode (dropout enabled) and evaluation mode (dropout disabled) |
| **torch.no_grad()** | Disables gradient computation during validation (saves memory) |
| **ReduceLROnPlateau** | Reduces learning rate when validation loss stops improving |
| **CrossEntropyLoss** | Standard loss for multi-class classification |
| **AdamW** | Adam optimizer with weight decay (regularization) |

**Training Flow:**
```
Dataset
   │
   ├─── Autistic/
   │       └─── *.jpg (label=1)
   └─── Non_Autistic/
           └─── *.jpg (label=0)
   │
   ▼
┌─────────────────────────┐
│ Data Augmentation       │ ← Flip, Rotate, Color Jitter
└─────────────────────────┘
   │
   ▼
┌─────────────────────────┐
│ ViT Model (Pre-trained) │ ← Google's Vision Transformer
└─────────────────────────┘
   │
   ▼
┌─────────────────────────┐
│ CrossEntropyLoss        │
└─────────────────────────┘
   │
   ▼
┌─────────────────────────┐
│ AdamW Optimizer         │ ← Update weights
└─────────────────────────┘
   │
   ▼
┌─────────────────────────┐
│ Save Best Model         │ → vitasd_model.pth
└─────────────────────────┘
```

---

# 6. How Data Flows


## Example: User Submits Questionnaire

```
USER clicks "Submit"
      │
      ▼
QuestionnairePage.tsx
      │ axios.post('/api/questionnaire/submit', {
      │   questionnaire_type: 'AQ10',
      │   answers: [1,0,1,0,0,1,1,0,0,1],
      │   child_age: 7
      │ })
      │
      ▼ HTTP POST REQUEST
      │
VITE DEV SERVER (localhost:3000)
      │ Proxy forwards /api/* to localhost:8000
      │
      ▼
FASTAPI (localhost:8000)
      │ main.py routes to questionnaire.router
      │
      ▼
questionnaire.py
      │ @router.post("/submit") receives request
      │ Pydantic validates data structure
      │ calculate_aq10_score() calculates result
      │
      ▼ Returns JSON
      │
      ▼
QuestionnairePage.tsx receives response
      │ Updates React state
      │ Shows result to user
      │
      ▼
USER sees: "Low Risk - Score 3/10"
```

---

# 7. Glossary of Terms

| Term | Simple Explanation |
|------|-------------------|
| **API** | A way for programs to talk to each other (like a waiter between kitchen and diners) |
| **axios** | JavaScript library for making HTTP requests |
| **Base64** | A way to encode binary data (like images) as text |
| **CBC** | A mode of encryption where each block affects the next |
| **Component** | A reusable piece of UI in React (like a LEGO brick) |
| **CORS** | Security feature that controls which websites can access an API |
| **Endpoint** | A specific URL that does something (like `/api/questionnaire/submit`) |
| **FastAPI** | A Python web framework for building APIs |
| **GridFS** | MongoDB feature for storing large files |
| **Hook** | React feature that lets you "hook into" React features (like useState) |
| **JWT** | JSON Web Token - a secure way to transmit user info |
| **Middleware** | Code that runs on every request (like a security checkpoint) |
| **MongoDB** | A database that stores data as JSON documents |
| **OAuth** | A protocol that lets you "Sign in with Google" |
| **Props** | Data passed from parent to child component in React |
| **Router** | Maps URLs to functions/components |
| **SHA-256** | A hash function that turns any input into a fixed-size output |
| **State** | Data that can change and triggers UI updates in React |
| **Tensor** | Multi-dimensional array used in machine learning |
| **TypeScript** | JavaScript with type checking |
| **ViT** | Vision Transformer - an AI model for analyzing images |
| **WebSocket** | Two-way communication channel (unlike HTTP which is request-response) |

---

# 🚀 Your First Steps

1. **Run the app** - Follow README.md
2. **Open http://localhost:8000/docs** - See auto-generated API docs
3. **Read types.ts** - Understand all data shapes
4. **Add console.log()** - Trace requests through the code
5. **Break something** - Learn how errors appear

Good luck! 🎉
