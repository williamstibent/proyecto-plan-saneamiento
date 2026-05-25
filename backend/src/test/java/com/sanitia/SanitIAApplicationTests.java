package com.sanitia;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

/**
 * Test de arranque del contexto de Spring.
 * Usa Testcontainers para levantar un PostgreSQL real — sin mocks de DB.
 *
 * Prerequisito: Docker debe estar corriendo en la máquina.
 */
@SpringBootTest
@Testcontainers
@ActiveProfiles("test")
class SanitIAApplicationTests {

    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16-alpine")
        .withDatabaseName("sanitia_test")
        .withUsername("sanitia")
        .withPassword("sanitia_pass");

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
    }

    @Test
    void contextLoads() {
        // Si el contexto de Spring arranca sin errores, el test pasa.
        // Este test es el smoke test mínimo — falla si hay un bean mal configurado.
    }
}
