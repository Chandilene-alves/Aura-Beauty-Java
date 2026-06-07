package com.aurabeauty.agendamentos.controller;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class PaginasController {
    @GetMapping("/agendamentos")
    public String exibirPaginaAgendamentos() {
        return "agendamentos";
    }

    @GetMapping("/servicos")
    public String exibirPaginaServicos() {
        return "servicos"; // Procura por servicos.html (ou o nome do seu HTML)
    }

    @GetMapping("/dashboard")
    public String exibirDashboard() {
        return "dashboard";
    }
}
