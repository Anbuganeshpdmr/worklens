package com.pdmrindia.worklens.exception;

public class StatusException {

    public static class NoSuchStatusException extends RuntimeException{
        public NoSuchStatusException(String message){
            super(message);
        }
    }

    public static class StatusUpdateRestrictedException extends RuntimeException{
        public StatusUpdateRestrictedException(String message){
            super(message);
        }
    }

    public static class DefaultStatusExceedException extends RuntimeException{
        public DefaultStatusExceedException(String message){
            super(message);
        }
    }

    public static class RecordStatusMismatchException extends RuntimeException{
        public RecordStatusMismatchException(String message){
            super(message);
        }
    }

    public static class RecordStatusCountMismatchException extends RuntimeException{
        public RecordStatusCountMismatchException(String message){
            super(message);
        }
    }

    public static class DefaultStatusCountMismatchException extends RuntimeException{
        public DefaultStatusCountMismatchException(String message){
            super(message);
        }
    }
}
