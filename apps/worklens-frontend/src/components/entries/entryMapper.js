export function flattenEntry(entry) {
  return {
    id: entry.id,
    activityId: entry.activityId,
    sprintActivityId: entry.sprintActivityId,
    name: entry.name,
    description: entry.description,
    projectName: entry.projectName,
    sprintName: entry.sprintName,
    user: entry.user,
    remarks: entry.remarks,
    externalTicketId: entry.externalTicketId,

    // Dates & Times
    activityDate: entry.activityDate,
    startTime: entry.startTime,
    endTime: entry.endTime,
    duration: entry.duration, // Keeps ISO-8601 string duration format

    // Flattened Activity Type
    activityTypeId: entry.activityType?.id ?? null,
    activityTypeName: entry.activityType?.name ?? null,
    activityTypeColour: entry.activityType?.colourCode ?? null,

    // Flattened Category
    categoryId: entry.category?.id ?? null,
    categoryName: entry.category?.name ?? null,
    categoryColour: entry.category?.colourCode ?? null,

    // Flattened Status
    statusId: entry.currentStatus?.statusId ?? null,
    statusName: entry.currentStatus?.uniqueName ?? null,
    statusDisplayName: entry.currentStatus?.displayName ?? null,
    statusColour: entry.currentStatus?.colourCode ?? null,
    isStatusMandatory: entry.currentStatus?.mandatory ?? false,
    isStatusApplicable: entry.currentStatus?.applicable ?? false,
  };
}
