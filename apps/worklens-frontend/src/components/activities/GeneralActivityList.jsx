export default function GeneralActivityList({
  activities,
  onEditActivity,
  onStartEntry,
}) {
  return (
    <>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Id</th>
            <th>Category</th>
            <th>Type</th>
            <th>Title</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {activities.map((activity) => (
            <tr key={activity.activityId}>
              <td>{activity.activityId}</td>
              <td>{activity.categoryName}</td>
              <td>{activity.activityTypeName}</td>
              <td>{activity.title}</td>
              <td>
                <button onClick={() => onStartEntry(activity)}>E+</button>
                <button onClick={() => onEditActivity(activity)}>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
