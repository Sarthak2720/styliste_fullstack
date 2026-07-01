/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  com.styliste.dto.CreateProductRequest
 *  com.styliste.dto.ProductAttributeDTO
 *  com.styliste.dto.ProductDTO
 *  com.styliste.dto.ProductFilterRequest
 *  com.styliste.dto.UpdateProductRequest
 *  com.styliste.entity.Attribute
 *  com.styliste.entity.Product
 *  com.styliste.exception.BadRequestException
 *  com.styliste.exception.ResourceNotFoundException
 *  com.styliste.repository.AttributeRepository
 *  com.styliste.repository.ProductRepository
 *  com.styliste.service.ProductService
 *  jakarta.persistence.criteria.Expression
 *  jakarta.persistence.criteria.Join
 *  jakarta.persistence.criteria.Predicate
 *  org.slf4j.Logger
 *  org.slf4j.LoggerFactory
 *  org.springframework.beans.factory.annotation.Autowired
 *  org.springframework.data.domain.Page
 *  org.springframework.data.domain.PageRequest
 *  org.springframework.data.domain.Pageable
 *  org.springframework.data.domain.Sort
 *  org.springframework.data.domain.Sort$Direction
 *  org.springframework.data.jpa.domain.Specification
 *  org.springframework.stereotype.Service
 *  org.springframework.transaction.annotation.Transactional
 *  org.springframework.util.StringUtils
 */
package com.styliste.service;

import com.styliste.dto.CreateProductRequest;
import com.styliste.dto.ProductAttributeDTO;
import com.styliste.dto.ProductDTO;
import com.styliste.dto.ProductFilterRequest;
import com.styliste.dto.UpdateProductRequest;
import com.styliste.entity.Attribute;
import com.styliste.entity.Product;
import com.styliste.exception.BadRequestException;
import com.styliste.exception.ResourceNotFoundException;
import com.styliste.repository.AttributeRepository;
import com.styliste.repository.ProductRepository;
import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Service
@Transactional
public class ProductService {
    private static final Logger log = LoggerFactory.getLogger(ProductService.class);
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private AttributeRepository attributeRepository;

    public ProductDTO createProduct(CreateProductRequest request) {
        log.info("Creating product: {}", request.getName());
        if (request.getSalePrice() != null && request.getSalePrice().compareTo(request.getPrice()) > 0) {
            throw new BadRequestException("Sale price cannot be greater than regular price");
        }
        Product product = Product.builder().name(request.getName()).description(request.getDescription()).price(request.getPrice()).salePrice(request.getSalePrice()).stock(request.getStock()).category(request.getCategory()).subcategory(request.getSubcategory()).images(request.getImages()).videos(request.getVideos()).attributes(request.getAttributes() != null ? this.syncAttributes(request.getAttributes()) : new ArrayList()).isActive(Boolean.valueOf(true)).build();
        Product savedProduct = (Product)this.productRepository.save(product);
        log.info("Product created with ID: {}", savedProduct.getId());
        return this.mapToDTO(savedProduct);
    }

    public Map<String, List<String>> getProductFilters() {
        log.info("Fetching all active product filters");
        List<com.styliste.entity.Attribute> allAttributes = this.attributeRepository.findAll();
        return allAttributes.stream().collect(Collectors.groupingBy(Attribute::getType, Collectors.mapping(Attribute::getValue, Collectors.toList())));
    }

    private List<Attribute> syncAttributes(List<ProductAttributeDTO> dtos) {
        if (dtos == null) {
            return new ArrayList<Attribute>();
        }
        return dtos.stream().map(dto -> this.attributeRepository.findByTypeAndValue(dto.getType(), dto.getValue()).orElseGet(() -> (Attribute)this.attributeRepository.save(Attribute.builder().type(dto.getType()).value(dto.getValue()).build()))).collect(Collectors.toList());
    }

    private void cleanupOrphanAttributes(List<Attribute> attributesToCheck) {
        if (attributesToCheck == null) {
            return;
        }
        for (Attribute attr : attributesToCheck) {
            long count = this.attributeRepository.countProductsUsingAttribute(attr.getId());
            if (count != 0L) continue;
            log.info("Deleting unused attribute: {} - {}", attr.getType(), attr.getValue());
            this.attributeRepository.delete(attr);
        }
    }

    public ProductDTO getProductById(Long id) {
        log.debug("Fetching product with ID: {}", id);
        Product product = (Product)this.productRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Product not found with ID: " + id));
        return this.mapToDTO(product);
    }

    public ProductDTO updateProduct(Long id, UpdateProductRequest request) {
        log.info("Updating product with ID: {}", id);
        Product product = (Product)this.productRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Product not found with ID: " + id));
        ArrayList oldAttributes = new ArrayList(product.getAttributes());
        if (request.getName() != null) {
            product.setName(request.getName());
        }
        if (request.getDescription() != null) {
            product.setDescription(request.getDescription());
        }
        if (request.getPrice() != null) {
            product.setPrice(request.getPrice());
        }
        if (request.getSalePrice() != null) {
            product.setSalePrice(request.getSalePrice());
        }
        if (request.getStock() != null) {
            product.setStock(request.getStock());
        }
        if (request.getCategory() != null) {
            product.setCategory(request.getCategory());
        }
        if (request.getSubcategory() != null) {
            product.setSubcategory(request.getSubcategory());
        }
        if (request.getImages() != null) {
            product.setImages(request.getImages());
        }
        if (request.getVideos() != null) {
            product.setVideos(request.getVideos());
        }
        if (request.getAttributes() != null) {
            product.setAttributes(this.syncAttributes(request.getAttributes()));
        }
        if (request.getIsActive() != null) {
            product.setIsActive(request.getIsActive());
        }
        Product updatedProduct = (Product)this.productRepository.save(product);
        this.cleanupOrphanAttributes(oldAttributes);
        log.info("Product updated successfully");
        return this.mapToDTO(updatedProduct);
    }

    public void deleteProduct(Long id) {
        Product product = (Product)this.productRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        ArrayList attributesToClean = new ArrayList(product.getAttributes());
        this.productRepository.delete(product);
        this.cleanupOrphanAttributes(attributesToClean);
    }

    public void softDeleteProduct(Long id) {
        log.info("Soft deleting product with ID: {}", id);
        Product product = (Product)this.productRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Product not found with ID: " + id));
        product.setIsActive(Boolean.valueOf(false));
        this.productRepository.save(product);
        log.info("Product soft deleted successfully");
    }

    public void activateProduct(Long id) {
        Product product = (Product)this.productRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        product.setIsActive(Boolean.valueOf(true));
        this.productRepository.save(product);
    }

    public Page<ProductDTO> searchProducts(ProductFilterRequest filterRequest) {
        log.info("Searching products with dynamic filters");
        int page = filterRequest.getPage() != null ? filterRequest.getPage() : 0;
        int pageSize = filterRequest.getPageSize() != null ? filterRequest.getPageSize() : 12;
        Sort.Direction direction = Sort.Direction.DESC;
        if ("ASC".equalsIgnoreCase(filterRequest.getSortOrder())) {
            direction = Sort.Direction.ASC;
        }
        String sortBy = StringUtils.hasText((String)filterRequest.getSortBy()) ? filterRequest.getSortBy() : "createdAt";
        PageRequest pageable = PageRequest.of((int)page, (int)pageSize, (Sort)Sort.by((Sort.Direction)direction, (String[])new String[]{sortBy}));
        Specification spec = this.createSpecification(filterRequest);
        Page<com.styliste.entity.Product> products = this.productRepository.findAll(spec, (Pageable)pageable);
        return products.map(arg_0 -> this.mapToDTO(arg_0));
    }

    private Specification<Product> createSpecification(ProductFilterRequest request) {
        return (Specification & Serializable)(root, query, criteriaBuilder) -> {
            Predicate valueInList;
            ArrayList<Predicate> predicates = new ArrayList<Predicate>();
            if (StringUtils.hasText((String)request.getCategory())) {
                predicates.add(criteriaBuilder.equal((Expression)root.get("category"), request.getCategory()));
            }
            if (StringUtils.hasText((String)request.getSubcategory())) {
                predicates.add(criteriaBuilder.equal((Expression)root.get("subcategory"), request.getSubcategory()));
            }
            if (request.getMinPrice() != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo((Expression)root.get("price"), (Comparable)request.getMinPrice()));
            }
            if (request.getMaxPrice() != null) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo((Expression)root.get("price"), (Comparable)request.getMaxPrice()));
            }
            if (StringUtils.hasText((String)request.getSearchQuery())) {
                String pattern = "%" + request.getSearchQuery().toLowerCase() + "%";
                Predicate nameMatch = criteriaBuilder.like(criteriaBuilder.lower((Expression)root.get("name")), pattern);
                Predicate descMatch = criteriaBuilder.like(criteriaBuilder.lower((Expression)root.get("description")), pattern);
                predicates.add(criteriaBuilder.or((Expression)nameMatch, (Expression)descMatch));
            }
            if (request.getColors() != null && !request.getColors().isEmpty()) {
                Join colorJoin = root.join("attributes");
                Predicate isColor = criteriaBuilder.equal(criteriaBuilder.upper((Expression)colorJoin.get("type")), "COLOR");
                valueInList = criteriaBuilder.upper((Expression)colorJoin.get("value")).in(request.getColors().stream().map(String::toUpperCase).toList());
                predicates.add(criteriaBuilder.and((Expression)isColor, (Expression)valueInList));
            }
            if (request.getSizes() != null && !request.getSizes().isEmpty()) {
                Join sizeJoin = root.join("attributes");
                Predicate isSize = criteriaBuilder.equal(criteriaBuilder.upper((Expression)sizeJoin.get("type")), "SIZE");
                valueInList = criteriaBuilder.upper((Expression)sizeJoin.get("value")).in(request.getSizes().stream().map(String::toUpperCase).toList());
                predicates.add(criteriaBuilder.and((Expression)isSize, (Expression)valueInList));
            }
            query.distinct(true);
            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }

    public Page<ProductDTO> getAllProducts(Integer page, Integer pageSize) {
        log.debug("Fetching all products");
        int pageNum = page != null ? page : 0;
        int size = pageSize != null ? pageSize : 12;
        PageRequest pageable = PageRequest.of((int)pageNum, (int)size, (Sort)Sort.by((String[])new String[]{"createdAt"}).descending());
        return this.productRepository.findAll((Pageable)pageable).map(arg_0 -> this.mapToDTO(arg_0));
    }

    public List<ProductDTO> getProductsByCategory(String category) {
        log.debug("Fetching products by category: {}", category);
        return this.productRepository.findByCategory(category).stream().map(arg_0 -> this.mapToDTO(arg_0)).collect(Collectors.toList());
    }

    public List<ProductDTO> getProductsBySubcategory(String subcategory) {
        log.debug("Fetching products by subcategory: {}", subcategory);
        return this.productRepository.findBySubcategory(subcategory).stream().map(arg_0 -> this.mapToDTO(arg_0)).collect(Collectors.toList());
    }

    private ProductDTO mapToDTO(Product product) {
        return ProductDTO.builder().id(product.getId()).name(product.getName()).description(product.getDescription()).price(product.getPrice()).salePrice(product.getSalePrice()).stock(product.getStock()).category(product.getCategory()).subcategory(product.getSubcategory()).images(product.getImages()).videos(product.getVideos()).attributes(this.mapEntitiesToAttributeDTOs(product.getAttributes())).isActive(product.getIsActive()).build();
    }

    private List<ProductAttributeDTO> mapEntitiesToAttributeDTOs(List<Attribute> attributes) {
        if (attributes == null) {
            return new ArrayList<ProductAttributeDTO>();
        }
        return attributes.stream().map(attr -> ProductAttributeDTO.builder().type(attr.getType()).value(attr.getValue()).build()).collect(Collectors.toList());
    }
}

