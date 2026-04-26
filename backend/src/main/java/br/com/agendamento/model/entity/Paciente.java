package br.com.agendamento.model.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;
import java.time.LocalDate;

@Entity
@Table(name = "pacientes")
@Data
@EqualsAndHashCode(callSuper = true)
public class Paciente extends Usuario {

    private String cpf;

    private String telefone;

    private LocalDate dataNascimento;
}
