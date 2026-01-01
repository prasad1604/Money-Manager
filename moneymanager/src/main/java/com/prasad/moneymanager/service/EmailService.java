package com.prasad.moneymanager.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class EmailService {

    private static final String BREVO_API_URL =
            "https://api.brevo.com/v3/smtp/email";

    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${brevo.api.key}")
    private String apiKey;

    @Value("${spring.mail.properties.mail.smtp.from}")
    private String fromEmail;

    @Async
    public void sendEmail(String to, String subject, String body) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("api-key", apiKey);

            String payload = """
            {
              "sender": { "email": "%s" },
              "to": [ { "email": "%s" } ],
              "subject": "%s",
              "htmlContent": "%s"
            }
            """.formatted(fromEmail, to, subject, body);

            HttpEntity<String> request =
                    new HttpEntity<>(payload, headers);

            restTemplate.postForEntity(
                    BREVO_API_URL,
                    request,
                    String.class
            );

            log.info("Verification email sent to {}", to);

        } catch (Exception e) {
            // DO NOT throw — async must never break registration
            log.error("Email sending failed for {}", to, e);
        }
    }
}
