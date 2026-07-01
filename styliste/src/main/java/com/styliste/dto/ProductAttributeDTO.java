/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  com.styliste.dto.ProductAttributeDTO
 *  com.styliste.dto.ProductAttributeDTO$ProductAttributeDTOBuilder
 */
package com.styliste.dto;

import com.styliste.dto.ProductAttributeDTO;

@lombok.Builder
@lombok.extern.jackson.Jacksonized
public class ProductAttributeDTO {
    private String type;
    private String value;

    

    public String getType() {
        return this.type;
    }

    public String getValue() {
        return this.value;
    }

    public void setType(String type) {
        this.type = type;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public boolean equals(Object o) {
        if (o == this) {
            return true;
        }
        if (!(o instanceof ProductAttributeDTO)) {
            return false;
        }
        ProductAttributeDTO other = (ProductAttributeDTO)o;
        if (!other.canEqual(this)) {
            return false;
        }
        String this$type = this.getType();
        String other$type = other.getType();
        if (this$type == null ? other$type != null : !this$type.equals(other$type)) {
            return false;
        }
        String this$value = this.getValue();
        String other$value = other.getValue();
        return !(this$value == null ? other$value != null : !this$value.equals(other$value));
    }

    protected boolean canEqual(Object other) {
        return other instanceof ProductAttributeDTO;
    }

    public int hashCode() {
        int PRIME = 59;
        int result = 1;
        String $type = this.getType();
        result = result * 59 + ($type == null ? 43 : $type.hashCode());
        String $value = this.getValue();
        result = result * 59 + ($value == null ? 43 : $value.hashCode());
        return result;
    }

    public String toString() {
        return "ProductAttributeDTO(type=" + this.getType() + ", value=" + this.getValue() + ")";
    }

    public ProductAttributeDTO() {
    }

    public ProductAttributeDTO(String type, String value) {
        this.type = type;
        this.value = value;
    }
}

