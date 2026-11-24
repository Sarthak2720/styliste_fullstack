package com.styliste.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * Controller to forward all valid frontend React SPA routes to /index.html with HTTP status 200 OK.
 * Broken, unavailable, or non-existent routes are intentionally NOT mapped here so they fall
 * through to CustomErrorController and return HTTP status 404 Not Found.
 */
@Controller
public class SpaController {

    @RequestMapping(value = {
        "/home",
        "/login", "/login/**",
        "/signup", "/signup/**",
        "/forgot-password", "/forgot-password/**",
        "/cart", "/cart/**",
        "/checkout", "/checkout/**",
        "/payment-status", "/payment-status/**",
        "/profile", "/profile/**",
        "/wishlist", "/wishlist/**",
        "/measurements", "/measurements/**",
        "/orders", "/orders/**",
        "/shop", "/shop/**",
        "/products", "/products/**",
        "/about", "/about/**", "/about-us", "/about-us/**",
        "/contact", "/contact/**", "/contact-us", "/contact-us/**",
        "/appointment", "/appointment/**",
        "/size-guide", "/size-guide/**", "/sizeGuide", "/sizeGuide/**",
        "/services", "/services/**",
        "/testimonials", "/testimonials/**",
        "/blog", "/blog/**",
        "/privacy-policy", "/terms-of-service", "/refund-policy",
        "/shipping", "/returns", "/sustainability",
        "/virtual-try-on", "/virtual-try-on/**",
        "/admin", "/admin/**",
        "/dashboard", "/dashboard/**"
    })
    public String forward() {
        return "forward:/index.html";
    }
}
