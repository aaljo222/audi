package com.green.project.Leo.dto.product;

import lombok.*;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Builder
public class ProductReviewRatingDTO {
    private Long pno;
    private Double avgrating;
    private int reviewcount;

}
