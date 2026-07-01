/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  com.fasterxml.jackson.annotation.JsonManagedReference
 *  com.styliste.entity.Category
 *  com.styliste.entity.Category$CategoryBuilder
 *  com.styliste.entity.SubCategory
 *  jakarta.persistence.CascadeType
 *  jakarta.persistence.Column
 *  jakarta.persistence.Entity
 *  jakarta.persistence.GeneratedValue
 *  jakarta.persistence.GenerationType
 *  jakarta.persistence.Id
 *  jakarta.persistence.OneToMany
 *  jakarta.persistence.Table
 */
package com.styliste.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.styliste.entity.Category;
import com.styliste.entity.SubCategory;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name="categories")
@lombok.Builder
@lombok.extern.jackson.Jacksonized
public class Category {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;
    @Column(nullable=false, unique=true)
    private String name;
    private String description;
    private boolean isActive = true;
    @OneToMany(mappedBy="category", cascade={CascadeType.ALL}, orphanRemoval=true)
    @JsonManagedReference
    private List<SubCategory> subCategories = new ArrayList();

    

    public Long getId() {
        return this.id;
    }

    public String getName() {
        return this.name;
    }

    public String getDescription() {
        return this.description;
    }

    public boolean isActive() {
        return this.isActive;
    }

    public List<SubCategory> getSubCategories() {
        return this.subCategories;
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

    public void setActive(boolean isActive) {
        this.isActive = isActive;
    }

    public void setSubCategories(List<SubCategory> subCategories) {
        this.subCategories = subCategories;
    }

    public boolean equals(Object o) {
        if (o == this) {
            return true;
        }
        if (!(o instanceof Category)) {
            return false;
        }
        Category other = (Category)o;
        if (!other.canEqual(this)) {
            return false;
        }
        if (this.isActive() != other.isActive()) {
            return false;
        }
        Long this$id = this.getId();
        Long other$id = other.getId();
        if (this$id == null ? other$id != null : !(this$id).equals(other$id)) {
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
        List this$subCategories = this.getSubCategories();
        List other$subCategories = other.getSubCategories();
        return !(this$subCategories == null ? other$subCategories != null : !(this$subCategories).equals(other$subCategories));
    }

    protected boolean canEqual(Object other) {
        return other instanceof Category;
    }

    public int hashCode() {
        int PRIME = 59;
        int result = 1;
        result = result * 59 + (this.isActive() ? 79 : 97);
        Long $id = this.getId();
        result = result * 59 + ($id == null ? 43 : ($id).hashCode());
        String $name = this.getName();
        result = result * 59 + ($name == null ? 43 : $name.hashCode());
        String $description = this.getDescription();
        result = result * 59 + ($description == null ? 43 : $description.hashCode());
        List $subCategories = this.getSubCategories();
        result = result * 59 + ($subCategories == null ? 43 : ($subCategories).hashCode());
        return result;
    }

    public String toString() {
        return "Category(id=" + this.getId() + ", name=" + this.getName() + ", description=" + this.getDescription() + ", isActive=" + this.isActive() + ", subCategories=" + String.valueOf(this.getSubCategories()) + ")";
    }

    public Category() {
    }

    public Category(Long id, String name, String description, boolean isActive, List<SubCategory> subCategories) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.isActive = isActive;
        this.subCategories = subCategories;
    }
}

