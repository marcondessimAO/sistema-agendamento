package br.com.agendamento.repository;

import br.com.agendamento.model.entity.RegistroEnfermaria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RegistroEnfermariaRepository extends JpaRepository<RegistroEnfermaria, Integer> {
}
