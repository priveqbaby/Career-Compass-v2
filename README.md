# Career Compass 🧭 - V3

A modern, AI-powered job application tracker designed to streamline your job search journey. Built with React, TypeScript, Tailwind CSS, and powered by Anthropic's Claude 3.5 Sonnet API!

**Version 3** evolves the application into a functional AI-assisted product by integrating a secure Vercel Serverless proxy backend to handle live Claude 3.5 AI prompts directly from the application.

![React](https://img.shields.io/badge/React-18.3-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-blue) ![Vercel](https://img.shields.io/badge/Vercel-Deployed-black) ![Claude API](https://img.shields.io/badge/AI-Claude_3.5_Sonnet-purple)

## ✨ Features

### Dashboard
- **Kanban Board**: Drag-and-drop interface to manage applications across 5 stages (Saved, Applied, Interviewing, Offer, Rejected).
- **Interactive Modals**: When dragged to Interviewing/Offer stages, modals pop up to let you quickly log your interview or offer dates.
- **Persistent Storage**: Uses robust local state management (Zustand) keeping your dashboard lightning fast.

### 🧠 CI Optimizer (Powered by Claude)
- **Instant Match Analysis**: Upload your `.txt` CV and paste a job description.
- **Live AI Optimization**: Uses Anthropic's Claude API to securely analyze and rewrite your resume bullets targeting the specific job description.
- **Missing Keywords**: Instantly highlights missing keywords from the JD so you can pass Application Tracking Systems (ATS).

### 💬 Interview Prep (Powered by Claude)
- **Role-Specific Coaching**: Paste any job description to instantly get 5 customized interview questions.
- **Psychological Insights**: The AI breaks down "What they are actually testing" and provides you with the exact framework to answer strongly.
- **Red Flags**: Outlines exactly what the recruiter considers a "dealbreaker" answer for each prompt.

## 🚀 Getting Started Locally

### Prerequisites
- Node.js 18+ and npm
- An Anthropic API Key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/priveqbaby/Career-Compass-v2.git
cd Career-Compass-v2
```

2. Install dependencies:
```bash
npm install
```

3. Setup your Environment Variables:
Create a `.env` file at the root of the project:
```bash
ANTHROPIC_API_KEY=your_actual_anthropic_api_key_here
```

4. Start the development server (using Vercel Dev to support the proxy):
```bash
npm i -g vercel
vercel dev
```

## ☁️ Vercel Deployment

This project is actively configured for **Vercel** serverless deployment. 
To ensure the AI features work in production:
1. Connect this GitHub repository to Vercel.
2. In the Vercel Dashboard, go to **Settings > Environment Variables**.
3. Add a new variable: `ANTHROPIC_API_KEY` with your secret key.
4. Redeploy.

## 🛠️ Tech Stack
- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Backend/Proxy**: Vercel Serverless Functions (`api/claude.ts`)
- **AI Model**: `claude-3-5-sonnet-20241022` (Anthropic)

## 📁 Key Project Structure
```
├── api/
│   └── claude.ts        # Secure Vercel Function proxying Anthropic requests
├── src/
│   ├── components/      # Reusable UI components (Kanban, Modals)
│   ├── pages/           # Main Views (Dashboard, CVOptimizer, InterviewPrep)
│   ├── store/           # Zustand state management
│   └── App.tsx          # Main routing/shell
```
