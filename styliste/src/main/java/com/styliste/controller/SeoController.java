package com.styliste.controller;

import com.styliste.entity.BlogPost;
import com.styliste.entity.BlogStatus;
import com.styliste.entity.Product;
import com.styliste.repository.BlogPostRepository;
import com.styliste.repository.ProductRepository;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StreamUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

@RestController
public class SeoController {

    private static final String BASE_URL = "https://styliste-couturier.com";
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    private static final Map<Long, String> KNOWN_PRODUCT_SLUGS = Map.of(
            5L, "navy-blue-embellished-evening-gown",
            4L, "royal-purple-embroidered-anarkali-gown",
            3L, "yellow-silk-saree"
    );

    private final BlogPostRepository blogPostRepository;
    private final ProductRepository productRepository;

    public SeoController(BlogPostRepository blogPostRepository, ProductRepository productRepository) {
        this.blogPostRepository = blogPostRepository;
        this.productRepository = productRepository;
    }

    @GetMapping(value = "/robots.txt", produces = MediaType.TEXT_PLAIN_VALUE)
    public ResponseEntity<String> getRobotsTxt() throws IOException {
        Resource resource = new ClassPathResource("static/robots.txt");
        if (resource.exists()) {
            String content = StreamUtils.copyToString(resource.getInputStream(), StandardCharsets.UTF_8);
            return ResponseEntity.ok()
                    .contentType(MediaType.TEXT_PLAIN)
                    .body(content);
        }
        return ResponseEntity.ok()
                .contentType(MediaType.TEXT_PLAIN)
                .body("User-agent: *\nAllow: /\n\nSitemap: " + BASE_URL + "/sitemap.xml\n");
    }

    @GetMapping(value = "/sitemap.xml", produces = MediaType.APPLICATION_XML_VALUE)
    public ResponseEntity<String> getSitemapXml() {
        try {
            StringBuilder xml = new StringBuilder();
            xml.append("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n");
            xml.append("<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">\n");

            // 1. Core Public Pages
            addUrl(xml, BASE_URL + "/", "weekly", "1.0", null);
            addUrl(xml, BASE_URL + "/products", "daily", "0.9", null);
            addUrl(xml, BASE_URL + "/about-us", "monthly", "0.8", null);
            addUrl(xml, BASE_URL + "/services", "weekly", "0.8", null);
            addUrl(xml, BASE_URL + "/blog", "weekly", "0.8", null);
            addUrl(xml, BASE_URL + "/contact-us", "monthly", "0.7", null);
            addUrl(xml, BASE_URL + "/testimonials", "weekly", "0.7", null);
            addUrl(xml, BASE_URL + "/appointment", "monthly", "0.8", null);
            addUrl(xml, BASE_URL + "/size-guide", "monthly", "0.6", null);
            addUrl(xml, BASE_URL + "/terms-of-service", "yearly", "0.5", null);
            addUrl(xml, BASE_URL + "/refund-policy", "yearly", "0.5", null);
            addUrl(xml, BASE_URL + "/privacy-policy", "yearly", "0.5", null);

            // 2. Dynamic Published Blog Posts from Database
            Set<String> addedBlogUrls = new HashSet<>();
            List<BlogPost> blogs = blogPostRepository.findAllByOrderByUpdatedAtDesc();
            if (blogs != null) {
                for (BlogPost blog : blogs) {
                    if (blog.getStatus() == BlogStatus.PUBLISHED && blog.getSlug() != null && !blog.getSlug().isBlank()) {
                        String blogUrl = BASE_URL + "/blog/" + blog.getSlug().trim();
                        if (addedBlogUrls.add(blogUrl)) {
                            LocalDateTime modTime = blog.getUpdatedAt() != null ? blog.getUpdatedAt() : blog.getCreatedAt();
                            String lastMod = modTime != null ? modTime.format(DATE_FORMATTER) : null;
                            addUrl(xml, blogUrl, "monthly", "0.7", lastMod);
                        }
                    }
                }
            }

            // Ensure baseline featured post if not in DB
            String defaultArtBlog = BASE_URL + "/blog/the-art-of-dressing-with-intention";
            if (addedBlogUrls.add(defaultArtBlog)) {
                addUrl(xml, defaultArtBlog, "monthly", "0.7", null);
            }

            // 3. Dynamic Active Products from Database
            Set<String> addedProductUrls = new HashSet<>();
            List<Product> products = productRepository.findByIsActiveTrueOrderByCreatedAtDesc();
            if (products != null) {
                for (Product product : products) {
                    String slug = getProductSlug(product);
                    if (slug != null && !slug.isBlank()) {
                        String prodUrl = BASE_URL + "/products/" + slug;
                        if (addedProductUrls.add(prodUrl)) {
                            LocalDateTime modTime = product.getUpdatedAt() != null ? product.getUpdatedAt() : product.getCreatedAt();
                            String lastMod = modTime != null ? modTime.format(DATE_FORMATTER) : null;
                            addUrl(xml, prodUrl, "weekly", "0.8", lastMod);
                        }
                    }
                }
            }

            // Ensure baseline top products if not yet added
            for (Map.Entry<Long, String> entry : KNOWN_PRODUCT_SLUGS.entrySet()) {
                String knownUrl = BASE_URL + "/products/" + entry.getValue();
                if (addedProductUrls.add(knownUrl)) {
                    addUrl(xml, knownUrl, "weekly", "0.8", null);
                }
            }

            xml.append("</urlset>\n");

            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_XML)
                    .body(xml.toString());

        } catch (Exception e) {
            // Fallback to static sitemap if database query fails
            try {
                Resource resource = new ClassPathResource("static/sitemap.xml");
                if (resource.exists()) {
                    String content = StreamUtils.copyToString(resource.getInputStream(), StandardCharsets.UTF_8);
                    return ResponseEntity.ok()
                            .contentType(MediaType.APPLICATION_XML)
                            .body(content);
                }
            } catch (IOException ignored) {
            }
            return ResponseEntity.notFound().build();
        }
    }

    private void addUrl(StringBuilder xml, String location, String changefreq, String priority, String lastmod) {
        xml.append("  <url>\n");
        xml.append("    <loc>").append(escapeXml(location)).append("</loc>\n");
        if (lastmod != null && !lastmod.isBlank()) {
            xml.append("    <lastmod>").append(escapeXml(lastmod)).append("</lastmod>\n");
        }
        if (changefreq != null && !changefreq.isBlank()) {
            xml.append("    <changefreq>").append(escapeXml(changefreq)).append("</changefreq>\n");
        }
        if (priority != null && !priority.isBlank()) {
            xml.append("    <priority>").append(escapeXml(priority)).append("</priority>\n");
        }
        xml.append("  </url>\n");
    }

    private String getProductSlug(Product product) {
        if (product.getId() != null && KNOWN_PRODUCT_SLUGS.containsKey(product.getId())) {
            return KNOWN_PRODUCT_SLUGS.get(product.getId());
        }
        if (product.getName() != null && !product.getName().isBlank()) {
            String slug = product.getName().toLowerCase().trim()
                    .replaceAll("[^a-z0-9\\s-]", "")
                    .replaceAll("[\\s_-]+", "-")
                    .replaceAll("^-+|-+$", "");
            if (!slug.isBlank()) {
                return slug;
            }
        }
        return product.getId() != null ? String.valueOf(product.getId()) : null;
    }

    private String escapeXml(String text) {
        if (text == null) return "";
        return text.replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("\"", "&quot;")
                .replace("'", "&apos;");
    }
}
