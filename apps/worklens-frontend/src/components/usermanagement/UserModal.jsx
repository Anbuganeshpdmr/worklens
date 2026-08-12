import UserForm from "./UserForm";

function UserModal({ user, onSave, onClose }) {
  return (
    <div className="modal-overlay">
      <div className="user-modal">
        <div className="modal-header">
          <h2>{user ? "Edit User" : "Add Member"}</h2>

          <button
            type="button"
            className="close-btn"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <UserForm
          user={user}
          onSave={onSave}
          onCancel={onClose}
        />
      </div>
    </div>
  );
}

export default UserModal;