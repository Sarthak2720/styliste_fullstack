/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  com.styliste.entity.Measurement
 *  com.styliste.entity.Measurement$MeasurementBuilder
 *  com.styliste.entity.User
 *  jakarta.persistence.Column
 *  jakarta.persistence.Entity
 *  jakarta.persistence.FetchType
 *  jakarta.persistence.GeneratedValue
 *  jakarta.persistence.GenerationType
 *  jakarta.persistence.Id
 *  jakarta.persistence.Index
 *  jakarta.persistence.JoinColumn
 *  jakarta.persistence.ManyToOne
 *  jakarta.persistence.PrePersist
 *  jakarta.persistence.Table
 */
package com.styliste.entity;

import com.styliste.entity.Measurement;
import com.styliste.entity.User;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name="measurements", indexes={@Index(name="idx_measurement_user", columnList="user_id"), @Index(name="idx_measurement_created", columnList="created_at")})
@lombok.Builder
@lombok.extern.jackson.Jacksonized
public class Measurement {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch=FetchType.LAZY)
    @JoinColumn(name="user_id", nullable=false)
    private User user;
    @Column(nullable=false, length=10)
    private String gender;
    @Column(nullable=false)
    private Integer age;
    @Column(name="height_cm", nullable=false, precision=8, scale=2)
    private BigDecimal heightCm;
    @Column(name="weight_kg", nullable=false, precision=8, scale=2)
    private BigDecimal weightKg;
    @Column(name="recommended_size", length=10)
    private String recommendedSize;
    @Column(precision=6, scale=2)
    private BigDecimal bmi;
    @Column(name="bmi_category", length=30)
    private String bmiCategory;
    @Column(name="body_type", length=30)
    private String bodyType;
    @Column(name="measurement_data", columnDefinition="MEDIUMTEXT", nullable=false)
    private String measurementData;
    @Column(name="created_at", nullable=false, updatable=false)
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }

    

    public Long getId() {
        return this.id;
    }

    public User getUser() {
        return this.user;
    }

    public String getGender() {
        return this.gender;
    }

    public Integer getAge() {
        return this.age;
    }

    public BigDecimal getHeightCm() {
        return this.heightCm;
    }

    public BigDecimal getWeightKg() {
        return this.weightKg;
    }

    public String getRecommendedSize() {
        return this.recommendedSize;
    }

    public BigDecimal getBmi() {
        return this.bmi;
    }

    public String getBmiCategory() {
        return this.bmiCategory;
    }

    public String getBodyType() {
        return this.bodyType;
    }

    public String getMeasurementData() {
        return this.measurementData;
    }

    public LocalDateTime getCreatedAt() {
        return this.createdAt;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public void setHeightCm(BigDecimal heightCm) {
        this.heightCm = heightCm;
    }

    public void setWeightKg(BigDecimal weightKg) {
        this.weightKg = weightKg;
    }

    public void setRecommendedSize(String recommendedSize) {
        this.recommendedSize = recommendedSize;
    }

    public void setBmi(BigDecimal bmi) {
        this.bmi = bmi;
    }

    public void setBmiCategory(String bmiCategory) {
        this.bmiCategory = bmiCategory;
    }

    public void setBodyType(String bodyType) {
        this.bodyType = bodyType;
    }

    public void setMeasurementData(String measurementData) {
        this.measurementData = measurementData;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public boolean equals(Object o) {
        if (o == this) {
            return true;
        }
        if (!(o instanceof Measurement)) {
            return false;
        }
        Measurement other = (Measurement)o;
        if (!other.canEqual(this)) {
            return false;
        }
        Long this$id = this.getId();
        Long other$id = other.getId();
        if (this$id == null ? other$id != null : !(this$id).equals(other$id)) {
            return false;
        }
        Integer this$age = this.getAge();
        Integer other$age = other.getAge();
        if (this$age == null ? other$age != null : !(this$age).equals(other$age)) {
            return false;
        }
        User this$user = this.getUser();
        User other$user = other.getUser();
        if (this$user == null ? other$user != null : !this$user.equals(other$user)) {
            return false;
        }
        String this$gender = this.getGender();
        String other$gender = other.getGender();
        if (this$gender == null ? other$gender != null : !this$gender.equals(other$gender)) {
            return false;
        }
        BigDecimal this$heightCm = this.getHeightCm();
        BigDecimal other$heightCm = other.getHeightCm();
        if (this$heightCm == null ? other$heightCm != null : !(this$heightCm).equals(other$heightCm)) {
            return false;
        }
        BigDecimal this$weightKg = this.getWeightKg();
        BigDecimal other$weightKg = other.getWeightKg();
        if (this$weightKg == null ? other$weightKg != null : !(this$weightKg).equals(other$weightKg)) {
            return false;
        }
        String this$recommendedSize = this.getRecommendedSize();
        String other$recommendedSize = other.getRecommendedSize();
        if (this$recommendedSize == null ? other$recommendedSize != null : !this$recommendedSize.equals(other$recommendedSize)) {
            return false;
        }
        BigDecimal this$bmi = this.getBmi();
        BigDecimal other$bmi = other.getBmi();
        if (this$bmi == null ? other$bmi != null : !(this$bmi).equals(other$bmi)) {
            return false;
        }
        String this$bmiCategory = this.getBmiCategory();
        String other$bmiCategory = other.getBmiCategory();
        if (this$bmiCategory == null ? other$bmiCategory != null : !this$bmiCategory.equals(other$bmiCategory)) {
            return false;
        }
        String this$bodyType = this.getBodyType();
        String other$bodyType = other.getBodyType();
        if (this$bodyType == null ? other$bodyType != null : !this$bodyType.equals(other$bodyType)) {
            return false;
        }
        String this$measurementData = this.getMeasurementData();
        String other$measurementData = other.getMeasurementData();
        if (this$measurementData == null ? other$measurementData != null : !this$measurementData.equals(other$measurementData)) {
            return false;
        }
        LocalDateTime this$createdAt = this.getCreatedAt();
        LocalDateTime other$createdAt = other.getCreatedAt();
        return !(this$createdAt == null ? other$createdAt != null : !(this$createdAt).equals(other$createdAt));
    }

    protected boolean canEqual(Object other) {
        return other instanceof Measurement;
    }

    public int hashCode() {
        int PRIME = 59;
        int result = 1;
        Long $id = this.getId();
        result = result * 59 + ($id == null ? 43 : ($id).hashCode());
        Integer $age = this.getAge();
        result = result * 59 + ($age == null ? 43 : ($age).hashCode());
        User $user = this.getUser();
        result = result * 59 + ($user == null ? 43 : $user.hashCode());
        String $gender = this.getGender();
        result = result * 59 + ($gender == null ? 43 : $gender.hashCode());
        BigDecimal $heightCm = this.getHeightCm();
        result = result * 59 + ($heightCm == null ? 43 : ($heightCm).hashCode());
        BigDecimal $weightKg = this.getWeightKg();
        result = result * 59 + ($weightKg == null ? 43 : ($weightKg).hashCode());
        String $recommendedSize = this.getRecommendedSize();
        result = result * 59 + ($recommendedSize == null ? 43 : $recommendedSize.hashCode());
        BigDecimal $bmi = this.getBmi();
        result = result * 59 + ($bmi == null ? 43 : ($bmi).hashCode());
        String $bmiCategory = this.getBmiCategory();
        result = result * 59 + ($bmiCategory == null ? 43 : $bmiCategory.hashCode());
        String $bodyType = this.getBodyType();
        result = result * 59 + ($bodyType == null ? 43 : $bodyType.hashCode());
        String $measurementData = this.getMeasurementData();
        result = result * 59 + ($measurementData == null ? 43 : $measurementData.hashCode());
        LocalDateTime $createdAt = this.getCreatedAt();
        result = result * 59 + ($createdAt == null ? 43 : ($createdAt).hashCode());
        return result;
    }

    public String toString() {
        return "Measurement(id=" + this.getId() + ", user=" + String.valueOf(this.getUser()) + ", gender=" + this.getGender() + ", age=" + this.getAge() + ", heightCm=" + String.valueOf(this.getHeightCm()) + ", weightKg=" + String.valueOf(this.getWeightKg()) + ", recommendedSize=" + this.getRecommendedSize() + ", bmi=" + String.valueOf(this.getBmi()) + ", bmiCategory=" + this.getBmiCategory() + ", bodyType=" + this.getBodyType() + ", measurementData=" + this.getMeasurementData() + ", createdAt=" + String.valueOf(this.getCreatedAt()) + ")";
    }

    public Measurement() {
    }

    public Measurement(Long id, User user, String gender, Integer age, BigDecimal heightCm, BigDecimal weightKg, String recommendedSize, BigDecimal bmi, String bmiCategory, String bodyType, String measurementData, LocalDateTime createdAt) {
        this.id = id;
        this.user = user;
        this.gender = gender;
        this.age = age;
        this.heightCm = heightCm;
        this.weightKg = weightKg;
        this.recommendedSize = recommendedSize;
        this.bmi = bmi;
        this.bmiCategory = bmiCategory;
        this.bodyType = bodyType;
        this.measurementData = measurementData;
        this.createdAt = createdAt;
    }
}

