# Blog API – Frontend Integration Guide

## Base URL

Use your backend base URL (e.g. `http://localhost:8090`). All endpoints are under `/api`.

---

## Authentication

Admin endpoints require a valid JWT in the `Authorization` header:

```
Authorization: Bearer <your-jwt-token>
```

Public endpoints (`/api/blogs/**`) require no authentication.

---

## 1. Upload Blog Image

**POST** `/api/admin/blogs/upload-image`

**Auth**: Admin JWT required
**Content-Type**: `multipart/form-data`

### Request

| Field | Type | Required | Notes                           |
|-------|------|----------|---------------------------------|
| file  | File | yes      | JPEG, PNG, WebP, GIF. Max 5 MB. |

### Response — Success (200)

```json
{
  "url": "/uploads/images/a1b2c3d4_my-image.jpg"
}
```

### Response — Error (400)

```json
{
  "message": "Invalid image type. Allowed: JPEG, PNG, WebP, GIF"
}
```

```json
{
  "message": "File size exceeds 5 MB limit"
}
```

### Usage

Upload images first (cover image or section images), then use the returned `url` in the blog create/update request body.

---

## 2. Create Blog Post

**POST** `/api/admin/blogs`

**Auth**: Admin JWT required
**Content-Type**: `application/json`

### Request Body

```json
{
  "title": "10 Ways to Style a Silk Saree",
  "category": "Fashion Tips",
  "excerpt": "Discover creative ways to drape and accessorize your silk saree for any occasion.",
  "coverUrl": "/uploads/images/a1b2c3d4_cover.jpg",
  "author": "Babita Dahal",
  "readTime": "5 min read",
  "status": "DRAFT",
  "sections": [
    {
      "id": "sec_intro_1",
      "type": "intro",
      "data": {
        "p1": "<p>Silk sarees are a timeless staple in every Indian wardrobe.</p>",
        "p2": "<p>Here are 10 creative ways to style them for modern occasions.</p>"
      }
    },
    {
      "id": "sec_heading_1",
      "type": "heading",
      "data": {
        "text": "<p>Classic Draping Styles</p>"
      }
    },
    {
      "id": "sec_imagetext_1",
      "type": "imagetext",
      "data": {
        "img": "/uploads/images/b2c3d4e5_drape.jpg",
        "alt": "Woman in silk saree",
        "left": true,
        "text": "<p>The Nivi drape remains the most popular style across India.</p>"
      }
    },
    {
      "id": "sec_quote_1",
      "type": "quote",
      "data": {
        "text": "<p>A saree is not just six yards of fabric, it's a legacy.</p>",
        "by": "<p>-- Fashion Designer</p>"
      }
    },
    {
      "id": "sec_takeaways_1",
      "type": "takeaways",
      "data": {
        "heading": "<p>Key Takeaways</p>",
        "items": [
          {
            "title": "<p>Experiment with drapes</p>",
            "desc": "<p>Try dhoti style, butterfly, or lehenga drape for variety.</p>"
          },
          {
            "title": "<p>Accessorize wisely</p>",
            "desc": "<p>Match your jewelry with the saree border color.</p>"
          }
        ]
      }
    },
    {
      "id": "sec_stats_1",
      "type": "stats",
      "data": {
        "items": [
          { "val": "<p>100+</p>", "lbl": "<p>Draping Styles</p>" },
          { "val": "<p>50+</p>", "lbl": "<p>Fabric Types</p>" }
        ]
      }
    },
    {
      "id": "sec_cards3_1",
      "type": "cards3",
      "data": {
        "items": [
          { "val": "<p>20 tonnes</p>", "lbl": "<p>Silk produced daily</p>", "color": "sage" },
          { "val": "<p>5000+</p>", "lbl": "<p>Weavers employed</p>", "color": "rose" },
          { "val": "<p>200+</p>", "lbl": "<p>Design patterns</p>", "color": "sage" }
        ]
      }
    },
    {
      "id": "sec_imagecards_1",
      "type": "imagecards",
      "data": {
        "items": [
          {
            "img": "/uploads/images/card1.jpg",
            "heading": "<p>Banarasi Silk</p>",
            "text": "<p>Known for gold and silver brocade.</p>"
          },
          {
            "img": "/uploads/images/card2.jpg",
            "heading": "<p>Kanjivaram</p>",
            "text": "<p>South India's most prized silk.</p>"
          }
        ]
      }
    },
    {
      "id": "sec_darkbox_1",
      "type": "darkbox",
      "data": {
        "heading": "<p>Care Tips:</p>",
        "bullets": [
          { "text": "<p>Always dry clean silk sarees.</p>" },
          { "text": "<p>Store in muslin cloth, not plastic.</p>" }
        ]
      }
    },
    {
      "id": "sec_steps_1",
      "type": "steps",
      "data": {
        "heading": "<p>How to Drape a Nivi Style Saree</p>",
        "items": [
          { "title": "<p>Step 1: Tuck</p>", "text": "<p>Tuck the plain end into the petticoat.</p>" },
          { "title": "<p>Step 2: Wrap</p>", "text": "<p>Wrap around once and create pleats.</p>" },
          { "title": "<p>Step 3: Pallu</p>", "text": "<p>Drape the pallu over the left shoulder.</p>" }
        ]
      }
    },
    {
      "id": "sec_conclusion_1",
      "type": "conclusion",
      "data": {
        "heading": "<p>Conclusion</p>",
        "text": "<p>Silk sarees offer endless styling possibilities. Experiment and find your signature drape!</p>"
      }
    }
  ]
}
```

### Response — Success (201 Created)

```json
{
  "id": 1,
  "title": "10 Ways to Style a Silk Saree",
  "slug": "10-ways-to-style-a-silk-saree",
  "category": "Fashion Tips",
  "excerpt": "Discover creative ways to drape and accessorize your silk saree for any occasion.",
  "coverUrl": "/uploads/images/a1b2c3d4_cover.jpg",
  "author": "Babita Dahal",
  "readTime": "5 min read",
  "status": "DRAFT",
  "sections": [ ... ],
  "createdAt": "2026-03-04T10:30:00",
  "updatedAt": "2026-03-04T10:30:00"
}
```

### Notes

- `slug` is auto-generated from `title`. If duplicate, `-2`, `-3` etc. is appended.
- `status` must be `"DRAFT"` or `"PUBLISHED"`.
- `sections` is an array of section objects. Each must have `id`, `type`, and `data`.
- All text fields inside `data` contain HTML strings (from rich text editor). Backend stores as-is.

---

## 3. Update Blog Post

**PUT** `/api/admin/blogs/{id}`

**Auth**: Admin JWT required
**Content-Type**: `application/json`

### Request Body

Same shape as create. Send all fields (full replace).

```json
{
  "title": "10 Ways to Style a Silk Saree (Updated)",
  "category": "Fashion Tips",
  "excerpt": "Updated description...",
  "coverUrl": "/uploads/images/a1b2c3d4_cover.jpg",
  "author": "Babita Dahal",
  "readTime": "6 min read",
  "status": "DRAFT",
  "sections": [ ... ]
}
```

### Response — Success (200)

```json
{
  "id": 1,
  "title": "10 Ways to Style a Silk Saree (Updated)",
  "slug": "10-ways-to-style-a-silk-saree-updated",
  "category": "Fashion Tips",
  "excerpt": "Updated description...",
  "coverUrl": "/uploads/images/a1b2c3d4_cover.jpg",
  "author": "Babita Dahal",
  "readTime": "6 min read",
  "status": "DRAFT",
  "sections": [ ... ],
  "createdAt": "2026-03-04T10:30:00",
  "updatedAt": "2026-03-04T11:15:00"
}
```

### Response — Error (404)

```json
{
  "message": "Blog post not found"
}
```

### Notes

- If `title` changes, `slug` is regenerated.
- If `title` stays the same, `slug` is preserved.

---

## 4. Delete Blog Post

**DELETE** `/api/admin/blogs/{id}`

**Auth**: Admin JWT required

### Response — Success (204)

No body.

### Response — Error (404)

```json
{
  "message": "Blog post not found"
}
```

---

## 5. Get All Blogs (Admin)

**GET** `/api/admin/blogs`

**Auth**: Admin JWT required

Returns all blog posts (drafts + published), ordered by `updatedAt` desc.

### Response — Success (200)

```json
[
  {
    "id": 1,
    "title": "10 Ways to Style a Silk Saree",
    "slug": "10-ways-to-style-a-silk-saree",
    "category": "Fashion Tips",
    "excerpt": "Discover creative ways to drape...",
    "coverUrl": "/uploads/images/a1b2c3d4_cover.jpg",
    "author": "Babita Dahal",
    "readTime": "5 min read",
    "status": "DRAFT",
    "sectionsCount": 11,
    "createdAt": "2026-03-04T10:30:00",
    "updatedAt": "2026-03-04T10:30:00"
  },
  {
    "id": 2,
    "title": "Bridal Lehenga Trends 2026",
    "slug": "bridal-lehenga-trends-2026",
    "category": "Bridal",
    "excerpt": "Top bridal lehenga trends...",
    "coverUrl": "/uploads/images/e5f6g7h8_bridal.jpg",
    "author": "Babita Dahal",
    "readTime": "8 min read",
    "status": "PUBLISHED",
    "sectionsCount": 7,
    "createdAt": "2026-03-03T09:00:00",
    "updatedAt": "2026-03-04T08:45:00"
  }
]
```

### Notes

- Does NOT include `sections` array (too large for listing). Use `sectionsCount` for display.
- To get full sections, call `GET /api/admin/blogs/{id}`.

---

## 6. Get Blog by ID (Admin)

**GET** `/api/admin/blogs/{id}`

**Auth**: Admin JWT required

Returns the full blog post including `sections`.

### Response — Success (200)

```json
{
  "id": 1,
  "title": "10 Ways to Style a Silk Saree",
  "slug": "10-ways-to-style-a-silk-saree",
  "category": "Fashion Tips",
  "excerpt": "Discover creative ways to drape...",
  "coverUrl": "/uploads/images/a1b2c3d4_cover.jpg",
  "author": "Babita Dahal",
  "readTime": "5 min read",
  "status": "DRAFT",
  "sections": [
    {
      "id": "sec_intro_1",
      "type": "intro",
      "data": {
        "p1": "<p>Silk sarees are a timeless staple...</p>",
        "p2": "<p>Here are 10 creative ways...</p>"
      }
    }
  ],
  "createdAt": "2026-03-04T10:30:00",
  "updatedAt": "2026-03-04T10:30:00"
}
```

### Response — Error (404)

```json
{
  "message": "Blog post not found"
}
```

---

## 7. Publish / Unpublish

**PATCH** `/api/admin/blogs/{id}/status`

**Auth**: Admin JWT required
**Content-Type**: `application/json`

### Request Body

```json
{
  "status": "PUBLISHED"
}
```

or

```json
{
  "status": "DRAFT"
}
```

### Response — Success (200)

Full blog object with updated status (same shape as create response).

### Response — Error (404)

```json
{
  "message": "Blog post not found"
}
```

### Response — Error (400)

```json
{
  "message": "Invalid status: xyz. Must be DRAFT or PUBLISHED"
}
```

---

## 8. Get Published Blogs (Public — No Auth)

**GET** `/api/blogs`

### Query Parameters

| Param    | Type   | Default | Description                |
|----------|--------|---------|----------------------------|
| category | string | —       | Filter by category name    |
| page     | int    | 0       | Page number (0-based)      |
| size     | int    | 10      | Page size                  |

### Example

```
GET /api/blogs?category=Fashion%20Tips&page=0&size=10
```

### Response — Success (200)

```json
{
  "content": [
    {
      "id": 1,
      "title": "10 Ways to Style a Silk Saree",
      "slug": "10-ways-to-style-a-silk-saree",
      "category": "Fashion Tips",
      "excerpt": "Discover creative ways to drape...",
      "coverUrl": "/uploads/images/a1b2c3d4_cover.jpg",
      "author": "Babita Dahal",
      "readTime": "5 min read",
      "createdAt": "2026-03-04T10:30:00"
    }
  ],
  "totalElements": 15,
  "totalPages": 2,
  "number": 0,
  "size": 10,
  "first": true,
  "last": false,
  "empty": false
}
```

### Notes

- Only `PUBLISHED` posts are returned.
- No `sections` in listing. No `status` field (all are published).
- Ordered by `createdAt` desc.

---

## 9. Get Published Blog by Slug (Public — No Auth)

**GET** `/api/blogs/{slug}`

### Example

```
GET /api/blogs/10-ways-to-style-a-silk-saree
```

### Response — Success (200)

```json
{
  "id": 1,
  "title": "10 Ways to Style a Silk Saree",
  "slug": "10-ways-to-style-a-silk-saree",
  "category": "Fashion Tips",
  "excerpt": "Discover creative ways to drape...",
  "coverUrl": "/uploads/images/a1b2c3d4_cover.jpg",
  "author": "Babita Dahal",
  "readTime": "5 min read",
  "sections": [
    {
      "id": "sec_intro_1",
      "type": "intro",
      "data": {
        "p1": "<p>Silk sarees are a timeless staple...</p>",
        "p2": "<p>Here are 10 creative ways...</p>"
      }
    },
    {
      "id": "sec_heading_1",
      "type": "heading",
      "data": { "text": "<p>Classic Draping Styles</p>" }
    }
  ],
  "createdAt": "2026-03-04T10:30:00"
}
```

### Response — Error (404)

```json
{
  "message": "Blog post not found"
}
```

### Notes

- Only returns the post if it is `PUBLISHED`.
- Use `slug` (not `id`) in the URL.

---

## 10. Get Categories (Public — No Auth)

**GET** `/api/blogs/categories`

Returns distinct category names from published posts only.

### Response — Success (200)

```json
["Bridal", "Fashion Tips", "Sustainability", "Tailoring"]
```

---

## Section Types Reference

| Type         | `data` fields                                                                 |
|-------------|--------------------------------------------------------------------------------|
| `intro`      | `p1` (HTML), `p2` (HTML, optional)                                            |
| `heading`    | `text` (HTML)                                                                 |
| `quote`      | `text` (HTML), `by` (HTML)                                                    |
| `takeaways`  | `heading` (HTML), `items[]` → `{ title, desc }` (both HTML)                  |
| `stats`      | `items[]` → `{ val, lbl }` (both HTML)                                       |
| `imagetext`  | `img` (URL), `alt` (plain string), `left` (boolean), `text` (HTML)           |
| `cards3`     | `items[]` → `{ val, lbl, color }` (val/lbl HTML, color: `"sage"` or `"rose"`) |
| `imagecards` | `items[]` → `{ img, heading, text }` (img URL, heading/text HTML)            |
| `darkbox`    | `heading` (HTML), `bullets[]` → `{ text }` (HTML)                            |
| `steps`      | `heading` (HTML), `items[]` → `{ title, text }` (both HTML)                  |
| `conclusion` | `heading` (HTML), `text` (HTML)                                               |

---

## Endpoint Summary

| Method | Path                              | Auth    | Description                    |
|--------|-----------------------------------|---------|--------------------------------|
| POST   | `/api/admin/blogs/upload-image`   | ADMIN   | Upload image, get URL          |
| POST   | `/api/admin/blogs`                | ADMIN   | Create blog                    |
| PUT    | `/api/admin/blogs/{id}`           | ADMIN   | Update blog                    |
| DELETE | `/api/admin/blogs/{id}`           | ADMIN   | Delete blog                    |
| GET    | `/api/admin/blogs`                | ADMIN   | List all blogs (drafts+pub)    |
| GET    | `/api/admin/blogs/{id}`           | ADMIN   | Get blog detail (with sections)|
| PATCH  | `/api/admin/blogs/{id}/status`    | ADMIN   | Publish / unpublish            |
| GET    | `/api/blogs`                      | PUBLIC  | List published blogs (paged)   |
| GET    | `/api/blogs/{slug}`               | PUBLIC  | Get published blog by slug     |
| GET    | `/api/blogs/categories`           | PUBLIC  | Get category list              |

---

## Frontend Integration Flow

1. **Admin Dashboard Load** → `GET /api/admin/blogs` to list all posts.
2. **Edit Blog** → `GET /api/admin/blogs/{id}` to load full sections into editor.
3. **Upload Image** (cover or section) → `POST /api/admin/blogs/upload-image`, get `url`, store in blog data.
4. **Save Draft** → `POST /api/admin/blogs` (new) or `PUT /api/admin/blogs/{id}` (existing) with `"status": "DRAFT"`.
5. **Publish** → `PATCH /api/admin/blogs/{id}/status` with `{ "status": "PUBLISHED" }`.
6. **Delete** → `DELETE /api/admin/blogs/{id}`.
7. **Public Blog Listing** → `GET /api/blogs?page=0&size=10` (optionally with `&category=Fashion%20Tips`).
8. **Public Blog Detail** → `GET /api/blogs/{slug}` to render full post.
9. **Category Filter** → `GET /api/blogs/categories` to populate filter dropdown.

---

## CORS

Backend allows all origins via `allowedOriginPatterns("*")`. No additional frontend config needed.
