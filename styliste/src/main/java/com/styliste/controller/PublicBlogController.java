/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  com.styliste.controller.PublicBlogController
 *  com.styliste.dto.BlogPostDTO
 *  com.styliste.dto.BlogPostListDTO
 *  com.styliste.service.BlogService
 *  org.springframework.beans.factory.annotation.Autowired
 *  org.springframework.data.domain.Page
 *  org.springframework.http.ResponseEntity
 *  org.springframework.web.bind.annotation.GetMapping
 *  org.springframework.web.bind.annotation.PathVariable
 *  org.springframework.web.bind.annotation.RequestMapping
 *  org.springframework.web.bind.annotation.RequestParam
 *  org.springframework.web.bind.annotation.RestController
 */
package com.styliste.controller;

import com.styliste.dto.BlogPostDTO;
import com.styliste.dto.BlogPostListDTO;
import com.styliste.service.BlogService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value={"/api/blogs"})
public class PublicBlogController {
    @Autowired
    private BlogService blogService;

    @GetMapping
    public ResponseEntity<Page<BlogPostListDTO>> getPublishedBlogs(@RequestParam(required=false) String category, @RequestParam(defaultValue="0") int page, @RequestParam(defaultValue="10") int size) {
        return ResponseEntity.ok(this.blogService.getPublishedBlogs(category, page, size));
    }

    @GetMapping(value={"/categories"})
    public ResponseEntity<List<String>> getCategories() {
        return ResponseEntity.ok(this.blogService.getPublishedCategories());
    }

    @GetMapping(value={"/{slug}"})
    public ResponseEntity<BlogPostDTO> getBlogBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(this.blogService.getPublishedBlogBySlug(slug));
    }
}

