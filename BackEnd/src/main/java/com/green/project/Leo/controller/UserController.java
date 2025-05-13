package com.green.project.Leo.controller;

import com.green.project.Leo.dto.product.ProductCartDTO;

import com.green.project.Leo.dto.product.ProductOrderDTO;
import com.green.project.Leo.dto.product.RequestCartDTO;

import com.green.project.Leo.dto.user.UserDTO;
import com.green.project.Leo.entity.PasswordResetToken;
import com.green.project.Leo.entity.user.User;
import com.green.project.Leo.repository.user.PasswordResetTokenRepository;
import com.green.project.Leo.repository.user.PointRepository;
import com.green.project.Leo.service.user.UserService;
import com.siot.IamportRestClient.exception.IamportResponseException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@Slf4j
@RequestMapping("/user")
@CrossOrigin("http://localhost:3000")
public class UserController {


    @Autowired
    private UserService service;

    @Autowired
    private PointRepository pointRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private PasswordResetTokenRepository passwordResetTokenRepository;

    @Value("${frontend.url:http://localhost:3000}")
    private String frontendUrl;

    @PostMapping("/addcart")
    public String addCart(@ModelAttribute RequestCartDTO cartDTO){

        return service.addCart(cartDTO);
    }

    @GetMapping("/cartlist/{userId}")
    public List<ProductCartDTO> selectCartlist(@PathVariable(name = "userId")String userId){

        return service.selectCartList(userId);
    }
    @DeleteMapping("/delete/cart/{cartNo}")
    public void deleteProductFromCart(@PathVariable(name = "cartNo")Long cartNo){
        service.deleteFromCart(cartNo);
    }

    @PostMapping("/purchase/{imp_uid}")
    public ResponseEntity<?> purchaseProduct(@PathVariable(name = "imp_uid") String imp_uid, @RequestBody  ProductOrderDTO orderDTO)
            throws IamportResponseException, IOException {
        try {
            String result = service.addOrder(imp_uid, orderDTO);
            return ResponseEntity.ok(result);
        }catch (IOException e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PostMapping("/reservation/{imp_uid}")
    public ResponseEntity<?> reservationTicket(@PathVariable(name = "imp_uid")String imp_uid) throws IamportResponseException,IOException{
                try {
                    service.addConcertOrder(imp_uid);
                    return ResponseEntity.ok("티켓 예매 성공");
                }catch (IOException e){
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
                }

    }

    @PostMapping("/send-reset-link")
    public ResponseEntity<?> sendResetLink(@RequestBody UserDTO dto) {
        log.info("비밀번호 reset 요청: {}", dto);

        User user = service.findByUserId(dto.getUserId());

        if(user == null){
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "해당 사용자가 존재하지 않습니다."));
        }


        if (!user.userEmail().equals(dto.getUserEmail())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "이메일이 일치하지 않습니다."));
        }

        String token = UUID.randomUUID().toString();
        service.savePasswordResetToken(user, token);

        String resetLink = frontendUrl + "/reset-password?token=" + token;
        service.sendResetEmail(dto.getUserEmail(), resetLink);

        return ResponseEntity.ok(Map.of("message", "비밀번호 재설정 링크가 이메일로 전송되었습니다."));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> body) {
        String token = body.get("token");
        String newPassword = body.get("password");
        log.info("reset password: {},newPassword:{}",body,newPassword);
        PasswordResetToken resetToken = passwordResetTokenRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("유효하지 않은 토큰입니다."));

        if (resetToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "토큰이 만료되었습니다."));
        }

        User user = resetToken.getUser();
        user.userPw(passwordEncoder.encode(newPassword));
        service.save(user);
        passwordResetTokenRepository.delete(resetToken);

        return ResponseEntity.ok(Map.of("message", "비밀번호가 변경되었습니다."));
    }

    @GetMapping("/point/{uid}")
    public int getPointSum(@PathVariable(name = "uid")Long uId){
        System.out.println("여기까지옴?"+uId);
            return pointRepository.getTotalPointsByUId(uId);
    }

}
