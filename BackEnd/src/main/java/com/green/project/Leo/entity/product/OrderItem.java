package com.green.project.Leo.entity.product;

import com.green.project.Leo.entity.payment.RefundStatus;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long orderItemNo;

    // 주문아이템->주문 방향으로는 cascade 설정 없음
    @ManyToOne
    @JoinColumn(name = "productOrderNum")
    private ProductOrder productOrder;

    // 주문아이템->상품 방향으로는 cascade 설정 없음
    @ManyToOne
    @JoinColumn(name = "pNo")
    private Product product;

    private int numOfItem;

    private int usingPoint;
    @Enumerated(EnumType.STRING)
    private RefundStatus refundStatus;// 환불 상태 추가
}
