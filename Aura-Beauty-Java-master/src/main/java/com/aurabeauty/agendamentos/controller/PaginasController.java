package com.aurabeauty.agendamentos.controller;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class PaginasController {
    @GetMapping("/agendamentos")
    public String exibirPaginaAgendamentos() {
        return "agendamentos";
    }
}
