package com.green.project.Leo.service.user;


import com.green.project.Leo.dto.user.*;
import com.green.project.Leo.entity.user.User;
import com.siot.IamportRestClient.exception.IamportResponseException;
import org.springframework.data.repository.query.Param;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

public interface MemberService {
    public  ResponseEntity<Map<String, Object>> registerMember(UserDTO userDTO); //회원가입
    public ResponseEntity<Map<String, Object>> checkUserId(String userId);// 아이디 중복 확인
    public  ResponseEntity<Map<String, Object>> login(UserDTO userDTO); // 로그인
    public UserDTO getProfile(String userId); // 아이디로 마이페이지 - 회원정보 불러오기
    public UserDTO updateProfile(String userId, UserDTO userDTO); // 마이페이지 - 회원정보 수정
    public ResponseEntity<Map<String, Object>> findId (String userName, String userEmail); // 아이디 찾기
    public  ResponseEntity<Map<String, Object>> findPw (String userName, String userId); // 비밀번호 찾기
    public List<MyPageRequestOrderDTO> findOrderByUid(Long uid);
    public Boolean deleteUser(UserDTO userDTO); // 회원탈퇴
    User selectByUserId(@Param("userId") String userId);
    public List<userReviewDTO> getMyReview(Long uid);
    //0409 공연 티켓 예약 내역 조회
    public List<UserReservationListDTO> getReservation(Long uid);
    public ResponseEntity<?> refundProduct(RefundDTO dto);
    public void cancelTicket(Long ticketID, String userPw, Long uid) throws IamportResponseException, IOException;
    public Boolean deleteReview(userReviewDTO userReviewDTO);
    public UserDTO updateProfileImage(String userId, MultipartFile profileImage);

}
