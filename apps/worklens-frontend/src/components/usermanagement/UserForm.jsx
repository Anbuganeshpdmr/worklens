function UserForm({ user, onSave, onCancel }) {
  const handleSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);

    const userData = {
      empId: formData.get("empId"),
      name: formData.get("name"),
      email: formData.get("email"),
      designation: formData.get("designation"),
      role: formData.get("role"),
      status: formData.get("status"),
    };

    onSave(userData);
  };

  return (
    <form className="user-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Emp-Id</label>
        <input
          type="text"
          name="empId"
          defaultValue={user?.empId || ""}
          required
        />
      </div>

      <div className="form-group">
        <label>Name</label>
        <input
          type="text"
          name="name"
          defaultValue={user?.name || ""}
          required
        />
      </div>

      <div className="form-group">
        <label>Email</label>
        <input
          type="email"
          name="email"
          defaultValue={user?.email || ""}
          required
        />
      </div>

      <div className="form-group">
        <label>Designation</label>
        <input
          type="text"
          name="designation"
          defaultValue={user?.designation || ""}
          required
        />
      </div>

      <div className="form-group">
        <label>Role</label>
        <select
          name="role"
          defaultValue={user?.role || "Member"}
          required
        >
          <option value="Member">Member</option>
          <option value="TL">TL</option>
          <option value="Manager">Manager</option>
        </select>
      </div>

      <div className="form-group">
        <label>Status</label>
        <select
          name="status"
          defaultValue={user?.status || "Active"}
          required
        >
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      <div className="form-actions">
        <button type="button" onClick={onCancel}>
          Cancel
        </button>

        <button type="submit">
          Save
        </button>
      </div>
    </form>
  );
}

export default UserForm;