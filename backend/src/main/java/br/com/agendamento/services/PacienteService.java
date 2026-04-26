package br.com.agendamento.services;

import br.com.agendamento.model.entity.Paciente;
import br.com.agendamento.repository.PacienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class PacienteService {

    @Autowired
    private PacienteRepository repository;

    public List<Paciente> listarTodos() {
        return repository.findAll();
    }

    public Paciente salvar(Paciente paciente) {
        return repository.save(paciente);
    }
}