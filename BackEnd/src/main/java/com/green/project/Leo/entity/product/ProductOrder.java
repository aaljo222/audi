package com.green.project.Leo.entity.product;

import com.green.project.Leo.entity.user.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ProductOrder {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long orderNum;

    // 주문->유저 방향으로는 cascade 설정 없음
    @ManyToOne
    @JoinColumn(name = "uId")
    private User user;

    private String payment;
    private String cardName;
    private LocalDateTime orderDate;

    @Enumerated(EnumType.STRING)
    private OrderStatus status;

    private String shippingAddress;  // 배송 주소
    private String trackingNumber;  // 배송 추적 번호
    private String note; // 요청사항
    private String totalPrice;
    private String imp_uid;

    // 주문 삭제시 주문 아이템도 삭제

    @OneToMany(mappedBy = "productOrder", cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REMOVE}, orphanRemoval = true)
    private List<OrderItem> orderItems = new ArrayList<>();
}