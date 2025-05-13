package com.green.project.Leo.util;

import lombok.extern.log4j.Log4j2;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.time.ZonedDateTime;
import java.util.Date;
import java.util.Map;

@Component
@Log4j2
public class JWTUtil {
    private static String staticKey;

    @Value("${jwt.secret}")
    public void setKey(String key) {
        JWTUtil.staticKey = key;
    }
    public static String generateToken(Map<String,Object> valueMap,int min){
        SecretKey key = null;

        try{
            key = Keys.hmacShaKeyFor(staticKey.getBytes("UTF-8"));
        }catch (Exception e){
            throw new RuntimeException(e.getMessage());
        }
        String jwtStr = Jwts.builder().setHeader(Map.of("typ","JWT"))
                .setClaims(valueMap)
                .setIssuedAt(Date.from(ZonedDateTime.now().toInstant()))
                .setExpiration(Date.from(ZonedDateTime.now().plusMinutes(min).toInstant()))
                .signWith(key)
                .compact();
        return jwtStr;
    }

    public static Map<String,Object> validateToken(String token){
        Map<String,Object> claim = null;

        try{
            SecretKey key = Keys.hmacShaKeyFor(staticKey.getBytes("UTF-8"));

            claim = Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        }catch (MalformedJwtException malformedJwtException){
            throw new CustomJWTException("MalFormed");
        }catch (ExpiredJwtException expiredJwtException){
            throw new CustomJWTException("Expired");
        }catch (InvalidClaimException invalidClaimException){
            throw new CustomJWTException("Invalid");
        }catch (JwtException jwtException){
            throw new CustomJWTException("JWTError");
        }catch (Exception e){
            throw new CustomJWTException("Error");
        }
        return claim;
    }

}
