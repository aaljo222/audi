package com.green.project.Leo.config;

import com.siot.IamportRestClient.IamportClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class IamportConfig {
    @Value("${iamport.api_key}")
    private String apiKey;
    @Value("${iamport.api_secret}")
    private String secretKey;

    @Bean
    public IamportClient iamportClient() {
        return new IamportClient(apiKey, secretKey);  // 실제 API 키와 시크릿을 넣어주세요
    }
}
