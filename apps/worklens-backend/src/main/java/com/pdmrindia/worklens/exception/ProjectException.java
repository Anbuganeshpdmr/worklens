package com.pdmrindia.worklens.exception;

public class ProjectException {

    public static class DuplicateRecordException extends RuntimeException{
        public DuplicateRecordException(String message){
            super(message);
        }
    }

    public static class ProjectAlreadyExistsException extends RuntimeException{
        public ProjectAlreadyExistsException(String message){
            super(message);
        }
    }

    public static class ProjectNotFoundException extends RuntimeException{
        public ProjectNotFoundException(String message){super(message);}
    }

    public static class InvalidInputException extends RuntimeException{
        public InvalidInputException(String message){
            super(message);
        }
    }
}
