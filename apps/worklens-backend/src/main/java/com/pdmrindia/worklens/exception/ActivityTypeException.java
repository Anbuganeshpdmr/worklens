package com.pdmrindia.worklens.exception;

public class ActivityTypeException {

    public static class NoSuchTypeException extends RuntimeException{
        public NoSuchTypeException(String message){
            super(message);
        }
    }
}
