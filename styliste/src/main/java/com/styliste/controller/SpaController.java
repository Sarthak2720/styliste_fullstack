package com.styliste.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class SpaController {

    @RequestMapping(value = {
        "/login", "/login/**", "/signup", "/signup/**", "/cart", "/cart/**", "/wishlist", "/wishlist/**", "/checkout", "/checkout/**", "/profile", "/profile/**",
        "/measurements/**", "/orders/**", "/shop/**", "/admin/**", "/dashboard/**", "/virtual-try-on/**",
        "/about/**", "/services", "/contact/**", "/testimonials/**", "/blog/**",
        "/privacy-policy", "/terms-of-service", "/refund-policy", "/sizeGuide",
        "/shipping", "/returns", "/sustainability"
    })
    public String forward() {
        return "forward:/index.html";
    }
}
