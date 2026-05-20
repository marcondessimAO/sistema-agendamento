package br.com.agendamento.controllers;

import br.com.agendamento.model.entity.Medico;
import br.com.agendamento.services.MedicoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/medicos")
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"})
public class MedicoController {

    private final MedicoService service;

    public MedicoController(MedicoService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<Medico> criar(@RequestBody Medico medico) {
        Medico criado = service.salvar(medico);
        return ResponseEntity.status(HttpStatus.CREATED).body(criado);
    }

    @GetMapping
    public ResponseEntity<List<Medico>> listar() {
        return ResponseEntity.ok(service.listar());
    }
}
