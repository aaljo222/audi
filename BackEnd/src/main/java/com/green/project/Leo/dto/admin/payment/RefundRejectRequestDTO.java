package com.green.project.Leo.dto.admin.payment;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class RefundRejectRequestDTO {
    private Long refundId;
    private String reason;
}
