package com.green.project.Leo.entity.product;

import com.green.project.Leo.entity.user.User;
import jakarta.persistence.*;
import lombok.*;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
public class ProductCart {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long cartNo;

    // 장바구니->유저 방향으로는 cascade 설정 없음
    @ManyToOne
    @JoinColumn(name = "uId")
    private User user;

    // 장바구니->상품 방향으로는 cascade 설정 없음
    @ManyToOne
    @JoinColumn(name = "pNo")
    private Product product;

    private int numOfItem;
}