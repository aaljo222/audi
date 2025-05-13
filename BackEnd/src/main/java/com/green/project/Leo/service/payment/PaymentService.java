package com.green.project.Leo.service.payment;

import com.green.project.Leo.dto.admin.payment.ProductRefundDetailDTO;
import com.green.project.Leo.dto.admin.payment.RefundApprovalRequestDTO;
import com.green.project.Leo.entity.payment.ProductRefund;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface PaymentService {

    List<ProductRefund> findByAll( Long productId, Long orderNum, Long userId);
    ProductRefundDetailDTO getRefundDetail(Long refundId);
    ResponseEntity<?> approveProductRefund(RefundApprovalRequestDTO requestDTO);
    ResponseEntity<?> rejectProductRefund(Long refundId,String reason);
}
