package com.styliste.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.styliste.dto.GoogleReviewDTO;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestClient;

import java.io.File;
import java.io.IOException;
import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.concurrent.CopyOnWriteArrayList;

@Service
public class GoogleReviewsService {

    private static final Logger log = LoggerFactory.getLogger(GoogleReviewsService.class);
    private static final String DEFAULT_OUTSCRAPER_BASE_URL = "https://api.outscraper.com";

    @Value("${outscraper.api-key:}")
    private String apiKey;

    @Value("${outscraper.reviews.query:Styliste Couturier, Thane, India}")
    private String query;

    @Value("${outscraper.reviews.limit:20}")
    private int reviewsLimit;

    @Value("${outscraper.reviews.language:en}")
    private String language;

    @Value("${outscraper.reviews.cache-file:reviews.json}")
    private String cacheFilePath;

    @Value("${outscraper.reviews.refresh-on-startup:false}")
    private boolean refreshOnStartup;

    @Value("${outscraper.base-url:https://api.outscraper.com}")
    private String baseUrl = DEFAULT_OUTSCRAPER_BASE_URL;

    private long asyncPollDelayMs = 2500L;

    private final ObjectMapper objectMapper;
    private RestClient restClient;

    private final List<GoogleReviewDTO> cachedReviews = new CopyOnWriteArrayList<>();

    @Autowired
    public GoogleReviewsService(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    // Constructor for testing or manual configuration
    public GoogleReviewsService(ObjectMapper objectMapper, RestClient restClient, String apiKey, String query, int reviewsLimit, String cacheFilePath) {
        this.objectMapper = objectMapper;
        this.restClient = restClient;
        this.apiKey = apiKey;
        this.query = query;
        this.reviewsLimit = reviewsLimit;
        this.cacheFilePath = cacheFilePath;
    }

    @PostConstruct
    public void init() {
        if (this.restClient == null) {
            SimpleClientHttpRequestFactory requestFactory = new SimpleClientHttpRequestFactory();
            requestFactory.setConnectTimeout(10000); // 10s connect timeout
            requestFactory.setReadTimeout(30000);    // 30s read timeout

            this.restClient = RestClient.builder()
                    .baseUrl(baseUrl)
                    .requestFactory(requestFactory)
                    .build();
        }

        // 1. Load cached reviews from local disk on startup (no synthetic or invented data)
        loadCachedReviewsFromFile();
    }

    @EventListener(ApplicationReadyEvent.class)
    public void onApplicationReady() {
        if (!refreshOnStartup) {
            log.info("Startup Outscraper refresh is disabled (outscraper.reviews.refresh-on-startup=false). Serving cached reviews ({} items) from '{}'.",
                    cachedReviews.size(), cacheFilePath);
            return;
        }

        if (!StringUtils.hasText(apiKey)) {
            log.warn("Cannot perform startup refresh: OUTSCRAPER_API_KEY is not set. Serving cached reviews ({} items).",
                    cachedReviews.size());
            return;
        }

        // Optional one-time refresh on startup if configured
        new Thread(() -> {
            try {
                Thread.sleep(3000); // Brief delay to let the app fully initialize
                log.info("Executing startup reviews refresh as configured...");
                refreshReviews();
            } catch (Exception e) {
                log.error("Error during startup reviews refresh: {}", e.getMessage());
            }
        }, "outscraper-startup-refresh").start();
    }

    /**
     * Scheduled refresh every 3 days (259,200,000 ms).
     * Calculation: ~10 requests/month * 20 reviews = ~200 reviews/month (safely within the 500 free reviews tier).
     */
    @Scheduled(fixedRateString = "${outscraper.reviews.refresh-rate-ms:259200000}", initialDelay = 60000)
    public void scheduledRefresh() {
        log.info("Starting scheduled Outscraper reviews refresh (3-day cycle)...");
        refreshReviews();
    }

    /**
     * Standard scheduled or background refresh using configured limit.
     */
    public synchronized void refreshReviews() {
        executeFetch(this.reviewsLimit, "Scheduled");
    }

    /**
     * Safe manual test mode: trigger a refresh on demand with a custom limit (e.g. limit=3).
     * Returns a summary map for administrative/dev callers.
     */
    public synchronized Map<String, Object> manualRefresh(Integer customLimit) {
        int limitToUse = (customLimit != null && customLimit > 0) ? customLimit : this.reviewsLimit;
        return executeFetch(limitToUse, "Manual");
    }

    private Map<String, Object> executeFetch(int limitToUse, String triggerType) {
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("triggerType", triggerType);
        result.put("query", query);
        result.put("requestedLimit", limitToUse);
        result.put("timestamp", Instant.now().toString());

        if (!StringUtils.hasText(apiKey)) {
            String msg = "OUTSCRAPER_API_KEY environment variable is not configured. Cache unchanged.";
            log.warn("[Outscraper] {} fetch aborted: {}. Current cached reviews: {}", triggerType, msg, cachedReviews.size());
            result.put("success", false);
            result.put("message", msg);
            result.put("reviewsCount", cachedReviews.size());
            result.put("cacheUpdated", false);
            return result;
        }

        log.info("[Outscraper] Initiating {} fetch for query='{}', limit={} (API Key configured: YES)", triggerType, query, limitToUse);

        try {
            ResponseEntity<String> response = restClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("/google-maps-reviews")
                            .queryParam("query", query)
                            .queryParam("reviewsLimit", limitToUse)
                            .queryParam("language", language)
                            .queryParam("async", false)
                            .build())
                    .header("X-API-KEY", apiKey.trim())
                    .retrieve()
                    .toEntity(String.class);

            HttpStatus statusCode = (HttpStatus) response.getStatusCode();
            log.info("[Outscraper] HTTP response status: {}", statusCode);

            if (statusCode == HttpStatus.OK && response.getBody() != null) {
                return processResponsePayload(response.getBody(), triggerType, result);
            } else if (statusCode == HttpStatus.ACCEPTED && response.getBody() != null) {
                return processAsyncPending(response.getBody(), triggerType, result);
            } else {
                String msg = "Outscraper returned non-OK status: " + statusCode + ". Preserving existing cache.";
                log.warn("[Outscraper] {}", msg);
                result.put("success", false);
                result.put("message", msg);
                result.put("reviewsCount", cachedReviews.size());
                result.put("cacheUpdated", false);
                return result;
            }

        } catch (Exception e) {
            String msg = "Failed to fetch from Outscraper (" + e.getClass().getSimpleName() + ": " + e.getMessage() + "). Existing cache preserved.";
            log.error("[Outscraper] {}. Current cache size: {}", msg, cachedReviews.size());
            result.put("success", false);
            result.put("message", msg);
            result.put("reviewsCount", cachedReviews.size());
            result.put("cacheUpdated", false);
            return result;
        }
    }

    private Map<String, Object> processResponsePayload(String responseBody, String triggerType, Map<String, Object> result) {
        try {
            JsonNode rootNode = objectMapper.readTree(responseBody);
            String status = rootNode.has("status") ? rootNode.get("status").asText() : "";

            if ("Pending".equalsIgnoreCase(status)) {
                return processAsyncPending(responseBody, triggerType, result);
            }

            List<GoogleReviewDTO> parsed = parseReviews(rootNode);
            if (!parsed.isEmpty()) {
                cachedReviews.clear();
                cachedReviews.addAll(parsed);
                saveReviewsToFile(cachedReviews);
                log.info("[Outscraper] {} fetch succeeded: received {} reviews. In-memory cache and '{}' updated.",
                        triggerType, parsed.size(), cacheFilePath);
                result.put("success", true);
                result.put("message", "Successfully refreshed and cached " + parsed.size() + " reviews.");
                result.put("reviewsCount", parsed.size());
                result.put("cacheUpdated", true);
            } else {
                log.warn("[Outscraper] Received response with status '{}' but 0 valid reviews found in payload. Existing cache preserved ({} items).",
                        status, cachedReviews.size());
                result.put("success", true);
                result.put("message", "Outscraper returned 0 reviews for query. Existing cache preserved.");
                result.put("reviewsCount", cachedReviews.size());
                result.put("cacheUpdated", false);
            }
        } catch (Exception e) {
            log.error("[Outscraper] Failed to parse response JSON: {}. Preserving existing cache.", e.getMessage());
            result.put("success", false);
            result.put("message", "Malformed response JSON from Outscraper: " + e.getMessage());
            result.put("reviewsCount", cachedReviews.size());
            result.put("cacheUpdated", false);
        }
        return result;
    }

    private Map<String, Object> processAsyncPending(String responseBody, String triggerType, Map<String, Object> result) {
        try {
            JsonNode rootNode = objectMapper.readTree(responseBody);
            String requestId = rootNode.has("id") ? rootNode.get("id").asText() : null;

            if (!StringUtils.hasText(requestId)) {
                String msg = "Async response missing task ID. Body: " + responseBody;
                log.warn("[Outscraper] {}", msg);
                result.put("success", false);
                result.put("message", msg);
                result.put("reviewsCount", cachedReviews.size());
                result.put("cacheUpdated", false);
                return result;
            }

            log.info("[Outscraper] Task queued asynchronously with ID: {}. Polling for completion...", requestId);

            // Poll up to 4 times with delay
            for (int attempt = 1; attempt <= 4; attempt++) {
                if (asyncPollDelayMs > 0) {
                    try {
                        Thread.sleep(asyncPollDelayMs);
                    } catch (InterruptedException e) {
                        Thread.currentThread().interrupt();
                        break;
                    }
                }

                try {
                    ResponseEntity<String> pollRes = restClient.get()
                            .uri("/requests/{id}", requestId)
                            .header("X-API-KEY", apiKey.trim())
                            .retrieve()
                            .toEntity(String.class);

                    if (pollRes.getStatusCode() == HttpStatus.OK && pollRes.getBody() != null) {
                        JsonNode pollNode = objectMapper.readTree(pollRes.getBody());
                        String pollStatus = pollNode.has("status") ? pollNode.get("status").asText() : "";

                        if ("Success".equalsIgnoreCase(pollStatus)) {
                            List<GoogleReviewDTO> parsed = parseReviews(pollNode);
                            if (!parsed.isEmpty()) {
                                cachedReviews.clear();
                                cachedReviews.addAll(parsed);
                                saveReviewsToFile(cachedReviews);
                                log.info("[Outscraper] Async task {} completed: received {} reviews. Cache updated.", requestId, parsed.size());
                                result.put("success", true);
                                result.put("message", "Async task completed with " + parsed.size() + " reviews.");
                                result.put("reviewsCount", parsed.size());
                                result.put("cacheUpdated", true);
                                return result;
                            }
                        } else if (!"Pending".equalsIgnoreCase(pollStatus)) {
                            log.warn("[Outscraper] Async task {} finished with status: {}", requestId, pollStatus);
                            break;
                        }
                    }
                } catch (Exception e) {
                    log.warn("[Outscraper] Polling attempt {} for task {} encountered: {}", attempt, requestId, e.getMessage());
                }
            }
        } catch (Exception e) {
            log.error("[Outscraper] Error processing async task: {}", e.getMessage());
        }

        result.put("success", false);
        result.put("message", "Async task did not complete in time. Retained previous cache.");
        result.put("reviewsCount", cachedReviews.size());
        result.put("cacheUpdated", false);
        return result;
    }

    /**
     * Parses Outscraper JSON variations into a clean GoogleReviewDTO list:
     * - Structure A: data -> [ { name: "...", reviews: [ { review } ] } ]
     * - Structure B: data -> [ { name: "...", reviews_data: [ { review } ] } ]
     * - Structure C: data -> [ [ { review1 }, { review2 } ] ]
     */
    public List<GoogleReviewDTO> parseReviews(JsonNode rootNode) {
        List<GoogleReviewDTO> reviews = new ArrayList<>();
        if (rootNode == null) return reviews;

        JsonNode dataNode = rootNode.has("data") ? rootNode.get("data") : rootNode;
        if (dataNode == null || !dataNode.isArray()) return reviews;

        for (JsonNode item : dataNode) {
            if (item.isArray()) {
                // Nested array of review items
                for (JsonNode reviewItem : item) {
                    GoogleReviewDTO dto = mapReviewNode(reviewItem);
                    if (dto != null) reviews.add(dto);
                }
            } else if (item.isObject()) {
                if (item.has("reviews") && item.get("reviews").isArray()) {
                    for (JsonNode reviewItem : item.get("reviews")) {
                        GoogleReviewDTO dto = mapReviewNode(reviewItem);
                        if (dto != null) reviews.add(dto);
                    }
                } else if (item.has("reviews_data") && item.get("reviews_data").isArray()) {
                    for (JsonNode reviewItem : item.get("reviews_data")) {
                        GoogleReviewDTO dto = mapReviewNode(reviewItem);
                        if (dto != null) reviews.add(dto);
                    }
                } else {
                    GoogleReviewDTO dto = mapReviewNode(item);
                    if (dto != null) reviews.add(dto);
                }
            }
        }
        return reviews;
    }

    private GoogleReviewDTO mapReviewNode(JsonNode node) {
        if (node == null || !node.isObject()) return null;

        String authorName = getField(node, "author_title", "author_name", "author");
        Integer rating = getIntField(node, "rating", "review_rating");
        String text = getField(node, "review_text", "text", "snippet");
        String photoUrl = getField(node, "author_image", "author_photo_url", "author_photo");
        String date = getField(node, "review_datetime_utc", "date", "review_date");
        Long timestamp = getLongField(node, "review_timestamp", "timestamp");
        String reviewId = getField(node, "review_id", "id");
        String reviewUrl = getField(node, "review_link", "author_link", "url");

        if (authorName == null && text == null && rating == null) {
            return null;
        }

        if (date == null && timestamp != null) {
            date = formatTimestamp(timestamp);
        }

        return GoogleReviewDTO.builder()
                .reviewId(reviewId)
                .authorName(StringUtils.hasText(authorName) ? authorName : "Google Reviewer")
                .authorPhotoUrl(photoUrl)
                .rating(rating != null ? rating : 5)
                .text(text != null ? text : "")
                .date(date != null ? date : "")
                .timestamp(timestamp)
                .reviewUrl(reviewUrl)
                .build();
    }

    private String getField(JsonNode node, String... fieldNames) {
        for (String field : fieldNames) {
            if (node.has(field) && !node.get(field).isNull()) {
                String val = node.get(field).asText();
                if (StringUtils.hasText(val)) return val;
            }
        }
        return null;
    }

    private Integer getIntField(JsonNode node, String... fieldNames) {
        for (String field : fieldNames) {
            if (node.has(field) && !node.get(field).isNull()) {
                return node.get(field).asInt();
            }
        }
        return null;
    }

    private Long getLongField(JsonNode node, String... fieldNames) {
        for (String field : fieldNames) {
            if (node.has(field) && !node.get(field).isNull()) {
                return node.get(field).asLong();
            }
        }
        return null;
    }

    private String formatTimestamp(long timestampSeconds) {
        try {
            return DateTimeFormatter.ofPattern("MMM dd, yyyy")
                    .withZone(ZoneId.of("UTC"))
                    .format(Instant.ofEpochSecond(timestampSeconds));
        } catch (Exception e) {
            return "";
        }
    }

    /**
     * Return cached reviews to callers (never throws, returns empty list if unpopulated).
     */
    public List<GoogleReviewDTO> getReviews() {
        return Collections.unmodifiableList(new ArrayList<>(cachedReviews));
    }

    private void loadCachedReviewsFromFile() {
        File file = new File(cacheFilePath);
        if (!file.exists()) {
            log.info("Reviews cache file '{}' does not exist yet. Current cache is empty.", cacheFilePath);
            return;
        }

        try {
            List<GoogleReviewDTO> loaded = objectMapper.readValue(file, new TypeReference<List<GoogleReviewDTO>>() {});
            if (loaded != null) {
                cachedReviews.clear();
                cachedReviews.addAll(loaded);
                log.info("Loaded {} cached Google reviews from '{}'.", loaded.size(), cacheFilePath);
            }
        } catch (IOException e) {
            log.error("Failed to read reviews cache file '{}': {}. Retaining in-memory cache.", cacheFilePath, e.getMessage());
        }
    }

    private void saveReviewsToFile(List<GoogleReviewDTO> reviews) {
        try {
            File file = new File(cacheFilePath);
            if (file.getParentFile() != null && !file.getParentFile().exists()) {
                file.getParentFile().mkdirs();
            }
            objectMapper.writerWithDefaultPrettyPrinter().writeValue(file, reviews);
            log.info("Persisted {} Google reviews to cache file '{}'.", reviews.size(), cacheFilePath);
        } catch (IOException e) {
            log.error("Failed to write reviews cache to '{}': {}", cacheFilePath, e.getMessage());
        }
    }

    // Setters for tests and dynamic configuration
    public void setApiKey(String apiKey) {
        this.apiKey = apiKey;
    }

    public void setQuery(String query) {
        this.query = query;
    }

    public void setReviewsLimit(int reviewsLimit) {
        this.reviewsLimit = reviewsLimit;
    }

    public void setRestClient(RestClient restClient) {
        this.restClient = restClient;
    }

    public void setCacheFilePath(String cacheFilePath) {
        this.cacheFilePath = cacheFilePath;
    }

    public void setRefreshOnStartup(boolean refreshOnStartup) {
        this.refreshOnStartup = refreshOnStartup;
    }

    public void setAsyncPollDelayMs(long asyncPollDelayMs) {
        this.asyncPollDelayMs = asyncPollDelayMs;
    }
}
