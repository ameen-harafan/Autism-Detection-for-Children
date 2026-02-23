# Early Autism Screening Application

A privacy-first, stateless web application for early autism screening in children (ages 4-18). This tool combines questionnaire-based screening, optional facial analysis, and optional gaze tracking to provide risk assessments.

> ⚠️ **Disclaimer**: This tool is for screening purposes only and does NOT provide a medical diagnosis. Always consult with qualified healthcare professionals.

---

## Prerequisites

Before setting up the application, ensure you have the following installed:

- **Python 3.10** (specifically version 3.10)
- **Node.js 18+**

---

## Backend Setup

1. **Navigate to the backend directory:**
   ```
   cd backend
   ```

2. **Create a Python 3.10 virtual environment:**
   ```
   py -3.10 -m venv tf_env
   ```

3. **Activate the virtual environment:**

   **Windows:**
   ```
   tf_env\Scripts\activate
   ```

   **Linux/Mac:**
   ```
   source tf_env/bin/activate
   ```

4. **Install Python dependencies:**
   ```
   pip install -r requirements.txt
   ```

5. **Start the FastAPI server:**
   ```
   python run.py
   ```

6. The backend API will be available at: `http://localhost:8000`
---

## Frontend Setup

1. **Navigate to the frontend directory:**
   ```
   cd frontend
   ```

2. **Install Node.js dependencies:**
   ```
   npm install
   ```

3. **Start the development server:**
   ```
   npm run dev
   ```

4. The application will be available at: `http://localhost:3000`

---

## Training the Facial Analysis Model (Optional as already trained model present in backend/models/vitasd_model.pth)

The Vision Transformer model can be trained on the autism facial dataset for improved accuracy.

1. **Ensure you are in the backend directory with the virtual environment activated.**

2. **Run the training script:**
   ```
   python train_model.py
   ```

3. **Training details:**
   - Dataset: `dataset/facial recognition/AutismDataset`
   - Target accuracy: 90%+
   - Model saved to: `backend/models/vitasd_model.pth`

> **Note**: Training is optional. The application will use a pretrained model if no trained model is found.

---

## Usage

1. Open your browser and go to `http://localhost:3000`
2. Follow the screening workflow:
   - Provide consent
   - Enter child's age (4-17 years)
   - Complete the questionnaire (AQ-10 or SCQ)
   - Optionally complete facial analysis
   - Optionally complete gaze tracking
   - View and download the screening report

---

## Privacy & Security

- **No data storage**: All processing occurs in real-time, in memory only
- **No persistence**: Images, videos, and results are immediately discarded
- **No user accounts**: Completely stateless system
- **Reports generated client-side**: PDF reports are created in the browser

---

## Cloud Services Setup

This application uses MongoDB Atlas for the database and Google Cloud Console for OAuth authentication. **You must configure your own credentials for both services.**

### MongoDB Atlas (Database)

1. Go to [https://cloud.mongodb.com](https://cloud.mongodb.com)
2. Sign in or create an account.
3. Create a new cluster and obtain your connection string.
4. Set the `MONGODB_URI` environment variable, or add it directly to `backend/app/database.py`.
5. Database name should be: `autism_screening`
6. Required Collections (will be created automatically):
   - `users` - Stores user accounts and PIN sentinels
   - `vault` - Stores encrypted screening reports

### Google Cloud Console (OAuth)

1. Go to [https://console.cloud.google.com](https://console.cloud.google.com)
2. Sign in or create an account.
3. Create a new project and configure the OAuth consent screen.
4. Navigate to **APIs & Services** → **Credentials**.
5. Create an OAuth 2.0 Client ID for a Web application.
6. Add your domains (e.g., `http://localhost:3000`) to the "Authorized JavaScript origins".
7. Copy your Client ID and add it into the code:
   - In `frontend/src/App.tsx` (`GOOGLE_CLIENT_ID` variable)
   - In `backend/app/routers/auth.py` (`GOOGLE_CLIENT_ID` variable)

---

## Medical Disclaimer

This application is a screening tool only and does not provide medical diagnoses. Always consult with qualified healthcare professionals for comprehensive evaluations and diagnoses.
