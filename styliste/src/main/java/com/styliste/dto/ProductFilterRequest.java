/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  com.styliste.dto.ProductFilterRequest
 *  com.styliste.dto.ProductFilterRequest$ProductFilterRequestBuilder
 */
package com.styliste.dto;

import com.styliste.dto.ProductFilterRequest;
import java.math.BigDecimal;
import java.util.List;

@lombok.Builder
@lombok.extern.jackson.Jacksonized
public class ProductFilterRequest {
    private String category;
    private String subcategory;
    private BigDecimal minPrice;
    private BigDecimal maxPrice;
    private String searchQuery;
    private String sortBy;
    private String sortOrder;
    private Integer page;
    private Integer pageSize;
    private List<String> colors;
    private List<String> sizes;

    

    public String getCategory() {
        return this.category;
    }

    public String getSubcategory() {
        return this.subcategory;
    }

    public BigDecimal getMinPrice() {
        return this.minPrice;
    }

    public BigDecimal getMaxPrice() {
        return this.maxPrice;
    }

    public String getSearchQuery() {
        return this.searchQuery;
    }

    public String getSortBy() {
        return this.sortBy;
    }

    public String getSortOrder() {
        return this.sortOrder;
    }

    public Integer getPage() {
        return this.page;
    }

    public Integer getPageSize() {
        return this.pageSize;
    }

    public List<String> getColors() {
        return this.colors;
    }

    public List<String> getSizes() {
        return this.sizes;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public void setSubcategory(String subcategory) {
        this.subcategory = subcategory;
    }

    public void setMinPrice(BigDecimal minPrice) {
        this.minPrice = minPrice;
    }

    public void setMaxPrice(BigDecimal maxPrice) {
        this.maxPrice = maxPrice;
    }

    public void setSearchQuery(String searchQuery) {
        this.searchQuery = searchQuery;
    }

    public void setSortBy(String sortBy) {
        this.sortBy = sortBy;
    }

    public void setSortOrder(String sortOrder) {
        this.sortOrder = sortOrder;
    }

    public void setPage(Integer page) {
        this.page = page;
    }

    public void setPageSize(Integer pageSize) {
        this.pageSize = pageSize;
    }

    public void setColors(List<String> colors) {
        this.colors = colors;
    }

    public void setSizes(List<String> sizes) {
        this.sizes = sizes;
    }

    public boolean equals(Object o) {
        if (o == this) {
            return true;
        }
        if (!(o instanceof ProductFilterRequest)) {
            return false;
        }
        ProductFilterRequest other = (ProductFilterRequest)o;
        if (!other.canEqual(this)) {
            return false;
        }
        Integer this$page = this.getPage();
        Integer other$page = other.getPage();
        if (this$page == null ? other$page != null : !(this$page).equals(other$page)) {
            return false;
        }
        Integer this$pageSize = this.getPageSize();
        Integer other$pageSize = other.getPageSize();
        if (this$pageSize == null ? other$pageSize != null : !(this$pageSize).equals(other$pageSize)) {
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
        BigDecimal this$minPrice = this.getMinPrice();
        BigDecimal other$minPrice = other.getMinPrice();
        if (this$minPrice == null ? other$minPrice != null : !(this$minPrice).equals(other$minPrice)) {
            return false;
        }
        BigDecimal this$maxPrice = this.getMaxPrice();
        BigDecimal other$maxPrice = other.getMaxPrice();
        if (this$maxPrice == null ? other$maxPrice != null : !(this$maxPrice).equals(other$maxPrice)) {
            return false;
        }
        String this$searchQuery = this.getSearchQuery();
        String other$searchQuery = other.getSearchQuery();
        if (this$searchQuery == null ? other$searchQuery != null : !this$searchQuery.equals(other$searchQuery)) {
            return false;
        }
        String this$sortBy = this.getSortBy();
        String other$sortBy = other.getSortBy();
        if (this$sortBy == null ? other$sortBy != null : !this$sortBy.equals(other$sortBy)) {
            return false;
        }
        String this$sortOrder = this.getSortOrder();
        String other$sortOrder = other.getSortOrder();
        if (this$sortOrder == null ? other$sortOrder != null : !this$sortOrder.equals(other$sortOrder)) {
            return false;
        }
        List this$colors = this.getColors();
        List other$colors = other.getColors();
        if (this$colors == null ? other$colors != null : !(this$colors).equals(other$colors)) {
            return false;
        }
        List this$sizes = this.getSizes();
        List other$sizes = other.getSizes();
        return !(this$sizes == null ? other$sizes != null : !(this$sizes).equals(other$sizes));
    }

    protected boolean canEqual(Object other) {
        return other instanceof ProductFilterRequest;
    }

    public int hashCode() {
        int PRIME = 59;
        int result = 1;
        Integer $page = this.getPage();
        result = result * 59 + ($page == null ? 43 : ($page).hashCode());
        Integer $pageSize = this.getPageSize();
        result = result * 59 + ($pageSize == null ? 43 : ($pageSize).hashCode());
        String $category = this.getCategory();
        result = result * 59 + ($category == null ? 43 : $category.hashCode());
        String $subcategory = this.getSubcategory();
        result = result * 59 + ($subcategory == null ? 43 : $subcategory.hashCode());
        BigDecimal $minPrice = this.getMinPrice();
        result = result * 59 + ($minPrice == null ? 43 : ($minPrice).hashCode());
        BigDecimal $maxPrice = this.getMaxPrice();
        result = result * 59 + ($maxPrice == null ? 43 : ($maxPrice).hashCode());
        String $searchQuery = this.getSearchQuery();
        result = result * 59 + ($searchQuery == null ? 43 : $searchQuery.hashCode());
        String $sortBy = this.getSortBy();
        result = result * 59 + ($sortBy == null ? 43 : $sortBy.hashCode());
        String $sortOrder = this.getSortOrder();
        result = result * 59 + ($sortOrder == null ? 43 : $sortOrder.hashCode());
        List $colors = this.getColors();
        result = result * 59 + ($colors == null ? 43 : ($colors).hashCode());
        List $sizes = this.getSizes();
        result = result * 59 + ($sizes == null ? 43 : ($sizes).hashCode());
        return result;
    }

    public String toString() {
        return "ProductFilterRequest(category=" + this.getCategory() + ", subcategory=" + this.getSubcategory() + ", minPrice=" + String.valueOf(this.getMinPrice()) + ", maxPrice=" + String.valueOf(this.getMaxPrice()) + ", searchQuery=" + this.getSearchQuery() + ", sortBy=" + this.getSortBy() + ", sortOrder=" + this.getSortOrder() + ", page=" + this.getPage() + ", pageSize=" + this.getPageSize() + ", colors=" + String.valueOf(this.getColors()) + ", sizes=" + String.valueOf(this.getSizes()) + ")";
    }

    public ProductFilterRequest() {
    }

    public ProductFilterRequest(String category, String subcategory, BigDecimal minPrice, BigDecimal maxPrice, String searchQuery, String sortBy, String sortOrder, Integer page, Integer pageSize, List<String> colors, List<String> sizes) {
        this.category = category;
        this.subcategory = subcategory;
        this.minPrice = minPrice;
        this.maxPrice = maxPrice;
        this.searchQuery = searchQuery;
        this.sortBy = sortBy;
        this.sortOrder = sortOrder;
        this.page = page;
        this.pageSize = pageSize;
        this.colors = colors;
        this.sizes = sizes;
    }
}

