package br.com.agendamento.controllers;

import br.com.agendamento.enums.PerfilAcesso;
import br.com.agendamento.model.entity.Usuario;
import br.com.agendamento.security.JwtUtil;
import br.com.agendamento.services.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/cadastro")
    public ResponseEntity<Map<String, String>> cadastrar(@RequestBody Map<String, String> body) {
        String nome = body.get("nome");
        String email = body.get("email");
        String senha = body.get("senha");
        String perfilStr = body.get("perfil");

        Usuario u = new Usuario();
        u.setNome(nome);
        u.setEmail(email);
        u.setPerfil(PerfilAcesso.valueOf(perfilStr));

        usuarioService.cadastrar(u, senha);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Usuário cadastrado com sucesso!");
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String senha = body.get("senha");

        Optional<Usuario> authOpt = usuarioService.autenticar(email, senha);

        if (authOpt.isPresent()) {
            Usuario u = authOpt.get();
            String token = jwtUtil.gerarToken(u.getEmail(), "ROLE_" + u.getPerfil().name());
            
            Map<String, String> response = new HashMap<>();
            response.put("token", token);
            response.put("role", u.getPerfil().name());
            response.put("email", u.getEmail());
            response.put("nome", u.getNome());
            
            return ResponseEntity.ok(response);
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }
}
