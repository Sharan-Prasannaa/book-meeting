import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Home from "./pages/Home";
import Signup from "./pages/SignUp";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Events from "./pages/Events";
import Availability from "./pages/Availability";
import Bookings from "./pages/Bookings";
import Profile from "./pages/Profile";
import VerifyNotice from "./pages/VerifyNotice";
import VerifyEmail from "./pages/VerifyEmail";
import HostBookingPage from "./components/booking/HostBookingPage";
import PublicEventTypes from "./components/booking/PublicEventTypes";
import PublicBooking from "./components/booking/PublicBooking";
import ProtectedRoute from "./components/ProtectedRoutes";
import PublicRoute from "./components/PublicRoutes";

import "./styles/calendar.css";

function App() {
  return (
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            
            {/* Auth Routes */}
            <Route path="/signup" element={<Signup />} />
            <Route path="/verify-notice" element={<VerifyNotice />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route 
              path="/login" 
              element={
                <PublicRoute redirectTo="/dashboard">
                  <Login />
                </PublicRoute>
              } 
            />

            {/* Protected Routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/events" 
              element={
                <ProtectedRoute>
                  <Events />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/availability" 
              element={
                <ProtectedRoute>
                  <Availability />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/bookings" 
              element={
                <ProtectedRoute>
                  <Bookings />
                </ProtectedRoute>
              } 
            />
            <Route path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            {/* PUBLIC BOOKING ROUTES */}
            {/* Host's booking page - shows all event types */}
            <Route path="/:userSlug" element={<HostBookingPage />} />
            
            {/* Specific event type booking page */}
            <Route path="/:userSlug/:eventSlug" element={<PublicBooking />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
  );
}

export default App
