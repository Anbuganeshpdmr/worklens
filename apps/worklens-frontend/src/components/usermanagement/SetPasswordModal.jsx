  import React, { useState } from "react";
  import "../../styles/Setpassword.css";


  function SetPasswordModal({ user, onClose, onSave }) {
    const [newPassword, setNewPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

        const handleSave = () => {
        onSave({
          userId: user?.id,
          password: newPassword,
        });
      };
      
    return (
      <div className="password-modal-overlay">
        <div className="password-modal">

          {/* HEADER */}
          <div className="password-modal-header">
            <h2>Set New Password</h2>

            <button
              type="button"
              className="password-close-btn"
              onClick={onClose}
            >
              ×
            </button>
          </div>

          {/* BODY */}
          <div className="password-modal-body">

            <div className="password-form-group">
                      <label htmlFor="new-password">
                    New Password
                  </label>

              <div className="password-input-wrapper">
                <input
                  id="new-password"
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  placeholder="Enter new password"
                  onChange={(e) => setNewPassword(e.target.value)}
                />

                <button
                  type="button"
                  className="password-eye-btn"
                  onClick={() =>
                    setShowPassword((prev) => !prev)
                  }
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

            
            </div>

          </div>

          {/* FOOTER */}
          <div className="password-modal-footer">

            <button
              type="button"
              className="password-cancel-btn"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              type="button"
              className="password-ok-btn"
              onClick={handleSave}
            >
              Save
            </button>

          </div>

        </div>
      </div>
    );
  }

  export default SetPasswordModal;