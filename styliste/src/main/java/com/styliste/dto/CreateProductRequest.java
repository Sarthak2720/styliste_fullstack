/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  com.styliste.dto.CreateProductRequest
 *  com.styliste.dto.CreateProductRequest$CreateProductRequestBuilder
 *  com.styliste.dto.ProductAttributeDTO
 *  jakarta.validation.constraints.DecimalMin
 *  jakarta.validation.constraints.Min
 *  jakarta.validation.constraints.NotBlank
 *  jakarta.validation.constraints.NotNull
 *  jakarta.validation.constraints.Size
 */
package com.styliste.dto;

import com.styliste.dto.CreateProductRequest;
import com.styliste.dto.ProductAttributeDTO;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.util.List;

@lombok.Builder
@lombok.extern.jackson.Jacksonized
public class CreateProductRequest {
    @NotBlank(message="Product name cannot be blank")
    @Size(min=3, max=200, message="Product name must be between 3 and 200 characters")
    private @NotBlank(message="Product name cannot be blank") @Size(min=3, max=200, message="Product name must be between 3 and 200 characters") String name;
    @NotBlank(message="Description cannot be blank")
    private @NotBlank(message="Description cannot be blank") String description;
    @NotNull(message="Price cannot be null")
    @DecimalMin(value="0.0", inclusive=false, message="Price must be greater than 0")
    private @NotNull(message="Price cannot be null") @DecimalMin(value="0.0", inclusive=false, message="Price must be greater than 0") BigDecimal price;
    @DecimalMin(value="0.0", message="Sale price must be greater than or equal to 0")
    private @DecimalMin(value="0.0", message="Sale price must be greater than or equal to 0") BigDecimal salePrice;
    @NotNull(message="Stock cannot be null")
    @Min(value=0L, message="Stock cannot be negative")
    private @NotNull(message="Stock cannot be null") @Min(value=0L, message="Stock cannot be negative") Integer stock;
    @NotBlank(message="Category cannot be blank")
    private @NotBlank(message="Category cannot be blank") String category;
    @NotBlank(message="Subcategory cannot be blank")
    private @NotBlank(message="Subcategory cannot be blank") String subcategory;
    private List<String> images;
    private List<String> videos;
    private List<ProductAttributeDTO> attributes;

    

    public String getName() {
        return this.name;
    }

    public String getDescription() {
        return this.description;
    }

    public BigDecimal getPrice() {
        return this.price;
    }

    public BigDecimal getSalePrice() {
        return this.salePrice;
    }

    public Integer getStock() {
        return this.stock;
    }

    public String getCategory() {
        return this.category;
    }

    public String getSubcategory() {
        return this.subcategory;
    }

    public List<String> getImages() {
        return this.images;
    }

    public List<String> getVideos() {
        return this.videos;
    }

    public List<ProductAttributeDTO> getAttributes() {
        return this.attributes;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public void setSalePrice(BigDecimal salePrice) {
        this.salePrice = salePrice;
    }

    public void setStock(Integer stock) {
        this.stock = stock;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public void setSubcategory(String subcategory) {
        this.subcategory = subcategory;
    }

    public void setImages(List<String> images) {
        this.images = images;
    }

    public void setVideos(List<String> videos) {
        this.videos = videos;
    }

    public void setAttributes(List<ProductAttributeDTO> attributes) {
        this.attributes = attributes;
    }

    public boolean equals(Object o) {
        if (o == this) {
            return true;
        }
        if (!(o instanceof CreateProductRequest)) {
            return false;
        }
        CreateProductRequest other = (CreateProductRequest)o;
        if (!other.canEqual(this)) {
            return false;
        }
        Integer this$stock = this.getStock();
        Integer other$stock = other.getStock();
        if (this$stock == null ? other$stock != null : !(this$stock).equals(other$stock)) {
            return false;
        }
        String this$name = this.getName();
        String other$name = other.getName();
        if (this$name == null ? other$name != null : !this$name.equals(other$name)) {
            return false;
        }
        String this$description = this.getDescription();
        String other$description = other.getDescription();
        if (this$description == null ? other$description != null : !this$description.equals(other$description)) {
            return false;
        }
        BigDecimal this$price = this.getPrice();
        BigDecimal other$price = other.getPrice();
        if (this$price == null ? other$price != null : !(this$price).equals(other$price)) {
            return false;
        }
        BigDecimal this$salePrice = this.getSalePrice();
        BigDecimal other$salePrice = other.getSalePrice();
        if (this$salePrice == null ? other$salePrice != null : !(this$salePrice).equals(other$salePrice)) {
            return false;
        }
        String this$category = this.getCategory();
        String other$category = other.getCategory();
        if (this$category == null ? other$category != null : !this$category.equals(other$category)) {
            return false;
        }
        String this$subcategory = this.getSubcategory();
        String other$subcategory = other.getSubcategory();
        if (this$subcategory == null ? other$subcategory != null : !this$subcategory.equals(other$subcategory)) {
            return false;
        }
        List this$images = this.getImages();
        List other$images = other.getImages();
        if (this$images == null ? other$images != null : !(this$images).equals(other$images)) {
            return false;
        }
        List this$videos = this.getVideos();
        List other$videos = other.getVideos();
        if (this$videos == null ? other$videos != null : !(this$videos).equals(other$videos)) {
            return false;
        }
        List this$attributes = this.getAttributes();
        List other$attributes = other.getAttributes();
        return !(this$attributes == null ? other$attributes != null : !(this$attributes).equals(other$attributes));
    }

    protected boolean canEqual(Object other) {
        return other instanceof CreateProductRequest;
    }

    public int hashCode() {
        int PRIME = 59;
        int result = 1;
        Integer $stock = this.getStock();
        result = result * 59 + ($stock == null ? 43 : ($stock).hashCode());
        String $name = this.getName();
        result = result * 59 + ($name == null ? 43 : $name.hashCode());
        String $description = this.getDescription();
        result = result * 59 + ($description == null ? 43 : $description.hashCode());
        BigDecimal $price = this.getPrice();
        result = result * 59 + ($price == null ? 43 : ($price).hashCode());
        BigDecimal $salePrice = this.getSalePrice();
        result = result * 59 + ($salePrice == null ? 43 : ($salePrice).hashCode());
        String $category = this.getCategory();
        result = result * 59 + ($category == null ? 43 : $category.hashCode());
        String $subcategory = this.getSubcategory();
        result = result * 59 + ($subcategory == null ? 43 : $subcategory.hashCode());
        List $images = this.getImages();
        result = result * 59 + ($images == null ? 43 : ($images).hashCode());
        List $videos = this.getVideos();
        result = result * 59 + ($videos == null ? 43 : ($videos).hashCode());
        List $attributes = this.getAttributes();
        result = result * 59 + ($attributes == null ? 43 : ($attributes).hashCode());
        return result;
    }

    public String toString() {
        return "CreateProductRequest(name=" + this.getName() + ", description=" + this.getDescription() + ", price=" + String.valueOf(this.getPrice()) + ", salePrice=" + String.valueOf(this.getSalePrice()) + ", stock=" + this.getStock() + ", category=" + this.getCategory() + ", subcategory=" + this.getSubcategory() + ", images=" + String.valueOf(this.getImages()) + ", videos=" + String.valueOf(this.getVideos()) + ", attributes=" + String.valueOf(this.getAttributes()) + ")";
    }

    public CreateProductRequest() {
    }

    public CreateProductRequest(String name, String description, BigDecimal price, BigDecimal salePrice, Integer stock, String category, String subcategory, List<String> images, List<String> videos, List<ProductAttributeDTO> attributes) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.salePrice = salePrice;
        this.stock = stock;
        this.category = category;
        this.subcategory = subcategory;
        this.images = images;
        this.videos = videos;
        this.attributes = attributes;
    }
}

