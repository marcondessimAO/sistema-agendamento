package br.com.agendamento.services;

import br.com.agendamento.model.entity.Usuario;
import br.com.agendamento.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public Usuario cadastrar(Usuario usuario, String senhaPlana) {
        // Encriptar a senha antes de salvar
        usuario.setSenha(passwordEncoder.encode(senhaPlana));
        return usuarioRepository.save(usuario);
    }

    public Optional<Usuario> autenticar(String email, String senhaPlana) {
        // Find user manually for MVP
        for (Usuario u : usuarioRepository.findAll()) {
            if (u.getEmail().equals(email)) {
                if (passwordEncoder.matches(senhaPlana, u.getSenha())) {
                    return Optional.of(u);
                }
                break;
            }
        }
        return Optional.empty();
    }
}
