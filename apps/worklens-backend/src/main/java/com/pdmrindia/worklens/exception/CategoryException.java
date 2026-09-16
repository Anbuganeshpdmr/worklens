package com.pdmrindia.worklens.exception;

public class CategoryException {

    public static class NoSuchCategoryException extends RuntimeException{
        public NoSuchCategoryException(String message){
            super(message);
        }
    }

    public static class CategoryTypeMismatchException extends RuntimeException{
        public CategoryTypeMismatchException(String message){
            super(message);
        }
    }
}
