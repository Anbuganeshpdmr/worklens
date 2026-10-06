import { useEffect, useRef, useState } from "react";
import api from "../../api/axios";
import { uploadProfilePhoto, getMyDp } from "../../api/user";
import "../../styles/activities/profileinfo.css";
import {fetchProfileData} from "../../api/user";

function getRoleName(role) {
  if (!role) return "-";
  if (typeof role === "object") return role.name || role.roleName || "-";
  return role;
}

// async function fetchProfileData() {
//   const res = await api.get("/me");
//   return res.data;
// }


export default function ProfileInfo() {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  // pendingPhoto  — base64 DataURL for local preview before save
  // pendingFile   — the actual File object waiting to be uploaded
  // removeFlag    — user clicked the X on an existing DP (wants to delete it)
  // savedDpUrl    — blob object URL for the current saved DP (auth-fetched)
  const [pendingPhoto, setPendingPhoto] = useState(null);
  const [pendingFile,  setPendingFile]  = useState(null);
  const [removeFlag,   setRemoveFlag]   = useState(false);
  const [savedDpUrl,   setSavedDpUrl]   = useState(null);

  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);
  const fileInputRef = useRef(null);

  const showToast = (message, type = "success") => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ message, type });
    toastTimer.current = setTimeout(() => setToast(null), 2000);
  };

  // ── Fetch profile data on mount ──────────────────────────────────────────
  useEffect(() => {
  const getProfile = async () => {
    try {
      const data = await fetchProfileData();
      setUser(data);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  getProfile();
}, []);

  // ── Fetch the saved DP as a blob whenever user.dpAvailable changes ───────
  // This uses the authenticated axios instance so the token is always sent.
  useEffect(() => {
    let cancelled = false;

    const loadDp = async () => {
      // Revoke any previous object URL to avoid memory leaks
      setSavedDpUrl((prev) => {
        if (prev?.startsWith("blob:")) URL.revokeObjectURL(prev);
        return null;
      });

      if (!user?.dpAvailable) return;

      try {
        const blob = await getMyDp(user.dpPath);
        if (cancelled) return;
        setSavedDpUrl(URL.createObjectURL(blob));
      } catch (err) {
        console.error("Failed to load profile photo:", err);
      }
    };

    loadDp();

    return () => {
      cancelled = true;
    };
  }, [user?.id, user?.dpAvailable, user?.dpPath]);

  // ── Cleanup object URL on unmount ────────────────────────────────────────
  useEffect(() => {
    return () => {
      if (savedDpUrl?.startsWith("blob:")) URL.revokeObjectURL(savedDpUrl);
    };
  }, [savedDpUrl]);

  // What to actually render in the <img> / initials slot:
  //   1. Local base64 preview (before save)
  //   2. null if user clicked "remove" (pending removal)
  //   3. Auth-fetched blob URL of current saved DP
  //   4. null → show initials
  const displayPhoto = pendingPhoto
    ? pendingPhoto
    : removeFlag
      ? null
      : savedDpUrl || null;

  const showExit     = pendingPhoto !== null || (!removeFlag && !!savedDpUrl);
  const isPreviewing = pendingPhoto !== null;

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleUploadClick = () => fileInputRef.current?.click();

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPendingFile(file);

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
      setPendingFile(null);
    } else if (savedDpUrl) {
      setRemoveFlag(true);
    }
  };

  const handleSave = async () => {
    try {
      if (pendingFile) {
        // Upload new photo; backend returns updated user object
        const updatedUser = await uploadProfilePhoto(pendingFile);
        setUser(updatedUser);
        setPendingPhoto(null);
        setPendingFile(null);
        showToast("Profile photo uploaded successfully!", "success");
      } else if (removeFlag) {
        // Remove photo: call upload with no file
        const updatedUser = await uploadProfilePhoto(null);
        setUser(updatedUser);
        setRemoveFlag(false);
        showToast("Profile photo removed successfully!", "success");
      }
    } catch (err) {
      console.error("Profile picture update failed:", err);
      showToast(
        err.response?.data?.message || "Failed to update profile photo",
        "error"
      );
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
  const initials   = user?.initials || "?";

  return (
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
