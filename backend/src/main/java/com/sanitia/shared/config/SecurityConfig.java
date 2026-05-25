package com.sanitia.shared.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;

/**
 * Configuración de seguridad base.
 * En Fase 1 se conectará con Cognito como OAuth2 Resource Server.
 * Por ahora permite todas las rutas para desarrollo local.
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // Rutas públicas de desarrollo y salud
                .requestMatchers("/actuator/health", "/actuator/info").permitAll()
                // TODO: En Fase 1, conectar con Cognito JWT y proteger todas las rutas:
                // .anyRequest().authenticated()
                .anyRequest().permitAll()
            );

        return http.build();
    }
}
