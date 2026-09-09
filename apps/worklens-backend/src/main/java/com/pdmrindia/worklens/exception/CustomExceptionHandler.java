package com.pdmrindia.worklens.exception;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ErrorResponse> handleDataIntegrity(DataIntegrityViolationException ex) {
        String rootMsg = ex.getRootCause() != null ? ex.getRootCause().getMessage() : "";

        String userFriendlyMessage = DatabaseConstraint.getMessageFor(rootMsg);

        if (userFriendlyMessage != null) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(new ErrorResponse(userFriendlyMessage));
        }

        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse(ex.getRootCause().getMessage()));
    }

    @ExceptionHandler({
            UserException.EmpIdAlreadyExistsException.class,
            UserException.EmailAlreadyExistsException.class,
            ProjectException.ProjectAlreadyExistsException.class,
            SprintException.SprintProjectMismatchException.class,
            UserException.PasswordNotCorrectException.class
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
            StatusException.RecordStatusMismatchException.class,
            RecordStatusException.RecordStatusNotAllowedException.class,
            ProjectException.ProjectNotFoundException.class,
            SprintException.SprintNotFoundException.class,
            ActivityException.ActivityNotFoundException.class,
            SprintActivityException.SprintActivityNotFoundException.class,
            EntryException.EntryNotFoundException.class,
            RecordStatusException.NoSuchRecordStatusException.class,
            StatusException.StatusUpdateRestrictedException.class,
            StatusException.DefaultStatusExceedException.class,
            StatusException.RecordStatusCountMismatchException.class,
            StatusException.DefaultStatusCountMismatchException.class,
            StatusException.NoSuchStatusException.class,
            UserException.ShortUserNameException.class,
            CategoryException.NoSuchCategoryException.class,
            CategoryException.CategoryTypeMismatchException.class,
            EntryException.UnauthorisedEntryAccessException.class,
            ActivityException.TestCategoryMismatchException.class,
            SprintActivityException.SprintAndActivityProjectMismatchException.class,
            ActivityException.ActivityNotEditableException.class,
            ActivityException.VersionMismatchException.class,
            ActivityException.ParentIsInHierarchyException.class,
            EntryException.UnclosedEntryException.class
    })
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponse handleBadRequestExceptions(RuntimeException ex) {
        return new ErrorResponse(ex.getMessage());
    }

}
