package com.green.project.Leo.dto.product;

import lombok.*;


import java.time.LocalDate;
@Builder
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class ResponseProductReviewDTO {

    private Long proReivewNo;
    private String userId;
    private String reviewtext;
    private Double reviewRating;
    private LocalDate dueDate;
    private String pname;
}
