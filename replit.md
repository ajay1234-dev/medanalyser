# AI-Driven Medical Report & Prescription Analyzer

## Overview

This is a full-stack AI-powered healthcare platform that enables patients to upload and analyze medical reports and prescriptions, while allowing doctors to review patient data and provide consultations. The system uses OCR to extract text from documents, AI (Google Gemini) to analyze and interpret medical data, and provides health tracking, visualizations, and reminder functionality. The platform bridges the gap between complex medical reports and patient understanding through automated analysis and simple explanations.

## Recent Changes (October 2, 2025)

### UI/UX Enhancement Update
- **Comprehensive UI Overhaul**: Completely redesigned all pages and dashboards with modern medical-themed aesthetics
- **Navigation Enhancements**: Added sticky navigation bars with backdrop blur effects, gradient medical icons, and better user info display
- **Dashboard Improvements**: Enhanced Patient and Doctor dashboards with gradient stat cards, improved spacing, and visual hierarchy
- **Component Modernization**: 
  - Login/Signup pages with gradient backgrounds, animated elements, and password visibility toggle
  - UploadReport with enhanced drag-drop UI and gradient progress indicators
  - ReportList with improved card design, badges, and smooth animations
  - HealthChart with custom tooltips and better styling
  - PatientCard with dynamic avatar colors and polished design
- **Styling Additions**: Custom scrollbar styles with medical-themed gradients
- **Design Language**: Consistent use of blue-to-indigo gradients, rounded corners, shadow effects, and hover animations throughout

### Previous Updates
- **Replit Environment Setup Complete**: Successfully configured for Replit development environment
- **System Dependencies Installed**: Poppler (PDF processing), Tesseract OCR, Node.js 20
- **Frontend Configuration**: Vite configured with proper HMR settings for Replit proxy (host: 0.0.0.0:5000)
- **Backend Configuration**: Flask server running on localhost:8000 with graceful API key handling
- **Workflows Configured**: Frontend workflow (port 5000, webview) and Backend workflow (port 8000, console)
- **Deployment Ready**: VM deployment configured with start.sh script for both frontend and backend
- **API Key Handling**: Backend gracefully handles missing GEMINI_API_KEY and Firebase credentials with helpful error messages
- **Duplicate Directory Cleanup**: Removed redundant MediMindAI folder structure

## Setup Requirements

⚠️ **IMPORTANT**: This application requires external API credentials to function:

### Required Environment Variables

**Backend (Create `backend/.env` file):**
- `GEMINI_API_KEY` - Get from https://aistudio.google.com/app/apikey
- `FIREBASE_PROJECT_ID` - From Firebase Console
- `FIREBASE_CLIENT_EMAIL` - From Firebase Service Account
- `FIREBASE_PRIVATE_KEY` - From Firebase Service Account (download JSON key)

**Frontend (Create `frontend/.env` file):**
- `VITE_FIREBASE_API_KEY` - From Firebase Console > Project Settings
- `VITE_FIREBASE_AUTH_DOMAIN` - Usually `{project-id}.firebaseapp.com`
- `VITE_FIREBASE_PROJECT_ID` - Your Firebase project ID
- `VITE_FIREBASE_STORAGE_BUCKET` - Usually `{project-id}.appspot.com`
- `VITE_FIREBASE_MESSAGING_SENDER_ID` - From Firebase Console
- `VITE_FIREBASE_APP_ID` - From Firebase Console
- `VITE_BACKEND_URL` - Currently set to Replit domain with port 8000

### Firebase Setup Steps:
1. Create a Firebase project at https://console.firebase.google.com
2. Enable Email/Password authentication in Firebase Auth
3. Create a Firestore database
4. Create a Storage bucket
5. Generate a service account key (Settings > Service Accounts > Generate New Private Key)
6. Add the credentials to the respective .env files

### Current Status:
- ✅ Development server running (frontend may show blank until Firebase is configured)
- ✅ Backend API operational (gracefully handles missing credentials)
- ✅ OCR and file processing ready (Tesseract and Poppler installed)
- ⚠️ Authentication and AI features require API keys to be configured

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with Vite for fast development and building
- **Routing**: React Router v6 with protected route components and role-based access control
- **Styling**: TailwindCSS v4 (with @tailwindcss/postcss) for responsive UI components
- **Visualization**: Recharts for health trend graphs and timeline charts
- **State Management**: React Context API (AuthContext) for global authentication state
- **API Integration**: Axios with interceptors for automatic token attachment
- **Key Pages**: 
  - Login page with remember-me functionality (Firebase persistence)
  - Signup page with role selection (patient/doctor)
  - Patient dashboard with file upload, AI analysis display, report timeline, and visualizations
  - Doctor dashboard with patient list, report viewing, and health trend analysis
- **Components**:
  - ProtectedRoute: Wrapper for authenticated routes with role validation
  - UploadReport: Drag-and-drop file upload with progress and validation
  - HealthChart: Recharts line chart for timeline visualization
  - ReportList: Searchable list of medical reports with click-to-view
  - PatientCard: Doctor view of patient information with report counts
- **Backend Integration**: 
  - Backend URL: https://7f378abd-e71b-46bf-b706-2b3ac1cc5cce-00-zh72b1unbhua.sisko.replit.dev
  - CORS-enabled requests with Firebase ID tokens in Authorization headers
  - Real-time file upload with FormData
  - Report retrieval with pagination support

### Backend Architecture
- **Framework**: Flask (Python) REST API server
- **File Processing Pipeline**:
  - File upload handling with security validation (10MB limit, specific file types)
  - OCR text extraction using Tesseract for images and PDFs
  - AI-powered analysis using Google Gemini for medical interpretation
  - Utility module (`utils.py`) separates OCR and AI logic from API endpoints
- **CORS Configuration**: Configurable allowed origins for frontend communication
- **File Storage**: Local uploads folder with secure filename handling

### Authentication & Authorization
- **Firebase Authentication**: Handles secure user login for both patients and doctors
  - Client-side: Firebase JS SDK v10 with React integration
  - Server-side: Firebase Admin SDK with token verification and revocation checking
  - Remember Me: Browser localStorage vs sessionStorage persistence
- **Role-Based Access**: Separate dashboards and permissions for patient vs doctor roles
  - Protected routes redirect based on user role
  - Firestore stores user role in /users/{uid}/role field
- **Token-Based Security**: Authorization headers for API requests
  - Automatic token refresh via Firebase
  - Axios interceptors attach tokens to all backend requests

### Data Storage
- **Firestore Database**: NoSQL document database for:
  - User profiles (patients and doctors)
  - Medical reports metadata and analysis results
  - Health timeline data
  - Doctor-patient relationships
  - Reminders and notifications
- **Firebase Cloud Storage**: Stores uploaded medical documents (PDFs, images)
- **Local Temporary Storage**: Uploads folder for processing files before cloud storage

### AI & OCR Processing
- **OCR Engine**: Tesseract for text extraction from medical documents
- **PDF Processing**: pdf2image for converting PDF pages to images before OCR
- **AI Analysis**: Google Gemini API for:
  - Interpreting extracted medical data
  - Identifying abnormal values
  - Generating patient-friendly explanations
  - Summarizing complex medical information
- **Design Decision**: Separation of OCR and AI logic into `utils.py` allows for easier testing and potential swapping of AI providers

### Notification System
- **Firebase Cloud Messaging**: Handles push notifications for:
  - Medicine reminders
  - Test/checkup reminders
  - Doctor notifications for new patient uploads
  - Patient notifications for doctor feedback

## External Dependencies

### Third-Party Services
- **Firebase Suite**:
  - Firebase Authentication (user management)
  - Firestore (database)
  - Firebase Cloud Storage (file storage)
  - Firebase Cloud Messaging (notifications)
  - Firebase Admin SDK for backend operations
- **Google Gemini AI**: Medical report analysis and natural language processing
- **Tesseract OCR**: Open-source optical character recognition engine

### Python Libraries
- **Flask 3.0.0**: Web framework
- **Flask-CORS 4.0.0**: Cross-origin resource sharing
- **pytesseract 0.3.10**: Tesseract OCR wrapper
- **pdf2image 1.17.0**: PDF to image conversion
- **Pillow 10.2.0**: Image processing
- **google-genai 1.0.0**: Google Gemini API client
- **firebase-admin 6.4.0**: Firebase backend SDK
- **python-dotenv 1.0.0**: Environment variable management
- **Werkzeug 3.0.1**: WSGI utilities

### Environment Configuration
- **Backend Environment Variables**:
  - `GEMINI_API_KEY`: Google Gemini API authentication
  - `ALLOWED_ORIGINS`: CORS configuration for frontend URLs
  - `FIREBASE_PRIVATE_KEY`: Firebase Admin SDK private key
  - `FIREBASE_PROJECT_ID`: Firebase project identifier
  - `FIREBASE_CLIENT_EMAIL`: Firebase service account email
  - `DEBUG`: Controls Flask debug mode (default: False)

- **Frontend Environment Variables**:
  - `VITE_FIREBASE_API_KEY`: Firebase web API key
  - `VITE_FIREBASE_AUTH_DOMAIN`: Firebase auth domain
  - `VITE_FIREBASE_PROJECT_ID`: Firebase project ID
  - `VITE_FIREBASE_STORAGE_BUCKET`: Firebase storage bucket
  - `VITE_FIREBASE_MESSAGING_SENDER_ID`: Firebase messaging sender ID
  - `VITE_FIREBASE_APP_ID`: Firebase app ID
  - `VITE_BACKEND_URL`: Backend API base URL (defaults to Replit domain)

### System Requirements
- Tesseract OCR must be installed on the system (not just the Python wrapper)
- Poppler utilities required for PDF processing (dependency of pdf2image)