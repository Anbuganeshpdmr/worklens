import ReportChart from "./ReportChart";


const SAMPLE_DATA = [
    {
        activityId: 1,

        currentStatus_statusId: 10,
        currentStatus_displayName: "in-testing",
        currentStatus_colourCode: "#FD7E14",

        activityType_id: 1,
        activityType_name: "scenario",
        activityType_colourCode: "#0D6EFD",

        category_id: 1,
        category_name: "sprint-testing",
        category_colourCode: "#0DCAF0",

        createdById: 101,
        createdBy: "Anbu Ganesh",

        projectId: 3,
        projectName: "CPS",
    },

    {
        activityId: 2,

        currentStatus_statusId: 11,
        currentStatus_displayName: "failed",
        currentStatus_colourCode: "#DC3545",

        activityType_id: 2,
        activityType_name: "regression",
        activityType_colourCode: "#6F42C1",

        category_id: 1,
        category_name: "sprint-testing",
        category_colourCode: "#0DCAF0",

        createdById: 102,
        createdBy: "Arun",

        projectId: 3,
        projectName: "CPS",
    },

    {
        activityId: 3,

        currentStatus_statusId: 10,
        currentStatus_displayName: "in-testing",
        currentStatus_colourCode: "#FD7E14",

        activityType_id: 1,
        activityType_name: "scenario",
        activityType_colourCode: "#0D6EFD",

        category_id: 1,
        category_name: "sprint-testing",
        category_colourCode: "#0DCAF0",

        createdById: 101,
        createdBy: "Anbu Ganesh",

        projectId: 4,
        projectName: "LMS",
    },

    {
        activityId: 4,

        currentStatus_statusId: 12,
        currentStatus_displayName: "closed",
        currentStatus_colourCode: "#5C636A",

        activityType_id: 2,
        activityType_name: "regression",
        activityType_colourCode: "#6F42C1",

        category_id: 1,
        category_name: "sprint-testing",
        category_colourCode: "#0DCAF0",

        createdById: 103,
        createdBy: "Kumar",

        projectId: 4,
        projectName: "LMS",
    },

    {
        activityId: 5,

        currentStatus_statusId: 10,
        currentStatus_displayName: "in-testing",
        currentStatus_colourCode: "#FD7E14",

        activityType_id: 3,
        activityType_name: "smoke",
        activityType_colourCode: "#20C997",

        category_id: 1,
        category_name: "sprint-testing",
        category_colourCode: "#0DCAF0",

        createdById: 102,
        createdBy: "Arun",

        projectId: 5,
        projectName: "JMS",
    },
];


const CRITERIA_OPTIONS = [
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

    {
        key: "category",
        label: "Category",

        getValue: (activity) => ({
            id: activity.category_id,
            name: activity.category_name,
            color: activity.category_colourCode,
        }),
    },

    {
        key: "user",
        label: "Username",

        getValue: (activity) => ({
            id: activity.createdById,
            name: activity.createdBy,
        }),
    },

    {
        key: "project",
        label: "Project",

        getValue: (activity) => ({
            id: activity.projectId,
            name: activity.projectName,
        }),
    },
];


function ReportChartTestPage() {
    return (
        <div style={{ padding: "30px" }}>

            <h2>Report Chart Test</h2>

            <ReportChart
                records={SAMPLE_DATA}
                criteriaOptions={CRITERIA_OPTIONS}
                defaultCriteria="status"
            />

        </div>
    );
}

export default ReportChartTestPage;