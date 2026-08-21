import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import ProjectsAndSprintsPage from "../pages/ProjectsAndSprintsPage";
import ProjectPage from "../pages/ProjectPage";
import SprintActivitiesPage from "../pages/SprintActivitiesPage";
import Layout from "./Layout";
import HomePage from "../pages/HomePage";
import UserManagement from "../pages/UserManagement";
import RecordStatusPage from "../pages/RecordStatusPage";
import ActivitiesPage     from "../pages/ActivitiesPage";
import ProtectedRoute from "./ProtectedRoute";

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
            <Route path="/home" element={<ProjectsAndSprintsPage />} />

            <Route path="/projects" element={<ProjectPage />} />
            <Route path="/activities" element={<ActivitiesPage />} />
           <Route path="/user-management" element={<UserManagement /> }/>

            <Route path="/record-status" element={ <RecordStatusPage />}/>


            {/*
          Sprint-Activities page
          Entry point: user selects a sprint from the Active Sprints page
          (or enters the URL directly while that page is in development).
          Pattern mirrors the API: /sprint_activity/sprint/{sprintId}
        */}
            <Route path="/sprints/:sprintId/activities" element={<SprintActivitiesPage />} />

          </Route>

        </Route>

        {/* Unknown route */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
}