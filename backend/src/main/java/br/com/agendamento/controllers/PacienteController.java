package br.com.agendamento.controllers;

import br.com.agendamento.model.entity.Paciente;
import br.com.agendamento.services.PacienteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pacientes")
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"})
public class PacienteController {

    @Autowired
    private PacienteService service;

    @GetMapping
    public List<Paciente> listar() {
        return service.listarTodos();
    }

    @PostMapping
    public Paciente criar(@RequestBody Paciente paciente) {
        return service.salvar(paciente);
    }
}