/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  com.styliste.entity.Category
 *  com.styliste.entity.SubCategory
 *  com.styliste.exception.BadRequestException
 *  com.styliste.exception.ResourceAlreadyExistsException
 *  com.styliste.exception.ResourceNotFoundException
 *  com.styliste.repository.CategoryRepository
 *  com.styliste.repository.ProductRepository
 *  com.styliste.repository.SubCategoryRepository
 *  com.styliste.service.CategoryService
 *  org.springframework.stereotype.Service
 *  org.springframework.transaction.annotation.Transactional
 */
package com.styliste.service;

import com.styliste.entity.Category;
import com.styliste.entity.SubCategory;
import com.styliste.exception.BadRequestException;
import com.styliste.exception.ResourceAlreadyExistsException;
import com.styliste.exception.ResourceNotFoundException;
import com.styliste.repository.CategoryRepository;
import com.styliste.repository.ProductRepository;
import com.styliste.repository.SubCategoryRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class CategoryService {
    private final CategoryRepository categoryRepository;
    private final SubCategoryRepository subCategoryRepository;
    private final ProductRepository productRepository;

    public List<Category> getAllCategories() {
        return this.categoryRepository.findAll();
    }

    public List<Category> getActiveCategories() {
        return this.categoryRepository.findByIsActiveTrue();
    }

    public Category createCategory(String name, String description) {
        if (this.categoryRepository.existsByName(name)) {
            throw new ResourceAlreadyExistsException("Category named '" + name + "' already exists.");
        }
        Category category = Category.builder().name(name).description(description).isActive(true).build();
        return (Category)this.categoryRepository.save(category);
    }

    public Category updateCategory(Long id, String name, String description) {
        Category category = (Category)this.categoryRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + id));
        if (name != null && !category.getName().equalsIgnoreCase(name)) {
            if (this.categoryRepository.existsByName(name)) {
                throw new ResourceAlreadyExistsException("Category name '" + name + "' is already taken.");
            }
            category.setName(name);
        }
        if (description != null) {
            category.setDescription(description);
        }
        return (Category)this.categoryRepository.save(category);
    }

    public void deleteCategory(Long id) {
        Category category = (Category)this.categoryRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Category not found."));
        if (category.getSubCategories() != null && !category.getSubCategories().isEmpty()) {
            throw new BadRequestException("Cannot delete category. An associated sub-category is present (" + category.getSubCategories().size() + " found).");
        }
        this.categoryRepository.delete(category);
    }

    public SubCategory createSubCategory(Long categoryId, String name, String description) {
        Category category = (Category)this.categoryRepository.findById(categoryId).orElseThrow(() -> new ResourceNotFoundException("Parent Category not found."));
        if (this.subCategoryRepository.existsByNameAndCategoryId(name, categoryId)) {
            throw new ResourceAlreadyExistsException("Sub-category '" + name + "' already exists under " + category.getName());
        }
        SubCategory subCategory = SubCategory.builder().name(name).description(description).category(category).build();
        return (SubCategory)this.subCategoryRepository.save(subCategory);
    }

    public SubCategory updateSubCategory(Long subId, String name, String description) {
        SubCategory sub = (SubCategory)this.subCategoryRepository.findById(subId).orElseThrow(() -> new ResourceNotFoundException("Sub-category not found with ID: " + subId));
        if (name != null && !sub.getName().equalsIgnoreCase(name)) {
            if (this.subCategoryRepository.existsByNameAndCategoryId(name, sub.getCategory().getId())) {
                throw new ResourceAlreadyExistsException("Another sub-category named '" + name + "' already exists in this category.");
            }
            sub.setName(name);
        }
        if (description != null) {
            sub.setDescription(description);
        }
        return (SubCategory)this.subCategoryRepository.save(sub);
    }

    public void deleteSubCategory(Long subId) {
        SubCategory subCategory = (SubCategory)this.subCategoryRepository.findById(subId).orElseThrow(() -> new ResourceNotFoundException("Sub-category not found."));
        boolean hasProducts = this.productRepository.existsBySubcategory(subCategory.getName());
        if (hasProducts) {
            throw new BadRequestException("Cannot delete sub-category '" + subCategory.getName() + "'. There are existing products associated with it.");
        }
        this.subCategoryRepository.delete(subCategory);
    }

    public CategoryService(CategoryRepository categoryRepository, SubCategoryRepository subCategoryRepository, ProductRepository productRepository) {
        this.categoryRepository = categoryRepository;
        this.subCategoryRepository = subCategoryRepository;
        this.productRepository = productRepository;
    }
}

