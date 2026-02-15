# Frontend - React Application

React single-page application for BookEase booking system.

## Tech Stack

- React ^19.2.0
- React Router for routing
- Axios for API calls
- Tailwind CSS for styling
- Vite as build tool

## Setup

### Install Dependencies

```bash
npm install
```

### Configure Environment

Create `.env` file:

```env
VITE_API_URL=http://localhost:8000/api
```

### Start Development Server

```bash
npm run dev
```

App runs at: http://localhost:5173

## Main Components

### Authentication

**AuthContext.jsx**
- Stores logged-in user data
- Provides login/logout functions
- Checks if user is authenticated

**ProtectedRoutes.jsx**
- Redirects to login if not authenticated
- Used to wrap private routes

### Pages

**Home.jsx** - Landing page with features and signup

**Login.jsx** - Login form that calls `/auth/login` API

**Signup.jsx** - Registration form with email verification

### ProtectedRoutes for signed up and verified user.

**Dashboard.jsx** - Shows stats, event list, and quick actions for signed up host.

**Events.jsx** - Create/edit/delete event types

**Availability.jsx** - Set weekly schedule and block dates

**Bookings.jsx** - View all bookings with filters

### Booking Flow

**HostBookingPage.jsx** - Shows all event types for a host

**PublicBooking.jsx** - Three-step booking process:
1. Select date
2. Choose time slot
3. Enter guest details
4. Show confirmation
5. Double booking is prevented

## Routes

### Public Routes
- `/` - Home page
- `/login` - Login
- `/signup` - Signup
- `/:username` - Host's event types
- `/:username/:eventSlug` - Booking page

### Protected Routes (need login)
- `/dashboard` - Dashboard
- `/events` - Manage events
- `/availability` - Set availability
- `/bookings` - View bookings

## How State Management Works

Using React Context API for global state:

```javascript
// AuthContext provides:
const { user, login, logout, isLoading } = useAuth();

// user - current user object or null
// login(email, password) - login function
// logout() - logout function
// isLoading - loading state
```

Components can access this from anywhere:
```javascript
import { useAuth } from './context/AuthContext';

function MyComponent() {
  const { user } = useAuth();
  // use user data
}
```

## How API Calls Work

Axios is configured in `api/axios.js`:

```javascript
// Automatically adds token to all requests
// Base URL from environment variable
// Handles errors globally
```

Example API call:
```javascript
import api from '../api/axios';

// In component:
const response = await api.get('/event-types');
const events = response.data.event_types;
```

## Styling

Using Tailwind CSS utility classes:

## Important Files

**App.jsx** - Main component with all routes defined

**main.jsx** - Entry point, wraps app with AuthProvider

**axios.js** - Axios configuration with interceptors

**AuthContext.jsx** - Global authentication state

## Common Issues

### API calls not working
Check that:
- Backend is running on port 8000
- VITE_API_URL in .env is correct
- Token is stored in localStorage (check browser dev tools)

### Routes not working
Make sure react-router-dom is installed:
```bash
npm install react-router-dom
```

### Build errors
Clear cache and reinstall:
```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```
## Validations handled by proper error codes from api.

## Learning Notes

Things I learned:

- How to structure a React SPA
- React Router for navigation
- Context API for state management
- Making authenticated API calls
- Protecting routes based on login status
- Using environment variables in React
- Tailwind CSS utility classes
- Form handling in React

## Things I Want to Improve

- Add loading spinners
- Improve mobile design
- Better organize components (too many in one file)
- Use custom hooks for repeated logic

Frontend built with React and Vite