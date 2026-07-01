/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  com.styliste.entity.Attribute
 *  com.styliste.entity.OrderItem
 *  com.styliste.entity.Product
 *  com.styliste.entity.Product$ProductBuilder
 *  jakarta.persistence.CascadeType
 *  jakarta.persistence.CollectionTable
 *  jakarta.persistence.Column
 *  jakarta.persistence.ElementCollection
 *  jakarta.persistence.Entity
 *  jakarta.persistence.FetchType
 *  jakarta.persistence.GeneratedValue
 *  jakarta.persistence.GenerationType
 *  jakarta.persistence.Id
 *  jakarta.persistence.JoinColumn
 *  jakarta.persistence.JoinTable
 *  jakarta.persistence.ManyToMany
 *  jakarta.persistence.OneToMany
 *  jakarta.persistence.PrePersist
 *  jakarta.persistence.PreUpdate
 *  jakarta.persistence.Table
 *  jakarta.persistence.Version
 */
package com.styliste.entity;

import com.styliste.entity.Attribute;
import com.styliste.entity.OrderItem;
import com.styliste.entity.Product;
import jakarta.persistence.CascadeType;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.persistence.Version;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name="products")
@lombok.Builder
@lombok.extern.jackson.Jacksonized
public class Product {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;
    @Column(nullable=false, length=200)
    private String name;
    @Column(name="description", columnDefinition="MEDIUMTEXT")
    private String description;
    @Column(nullable=false, precision=10, scale=2)
    private BigDecimal price;
    @Column(name="sale_price", precision=10, scale=2)
    private BigDecimal salePrice;
    @Column(nullable=false)
    private Integer stock;
    @Version
    @Column(name="version", nullable=false)
    private Long version = 0L;
    @Column(name="category", length=50)
    private String category;
    @Column(name="subcategory", length=50)
    private String subcategory;
    @ElementCollection(fetch=FetchType.EAGER)
    @CollectionTable(name="product_images", joinColumns={@JoinColumn(name="product_id")})
    @Column(name="image_url", columnDefinition="TEXT")
    private List<String> images;
    @ElementCollection(fetch=FetchType.EAGER)
    @CollectionTable(name="product_videos", joinColumns={@JoinColumn(name="product_id")})
    @Column(name="video_url", columnDefinition="TEXT")
    private List<String> videos;
    @ManyToMany(fetch=FetchType.LAZY)
    @JoinTable(name="product_attribute_mapping", joinColumns={@JoinColumn(name="product_id")}, inverseJoinColumns={@JoinColumn(name="attribute_id")})
    private List<Attribute> attributes;
    @Column(name="created_at", nullable=false, updatable=false)
    private LocalDateTime createdAt;
    @Column(name="updated_at")
    private LocalDateTime updatedAt;
    @Column(nullable=false)
    private Boolean isActive = true;
    @OneToMany(mappedBy="product", cascade={CascadeType.ALL}, orphanRemoval=true, fetch=FetchType.LAZY)
    private List<OrderItem> orderItems;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    

    public Long getId() {
        return this.id;
    }

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

    public Long getVersion() {
        return this.version;
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

    public List<Attribute> getAttributes() {
        return this.attributes;
    }

    public LocalDateTime getCreatedAt() {
        return this.createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return this.updatedAt;
    }

    public Boolean getIsActive() {
        return this.isActive;
    }

    public List<OrderItem> getOrderItems() {
        return this.orderItems;
    }

    public void setId(Long id) {
        this.id = id;
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

    public void setVersion(Long version) {
        this.version = version;
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

    public void setAttributes(List<Attribute> attributes) {
        this.attributes = attributes;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    public void setOrderItems(List<OrderItem> orderItems) {
        this.orderItems = orderItems;
    }

    public boolean equals(Object o) {
        if (o == this) {
            return true;
        }
        if (!(o instanceof Product)) {
            return false;
        }
        Product other = (Product)o;
        if (!other.canEqual(this)) {
            return false;
        }
        Long this$id = this.getId();
        Long other$id = other.getId();
        if (this$id == null ? other$id != null : !(this$id).equals(other$id)) {
            return false;
        }
        Integer this$stock = this.getStock();
        Integer other$stock = other.getStock();
        if (this$stock == null ? other$stock != null : !(this$stock).equals(other$stock)) {
            return false;
        }
        Long this$version = this.getVersion();
        Long other$version = other.getVersion();
        if (this$version == null ? other$version != null : !(this$version).equals(other$version)) {
            return false;
        }
        Boolean this$isActive = this.getIsActive();
        Boolean other$isActive = other.getIsActive();
        if (this$isActive == null ? other$isActive != null : !(this$isActive).equals(other$isActive)) {
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
        if (this$attributes == null ? other$attributes != null : !(this$attributes).equals(other$attributes)) {
            return false;
        }
        LocalDateTime this$createdAt = this.getCreatedAt();
        LocalDateTime other$createdAt = other.getCreatedAt();
        if (this$createdAt == null ? other$createdAt != null : !(this$createdAt).equals(other$createdAt)) {
            return false;
        }
        LocalDateTime this$updatedAt = this.getUpdatedAt();
        LocalDateTime other$updatedAt = other.getUpdatedAt();
        if (this$updatedAt == null ? other$updatedAt != null : !(this$updatedAt).equals(other$updatedAt)) {
            return false;
        }
        List this$orderItems = this.getOrderItems();
        List other$orderItems = other.getOrderItems();
        return !(this$orderItems == null ? other$orderItems != null : !(this$orderItems).equals(other$orderItems));
    }

    protected boolean canEqual(Object other) {
        return other instanceof Product;
    }

    public int hashCode() {
        int PRIME = 59;
        int result = 1;
        Long $id = this.getId();
        result = result * 59 + ($id == null ? 43 : ($id).hashCode());
        Integer $stock = this.getStock();
        result = result * 59 + ($stock == null ? 43 : ($stock).hashCode());
        Long $version = this.getVersion();
        result = result * 59 + ($version == null ? 43 : ($version).hashCode());
        Boolean $isActive = this.getIsActive();
        result = result * 59 + ($isActive == null ? 43 : ($isActive).hashCode());
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
        LocalDateTime $createdAt = this.getCreatedAt();
        result = result * 59 + ($createdAt == null ? 43 : ($createdAt).hashCode());
        LocalDateTime $updatedAt = this.getUpdatedAt();
        result = result * 59 + ($updatedAt == null ? 43 : ($updatedAt).hashCode());
        List $orderItems = this.getOrderItems();
        result = result * 59 + ($orderItems == null ? 43 : ($orderItems).hashCode());
        return result;
    }

    public String toString() {
        return "Product(id=" + this.getId() + ", name=" + this.getName() + ", description=" + this.getDescription() + ", price=" + String.valueOf(this.getPrice()) + ", salePrice=" + String.valueOf(this.getSalePrice()) + ", stock=" + this.getStock() + ", version=" + this.getVersion() + ", category=" + this.getCategory() + ", subcategory=" + this.getSubcategory() + ", images=" + String.valueOf(this.getImages()) + ", videos=" + String.valueOf(this.getVideos()) + ", attributes=" + String.valueOf(this.getAttributes()) + ", createdAt=" + String.valueOf(this.getCreatedAt()) + ", updatedAt=" + String.valueOf(this.getUpdatedAt()) + ", isActive=" + this.getIsActive() + ", orderItems=" + String.valueOf(this.getOrderItems()) + ")";
    }

    public Product() {
    }

    public Product(Long id, String name, String description, BigDecimal price, BigDecimal salePrice, Integer stock, Long version, String category, String subcategory, List<String> images, List<String> videos, List<Attribute> attributes, LocalDateTime createdAt, LocalDateTime updatedAt, Boolean isActive, List<OrderItem> orderItems) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.salePrice = salePrice;
        this.stock = stock;
        this.version = version;
        this.category = category;
        this.subcategory = subcategory;
        this.images = images;
        this.videos = videos;
        this.attributes = attributes;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.isActive = isActive;
        this.orderItems = orderItems;
    }
}

