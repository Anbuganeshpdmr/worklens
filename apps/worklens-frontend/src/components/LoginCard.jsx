import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { UserRound, KeyRound, Eye, EyeOff, CircleHelp } from "lucide-react";
import { login } from "../api/auth";
import { useUser } from "../context/UserContext";
import "../styles/LoginCard.css";

function LoginCard() {
  const location = useLocation();
  const navigate = useNavigate();
  const { loginUser } = useUser();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(location.state?.message || "");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!identifier.trim() || !password.trim()) {
      setError("Please enter both User ID and password.");
      return;
    }

    setLoading(true);

    try {
      const userInfo = await login(identifier.trim(), password);

      loginUser(userInfo);

      console.log("Logged in user:", userInfo);

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
        <h1 className="login-card__title">Login</h1>

        <p className="login-card__subtitle">Sign in to your WorkLens account</p>

        <form onSubmit={handleLogin} noValidate>
          {/* Email / User ID */}

          <div className="login-card__field">
            <label htmlFor="identifier" className="login-card__label">
              User ID
            </label>

            <div className="login-card__input-wrapper">
              <span className="login-card__input-icon">
                <UserRound size={18} strokeWidth={1.8} />
              </span>

              <input
                id="identifier"
                type="text"
                className={`login-card__input${
                  error ? " login-card__input--error" : ""
                }`}
                placeholder="Enter your Emp ID or Email ID"
                value={identifier}
                onChange={(e) => {
                  setIdentifier(e.target.value);

                  if (error) {
                    setError("");
                  }
                }}
                required
                autoComplete="username"
                disabled={loading}
              />
            </div>
          </div>

          {/* Password */}

          <div className="login-card__field login-card__field--last">
            <label htmlFor="password" className="login-card__label">
              Password
            </label>

            <div className="login-card__input-wrapper">
              <span className="login-card__input-icon">
                <KeyRound size={18} strokeWidth={1.8} />
              </span>

              <input
                id="password"
                type={showPassword ? "text" : "password"}
                className={`login-card__input${
                  error ? " login-card__input--error" : ""
                }`}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);

                  if (error) {
                    setError("");
                  }
                }}
                required
                autoComplete="current-password"
                disabled={loading}
              />

              <button
                type="button"
                className="login-card__eye"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff size={18} strokeWidth={1.8} />
                ) : (
                  <Eye size={18} strokeWidth={1.8} />
                )}
              </button>
            </div>

            <div className="login-card__forgot">
              <button type="button" onClick={() => setShowForgotModal(true)}>
                Forgot password?
              </button>
            </div>
          </div>

          {/* Error */}

          {error && (
            <p className="login-card__error" role="alert">
              {error}
            </p>
          )}

          {/* Login */}

          <button type="submit" className="login-card__btn" disabled={loading}>
            {loading ? "Signing in…" : "Login  →"}
          </button>
        </form>
        {showForgotModal && (
          <div
            className="forgot-modal-overlay"
            onClick={() => setShowForgotModal(false)}
          >
            <div className="forgot-modal" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                className="forgot-modal__close"
                onClick={() => setShowForgotModal(false)}
              >
                ×
              </button>

              <div className="forgot-modal__icon">
                <CircleHelp size={25} strokeWidth={1.8} />
              </div>

              <h2>Forgot Password?</h2>

              <p>Please contact your administrator to reset your password.</p>

              <button
                type="button"
                className="forgot-modal__okay"
                onClick={() => setShowForgotModal(false)}
              >
                Okay
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default LoginCard;
