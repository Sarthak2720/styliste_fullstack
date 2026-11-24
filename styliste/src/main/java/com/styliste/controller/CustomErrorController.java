package com.styliste.controller;

import jakarta.annotation.PostConstruct;
import jakarta.servlet.RequestDispatcher;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.util.StreamUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

/**
 * Controller to handle broken, non-existent, and unavailable URLs.
 * Serves the React SPA index.html with HTTP status 404 Not Found so that:
 * 1. SEO search engine crawlers (Googlebot, Screaming Frog) detect real HTTP 404 status.
 * 2. Visitors see the branded luxury 404 Page (NotFoundPage.tsx) rendered by React.
 * 3. Non-existent API endpoints under /api/ return structured JSON with status 404.
 */
@Controller
public class CustomErrorController implements ErrorController {

    private static final Logger log = LoggerFactory.getLogger(CustomErrorController.class);
    private String cachedIndexHtml = "";

    @PostConstruct
    public void init() {
        loadIndexHtml();
    }

    private synchronized String loadIndexHtml() {
        try {
            Resource resource = new ClassPathResource("static/index.html");
            if (resource.exists()) {
                cachedIndexHtml = StreamUtils.copyToString(resource.getInputStream(), StandardCharsets.UTF_8);
            }
        } catch (IOException e) {
            log.error("Failed to load static/index.html for custom error page", e);
        }
        return cachedIndexHtml;
    }

    /**
     * Direct GET /404 request mapping. Returns index.html with HTTP status 404.
     */
    @GetMapping(value = {"/404", "/404/**"}, produces = MediaType.TEXT_HTML_VALUE)
    public ResponseEntity<String> handleDirect404() {
        String html = cachedIndexHtml.isEmpty() ? loadIndexHtml() : cachedIndexHtml;
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .contentType(MediaType.TEXT_HTML)
                .body(html);
    }

    /**
     * Handles Spring Boot /error dispatch for broken or unavailable URLs.
     */
    @RequestMapping("/error")
    public Object handleError(HttpServletRequest request) {
        Object statusAttr = request.getAttribute(RequestDispatcher.ERROR_STATUS_CODE);
        int statusCode = HttpStatus.NOT_FOUND.value();
        if (statusAttr != null) {
            try {
                statusCode = Integer.parseInt(statusAttr.toString());
            } catch (NumberFormatException ignored) {}
        }

        String requestUri = (String) request.getAttribute(RequestDispatcher.ERROR_REQUEST_URI);
        if (requestUri == null) {
            requestUri = request.getRequestURI();
        }

        // For API requests, return JSON error response
        if (requestUri != null && requestUri.startsWith("/api/")) {
            Map<String, Object> errorBody = new HashMap<>();
            errorBody.put("status", statusCode);
            errorBody.put("error", statusCode == 404 ? "Not Found" : "Error");
            errorBody.put("message", "API endpoint not found: " + requestUri);
            return ResponseEntity.status(statusCode).body(errorBody);
        }

        // For frontend web requests, return index.html with the error HTTP status code (e.g. 404).
        String html = cachedIndexHtml.isEmpty() ? loadIndexHtml() : cachedIndexHtml;
        return ResponseEntity.status(statusCode)
                .contentType(MediaType.TEXT_HTML)
                .body(html);
    }
}
