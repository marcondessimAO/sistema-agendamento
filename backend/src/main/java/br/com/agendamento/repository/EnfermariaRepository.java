package br.com.agendamento.repository;

import br.com.agendamento.model.entity.Enfermaria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EnfermariaRepository extends JpaRepository<Enfermaria, Integer> {
}
