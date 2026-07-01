/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  com.styliste.dto.SaveMeasurementRequest
 */
package com.styliste.dto;

import java.util.Map;

public class SaveMeasurementRequest {
    private String gender;
    private Integer age;
    private Double height;
    private String heightUnit;
    private Double weight;
    private String weightUnit;
    private Map<String, Object> measurements;

    public String getGender() {
        return this.gender;
    }

    public Integer getAge() {
        return this.age;
    }

    public Double getHeight() {
        return this.height;
    }

    public String getHeightUnit() {
        return this.heightUnit;
    }

    public Double getWeight() {
        return this.weight;
    }

    public String getWeightUnit() {
        return this.weightUnit;
    }

    public Map<String, Object> getMeasurements() {
        return this.measurements;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public void setHeight(Double height) {
        this.height = height;
    }

    public void setHeightUnit(String heightUnit) {
        this.heightUnit = heightUnit;
    }

    public void setWeight(Double weight) {
        this.weight = weight;
    }

    public void setWeightUnit(String weightUnit) {
        this.weightUnit = weightUnit;
    }

    public void setMeasurements(Map<String, Object> measurements) {
        this.measurements = measurements;
    }

    public boolean equals(Object o) {
        if (o == this) {
            return true;
        }
        if (!(o instanceof SaveMeasurementRequest)) {
            return false;
        }
        SaveMeasurementRequest other = (SaveMeasurementRequest)o;
        if (!other.canEqual(this)) {
            return false;
        }
        Integer this$age = this.getAge();
        Integer other$age = other.getAge();
        if (this$age == null ? other$age != null : !(this$age).equals(other$age)) {
            return false;
        }
        Double this$height = this.getHeight();
        Double other$height = other.getHeight();
        if (this$height == null ? other$height != null : !(this$height).equals(other$height)) {
            return false;
        }
        Double this$weight = this.getWeight();
        Double other$weight = other.getWeight();
        if (this$weight == null ? other$weight != null : !(this$weight).equals(other$weight)) {
            return false;
        }
        String this$gender = this.getGender();
        String other$gender = other.getGender();
        if (this$gender == null ? other$gender != null : !this$gender.equals(other$gender)) {
            return false;
        }
        String this$heightUnit = this.getHeightUnit();
        String other$heightUnit = other.getHeightUnit();
        if (this$heightUnit == null ? other$heightUnit != null : !this$heightUnit.equals(other$heightUnit)) {
            return false;
        }
        String this$weightUnit = this.getWeightUnit();
        String other$weightUnit = other.getWeightUnit();
        if (this$weightUnit == null ? other$weightUnit != null : !this$weightUnit.equals(other$weightUnit)) {
            return false;
        }
        Map this$measurements = this.getMeasurements();
        Map other$measurements = other.getMeasurements();
        return !(this$measurements == null ? other$measurements != null : !(this$measurements).equals(other$measurements));
    }

    protected boolean canEqual(Object other) {
        return other instanceof SaveMeasurementRequest;
    }

    public int hashCode() {
        int PRIME = 59;
        int result = 1;
        Integer $age = this.getAge();
        result = result * 59 + ($age == null ? 43 : ($age).hashCode());
        Double $height = this.getHeight();
        result = result * 59 + ($height == null ? 43 : ($height).hashCode());
        Double $weight = this.getWeight();
        result = result * 59 + ($weight == null ? 43 : ($weight).hashCode());
        String $gender = this.getGender();
        result = result * 59 + ($gender == null ? 43 : $gender.hashCode());
        String $heightUnit = this.getHeightUnit();
        result = result * 59 + ($heightUnit == null ? 43 : $heightUnit.hashCode());
        String $weightUnit = this.getWeightUnit();
        result = result * 59 + ($weightUnit == null ? 43 : $weightUnit.hashCode());
        Map $measurements = this.getMeasurements();
        result = result * 59 + ($measurements == null ? 43 : ($measurements).hashCode());
        return result;
    }

    public String toString() {
        return "SaveMeasurementRequest(gender=" + this.getGender() + ", age=" + this.getAge() + ", height=" + this.getHeight() + ", heightUnit=" + this.getHeightUnit() + ", weight=" + this.getWeight() + ", weightUnit=" + this.getWeightUnit() + ", measurements=" + String.valueOf(this.getMeasurements()) + ")";
    }

    public SaveMeasurementRequest() {
    }

    public SaveMeasurementRequest(String gender, Integer age, Double height, String heightUnit, Double weight, String weightUnit, Map<String, Object> measurements) {
        this.gender = gender;
        this.age = age;
        this.height = height;
        this.heightUnit = heightUnit;
        this.weight = weight;
        this.weightUnit = weightUnit;
        this.measurements = measurements;
    }
}

