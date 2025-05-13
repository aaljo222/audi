package com.green.project.Leo.service.user;

public interface EmailService {
    public void sendResetEmail(String toEmail, String token);
    public void sendRefundEmail(String toEmail);
}
