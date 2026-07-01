/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  com.styliste.dto.ProcessMeasurementJobRequest
 *  com.styliste.dto.ProcessMeasurementJobRequest$ProcessMeasurementJobRequestBuilder
 *  org.springframework.web.multipart.MultipartFile
 */
package com.styliste.dto;

import com.styliste.dto.ProcessMeasurementJobRequest;
import org.springframework.web.multipart.MultipartFile;

@lombok.Builder
@lombok.extern.jackson.Jacksonized
public class ProcessMeasurementJobRequest {
    private String gender;
    private Integer age;
    private Double height;
    private String heightUnit;
    private Double weight;
    private String weightUnit;
    private String ageGroup;
    private String fatDistribution;
    private String bodyType;
    private String activityLevel;
    private String muscleLevel;
    private String shoulderType;
    private String measurementGoal;
    private String fitPreference;
    private MultipartFile frontImage;
    private MultipartFile sideImage;

    

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

    public String getAgeGroup() {
        return this.ageGroup;
    }

    public String getFatDistribution() {
        return this.fatDistribution;
    }

    public String getBodyType() {
        return this.bodyType;
    }

    public String getActivityLevel() {
        return this.activityLevel;
    }

    public String getMuscleLevel() {
        return this.muscleLevel;
    }

    public String getShoulderType() {
        return this.shoulderType;
    }

    public String getMeasurementGoal() {
        return this.measurementGoal;
    }

    public String getFitPreference() {
        return this.fitPreference;
    }

    public MultipartFile getFrontImage() {
        return this.frontImage;
    }

    public MultipartFile getSideImage() {
        return this.sideImage;
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

    public void setAgeGroup(String ageGroup) {
        this.ageGroup = ageGroup;
    }

    public void setFatDistribution(String fatDistribution) {
        this.fatDistribution = fatDistribution;
    }

    public void setBodyType(String bodyType) {
        this.bodyType = bodyType;
    }

    public void setActivityLevel(String activityLevel) {
        this.activityLevel = activityLevel;
    }

    public void setMuscleLevel(String muscleLevel) {
        this.muscleLevel = muscleLevel;
    }

    public void setShoulderType(String shoulderType) {
        this.shoulderType = shoulderType;
    }

    public void setMeasurementGoal(String measurementGoal) {
        this.measurementGoal = measurementGoal;
    }

    public void setFitPreference(String fitPreference) {
        this.fitPreference = fitPreference;
    }

    public void setFrontImage(MultipartFile frontImage) {
        this.frontImage = frontImage;
    }

    public void setSideImage(MultipartFile sideImage) {
        this.sideImage = sideImage;
    }

    public boolean equals(Object o) {
        if (o == this) {
            return true;
        }
        if (!(o instanceof ProcessMeasurementJobRequest)) {
            return false;
        }
        ProcessMeasurementJobRequest other = (ProcessMeasurementJobRequest)o;
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
        String this$ageGroup = this.getAgeGroup();
        String other$ageGroup = other.getAgeGroup();
        if (this$ageGroup == null ? other$ageGroup != null : !this$ageGroup.equals(other$ageGroup)) {
            return false;
        }
        String this$fatDistribution = this.getFatDistribution();
        String other$fatDistribution = other.getFatDistribution();
        if (this$fatDistribution == null ? other$fatDistribution != null : !this$fatDistribution.equals(other$fatDistribution)) {
            return false;
        }
        String this$bodyType = this.getBodyType();
        String other$bodyType = other.getBodyType();
        if (this$bodyType == null ? other$bodyType != null : !this$bodyType.equals(other$bodyType)) {
            return false;
        }
        String this$activityLevel = this.getActivityLevel();
        String other$activityLevel = other.getActivityLevel();
        if (this$activityLevel == null ? other$activityLevel != null : !this$activityLevel.equals(other$activityLevel)) {
            return false;
        }
        String this$muscleLevel = this.getMuscleLevel();
        String other$muscleLevel = other.getMuscleLevel();
        if (this$muscleLevel == null ? other$muscleLevel != null : !this$muscleLevel.equals(other$muscleLevel)) {
            return false;
        }
        String this$shoulderType = this.getShoulderType();
        String other$shoulderType = other.getShoulderType();
        if (this$shoulderType == null ? other$shoulderType != null : !this$shoulderType.equals(other$shoulderType)) {
            return false;
        }
        String this$measurementGoal = this.getMeasurementGoal();
        String other$measurementGoal = other.getMeasurementGoal();
        if (this$measurementGoal == null ? other$measurementGoal != null : !this$measurementGoal.equals(other$measurementGoal)) {
            return false;
        }
        String this$fitPreference = this.getFitPreference();
        String other$fitPreference = other.getFitPreference();
        if (this$fitPreference == null ? other$fitPreference != null : !this$fitPreference.equals(other$fitPreference)) {
            return false;
        }
        MultipartFile this$frontImage = this.getFrontImage();
        MultipartFile other$frontImage = other.getFrontImage();
        if (this$frontImage == null ? other$frontImage != null : !this$frontImage.equals(other$frontImage)) {
            return false;
        }
        MultipartFile this$sideImage = this.getSideImage();
        MultipartFile other$sideImage = other.getSideImage();
        return !(this$sideImage == null ? other$sideImage != null : !this$sideImage.equals(other$sideImage));
    }

    protected boolean canEqual(Object other) {
        return other instanceof ProcessMeasurementJobRequest;
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
        String $ageGroup = this.getAgeGroup();
        result = result * 59 + ($ageGroup == null ? 43 : $ageGroup.hashCode());
        String $fatDistribution = this.getFatDistribution();
        result = result * 59 + ($fatDistribution == null ? 43 : $fatDistribution.hashCode());
        String $bodyType = this.getBodyType();
        result = result * 59 + ($bodyType == null ? 43 : $bodyType.hashCode());
        String $activityLevel = this.getActivityLevel();
        result = result * 59 + ($activityLevel == null ? 43 : $activityLevel.hashCode());
        String $muscleLevel = this.getMuscleLevel();
        result = result * 59 + ($muscleLevel == null ? 43 : $muscleLevel.hashCode());
        String $shoulderType = this.getShoulderType();
        result = result * 59 + ($shoulderType == null ? 43 : $shoulderType.hashCode());
        String $measurementGoal = this.getMeasurementGoal();
        result = result * 59 + ($measurementGoal == null ? 43 : $measurementGoal.hashCode());
        String $fitPreference = this.getFitPreference();
        result = result * 59 + ($fitPreference == null ? 43 : $fitPreference.hashCode());
        MultipartFile $frontImage = this.getFrontImage();
        result = result * 59 + ($frontImage == null ? 43 : $frontImage.hashCode());
        MultipartFile $sideImage = this.getSideImage();
        result = result * 59 + ($sideImage == null ? 43 : $sideImage.hashCode());
        return result;
    }

    public String toString() {
        return "ProcessMeasurementJobRequest(gender=" + this.getGender() + ", age=" + this.getAge() + ", height=" + this.getHeight() + ", heightUnit=" + this.getHeightUnit() + ", weight=" + this.getWeight() + ", weightUnit=" + this.getWeightUnit() + ", ageGroup=" + this.getAgeGroup() + ", fatDistribution=" + this.getFatDistribution() + ", bodyType=" + this.getBodyType() + ", activityLevel=" + this.getActivityLevel() + ", muscleLevel=" + this.getMuscleLevel() + ", shoulderType=" + this.getShoulderType() + ", measurementGoal=" + this.getMeasurementGoal() + ", fitPreference=" + this.getFitPreference() + ", frontImage=" + String.valueOf(this.getFrontImage()) + ", sideImage=" + String.valueOf(this.getSideImage()) + ")";
    }

    public ProcessMeasurementJobRequest() {
    }

    public ProcessMeasurementJobRequest(String gender, Integer age, Double height, String heightUnit, Double weight, String weightUnit, String ageGroup, String fatDistribution, String bodyType, String activityLevel, String muscleLevel, String shoulderType, String measurementGoal, String fitPreference, MultipartFile frontImage, MultipartFile sideImage) {
        this.gender = gender;
        this.age = age;
        this.height = height;
        this.heightUnit = heightUnit;
        this.weight = weight;
        this.weightUnit = weightUnit;
        this.ageGroup = ageGroup;
        this.fatDistribution = fatDistribution;
        this.bodyType = bodyType;
        this.activityLevel = activityLevel;
        this.muscleLevel = muscleLevel;
        this.shoulderType = shoulderType;
        this.measurementGoal = measurementGoal;
        this.fitPreference = fitPreference;
        this.frontImage = frontImage;
        this.sideImage = sideImage;
    }
}

