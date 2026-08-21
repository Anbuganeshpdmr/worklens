import React from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "../styles/HomePage.css";

const Homepage = () => {
  const navigate = useNavigate();

  const stored = localStorage.getItem("userInfo");
  const userInfo = stored ? JSON.parse(stored) : null;

  const name        = userInfo?.name        || "User";
  const role        = userInfo?.role        || "Member";
  const empId       = userInfo?.empId       || "-";
  const email       = userInfo?.emailId     || userInfo?.email || "-";
  const designation = userInfo?.designation || "-";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  return (
    <div className="home-page">
      <Sidebar role={role} />
      <main className="home-page__main">

        <div className="home-page__header">
          <div>
            <h1 className="home-page__greeting">Welcome back, {name}</h1>
            <p className="home-page__role">{role} - {designation}</p>
          </div>
          <button className="home-logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>

        <div className="home-card-grid">
          <div className="home-info-card">
            <div className="home-info-card__icon">&#128100;</div>
            <div className="home-info-card__body">
              <p className="home-info-card__label">Full Name</p>
              <p className="home-info-card__value">{name}</p>
            </div>
          </div>
          <div className="home-info-card">
            <div className="home-info-card__icon">&#128219;</div>
            <div className="home-info-card__body">
              <p className="home-info-card__label">Employee ID</p>
              <p className="home-info-card__value">{empId}</p>
            </div>
          </div>
          <div className="home-info-card">
            <div className="home-info-card__icon">&#9993;</div>
            <div className="home-info-card__body">
              <p className="home-info-card__label">Email</p>
              <p className="home-info-card__value">{email}</p>
            </div>
          </div>
          <div className="home-info-card">
            <div className="home-info-card__icon">&#127991;</div>
            <div className="home-info-card__body">
              <p className="home-info-card__label">Role</p>
              <p className="home-info-card__value">{role}</p>
            </div>
          </div>
        </div>

        <div className="home-page__content">
          <h2 className="home-section-title">Quick Actions</h2>
          <div className="home-actions-grid">
            <button
              className="home-action-card"
              onClick={() => navigate("/user-management")}
            >
              <span className="home-action-card__icon">&#128101;</span>
              <span className="home-action-card__label">User Management</span>
            </button>
          </div>
        </div>

      </main>
    </div>
  );
};

export default Homepage;