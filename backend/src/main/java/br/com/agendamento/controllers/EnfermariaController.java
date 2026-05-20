package br.com.agendamento.controllers;

import br.com.agendamento.model.entity.Enfermaria;
import br.com.agendamento.services.EnfermariaService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/enfermarias")
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"})
public class EnfermariaController {

    private final EnfermariaService service;

    public EnfermariaController(EnfermariaService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<Enfermaria> criar(@RequestBody Enfermaria enfermaria) {
        Enfermaria criado = service.salvar(enfermaria);
        return ResponseEntity.status(HttpStatus.CREATED).body(criado);
    }

    @GetMapping
    public ResponseEntity<List<Enfermaria>> listar() {
        return ResponseEntity.ok(service.listar());
    }
}
