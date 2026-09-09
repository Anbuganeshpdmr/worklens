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
