/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  com.fasterxml.jackson.core.JsonProcessingException
 *  com.fasterxml.jackson.core.type.TypeReference
 *  com.fasterxml.jackson.databind.ObjectMapper
 *  com.styliste.dto.BlogPostDTO
 *  com.styliste.dto.BlogPostListDTO
 *  com.styliste.dto.BlogPostRequest
 *  com.styliste.entity.BlogPost
 *  com.styliste.entity.BlogStatus
 *  com.styliste.entity.User
 *  com.styliste.exception.BadRequestException
 *  com.styliste.exception.ResourceNotFoundException
 *  com.styliste.repository.BlogPostRepository
 *  com.styliste.repository.UserRepository
 *  com.styliste.service.BlogService
 *  com.styliste.service.FileStorageService
 *  org.slf4j.Logger
 *  org.slf4j.LoggerFactory
 *  org.springframework.beans.factory.annotation.Autowired
 *  org.springframework.data.domain.Page
 *  org.springframework.data.domain.PageRequest
 *  org.springframework.data.domain.Pageable
 *  org.springframework.data.domain.Sort
 *  org.springframework.data.domain.Sort$Direction
 *  org.springframework.stereotype.Service
 *  org.springframework.transaction.annotation.Transactional
 *  org.springframework.web.multipart.MultipartFile
 */
package com.styliste.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.styliste.dto.BlogPostDTO;
import com.styliste.dto.BlogPostListDTO;
import com.styliste.dto.BlogPostRequest;
import com.styliste.entity.BlogPost;
import com.styliste.entity.BlogStatus;
import com.styliste.entity.User;
import com.styliste.exception.BadRequestException;
import com.styliste.exception.ResourceNotFoundException;
import com.styliste.repository.BlogPostRepository;
import com.styliste.repository.UserRepository;
import com.styliste.service.FileStorageService;
import java.text.Normalizer;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
@Transactional
public class BlogService {
    private static final Logger log = LoggerFactory.getLogger(BlogService.class);
    @Autowired
    private BlogPostRepository blogRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private FileStorageService fileStorageService;
    private final ObjectMapper objectMapper = new ObjectMapper();
    private static final Set<String> ALLOWED_IMAGE_TYPES = Set.of("image/jpeg", "image/png", "image/webp", "image/gif");
    private static final long MAX_IMAGE_SIZE = 0x500000L;
    private static final Pattern NON_LATIN = Pattern.compile("[^\\w-]");
    private static final Pattern WHITESPACE = Pattern.compile("[\\s]+");

    public BlogPostDTO createBlog(Long adminUserId, BlogPostRequest request) {
        this.validateRequest(request);
        User admin = (User)this.userRepository.findById(adminUserId).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        String slug = this.generateUniqueSlug(request.getTitle());
        String sectionsJson = this.serializeSections(request.getSections());
        BlogStatus status = this.parseStatus(request.getStatus());
        BlogPost post = BlogPost.builder().title(request.getTitle().trim()).slug(slug).category(request.getCategory().trim()).excerpt(request.getExcerpt().trim()).coverUrl(request.getCoverUrl()).author(request.getAuthor().trim()).readTime(request.getReadTime()).status(status).sections(sectionsJson).createdBy(admin).build();
        post = (BlogPost)this.blogRepository.save(post);
        log.info("Blog post {} created by admin {}", post.getId(), adminUserId);
        return this.mapToDTO(post);
    }

    public BlogPostDTO updateBlog(Long id, BlogPostRequest request) {
        boolean titleChanged;
        this.validateRequest(request);
        BlogPost post = (BlogPost)this.blogRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Blog post not found"));
        boolean bl = titleChanged = !post.getTitle().equals(request.getTitle().trim());
        if (titleChanged) {
            post.setSlug(this.generateUniqueSlug(request.getTitle()));
        }
        post.setTitle(request.getTitle().trim());
        post.setCategory(request.getCategory().trim());
        post.setExcerpt(request.getExcerpt().trim());
        post.setCoverUrl(request.getCoverUrl());
        post.setAuthor(request.getAuthor().trim());
        post.setReadTime(request.getReadTime());
        post.setStatus(this.parseStatus(request.getStatus()));
        post.setSections(this.serializeSections(request.getSections()));
        post = (BlogPost)this.blogRepository.save(post);
        log.info("Blog post {} updated", id);
        return this.mapToDTO(post);
    }

    public void deleteBlog(Long id) {
        BlogPost post = (BlogPost)this.blogRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Blog post not found"));
        this.blogRepository.delete(post);
        log.info("Blog post {} deleted", id);
    }

    @Transactional(readOnly=true)
    public List<BlogPostListDTO> getAllBlogsAdmin() {
        return this.blogRepository.findAllByOrderByUpdatedAtDesc().stream().map(arg_0 -> this.mapToListDTO(arg_0)).collect(Collectors.toList());
    }

    @Transactional(readOnly=true)
    public BlogPostDTO getBlogByIdAdmin(Long id) {
        BlogPost post = (BlogPost)this.blogRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Blog post not found"));
        return this.mapToDTO(post);
    }

    public BlogPostDTO updateBlogStatus(Long id, String statusStr) {
        BlogPost post = (BlogPost)this.blogRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Blog post not found"));
        BlogStatus status = this.parseStatus(statusStr);
        post.setStatus(status);
        post = (BlogPost)this.blogRepository.save(post);
        log.info("Blog post {} status changed to {}", id, status);
        return this.mapToDTO(post);
    }

    @Transactional(readOnly=true)
    public Page<BlogPostListDTO> getPublishedBlogs(String category, int page, int size) {
        PageRequest pageable = PageRequest.of((int)page, (int)size, (Sort)Sort.by((Sort.Direction)Sort.Direction.DESC, (String[])new String[]{"createdAt"}));
        Page<com.styliste.entity.BlogPost> posts = category != null && !category.isBlank() ? this.blogRepository.findByStatusAndCategory(BlogStatus.PUBLISHED, category, (Pageable)pageable) : this.blogRepository.findByStatus(BlogStatus.PUBLISHED, (Pageable)pageable);
        return posts.map(arg_0 -> this.mapToPublicListDTO(arg_0));
    }

    @Transactional(readOnly=true)
    public BlogPostDTO getPublishedBlogBySlug(String slug) {
        BlogPost post = (BlogPost)this.blogRepository.findBySlugAndStatus(slug, BlogStatus.PUBLISHED).orElseThrow(() -> new ResourceNotFoundException("Blog post not found"));
        return this.mapToPublicDTO(post);
    }

    @Transactional(readOnly=true)
    public List<String> getPublishedCategories() {
        return this.blogRepository.findDistinctCategoriesPublished();
    }

    public String uploadBlogImage(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("File is required");
        }
        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_IMAGE_TYPES.contains(contentType.toLowerCase())) {
            throw new BadRequestException("Invalid image type. Allowed: JPEG, PNG, WebP, GIF");
        }
        if (file.getSize() > 0x500000L) {
            throw new BadRequestException("File size exceeds 5 MB limit");
        }
        return this.fileStorageService.saveFile(file, "image");
    }

    private String generateSlug(String title) {
        String normalized = Normalizer.normalize(title, Normalizer.Form.NFD);
        String slug = WHITESPACE.matcher(normalized).replaceAll("-");
        slug = NON_LATIN.matcher(slug).replaceAll("");
        return slug.toLowerCase(Locale.ENGLISH).replaceAll("-{2,}", "-").replaceAll("^-|-$", "");
    }

    private String generateUniqueSlug(String title) {
        String baseSlug = this.generateSlug(title);
        if (baseSlug.isBlank()) {
            baseSlug = "post";
        }
        String candidate = baseSlug;
        int counter = 2;
        while (this.blogRepository.existsBySlug(candidate)) {
            candidate = baseSlug + "-" + counter;
            ++counter;
        }
        return candidate;
    }

    private BlogPostDTO mapToDTO(BlogPost p) {
        return BlogPostDTO.builder().id(p.getId()).title(p.getTitle()).slug(p.getSlug()).category(p.getCategory()).excerpt(p.getExcerpt()).coverUrl(p.getCoverUrl()).author(p.getAuthor()).readTime(p.getReadTime()).status(p.getStatus().name()).sections(this.deserializeSections(p.getSections())).createdAt(p.getCreatedAt()).updatedAt(p.getUpdatedAt()).build();
    }

    private BlogPostDTO mapToPublicDTO(BlogPost p) {
        return BlogPostDTO.builder().id(p.getId()).title(p.getTitle()).slug(p.getSlug()).category(p.getCategory()).excerpt(p.getExcerpt()).coverUrl(p.getCoverUrl()).author(p.getAuthor()).readTime(p.getReadTime()).sections(this.deserializeSections(p.getSections())).createdAt(p.getCreatedAt()).build();
    }

    private BlogPostListDTO mapToListDTO(BlogPost p) {
        return BlogPostListDTO.builder().id(p.getId()).title(p.getTitle()).slug(p.getSlug()).category(p.getCategory()).excerpt(p.getExcerpt()).coverUrl(p.getCoverUrl()).author(p.getAuthor()).readTime(p.getReadTime()).status(p.getStatus().name()).sectionsCount(this.countSections(p.getSections())).createdAt(p.getCreatedAt()).updatedAt(p.getUpdatedAt()).build();
    }

    private BlogPostListDTO mapToPublicListDTO(BlogPost p) {
        return BlogPostListDTO.builder().id(p.getId()).title(p.getTitle()).slug(p.getSlug()).category(p.getCategory()).excerpt(p.getExcerpt()).coverUrl(p.getCoverUrl()).author(p.getAuthor()).readTime(p.getReadTime()).createdAt(p.getCreatedAt()).build();
    }

    private void validateRequest(BlogPostRequest r) {
        if (r.getTitle() == null || r.getTitle().isBlank()) {
            throw new BadRequestException("Title is required");
        }
        if (r.getCategory() == null || r.getCategory().isBlank()) {
            throw new BadRequestException("Category is required");
        }
        if (r.getExcerpt() == null || r.getExcerpt().isBlank()) {
            throw new BadRequestException("Excerpt is required");
        }
        if (r.getAuthor() == null || r.getAuthor().isBlank()) {
            throw new BadRequestException("Author is required");
        }
        if (r.getSections() == null || r.getSections().isEmpty()) {
            throw new BadRequestException("At least one section is required");
        }
    }

    private BlogStatus parseStatus(String s) {
        if (s == null || s.isBlank()) {
            return BlogStatus.DRAFT;
        }
        try {
            return BlogStatus.valueOf((String)s.trim().toUpperCase());
        }
        catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid status: " + s + ". Must be DRAFT or PUBLISHED");
        }
    }

    private String serializeSections(List<Map<String, Object>> sections) {
        try {
            return this.objectMapper.writeValueAsString(sections);
        }
        catch (JsonProcessingException e) {
            log.error("Failed to serialize sections", (Throwable)e);
            throw new BadRequestException("Invalid sections data");
        }
    }

    private List<Map<String, Object>> deserializeSections(String json) {
        if (json == null || json.isBlank()) {
            return List.of();
        }
        try {
            return (List)this.objectMapper.readValue(json, new TypeReference<List<Map<String, Object>>>() {});
        }
        catch (JsonProcessingException e) {
            log.error("Failed to deserialize sections", (Throwable)e);
            return List.of();
        }
    }

    private int countSections(String json) {
        if (json == null || json.isBlank()) {
            return 0;
        }
        try {
            List list = (List)this.objectMapper.readValue(json, List.class);
            return list.size();
        }
        catch (JsonProcessingException e) {
            return 0;
        }
    }
}

