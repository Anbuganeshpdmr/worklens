package com.pdmrindia.worklens.exception;

public class UserException {

    public static class EmailAlreadyExistsException extends RuntimeException {
        public EmailAlreadyExistsException(String message) {
            super(message);
        }
    }

    public static class EmpIdAlreadyExistsException extends RuntimeException {
        public EmpIdAlreadyExistsException(String message) {
            super(message);
        }
    }

    public static class PasswordNotCorrectException extends RuntimeException{
        public PasswordNotCorrectException(String message){
            super(message);
        }
    }

    public static class NotValidInputException extends RuntimeException{
        public NotValidInputException(String message){
            super(message);
        }
    }

    public static class EmpNotFoundException extends RuntimeException{
        public EmpNotFoundException(String message){
            super(message);
        }
    }

    public static class ShortUserNameException extends RuntimeException{
        public ShortUserNameException(String message){
            super(message);
        }
    }
}
