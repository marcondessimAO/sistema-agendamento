package br.com.agendamento.services;

import br.com.agendamento.enums.PerfilAcesso;
import br.com.agendamento.exception.ConflitoDadosException;
import br.com.agendamento.model.entity.Medico;
import br.com.agendamento.repository.MedicoRepository;
import br.com.agendamento.repository.UsuarioRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MedicoService {

    private final MedicoRepository  medicoRepository;
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder   passwordEncoder;

    public MedicoService(MedicoRepository medicoRepository,
                         UsuarioRepository usuarioRepository,
                         PasswordEncoder passwordEncoder) {
        this.medicoRepository  = medicoRepository;
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder   = passwordEncoder;
    }

    public Medico salvar(Medico medico) {
        // Verifica e-mail duplicado (na tabela de usuários)
        if (medico.getEmail() != null &&
                usuarioRepository.findByEmail(medico.getEmail()).isPresent()) {
            throw new ConflitoDadosException(
                    "Já existe um cadastro com o e-mail \"" + medico.getEmail() + "\".");
        }
        // Verifica CRM duplicado
        if (medico.getCrm() != null &&
                medicoRepository.findByCrm(medico.getCrm()).isPresent()) {
            throw new ConflitoDadosException(
                    "Já existe um médico cadastrado com o CRM \"" + medico.getCrm() + "\".");
        }

        if (medico.getSenha() != null && !medico.getSenha().startsWith("$2a$")) {
            medico.setSenha(passwordEncoder.encode(medico.getSenha()));
        }
        if (medico.getPerfil() == null) {
            medico.setPerfil(PerfilAcesso.MEDICO);
        }
        return medicoRepository.save(medico);
    }

    public List<Medico> listar() {
        return medicoRepository.findAll();
    }

    public Optional<Medico> buscarPorCrm(String crm) {
        return medicoRepository.findByCrm(crm);
    }
}
