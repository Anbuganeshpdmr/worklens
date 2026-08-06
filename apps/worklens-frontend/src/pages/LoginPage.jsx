import LoginCard from "../components/LoginCard";
import "../styles/LoginPage.css";

function LoginPage() {
  return (
    <div className="login-page">
      <div className="login-page__bg" aria-hidden="true" />
      <div className="login-page__panel">
        <LoginCard />
      </div>
    </div>
  );
}

export default LoginPage;
