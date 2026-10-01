import LoginCard from "../components/LoginCard";
import "../styles/LoginPage.css";

function LoginPage() {
  return (
    <div className="login-page">

      {/* Left Side */}
      <div className="login-page__left">

        {/* Decorative shapes */}
        <div className="login-page__corner-shape" />

        {/* Logo */}
        <img
          src="/worklens-logo.png"
          alt="WorkLens"
          className="login-page__logo"
        />

        {/* Brand Text */}
        <h1 className="login-page__brand">
          WORKLENS
        </h1>

        <p className="login-page__tagline">
          TEST &amp; TIME
          <br />
          MANAGEMENT
        </p>

        <p className="login-page__description">
          Better Testing&nbsp;&nbsp;|&nbsp;&nbsp;Smarter Tracking&nbsp;&nbsp;|&nbsp;&nbsp;Greater Results
        </p>

        {/* Bottom Illustration */}
        <img
          src="/worklens-illustration.png"
          alt="WorkLens testing and time management"
          className="login-page__illustration"
        />
      </div>

      {/* Right Side */}
      <div className="login-page__panel">
        <div className="login-page__dots" />
        <div className="login-page__right-corner" />
        <LoginCard />
      </div>

    </div>
  );
}

export default LoginPage;