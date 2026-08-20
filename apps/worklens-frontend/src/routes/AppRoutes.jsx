import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage          from "../pages/LoginPage";
import ProjectsAndSprintsPage from "../pages/ProjectsAndSprintsPage";
import SprintActivitiesPage from "../pages/SprintActivitiesPage";
import ActivitiesPage     from "../pages/ActivitiesPage";
import ProtectedRoute     from "./ProtectedRoute";

function isAuthenticated() {
  return !!(localStorage.getItem("token") && localStorage.getItem("userInfo"));
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route
          path="/"
          element={isAuthenticated() ? <Navigate to="/home" replace /> : <LoginPage />}
        />

        {/* Dashboard */}
        <Route
          path="/home"
          element={<ProtectedRoute><ProjectsAndSprintsPage /></ProtectedRoute>}
        />

        <Route
          path="/projects"
          element={<ProtectedRoute><ProjectsAndSprintsPage /></ProtectedRoute>}
        />

        <Route
          path="/sprints"
          element={<ProtectedRoute><ProjectsAndSprintsPage /></ProtectedRoute>}
        />

        {/*
          Sprint-Activities page
          Entry point: user selects a sprint from the Active Sprints page
          (or enters the URL directly while that page is in development).
          Pattern mirrors the API: /sprint_activity/sprint/{sprintId}
        */}
        <Route
          path="/sprints/:sprintId/activities"
          element={<ProtectedRoute><SprintActivitiesPage /></ProtectedRoute>}
        />

        {/*
          Activities page — project-level activity management.
          UI is not yet finalised; renders a placeholder.
        */}
        <Route
          path="/activities"
          element={<ProtectedRoute><ActivitiesPage /></ProtectedRoute>}
        />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
