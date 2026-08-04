package com.styliste.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.styliste.entity.RefreshToken;
import com.styliste.entity.User;
import com.styliste.repository.RefreshTokenRepository;
import java.time.LocalDateTime;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

@ExtendWith(MockitoExtension.class)
class RefreshTokenServiceTest {

    @Mock
    private RefreshTokenRepository refreshTokenRepository;

    @InjectMocks
    private RefreshTokenService refreshTokenService;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(refreshTokenService, "refreshTokenExpirationMs", 604800000L);
    }

    @Test
    void rotateRefreshTokenShouldRevokeOldAndCreateNewToken() {
        User user = new User();
        user.setId(1L);
        user.setEmail("tester@example.com");

        RefreshToken oldToken = new RefreshToken();
        oldToken.setToken("old-token");
        oldToken.setUser(user);
        oldToken.setExpiresAt(LocalDateTime.now().plusDays(1));
        oldToken.setRevoked(false);

        when(refreshTokenRepository.findByToken("old-token")).thenReturn(Optional.of(oldToken));
        when(refreshTokenRepository.save(any(RefreshToken.class))).thenAnswer(invocation -> invocation.getArgument(0));

        RefreshToken rotatedToken = refreshTokenService.rotateRefreshToken("old-token");

        assertNotNull(rotatedToken);
        assertTrue(oldToken.isRevoked());
        assertFalse(rotatedToken.getToken().equals("old-token"));
        assertEquals(user, rotatedToken.getUser());
        verify(refreshTokenRepository).save(oldToken);
        verify(refreshTokenRepository).save(rotatedToken);
    }
}
