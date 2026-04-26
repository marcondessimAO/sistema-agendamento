package br.com.agendamento.repository;

import br.com.agendamento.model.entity.Paciente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PacienteRepository extends JpaRepository<Paciente, Integer> {
    // Aqui o Spring Data JPA já cria o CRUD sozinho pra você!
}