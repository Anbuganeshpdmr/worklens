export const sprintActivityExcelColumns = [
  {
    header: "ID",
    value: (row) => row.activityId,
  },
  {
    header: "Activity",
    value: (row) => row.title,
  },
  {
    header: "Description",
    value: (row) => row.description,
  },
  {
    header: "Status",
    value: (row) => row.currentStatus_displayName,
  },
  {
    header: "Type",
    value: (row) => row.activityType_name,
  },
  {
    header: "Assignee",
    value: (row) => row.projectName,
  },
];

export const entryExcelColumns = [
  {
    header: "Entry ID",
    value: (row) => row.id,
  },
  {
    header: "Activity",
    value: (row) => row.name,
  },
  {
    header: "User",
    value: (row) => row.user,
  },
  {
    header: "Category",
    value: (row) => row.categoryName,
  },
  {
    header: "Type",
    value: (row) => row.activityTypeName,
  },
  {
    header: "Status",
    value: (row) => row.statusName,
  },
  {
    header: "Duration",
    value: (row) => row.duration,
  },
];
