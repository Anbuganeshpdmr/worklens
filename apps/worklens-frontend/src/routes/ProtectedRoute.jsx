import { Navigate, useLocation, Outlet } from "react-router-dom";

/**
 * Wraps routes that require authentication.
 * Redirects to "/" if token or userInfo is absent from localStorage.
 */
function ProtectedRoute() {
  const location = useLocation();

  const token = localStorage.getItem("token");
  const userInfo = localStorage.getItem("userInfo");

  console.log("ProtectedRoute pathname:", location.pathname);
  console.log("token:", token, "userInfo:", userInfo);

  if (!token || !userInfo) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;