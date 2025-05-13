package com.green.project.Leo.dto.user;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Builder
public class CacncelDTO {
    private Long ticketId;
    private String userPw;
    private Long uid;
}
