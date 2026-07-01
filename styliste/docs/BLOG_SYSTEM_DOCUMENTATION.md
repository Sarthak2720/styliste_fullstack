# Blog System Documentation

This document provides a comprehensive technical overview of the Blog functionality implemented in the E-commerce Backend. Use this guide to understand the architecture, API, and implementation details, or to replicate this system in another project.

---

## 1. Overview

The Blog System is a robust, modular feature designed to manage and display content-rich articles. It supports dynamic content layouts through a "sections" based approach, automatic SEO-friendly slug generation, image handling, and categorical filtering.

## 2. Core Features

-   **Dynamic Content Layout**: Instead of a single HTML blob, content is stored as a list of JSON sections (headings, paragraphs, images, quotes, etc.).
-   **SEO Optimization**: Automatic generation of unique slugs from titles.
-   **Media Integration**: Built-in image upload and storage system.
-   **Administrative Control**: Full CRUD operations, status management (Draft/Published), and dashboard-ready list views.
-   **Public Access**: Paginated listing, category filtering, and slug-based retrieval.

## 3. Technology Stack

-   **Framework**: Spring Boot 3.x
-   **Database**: MySQL / PostgreSQL (JPA/Hibernate)
-   **Content Format**: JSON (Stored as `MEDIUMTEXT` in MySQL)
-   **Media Storage**: Local File System (Scalable to S3/Cloudinary)

---

## 4. Database Design

### `blog_posts` Table

| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | BIGINT (PK) | Primary Key, Auto-increment |
| `title` | VARCHAR(500) | SEO title of the post |
| `slug` | VARCHAR(500) | Unique URL identifier |
| `category` | VARCHAR(100) | Post category (e.g., Fashion, Lifestyle) |
| `excerpt` | TEXT | Short summary for list views |
| `cover_url` | TEXT | URL of the main featured image |
| `author` | VARCHAR(200) | Name of the writer/author |
| `read_time` | VARCHAR(50) | Estimated reading time (e.g., "5 min read") |
| `status` | ENUM | `DRAFT` or `PUBLISHED` |
| `sections` | MEDIUMTEXT | JSON array of content blocks |
| `created_by` | BIGINT (FK) | Reference to the `users` table |
| `created_at` | TIMESTAMP | Creation timestamp |
| `updated_at` | TIMESTAMP | Last modification timestamp |

**Indexes:**
-   Unique index on `slug`.
-   Performance indexes on `status`, `category`, and `created_at`.

---

## 5. Domain Model & DTOs

### BlogPost Entity
The core entity uses JPA's `@PrePersist` and `@PreUpdate` to manage timestamps and default status.

### Content Section Structure
The `sections` field is a `List<Map<String, Object>>`. A typical section looks like:
```json
{
  "type": "paragraph",
  "content": "This is the text of the section."
}
```
Possible types: `heading`, `paragraph`, `image`, `quote`, `list`, `code`.

---

## 6. API Specification

### A. Admin Endpoints (`/api/admin/blogs`)
*Requires Admin Role*

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/` | List all blogs (ID, Title, Status, etc.) |
| `GET` | `/{id}` | Get full blog details for editing |
| `POST` | `/` | Create a new blog post |
| `PUT` | `/{id}` | Update an existing blog post |
| `PATCH` | `/{id}/status` | Toggle status between `DRAFT` and `PUBLISHED` |
| `DELETE`| `/{id}` | Permanently delete a post |
| `POST` | `/upload-image`| Upload image and get URL (`multipart/form-data`) |

### B. Public Endpoints (`/api/blogs`)
*No Auth Required*

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/?category={c}&page={p}&size={s}` | List published blogs (Paginated) |
| `GET` | `/{slug}` | Get published blog by its slug |
| `GET` | `/categories` | Get list of all categories used in published posts |

---

## 7. Key Implementation Details

### Unique Slug Generation
The system automatically generates slugs from the title. If a slug already exists, it appends a counter (e.g., `my-post`, `my-post-2`).

```java
private String generateUniqueSlug(String title) {
    String baseSlug = generateSlug(title); // Normalizes title
    String candidate = baseSlug;
    int counter = 2;
    while (blogRepository.existsBySlug(candidate)) {
        candidate = baseSlug + "-" + counter++;
    }
    return candidate;
}
```

### JSON Content Handling
The content sections are serialized into JSON for storage and deserialized for API responses using Jackson's `ObjectMapper`.

```java
// Saving
post.setSections(objectMapper.writeValueAsString(request.getSections()));

// Retrieving
List<Map<String, Object>> sections = objectMapper.readValue(json, new TypeReference<>() {});
```

### Image Upload Logic
Images are sanitized (filename cleanup) and stored in a configurable directory. The service returns a relative URL (e.g., `/uploads/images/...`).

---

## 8. Implementation Guide (Replicating the System)

Follow these steps to implement this in a new project:

1.  **Dependencies**: Ensure `jackson-databind`, `spring-boot-starter-data-jpa`, and `lombok` are in your `pom.xml`.
2.  **Entity Setup**: Copy `BlogPost.java` and `BlogStatus.java`. Configure the table name and indexes.
3.  **Repository**: Create `BlogPostRepository` extending `JpaRepository` with custom methods for `slug` and `status` lookups.
4.  **Service Layer**:
    *   Implement `BlogService` to handle CRUD.
    *   Add the `generateUniqueSlug` logic.
    *   Add JSON serialization/deserialization logic for sections.
5.  **DTOs**: Create `BlogPostRequest`, `BlogPostListDTO`, and `BlogPostDTO` to decouple API from Database models.
6.  **Controllers**:
    *   Create `AdminBlogController` with security constraints.
    *   Create `PublicBlogController` for client access.
7.  **Storage**: Implement a `FileStorageService` (like the one provided) to handle image uploads. Configure `file.upload-dir` in `application.properties`.
8.  **Security**: Update your `SecurityConfiguration` to permit access to `/api/blogs/**` and `/uploads/**`, while protecting `/api/admin/**`.

---

## 9. Agentic AI Prompting Guide (For Perfect Recreation)

If you are using an Agentic AI to build the new project, use the following "Component Map" to ensure the UI matches the premium design requirements.

### UI/UX Component Mapping (Reference: Blog Detail Page)

| UI Component | Backend Mapping | Implementation Note |
| :--- | :--- | :--- |
| **Hero Header** | `title`, `author`, `createdAt` | High-impact typography with meta-info. |
| **Featured Image** | `coverUrl` | Large banner image with glassmorphism or shadow. |
| **Body Content** | `sections` (JSON) | Iterate through the array and render components based on `type` (Heading, Paragraph, Image). |
| **Sidebar: Latest Posts**| `GET /api/blogs?size=5` | List items with titles and dates. |
| **Sidebar: Newsletter** | *New Feature Needed* | Add a `NewsletterService` to handle subscriptions. |
| **Bottom: Related Posts** | `GET /api/blogs?category={current}` | "You might also like" section filtering by the same category. |
| **Author Bio Box** | `author` (String) | (Enhanced) Map to a `User` profile for bio and social links. |
| **Comment System** | *New Feature Needed* | Add `Comment` entity with `@ManyToOne` relationship to `BlogPost`. |

### Recommended Backend Extensions
To achieve the "Perfect" version seen in the screenshot, recommend the following to your AI Agent:

1.  **Detailed Author Entity**: Instead of a simple String, use a `User` or `Profile` entity to store bios, LinkedIn URLs, and profile pictures.
2.  **Comment Engine**: Implement a nested comment system (User, Text, Timestamp).
3.  **Newsletter Integration**: A simple API to collect emails and store them in a `subscriptions` table.
4.  **Reading Time Logic**: A utility that calculates `readTime` based on the word count of the `sections` content before saving.

### Ready-to-Use Agent Prompt
If you start a new chat with an AI Agent, you can paste this:
> "I want to build a premium Blog System. I have a detailed technical specification. Please read the attached `BLOG_SYSTEM_DOCUMENTATION.md` and implement the backend (Spring Boot) and a modern, high-end frontend (React/Next.js) that matches the UI mapping described in Section 9. Ensure the content sections are rendered dynamically."

---

## 10. Core Component Reference (Source Code)

### A. BlogStatus.java
```java
package com.styliste.entity;

public enum BlogStatus {
    DRAFT,
    PUBLISHED
}
```

### B. BlogPost.java
```java
package com.styliste.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "blog_posts", indexes = {
        @Index(name = "idx_blog_slug", columnList = "slug", unique = true),
        @Index(name = "idx_blog_status", columnList = "status"),
        @Index(name = "idx_blog_category", columnList = "category"),
        @Index(name = "idx_blog_created", columnList = "created_at")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BlogPost {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, columnDefinition = "VARCHAR(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci")
    private String title;

    @Column(nullable = false, length = 500, unique = true)
    private String slug;

    @Column(nullable = false, columnDefinition = "VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci")
    private String category;

    @Column(nullable = false, columnDefinition = "TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci")
    private String excerpt;

    @Column(name = "cover_url", columnDefinition = "TEXT")
    private String coverUrl;

    @Column(nullable = false, columnDefinition = "VARCHAR(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci")
    private String author;

    @Column(name = "read_time", length = 50)
    private String readTime;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private BlogStatus status;

    @Column(nullable = false, columnDefinition = "MEDIUMTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci")
    private String sections;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        LocalDateTime now = LocalDateTime.now();
        this.createdAt = now;
        this.updatedAt = now;
        if (this.status == null) this.status = BlogStatus.DRAFT;
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
```

### C. BlogPostRepository.java
```java
package com.styliste.repository;

import com.styliste.entity.BlogPost;
import com.styliste.entity.BlogStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;
import java.util.Optional;

public interface BlogPostRepository extends JpaRepository<BlogPost, Long> {
    List<BlogPost> findAllByOrderByUpdatedAtDesc();
    Page<BlogPost> findByStatus(BlogStatus status, Pageable pageable);
    Page<BlogPost> findByStatusAndCategory(BlogStatus status, String category, Pageable pageable);
    Optional<BlogPost> findBySlugAndStatus(String slug, BlogStatus status);
    boolean existsBySlug(String slug);

    @Query("SELECT DISTINCT b.category FROM BlogPost b WHERE b.status = 'PUBLISHED' ORDER BY b.category")
    List<String> findDistinctCategoriesPublished();
}
```

### D. DTOs (Data Transfer Objects)

**BlogPostRequest.java**
```java
package com.styliste.dto;

import lombok.*;
import java.util.List;
import java.util.Map;

@Data
public class BlogPostRequest {
    private String title;
    private String category;
    private String excerpt;
    private String coverUrl;
    private String author;
    private String readTime;
    private String status;
    private List<Map<String, Object>> sections;
}
```

**BlogPostListDTO.java**
```java
package com.styliste.dto;

import lombok.*;
import java.time.LocalDateTime;

@Data
@Builder
public class BlogPostListDTO {
    private Long id;
    private String title;
    private String slug;
    private String category;
    private String excerpt;
    private String coverUrl;
    private String author;
    private String readTime;
    private String status;
    private int sectionsCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
```

### E. Sample API Request (POST /api/admin/blogs)
```json
{
  "title": "The Future of Sustainable Fashion",
  "category": "Sustainability",
  "excerpt": "Exploring how eco-friendly materials are changing the industry.",
  "coverUrl": "/uploads/images/cover.jpg",
  "author": "Jane Doe",
  "readTime": "6 min read",
  "status": "PUBLISHED",
  "sections": [
    {
      "type": "heading",
      "content": "Why Sustainability Matters"
    },
    {
      "type": "paragraph",
      "content": "Modern fashion is shifting towards a more conscious approach..."
    },
    {
      "type": "image",
      "url": "/uploads/images/blog1.jpg",
      "caption": "Eco-friendly fabrics"
    }
  ]
}
```

---
