import Addmember from "./Addmember";
import "../../styles/UserModal.css";

function UserModal({ user, onSave, onClose, saving }) {
  return (
    <div className="modal-overlay">

      <div className="user-modal">

        <div className="modal-header">

          <h2>
            {user ? "Edit User" : "Add Member"}
          </h2>

          <button
            type="button"
            className="close-btn"
            onClick={onClose}
          >
            ×
          </button>

        </div>
        
        <Addmember
          user={user}
          onSave={onSave}
          onCancel={onClose}
          saving={saving}
        />

      </div>

    </div>
  );
}

export default UserModal;