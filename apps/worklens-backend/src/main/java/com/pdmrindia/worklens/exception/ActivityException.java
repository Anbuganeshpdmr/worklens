package com.pdmrindia.worklens.exception;

public class ActivityException {

    public static class ActivityNotFoundException extends RuntimeException{
        public ActivityNotFoundException(String message){super(message);}
    }

    public static class ParentActivityProjectMismatchException extends RuntimeException{
        public ParentActivityProjectMismatchException(String message){super(message);}
    }

    public static class ActivityRetiredException extends RuntimeException{
        public ActivityRetiredException(String message){super(message);}
    }

    public static class ActivityNotEditableException extends RuntimeException{
        public ActivityNotEditableException(String message){super(message);}
    }

    public static class TestCategoryMismatchException extends RuntimeException{
        public TestCategoryMismatchException(String message){super(message);}
    }

    public static class VersionMismatchException extends RuntimeException{
        public VersionMismatchException(String message){super(message);}
    }

    public static class ParentIsInHierarchyException extends RuntimeException{
        public ParentIsInHierarchyException(String message){super(message);}
    }
}
