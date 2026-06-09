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
        return "servicos";
    }

    @GetMapping("/dashboard")
    public String exibirDashboard() {
        return "dashboard";
    }

    @GetMapping("/relatorios")
    public String relatorios() {
        return "relatorios";
    }

    @GetMapping("/agendamentos-colaborador")
    public String paginaAgendamentosColaborador() {
        return "agendamentos-colaborador";
    }
}
