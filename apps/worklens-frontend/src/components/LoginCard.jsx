import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { login } from "../api/auth";
import "../styles/LoginCard.css";

function LoginCard() {
  const location = useLocation();
  const navigate = useNavigate();

  // Show session-expiry message passed by ProtectedRoute, if any
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(location.state?.message || "");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!identifier.trim() || !password.trim()) {
      setError("Please enter both User ID and password.");
      return;
    }

    setLoading(true);
    try {
      await login(identifier.trim(), password);
      navigate("/home", { replace: true });
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-card">
      <div className="login-card__body">
        <h4 className="login-card__title">Sign In</h4>

        <form onSubmit={handleLogin} noValidate>
          <div className="login-card__field">
            <label htmlFor="identifier" className="login-card__label">
              User ID
            </label>
            <input
              id="identifier"
              type="text"
              className={`login-card__input${error ? " login-card__input--error" : ""}`}
              placeholder="Enter your Emp ID or Email ID"
              value={identifier}
              onChange={(e) => {
                setIdentifier(e.target.value);
                if (error) setError("");
              }}
              required
              autoComplete="username"
              disabled={loading}
            />
          </div>

          <div className="login-card__field login-card__field--last">
            <label htmlFor="password" className="login-card__label">
              Password
            </label>
            <input
              id="password"
              type="password"
              className={`login-card__input${error ? " login-card__input--error" : ""}`}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError("");
              }}
              required
              autoComplete="current-password"
              disabled={loading}
            />
          </div>

          {error && (
            <p className="login-card__error" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="login-card__btn"
            disabled={loading}
          >
            {loading ? "Signing in…" : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginCard;
