package com.green.project.Leo.service.payment;

import com.green.project.Leo.dto.admin.payment.ProductRefundDetailDTO;
import com.green.project.Leo.dto.admin.payment.RefundApprovalRequestDTO;
import com.green.project.Leo.entity.payment.ProductRefund;
import com.green.project.Leo.entity.payment.RefundStatus;
import com.green.project.Leo.entity.product.OrderItem;
import com.green.project.Leo.entity.product.Product;
import com.green.project.Leo.entity.product.ProductOrder;
import com.green.project.Leo.entity.user.Point;
import com.green.project.Leo.entity.user.User;
import com.green.project.Leo.repository.payment.RefundRepository;
import com.green.project.Leo.repository.product.OrderItemRepository;
import com.green.project.Leo.repository.product.ProductImageRepository;
import com.green.project.Leo.repository.product.ProductRepository;
import com.green.project.Leo.repository.user.PointRepository;
import com.green.project.Leo.util.DiscordLogger;
import com.siot.IamportRestClient.IamportClient;
import com.siot.IamportRestClient.exception.IamportResponseException;
import com.siot.IamportRestClient.request.CancelData;
import com.siot.IamportRestClient.response.IamportResponse;
import com.siot.IamportRestClient.response.Payment;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import jakarta.persistence.EntityNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.interceptor.TransactionAspectSupport;

import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

@Service
@Slf4j
public class PaymentServiceImpl  implements PaymentService {
    @Autowired
    private IamportClient iamportClient;
    @Autowired
    private RefundRepository refundRepository;
    @Autowired
    private ProductImageRepository productImageRepository;
    @Autowired
    private OrderItemRepository orderItemRepository;
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private DiscordLogger discordLogger;
    @Autowired
    private JavaMailSender mailSender;
    @Autowired
    private PointRepository pointRepository;
    @Override
    public List<ProductRefund> findByAll(Long productId, Long orderNum, Long userId) {
        log.info("service refund: productId {},orderNum:{},userId:{}", productId, orderNum, userId);
        return refundRepository.findByAll(productId, orderNum, userId);
    }

    @Override
    public ProductRefundDetailDTO getRefundDetail(Long refundId) {
        // 환불 정보 조회
        ProductRefund refund = refundRepository.findById(refundId)
                .orElseThrow(() -> new RuntimeException("환불 정보를 찾을 수 없습니다."));

        // 관련 엔티티 가져오기
        Product product = refund.getProduct();
        ProductOrder order = refund.getProductOrder();
        User user = refund.getUser();

        //아이템 개수받아오기 위해서 조회
        OrderItem orderItem = orderItemRepository.getOrderItemByOrderNumAndPNo(order.getOrderNum(), product.pNo());

        // 생성자를 활용하여 DTO 생성
        ProductRefundDetailDTO dto = new ProductRefundDetailDTO(
                refund.getRefundId(),
                refund.getReason(),
                refund.getStatus(),
                product.pName(),
                product.pPrice(),
                order.getOrderDate(),
                orderItem.getNumOfItem(),
                user.userId(),
                user.userName(),
                user.userPhoneNum(),
                user.userAddress(),
                order.getImp_uid()
        );

        // 이미지 파일명은 생성자에 포함되지 않았으므로 별도로 설정
        dto.setProductImgFileName(productImageRepository.findFileNamesByPNo(product.pNo())
                .stream()
                .findFirst()
                .orElse(null));

        return dto;
    }

    @Transactional
    @Override
    public ResponseEntity<?> approveProductRefund(RefundApprovalRequestDTO requestDTO) {

        ProductRefund refund = refundRepository.findById(requestDTO.getRefundId())
                .orElseThrow(() -> new EntityNotFoundException("환불 정보를 찾을 수 없습니다. ID: " + requestDTO.getRefundId()));


        if (RefundStatus.COMPLETE.equals(refund.getStatus())) {
            return ResponseEntity.badRequest().body("이미 처리된 환불 요청입니다.");
        }

        OrderItem orderItem = orderItemRepository.getOrderItemByOrderNumAndPNo(
                refund.getProductOrder().getOrderNum(),
                refund.getProduct().pNo()
        );


        refund.setStatus(RefundStatus.COMPLETE);
        orderItem.setRefundStatus(RefundStatus.COMPLETE);

        refund.getProduct().pStock(refund.getProduct().pStock()+orderItem.getNumOfItem());

        productRepository.save(refund.getProduct());
        refundRepository.save(refund);
        orderItemRepository.save(orderItem);


        String imp_uid = refund.getProductOrder().getImp_uid();

        try {
            CancelData cancelData = new CancelData(imp_uid, true, requestDTO.getAmount().subtract(BigDecimal.valueOf(orderItem.getUsingPoint())));
            IamportResponse<Payment> response = iamportClient.cancelPaymentByImpUid(cancelData);

            if (response.getCode() == 0) {
                Point point = new Point(null,refund.getUser(),"상품 환불로 결제에 사용한 포인트 환불", orderItem.getUsingPoint(),"포인트 환불", LocalDate.now());
                pointRepository.save(point);
                discordLogger.refundRequest(requestDTO.getRefundId()+"번 주문의 환불 승인 완료후 환불 처리 진행하였습니다");
                return ResponseEntity.ok("승인완료 후 정상적으로 환불처리 진행하였습니다.");
            } else {
                TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
                return ResponseEntity.badRequest().body("환불과정에 오류가 발생했습니다 : " + response.getMessage());
            }
        } catch (IamportResponseException | IOException e) {
            TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
            return ResponseEntity.badRequest().body("아임포트 클라이언트 오류");
        }
    }
    
    @Transactional
    @Override
    public ResponseEntity<?> rejectProductRefund(Long refundId,String reason){

        ProductRefund refund = refundRepository.findById(refundId)
                .orElseThrow(() -> new EntityNotFoundException("환불 정보를 찾을 수 없습니다. ID: " +refundId));

        if(RefundStatus.REJECTED.equals(refund.getStatus())){
            return ResponseEntity.badRequest().body("이미 처리된 환불 요청입니다.");
        }
        OrderItem orderItem = orderItemRepository.getOrderItemByOrderNumAndPNo(
                refund.getProductOrder().getOrderNum(),
                refund.getProduct().pNo()
        );

        orderItem.setRefundStatus(RefundStatus.REJECTED);
        refund.setStatus(RefundStatus.REJECTED);

        refundRepository.save(refund);
        OrderItem result = orderItemRepository.save(orderItem);


        LocalDateTime orderDateTime = refund.getProductOrder().getOrderDate();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMdd");
        String formattedDate = orderDateTime.format(formatter);
        String orderNumber = formattedDate + refund.getProductOrder().getOrderNum();


        try{
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message,true,"UTF-8");

            helper.setTo(refund.getUser().userEmail());
            helper.setSubject("환불 거절사유 안내문");
            String htmlContent = """
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>환불 요청 거절 안내</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Apple SD Gothic Neo', 'Malgun Gothic', '맑은 고딕', sans-serif;">
        <table border="0" cellpadding="0" cellspacing="0" width="100%%" style="background-color: #f9f9f9; padding: 20px;">
            <tr>
                <td align="center">
                    <table border="0" cellpadding="0" cellspacing="0" width="500" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); overflow: hidden;">
                        <!-- 헤더 -->
                        <tr>
                            <td align="center" bgcolor="#FF7518" style="padding: 35px 0;">
                                <h1 style="color: #ffffff; margin: 0; font-size: 24px;">환불 요청 거절 안내</h1>
                            </td>
                        </tr>
                        <!-- 콘텐츠 -->
                        <tr>
                            <td style="padding: 50px 30px;">
                                <p style="color: #333333; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">안녕하세요, %s님.</p>
                                <p style="color: #333333; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
                                  요청하신 상품 환불이 처리되지 않았음을 안내드립니다.<br/>
                                  주문번호: <strong>%s</strong><br/>
                                  상품명: <strong>%s</strong>
                                </p>
                                <div style="background-color: #f8f8f8; border-left: 4px solid #FF7518; padding: 15px; margin: 30px 0;">
                                    <p style="color: #333333; font-size: 16px; margin: 0; font-weight: bold;">거절 사유:</p>
                                    <p style="color: #555555; font-size: 15px; margin-top: 10px; line-height: 1.6;">%s</p>
                                </div>
                                <p style="color: #333333; font-size: 16px; line-height: 1.6; margin-top: 30px;">
                                  추가 문의사항이 있으시면 고객센터로 연락 부탁드립니다.
                                </p>
                                <p style="text-align: center; margin: 40px 0 25px;">
                                    <a href="%s" style="display: inline-block; background-color: #FF7518; color: #ffffff; font-weight: bold; text-decoration: none; padding: 15px 40px; border-radius: 4px; font-size: 16px;">고객센터 문의하기</a>
                                </p>
                            </td>
                        </tr>
                        <!-- 푸터 -->
                        <tr>
                            <td bgcolor="#f8f8f8" style="padding: 25px 30px; border-top: 1px solid #eeeeee;">
                                <p style="color: #999999; font-size: 13px; text-align: center; margin: 0;">© 2025 AudiMew. All rights reserved.</p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    """.formatted(
                    refund.getUser().userName(),
                    orderNumber,  // 생성한 주문번호 변수 사용
                    refund.getProduct().pName(),
                    reason,
                    "http://localhost:3000/"
            );
         helper.setText(htmlContent,true);
         helper.setFrom("audimew0404@naver.com");
         mailSender.send(message);
            
        } catch (MessagingException e) {
            throw new RuntimeException("메일 전송 실패" +e.getMessage());
        }


        return ResponseEntity.ok("환불상태 변경 후 거절사유 이메일 발송 완료");
    }
}
