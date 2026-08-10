package com.pdmrindia.worklens.exception;

public class RecordStatusException {

    public static class DefaultStatusException extends RuntimeException{
        public DefaultStatusException(String message){
            super(message);
        }
    }

    public static class NoDefaultStatusException extends RuntimeException{
        public NoDefaultStatusException(String message){
            super(message);
        }
    }

    public static class DefaultStatusNotAllowedException extends RuntimeException{
        public DefaultStatusNotAllowedException(String message){
            super(message);
        }
    }
}
