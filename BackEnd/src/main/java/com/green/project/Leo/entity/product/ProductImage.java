package com.green.project.Leo.entity.product;

import jakarta.persistence.*;
import lombok.*;

@Entity
@AllArgsConstructor
@Builder
@Getter
@Setter
@NoArgsConstructor
public class ProductImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long pImageNo;

    private String fileName;

    // 이미지->상품 방향으로는 cascade 설정 없음
    @ManyToOne
    @JoinColumn(name = "pNo")
    private Product product;
}