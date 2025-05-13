package com.green.project.Leo.service.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;


@Service
public class EmailServiceImpl implements EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendResetEmail(String toEmail, String token) {
        String resetUrl = "http://localhost:3000/reset-password?token=" + token;
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("비밀번호 재설정 링크입니다");
        message.setText("다음 링크를 클릭하여 비밀번호를 재설정하세요: " + resetUrl);
        mailSender.send(message);
    }

    @Override
    public void sendRefundEmail(String toEmail) {

    }
}
