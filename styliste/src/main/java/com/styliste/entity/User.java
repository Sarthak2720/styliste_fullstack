/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  com.styliste.entity.Address
 *  com.styliste.entity.Appointment
 *  com.styliste.entity.Order
 *  com.styliste.entity.User
 *  com.styliste.entity.User$UserBuilder
 *  com.styliste.entity.UserRole
 *  jakarta.persistence.CascadeType
 *  jakarta.persistence.Column
 *  jakarta.persistence.Entity
 *  jakarta.persistence.EnumType
 *  jakarta.persistence.Enumerated
 *  jakarta.persistence.FetchType
 *  jakarta.persistence.GeneratedValue
 *  jakarta.persistence.GenerationType
 *  jakarta.persistence.Id
 *  jakarta.persistence.OneToMany
 *  jakarta.persistence.PrePersist
 *  jakarta.persistence.PreUpdate
 *  jakarta.persistence.Table
 *  jakarta.persistence.UniqueConstraint
 */
package com.styliste.entity;

import com.styliste.entity.Address;
import com.styliste.entity.Appointment;
import com.styliste.entity.Order;
import com.styliste.entity.User;
import com.styliste.entity.UserRole;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name="users", uniqueConstraints={@UniqueConstraint(columnNames={"email"})})
@lombok.Builder
@lombok.extern.jackson.Jacksonized
public class User {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;
    @Column(nullable=false, length=100)
    private String name;
    @Column(nullable=false, unique=true, length=100)
    private String email;
    @Column(nullable=false, length=255)
    private String password;
    @Column(length=20)
    private String phone;
    @Enumerated(value=EnumType.STRING)
    @Column(nullable=false)
    private UserRole role;
    @Column(name="created_at", nullable=false, updatable=false)
    private LocalDateTime createdAt;
    @Column(name="updated_at")
    private LocalDateTime updatedAt;
    @Column(nullable=false)
    private Boolean isActive = true;
    @OneToMany(mappedBy="user", cascade={CascadeType.ALL}, orphanRemoval=true, fetch=FetchType.LAZY)
    private List<Address> addresses;
    @OneToMany(mappedBy="user", cascade={CascadeType.ALL}, orphanRemoval=true, fetch=FetchType.LAZY)
    private List<Order> orders;
    @OneToMany(mappedBy="user", cascade={CascadeType.ALL}, orphanRemoval=true, fetch=FetchType.LAZY)
    private List<Appointment> appointments;

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

    public String getEmail() {
        return this.email;
    }

    public String getPassword() {
        return this.password;
    }

    public String getPhone() {
        return this.phone;
    }

    public UserRole getRole() {
        return this.role;
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

    public List<Address> getAddresses() {
        return this.addresses;
    }

    public List<Order> getOrders() {
        return this.orders;
    }

    public List<Appointment> getAppointments() {
        return this.appointments;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public void setRole(UserRole role) {
        this.role = role;
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

    public void setAddresses(List<Address> addresses) {
        this.addresses = addresses;
    }

    public void setOrders(List<Order> orders) {
        this.orders = orders;
    }

    public void setAppointments(List<Appointment> appointments) {
        this.appointments = appointments;
    }

    public boolean equals(Object o) {
        if (o == this) {
            return true;
        }
        if (!(o instanceof User)) {
            return false;
        }
        User other = (User)o;
        if (!other.canEqual(this)) {
            return false;
        }
        Long this$id = this.getId();
        Long other$id = other.getId();
        if (this$id == null ? other$id != null : !(this$id).equals(other$id)) {
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
        String this$email = this.getEmail();
        String other$email = other.getEmail();
        if (this$email == null ? other$email != null : !this$email.equals(other$email)) {
            return false;
        }
        String this$password = this.getPassword();
        String other$password = other.getPassword();
        if (this$password == null ? other$password != null : !this$password.equals(other$password)) {
            return false;
        }
        String this$phone = this.getPhone();
        String other$phone = other.getPhone();
        if (this$phone == null ? other$phone != null : !this$phone.equals(other$phone)) {
            return false;
        }
        UserRole this$role = this.getRole();
        UserRole other$role = other.getRole();
        if (this$role == null ? other$role != null : !this$role.equals(other$role)) {
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
        List this$addresses = this.getAddresses();
        List other$addresses = other.getAddresses();
        if (this$addresses == null ? other$addresses != null : !(this$addresses).equals(other$addresses)) {
            return false;
        }
        List this$orders = this.getOrders();
        List other$orders = other.getOrders();
        if (this$orders == null ? other$orders != null : !(this$orders).equals(other$orders)) {
            return false;
        }
        List this$appointments = this.getAppointments();
        List other$appointments = other.getAppointments();
        return !(this$appointments == null ? other$appointments != null : !(this$appointments).equals(other$appointments));
    }

    protected boolean canEqual(Object other) {
        return other instanceof User;
    }

    public int hashCode() {
        int PRIME = 59;
        int result = 1;
        Long $id = this.getId();
        result = result * 59 + ($id == null ? 43 : ($id).hashCode());
        Boolean $isActive = this.getIsActive();
        result = result * 59 + ($isActive == null ? 43 : ($isActive).hashCode());
        String $name = this.getName();
        result = result * 59 + ($name == null ? 43 : $name.hashCode());
        String $email = this.getEmail();
        result = result * 59 + ($email == null ? 43 : $email.hashCode());
        String $password = this.getPassword();
        result = result * 59 + ($password == null ? 43 : $password.hashCode());
        String $phone = this.getPhone();
        result = result * 59 + ($phone == null ? 43 : $phone.hashCode());
        UserRole $role = this.getRole();
        result = result * 59 + ($role == null ? 43 : $role.hashCode());
        LocalDateTime $createdAt = this.getCreatedAt();
        result = result * 59 + ($createdAt == null ? 43 : ($createdAt).hashCode());
        LocalDateTime $updatedAt = this.getUpdatedAt();
        result = result * 59 + ($updatedAt == null ? 43 : ($updatedAt).hashCode());
        List $addresses = this.getAddresses();
        result = result * 59 + ($addresses == null ? 43 : ($addresses).hashCode());
        List $orders = this.getOrders();
        result = result * 59 + ($orders == null ? 43 : ($orders).hashCode());
        List $appointments = this.getAppointments();
        result = result * 59 + ($appointments == null ? 43 : ($appointments).hashCode());
        return result;
    }

    public String toString() {
        return "User(id=" + this.getId() + ", name=" + this.getName() + ", email=" + this.getEmail() + ", password=" + this.getPassword() + ", phone=" + this.getPhone() + ", role=" + String.valueOf(this.getRole()) + ", createdAt=" + String.valueOf(this.getCreatedAt()) + ", updatedAt=" + String.valueOf(this.getUpdatedAt()) + ", isActive=" + this.getIsActive() + ", addresses=" + String.valueOf(this.getAddresses()) + ", orders=" + String.valueOf(this.getOrders()) + ", appointments=" + String.valueOf(this.getAppointments()) + ")";
    }

    public User() {
    }

    public User(Long id, String name, String email, String password, String phone, UserRole role, LocalDateTime createdAt, LocalDateTime updatedAt, Boolean isActive, List<Address> addresses, List<Order> orders, List<Appointment> appointments) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.phone = phone;
        this.role = role;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.isActive = isActive;
        this.addresses = addresses;
        this.orders = orders;
        this.appointments = appointments;
    }
}

