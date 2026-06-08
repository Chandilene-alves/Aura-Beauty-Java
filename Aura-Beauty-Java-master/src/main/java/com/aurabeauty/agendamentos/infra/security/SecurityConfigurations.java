package com.aurabeauty.agendamentos.infra.security;

import com.aurabeauty.agendamentos.service.AutenticacaoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfigurations {

    @Autowired
    private SecurityFilter securityFilter;
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http.csrf(csrf -> csrf.disable())
                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(req -> {
                    req.dispatcherTypeMatchers(jakarta.servlet.DispatcherType.FORWARD).permitAll();
                    req.requestMatchers("/css/**", "/js/**", "/assets/**").permitAll();

                    req.requestMatchers( "/login/**").permitAll();


                    req.requestMatchers(HttpMethod.GET, "/usuarios").permitAll();
                    req.requestMatchers(HttpMethod.POST, "/usuarios/api").permitAll();

                    req.requestMatchers(HttpMethod.GET, "/agendamentos").permitAll();
                    req.requestMatchers("/api/agendamentos", "/api/agendamentos/**").authenticated();

                    req.requestMatchers(HttpMethod.GET, "/dashboard").permitAll();
                    req.requestMatchers("/api/dashboard/**").authenticated();

                    req.requestMatchers(HttpMethod.GET, "/servicos").permitAll();
                    req.requestMatchers("/api/servicos/", "/api/servicos/**").authenticated();

                    req.requestMatchers(HttpMethod.GET, "/relatorios").permitAll();

                    req.anyRequest().authenticated();
                })
                .addFilterBefore(securityFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }

    @Bean
    public AuthenticationProvider authenticationProvider(AutenticacaoService service) {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(service);
        provider.setPasswordEncoder(new BCryptPasswordEncoder());
        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}