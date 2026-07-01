# Blog Management - Backend API Specification

## Overview

The admin panel has a fully-built blog editor on the frontend. Currently all blog data is stored in React state (in-memory). The backend needs REST APIs to persist blogs in the database. The frontend will be updated to call these APIs instead of using local state.

The frontend is a React + Vite app. The backend is Spring Boot (Java) with JWT authentication. All admin endpoints require `@PreAuthorize("hasRole('ADMIN')")`.

---

## Data Model

### Blog Post Entity

```
Table: blog_posts
```

| Column       | Type         | Constraints                          | Description                                        |
|-------------|-------------|---------------------------------------|-----------------------------------------------------|
| id          | BIGINT      | PRIMARY KEY, AUTO_INCREMENT           | Unique blog post ID                                 |
| title       | VARCHAR(500)| NOT NULL                              | Post title (plain text)                             |
| slug        | VARCHAR(500)| UNIQUE, NOT NULL                      | URL-friendly slug, auto-generated from title        |
| category    | VARCHAR(100)| NOT NULL                              | Category name (e.g. "Fashion Tips", "Bridal")       |
| excerpt     | TEXT        | NOT NULL                              | Short description (used in listing & OG description)|
| cover_url   | TEXT        |                                       | Cover image URL (uploaded via image upload endpoint) |
| author      | VARCHAR(200)| NOT NULL                              | Author display name                                 |
| read_time   | VARCHAR(50) |                                       | e.g. "5 min read"                                   |
| status      | VARCHAR(20) | NOT NULL, DEFAULT 'DRAFT'             | `DRAFT` or `PUBLISHED`                              |
| sections    | JSON / TEXT | NOT NULL                              | JSON array of section objects (see below)            |
| created_at  | TIMESTAMP   | NOT NULL, DEFAULT CURRENT_TIMESTAMP   |                                                     |
| updated_at  | TIMESTAMP   | NOT NULL, ON UPDATE CURRENT_TIMESTAMP |                                                     |
| created_by  | BIGINT      | FK → users(id)                        | Admin user who created it                           |

### Sections JSON Structure

The `sections` column stores a JSON array. Each element has:

```json
{
  "id": "abc1234",
  "type": "intro | heading | quote | takeaways | stats | imagetext | cards3 | imagecards | darkbox | steps | conclusion",
  "data": { ... }
}
```

#### Section Types and their `data` shapes:

**1. intro**
```json
{ "p1": "<p>HTML content</p>", "p2": "<p>Optional second paragraph</p>" }
```

**2. heading**
```json
{ "text": "<p>Section Heading HTML</p>" }
```

**3. quote**
```json
{ "text": "<p>Quote HTML</p>", "by": "<p>-- Attribution HTML</p>" }
```

**4. takeaways**
```json
{
  "heading": "<p>Key Takeaways</p>",
  "items": [
    { "title": "<p>Point title HTML</p>", "desc": "<p>Description HTML</p>" }
  ]
}
```

**5. stats**
```json
{
  "items": [
    { "val": "<p>100+</p>", "lbl": "<p>Metric label</p>" }
  ]
}
```

**6. imagetext**
```json
{
  "img": "https://...uploaded-image-url...",
  "alt": "Alt text (plain string)",
  "left": true,
  "text": "<p>Body copy HTML</p>"
}
```

**7. cards3**
```json
{
  "items": [
    { "val": "<p>20 t</p>", "lbl": "<p>Metric one</p>", "color": "sage" }
  ]
}
```
`color` is either `"sage"` or `"rose"`.

**8. imagecards**
```json
{
  "items": [
    { "img": "https://...url...", "heading": "<p>Card One</p>", "text": "<p>Description</p>" }
  ]
}
```

**9. darkbox**
```json
{
  "heading": "<p>Important Notes:</p>",
  "bullets": [
    { "text": "<p>Bullet point HTML</p>" }
  ]
}
```

**10. steps**
```json
{
  "heading": "<p>Step-by-Step Guide</p>",
  "items": [
    { "title": "<p>Step One</p>", "text": "<p>What to do HTML</p>" }
  ]
}
```

**11. conclusion**
```json
{ "heading": "<p>Conclusion</p>", "text": "<p>Wrap up HTML</p>" }
```

### Important notes about text values

- All text fields (except `alt`, `color`, `left`) contain **HTML strings** from a rich text editor (e.g. `<p>Hello <strong>world</strong></p>`).
- HTML may contain inline icon elements: `<span data-icon="scissors" data-icon-size="1.4em" data-icon-color="#B5505A"></span>`.
- The backend should store HTML as-is. Sanitization (DOMPurify) happens on the frontend at render time.
- Cover image and section images (`img` fields) are URLs pointing to uploaded files.

---

## Image Upload Endpoint

Images (cover + section images) are uploaded separately and the returned URL is stored in the blog JSON.

### POST `/api/admin/blogs/upload-image`

**Auth**: Admin JWT required  
**Content-Type**: `multipart/form-data`

| Field | Type | Required | Notes                              |
|-------|------|----------|------------------------------------|
| file  | File | yes      | JPEG, PNG, WebP, GIF. Max 5 MB.   |

**Response (200)**:
```json
{
  "url": "https://your-domain.com/uploads/blogs/abc123.jpg"
}
```

**Response (400)**:
```json
{ "message": "Invalid image type. Allowed: JPEG, PNG, WebP, GIF" }
```

**Response (413)**:
```json
{ "message": "File size exceeds 5 MB limit" }
```

Store images in a folder like `/uploads/blogs/` or on cloud storage (S3). Return the full public URL.

---

## Blog CRUD API Endpoints

All under `/api/admin/blogs`. All require `Authorization: Bearer <jwt>` with ADMIN role.

---

### 1. Create Blog

**POST** `/api/admin/blogs`

**Content-Type**: `application/json`

**Request Body**:
```json
{
  "title": "My Blog Post",
  "category": "Fashion Tips",
  "excerpt": "A short description...",
  "coverUrl": "https://...uploaded-cover-url...",
  "author": "Babita Dahal",
  "readTime": "5 min read",
  "status": "DRAFT",
  "sections": [
    {
      "id": "abc1234",
      "type": "intro",
      "data": {
        "p1": "<p>First paragraph.</p>",
        "p2": "<p>Second paragraph.</p>"
      }
    }
  ]
}
```

**Response (201 Created)**:
```json
{
  "id": 1,
  "title": "My Blog Post",
  "slug": "my-blog-post",
  "category": "Fashion Tips",
  "excerpt": "A short description...",
  "coverUrl": "https://...uploaded-cover-url...",
  "author": "Babita Dahal",
  "readTime": "5 min read",
  "status": "DRAFT",
  "sections": [...],
  "createdAt": "2026-03-04T10:30:00",
  "updatedAt": "2026-03-04T10:30:00"
}
```

**Slug generation**: Auto-generate from title. Lowercase, replace spaces with hyphens, remove special chars, ensure uniqueness (append `-2`, `-3` etc. if duplicate).

---

### 2. Update Blog

**PUT** `/api/admin/blogs/{id}`

**Content-Type**: `application/json`

**Request Body**: Same shape as create (all fields). The `slug` is regenerated if `title` changes, or you can keep the original slug to preserve URLs.

**Response (200)**: Full blog object (same as create response).

**Response (404)**:
```json
{ "message": "Blog post not found" }
```

---

### 3. Delete Blog

**DELETE** `/api/admin/blogs/{id}`

**Response (204)**: No content.

**Response (404)**:
```json
{ "message": "Blog post not found" }
```

---

### 4. Get All Blogs (Admin)

**GET** `/api/admin/blogs`

Returns all blog posts (drafts + published), ordered by `updatedAt` desc.

**Response (200)**:
```json
[
  {
    "id": 1,
    "title": "My Blog Post",
    "slug": "my-blog-post",
    "category": "Fashion Tips",
    "excerpt": "A short description...",
    "coverUrl": "https://...",
    "author": "Babita Dahal",
    "readTime": "5 min read",
    "status": "DRAFT",
    "sectionsCount": 5,
    "createdAt": "2026-03-04T10:30:00",
    "updatedAt": "2026-03-04T10:30:00"
  }
]
```

Note: The listing response does NOT include the full `sections` array (too large). It includes `sectionsCount` instead. Full sections come from the detail endpoint.

---

### 5. Get Blog by ID (Admin)

**GET** `/api/admin/blogs/{id}`

Returns the full blog post including `sections`.

**Response (200)**: Full blog object (same as create response).

---

### 6. Publish / Unpublish

**PATCH** `/api/admin/blogs/{id}/status`

**Request Body**:
```json
{ "status": "PUBLISHED" }
```
or
```json
{ "status": "DRAFT" }
```

**Response (200)**: Full blog object with updated status.

---

## Public Blog Endpoints (No Auth)

These are for the public-facing blog pages. Only published blogs are returned.

### 7. Get Published Blogs (Public)

**GET** `/api/blogs`

**Query params** (all optional):
| Param    | Type   | Description                           |
|----------|--------|---------------------------------------|
| category | string | Filter by category name               |
| page     | int    | Page number (default 0)               |
| size     | int    | Page size (default 10)                |

**Response (200)**:
```json
{
  "content": [
    {
      "id": 1,
      "title": "My Blog Post",
      "slug": "my-blog-post",
      "category": "Fashion Tips",
      "excerpt": "A short description...",
      "coverUrl": "https://...",
      "author": "Babita Dahal",
      "readTime": "5 min read",
      "createdAt": "2026-03-04T10:30:00"
    }
  ],
  "totalElements": 15,
  "totalPages": 2,
  "number": 0,
  "size": 10
}
```

Only `PUBLISHED` posts. No `sections` in listing. Ordered by `createdAt` desc.

---

### 8. Get Published Blog by Slug (Public)

**GET** `/api/blogs/{slug}`

Returns full blog post including `sections` for rendering.

**Response (200)**:
```json
{
  "id": 1,
  "title": "My Blog Post",
  "slug": "my-blog-post",
  "category": "Fashion Tips",
  "excerpt": "A short description...",
  "coverUrl": "https://...",
  "author": "Babita Dahal",
  "readTime": "5 min read",
  "sections": [...],
  "createdAt": "2026-03-04T10:30:00"
}
```

**Response (404)**:
```json
{ "message": "Blog post not found" }
```

Only returns the post if `status = PUBLISHED`.

---

### 9. Get Categories (Public)

**GET** `/api/blogs/categories`

Returns distinct category names from published posts.

**Response (200)**:
```json
["Fashion Tips", "Bridal", "Sustainability", "Tailoring"]
```

---

## Summary of Endpoints

| Method | Path                              | Auth    | Description                    |
|--------|-----------------------------------|---------|--------------------------------|
| POST   | /api/admin/blogs/upload-image     | ADMIN   | Upload image, get URL          |
| POST   | /api/admin/blogs                  | ADMIN   | Create blog                    |
| PUT    | /api/admin/blogs/{id}             | ADMIN   | Update blog                    |
| DELETE | /api/admin/blogs/{id}             | ADMIN   | Delete blog                    |
| GET    | /api/admin/blogs                  | ADMIN   | List all blogs (drafts+pub)    |
| GET    | /api/admin/blogs/{id}             | ADMIN   | Get blog detail (with sections)|
| PATCH  | /api/admin/blogs/{id}/status      | ADMIN   | Publish/unpublish              |
| GET    | /api/blogs                        | PUBLIC  | List published blogs (paged)   |
| GET    | /api/blogs/{slug}                 | PUBLIC  | Get published blog by slug     |
| GET    | /api/blogs/categories             | PUBLIC  | Get category list              |

---

## CORS

Ensure the backend allows the frontend origins:
- `http://localhost:5173` (dev)
- `http://localhost:3000` (alt dev)
- Your production domain

---

## Frontend Integration Notes

Once the backend APIs are ready, the frontend will:

1. **On dashboard load**: Call `GET /api/admin/blogs` to list all posts.
2. **On edit click**: Call `GET /api/admin/blogs/{id}` to load full sections.
3. **On save draft / publish**: Call `POST /api/admin/blogs` (create) or `PUT /api/admin/blogs/{id}` (update).
4. **On delete**: Call `DELETE /api/admin/blogs/{id}`.
5. **On image upload** (cover or section): Call `POST /api/admin/blogs/upload-image`, get URL back, store in the blog data.
6. **Public blog page**: Call `GET /api/blogs` for listing, `GET /api/blogs/{slug}` for full post.

