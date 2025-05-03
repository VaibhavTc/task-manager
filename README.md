# Task Management Application

A full-stack task management application built with React, Node.js, and Express.

## Features

- User authentication (register/login)
- Create, read, update, and delete tasks
- Mark tasks as complete/incomplete
- Prioritize tasks (Low, Medium, High)
- Filter tasks by status

## Tech Stack

### Frontend
- React with TypeScript
- React Router for navigation
- React Context API for state management
- Custom hooks for form handling and API communication
- Tailwind CSS for styling
- Lucide React for icons

### Backend
- Node.js with Express
- JWT authentication
- RESTful API

### Demo User Credentials

You can log in using the following seeded demo account:
   ```
   Email: demo@example.com  
   Password: demo123
   ```
## Project Structure

```
/
├── src/               # Frontend React application
│   ├── components/    # Reusable UI components
│   ├── contexts/      # React context providers
│   ├── hooks/         # Custom React hooks
│   ├── pages/         # Page components
│   └── utils/         # Utility functions
├── server/            # Backend Express server
│   ├── middleware/    # Express middleware
│   ├── models/        # Data models (to be implemented)
│   └── routes/        # API routes
└── public/            # Static files
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- NPM (v6 or higher)

### Installation

1. Install dependencies:
   ```
   npm install
   ```

2. Create a `.env` file in the root directory with the following variables:
   ```
   JWT_SECRET=your_secret_key
   PORT=5000
   MONGODB_URI=your_db_url
   ```

### Running the Application

Start the development server:
```
npm run dev
```

This will concurrently start:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000
