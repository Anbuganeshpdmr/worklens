package com.pdmrindia.worklens.exception;

public enum DatabaseConstraint {

    UK_USER_EMAIL("uk_user_email", "The provided email ID is already registered."),
    UK_USER_EMP("uk_user_emp", "The provided Employee ID already exists."),
    UK_EMP_PROJECT_COMPOSITE("uk_emp_project_composite", "This employee is already assigned to this project.");

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
