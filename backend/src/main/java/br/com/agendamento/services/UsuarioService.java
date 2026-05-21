package br.com.agendamento.services;

import br.com.agendamento.exception.ConflitoDadosException;
import br.com.agendamento.model.entity.Usuario;
import br.com.agendamento.repository.UsuarioRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public UsuarioService(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder   = passwordEncoder;
    }

    public Usuario cadastrar(Usuario usuario, String senhaPlana) {
        // Verifica e-mail duplicado
        if (usuarioRepository.findByEmail(usuario.getEmail()).isPresent()) {
            throw new ConflitoDadosException(
                    "Já existe um usuário cadastrado com o e-mail \"" + usuario.getEmail() + "\".");
        }
        usuario.setSenha(passwordEncoder.encode(senhaPlana));
        return usuarioRepository.save(usuario);
    }

    public Optional<Usuario> autenticar(String email, String senhaPlana) {
        return usuarioRepository.findByEmail(email)
                .filter(u -> passwordEncoder.matches(senhaPlana, u.getSenha()));
    }
}
