package com.green.project.Leo.repository.product;

import com.green.project.Leo.entity.product.ProductReview;
import com.green.project.Leo.entity.product.ProductReviewRating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ProductReviewRatingRepository extends JpaRepository<ProductReviewRating,Long> {
    @Query(value = "select * from product_rating where p_no = :p_no" ,nativeQuery = true)
    Optional<ProductReviewRating> reviewRatingByPno(@Param("p_no")Long pno);


}
