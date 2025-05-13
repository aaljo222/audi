package com.green.project.Leo.repository.user;

import com.green.project.Leo.dto.user.UserDTO;
import com.green.project.Leo.entity.user.User;
import com.green.project.Leo.entity.user.UserRole;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User,Long> {

    @Query(value = "select * from user where user_id = :userId",nativeQuery = true)
    User selectByUserId(@Param("userId") String userId);

    boolean existsByUserId(String userId); //회원가입 할 때 아이디 중복 확인
    User findByUserId(String userId);  // 로그인 시 사용할 메서드
    Optional<User> findByUserNameAndUserEmail(String userName, String userEmail); // 아이디 찾기 메서드
    Optional<User> findByUserNameAndUserId(String userName, String userId); // 비밀번호 찾기 메서드
  // userId로 사용자를 찾는 쿼리 메서드
    // DTO -> Entity 변환 default 메서드
    default User convertToEntity(UserDTO userDTO) {
        return User.builder()
                .userId(userDTO.getUserId())
                .userPw(userDTO.getUserPw())
                .userName(userDTO.getUserName())
                .userEmail(userDTO.getUserEmail())
                .userAddress(userDTO.getUserAddress())
                .userRole(UserRole.USER)
                .userPhoneNum(userDTO.getUserPhoneNum())
                .build();
    }

    @EntityGraph(attributePaths = {"userRole"})
    @Query("SELECT u FROM User u WHERE u.userId = :userId")
    User getWithRoles(@Param("userId") String userId);


    @Modifying
    @Transactional
    @Query(value = "UPDATE user SET user_pw = :newPassword WHERE u_id = :uId", nativeQuery = true)
    void updateUserPassword(@Param("uId") Long uId, @Param("newPassword") String newPassword);
}
