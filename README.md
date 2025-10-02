# AI-Driven Medical Report & Prescription Analyzer

A full-stack AI-powered healthcare platform that helps patients understand their medical reports and prescriptions through OCR text extraction and AI analysis.

## Features

- 📄 **OCR Processing**: Extract text from PDFs and images of medical documents
- 🤖 **AI Analysis**: Get patient-friendly explanations using Google Gemini AI
- 👥 **Role-Based Access**: Separate dashboards for patients and doctors
- 📊 **Health Tracking**: Visualize health trends over time
- 🔐 **Secure Authentication**: Firebase-based user authentication
- ☁️ **Cloud Storage**: Store medical documents securely in Firebase Storage

## Quick Start

### Prerequisites

The application requires API credentials to function. You need:
- Firebase project (free tier available)
- Google Gemini API key (free tier available)

### Environment Setup

1. **Backend Configuration** - Create `backend/.env`:
```
GEMINI_API_KEY=your_api_key_here
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_service_account_email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"
```

2. **Frontend Configuration** - Create `frontend/.env`:
```
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_BACKEND_URL=http://localhost:8000
```

### Firebase Setup

1. Create a project at [Firebase Console](https://console.firebase.google.com)
2. Enable Email/Password authentication
3. Create a Firestore database
4. Create a Storage bucket
5. Download service account key from Settings > Service Accounts

### Getting Gemini API Key

1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Create an API key
3. Add it to `backend/.env`

## Running the Application

The application is configured to run automatically in Replit. Both frontend and backend servers will start:

- **Frontend**: http://localhost:5000 (or your Replit URL)
- **Backend API**: http://localhost:8000

## Tech Stack

### Frontend
- React 19 with Vite
- TailwindCSS for styling
- React Router for navigation
- Recharts for data visualization
- Firebase SDK for authentication

### Backend
- Flask (Python)
- Tesseract OCR for text extraction
- Google Gemini AI for analysis
- Firebase Admin SDK
- pdf2image for PDF processing

## Architecture

- **Frontend**: React SPA with role-based routing
- **Backend**: RESTful API with OCR and AI processing
- **Database**: Firebase Firestore
- **Storage**: Firebase Cloud Storage
- **Authentication**: Firebase Auth with JWT tokens

## Current Status

✅ Development environment configured
✅ All dependencies installed
✅ Workflows running
⚠️ Requires API credentials to be fully functional

See `replit.md` for detailed architecture and setup information.