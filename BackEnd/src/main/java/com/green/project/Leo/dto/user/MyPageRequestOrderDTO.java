package com.green.project.Leo.dto.user;

import com.green.project.Leo.dto.product.OrderItemDTO;
import com.green.project.Leo.entity.product.OrderStatus;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class MyPageRequestOrderDTO {

    private String orderNo;
    private LocalDateTime orderDate;
    private String shippingNum;
    private OrderStatus status;

    private List<OrderItemDTO> orderItems; // 여러 개의 상품 정보 저장

}
