# JobGenius - AI Career Advisor

JobGenius is a modern, AI-powered platform designed to bridge the gap between your current skills and your dream career. Using advanced LLM analysis (Gemini AI), the platform provides personalized, technical insights to optimize your professional profile.

## 🚀 Features

- **AI Resume Analysis**: Upload your resume for deep technical scrutiny.
- **Career Advisor**: Get specific, actionable suggestions to improve your resume's impact.
- **Job Recommendations**: Receive tailored job matches based on your analyzed skills.
- **Dynamic Dashboard**: Track your career progress and profile health.
- **Modern UI/UX**: Responsive, dark-themed design with neon accents.

## 🛠️ Technology Stack

### Backend
- **Framework**: Django & Django REST Framework
- **AI Engine**: Google Gemini Pro (via `google-generativeai`)
- **Database**: SQLite (Development) / PostgreSQL (Production)
- **NLP**: Spacy for initial resume parsing.

### Frontend
- **Library**: React.js with Vite
- **Styling**: CSS3 with modern features (Flexbox, Grid, Glassmorphism)
- **Icons**: Custom SVG & Lucide-inspired components.

## 📦 Installation

### Backend Setup
1. Navigate to the `backend` directory.
2. Create a virtual environment: `python -m venv venv`.
3. Activate the environment and install dependencies: `pip install -r requirements.txt`.
4. Set your `GEMINI_API_KEY` in the environment variables.
5. Run migrations: `python manage.py migrate`.
6. Start the server: `python manage.py runserver`.

### Frontend Setup
1. Navigate to the `frontend` directory.
2. Install packages: `npm install`.
3. Start the development server: `npm run dev`.

## 📱 Responsiveness
The project is fully responsive across mobile, tablet, and desktop devices, ensuring a seamless experience for users on the go.

## 🔌 API Endpoints

The backend provides a RESTful API for all core functionalities.

### **Authentication**
- `POST /api/resume/register/`: Register a new user.
- `POST /api/token/`: Obtain JWT access and refresh tokens (Login).
- `POST /api/token/refresh/`: Refresh an expired access token.

### **Resume Management**
- `POST /api/resume/upload/`: Upload and analyze a new resume (Multipart form-data).
- `GET /api/resume/my-resume/`: Retrieve the authenticated user's resume data.

### **AI & Recommendations**
- `GET /api/suggestions/suggestions/<resume_id>/`: Get AI-powered improvement suggestions.
- `GET /api/jobs/recommend/<resume_id>/`: Fetch personalized job recommendations.



