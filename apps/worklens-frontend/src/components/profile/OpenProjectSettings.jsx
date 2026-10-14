import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { saveOpenProjectCredentials } from "../../api/user";

export default function OpenProjectSettings() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await saveOpenProjectCredentials({
        username,
        password,
      });

      console.log("Dummy API Response:", response);

      // Keep the entered values on the page
      setSaved(true);
    } catch (error) {
      console.error("OpenProject submission failed:", error);
      setSaved(false);
    }
  };

  return (
    <div className="op-settings">
      <h3 className="op-heading">
        OpenProject Configuration
      </h3>

      <p className="op-description">
        Configure your OpenProject account credentials.
      </p>

      <form className="op-form" onSubmit={handleSubmit}>
        <div className="op-field-group">
          <label className="op-label" htmlFor="op-username">
            Username
          </label>

          <input
            className="op-input"
            id="op-username"
            type="text"
            placeholder="Enter OpenProject username"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              setSaved(false);
            }}
            autoComplete="username"
            required
          />
        </div>

        <div className="op-field-group">
          <label className="op-label" htmlFor="op-password">
            Password
          </label>

          <div className="op-input-wrap">
            <input
              className="op-input op-input--password"
              id="op-password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter OpenProject password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setSaved(false);
              }}
              autoComplete="current-password"
              required
            />

            <button
              type="button"
              className="op-eye-btn"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>
          </div>
        </div>

        <button className="op-submit-btn" type="submit">
          {saved ? "Saved" : "Save Credentials"}
        </button>

        {saved && (
          <p className="op-success-message">
            Credentials submitted successfully.
          </p>
        )}
      </form>
    </div>
  );
}
