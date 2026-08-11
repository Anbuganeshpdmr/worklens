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

    public static class NoSuchRecordStatusException extends RuntimeException{
        public NoSuchRecordStatusException(String message){
            super(message);
        }
    }

    public static class RecordStatusNotAllowedException extends RuntimeException{
        public RecordStatusNotAllowedException(String message){
            super(message);
        }
    }

    public static class RecordStatusMismatchException extends RuntimeException{
        public RecordStatusMismatchException(String message){
            super(message);
        }
    }
}
