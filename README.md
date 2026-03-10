# Career Compass 🧭 - Prototype 2

A modern, AI-powered job application tracker designed to streamline your job search journey. Built with React, TypeScript, and Tailwind CSS.

**Prototype 2** uses the same screens and layout from Prototype 1, but presented in a slightly clearer, more organized format so users can focus on the value of the concept rather than the design details.

![Career Compass](https://img.shields.io/badge/React-18.3-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-blue)

## ✨ Features

### Dashboard
- **Kanban Board**: Drag-and-drop interface to manage applications across 5 stages (Saved, Applied, Interviewing, Offer, Rejected)
- **Compact Stats**: Quick overview of total applications, active opportunities, response rate, and upcoming interviews
- **Search & Filter**: Instantly find applications by company or role
- **Persistent Storage**: All data saved locally in your browser

### Calendar View
- **Visual Timeline**: See all your interviews and deadlines at a glance
- **Drag-and-Drop**: Reschedule events by dragging them to new dates
- **Side Panel**: View event details, search events, and quick-edit functionality
- **Time Support**: Add specific times to your interviews and appointments

### Analytics
- **Status Distribution**: Pie chart showing application breakdown by stage
- **Source Tracking**: Bar chart of where your applications come from
- **Real-time Metrics**: Automatically updated as you add/update applications

### Job Discovery
- **AI-Matched Jobs**: Browse curated job recommendations with match scores
- **Advanced Filters**: Customize by role, industry, salary, location, work type, experience level, and company size
- **Quick Add**: One-click to add interesting jobs to your tracker
- **Interactive Preferences**: Toggle-based filter panel for easy customization

### CV Optimizer
- **Match Analysis**: Upload your CV and paste a job description to get an instant match score (0-100%)
- **AI Suggestions**: Receive detailed recommendations across 4 categories:
  - Keywords (missing terms from job description)
  - Structure (formatting and organization)
  - Impact (quantifiable achievements)
  - Language (action verbs and tone)
- **Optimized Preview**: See your improved CV with highlighted changes
- **Score Improvement**: Track before/after scores to measure optimization impact

##  Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

1. Clone the repository:
```bash
git clone [https://github.com/yourusername/career-compass.git](https://github.com/yourusername/career-compass.git)
cd career-compass
Install dependencies:
bash
npm install
Start the development server:
bash
npm run dev
Open http://localhost:5173 in your browser
Build for Production
bash
npm run build
The built files will be in the dist directory.

🛠️ Tech Stack
Framework: React 18 with TypeScript
Styling: Tailwind CSS with custom design system
State Management: Zustand with localStorage persistence
Drag & Drop: @dnd-kit
Charts: Recharts
UI Components: Radix UI primitives
Icons: Lucide React
Date Handling: date-fns
Build Tool: Vite
📁 Project Structure
src/
├── components/
│   ├── dashboard/       # Kanban board, job cards, stats
│   ├── calendar/        # Calendar view and event components
│   ├── analytics/       # Charts and metrics
│   ├── discover/        # Job discovery and filters
│   ├── cv-optimizer/    # CV analysis components
│   ├── onboarding/      # Initial setup flow
│   ├── layout/          # App shell, sidebar, navigation
│   └── ui/              # Reusable UI components (buttons, inputs, etc.)
├── pages/               # Main page components
├── store/               # Zustand state management
├── lib/                 # Utilities and helpers
└── App.tsx              # Main app component

Design 
Minimalist, premium design aesthetic.

Clean Typography: Inter font for maximum readability
Subtle Animations: Smooth transitions using Framer Motion
Consistent Spacing: 8px grid system throughout
Accessible Colors: High-contrast palette with semantic color usage
Dark Mode Ready: Full dark mode support via Tailwind CSS

⚠️ Demo Limitations
This is a frontend demo with the following limitations:
Mock AI: CV analysis and job matching use algorithmic simulations, not real AI/ML models
Local Storage Only: All data stored in browser localStorage (no backend/database)
No Authentication: Single-user experience without login
Static Job Data: Job recommendations are hardcoded examples
No Real Integrations: No actual job board APIs or email sync
🔮 Future Enhancements
Backend API with database persistence
User authentication and multi-user support
Real AI/ML models for CV analysis and job matching
Integration with job boards (LinkedIn, Indeed, etc.)
Email parsing for automatic application tracking
Team collaboration features
Mobile app (React Native)
Browser extension for one-click job saving




