package com.styliste;

import jakarta.annotation.PostConstruct;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

import java.util.TimeZone;

@SpringBootApplication
@EnableScheduling
public class StylisteApplication {

    @PostConstruct
    public void init() {
        // Enforce Indian Standard Time (IST / Asia/Kolkata) across the entire JVM
        TimeZone.setDefault(TimeZone.getTimeZone("Asia/Kolkata"));
    }

    public static void main(String[] args) {
        SpringApplication.run(StylisteApplication.class, args);
    }
}

