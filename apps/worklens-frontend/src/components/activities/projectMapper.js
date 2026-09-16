export function mapProjectDetails(data) {
  return {
    projectId: data.projectId,
    projectName: data.projectName,

    activeSprints: data.activeSprints,
    totalSprints: data.totalSprints,
    totalActivities: data.totalActivities,

    createdBy: data.createdBy,
    createdOn: data.createdOn,

    statusId: data.currentStatus?.statusId,
    statusName: data.currentStatus?.displayName,
    statusColour: data.currentStatus?.colourCode,
  };
}

/**
 * Maps sprint details from the API response to a simplified object
 *
 * @param {Object} data - The API response data for a sprint
 * @returns {Object} - The mapped sprint details
 */
export function mapSprintDetails(data) {
  return {
    sprintId: data.sprintId,
    sprintName: data.sprintName,
    projectId: data.projectId,
    projectName: data.projectName,
  };
}

export function mapActivityDetails(data) {
  if (!data) return {};

  return {
    activityId: data.activityId,
    title: data.title,
    description: data.description,

    // Activity Type Details
    activityTypeId: data.activityType?.id ?? null,
    activityTypeName: data.activityType?.name ?? null,
    activityTypeColourCode: data.activityType?.colourCode ?? null,

    // Category Details
    categoryId: data.category?.id ?? null,
    categoryName: data.category?.name ?? null,
    categoryColourCode: data.category?.colourCode ?? null,

    // Current Status Details
    statusId: data.currentStatus?.statusId ?? null,
    statusUniqueName: data.currentStatus?.uniqueName ?? null,
    statusDisplayName: data.currentStatus?.displayName ?? null,
    statusColourCode: data.currentStatus?.colourCode ?? null,
    isStatusApplicable: data.currentStatus?.applicable ?? false,
    isStatusMandatory: data.currentStatus?.mandatory ?? false,

    // Project Details
    projectId: data.projectDetails?.projectId ?? null,
    projectName: data.projectDetails?.projectName ?? null,

    // Auditing & Metadata
    parentActivityId: data.parentActivityId,
    externalTicketId: data.externalTicketId,
    createdBy: data.createdBy,
    createdOn: data.createdOn,
    updatedBy: data.updatedBy,
    updatedOn: data.updatedOn,
    version: data.version,
  };
}
