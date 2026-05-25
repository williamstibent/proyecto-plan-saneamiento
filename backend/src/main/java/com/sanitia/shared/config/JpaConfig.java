package com.sanitia.shared.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

/**
 * Configuración JPA y auditoría automática de created_at / updated_at.
 * El filtro multi-tenant de Hibernate se activa en TenantInterceptor (Fase 1).
 */
@Configuration
@EnableJpaAuditing
public class JpaConfig {
    // Configuración adicional de Hibernate (filtros de tenant) se agrega en Fase 1
    // cuando se implementa el módulo identity y el JWT de Cognito.
}
