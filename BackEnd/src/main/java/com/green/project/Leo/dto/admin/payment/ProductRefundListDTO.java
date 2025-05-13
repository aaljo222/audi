package com.green.project.Leo.dto.admin.payment;

import com.green.project.Leo.entity.payment.RefundStatus;
import lombok.*;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class ProductRefundListDTO {
    private Long refundId;
    private Long orderNum;
    private String userId;
    private RefundStatus status;
}
