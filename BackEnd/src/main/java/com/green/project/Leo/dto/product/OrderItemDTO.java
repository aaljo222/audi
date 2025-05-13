package com.green.project.Leo.dto.product;

import com.green.project.Leo.entity.payment.RefundStatus;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class OrderItemDTO {
    private Long pno;
    private int numOfItem; //구매 수량
    private String productName; // 상품명
    private String productPrice;// 상품 가격
    private String imgFileName;
    private Boolean hasReview;
    private Long realOrderNum;
    private RefundStatus refundStatus;

}
