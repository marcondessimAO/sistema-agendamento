package br.com.agendamento.model.entity;

import br.com.agendamento.enums.StatusEnfermaria;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "registros_enfermaria")
@Data
public class RegistroEnfermaria {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Enumerated(EnumType.STRING)
    private StatusEnfermaria statusPaciente;

    private LocalDateTime dataEntrada;

    @OneToOne
    @JoinColumn(name = "atendimento_id")
    private Atendimento atendimento;

    @ManyToOne
    @JoinColumn(name = "enfermaria_id")
    private Enfermaria enfermaria;
}
