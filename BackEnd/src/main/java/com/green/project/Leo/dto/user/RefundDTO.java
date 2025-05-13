package com.green.project.Leo.dto.user;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Builder
public class RefundDTO {
    private Long uid;
    private Long pno;
    private Long realOrderNum;
    private String reason;
}
