function UserTable({ users, onEdit }) {
  return (
    <table className="user-table">
      <thead>
        <tr>
          <th>Emp-Id</th>
          <th>Name</th>
          <th>Email</th>
          <th>Designation</th>
          <th>Role</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
      </thead>

      <tbody>
        {users.length === 0 ? (
          <tr>
            <td colSpan="7">No users found</td>
          </tr>
        ) : (
          users.map((user) => (
            <tr key={user.empId}>
              <td>{user.empId}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.designation}</td>
              <td>{user.role}</td>
              <td>{user.status}</td>
              <td>
                <button onClick={() => onEdit(user)}>
                  Edit
                </button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}

export default UserTable;