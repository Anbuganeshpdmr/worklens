export function flattenSprintActivity(response) {
  if (!response) return {};

  return {
    currentStatus_applicable: response.currentStatus?.applicable,
    currentStatus_colourCode: response.currentStatus?.colourCode,
    currentStatus_displayName: response.currentStatus?.displayName,
    currentStatus_mandatory: response.currentStatus?.mandatory,
    currentStatus_statusId: response.currentStatus?.statusId,
    currentStatus_uniqueName: response.currentStatus?.uniqueName,

    activityId: response.simpleActivityInfo?.activityId,

    activityType_colourCode:
      response.simpleActivityInfo?.activityType?.colourCode,
    activityType_id: response.simpleActivityInfo?.activityType?.id,
    activityType_name: response.simpleActivityInfo?.activityType?.name,

    category_colourCode: response.simpleActivityInfo?.category?.colourCode,
    category_id: response.simpleActivityInfo?.category?.id,
    category_name: response.simpleActivityInfo?.category?.name,

    createdBy: response.simpleActivityInfo?.createdBy,
    createdOn: response.simpleActivityInfo?.createdOn,

    activityStatus_applicable:
      response.simpleActivityInfo?.currentStatus?.applicable,
    activityStatus_colourCode:
      response.simpleActivityInfo?.currentStatus?.colourCode,
    activityStatus_displayName:
      response.simpleActivityInfo?.currentStatus?.displayName,
    activityStatus_mandatory:
      response.simpleActivityInfo?.currentStatus?.mandatory,
    activityStatus_statusId:
      response.simpleActivityInfo?.currentStatus?.statusId,
    activityStatus_uniqueName:
      response.simpleActivityInfo?.currentStatus?.uniqueName,

    description: response.simpleActivityInfo?.description,
    externalTicketId: response.simpleActivityInfo?.externalTicketId,
    parentActivityId: response.simpleActivityInfo?.parentActivityId,

    projectId: response.simpleActivityInfo?.projectDetails?.projectId,
    projectName: response.simpleActivityInfo?.projectDetails?.projectName,

    title: response.simpleActivityInfo?.title,
    updatedBy: response.simpleActivityInfo?.updatedBy,
    updatedOn: response.simpleActivityInfo?.updatedOn,
    activityVersion: response.simpleActivityInfo?.version,

    sprintId: response.simpleSprintInfo?.sprintId,
    sprintName: response.simpleSprintInfo?.sprintName,

    sprintActivityId: response.sprintActivityId,
    rootVersion: response.version,
  };
}
