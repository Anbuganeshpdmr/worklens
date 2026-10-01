import { useEffect, useRef, useState } from "react";
import { getRoles } from "../../api/user";
import { getStatusByRecord } from "../../api/status";

function Addmember({ user, onSave, onCancel, saving }) {
  const [roles, setRoles]                 = useState([]);
  const [roleLoading, setRoleLoading]     = useState(true);
  const [statuses, setStatuses]           = useState([]);
  const [statusLoading, setStatusLoading] = useState(true);
  const [formError, setFormError]         = useState("");

  const [formData, setFormData] = useState({
    name:             "",
    empId:            "",
    emailId:          "",
    designation:      "",
    role:             "",
    selectedStatusId: "",
  });

  const initialisedForId = useRef(null);

  // ── LOAD ROLES ────────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        setRoleLoading(true);
        const response = await getRoles();
        let list = Array.isArray(response) ? response
          : Array.isArray(response?.roles) ? response.roles
          : Array.isArray(response?.data)  ? response.data
          : [];
        const normalized = list
          .map((r, i) => typeof r === "string"
            ? { id: i, name: r }
            : { id: r.id ?? i, name: r.name || r.roleName || r.role || "" })
          .filter((r) => r.name);
        setRoles(normalized);
      } catch (err) {
        console.error("Roles load error:", err);
      } finally {
        setRoleLoading(false);
      }
    })();
  }, []);

  // ── LOAD STATUSES + INIT FORM ─────────────────────
  useEffect(() => {
    const userId = user?.id ?? user?.userId ?? null;
    if (userId !== null && initialisedForId.current === userId) return;

    let cancelled = false;

    (async () => {
      setStatusLoading(true);
      setFormError("");

      try {
        const res = await getStatusByRecord("MEMBER");
        if (cancelled) return;

        // ── LOG RAW RESPONSE ──────────────────────────
        console.log("RAW STATUS RESPONSE TYPE:", typeof res, Array.isArray(res));
        console.log("RAW STATUS RESPONSE:", JSON.stringify(res, null, 2));

        const list = Array.isArray(res) ? res
          : Array.isArray(res?.data) ? res.data
          : [];

        console.log("STATUS LIST LENGTH:", list.length);
        if (list.length > 0) {
          console.log("FIRST STATUS ITEM KEYS:", Object.keys(list[0]));
          console.log("FIRST STATUS ITEM:", JSON.stringify(list[0]));
        }

        setStatuses(list);

        if (user) {
          // ── EDIT MODE ──────────────────────────────
          console.log("USER currentStatus:", JSON.stringify(user.currentStatus));

          const currentDisplayName = (
            user.currentStatus?.displayName ||
            user.currentStatus?.statusName  ||
            user.currentStatus?.uniqueName  ||
            ""
          ).toLowerCase().trim();

          const rawStatusId =
            user.currentStatus?.statusId         ??
            user.currentStatus?.recordStatusId   ??
            null;

          console.log("Looking for — displayName:", currentDisplayName, "| statusId:", rawStatusId);

          // Try exact ID match
          let matched = list.find(
            (s) => s.recordStatusId === rawStatusId || s.statusId === rawStatusId
          );

          // Try name match (loose)
          if (!matched && currentDisplayName) {
            matched = list.find((s) => {
              const n = (s.statusName || s.displayName || s.uniqueName || "").toLowerCase().trim();
              return n === currentDisplayName
                || n.includes(currentDisplayName)
                || currentDisplayName.includes(n);
            });
          }

          console.log("MATCHED STATUS:", JSON.stringify(matched));

          // The dropdown value — use whichever ID field exists on the item
          const dropdownValue = matched
            ? String(matched.recordStatusId ?? matched.statusId ?? matched.id ?? "")
            : String(list[0]?.recordStatusId ?? list[0]?.statusId ?? list[0]?.id ?? "");

          console.log("DROPDOWN VALUE SET TO:", dropdownValue, "| list[0]:", JSON.stringify(list[0]));

          const existingRole = typeof user.role === "object"
            ? user.role?.name || user.role?.roleName || ""
            : user.role || "";

          setFormData({
            name:             user.name        || "",
            empId:            user.empId       || "",
            emailId:          user.emailId     || user.email || "",
            designation:      user.designation || "",
            role:             existingRole,
            selectedStatusId: dropdownValue,
          });

          initialisedForId.current = userId;

        } else {
          // ── ADD MODE ───────────────────────────────
          // Pick the first item marked default, or first item named "active"
          const defaultStatus =
            list.find((s) => s.isDefault === true || s.default === true) ??
            list.find((s) =>
              (s.statusName || s.displayName || s.uniqueName || "")
                .toLowerCase().includes("active")
            ) ??
            list[0]; // absolute fallback: first in list

          const defaultStatusId = defaultStatus
            ? String(defaultStatus.recordStatusId ?? defaultStatus.statusId ?? defaultStatus.id ?? "")
            : "";

          console.log("ADD MODE default status:", JSON.stringify(defaultStatus), "| id:", defaultStatusId);

          setFormData({
            name:             "",
            empId:            "",
            emailId:          "",
            designation:      "",
            role:             "",
            selectedStatusId: defaultStatusId,
          });

          initialisedForId.current = null;
        }
      } catch (err) {
        if (cancelled) return;
        console.error("Status load error:", err);
        setFormError("Failed to load statuses. Please close and try again.");
      } finally {
        if (!cancelled) setStatusLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── INPUT CHANGE ──────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log("FIELD CHANGE:", name, "=", value);
    setFormError("");
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ── SUBMIT ────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    const name        = formData.name.trim();
    const empId       = formData.empId.trim();
    const emailId     = formData.emailId.trim();
    const designation = formData.designation.trim();
    const role        = formData.role.trim();

    if (!name || !empId || !emailId || !designation || !role) {
      setFormError("Please fill all required fields.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailId)) {
      setFormError("Please enter a valid email address.");
      return;
    }

    // Backend UpdateUserDto expects: selectedStatusId (int) = statusId from status list
    // POST /user (add) uses selectedRecordStatusId, PUT /user/{id} uses selectedStatusId
    const selectedStatusRaw = formData.selectedStatusId;
    const statusIdValue = Number(selectedStatusRaw) || 0;

    console.log("SUBMIT — selectedStatusId raw:", selectedStatusRaw, "| as number:", statusIdValue);

    if (!statusIdValue) {
      setFormError("Please select a status.");
      return;
    }

    // Find the full status object so the parent can update the card display correctly
    const selectedStatusObj = statuses.find(
      (s) => (s.statusId ?? s.recordStatusId ?? s.id) === statusIdValue
    ) || null;

    // Add → selectedRecordStatusId, Edit → selectedStatusId
    const payload = user
      ? { name, empId, emailId, designation, role, selectedStatusId: statusIdValue, _selectedStatusObj: selectedStatusObj }
      : { name, empId, emailId, designation, role, selectedRecordStatusId: statusIdValue };

    console.log("FINAL PAYLOAD:", JSON.stringify(payload));

    try {
      await onSave(payload);
    } catch (err) {
      setFormError(err?.response?.data?.message || err?.message || "Failed to save user.");
    }
  };

  // ── RENDER ────────────────────────────────────────
  return (
    <form className="user-form" onSubmit={handleSubmit} noValidate>

      {formError && (
        <div style={{
          background: "#fff1f0", border: "1px solid #ffa39e", borderRadius: "6px",
          color: "#cf1322", padding: "8px 12px", marginBottom: "12px", fontSize: "13px",
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <span>{formError}</span>
          <button type="button" onClick={() => setFormError("")}
            style={{ background: "none", border: "none", cursor: "pointer", color: "#cf1322", fontSize: "16px", lineHeight: 1, padding: "0 4px" }}>
            ×
          </button>
        </div>
      )}

      <div className="form-group">
        <label>Name <span style={{ color: "#f04438" }}>*</span></label>
        <input type="text" name="name" value={formData.name}
          onChange={handleChange} placeholder="Enter name" required />
      </div>

      <div className="form-group">
        <label>Emp-Id <span style={{ color: "#f04438" }}>*</span></label>
        <input type="text" name="empId" value={formData.empId}
          onChange={handleChange} placeholder="Enter employee ID" required />
      </div>

      <div className="form-group">
        <label>Email <span style={{ color: "#f04438" }}>*</span></label>
        <input type="email" name="emailId" value={formData.emailId}
          onChange={handleChange} placeholder="Enter email" required />
      </div>

      <div className="form-group">
        <label>Designation <span style={{ color: "#f04438" }}>*</span></label>
        <input type="text" name="designation" value={formData.designation}
          onChange={handleChange} placeholder="Enter designation" required />
      </div>

      <div className="form-group">
        <label>Role <span style={{ color: "#f04438" }}>*</span></label>
        <select name="role" value={formData.role} onChange={handleChange}
          required disabled={roleLoading}>
          <option value="">{roleLoading ? "Loading roles..." : "Select Role"}</option>
          {roles.map((r) => (
            <option key={r.id} value={r.name}>{r.name}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Status <span style={{ color: "#f04438" }}>*</span></label>
        <select
          name="selectedStatusId"
          value={formData.selectedStatusId}
          onChange={handleChange}
          disabled={statusLoading || !user}
          style={!user ? { pointerEvents: "none", opacity: 0.7, cursor: "not-allowed", background: "#f3f4f6" } : {}}
          required
        >
          <option value="">{statusLoading ? "Loading statuses..." : "Select Status"}</option>
          {statuses.map((s, i) => {
            const val = s.recordStatusId ?? s.statusId ?? s.id ?? i;
            const label = s.statusName || s.displayName || s.uniqueName || `Status ${i + 1}`;
            return (
              <option key={val} value={val}>{label}</option>
            );
          })}
        </select>
      </div>

      <div className="form-actions">
        <button type="button" onClick={onCancel} disabled={saving}>Cancel</button>
        <button type="submit" disabled={saving || roleLoading || statusLoading}>
          {saving
            ? user ? "Updating..." : "Saving..."
            : user ? "Update" : "Save"}
        </button>
      </div>

    </form>
  );
}

export default Addmember;
