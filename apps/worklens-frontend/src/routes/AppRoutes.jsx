import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "../pages/LoginPage";
import HomePage from "../pages/HomePage";
import ProjectPage from "../pages/ProjectPage";

import ProtectedRoute from "./ProtectedRoute";
import Layout from "../pages/Layout";

/** Returns true only when both auth keys are present in localStorage */
function isAuthenticated() {
  return !!(
    localStorage.getItem("token") &&
    localStorage.getItem("userInfo")
  );
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public route */}
        <Route
          path="/"
          element={
            isAuthenticated()
              ? <Navigate to="/home" replace />
              : <LoginPage />
          }
        />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>

          {/* Common Layout */}
          <Route element={<Layout />}>

            {/* Work Area */}
            <Route path="/home" element={<HomePage />} />

            <Route path="/projects" element={<ProjectPage />} />

          </Route>

        </Route>

        {/* Unknown route */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
}