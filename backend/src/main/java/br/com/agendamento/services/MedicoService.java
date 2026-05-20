package br.com.agendamento.services;

import br.com.agendamento.model.entity.Medico;
import br.com.agendamento.repository.MedicoRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class MedicoService {

    private final MedicoRepository repository;

    public MedicoService(MedicoRepository repository) {
        this.repository = repository;
    }

    public Medico salvar(Medico medico) {
        return repository.save(medico);
    }

    public List<Medico> listar() {
        return repository.findAll();
    }
}
