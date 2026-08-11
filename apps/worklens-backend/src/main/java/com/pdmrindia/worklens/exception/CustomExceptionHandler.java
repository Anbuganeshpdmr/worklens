package com.pdmrindia.worklens.exception;

import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authorization.AuthorizationDeniedException;
import org.springframework.validation.FieldError;

import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestControllerAdvice
@ControllerAdvice
public class CustomExceptionHandler {


    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public Map<String,String> handleValidationException(MethodArgumentNotValidException exception){
        Map<String,String> errors = new HashMap<>();
        List<FieldError> fieldErrors = exception.getBindingResult().getFieldErrors();
        for(FieldError objError: fieldErrors){
            errors.putIfAbsent(objError.getField(),objError.getDefaultMessage());
        }
        return errors;
    }

    @ExceptionHandler({
            UserException.EmpIdAlreadyExistsException.class,
            UserException.EmailAlreadyExistsException.class,
            ProjectException.ProjectAlreadyExistsException.class
    })
    @ResponseStatus(HttpStatus.CONFLICT)
    public ErrorResponse handleConflictExceptions(RuntimeException ex) {
        return new ErrorResponse(ex.getMessage());
    }

    @ExceptionHandler({ AuthorizationDeniedException.class, AccessDeniedException.class })
    @ResponseStatus(HttpStatus.FORBIDDEN)
    public ErrorResponse handleSecurityExceptions(Exception ex) {
        return new ErrorResponse(ex.getMessage());
    }

    @ExceptionHandler({
            RecordStatusException.DefaultStatusException.class,
            RecordStatusException.NoDefaultStatusException.class,
            RecordStatusException.DefaultStatusNotAllowedException.class,
            RecordStatusException.RecordStatusMismatchException.class,
            RecordStatusException.RecordStatusNotAllowedException.class,
            ProjectException.ProjectNotFoundException.class,
            SprintException.SprintNotFoundException.class
    })
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponse handleBadRequestExceptions(RuntimeException ex) {
        return new ErrorResponse(ex.getMessage());
    }

}
