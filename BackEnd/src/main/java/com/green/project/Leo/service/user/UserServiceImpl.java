package com.green.project.Leo.service.user;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.green.project.Leo.dto.concert.ConcertCustomDataDTO;
import com.green.project.Leo.dto.user.UserDTO;
import com.green.project.Leo.dto.product.*;

import com.green.project.Leo.entity.PasswordResetToken;
import com.green.project.Leo.entity.concert.ConcertStatus;
import com.green.project.Leo.entity.user.Point;
import com.green.project.Leo.entity.user.User;
import com.green.project.Leo.entity.concert.ConcertSchedule;
import com.green.project.Leo.entity.concert.ConcertTicket;
import com.green.project.Leo.entity.concert.OrderStatusForConcert;
import com.green.project.Leo.entity.product.*;

import com.green.project.Leo.repository.user.PasswordResetTokenRepository;
import com.green.project.Leo.repository.user.PointRepository;
import com.green.project.Leo.repository.user.UserRepository;
import com.green.project.Leo.repository.concert.ConcertScheduleRepository;
import com.green.project.Leo.repository.concert.ConcertTicketRepository;
import com.green.project.Leo.repository.product.*;
import com.green.project.Leo.util.DiscordLogger;
import com.siot.IamportRestClient.IamportClient;
import com.siot.IamportRestClient.exception.IamportResponseException;
import com.siot.IamportRestClient.request.CancelData;

import com.siot.IamportRestClient.response.IamportResponse;
import com.siot.IamportRestClient.response.Payment;
import jakarta.mail.internet.MimeMessage;
import jakarta.persistence.EntityNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.math.BigDecimal;
import java.text.NumberFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;


@Service
@Slf4j
public class UserServiceImpl implements UserService {

    @Autowired
    private DiscordLogger discordLogger;
    @Autowired
    private IamportClient iamportClient;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ProductCartRepository cartRepository;

    @Autowired
    private ProductImageRepository imageRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private ProductOrderRepository orderRepository;

    @Autowired
    private OrderItemRepository itemRepository;

    @Autowired
    private ConcertScheduleRepository scheduleRepository;

    @Autowired
    private ConcertTicketRepository ticketRepository;

    @Autowired
    private PasswordResetTokenRepository passwordResetTokenRepository;

    @Autowired
    private org.springframework.mail.javamail.JavaMailSender mailSender; //

    @Autowired
    private PointRepository pointRepository;

    @Override
    public String addCart(RequestCartDTO cartDTO) {
        ProductCart result = cartRepository.selectDuplicate(cartDTO.getUserId(), cartDTO.getPNo());
        if (result == null) {
            ProductCart productCart = ProductCart.builder()
                    .product(productRepository.findById(cartDTO.getPNo()).orElse(null))
                    .user(userRepository.selectByUserId(cartDTO.getUserId()))
                    .numOfItem(cartDTO.getNumOfItem())
                    .build();
            cartRepository.save(productCart);
        } else {
            result.setNumOfItem(result.getNumOfItem() + cartDTO.getNumOfItem());
            cartRepository.save(result);
        }
        return "장바구니에 담았습니다.";
    }

    @Override
    public List<ProductCartDTO> selectCartList(String userId) {
        List<ProductCart> result = cartRepository.selectCartByUserId(userId);
        List<ProductCartDTO> cartDTOList = new ArrayList<>();
        for (ProductCart i : result) {
            List<String> imglist = imageRepository.findFileNamesByPNo(i.getProduct().pNo());
            ProductDTO productDTO = modelMapper.map(i.getProduct(), ProductDTO.class);
            productDTO.setUploadFileNames(imglist);
            ProductCartDTO cartDTO = ProductCartDTO.builder()
                    .cartNo(i.getCartNo())
                    .userDTO(modelMapper.map(i.getUser(), UserDTO.class))
                    .productDTO(productDTO)
                    .numofItem(i.getNumOfItem())
                    .build();
            cartDTO.getUserDTO().setUserPw(null);
            cartDTOList.add(cartDTO);
        }
        return cartDTOList;
    }

    @Transactional
    @Override
    public String addOrder(String imp_uid, ProductOrderDTO orderDTO) throws IamportResponseException, IOException {
        IamportResponse<Payment> payment = iamportClient.paymentByImpUid(imp_uid);
        Payment paymentInformation = payment.getResponse();
        orderDTO.setPayment(paymentInformation.getPayMethod());
        orderDTO.setCardName(paymentInformation.getCardName());

        //환불때 포인트 계산을 위해 , 주문시 적립을 위해
        int totalPrice = Integer.parseInt(orderDTO.getTotalPrice().replaceAll("[원,]",""));
        int calcPrice = totalPrice + orderDTO.getUsingPoint();
        //유저 객체 생성
        User user = new User();
        user.uId(orderDTO.getUserdto().getUid());

        //주문정보 셋 하기
        ProductOrder productOrder = new ProductOrder();
        productOrder.setUser(user);
        productOrder.setPayment(orderDTO.getPayment());
        productOrder.setCardName(orderDTO.getCardName());
        productOrder.setStatus(OrderStatus.PAY_COMPLETED);
        productOrder.setShippingAddress(orderDTO.getShippingAddress());
        productOrder.setOrderDate(LocalDateTime.now());
        productOrder.setNote(orderDTO.getNote());
        productOrder.setTotalPrice(orderDTO.getTotalPrice());
        productOrder.setImp_uid(imp_uid);
        List<OrderItemDTO> itemListDto = orderDTO.getOrderItems();
        List<OrderItem> itemlist = new ArrayList<>();

        //가격 검증을 위해 ( iamport가 빅데시말을 사용해서)
        BigDecimal realPrice = BigDecimal.ZERO;

        //오더 아이템 정보 ( 주문한 상품, 개수 저장하는곳)
        for (OrderItemDTO i : itemListDto) {
            Product product = productRepository.findById(i.getPno()).orElseThrow();

            //상품 실제 가격
            int price = Integer.parseInt((product.pPrice().replaceAll("[원,]", "")));
            //결제한금액 과 실제금액의 비교를 위해
            realPrice = realPrice.add(BigDecimal.valueOf((long) i.getNumOfItem() * price));

            //재고 관리
            product.pStock(product.pStock() - i.getNumOfItem());
            if (product.pStock() - i.getNumOfItem() <= 0) {
                discordLogger.sendMessage("상품명:" + product.pName() + " 품절되었습니다");
            }
            Product updateProduct = productRepository.save(product);


            // 포인트를 사용했을때 환불 과정에서 환불 금액 계산을 위해 비율로 계산해서 포인트 사용내역을 저장했음
            double ratio =  ((double) price / calcPrice);
            int usingPoint = (int) Math.ceil(orderDTO.getUsingPoint() * ratio);
            OrderItem orderItem = OrderItem.builder()
                    .numOfItem(i.getNumOfItem())
                    .product(updateProduct)
                    .productOrder(productOrder)
                    .usingPoint(usingPoint)
                    .build();
            itemlist.add(orderItem);
        }
        realPrice = realPrice.subtract(BigDecimal.valueOf(orderDTO.getUsingPoint()));

        //결제한금액과 실제 db에 금액이 맞지 않을때
        if (paymentInformation.getAmount().compareTo(realPrice) != 0) {
            discordLogger.sendErrorLog("비정상적인 결제요청이 들어왔습니다 !!!!!!");
            discordLogger.sendErrorLog("결제 금액: " + paymentInformation.getAmount() + " 계산된 금액: " + realPrice);
            CancelData cancelData = new CancelData(paymentInformation.getImpUid(), true, paymentInformation.getAmount());
            cancelData.setReason("결제 금액 불일치");
            IamportResponse<Payment> cancelResponse = iamportClient.cancelPaymentByImpUid(cancelData);
            if (cancelResponse.getCode() == 0) {
                discordLogger.sendMessage("결제금액 불일치로 환불처리:" + cancelResponse.getResponse().getImpUid());
                throw new IOException("비정상적인 결제금액으로 결제가 취소되었습니다");
            }
        }
        productOrder.setOrderItems(itemlist);
        ProductOrder orderInformation = orderRepository.save(productOrder);

        //포인트 사용했을때 사용내역 디비에 남기기
        Point point = new Point(null,user,null,-orderDTO.getUsingPoint(),"포인트 결제",LocalDate.now());
        pointRepository.save(point);

        //주문금액 대비 3% 포인트 적립
        int points = (int) Math.ceil(totalPrice * 0.03);
        Point rewardPoint = new Point(null,user,"결제금액 3% 포인트 적립",points,"구매 적립",LocalDate.now());
        pointRepository.save(rewardPoint);

        //주문번호 제조
        LocalDate date = LocalDate.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMdd");
        String formatDate = date.format(formatter);
        String orderCode = formatDate + orderInformation.getOrderNum();
        cartRepository.deleteById(orderDTO.getUserdto().getUid());

        return "주문번호:" + orderCode;
    }

    @Transactional(rollbackFor = {Exception.class})
    @Override
    public void addConcertOrder(String uid) throws IamportResponseException, IOException {
        IamportResponse<Payment> payment = iamportClient.paymentByImpUid(uid);
        Payment paymentInformation = payment.getResponse();
        NumberFormat formatter = NumberFormat.getNumberInstance(Locale.KOREA);
        CancelData cancelData = new CancelData(paymentInformation.getImpUid(), true, paymentInformation.getAmount());
        String customDataJson = paymentInformation.getCustomData();
        ObjectMapper objectMapper = new ObjectMapper();
        ConcertCustomDataDTO customData = objectMapper.readValue(customDataJson, ConcertCustomDataDTO.class);

        User user = new User();
        user.uId(customData.getUid());
        try {
            ConcertSchedule concertSchedule = scheduleRepository.findByIdWithLock(customData.getScheduleId())
                    .orElseThrow(() -> new EntityNotFoundException("해당 콘서트 스케줄을 찾을 수 없습니다: " + customData.getScheduleId()));

            if (concertSchedule.getAvailableSeats() < customData.getTicketQuantity()) {
                cancelData.setReason("티켓 매진");
                IamportResponse<Payment> cancelResponse = iamportClient.cancelPaymentByImpUid(cancelData);
                if (cancelResponse.getCode() == 0) {
                    discordLogger.sendMessage("티켓매진으로 인하여 환불처리:" + cancelResponse.getResponse().getImpUid());
                    throw new IOException("예약 가능한 티켓 수량이 부족해 취소되었습니다 결제한 금액은 취소처리될 예정입니다");
                }
            }
            concertSchedule.setAvailableSeats(concertSchedule.getAvailableSeats() - customData.getTicketQuantity());

            //사용자 결제금액과 상품 금액이 일치하지않는경우 로그남기고 결제취소시킴
            long price = Long.parseLong(concertSchedule.getConcert().getCPrice().replaceAll("[원,]", ""));
            BigDecimal calculatedAmount = BigDecimal.valueOf(customData.getTicketQuantity() * price);
            BigDecimal paymentAmount = paymentInformation.getAmount();
            if (paymentAmount.compareTo(calculatedAmount) != 0) {
                discordLogger.sendErrorLog("비정상적인 결제요청이 들어왔습니다 !!!!!!");
                discordLogger.sendErrorLog("결제 금액: " + paymentAmount + " 계산된 금액: " + calculatedAmount);
                cancelData.setReason("결제 금액 불일치");
                IamportResponse<Payment> cancelResponse = iamportClient.cancelPaymentByImpUid(cancelData);
                if (cancelResponse.getCode() == 0) {
                    discordLogger.sendMessage("결제금액 불일치로 환불처리:" + cancelResponse.getResponse().getImpUid());
                    throw new IOException("비정상적인 결제금액으로 결제가 취소되었습니다");
                }
            }

            //예매가능티켓수가 없으면 디스코드에 로깅하고 상태변경해주기
            if (concertSchedule.getAvailableSeats() <= 0) {
                concertSchedule.setStatus(ConcertStatus.SOLD_OUT);
                discordLogger.sendMessage(concertSchedule.getConcert().getCName() + "의 " + concertSchedule.getStartTime() + "시간이 매진되었습니다");
            }


            //모든 필터 통과한후 스케줄테이블에 변경사항을 저장함
            ConcertSchedule modifyAvailable = scheduleRepository.save(concertSchedule);

            //티켓정보 생성후 저장
            ConcertTicket concertTicket = ConcertTicket.builder()
                    .shippingAddress(paymentInformation.getBuyerAddr())
                    .buyerName(paymentInformation.getBuyerName())
                    .buyerTel(paymentInformation.getBuyerTel())
                    .price(formatter.format(paymentInformation.getAmount()) + "원")
                    .buyMethod(paymentInformation.getPayMethod())
                    .concertSchedule(modifyAvailable)
                    .ticketQuantity(customData.getTicketQuantity())
                    .deliveryMethod(customData.getDeliveryMethod())
                    .paymentDate(LocalDate.now())
                    .status(OrderStatusForConcert.RESERVATION)
                    .user(user)
                    .imp_uid(uid)
                    .build();
            ticketRepository.save(concertTicket);
        }catch (EntityNotFoundException e){
            cancelData.setReason("존재하지 않는 콘서트 스케줄");
            IamportResponse<Payment> cancelResponse = iamportClient.cancelPaymentByImpUid(cancelData);
            if (cancelResponse.getCode() == 0) {
                discordLogger.sendMessage("존재하지 않는 스케줄로 환불처리:" + cancelResponse.getResponse().getImpUid());
            }
            throw new IOException("요청하신 콘서트 정보를 찾을수없어 취소처리되었습니다.");
        }
    }

    @Override
    public void deleteFromCart(Long cartNo) {
        cartRepository.deleteById(cartNo);
    }

    @Override
    public User findByUserId(String userId) {
        return userRepository.findByUserId(userId);
    }
    @Transactional
    @Override
    public void savePasswordResetToken(User user, String token) {
        log.info("tokenReset 101) {},  {}", user,token);
        // 먼저 해당 유저에 대한 기존 토큰 삭제
        passwordResetTokenRepository.deleteByUser(user);
        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setToken(token);
        resetToken.setUser(user);
        resetToken.setExpiryDate(LocalDateTime.now().plusMinutes(30));
        passwordResetTokenRepository.save(resetToken);
    }

    @Override
    public void sendResetEmail(String toEmail, String resetLink) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(toEmail);
            helper.setSubject("비밀번호 재설정 링크");
            System.out.println("여기까지옴");

            // HTML에서 % 기호를 %% 로 이스케이프 처리하고, 주황색 테마와 직사각형 디자인으로 변경
            String htmlContent = """
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>비밀번호 재설정</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Apple SD Gothic Neo', 'Malgun Gothic', '맑은 고딕', sans-serif;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%%" style="background-color: #f9f9f9; padding: 20px;">
                <tr>
                    <td align="center">
                        <table border="0" cellpadding="0" cellspacing="0" width="500" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); overflow: hidden;">
                            <!-- 헤더 -->
                            <tr>
                                <td align="center" bgcolor="#FF7518" style="padding: 35px 0;">
                                    <h1 style="color: #ffffff; margin: 0; font-size: 24px;">비밀번호 재설정</h1>
                                </td>
                            </tr>
                            <!-- 콘텐츠 -->
                            <tr>
                                <td style="padding: 50px 30px;">
                                    <p style="color: #333333; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">안녕하세요,</p>
                                    <p style="color: #333333; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">비밀번호 재설정 요청을 받았습니다.<br/> 아래 버튼을 클릭하여 새로운 비밀번호를 설정하세요.</p>
                                    <p style="text-align: center; margin: 50px 0;">
                                        <a href="%s" style="display: inline-block; background-color: #FF7518; color: #ffffff; font-weight: bold; text-decoration: none; padding: 15px 40px; border-radius: 4px; font-size: 16px;">비밀번호 재설정하기</a>
                                    </p>
                                    <p style="color: #777777; font-size: 14px; line-height: 1.6; margin-bottom: 25px;">메일 수신후 30분안에 변경해주세요! 30분이 지나면 무효화됩니다.</p>
                                    <p style="color: #777777; font-size: 14px; line-height: 1.6;">버튼이 작동하지 않는 경우, 아래 링크를 복사하여 브라우저에 붙여넣기 해주세요:</p>
                                    <p style="word-break: break-all; font-size: 13px; color: #888888; margin-top: 5px;">%s</p>
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
        """.formatted(resetLink, resetLink);

            helper.setText(htmlContent, true);
            helper.setFrom("audimew0404@naver.com");

            mailSender.send(message);
        } catch (Exception e) {
            throw new RuntimeException("메일 전송 실패: " + e.getMessage(), e);
        }
    }

    @Override
    public void save(User user) {
        userRepository.save(user);
    }

    @Override
    public void testRefund(String imp_uid) throws IamportResponseException, IOException {
        
        CancelData cancelData = new CancelData(imp_uid,true, BigDecimal.valueOf(100));
        try {
            cancelData.setReason("테스트");
            IamportResponse<Payment> cancelResponse = iamportClient.cancelPaymentByImpUid(cancelData);
            if(cancelResponse.getCode()==0){
                discordLogger.refundRequest("환불테스트 성공");
            }
        }catch (IOException e){
            throw new IOException(e);
        }
    }

}
