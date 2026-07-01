/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  com.styliste.service.EmailService
 *  com.styliste.service.EmailServiceImpl
 *  jakarta.mail.MessagingException
 *  jakarta.mail.internet.MimeMessage
 *  org.slf4j.Logger
 *  org.slf4j.LoggerFactory
 *  org.springframework.beans.factory.annotation.Value
 *  org.springframework.mail.javamail.JavaMailSender
 *  org.springframework.mail.javamail.MimeMessageHelper
 *  org.springframework.scheduling.annotation.Async
 *  org.springframework.stereotype.Service
 */
package com.styliste.service;

import com.styliste.service.EmailService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailServiceImpl
implements EmailService {
    private static final Logger log = LoggerFactory.getLogger(EmailServiceImpl.class);
    private final JavaMailSender mailSender;
    @Value(value="${spring.mail.username}")
    private String fromEmail;

    @Async
    public void sendAppointmentApprovedEmail(String email, String name, String appointmentDate, String appointmentTime, String serviceName) {
        String subject = "\u2705 Appointment Confirmed";
        String body = this.buildApprovalEmail(name, appointmentDate, appointmentTime, serviceName);
        this.sendEmail(email, subject, body);
    }

    @Async
    public void sendAppointmentRejectedEmail(String email, String name) {
        String subject = "\u274c Appointment Request Rejected";
        String body = this.buildRejectionEmail(name);
        this.sendEmail(email, subject, body);
    }

    private void sendEmail(String to, String subject, String htmlBody) {
        try {
            MimeMessage message = this.mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(this.fromEmail);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlBody, true);
            this.mailSender.send(message);
            log.info("Email sent successfully to {}", to);
        }
        catch (MessagingException e) {
            log.error("Failed to send email to {}", to, e);
        }
    }

    private String buildApprovalEmail(String name, String date, String time, String service) {
        return "<html>\n    <body style=\"font-family:Arial,sans-serif;\">\n        <h2 style=\"color:#2ecc71;\">Appointment Confirmed</h2>\n        <p>Hello <strong>%s</strong>,</p>\n        <p>Your appointment has been <strong>confirmed</strong>.</p>\n        <p>\n            <b>Date:</b> %s<br/>\n            <b>Time:</b> %s<br/>\n            <b>Service:</b> %s\n        </p>\n        <p>We look forward to serving you.</p>\n        <br/>\n        <p>Regards,<br/><b>Styliste Team</b></p>\n    </body>\n</html>\n".formatted(name, date, time, service);
    }

    private String buildRejectionEmail(String name) {
        return "<html>\n    <body style=\"font-family:Arial,sans-serif;\">\n        <h2 style=\"color:#e74c3c;\">Appointment Not Available</h2>\n        <p>Hello <strong>%s</strong>,</p>\n        <p>We\u2019re sorry to inform you that your appointment request could not be accepted.</p>\n        <p>The selected slot is currently <strong>fully booked</strong>.</p>\n        <p>Please try booking another available slot.</p>\n        <br/>\n        <p>Regards,<br/><b>Styliste Team</b></p>\n    </body>\n</html>\n".formatted(name);
    }

    @Async
    public void sendUnavailabilityApologyEmail(String email, String name, String blockedDate, String blockedTime, List<String> alternativeSlots) {
        String subject = "\ud83d\udd14 Important: Appointment Schedule Change";
        String body = this.buildUnavailabilityApologyEmail(name, blockedDate, blockedTime, alternativeSlots);
        this.sendEmail(email, subject, body);
    }

    private String buildUnavailabilityApologyEmail(String name, String date, String time, List<String> alternatives) {
        StringBuilder alternativesHtml = new StringBuilder();
        if (alternatives != null && !alternatives.isEmpty()) {
            alternativesHtml.append("<ul style='margin-top:10px;'>");
            for (String slot : alternatives) {
                alternativesHtml.append("<li>").append(slot).append("</li>");
            }
            alternativesHtml.append("</ul>");
        } else {
            alternativesHtml.append("<p>Please contact us to reschedule.</p>");
        }
        return "<html>\n    <body style=\"font-family:Arial,sans-serif; padding:20px;\">\n        <h2 style=\"color:#f39c12;\">Appointment Rescheduling Notice</h2>\n        <p>Dear <strong>%s</strong>,</p>\n\n        <p>We sincerely apologize for the inconvenience, but we need to inform you\n        that your scheduled appointment is no longer available due to unforeseen circumstances.</p>\n\n        <div style=\"background:#f8f9fa; padding:15px; border-left:4px solid #f39c12; margin:20px 0;\">\n            <p style=\"margin:0;\"><b>Your Original Appointment:</b></p>\n            <p style=\"margin:5px 0;\">\ud83d\udcc5 Date: <strong>%s</strong></p>\n            <p style=\"margin:5px 0;\">\u23f0 Time: <strong>%s</strong></p>\n        </div>\n\n        <p><strong>Alternative Available Slots:</strong></p>\n        %s\n\n        <p>If any of these slots work for you, please reply to this email or contact us,\n        and we'll be happy to reschedule your appointment immediately.</p>\n\n        <p>We deeply regret any inconvenience this may cause and appreciate your understanding.</p>\n\n        <br/>\n        <p>Warm regards,<br/><b>Styliste Team</b></p>\n    </body>\n</html>\n".formatted(name, date, time, alternativesHtml.toString());
    }

    @Async
    public void sendAvailabilityRestoredEmail(String email, String name, String date, String time, String serviceName) {
        String subject = "\u2705 Your Appointment Is Confirmed";
        String body = "<html>\n  <body style=\"font-family:Arial; padding:20px;\">\n    <h2 style=\"color:#27ae60;\">Good News!</h2>\n\n    <p>Dear <b>%s</b>,</p>\n\n    <p>We\u2019re happy to inform you that we are now available again.</p>\n\n    <div style=\"background:#f8f9fa;padding:15px;border-left:4px solid #27ae60;\">\n      <p><b>Your appointment remains unchanged:</b></p>\n      <p>\ud83d\udcc5 Date: <b>%s</b></p>\n      <p>\u23f0 Time: <b>%s</b></p>\n      <p>\ud83d\udc87 Service: <b>%s</b></p>\n    </div>\n\n    <p>No action is required from your side.</p>\n\n    <p>We look forward to serving you!</p>\n\n    <br/>\n    <p>Warm regards,<br/><b>Styliste Team</b></p>\n  </body>\n</html>\n".formatted(name, date, time, serviceName);
        this.sendEmail(email, subject, body);
    }

    @Async
    public void sendPasswordResetOtpEmail(String email, String otp) {
        String subject = "\ud83d\udd10 Password Reset OTP - Styliste";
        String body = "<html>\n    <body style=\"font-family: Arial, sans-serif; padding: 20px; color: #333;\">\n        <div style=\"max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;\">\n            <h2 style=\"color: #2c3e50; text-align: center;\">Password Reset Request</h2>\n            <p>Hello,</p>\n            <p>We received a request to reset your password for your <strong>Styliste</strong> account.</p>\n            <p>Please use the following One-Time Password (OTP) to proceed:</p>\n\n            <div style=\"background: #f4f4f4; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #2980b9; margin: 20px 0;\">\n                %s\n            </div>\n\n            <p style=\"color: #e74c3c;\"><strong>Note:</strong> This OTP is valid for 10 minutes. If you did not request this, please ignore this email.</p>\n\n            <br/>\n            <p>Regards,<br/><b>Styliste Team</b></p>\n        </div>\n    </body>\n</html>\n".formatted(otp);
        this.sendEmail(email, subject, body);
    }

    public EmailServiceImpl(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }
}

