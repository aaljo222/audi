package com.green.project.Leo.entity.product;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;


@Entity
@NoArgsConstructor
@Getter
@Table(name = "sum_product")
public class ProductReviewRating {
    @Id
    private Long pNo;
    private Double avgRating;
    private int reviewCount;
}
