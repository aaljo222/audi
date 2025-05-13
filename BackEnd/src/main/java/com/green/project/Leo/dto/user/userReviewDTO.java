package com.green.project.Leo.dto.user;

import lombok.*;

import java.time.LocalDate;


@Builder
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class userReviewDTO {
    private Long pReviewNo;
    private String reviewtext;
    private Double reviewRating;
    private LocalDate dueDate;
    private String pname;
    private Long pno;
}
