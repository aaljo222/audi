package com.green.project.Leo.dto.product;

import lombok.*;

@Builder
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class RequestProductReviewDTO {
    private Double reviewRating;
    private String reviewtext;
    private Long   pno;
    private Long   orderNum;
    private Long   uid;
}
