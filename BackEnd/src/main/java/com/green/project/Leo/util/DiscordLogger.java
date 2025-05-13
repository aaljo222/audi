package com.green.project.Leo.util;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.Map;

@Component
public class DiscordLogger {
    @Value("${discord.webhook.url}")
    private String webhookUrl;

    @Value("${discord.webhook.second.url}")
    private String refundWebhookUrl;

    private final WebClient webClient;

    public DiscordLogger(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.build();
    }

    public void sendMessage(String message) {
        webClient.post()
                .uri(webhookUrl)
                .bodyValue(Map.of("content", message))
                .retrieve()
                .toBodilessEntity()
                .subscribe();
    }

    public void sendErrorLog(String message) {
        webClient.post()
                .uri(webhookUrl)
                .bodyValue(Map.of(
                        "content", "❌ Error Log: " + message,
                        "embeds", List.of(Map.of(
                                "color", 15158332, // 빨간색
                                "description", message
                        ))
                ))
                .retrieve()
                .toBodilessEntity()
                .subscribe();
    }

    public void refundRequest(String message){
        webClient.post()
                .uri(refundWebhookUrl)
                .bodyValue(Map.of(
                        "content",message))
                .retrieve()
                .toBodilessEntity()
                .subscribe();

    }
}
