package com.recommerceAPI.service;


public interface EmailService {

    void sendEmail(String to, String subject, String text);
}
