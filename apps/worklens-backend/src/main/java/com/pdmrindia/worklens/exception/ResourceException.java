package com.pdmrindia.worklens.exception;

public class ResourceException {

    public static class FileTypeMismatchException extends RuntimeException{
        public FileTypeMismatchException(String message){
            super(message);
        }
    }

    public static class FileOverSizeException extends RuntimeException{
        public FileOverSizeException(String message){
            super(message);
        }
    }
}
