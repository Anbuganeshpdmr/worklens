package com.pdmrindia.worklens.exception;

public class StatusException {

    public static class NoSuchStatusException extends RuntimeException{
        public NoSuchStatusException(String message){
            super(message);
        }
    }
}
