package com.styliste.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * Filter to enforce 301 Permanent Redirect from WWW to Non-WWW URLs
 * (e.g., https://www.styliste-couturier.com/... -> https://styliste-couturier.com/...)
 * to prevent duplicate content SEO issues.
 */
@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class WwwRedirectFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String host = request.getHeader("X-Forwarded-Host");
        if (host == null || host.isBlank()) {
            host = request.getHeader("Host");
        }
        if (host == null || host.isBlank()) {
            host = request.getServerName();
        }

        if (host != null && host.toLowerCase().startsWith("www.")) {
            // Strip "www." from the host
            String nonWwwHost = host.substring(4);

            // Determine scheme / protocol (respect reverse proxy headers)
            String proto = request.getHeader("X-Forwarded-Proto");
            if (proto == null || proto.isBlank()) {
                proto = request.getScheme();
            }
            if (proto == null || proto.isBlank()) {
                proto = "https";
            }

            String uri = request.getRequestURI();
            String queryString = request.getQueryString();

            StringBuilder redirectUrl = new StringBuilder();
            redirectUrl.append(proto).append("://").append(nonWwwHost);
            if (uri != null && !uri.isEmpty()) {
                redirectUrl.append(uri);
            }
            if (queryString != null && !queryString.isBlank()) {
                redirectUrl.append("?").append(queryString);
            }

            response.setStatus(HttpServletResponse.SC_MOVED_PERMANENTLY); // HTTP 301 Permanent Redirect
            response.setHeader("Location", redirectUrl.toString());
            return;
        }

        filterChain.doFilter(request, response);
    }
}
