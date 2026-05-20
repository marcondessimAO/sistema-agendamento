package br.com.agendamento.controllers;

import br.com.agendamento.model.entity.Atendimento;
import br.com.agendamento.services.AtendimentoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/atendimentos")
@CrossOrigin(origins = "http://localhost:3000")
public class AtendimentoController {

    private final AtendimentoService service;

    public AtendimentoController(AtendimentoService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<Atendimento> criar(@RequestBody Atendimento atendimento) {
        Atendimento criado = service.agendar(atendimento);
        return ResponseEntity.status(HttpStatus.CREATED).body(criado);
    }

    @GetMapping
    public ResponseEntity<List<Atendimento>> listar() {
        return ResponseEntity.ok(service.listar());
    }
}
