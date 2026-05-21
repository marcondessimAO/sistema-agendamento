package br.com.agendamento.controllers;

import br.com.agendamento.model.entity.Paciente;
import br.com.agendamento.services.PacienteService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/pacientes")
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"})
public class PacienteController {

    private final PacienteService service;

    public PacienteController(PacienteService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<Paciente>> listar() {
        return ResponseEntity.ok(service.listarTodos());
    }

    @PostMapping
    public ResponseEntity<Paciente> criar(@RequestBody Paciente paciente) {
        Paciente criado = service.salvar(paciente);
        return ResponseEntity.status(HttpStatus.CREATED).body(criado);
    }

    /** Busca por CPF — usado pelo frontend para agendar consultas */
    @GetMapping("/cpf/{cpf}")
    public ResponseEntity<Paciente> buscarPorCpf(@PathVariable String cpf) {
        Optional<Paciente> p = service.buscarPorCpf(cpf);
        return p.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}