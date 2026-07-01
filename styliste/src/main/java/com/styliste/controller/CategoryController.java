/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  com.styliste.controller.CategoryController
 *  com.styliste.entity.Category
 *  com.styliste.entity.SubCategory
 *  com.styliste.repository.CategoryRepository
 *  com.styliste.repository.SubCategoryRepository
 *  com.styliste.service.CategoryService
 *  org.springframework.http.ResponseEntity
 *  org.springframework.security.access.prepost.PreAuthorize
 *  org.springframework.web.bind.annotation.CrossOrigin
 *  org.springframework.web.bind.annotation.DeleteMapping
 *  org.springframework.web.bind.annotation.GetMapping
 *  org.springframework.web.bind.annotation.PathVariable
 *  org.springframework.web.bind.annotation.PostMapping
 *  org.springframework.web.bind.annotation.PutMapping
 *  org.springframework.web.bind.annotation.RequestBody
 *  org.springframework.web.bind.annotation.RequestMapping
 *  org.springframework.web.bind.annotation.RestController
 */
package com.styliste.controller;

import com.styliste.entity.Category;
import com.styliste.entity.SubCategory;
import com.styliste.repository.CategoryRepository;
import com.styliste.repository.SubCategoryRepository;
import com.styliste.service.CategoryService;
import java.util.List;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value={"/api/categories"})
@CrossOrigin(origins={"*"})
public class CategoryController {
    private final CategoryService categoryService;
    private final CategoryRepository categoryRepository;
    private final SubCategoryRepository subCategoryRepository;

    @GetMapping
    public ResponseEntity<List<Category>> getAllCategories() {
        return ResponseEntity.ok(this.categoryService.getAllCategories());
    }

    @PostMapping
    @PreAuthorize(value="hasRole('ADMIN')")
    public ResponseEntity<Category> createCategory(@RequestBody Map<String, String> payload) {
        String name = payload.get("name");
        String desc = payload.get("description");
        return ResponseEntity.ok(this.categoryService.createCategory(name, desc));
    }

    @PutMapping(value={"/{id}"})
    @PreAuthorize(value="hasRole('ADMIN')")
    public ResponseEntity<Category> updateCategory(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        return ResponseEntity.ok(this.categoryService.updateCategory(id, payload.get("name"), payload.get("description")));
    }

    @DeleteMapping(value={"/{id}"})
    @PreAuthorize(value="hasRole('ADMIN')")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        this.categoryService.deleteCategory(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping(value={"/{categoryId}/subcategories"})
    @PreAuthorize(value="hasRole('ADMIN')")
    public ResponseEntity<SubCategory> createSubCategory(@PathVariable(value="categoryId") Long categoryId, @RequestBody Map<String, String> payload) {
        String name = payload.get("name");
        String desc = payload.get("description");
        return ResponseEntity.ok(this.categoryService.createSubCategory(categoryId, name, desc));
    }

    @PutMapping(value={"/subcategories/{subId}"})
    @PreAuthorize(value="hasRole('ADMIN')")
    public ResponseEntity<SubCategory> updateSubCategory(@PathVariable Long subId, @RequestBody Map<String, String> payload) {
        return ResponseEntity.ok(this.categoryService.updateSubCategory(subId, payload.get("name"), payload.get("description")));
    }

    @DeleteMapping(value={"/subcategories/{subId}"})
    @PreAuthorize(value="hasRole('ADMIN')")
    public ResponseEntity<Void> deleteSubCategory(@PathVariable Long subId) {
        this.categoryService.deleteSubCategory(subId);
        return ResponseEntity.noContent().build();
    }

    public CategoryController(CategoryService categoryService, CategoryRepository categoryRepository, SubCategoryRepository subCategoryRepository) {
        this.categoryService = categoryService;
        this.categoryRepository = categoryRepository;
        this.subCategoryRepository = subCategoryRepository;
    }
}

