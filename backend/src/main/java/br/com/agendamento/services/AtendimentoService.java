package br.com.agendamento.services;

import br.com.agendamento.enums.StatusAtendimento;
import br.com.agendamento.model.entity.Atendimento;
import br.com.agendamento.repository.AtendimentoRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class AtendimentoService {

    private final AtendimentoRepository repository;

    public AtendimentoService(AtendimentoRepository repository) {
        this.repository = repository;
    }

    public Atendimento agendar(Atendimento atendimento) {
        atendimento.setStatus(StatusAtendimento.EM_ESPERA);
        if (atendimento.getDataHora() == null) {
            atendimento.setDataHora(LocalDateTime.now());
        }
        return repository.save(atendimento);
    }
    
    public List<Atendimento> listar() {
        return repository.findAll();
    }
}
