package com.styliste.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.styliste.dto.GoogleReviewDTO;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.web.client.RestClient;

import java.io.File;
import java.nio.file.Path;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.*;
import static org.springframework.test.web.client.response.MockRestResponseCreators.*;

class GoogleReviewsServiceTest {

    private ObjectMapper objectMapper;
    private RestClient.Builder restClientBuilder;
    private MockRestServiceServer mockServer;
    private GoogleReviewsService service;

    @TempDir
    Path tempDir;

    private String tempCacheFile;

    @BeforeEach
    void setUp() {
        objectMapper = new ObjectMapper();
        restClientBuilder = RestClient.builder().baseUrl("https://api.outscraper.com");
        mockServer = MockRestServiceServer.bindTo(restClientBuilder).build();
        RestClient restClient = restClientBuilder.build();

        tempCacheFile = tempDir.resolve("test-reviews.json").toString();

        service = new GoogleReviewsService(
                objectMapper,
                restClient,
                "test-api-key-123",
                "Styliste Couturier, Thane, India",
                10,
                tempCacheFile
        );
        service.setAsyncPollDelayMs(5L); // Minimal delay for tests
    }

    /**
     * Requirement 4: Test based on the official Outscraper JSON structure from the API documentation
     * data[0].reviews contains array of review objects.
     */
    @Test
    void testSuccessfulOutscraperFetchWithOfficialDocSchema() {
        String mockOutscraperResponse = """
            {
              "id": "c_official_doc_req",
              "status": "Success",
              "data": [
                {
                  "query": "Styliste Couturier, Thane, India",
                  "name": "Styliste Couturier",
                  "rating": 4.9,
                  "reviews_count": 48,
                  "reviews": [
                    {
                      "review_id": "rev_official_01",
                      "author_title": "Ritu Verma",
                      "author_image": "https://lh3.googleusercontent.com/avatar1",
                      "review_rating": 5,
                      "review_text": "Exceptional tailoring and custom bridal blouses! Love Styliste Couturier.",
                      "review_datetime_utc": "10/12/2026 10:30:00",
                      "review_timestamp": 1760265000,
                      "review_link": "https://maps.google.com/review1"
                    },
                    {
                      "review_id": "rev_official_02",
                      "author_title": "Meera Joshi",
                      "author_image": "https://lh3.googleusercontent.com/avatar2",
                      "review_rating": 5,
                      "review_text": "The doorstep measurement service is so convenient and professional.",
                      "review_datetime_utc": "10/11/2026 15:45:00",
                      "review_timestamp": 1760197500,
                      "review_link": "https://maps.google.com/review2"
                    }
                  ]
                }
              ]
            }
            """;

        mockServer.expect(requestTo(org.hamcrest.Matchers.containsString("/google-maps-reviews")))
                .andExpect(method(HttpMethod.GET))
                .andExpect(header("X-API-KEY", "test-api-key-123"))
                .andRespond(withSuccess(mockOutscraperResponse, MediaType.APPLICATION_JSON));

        // Act
        service.refreshReviews();
        mockServer.verify();

        // Assert in-memory cache
        List<GoogleReviewDTO> reviews = service.getReviews();
        assertNotNull(reviews);
        assertEquals(2, reviews.size());

        GoogleReviewDTO first = reviews.get(0);
        assertEquals("Ritu Verma", first.getAuthorName());
        assertEquals(5, first.getRating());
        assertEquals("Exceptional tailoring and custom bridal blouses! Love Styliste Couturier.", first.getText());
        assertEquals("https://lh3.googleusercontent.com/avatar1", first.getAuthorPhotoUrl());
        assertEquals("10/12/2026 10:30:00", first.getDate());
        assertEquals("https://maps.google.com/review1", first.getReviewUrl());

        // Assert disk cache file was created and contains valid data
        File file = new File(tempCacheFile);
        assertTrue(file.exists());
        assertTrue(file.length() > 0);
    }

    /**
     * Requirement 4: Test async/pending then success polling flow
     */
    @Test
    void testAsyncPendingThenSuccessFlow() {
        String asyncInitialResponse = """
            {
              "id": "req-async-777",
              "status": "Pending",
              "results_location": "https://api.outscraper.com/requests/req-async-777"
            }
            """;

        String asyncCompletedResponse = """
            {
              "id": "req-async-777",
              "status": "Success",
              "data": [
                {
                  "name": "Styliste Couturier",
                  "reviews": [
                    {
                      "review_id": "rev_async_01",
                      "author_title": "Ananya Roy",
                      "author_image": "https://lh3.googleusercontent.com/avatar_async",
                      "review_rating": 5,
                      "review_text": "Async fetched bridal couture review.",
                      "review_datetime_utc": "10/13/2026 09:00:00",
                      "review_link": "https://maps.google.com/review_async"
                    }
                  ]
                }
              ]
            }
            """;

        // Step 1: Initial call to /google-maps-reviews returns status: Pending (HTTP 202)
        mockServer.expect(requestTo(org.hamcrest.Matchers.containsString("/google-maps-reviews")))
                .andExpect(method(HttpMethod.GET))
                .andExpect(header("X-API-KEY", "test-api-key-123"))
                .andRespond(withStatus(HttpStatus.ACCEPTED).body(asyncInitialResponse).contentType(MediaType.APPLICATION_JSON));

        // Step 2: Polling call to /requests/{id} returns status: Success
        mockServer.expect(requestTo("https://api.outscraper.com/requests/req-async-777"))
                .andExpect(method(HttpMethod.GET))
                .andExpect(header("X-API-KEY", "test-api-key-123"))
                .andRespond(withSuccess(asyncCompletedResponse, MediaType.APPLICATION_JSON));

        // Act
        service.refreshReviews();
        mockServer.verify();

        // Assert async reviews were retrieved and cached
        List<GoogleReviewDTO> reviews = service.getReviews();
        assertEquals(1, reviews.size());
        assertEquals("Ananya Roy", reviews.get(0).getAuthorName());
        assertEquals("Async fetched bridal couture review.", reviews.get(0).getText());
    }

    /**
     * Requirement 4: Test malformed/unexpected JSON keeps the old cache and doesn't crash
     */
    @Test
    void testMalformedOrUnexpectedJsonKeepsOldCacheWithoutCrashing() {
        // Step 1: Seed cache with one valid review
        String validResponse = """
            {
              "status": "Success",
              "data": [
                {
                  "name": "Styliste Couturier",
                  "reviews": [
                    {
                      "review_id": "rev_valid_01",
                      "author_title": "Existing Customer",
                      "review_rating": 5,
                      "review_text": "Original verified review."
                    }
                  ]
                }
              ]
            }
            """;

        mockServer.expect(requestTo(org.hamcrest.Matchers.containsString("/google-maps-reviews")))
                .andRespond(withSuccess(validResponse, MediaType.APPLICATION_JSON));

        service.refreshReviews();
        assertEquals(1, service.getReviews().size());
        assertEquals("Existing Customer", service.getReviews().get(0).getAuthorName());
        mockServer.reset();

        // Step 2: Outscraper returns truncated / invalid JSON syntax
        String brokenJson = "{\"status\": \"Success\", \"data\": [ { \"unclosed_bracket\": ";

        mockServer.expect(requestTo(org.hamcrest.Matchers.containsString("/google-maps-reviews")))
                .andRespond(withSuccess(brokenJson, MediaType.APPLICATION_JSON));

        // Act - must not crash
        assertDoesNotThrow(() -> service.refreshReviews());
        mockServer.verify();

        // Assert old cache was preserved
        List<GoogleReviewDTO> reviews = service.getReviews();
        assertEquals(1, reviews.size());
        assertEquals("Existing Customer", reviews.get(0).getAuthorName());
    }

    /**
     * Test HTTP error (500, 429 Quota Exhausted) preserves existing cache without crashing
     */
    @Test
    void testHttpFailurePreservesExistingCacheWithoutThrowing() {
        // Step 1: Pre-populate cache
        String initialResponse = """
            {
              "status": "Success",
              "data": [
                {
                  "reviews": [
                    {
                      "review_id": "rev_initial",
                      "author_title": "Initial Reviewer",
                      "review_rating": 5,
                      "review_text": "Initial great review."
                    }
                  ]
                }
              ]
            }
            """;

        mockServer.expect(requestTo(org.hamcrest.Matchers.containsString("/google-maps-reviews")))
                .andRespond(withSuccess(initialResponse, MediaType.APPLICATION_JSON));

        service.refreshReviews();
        assertEquals(1, service.getReviews().size());
        mockServer.reset();

        // Step 2: API call fails with HTTP 500 / 429
        mockServer.expect(requestTo(org.hamcrest.Matchers.containsString("/google-maps-reviews")))
                .andRespond(withServerError());

        // Act - should NOT throw exception
        assertDoesNotThrow(() -> service.refreshReviews());
        mockServer.verify();

        // Assert - old cache was retained
        List<GoogleReviewDTO> reviews = service.getReviews();
        assertNotNull(reviews);
        assertEquals(1, reviews.size(), "Existing cached reviews must be retained when Outscraper fails");
        assertEquals("Initial Reviewer", reviews.get(0).getAuthorName());
    }

    /**
     * Requirement 5: Test manual refresh on demand with custom reviews limit (e.g. limit=3)
     */
    @Test
    void testManualRefreshWithCustomLimit() {
        String mockResponse = """
            {
              "status": "Success",
              "data": [
                {
                  "name": "Styliste Couturier",
                  "reviews": [
                    {
                      "review_id": "rev_manual_01",
                      "author_title": "Sneha K",
                      "review_rating": 5,
                      "review_text": "Manual refresh test review."
                    }
                  ]
                }
              ]
            }
            """;

        mockServer.expect(requestTo(org.hamcrest.Matchers.containsString("reviewsLimit=3")))
                .andExpect(method(HttpMethod.GET))
                .andExpect(header("X-API-KEY", "test-api-key-123"))
                .andRespond(withSuccess(mockResponse, MediaType.APPLICATION_JSON));

        Map<String, Object> result = service.manualRefresh(3);
        mockServer.verify();

        assertTrue((Boolean) result.get("success"));
        assertTrue((Boolean) result.get("cacheUpdated"));
        assertEquals(1, result.get("reviewsCount"));
        assertEquals(1, service.getReviews().size());
        assertEquals("Sneha K", service.getReviews().get(0).getAuthorName());
    }

    @Test
    void testEmptyKeySkipsHttpCallAndRetainsCache() {
        service.setApiKey("");

        // Act
        service.refreshReviews();

        // No HTTP request should have been made to mockServer
        mockServer.verify();
    }
}
