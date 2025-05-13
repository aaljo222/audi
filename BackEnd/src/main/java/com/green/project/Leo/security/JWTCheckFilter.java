package com.green.project.Leo.security;

import com.google.gson.Gson;
import com.green.project.Leo.util.JWTUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.Collections;
import java.util.Map;

@Log4j2
public class JWTCheckFilter extends OncePerRequestFilter {
    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException{
        //PreFlight 요청은 체크안함
        if(request.getMethod().equals("OPTIONS")){
            return true;
        }
        String path = request.getRequestURI();
        log.info("check uri ----------------------"+path);
        //로그인경로 체크안함
        if(path.startsWith("/api/member/login")){
            return true;
        }
        //회원가입경로 체크 안함
        if(path.startsWith("/api/member/register")){
            return true;
        }
        //아이디 중복체크 경로 체크 안함
        if(path.startsWith("/api/member/checkUserId")){
            return true;
        }

        //프로덕트 컨트롤러 경로는 체크안함
        if(path.startsWith("/product/")){
            return true;
        }
        //콘서트 경로도 체크안함
        if(path.startsWith("/concert/")){
            return true;
        }
        // 토큰 리프레시 엔드포인트도 체크 안함
        if (path.startsWith("/auth/refresh")) {
            return true;
        }
        //아이디찾기 제외
        if(path.startsWith("/api/member/findId")){
            return true;
        }
        //비밀번호찾기 제외
        if(path.startsWith("/api/member/findPw")){
            return true;
        }
        if(path.startsWith("/api/member/test/pw/")){
            return true;
        }
        if(path.startsWith("/api/member/add/review")){
            return true;
        }
        if(path.startsWith("/auth/logout")){
            return true;
        }
        if(path.startsWith("/auth/refresh")){
            return true;
        }
        if(path.startsWith("/user/send-reset-link"))  return true;
        if(path.startsWith("/user/reset-password"))  return true;
        if (path.startsWith("/api/member/profile-image")) return true;



        return false;
    }


    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        log.info("---------------------JWTCheckFilter-----------------------");
        String authHeaderStr = request.getHeader("Authorization");
        String path = request.getRequestURI();
        try{
            //Bearer accestoken
            String accessToken = authHeaderStr.substring(7);
            Map<String,Object> claims = JWTUtil.validateToken(accessToken);

            log.info("JWT claims:" + claims);



            String userRole = (String) claims.get("userRole");

            if (path.startsWith("/admin") && !"ADMIN".equals(userRole)) {
                response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                Gson gson = new Gson();
                String msg = gson.toJson(Map.of("error", "UNAUTHORIZED_ACCESS"));
                response.setContentType("application/json");
                PrintWriter printWriter = response.getWriter();
                printWriter.println(msg);
                printWriter.close();
                return;
            }
            UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                    claims.get("userId"),  // principal
                    null,  // credentials (null로 설정, 이미 토큰으로 인증됨)
                    Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + userRole)) // 권한
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);

            filterChain.doFilter(request, response);

        }catch (Exception e){
            log.error("JWT Check Error--------------------");
            log.error(e.getMessage());

            Gson gson = new Gson();
            String msg = gson.toJson(Map.of("error","ERROR_ACCESS_TOKEN"));

            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            PrintWriter printWriter = response.getWriter();
            printWriter.println(msg);
            printWriter.close();
        }





    }
}
