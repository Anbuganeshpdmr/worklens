import { useRef, useState } from "react";
import { changePassword } from "../../api/user";

export default function PasswordChangeComp() {
  const [formData, setFormData] = useState({ oldPassword: "", newPassword: "" });
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  const showToast = (message, type = "success") => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ message, type });
    toastTimer.current = setTimeout(() => setToast(null), 3000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.oldPassword || !formData.newPassword) {
      showToast("All fields are required.", "error");
      return;
    }

    if (formData.oldPassword === formData.newPassword) {
      showToast("New password must be different from the old password.", "error");
      return;
    }

    try {
      setLoading(true);
      await changePassword({
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword,
      });
      showToast("Password changed successfully!", "success");
      setFormData({ oldPassword: "", newPassword: "" });
    } catch (err) {
      console.log("Password change error:", err);
      console.log("Response data:", err?.response?.data);

      const backendMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.response?.data;

      showToast(backendMessage || "Old password not correct", "error");
    } finally {
      setLoading(false);
    }
  };

  const EyeToggle = ({ show, onToggle }) => (
    <button
      type="button"
      onClick={onToggle}
      tabIndex={-1}
      aria-label={show ? "Hide password" : "Show password"}
      className="pw-eye-btn"
    >
      {show ? (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      )}
    </button>
  );

  return (
    <>
      <div className="pw-form-wrap">
        <h3 className="pw-heading">Change Password</h3>
        <form className="pw-form" onSubmit={handleSubmit}>

          {/* Old Password */}
          <div className="pw-field-group">
            <label className="pw-label">Old Password</label>
            <div className="pw-input-wrap">
              <input
                type={showOld ? "text" : "password"}
                name="oldPassword"
                value={formData.oldPassword}
                onChange={handleChange}
                placeholder="Enter old password"
                className="pw-input"
              />
              <EyeToggle show={showOld} onToggle={() => setShowOld((p) => !p)} />
            </div>
          </div>

          {/* New Password */}
          <div className="pw-field-group">
            <label className="pw-label">New Password</label>
            <div className="pw-input-wrap">
              <input
                type={showNew ? "text" : "password"}
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="Enter new password"
                className="pw-input"
              />
              <EyeToggle show={showNew} onToggle={() => setShowNew((p) => !p)} />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`pw-submit-btn${loading ? " pw-submit-btn--loading" : ""}`}
          >
            {loading ? "Changing..." : "Change Password"}
          </button>

        </form>
      </div>

      {/* Toast popup */}
      {toast && (
        <div className={`profile-toast profile-toast--${toast.type}`}>
          <div className="profile-toast-box">
            <div className="profile-toast-circle">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                {toast.type === "success" ? (
                  <path d="M5 14l6 6L23 8" stroke="#2eab6f" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                ) : (
                  <path d="M7 7l14 14M21 7L7 21" stroke="#e05252" strokeWidth="2.5" strokeLinecap="round" />
                )}
              </svg>
            </div>
            <span className="profile-toast-msg">{toast.message}</span>
          </div>
        </div>
      )}
    </>
  );
}
