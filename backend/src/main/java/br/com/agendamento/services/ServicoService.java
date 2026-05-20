package br.com.agendamento.services;

import br.com.agendamento.model.entity.Servico;
import br.com.agendamento.repository.ServicoRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ServicoService {

    private final ServicoRepository repository;

    public ServicoService(ServicoRepository repository) {
        this.repository = repository;
    }

    public Servico salvar(Servico servico) {
        return repository.save(servico);
    }

    public List<Servico> listar() {
        return repository.findAll();
    }
}
