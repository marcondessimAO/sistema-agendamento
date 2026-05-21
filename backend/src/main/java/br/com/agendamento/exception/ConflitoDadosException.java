package br.com.agendamento.exception;

/**
 * Lançada quando já existe um registro com o mesmo campo único
 * (email, CPF ou CRM). O controller converte em HTTP 400.
 */
public class ConflitoDadosException extends RuntimeException {
    public ConflitoDadosException(String message) {
        super(message);
    }
}
