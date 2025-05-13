package com.green.project.Leo.config;


import com.google.gson.Gson;
import com.green.project.Leo.security.JWTCheckFilter;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.AnonymousAuthenticationFilter;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;


@Configuration
@EnableMethodSecurity
@RequiredArgsConstructor
@Log4j2
public class CustomSecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http)throws Exception{
        log.info("-------------security config------------");

        http.cors(httpSecurityCorsConfigurer -> {
            httpSecurityCorsConfigurer.configurationSource(corsConfigurationSource());
        });

        http.sessionManagement(sessionConfig ->
            sessionConfig.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
        );

        http.csrf(config -> config.disable());

        http.formLogin(config ->{
           config.disable();
        });

        http.addFilterBefore(new JWTCheckFilter(), UsernamePasswordAuthenticationFilter.class);//JWT체크

        http.authorizeHttpRequests(auth -> {
            auth.requestMatchers("/admin/**").hasRole("ADMIN")
                    .anyRequest().permitAll();
        });

        http.addFilterAfter(new JWTCheckFilter(), AnonymousAuthenticationFilter.class);

        http.exceptionHandling(exception -> {
            exception
                    .authenticationEntryPoint((request, response, authException) -> {
                        // 인증되지 않은 사용자가 접근하려 할 때 처리
                        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                        response.setContentType("application/json;charset=UTF-8");

                        Map<String, Object> errorDetails = new HashMap<>();
                        errorDetails.put("error", "UNAUTHORIZED");
                        errorDetails.put("message", "인증이 필요한 페이지입니다.");

                        String jsonResponse = new Gson().toJson(errorDetails);
                        response.getWriter().write(jsonResponse);
                    })
                    .accessDeniedHandler((request, response, accessDeniedException) -> {
                        // 인증은 됐지만 권한이 없는 사용자가 접근하려 할 때 처리
                        response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                        response.setContentType("application/json;charset=UTF-8");

                        Map<String, Object> errorDetails = new HashMap<>();
                        errorDetails.put("error", "ACCESS_DENIED");
                        errorDetails.put("message", "해당 리소스에 접근할 권한이 없습니다.");

                        String jsonResponse = new Gson().toJson(errorDetails);
                        response.getWriter().write(jsonResponse);
                    });
        });

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource(){
        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOriginPatterns(Arrays.asList("*"));
        configuration.setAllowedMethods(Arrays.asList("HEAD","GET","POST","PUT","DELETE"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization","Cache-Control","Content-Type"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
            source.registerCorsConfiguration("/**",configuration);


        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }

}
