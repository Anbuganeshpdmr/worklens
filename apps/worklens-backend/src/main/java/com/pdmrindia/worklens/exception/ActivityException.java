package com.pdmrindia.worklens.exception;

public class ActivityException {

    public static class ActivityNotFoundException extends RuntimeException{
        public ActivityNotFoundException(String message){super(message);}
    }

    public static class ParentActivityProjectMismatchException extends RuntimeException{
        public ParentActivityProjectMismatchException(String message){super(message);}
    }
}
