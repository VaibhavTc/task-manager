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
   ```

### Running the Application

Start the development server:
```
npm run dev
```

This will concurrently start:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## Database Integration

This project uses an in-memory array for data storage by default. To connect to a real database:

1. Choose a database system (MongoDB, PostgreSQL, MySQL, etc.)
2. Install the appropriate database driver
3. Create connection logic in the `server/models/` directory
4. Update the routes to use the database models instead of in-memory arrays

## Production Build

```
npm run build
```

This creates a production build in the `dist` directory.

## Notes

- The current implementation uses in-memory arrays for data storage, which means data will be lost when the server restarts
- For a production application, implement a proper database connection
