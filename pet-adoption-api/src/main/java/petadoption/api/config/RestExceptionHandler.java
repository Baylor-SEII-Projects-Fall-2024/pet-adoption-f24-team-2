package petadoption.api.config;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import petadoption.api.dto.ErrorDto;
import petadoption.api.exceptions.AppException;

@ControllerAdvice
public class RestExceptionHandler {
    // Execute if an AppException is thrown in any controller
    @ExceptionHandler(value = {AppException.class})
    @ResponseBody
    public ResponseEntity<ErrorDto> handleException(AppException ex) {
        // Returns the custom code from AppExceptions
        return ResponseEntity.status(ex.getCode())
                .body(ErrorDto.builder().message(ex.getMessage()).build());
    }
}
