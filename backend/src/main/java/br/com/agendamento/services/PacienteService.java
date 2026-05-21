package br.com.agendamento.services;

import br.com.agendamento.enums.PerfilAcesso;
import br.com.agendamento.exception.ConflitoDadosException;
import br.com.agendamento.model.entity.Paciente;
import br.com.agendamento.repository.PacienteRepository;
import br.com.agendamento.repository.UsuarioRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PacienteService {

    private final PacienteRepository pacienteRepository;
    private final UsuarioRepository  usuarioRepository;
    private final PasswordEncoder    passwordEncoder;

    public PacienteService(PacienteRepository pacienteRepository,
                           UsuarioRepository usuarioRepository,
                           PasswordEncoder passwordEncoder) {
        this.pacienteRepository = pacienteRepository;
        this.usuarioRepository  = usuarioRepository;
        this.passwordEncoder    = passwordEncoder;
    }

    public List<Paciente> listarTodos() {
        return pacienteRepository.findAll();
    }

    public Paciente salvar(Paciente paciente) {
        // Verifica e-mail duplicado
        if (paciente.getEmail() != null &&
                usuarioRepository.findByEmail(paciente.getEmail()).isPresent()) {
            throw new ConflitoDadosException(
                    "Já existe um cadastro com o e-mail \"" + paciente.getEmail() + "\".");
        }
        // Verifica CPF duplicado
        if (paciente.getCpf() != null &&
                pacienteRepository.findByCpf(paciente.getCpf()).isPresent()) {
            throw new ConflitoDadosException(
                    "Já existe um paciente cadastrado com o CPF \"" + paciente.getCpf() + "\".");
        }

        if (paciente.getSenha() != null && !paciente.getSenha().startsWith("$2a$")) {
            paciente.setSenha(passwordEncoder.encode(paciente.getSenha()));
        }
        if (paciente.getPerfil() == null) {
            paciente.setPerfil(PerfilAcesso.PACIENTE);
        }
        return pacienteRepository.save(paciente);
    }

    public Optional<Paciente> buscarPorCpf(String cpf) {
        return pacienteRepository.findByCpf(cpf);
    }
}