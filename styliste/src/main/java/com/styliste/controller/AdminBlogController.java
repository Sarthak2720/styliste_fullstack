/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  com.styliste.controller.AdminBlogController
 *  com.styliste.dto.BlogPostDTO
 *  com.styliste.dto.BlogPostListDTO
 *  com.styliste.dto.BlogPostRequest
 *  com.styliste.dto.BlogStatusRequest
 *  com.styliste.entity.User
 *  com.styliste.exception.ResourceNotFoundException
 *  com.styliste.repository.UserRepository
 *  com.styliste.service.BlogService
 *  org.springframework.beans.factory.annotation.Autowired
 *  org.springframework.http.HttpStatus
 *  org.springframework.http.HttpStatusCode
 *  org.springframework.http.ResponseEntity
 *  org.springframework.security.access.prepost.PreAuthorize
 *  org.springframework.security.core.Authentication
 *  org.springframework.web.bind.annotation.DeleteMapping
 *  org.springframework.web.bind.annotation.GetMapping
 *  org.springframework.web.bind.annotation.PatchMapping
 *  org.springframework.web.bind.annotation.PathVariable
 *  org.springframework.web.bind.annotation.PostMapping
 *  org.springframework.web.bind.annotation.PutMapping
 *  org.springframework.web.bind.annotation.RequestBody
 *  org.springframework.web.bind.annotation.RequestMapping
 *  org.springframework.web.bind.annotation.RequestParam
 *  org.springframework.web.bind.annotation.RestController
 *  org.springframework.web.multipart.MultipartFile
 */
package com.styliste.controller;

import com.styliste.dto.BlogPostDTO;
import com.styliste.dto.BlogPostListDTO;
import com.styliste.dto.BlogPostRequest;
import com.styliste.dto.BlogStatusRequest;
import com.styliste.entity.User;
import com.styliste.exception.ResourceNotFoundException;
import com.styliste.repository.UserRepository;
import com.styliste.service.BlogService;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping(value={"/api/admin/blogs"})
@PreAuthorize(value="hasRole('ADMIN')")
public class AdminBlogController {
    @Autowired
    private BlogService blogService;
    @Autowired
    private UserRepository userRepository;

    @PostMapping(value={"/upload-image"}, consumes={"multipart/form-data"})
    public ResponseEntity<Map<String, String>> uploadImage(@RequestParam(value="file") MultipartFile file) {
        String url = this.blogService.uploadBlogImage(file);
        return ResponseEntity.ok(Map.of("url", url));
    }

    @PostMapping
    public ResponseEntity<BlogPostDTO> createBlog(@RequestBody BlogPostRequest request, Authentication authentication) {
        Long adminId = this.extractUserId(authentication);
        BlogPostDTO dto = this.blogService.createBlog(adminId, request);
        return ResponseEntity.status((HttpStatusCode)HttpStatus.CREATED).body(dto);
    }

    @PutMapping(value={"/{id}"})
    public ResponseEntity<BlogPostDTO> updateBlog(@PathVariable Long id, @RequestBody BlogPostRequest request) {
        return ResponseEntity.ok(this.blogService.updateBlog(id, request));
    }

    @DeleteMapping(value={"/{id}"})
    public ResponseEntity<Void> deleteBlog(@PathVariable Long id) {
        this.blogService.deleteBlog(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<BlogPostListDTO>> getAllBlogs() {
        return ResponseEntity.ok(this.blogService.getAllBlogsAdmin());
    }

    @GetMapping(value={"/{id}"})
    public ResponseEntity<BlogPostDTO> getBlogById(@PathVariable Long id) {
        return ResponseEntity.ok(this.blogService.getBlogByIdAdmin(id));
    }

    @PatchMapping(value={"/{id}/status"})
    public ResponseEntity<BlogPostDTO> updateStatus(@PathVariable Long id, @RequestBody BlogStatusRequest request) {
        return ResponseEntity.ok(this.blogService.updateBlogStatus(id, request.getStatus()));
    }

    private Long extractUserId(Authentication authentication) {
        String email = authentication.getName();
        User user = (User)this.userRepository.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return user.getId();
    }
}

