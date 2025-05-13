package com.green.project.Leo.dto.product;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ProductReadDTO {
    private ProductDTO productDTO;
    private ProductReviewRatingDTO  reviewRatingDTO;
}
