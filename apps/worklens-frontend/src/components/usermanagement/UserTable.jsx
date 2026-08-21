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

            <td colSpan="7">
              No users found
            </td>

          </tr>

        ) : (

          users.map((user) => (

            <tr key={user.id}>

              <td>
                {user.empId || "-"}
              </td>

              <td>
                {user.name || "-"}
              </td>

              <td>
                {user.emailId || "-"}
              </td>

              <td>
                {user.designation || "-"}
              </td>

              <td>
                {user.role || "-"}
              </td>

              <td>

                <span
                  className={
                    user.active
                      ? "status-active"
                      : "status-inactive"
                  }
                >

                  {user.active
                    ? "Active"
                    : "Inactive"}

                </span>

              </td>

              <td>

                <button
                  type="button"
                  onClick={() => onEdit(user)}
                >
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