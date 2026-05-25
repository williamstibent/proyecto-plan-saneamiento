package com.sanitia.shared.api;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.Map;

/**
 * Endpoint de verificación rápida del servidor.
 * Complementa el /actuator/health de Spring Boot.
 */
@RestController
@RequestMapping("/api/v1")
public class HealthController {

    @GetMapping("/ping")
    public ResponseEntity<Map<String, Object>> ping() {
        return ResponseEntity.ok(Map.of(
            "status", "UP",
            "service", "SanitIA Backend",
            "timestamp", Instant.now().toString()
        ));
    }
}
