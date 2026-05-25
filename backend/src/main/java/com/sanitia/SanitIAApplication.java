package com.sanitia;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class SanitIAApplication {

    public static void main(String[] args) {
        SpringApplication.run(SanitIAApplication.class, args);
    }
}
