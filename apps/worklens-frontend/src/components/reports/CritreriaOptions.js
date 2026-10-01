export const CriteriaOptions_SprintActivityExecuteList = [
    {
        key: "status",
        label: "Status",

        getValue: (activity) => ({
            id: activity.currentStatus_statusId,
            name: activity.currentStatus_displayName,
            color: activity.currentStatus_colourCode,
        }),
    },

    {
        key: "type",
        label: "Type",

        getValue: (activity) => ({
            id: activity.activityType_id,
            name: activity.activityType_name,
            color: activity.activityType_colourCode,
        }),
    },
];

export const CriteriaOptions_EntryList = [
    {
        key: "status",
        label: "Status",
        getValue: (entry) => ({
            id: entry.statusId,
            name: entry.statusDisplayName,
            color: entry.statusColour,
        }),
    },
    {
        key: "type",
        label: "Type",
        getValue: (entry) => ({
            id: entry.activityTypeId,
            name: entry.activityTypeName,
            color: entry.activityTypeColour,
        }),
    },
    {
        key: "category",
        label: "Category",
        getValue: (entry) => ({
            id: entry.categoryId,
            name: entry.categoryName,
            color: entry.categoryColour,
        }),
    },
    {
        key: "project",
        label: "Project",
        getValue: (entry) => ({
            id: entry.projectName,   // no projectId on flattened shape, use name as key
            name: entry.projectName,
            color: null,
        }),
    },
    {
        key: "user",
        label: "User",
        getValue: (entry) => ({
            id: entry.user,
            name: entry.user,
            color: null,
        }),
    },
];

export {
    AggregatorOption_Duration,
    AggregatorOption_Count,
    AggregatorOptions_EntryList,
    AggregatorOptions_SprintActivityExecuteList,
    DEFAULT_AGGREGATOR,
} from "./AggregatorOptions.js";
