package com.pdmrindia.worklens.exception;

public class SprintActivityException {

    public static class SprintActivityNotFoundException extends RuntimeException{
        public SprintActivityNotFoundException(String message){super(message);}
    }

    public static class SprintAndActivityProjectMismatchException extends RuntimeException{
        public SprintAndActivityProjectMismatchException(String message){super(message);}
    }
}
