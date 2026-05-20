package br.com.agendamento.services;

import br.com.agendamento.model.entity.Enfermaria;
import br.com.agendamento.repository.EnfermariaRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class EnfermariaService {

    private final EnfermariaRepository repository;

    public EnfermariaService(EnfermariaRepository repository) {
        this.repository = repository;
    }

    public Enfermaria salvar(Enfermaria enfermaria) {
        return repository.save(enfermaria);
    }

    public List<Enfermaria> listar() {
        return repository.findAll();
    }
}
