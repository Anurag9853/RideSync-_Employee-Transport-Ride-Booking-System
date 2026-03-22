# RideSync Frontend

React frontend for the RideSync Transport Employee Ride Management System.

## Prerequisites

- Node.js 18+ and npm
- Backend API running on `http://localhost:8080` (or configure via `.env`)

## Setup

1. Install dependencies:
```bash
npm install
```

2. (Optional) Configure API base URL:
   - Copy `.env.example` to `.env`
   - Update `VITE_API_BASE_URL` if your backend runs on a different port

3. Start development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Build for Production

```bash
npm run build
```

The built files will be in the `dist` folder.

## Project Structure

```
src/
  api/              # Axios instance and API functions
  context/          # React Context (AuthContext)
  components/       # Reusable components (Navbar, RideCard, ProtectedRoute)
  pages/            # Page components (Login, Register, Dashboard, Rides, MyBookings)
  styles/           # CSS files (global, auth, dashboard)
  App.jsx           # Main app component with routing
  main.jsx          # Entry point
```

## Features

- JWT-based authentication
- Protected routes
- Ride browsing and booking
- Booking management
- Responsive design
