package br.com.agendamento;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;

// Desliga a trava de segurança do Spring Boot para o MVP
@SpringBootApplication(exclude = {SecurityAutoConfiguration.class})
public class AgendamentoApplication {

    public static void main(String[] args) {
        SpringApplication.run(AgendamentoApplication.class, args);
    }
}