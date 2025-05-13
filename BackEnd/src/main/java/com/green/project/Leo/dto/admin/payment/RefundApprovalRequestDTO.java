package com.green.project.Leo.dto.admin.payment;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@NoArgsConstructor
@Getter
@Setter
@AllArgsConstructor
public class RefundApprovalRequestDTO {
    private Long refundId;
    private BigDecimal amount;
}
