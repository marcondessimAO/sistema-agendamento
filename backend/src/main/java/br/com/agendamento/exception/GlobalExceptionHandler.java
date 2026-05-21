package br.com.agendamento.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.Map;

/**
 * Captura ConflitoDadosException em qualquer controller e devolve
 * um corpo JSON padronizado com status 400.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ConflitoDadosException.class)
    public ResponseEntity<Map<String, Object>> handleConflito(ConflitoDadosException ex) {
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(Map.of(
                        "status",    400,
                        "erro",      "Conflito de dados",
                        "mensagem",  ex.getMessage(),
                        "timestamp", LocalDateTime.now().toString()
                ));
    }
}
