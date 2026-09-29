import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import ProjectsAndSprintsPage from "../pages/ProjectsAndSprintsPage";
import ProjectPage from "../pages/ProjectPage";
import SprintManagementPage from "../pages/SprintManagementPage";
import EntryDashboard from "../pages/EntryDashboard";
import Layout from "../pages/Layout";
import HomePage from "../pages/HomePage";
import UserManagement from "../pages/UserManagement";
import RecordStatusPage from "../pages/RecordStatusPage";
import ActivitiesPage from "../pages/ActivitiesPage";
import EntriesPage from "../pages/EntriesPage";
import ProtectedRoute from "./ProtectedRoute";
import GeneralActivitiesPage from "../pages/GeneralActivitiesPage";
import ReportChartTestPage from "../components/reports/ReportChartTestPage";

/** Returns true only when both auth keys are present in localStorage */
function isAuthenticated() {
  return !!(localStorage.getItem("token") && localStorage.getItem("userInfo"));
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public route */}
        <Route
          path="/"
          element={
            isAuthenticated() ? <Navigate to="/home" replace /> : <LoginPage />
          }
        />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          {/* Common Layout */}
          <Route element={<Layout />}>
            {/* Work Area */}
            <Route path="/home" element={<ProjectsAndSprintsPage />} />
            <Route path="/projects" element={<ProjectPage />} />
            {/* <Route path="/activities" element={<ActivitiesPage />} /> */}
            <Route path="/user-management" element={<UserManagement />} />
            <Route path="/record-status" element={<RecordStatusPage />} />

            <Route
              path="/sprints/:sprintId/activities"
              element={<SprintManagementPage />}
            />
            <Route
              path="/projects/:projectId/activities"
              element={<ActivitiesPage />}
            />
            <Route path="/entry-dashboard" element={<EntryDashboard />} />
            <Route path="/entries" element={<EntriesPage />} />
            <Route
              path="/general-activity"
              element={<GeneralActivitiesPage />}
            />
            <Route
              path="/reports1"
              element={<ReportChartTestPage />}
            />
          </Route>
        </Route>

        {/* Unknown route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
