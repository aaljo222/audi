package com.green.project.Leo.dto.user;

import com.green.project.Leo.entity.user.UserRole;
import lombok.*;

import java.util.HashMap;
import java.util.Map;

@Getter
@Setter
@Builder
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class UserDTO {
    private Long uid;

    private String userId;

    private String userPw;

    private String userName;

    private String userEmail;

    private String userAddress;

    private boolean isDeleted;

    private String userPhoneNum;

    private UserRole userRole;

    private String profileImagePath;

    public Map<String, Object> getClaims() {
        Map<String, Object> dataMap = new HashMap<>();

        dataMap.put("uid", uid);
        dataMap.put("userId", userId);
        dataMap.put("isDeleted", isDeleted);
        dataMap.put("userRole", userRole != null ? userRole.toString() : null);

        return dataMap;
    }
}
