/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  com.styliste.service.EmailService
 *  org.springframework.scheduling.annotation.Async
 */
package com.styliste.service;

import java.util.List;
import org.springframework.scheduling.annotation.Async;

public interface EmailService {
    @Async
    public void sendAppointmentApprovedEmail(String var1, String var2, String var3, String var4, String var5);

    @Async
    public void sendAppointmentRejectedEmail(String var1, String var2);

    @Async
    public void sendUnavailabilityApologyEmail(String var1, String var2, String var3, String var4, List<String> var5);

    @Async
    public void sendAvailabilityRestoredEmail(String var1, String var2, String var3, String var4, String var5);

    @Async
    public void sendPasswordResetOtpEmail(String var1, String var2);
}

