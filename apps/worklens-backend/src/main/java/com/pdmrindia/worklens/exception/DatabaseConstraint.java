package com.pdmrindia.worklens.exception;

public enum DatabaseConstraint {

    UK_USER_EMAIL("uk_user_email", "The provided email ID is already registered."),
    UK_USER_EMP("uk_user_emp", "The provided Employee ID already exists."),
    UK_EMP_PROJECT_COMPOSITE("uk_emp_project_composite", "This employee is already assigned to this project."),
    UK_ACTIVITY_TYPE_COLOUR("uk_activity_type_colour_code", "activity colour already exists"),
    UK_ACTIVITY_TYPE_NAME("uk_activity_type_name", "activity already exists"),
    UK_ACTIVITY_CATEGORY("uk_category_activity", "Category has same Activity type"),
    UK_PROJECT_NAME("uk_project_name", "project name already exists"),
    UK_PROJECT_SPRINT_NAME("uk_project_sprint_name", "project has already same sprint name"),
    UK_STATUS_COLOUR("uk_status_colour", "status colour already exists"),
    UK_STATUS_RECORD_DISPLAY_NAME("uk_status_record_display_name", "The provided Employee ID already exists."),
    UK_SPRINT_ACTIVITY("uk_sprint_activity", "Associated Sprint And Activity already present"),
    UK_ROLE_NAME("uk_role_name", "The Role name already exists"),
    UK_CATEGORY_NAME("uk_category_name", "Category already exists"),
    UK_CATEGORY_COLOUR("uk_category_colour_code", "Category colour already exists");

    private final String constraintName;
    private final String errorMessage;

    DatabaseConstraint(String constraintName, String errorMessage) {
        this.constraintName = constraintName;
        this.errorMessage = errorMessage;
    }

    public String getConstraintName() { return constraintName; }
    public String getErrorMessage() { return errorMessage; }

    public static String getMessageFor(String rootCauseMessage) {
        if (rootCauseMessage == null) return null;

        String lowerMessage = rootCauseMessage.toLowerCase();

        for (DatabaseConstraint constraint : values()) {
            if (lowerMessage.contains(constraint.getConstraintName().toLowerCase())) {
                return constraint.getErrorMessage();
            }
        }
        return null;
    }
}
