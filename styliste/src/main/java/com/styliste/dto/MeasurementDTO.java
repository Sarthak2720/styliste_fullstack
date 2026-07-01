/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  com.styliste.dto.MeasurementDTO
 *  com.styliste.dto.MeasurementDTO$MeasurementDTOBuilder
 */
package com.styliste.dto;

import com.styliste.dto.MeasurementDTO;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Map;

@lombok.Builder
@lombok.extern.jackson.Jacksonized
public class MeasurementDTO {
    private Long id;
    private String gender;
    private Integer age;
    private BigDecimal heightCm;
    private BigDecimal weightKg;
    private String recommendedSize;
    private BigDecimal bmi;
    private String bmiCategory;
    private String bodyType;
    private Map<String, Object> measurements;
    private LocalDateTime createdAt;
    private Long userId;
    private String userName;
    private String userEmail;
    private String userPhone;
    private String userAddress;

    

    public Long getId() {
        return this.id;
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

    public Map<String, Object> getMeasurements() {
        return this.measurements;
    }

    public LocalDateTime getCreatedAt() {
        return this.createdAt;
    }

    public Long getUserId() {
        return this.userId;
    }

    public String getUserName() {
        return this.userName;
    }

    public String getUserEmail() {
        return this.userEmail;
    }

    public String getUserPhone() {
        return this.userPhone;
    }

    public String getUserAddress() {
        return this.userAddress;
    }

    public void setId(Long id) {
        this.id = id;
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

    public void setMeasurements(Map<String, Object> measurements) {
        this.measurements = measurements;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public void setUserPhone(String userPhone) {
        this.userPhone = userPhone;
    }

    public void setUserAddress(String userAddress) {
        this.userAddress = userAddress;
    }

    public boolean equals(Object o) {
        if (o == this) {
            return true;
        }
        if (!(o instanceof MeasurementDTO)) {
            return false;
        }
        MeasurementDTO other = (MeasurementDTO)o;
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
        Long this$userId = this.getUserId();
        Long other$userId = other.getUserId();
        if (this$userId == null ? other$userId != null : !(this$userId).equals(other$userId)) {
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
        Map this$measurements = this.getMeasurements();
        Map other$measurements = other.getMeasurements();
        if (this$measurements == null ? other$measurements != null : !(this$measurements).equals(other$measurements)) {
            return false;
        }
        LocalDateTime this$createdAt = this.getCreatedAt();
        LocalDateTime other$createdAt = other.getCreatedAt();
        if (this$createdAt == null ? other$createdAt != null : !(this$createdAt).equals(other$createdAt)) {
            return false;
        }
        String this$userName = this.getUserName();
        String other$userName = other.getUserName();
        if (this$userName == null ? other$userName != null : !this$userName.equals(other$userName)) {
            return false;
        }
        String this$userEmail = this.getUserEmail();
        String other$userEmail = other.getUserEmail();
        if (this$userEmail == null ? other$userEmail != null : !this$userEmail.equals(other$userEmail)) {
            return false;
        }
        String this$userPhone = this.getUserPhone();
        String other$userPhone = other.getUserPhone();
        if (this$userPhone == null ? other$userPhone != null : !this$userPhone.equals(other$userPhone)) {
            return false;
        }
        String this$userAddress = this.getUserAddress();
        String other$userAddress = other.getUserAddress();
        return !(this$userAddress == null ? other$userAddress != null : !this$userAddress.equals(other$userAddress));
    }

    protected boolean canEqual(Object other) {
        return other instanceof MeasurementDTO;
    }

    public int hashCode() {
        int PRIME = 59;
        int result = 1;
        Long $id = this.getId();
        result = result * 59 + ($id == null ? 43 : ($id).hashCode());
        Integer $age = this.getAge();
        result = result * 59 + ($age == null ? 43 : ($age).hashCode());
        Long $userId = this.getUserId();
        result = result * 59 + ($userId == null ? 43 : ($userId).hashCode());
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
        Map $measurements = this.getMeasurements();
        result = result * 59 + ($measurements == null ? 43 : ($measurements).hashCode());
        LocalDateTime $createdAt = this.getCreatedAt();
        result = result * 59 + ($createdAt == null ? 43 : ($createdAt).hashCode());
        String $userName = this.getUserName();
        result = result * 59 + ($userName == null ? 43 : $userName.hashCode());
        String $userEmail = this.getUserEmail();
        result = result * 59 + ($userEmail == null ? 43 : $userEmail.hashCode());
        String $userPhone = this.getUserPhone();
        result = result * 59 + ($userPhone == null ? 43 : $userPhone.hashCode());
        String $userAddress = this.getUserAddress();
        result = result * 59 + ($userAddress == null ? 43 : $userAddress.hashCode());
        return result;
    }

    public String toString() {
        return "MeasurementDTO(id=" + this.getId() + ", gender=" + this.getGender() + ", age=" + this.getAge() + ", heightCm=" + String.valueOf(this.getHeightCm()) + ", weightKg=" + String.valueOf(this.getWeightKg()) + ", recommendedSize=" + this.getRecommendedSize() + ", bmi=" + String.valueOf(this.getBmi()) + ", bmiCategory=" + this.getBmiCategory() + ", bodyType=" + this.getBodyType() + ", measurements=" + String.valueOf(this.getMeasurements()) + ", createdAt=" + String.valueOf(this.getCreatedAt()) + ", userId=" + this.getUserId() + ", userName=" + this.getUserName() + ", userEmail=" + this.getUserEmail() + ", userPhone=" + this.getUserPhone() + ", userAddress=" + this.getUserAddress() + ")";
    }

    public MeasurementDTO() {
    }

    public MeasurementDTO(Long id, String gender, Integer age, BigDecimal heightCm, BigDecimal weightKg, String recommendedSize, BigDecimal bmi, String bmiCategory, String bodyType, Map<String, Object> measurements, LocalDateTime createdAt, Long userId, String userName, String userEmail, String userPhone, String userAddress) {
        this.id = id;
        this.gender = gender;
        this.age = age;
        this.heightCm = heightCm;
        this.weightKg = weightKg;
        this.recommendedSize = recommendedSize;
        this.bmi = bmi;
        this.bmiCategory = bmiCategory;
        this.bodyType = bodyType;
        this.measurements = measurements;
        this.createdAt = createdAt;
        this.userId = userId;
        this.userName = userName;
        this.userEmail = userEmail;
        this.userPhone = userPhone;
        this.userAddress = userAddress;
    }
}

