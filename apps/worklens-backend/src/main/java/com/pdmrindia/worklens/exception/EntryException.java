package com.pdmrindia.worklens.exception;

public class EntryException {

    public static class EntryNotFoundException extends RuntimeException{
        public EntryNotFoundException(String message){super(message);}
    }

    public static class UnauthorisedEntryAccessException extends RuntimeException{
        public UnauthorisedEntryAccessException(String message){super(message);}
    }
}
