import React, { useState } from "react";
import ProfileInfo from "../components/profile/ProfileInfo";
import PasswordChangeComp from "../components/profile/PasswordChangeComp";
import OpenProjectSettings from "../components/profile/OpenProjectSettings";
import "../styles/activities/profileinfo.css";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("Info");

  return (
    <div className="profile-page">
      <div className="profile-page-header">
        <h2 className="profile-page-title">Your Profile</h2>
      </div>

      <div className="profile-card">
        <div className="profile-card-tabs">
          <button
            className={`profile-card-tab${activeTab === "Info" ? " profile-card-tab--active" : ""}`}
            onClick={() => setActiveTab("Info")}
          >
            Profile information
          </button>

          <button
            className={`profile-card-tab${activeTab === "Password" ? " profile-card-tab--active" : ""}`}
            onClick={() => setActiveTab("Password")}
          >
            Security
          </button>

          <button
            className={`profile-card-tab${activeTab === "OpenProject" ? " profile-card-tab--active" : ""}`}
            onClick={() => setActiveTab("OpenProject")}
          >
            OpenProject
          </button>
        </div>

        <div className="profile-card-divider" />

        <div className="profile-card-body">
          {activeTab === "Info" && <ProfileInfo />}
          {activeTab === "Password" && <PasswordChangeComp />}
          {activeTab === "OpenProject" && <OpenProjectSettings />}
        </div>
      </div>
    </div>
  );
}
