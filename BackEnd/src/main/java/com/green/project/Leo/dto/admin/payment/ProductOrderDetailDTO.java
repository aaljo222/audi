package com.green.project.Leo.dto.admin.payment;

import com.green.project.Leo.dto.user.UserDTO;
import com.green.project.Leo.entity.product.OrderStatus;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Builder
public class ProductOrderDetailDTO {
    private Long orderNum;

    private UserDTO userDTO;

    private LocalDateTime orderDate;

    private OrderStatus status;

    private String shippingAddress;  // 배송 주소

    private String trackingNumber;  // 배송 추적 번호

    private String note; // 요청사항

    private String totalPrice;

    private List<OrderItemDTO> orderItemDTOList;
}
