package com.green.project.Leo.dto.admin.payment;

import com.green.project.Leo.entity.product.OrderStatus;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class ProductOrderListDTO {
    private Long orderNum;
    private Long uid;
    private OrderStatus status;
    private LocalDateTime orderDate;
}
