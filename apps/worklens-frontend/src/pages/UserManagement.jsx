import { useState } from "react";
import UserTable from "../components/usermanagement/UserTable";
import UserModal from "../components/usermanagement/UserModal";
import "../styles/UserManagement.css";

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleAddUser = () => {
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleSaveUser = (userData) => {
    if (selectedUser) {
      setUsers((currentUsers) =>
        currentUsers.map((user) =>
          user.empId === selectedUser.empId ? userData : user
        )
      );
    } else {
      setUsers((currentUsers) => [...currentUsers, userData]);
    }

    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  return (
    <div className="user-management">
      <div className="user-management-header">
        <div>
          <h1>User Management</h1>
          <p>Member Management</p>
        </div>

        <button
          type="button"
          className="add-member-btn"
          onClick={handleAddUser}
        >
          + Add Member
        </button>
      </div>

      <div className="user-management-content">
        <div className="user-table-header">
          <h2>Members</h2>

          <input
            type="text"
            placeholder="Search members..."
            className="user-search"
          />
        </div>

        <UserTable
          users={users}
          onEdit={handleEditUser}
        />
      </div>

      {isModalOpen && (
        <UserModal
          user={selectedUser}
          onSave={handleSaveUser}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}

export default UserManagement;