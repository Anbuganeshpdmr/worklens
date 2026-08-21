package com.pdmrindia.worklens.exception;

public class SprintActivityException {

    public static class SprintActivityNotFoundException extends RuntimeException{
        public SprintActivityNotFoundException(String message){super(message);}
    }
}
