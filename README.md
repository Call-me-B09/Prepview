# Prepview
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)]()
[![Express](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)]()
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)]()
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)]()

Prepview is an AI-powered interview preparation tool designed to help users practice and improve their interview skills. It allows users to upload their CV, select topics, and simulate interview sessions with AI-generated questions. The application provides feedback and scoring based on the user's performance.



## 📑 Table of Contents
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Installation](#-installation)
- [Usage](#-usage)
- [Project Structure](#-project-structure)
- [API Reference](#-api-reference)
- [Contributing](#-contributing)
- [License](#-license)
- [Important Links](#-important-links)
- [Footer](#-footer)



## ✨ Features
- 🚀 **CV Upload**: Users can upload their CVs in PDF or DOCX format to tailor interview questions.
- 🎯 **Topic Selection**: Users can select specific topics for the interview to focus on relevant areas.
- 🤖 **AI-Generated Questions**: The application generates interview questions based on the uploaded CV and selected topics using Groq.
- 🎤 **Audio Recording**: Users can record their answers to interview questions.
- 📝 **Transcription**: Audio responses are transcribed using AssemblyAI.
- 📊 **Performance Evaluation**: The application provides feedback, scores, and identifies strengths and areas for improvement.
- 💾 **Session History**: Users can view their previous interview sessions and review their performance.
- 🔥 **Firebase Authentication:** Secure user authentication using Firebase.



## 🛠️ Tech Stack
- **Backend**: JavaScript, Express.js, Node.js, Mongoose, AssemblyAI, Groq
- **Frontend**: React, Vite, Tailwind CSS, Framer Motion, React Router
- **Database**: MongoDB



## ⚙️ Installation



### Prerequisites
- Node.js (version >= 18)
- npm or yarn
- MongoDB
- Firebase project.



### Steps
1.  Clone the repository:

    ```bash
    git clone https://github.com/Call-me-B09/Prepview.git
    cd Prepview
    ```

2.  Navigate to the backend directory:

    ```bash
    cd backend
    ```

3.  Install backend dependencies:

    ```bash
    npm install
    ```

4.  Create a `.env` file in the `backend` directory and add the following environment variables:

    ```
    MONGO_URI=<Your MongoDB Connection URI>
    ASSEMBLYAI_API_KEY=<Your AssemblyAI API Key>
    GROQ_API_KEY=<Your Groq API Key>
    OCRSPACE_API_KEY=<Your OCR Space API Key>
    PORT=5000
    ```

5.  Start the backend server:

    ```bash
    node server.js
    ```

6.  Navigate to the frontend directory:

    ```bash
    cd ../frontend
    ```

7.  Install frontend dependencies:

    ```bash
    npm install
    ```

8.  Create a `.env` file in the `frontend` directory and add the following environment variables:

    ```
    VITE_API_URL=http://localhost:5000
    # Add other environment variables like Firebase config if needed
    ```

9.  Start the frontend development server:

    ```bash
    npm run dev
    ```



## 💡 Usage
1.  **Open the Application**: Access the application in your browser at `http://localhost:5173`.
2.  **Sign Up/Login**: Create an account or log in using email/password or Google authentication.
3.  **Upload CV**: Navigate to the app and upload your CV in PDF or DOCX format (optional).
4.  **Select Topics**: Choose one or more topics relevant to the interview.
5.  **Start Interview**: Click the "Start Interview" button to begin the mock interview session. The system will generate questions based on your CV and selected topics.
6.  **Record Answers**: For each question, click the "Start Recording" button, provide your answer, and then click "Stop Recording".
7.  **Review Results**: Once the interview is complete, the system will provide a score, feedback, strengths, and areas for improvement.
8.  **View History**: Access previous sessions from the menu.



## 📂 Project Structure
```
Prepview/
├── backend/
│   ├── server.js          # Entry point for the backend application
│   ├── package.json       # Backend dependencies and scripts
│   ├── src/
│   │   ├── controllers/   # Contains route handlers
│   │   │   ├── audiocontroller.js  # Audio upload and transcription logic
│   │   │   ├── pdfcontroller.js   # PDF processing logic
│   │   │   ├── reviewController.js # Review and session creation logic
│   │   │   └── sessioncontroller.js # Session retrieval logic
│   │   ├── models/        # Database models
│   │   │   ├── question.js    # Question model
│   │   │   └── session.js     # Session model
│   │   ├── routes/        # API routes
│   │   │   ├── audioRoutes.js   # Audio routes
│   │   │   ├── pdfRoutes.js     # PDF routes
│   │   │   ├── reviewRoutes.js  # Review routes
│   │   │   └── sessionroutes.js # Session routes
│   │   └── services/      # External API integrations and processing logic
│   │   │   ├── assemblyservice.js # AssemblyAI transcription service
│   │   │   ├── groqReviewService.js # Groq review service
│   │   │   ├── groqservice.js  # Groq question generation service
│   │   │   └── pdfservice.js    # PDF text extraction service
├── frontend/
│   ├── src/
│   │   ├── App.jsx          # Main application component
│   │   ├── components/    # React components
│   │   ├── firebase.js      # Firebase configuration
│   │   ├── hooks/         # Custom React hooks
│   │   └── utils/         # Utility functions
│   ├── package.json       # Frontend dependencies and scripts
│   ├── vite.config.js     # Vite configuration file
│   └── tailwind.config.js # Tailwind CSS configuration file
├── README.md            # Project documentation
```



## 📚 API Reference



### PDF Upload
- **Endpoint**: `POST /api/pdf/upload`
- **Description**: Uploads a PDF file and generates interview questions based on its content and selected topics.
- **Request Body**: `multipart/form-data`
  - `file`: PDF file
  - `topics`: JSON string of selected topics
- **Response**: JSON containing the extracted text from the PDF, selected topics, and generated questions.



### Audio Upload
- **Endpoint**: `POST /api/audio/upload-audio`
- **Description**: Uploads an audio file for transcription.
- **Request Body**: `multipart/form-data`
  - `audio`: Audio file
  - `questionId`: ID of the question being answered
- **Response**: JSON containing the transcribed text.



### Create Session
- **Endpoint**: `POST /api/review/create-session`
- **Description**: Creates a review session from the answered questions.
- **Request Body**: JSON containing the following: `userId`, `topics`, `questions`
- **Response**: JSON containing the created session, including feedback, score, strengths, and improvements.



### Get Sessions
- **Endpoint**: `GET /api/sessions`
- **Description**: Retrieves all sessions for a given user ID.
- **Query Parameters**: `userId`
- **Response**: JSON containing an array of session objects.



## 🤝 Contributing
Contributions are welcome! Please follow these steps:

1.  Fork the repository.
2.  Create a new branch for your feature or bug fix.
3.  Make your changes and commit them.
4.  Submit a pull request.



## 📜 License
This project has no specified license.



## 🔗 Important Links
- **Repository**: [https://github.com/Call-me-B09/Prepview](https://github.com/Call-me-B09/Prepview)



## <footer>
[![GitHub Repository](https://img.shields.io/github/stars/Call-me-B09/Prepview?style=social)](https://github.com/Call-me-B09/Prepview)

Prepview - [https://github.com/Call-me-B09/Prepview](https://github.com/Call-me-B09/Prepview) by [Call-me-B09](https://github.com/Call-me-B09). Fork, like, star and contribute!

</footer>

<p align="center">[This Readme generated by ReadmeCodeGen.](https://www.readmecodegen.com/)</p>
