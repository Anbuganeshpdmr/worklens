import { useEffect, useState } from "react";
//import Sidebar from "../components/Sidebar";
//import Navbar from "../components/Navbar";
import { getHome } from "../api/home";
import "../styles/HomePage.css";

function HomePage() {
  // Read userInfo immediately from localStorage — available as soon as login succeeds
  const stored = localStorage.getItem("userInfo");
  const userInfo = stored ? JSON.parse(stored) : null;

  const displayName =
    userInfo?.name ||
    userInfo?.fullName ||
    userInfo?.username ||
    userInfo?.userId ||
    "User";

  const role = userInfo?.role || "Member";

  const [homeData, setHomeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getHome()
      .then((data) => setHomeData(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
    {/* <Navbar /> */}

    <div className="home-page">
      {/* <Sidebar role={role} /> */}

      <main className="home-page__main">
        <div className="home-page__header">
          <h2 className="home-page__greeting">Hello, {displayName}</h2>
          <p className="home-page__role">Role: {role}</p>
        </div>

        <div className="home-page__content">
          {loading && (
            <div className="home-page__loading">Loading dashboard…</div>
          )}

          {!loading && error && (
            <div className="home-page__error">{error}</div>
          )}

          {/* TODO: Render homeData fields here once the /home API shape is finalised */}
          {!loading && !error && homeData && (
            <pre style={{ fontSize: "0.8rem", opacity: 0.7 }}>
              {JSON.stringify(homeData, null, 2)}
            </pre>
          )}
        </div>
      </main>
    </div>
    </>
  );
}

export default HomePage;
