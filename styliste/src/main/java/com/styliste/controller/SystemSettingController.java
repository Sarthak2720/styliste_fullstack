package com.styliste.controller;

import com.styliste.entity.SystemSetting;
import com.styliste.repository.SystemSettingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/settings")
public class SystemSettingController {

    @Autowired
    private SystemSettingRepository settingRepository;

    @GetMapping("/{key}")
    @PreAuthorize("hasRole('CUSTOMER') or hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getSetting(@PathVariable String key) {
        SystemSetting setting = settingRepository.findById(key).orElse(null);
        Map<String, Object> response = new HashMap<>();
        response.put("key", key);
        response.put("value", setting != null ? setting.getValue() : null);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{key}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> saveSetting(
            @PathVariable String key,
            @RequestBody Map<String, String> request) {
        
        String value = request.get("value");
        SystemSetting setting = settingRepository.findById(key).orElse(null);
        if (setting == null) {
            setting = SystemSetting.builder()
                    .key(key)
                    .value(value)
                    .build();
        } else {
            setting.setValue(value);
        }
        settingRepository.save(setting);

        Map<String, Object> response = new HashMap<>();
        response.put("key", key);
        response.put("value", value);
        return ResponseEntity.ok(response);
    }
}
