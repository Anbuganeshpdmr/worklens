import React, { useEffect, useState } from "react";
import { getRoles } from "../../api/user";
import "../../styles/UserRoles.css";

const UserRoles = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingRole, setEditingRole] = useState(null);

  const [roleName, setRoleName] = useState("");

  // ==========================================
  // LOAD ROLES
  // ==========================================

  useEffect(() => {
    loadRoles();
  }, []);

  const loadRoles = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getRoles();

      console.log("ROLES RESPONSE:", response);

      let list = [];

      if (Array.isArray(response)) {
        list = response;
      } else if (Array.isArray(response?.data)) {
        list = response.data;
      } else if (Array.isArray(response?.roles)) {
        list = response.roles;
      }

      const normalized = list
        .map((role, index) => {
          if (typeof role === "string") {
            return {
              id: index,
              name: role,
            };
          }

          return {
            id: role?.id ?? index,
            name:
              role?.name ||
              role?.roleName ||
              role?.role ||
              "",
          };
        })
        .filter((role) => role.name);

      setRoles(normalized);
    } catch (err) {
      console.error("Failed to load roles:", err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to load roles"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // ADD ROLE
  // ==========================================

  const handleAddRole = () => {
    setRoleName("");
    setShowAddModal(true);
  };

  const handleSaveRole = () => {
    const name = roleName.trim();

    if (!name) {
      alert("Please enter role name");
      return;
    }

    const newRole = {
      id: Date.now(),
      name,
    };

    setRoles((prev) => [...prev, newRole]);

    setShowAddModal(false);
    setRoleName("");
  };

  // ==========================================
  // EDIT ROLE
  // ==========================================

  const handleEdit = (role) => {
    setEditingRole(role);
    setRoleName(role.name);
  };

  const handleUpdateRole = () => {
    const name = roleName.trim();

    if (!name) {
      alert("Please enter role name");
      return;
    }

    setRoles((prev) =>
      prev.map((role) =>
        role.id === editingRole.id
          ? {
              ...role,
              name,
            }
          : role
      )
    );

    setEditingRole(null);
    setRoleName("");
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="roles-page">

      {/* HEADER */}

      <div className="roles-header">

        <div>
          <h1>User Roles</h1>

          <p>
            Manage roles and permissions.
          </p>
        </div>

        <button
          className="roles-add-btn"
          onClick={handleAddRole}
        >
          + Add Role
        </button>

      </div>

      {/* CONTENT */}

      <div className="roles-panel">

        <div className="roles-panel-header">

          <span>
            Total Roles:{" "}
            <strong>{roles.length}</strong>
          </span>

        </div>

        {/* ERROR */}

        {error && (
          <div className="roles-error">
            {error}
          </div>
        )}

        {/* LOADING */}

        {loading ? (
          <div className="roles-loading">
            Loading roles...
          </div>
        ) : roles.length === 0 ? (
          <div className="roles-empty">
            No roles found
          </div>
        ) : (
          <div className="roles-list">

            {roles.map((role) => (

              <div
                className="role-card"
                key={role.id}
              >

                <div className="role-info">

                  <div className="role-icon">
                    {role.name
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  <div>
                    <h3>{role.name}</h3>

                    <span>
                      User Role
                    </span>
                  </div>

                </div>

                {/* EDIT */}

                <button
                  className="role-edit-btn"
                  onClick={() =>
                    handleEdit(role)
                  }
                  title="Edit Role"
                >
                  ✎
                </button>

              </div>

            ))}

          </div>
        )}

      </div>

      {/* ==========================================
          ADD ROLE MODAL
      ========================================== */}

      {showAddModal && (

        <div className="roles-modal-overlay">

          <div className="roles-modal">

            <div className="roles-modal-header">

              <h2>Add Role</h2>

              <button
                onClick={() =>
                  setShowAddModal(false)
                }
              >
                ×
              </button>

            </div>

            <div className="roles-form-group">

              <label>Role Name</label>

              <input
                type="text"
                value={roleName}
                placeholder="Enter role name"
                onChange={(e) =>
                  setRoleName(e.target.value)
                }
              />

            </div>

            <div className="roles-actions">

              <button
                onClick={() =>
                  setShowAddModal(false)
                }
              >
                Cancel
              </button>

              <button
                className="primary"
                onClick={handleSaveRole}
              >
                Save
              </button>

            </div>

          </div>

        </div>

      )}

      {/* ==========================================
          EDIT ROLE MODAL
      ========================================== */}

      {editingRole && (

        <div className="roles-modal-overlay">

          <div className="roles-modal">

            <div className="roles-modal-header">

              <h2>Edit Role</h2>

              <button
                onClick={() => {
                  setEditingRole(null);
                  setRoleName("");
                }}
              >
                ×
              </button>

            </div>

            <div className="roles-form-group">

              <label>Role Name</label>

              <input
                type="text"
                value={roleName}
                onChange={(e) =>
                  setRoleName(e.target.value)
                }
              />

            </div>

            <div className="roles-actions">

              <button
                onClick={() => {
                  setEditingRole(null);
                  setRoleName("");
                }}
              >
                Cancel
              </button>

              <button
                className="primary"
                onClick={handleUpdateRole}
              >
                Update
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
};

export default UserRoles;