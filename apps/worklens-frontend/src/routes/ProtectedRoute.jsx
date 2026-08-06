import { Navigate, useLocation } from "react-router-dom";

/**
 * Wraps routes that require authentication.
 * Redirects to "/" if token or userInfo is absent from localStorage,
 * passing a message so LoginCard can show "Session expired" to the user.
 */
function ProtectedRoute({ children }) {
  const location = useLocation();

  const token = localStorage.getItem("token");
  const userInfo = localStorage.getItem("userInfo");

  if (!token || !userInfo) {
    // Clear any stale partial data
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");

    return (
      <Navigate
        to="/"
        replace
        state={{
          from: location.pathname,
          message: "Please log in to continue.",
        }}
      />
    );
  }

  return children;
}

export default ProtectedRoute;
