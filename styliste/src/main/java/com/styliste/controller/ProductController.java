/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  com.styliste.controller.ProductController
 *  com.styliste.dto.CreateProductRequest
 *  com.styliste.dto.ProductDTO
 *  com.styliste.dto.ProductFilterRequest
 *  com.styliste.dto.UpdateProductRequest
 *  com.styliste.repository.AttributeRepository
 *  com.styliste.service.FileStorageService
 *  com.styliste.service.ProductService
 *  jakarta.validation.Valid
 *  org.slf4j.Logger
 *  org.slf4j.LoggerFactory
 *  org.springframework.beans.factory.annotation.Autowired
 *  org.springframework.data.domain.Page
 *  org.springframework.http.HttpStatus
 *  org.springframework.http.HttpStatusCode
 *  org.springframework.http.ResponseEntity
 *  org.springframework.security.access.prepost.PreAuthorize
 *  org.springframework.web.bind.annotation.CrossOrigin
 *  org.springframework.web.bind.annotation.DeleteMapping
 *  org.springframework.web.bind.annotation.GetMapping
 *  org.springframework.web.bind.annotation.PatchMapping
 *  org.springframework.web.bind.annotation.PathVariable
 *  org.springframework.web.bind.annotation.PostMapping
 *  org.springframework.web.bind.annotation.PutMapping
 *  org.springframework.web.bind.annotation.RequestBody
 *  org.springframework.web.bind.annotation.RequestMapping
 *  org.springframework.web.bind.annotation.RequestParam
 *  org.springframework.web.bind.annotation.RequestPart
 *  org.springframework.web.bind.annotation.RestController
 *  org.springframework.web.multipart.MultipartFile
 */
package com.styliste.controller;

import com.styliste.dto.CreateProductRequest;
import com.styliste.dto.ProductDTO;
import com.styliste.dto.ProductFilterRequest;
import com.styliste.dto.UpdateProductRequest;
import com.styliste.repository.AttributeRepository;
import com.styliste.service.FileStorageService;
import com.styliste.service.ProductService;
import jakarta.validation.Valid;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping(value={"/api/products"})
@CrossOrigin(origins={"*"})
public class ProductController {
    private static final Logger log = LoggerFactory.getLogger(ProductController.class);
    @Autowired
    private ProductService productService;
    @Autowired
    private FileStorageService fileStorageService;
    @Autowired
    private AttributeRepository attributeRepository;

    @PostMapping(consumes={"multipart/form-data"})
    @PreAuthorize(value="hasRole('ADMIN')")
    public ResponseEntity<ProductDTO> createProduct(@RequestPart(value="product") @Valid CreateProductRequest request, @RequestPart(value="imageFiles", required=false) List<MultipartFile> imageFiles, @RequestPart(value="videoFiles", required=false) List<MultipartFile> videoFiles) {
        log.info("Creating product with {} images and {} videos", (imageFiles != null ? imageFiles.size() : 0), (videoFiles != null ? videoFiles.size() : 0));
        ArrayList<String> savedImagePaths = new ArrayList<String>();
        if (imageFiles != null) {
            for (MultipartFile file : imageFiles) {
                savedImagePaths.add(this.fileStorageService.saveFile(file, "image"));
            }
        }
        request.setImages(savedImagePaths);
        ArrayList<String> savedVideoPaths = new ArrayList<String>();
        if (videoFiles != null) {
            for (MultipartFile file : videoFiles) {
                savedVideoPaths.add(this.fileStorageService.saveFile(file, "video"));
            }
        }
        request.setVideos(savedVideoPaths);
        return ResponseEntity.status((HttpStatusCode)HttpStatus.CREATED).body(this.productService.createProduct(request));
    }

    @GetMapping(value={"/filters"})
    public ResponseEntity<Map<String, List<String>>> getFilters() {
        return ResponseEntity.ok(this.productService.getProductFilters());
    }

    @GetMapping(value={"/{id}"})
    public ResponseEntity<ProductDTO> getProductById(@PathVariable Long id) {
        log.info("Fetching product with ID: {}", id);
        return ResponseEntity.ok(this.productService.getProductById(id));
    }

    @PutMapping(value={"/{id}"}, consumes={"multipart/form-data"})
    @PreAuthorize(value="hasRole('ADMIN')")
    public ResponseEntity<ProductDTO> updateProduct(@PathVariable Long id, @RequestPart(value="product") @Valid UpdateProductRequest request, @RequestPart(value="imageFiles", required=false) List<MultipartFile> imageFiles, @RequestPart(value="videoFiles", required=false) List<MultipartFile> videoFiles) {
        ArrayList<String> newImagePaths = new ArrayList<String>();
        if (imageFiles != null) {
            for (MultipartFile file : imageFiles) {
                newImagePaths.add(this.fileStorageService.saveFile(file, "image"));
            }
        }
        if (request.getImages() == null) {
            request.setImages(new ArrayList());
        }
        request.getImages().addAll(newImagePaths);
        ArrayList<String> newVideoPaths = new ArrayList<String>();
        if (videoFiles != null) {
            for (MultipartFile file : videoFiles) {
                newVideoPaths.add(this.fileStorageService.saveFile(file, "video"));
            }
        }
        if (request.getVideos() == null) {
            request.setVideos(new ArrayList());
        }
        request.getVideos().addAll(newVideoPaths);
        return ResponseEntity.ok(this.productService.updateProduct(id, request));
    }

    @DeleteMapping(value={"/{id}"})
    @PreAuthorize(value="hasRole('ADMIN')")
    public ResponseEntity<String> deleteProduct(@PathVariable Long id) {
        log.info("Deleting product with ID: {}", id);
        this.productService.deleteProduct(id);
        return ResponseEntity.ok("Product deleted successfully");
    }

    @PatchMapping(value={"/{id}/deactivate"})
    @PreAuthorize(value="hasRole('ADMIN')")
    public ResponseEntity<String> deactivateProduct(@PathVariable Long id) {
        log.info("Deactivating product with ID: {}", id);
        this.productService.softDeleteProduct(id);
        return ResponseEntity.ok("Product deactivated successfully");
    }

    @PatchMapping(value={"/{id}/activate"})
    @PreAuthorize(value="hasRole('ADMIN')")
    public ResponseEntity<Void> activateProduct(@PathVariable Long id) {
        this.productService.activateProduct(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<Page<ProductDTO>> getAllProducts(@RequestParam(required=false) Integer page, @RequestParam(required=false) Integer pageSize) {
        log.info("Fetching all products");
        return ResponseEntity.ok(this.productService.getAllProducts(page, pageSize));
    }

    @PostMapping(value={"/search"})
    public ResponseEntity<Page<ProductDTO>> searchProducts(@RequestBody ProductFilterRequest filterRequest) {
        log.info("Searching products with filters");
        return ResponseEntity.ok(this.productService.searchProducts(filterRequest));
    }

    @GetMapping(value={"/category/{category}"})
    public ResponseEntity<List<ProductDTO>> getProductsByCategory(@PathVariable String category) {
        log.info("Fetching products by category: {}", category);
        return ResponseEntity.ok(this.productService.getProductsByCategory(category));
    }

    @GetMapping(value={"/subcategory/{subcategory}"})
    public ResponseEntity<List<ProductDTO>> getProductsBySubcategory(@PathVariable String subcategory) {
        log.info("Fetching products by subcategory: {}", subcategory);
        return ResponseEntity.ok(this.productService.getProductsBySubcategory(subcategory));
    }
}

