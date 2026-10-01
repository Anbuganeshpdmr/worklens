import { useEffect, useRef, useState } from "react";
import api from "../../api/axios";
import "../../styles/activities/profileinfo.css";

function getRoleName(role) {
  if (!role) return "-";
  if (typeof role === "object") return role.name || role.roleName || "-";
  return role;
}

async function fetchProfileData() {
  try {
    const res = await api.get("/profile");
    return res.data;
  } catch (_) {
    // fall through
  }

  const cached = localStorage.getItem("userInfo");
  const cachedUser = cached ? JSON.parse(cached) : null;
  const userId = cachedUser?.id || cachedUser?.userId || cachedUser?.empId;

  if (userId) {
    try {
      const res = await api.get(`/user/${userId}`);
      return res.data;
    } catch (_) {
      // fall through
    }
  }

  if (cachedUser) return cachedUser;
  throw new Error("Unable to load profile data.");
}

const STORAGE_KEY = "profilePhoto";

export default function ProfileInfo() {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  const [savedPhoto, setSavedPhoto]     = useState(() => localStorage.getItem(STORAGE_KEY) || null);
  const [pendingPhoto, setPendingPhoto] = useState(null);
  const [removeFlag, setRemoveFlag]     = useState(false);

  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  const showToast = (message, type = "success") => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ message, type });
    toastTimer.current = setTimeout(() => setToast(null), 3000);
  };

  const fileInputRef = useRef(null);

  const displayPhoto = pendingPhoto
    ? pendingPhoto
    : removeFlag
      ? null
      : savedPhoto;

  const showExit = pendingPhoto !== null || (!removeFlag && savedPhoto !== null);
  const isPreviewing = pendingPhoto !== null;

  useEffect(() => {
    fetchProfileData()
      .then((data) => setUser(data))
      .catch((err)  => setError(err.message))
      .finally(()   => setLoading(false));
  }, []);

  const handleUploadClick = () => fileInputRef.current?.click();

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setPendingPhoto(ev.target.result);
      setRemoveFlag(false);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleExit = () => {
    if (pendingPhoto !== null) {
      setPendingPhoto(null);
    } else if (savedPhoto !== null) {
      setRemoveFlag(true);
    }
  };

  const handleSave = () => {
    if (pendingPhoto !== null) {
      localStorage.setItem(STORAGE_KEY, pendingPhoto);
      setSavedPhoto(pendingPhoto);
      setPendingPhoto(null);
      showToast("Profile photo uploaded successfully!", "success");
    } else if (removeFlag) {
      localStorage.removeItem(STORAGE_KEY);
      setSavedPhoto(null);
      setRemoveFlag(false);
      showToast("Profile photo removed successfully!", "success");
    }
  };

  if (loading) {
    return <p className="pi-state">Loading...</p>;
  }

  if (error) {
    return <p className="pi-state pi-state--error">{error}</p>;
  }

  const rows = [
    { label: "EMPLOYEE ID", value: user?.empId },
    { label: "NAME",        value: user?.name },
    { label: "ROLE",        value: getRoleName(user?.role) },
    { label: "EMAIL",       value: user?.emailId || user?.email },
    { label: "DESIGNATION", value: user?.designation },
  ];

  const saveActive = pendingPhoto !== null || removeFlag;
const initials = user?.initials || "?";  return (
    <>
      <div className="pi-layout">
        {/* ── Avatar column ─────────────────────── */}
        <div className="pi-avatar-col">
          <div className="pi-avatar-wrap">
            <div
              className={[
                "pi-avatar",
                isPreviewing ? "pi-avatar--preview" : "",
                removeFlag   ? "pi-avatar--remove"  : "",
              ].join(" ").trim()}
            >
              {displayPhoto ? (
                <img src={displayPhoto} alt="Profile" className="pi-avatar-img" />
              ) : (
                <span className="pi-avatar-initials">{initials}</span>
              )}
            </div>

            {/* Upload button */}
            <button
              type="button"
              className="pi-icon-btn pi-icon-btn--upload"
              title="Upload photo"
              aria-label="Upload profile photo"
              onClick={handleUploadClick}
            >
              <svg viewBox="0 0 16 16" fill="none">
                <path d="M8 10V3M8 3L5.5 5.5M8 3L10.5 5.5" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M3 12h10" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </button>

            {/* Remove / discard button */}
            {showExit && (
              <button
                type="button"
                className="pi-icon-btn pi-icon-btn--remove"
                title={pendingPhoto ? "Discard new photo" : "Remove photo"}
                aria-label={pendingPhoto ? "Discard photo change" : "Remove profile photo"}
                onClick={handleExit}
              >
                <svg viewBox="0 0 16 16" fill="none">
                  <path d="M4 4l8 8M12 4l-8 8" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </button>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="pi-file-input"
              onChange={handleFileChange}
            />
          </div>

          {/* Save */}
          <button
            type="button"
            className={`pi-save-btn${!saveActive ? " pi-save-btn--inactive" : ""}`}
            onClick={handleSave}
          >
            Save
          </button>
        </div>

        {/* ── Details column ────────────────────── */}
        <div className="pi-details">
          {rows.map(({ label, value }) => (
            <div className="pi-row" key={label}>
              <span className="pi-label">{label}</span>
              <span className="pi-value">{value || "-"}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className={`profile-toast profile-toast--${toast.type}`}>
          <div className="profile-toast-box">
            <div className="profile-toast-circle">
              <svg className="profile-toast-icon" viewBox="0 0 28 28" fill="none">
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
