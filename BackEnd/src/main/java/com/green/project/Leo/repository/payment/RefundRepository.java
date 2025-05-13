package com.green.project.Leo.repository.payment;


import com.green.project.Leo.entity.payment.ProductRefund;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

    public interface RefundRepository extends JpaRepository<ProductRefund, Long> {
        @Query(""" 
        SELECT r FROM ProductRefund r
        WHERE r.user.uId = :userId
          AND r.product.pNo = :productId
          AND r.productOrder.orderNum = :orderNum
        """)
        List<ProductRefund> findByAll(@Param("productId") Long productId,
                                      @Param("orderNum") Long orderNum,
                                      @Param("userId") Long userId);

    }
