import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import HomePage from "../pages/HomePage";
import UserManagement from "../pages/UserManagement";
import ProtectedRoute from "./ProtectedRoute";

/** Returns true only when both auth keys are present in localStorage */
function isAuthenticated() {
  return !!(localStorage.getItem("token") && localStorage.getItem("userInfo"));
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public — redirect to /home if already logged in */}
        <Route
          path="/"
          element={isAuthenticated() ? <Navigate to="/home" replace /> : <LoginPage />}
        />

        {/* Protected routes — redirect to / if not authenticated */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/user-management"
          element={
            <ProtectedRoute>
              <UserManagement />
            </ProtectedRoute>
          }
        />

        {/* Catch-all: unknown paths redirect to / */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
