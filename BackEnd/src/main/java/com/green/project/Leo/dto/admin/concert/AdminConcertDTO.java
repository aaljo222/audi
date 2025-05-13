package com.green.project.Leo.dto.admin.concert;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class AdminConcertDTO {
    private Long cno;
    private String cname;
    private String cprice;
    private String category;
    private String imgFileName;
}
