import { useState } from "react";
import "../styles/Navbar.css";

function Navbar({ onMenuClick }) {
  return (
    <nav className="navbar">
      {/* Left Section */}
      <div className="navbar__left">
        <button
          className="navbar__menu"
          type="button"
          aria-label="Menu"
          onClick={onMenuClick}
        >
          ☰
        </button>

        <div className="navbar__brand">
          <img
            src="/eye-4.png"
            alt="WorkLens"
            className="navbar__logo"
          />
          <span className="navbar__name">WorkLens</span>
        </div>

        {/* <button className="navbar__home" type="button">
          <span className="navbar__home-icon">⌂</span>
          <span>Home</span>
        </button> */}
      </div>

      {/* Right Section */}
      <div className="navbar__right">
        <button
          className="navbar__notification"
          type="button"
          aria-label="Notifications"
        >
        <img
          src="/icons/notification1.png"
          alt="Notifications"
        />
        </button>

        <button
          className="navbar__profile"
          type="button"
          aria-label="Profile"
        >
          <img
            className="navbar__avatar"
            src="/icons/user1.png"
            alt="Profile"
          />
        </button>
      </div>
    </nav>
  );
}

export default Navbar;