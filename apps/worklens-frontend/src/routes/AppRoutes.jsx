import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import ProjectsAndSprintsPage from "../pages/ProjectsAndSprintsPage";
import ProjectPage from "../pages/ProjectPage";
import SprintManagementPage from "../pages/SprintManagementPage";
import EntryDashboard from "../pages/EntryDashboard";
import Layout from "../pages/Layout";
import HomePage from "../pages/HomePage";
import UserManagement from "../pages/UserManagement";
import ActivitiesPage from "../pages/ActivitiesPage";
import ProtectedRoute from "./ProtectedRoute";
import GeneralActivitiesPage from "../pages/GeneralActivitiesPage";
import StatusPage from "../pages/StatusPage";
import CategoryTypePage from "../pages/CategoryTypePage";
import ProfilePage from "../pages/ProfilePage";
import ReportChartTestPage from "../components/reports/ReportChartTestPage";
import MyEntriesPage from "../pages/MyEntriesPage";
import ResourcePage from "../pages/ResourcePage";
import { normalizeRole } from "../components/Sidebar";

/** Returns true only when both auth keys are present in localStorage */
function isAuthenticated() {
  return !!(localStorage.getItem("token") && localStorage.getItem("userInfo"));
}

// const stored = localStorage.getItem("userInfo");
// const userInfo = stored ? JSON.parse(stored) : null;
// const role = userInfo?.role || "Member";

// const normalizedRole = normalizeRole(role);
// console.log("Normalized role in AppRoutes:", normalizedRole);

export default function AppRoutes() {
  const stored = localStorage.getItem("userInfo");
  const userInfo = stored ? JSON.parse(stored) : null;
  const role = userInfo?.role || "Member";

  const normalizedRole = normalizeRole(role);
  //console.log("Normalized role in AppRoutes:", normalizedRole);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public route */}
        <Route
          path="/"
          element={
            !isAuthenticated() ? (
              <LoginPage />
            ) : normalizedRole === "ADMIN" ? (
              <Navigate to="/user-management" replace />
            ) : (
              <Navigate to="/home" replace />
            )
          }
        />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          {/* Common Layout */}
          <Route element={<Layout />}>
            {/* Work Area */}
            {/* <Route
              path="/home"
              element={
                normalizedRole === "ADMIN" ? <UserManagement /> : <HomePage />
              }
            /> */}
            <Route path="/home" element={<HomePage />} />
            <Route path="/projects" element={<ProjectPage />} />
            {/* <Route path="/activities" element={<ActivitiesPage />} /> */}
            <Route path="/user-management" element={<UserManagement />} />

            <Route
              path="/sprints/:sprintId/activities"
              element={<SprintManagementPage />}
            />
            <Route
              path="/projects/:projectId/activities"
              element={<ActivitiesPage />}
            />
            <Route path="/status" element={<StatusPage />} />
            <Route path="/category-type" element={<CategoryTypePage />} />
            <Route path="/entry-dashboard" element={<EntryDashboard />} />
            <Route path="/my-entries" element={<MyEntriesPage />} />
            <Route
              path="/general-activity"
              element={<GeneralActivitiesPage />}
            />
            <Route path="/resource" element={<ResourcePage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/reports1" element={<ReportChartTestPage />} />
          </Route>
        </Route>

        {/* Unknown route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
