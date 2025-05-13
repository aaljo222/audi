package com.green.project.Leo.dto.product;

import com.green.project.Leo.dto.user.UserDTO;
import lombok.*;


import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class ProductOrderDTO {
    private Long orderNum;


    private UserDTO userdto;
    private String cardName;
    private String payment;

    private LocalDateTime orderDate;

    private String shippingAddress;  // 배송 주소
    private String trackingNumber;  // 배송 추적 번호
    private String note;
    private String totalPrice;
    private List<OrderItemDTO> orderItems;

    private int usingPoint;
}
