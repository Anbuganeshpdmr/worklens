export default function EntryDashboardList({ entries }) {
  return (
    <table className="table table-bordered">
      <thead>
        <tr>
          <th>Id</th>
          <th>Title</th>
          <th>Status</th>
          <th>Created By</th>
          <th>Created On</th>
        </tr>
      </thead>
      <tbody>
        {entries.map((entry) => (
          <tr key={entry.id}>
            <td>{entry.id}</td>
            <td>{entry.name}</td>
            <td>{entry.statusDisplayName}</td>
            <td>{entry.user}</td>
            <td>{entry.activityDate}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
