import { useEffect, useState } from "react";
import { getUsers, addUser, updateUser, getRoles } from "../api/user";
import UserModal from "../components/usermanagement/UserModal";
import MemberCard from "../components/usermanagement/membercard";
import UserFilter from "../components/UseFilter";
import "../styles/UserManagement.css";

const UserManagement = () => {
  /* ── states ─────────────────────────────────────── */
  const [activeTab, setActiveTab] = useState("users");

  // users
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modal, setModal] = useState(null);
  const [saving, setSaving] = useState(false);
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  // roles
  const [rolesList, setRolesList] = useState([]);
  const [rolesLoading, setRolesLoading] = useState(false);
  const [roleModal, setRoleModal] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [newRoleName, setNewRoleName] = useState("");
  const [roleSaving, setRoleSaving] = useState(false);

  /* ── load users ──────────────────────────────────── */
  useEffect(() => {
    loadUsers();
  }, []);
  useEffect(() => {
    if (activeTab === "roles") loadRoles();
  }, [activeTab]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getUsers();
      setUsers(
        Array.isArray(res) ? res : Array.isArray(res?.data) ? res.data : [],
      );
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Unable to load users",
      );
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const loadRoles = async () => {
    try {
      setRolesLoading(true);
      const res = await getRoles();
      let list = Array.isArray(res)
        ? res
        : Array.isArray(res?.roles)
          ? res.roles
          : Array.isArray(res?.data)
            ? res.data
            : [];
      setRolesList(list);
    } catch (err) {
      console.error("Failed to load roles:", err);
    } finally {
      setRolesLoading(false);
    }
  };

  /* ── filter ──────────────────────────────────────── */
  const filteredUsers = users.filter((u) => {
    const q = search.toLowerCase();
    const matchSearch =
      u?.name?.toLowerCase().includes(q) ||
      u?.emailId?.toLowerCase().includes(q) ||
      u?.email?.toLowerCase().includes(q) ||
      String(u?.empId || "")
        .toLowerCase()
        .includes(q) ||
      u?.designation?.toLowerCase().includes(q);
    const uRole =
      typeof u?.role === "object" ? u?.role?.name || "" : u?.role || "";
    const matchRole =
      roleFilter === "All" || uRole.toLowerCase() === roleFilter.toLowerCase();
    const isActive =
      u?.active === true || u?.active === 1 || u?.isActive === true;
    const matchStatus =
      statusFilter === "All" ||
      (statusFilter === "Active" && isActive) ||
      (statusFilter === "Inactive" && !isActive);
    return matchSearch && matchRole && matchStatus;
  });

  /* ── user handlers ───────────────────────────────── */
  const handleAddMember = () => setModal({ user: null });
  const handleEdit = (u) => setModal({ user: u });
  const handleCloseModal = () => setModal(null);

  const handleSave = async (userData) => {
    try {
      setSaving(true);
      setError("");
      if (modal.user) {
        const id =
          modal.user.id ??
          modal.user.userId ??
          modal.user._id ??
          modal.user.empId;
        await updateUser(id, userData);
      } else {
        await addUser(userData);
      }
      setModal(null);
      await loadUsers();
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Failed to save user",
      );
    } finally {
      setSaving(false);
    }
  };

  /* ── role handlers ───────────────────────────────── */
  const handleAddRole = async (e) => {
    e.preventDefault();
    const name = newRoleName.trim();
    if (!name) return;
    try {
      setRoleSaving(true);
      // TODO: await addRole({ name })
      setRolesList((p) => [...p, { id: Date.now(), name }]);
      setRoleModal(false);
      setNewRoleName("");
    } catch (err) {
      console.error(err);
    } finally {
      setRoleSaving(false);
    }
  };

  const handleUpdateRole = async (e) => {
    e.preventDefault();
    const name = editingRole.name.trim();
    if (!name) return;
    try {
      setRoleSaving(true);
      // TODO: await updateRole(editingRole.id, { name })
      setRolesList((p) =>
        p.map((r) => (r.id === editingRole.id ? { ...r, name } : r)),
      );
      setEditingRole(null);
    } catch (err) {
      console.error(err);
    } finally {
      setRoleSaving(false);
    }
  };

  /* ── render ──────────────────────────────────────── */
  return (
    <>
      <div className="home-page">
        <main className="home-page__main" style={{ padding: "28px 30px" }}>
          {/* PAGE HEADER */}
          <div className="um-page-header">
            <div className="um-page-title">
              <h1>User Management</h1>
              <p>Manage and view all team members.</p>
            </div>
          </div>

          {/* TABS */}
          <div className="um-tabs">
            <button
              type="button"
              className={`um-tab${activeTab === "users" ? " um-tab--active" : ""}`}
              onClick={() => setActiveTab("users")}
            >
              User
            </button>
            <button
              type="button"
              className={`um-tab${activeTab === "roles" ? " um-tab--active" : ""}`}
              onClick={() => setActiveTab("roles")}
            >
              Roles
            </button>
          </div>

          {/* ── USERS TAB ── */}
          {activeTab === "users" && (
            <div className="um-panel">
              <div className="um-panel-header">
                <div className="um-panel-left">
                  <span className="um-members-icon">&#128101;</span>
                  <span className="um-members-count">
                    Total Members: <strong>{users.length}</strong>
                  </span>
                </div>
                <div className="um-panel-right">
                  <div className="um-search">
                    <svg
                      className="um-search-icon"
                      viewBox="0 0 20 20"
                      fill="none"
                    >
                      <circle
                        cx="9"
                        cy="9"
                        r="6"
                        stroke="#98a2b3"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M14 14l3 3"
                        stroke="#98a2b3"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                    <input
                      type="text"
                      value={search}
                      placeholder="Search member by name, email or role..."
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                  <button className="um-add-btn" onClick={handleAddMember}>
                    + Add Member
                  </button>
                  <UserFilter
                    roleFilter={roleFilter}
                    setRoleFilter={setRoleFilter}
                    statusFilter={statusFilter}
                    setStatusFilter={setStatusFilter}
                  />
                </div>
              </div>

              {error && (
                <div className="um-error">
                  <span>{error}</span>
                  <button type="button" onClick={() => setError("")}>
                    ×
                  </button>
                </div>
              )}

              {loading && <div className="um-loading">Loading members...</div>}

              {!loading && (
                <div className="um-grid">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((u) => (
                      <MemberCard
                        key={u.id || u.empId}
                        user={u}
                        onEdit={handleEdit}
                      />
                    ))
                  ) : (
                    <div className="um-empty">No members found</div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ── ROLES TAB ── */}
          {activeTab === "roles" && (
            <div className="um-panel">
              <div className="um-panel-header">
                <div className="um-panel-left">
                  <span className="um-members-icon">&#128100;</span>
                  <span className="um-members-count">
                    Total Roles: <strong>{rolesList.length}</strong>
                  </span>
                </div>
                <div className="um-panel-right">
                  <button
                    className="um-add-btn"
                    onClick={() => setRoleModal(true)}
                  >
                    + Add Role
                  </button>
                </div>
              </div>

              {rolesLoading && (
                <div className="um-loading">Loading roles...</div>
              )}

              {!rolesLoading && rolesList.length === 0 && (
                <div className="um-empty">No roles found</div>
              )}

              {!rolesLoading && rolesList.length > 0 && (
                <div className="um-roles-list">
                  {rolesList.map((r, i) => {
                    const name = r.name ?? r.roleName ?? String(r);
                    return (
                      <div key={r.id ?? i} className="um-role-item">
                        <span className="um-role-badge">
                          {name.charAt(0).toUpperCase()}
                        </span>
                        <span className="um-role-name">{name}</span>
                        <button
                          type="button"
                          className="mc-edit-btn"
                          title={`Edit ${name}`}
                          aria-label={`Edit ${name}`}
                          style={{ marginLeft: "auto" }}
                          onClick={() =>
                            setEditingRole({ id: r.id ?? i, name })
                          }
                        >
                          <svg
                            viewBox="0 0 16 16"
                            fill="none"
                            width="13"
                            height="13"
                          >
                            <path
                              d="M11.5 2.5a1.414 1.414 0 0 1 2 2L5 13H3v-2L11.5 2.5z"
                              stroke="#1677ff"
                              strokeWidth="1.3"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* USER MODAL */}
      {modal && (
        <UserModal
          user={modal.user}
          onSave={handleSave}
          onClose={handleCloseModal}
          saving={saving}
        />
      )}

      {/* ADD ROLE MODAL */}
      {roleModal && (
        <div className="modal-overlay">
          <div className="user-modal" style={{ maxWidth: "420px" }}>
            <div className="modal-header">
              <h2>Add Role</h2>
              <button
                type="button"
                className="close-btn"
                onClick={() => {
                  setRoleModal(false);
                  setNewRoleName("");
                }}
              >
                ×
              </button>
            </div>
            <form className="user-form" onSubmit={handleAddRole}>
              <div className="form-group">
                <label>
                  Role Name <span style={{ color: "#f04438" }}>*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter role name"
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                  required
                  autoFocus
                />
              </div>
              <div className="form-actions">
                <button
                  type="button"
                  disabled={roleSaving}
                  onClick={() => {
                    setRoleModal(false);
                    setNewRoleName("");
                  }}
                >
                  Cancel
                </button>
                <button type="submit" disabled={roleSaving}>
                  {roleSaving ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT ROLE MODAL */}
      {editingRole && (
        <div className="modal-overlay">
          <div className="user-modal" style={{ maxWidth: "420px" }}>
            <div className="modal-header">
              <h2>Edit Role</h2>
              <button
                type="button"
                className="close-btn"
                onClick={() => setEditingRole(null)}
              >
                ×
              </button>
            </div>
            <form className="user-form" onSubmit={handleUpdateRole}>
              <div className="form-group">
                <label>
                  Role Name <span style={{ color: "#f04438" }}>*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter role name"
                  value={editingRole.name}
                  onChange={(e) =>
                    setEditingRole((p) => ({ ...p, name: e.target.value }))
                  }
                  required
                  autoFocus
                />
              </div>
              <div className="form-actions">
                <button
                  type="button"
                  disabled={roleSaving}
                  onClick={() => setEditingRole(null)}
                >
                  Cancel
                </button>
                <button type="submit" disabled={roleSaving}>
                  {roleSaving ? "Updating..." : "Update"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default UserManagement;
