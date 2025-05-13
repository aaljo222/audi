package com.green.project.Leo.dto.admin.payment;

import com.green.project.Leo.entity.product.OrderStatus;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class RequestOrderModifyDTO {
    private OrderStatus status;
    private String trackingNumber;
    private Long orderNum;
}
