package br.com.agendamento.model.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Table(name = "medicos")
@Data
@EqualsAndHashCode(callSuper = true)
public class Medico extends Usuario {

    private String crm;
}
