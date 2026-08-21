import React, { useEffect, useState } from "react";
import { getRoles } from "../../api/user";

function Addmember({ user, onSave, onCancel, saving }) {
  const [roles, setRoles] = useState([]);
  const [roleLoading, setRoleLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    empId: "",
    emailId: "",
    designation: "",
    role: "",
    active: "true",
  });

  // ==========================================
  // LOAD USER DATA WHEN EDITING
  // ==========================================

  useEffect(() => {
    if (user) {
      const existingRole =
        typeof user.role === "object"
          ? user.role?.name || user.role?.roleName || ""
          : user.role || "";

      setFormData({
        name: user.name || "",
        empId: user.empId || "",
        emailId: user.emailId || user.email || "",
        designation: user.designation || "",
        role: existingRole,
        active:
          user.active === false ||
          user.active === 0 ||
          user.isActive === false
            ? "false"
            : "true",
      });
    } else {
      // ADD MEMBER
      setFormData({
        name: "",
        empId: "",
        emailId: "",
        designation: "",
        role: "",
        active: "true",
      });
    }
  }, [user]);

  // ==========================================
  // LOAD ROLES
  // ==========================================

  useEffect(() => {
    const loadRoles = async () => {
      try {
        setRoleLoading(true);

        const response = await getRoles();

        console.log("ROLES API RESPONSE:", response);

        let list = [];

        if (Array.isArray(response)) {
          list = response;
        } else if (Array.isArray(response?.roles)) {
          list = response.roles;
        } else if (Array.isArray(response?.data)) {
          list = response.data;
        }

        const normalized = list
          .map((r, index) => {
            if (typeof r === "string") {
              return {
                id: index,
                name: r,
              };
            }

            return {
              id: r.id ?? index,
              name:
                r.name ||
                r.roleName ||
                r.role ||
                "",
            };
          })
          .filter((r) => r.name);

        console.log("NORMALIZED ROLES:", normalized);

        setRoles(normalized);

      } catch (err) {
        console.error("Failed to load roles:", err);
      } finally {
        setRoleLoading(false);
      }
    };

    loadRoles();
  }, []);

  // ==========================================
  // DEBUG ROLE
  // ==========================================

  useEffect(() => {
    console.log("=================================");
    console.log("EDIT USER ROLE:", user?.role);
    console.log("FORM ROLE:", formData.role);
    console.log("AVAILABLE ROLES:", roles);
    console.log("ROLE LOADING:", roleLoading);
    console.log("=================================");
  }, [user, formData.role, roles, roleLoading]);

  // ==========================================
  // INPUT CHANGE
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================
  // SUBMIT
  // ==========================================

  const handleSubmit = (e) => {
    e.preventDefault();

    const name = formData.name.trim();
    const empId = formData.empId.trim();
    const emailId = formData.emailId.trim();
    const designation = formData.designation.trim();
    const role = formData.role.trim();

    if (!name || !empId || !emailId || !designation || !role) {
      alert("Please fill all required fields");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(emailId)) {
      alert("Please enter a valid email address");
      return;
    }

    const payload = {
      name,
      empId,
      emailId,
      designation,
      role,
      active: formData.active === "true",
    };

    console.log("=================================");
    console.log("USER PAYLOAD:", payload);
    console.log("=================================");

    onSave(payload);
  };

  return (
    <form className="user-form" onSubmit={handleSubmit}>

      {/* NAME */}
      <div className="form-group">
        <label>
          Name <span style={{ color: "#f04438" }}>*</span>
        </label>

        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter name"
          required
        />
      </div>

      {/* EMP ID */}
      <div className="form-group">
        <label>
          Emp-Id <span style={{ color: "#f04438" }}>*</span>
        </label>

        <input
          type="text"
          name="empId"
          value={formData.empId}
          onChange={handleChange}
          placeholder="Enter employee ID"
          required
        />
      </div>

      {/* EMAIL */}
      <div className="form-group">
        <label>
          Email <span style={{ color: "#f04438" }}>*</span>
        </label>

        <input
          type="email"
          name="emailId"
          value={formData.emailId}
          onChange={handleChange}
          placeholder="Enter email"
          required
        />
      </div>

      {/* DESIGNATION */}
      <div className="form-group">
        <label>
          Designation <span style={{ color: "#f04438" }}>*</span>
        </label>

        <input
          type="text"
          name="designation"
          value={formData.designation}
          onChange={handleChange}
          placeholder="Enter designation"
          required
        />
      </div>

      {/* ROLE */}
      <div className="form-group">
        <label>
          Role <span style={{ color: "#f04438" }}>*</span>
        </label>

        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          required
          disabled={roleLoading}
        >
          <option value="">
            {roleLoading ? "Loading roles..." : "Select Role"}
          </option>

          {roles.map((r) => (
            <option key={r.id} value={r.name}>
              {r.name}
            </option>
          ))}
        </select>
      </div>

      {/* STATUS */}
      <div className="form-group">
        <label>Status</label>

        <select
          name="active"
          value={formData.active}
          onChange={handleChange}
        >
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
      </div>

      {/* ACTIONS */}
      <div className="form-actions">
        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={saving || roleLoading}
        >
          {saving ? "Saving..." : user ? "Update" : "Save"}
        </button>
      </div>

    </form>
  );
}

export default Addmember;