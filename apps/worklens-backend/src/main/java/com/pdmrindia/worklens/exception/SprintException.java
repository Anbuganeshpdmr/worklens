package com.pdmrindia.worklens.exception;

public class SprintException {

    public static class SprintAlreadyExistsException extends RuntimeException{
        public SprintAlreadyExistsException(String message){
            super(message);
        }
    }

    public static class SprintNotFoundException extends RuntimeException{
        public SprintNotFoundException(String message){super(message);}
    }

    public static class SprintProjectMismatchException extends RuntimeException{
        public SprintProjectMismatchException(String message){super(message);}
    }

}
