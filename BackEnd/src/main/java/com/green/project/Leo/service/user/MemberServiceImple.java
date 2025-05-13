package com.green.project.Leo.service.user;

import com.green.project.Leo.dto.product.OrderItemDTO;
import com.green.project.Leo.dto.user.*;
import com.green.project.Leo.entity.concert.Concert;
import com.green.project.Leo.entity.concert.ConcertImage;
import com.green.project.Leo.entity.concert.ConcertTicket;
import com.green.project.Leo.entity.concert.OrderStatusForConcert;
import com.green.project.Leo.entity.payment.ProductRefund;
import com.green.project.Leo.entity.payment.RefundStatus;
import com.green.project.Leo.entity.product.*;
import com.green.project.Leo.entity.user.Point;
import com.green.project.Leo.entity.user.User;
import com.green.project.Leo.repository.user.PointRepository;
import com.green.project.Leo.repository.user.UserRepository;
import com.green.project.Leo.repository.concert.ConcertScheduleRepository;
import com.green.project.Leo.repository.concert.ConcertTicketRepository;
import com.green.project.Leo.repository.payment.RefundRepository;
import com.green.project.Leo.repository.product.OrderItemRepository;
import com.green.project.Leo.repository.product.ProductOrderRepository;
import com.green.project.Leo.repository.product.ProductReviewRepository;
import com.green.project.Leo.util.CustomProfileUtil;
import com.green.project.Leo.util.DiscordLogger;
import com.green.project.Leo.util.JWTUtil;
import com.siot.IamportRestClient.IamportClient;
import com.siot.IamportRestClient.exception.IamportResponseException;
import com.siot.IamportRestClient.request.CancelData;
import com.siot.IamportRestClient.response.IamportResponse;
import com.siot.IamportRestClient.response.Payment;
import lombok.extern.log4j.Log4j2;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.rmi.RemoteException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Log4j2
public class MemberServiceImple implements MemberService {

    @Autowired
    private RefundRepository refundRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private ProductOrderRepository productOrderRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private ProductReviewRepository productReviewRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private ConcertTicketRepository concertTicketRepository;

    @Autowired
    private ConcertScheduleRepository scheduleRepository;
    @Autowired
    private IamportClient iamportClient;
    @Autowired
    private PointRepository pointRepository;
    @Autowired
    private DiscordLogger discordLogger;
    @Autowired
    private CustomProfileUtil profileUtil;
    @Override
    public  ResponseEntity<Map<String, Object>> registerMember(UserDTO userDTO){
        System.out.println("서비스 : " + userDTO);
        userDTO.setUserPw(passwordEncoder.encode(userDTO.getUserPw()));
        User user = userRepository.convertToEntity(userDTO);
        System.out.println("유저 에 폰넘"+user.userPhoneNum());
        User userEntity = userRepository.save(user);
        //회원가입시 2000p 적립
        Point point = new Point(null,userEntity,"가입기념 포인트 적립",2000,"포인트 적립",LocalDate.now());
        pointRepository.save(point);
        // 응답을 JSON 객체로 반환
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "회원 가입이 완료!!!!!.");

        return ResponseEntity.ok(response);
    }

    //아이디 중복 확인
    @Override
    public ResponseEntity<Map<String, Object>> checkUserId(String userId) {
        Boolean isUserIdExist = userRepository.existsByUserId(userId);

        Map<String, Object> response = new HashMap<>();
        if (isUserIdExist) {
            response.put("success", false);
            response.put("message", "아이디가 이미 존재합니다.");
        } else {
            response.put("success", true);
            response.put("message", "아이디가 사용 가능합니다.");
        }

        return ResponseEntity.ok(response);
    }


    // 로그인 처리
    @Override
    public ResponseEntity<Map<String, Object>> login(UserDTO userDTO) {
        Map<String, Object> response = new HashMap<>();
        //정보조회
        User user = userRepository.getWithRoles(userDTO.getUserId());

        // 존재하지 않는 아이디인 경우
        if (user == null) {
            System.out.println("그런 아이디는 존재하지 않아요");
            response.put("success", false);
            response.put("data", "존재하지 않는 아이디입니다.");
            return ResponseEntity.ok(response);
        }


        // 비밀번호가 일치하지 않는 경우
        if (!passwordEncoder.matches(userDTO.getUserPw(), user.userPw())) {
            System.out.println("비밀번호 틀렸어요.");
            response.put("success", false);
            response.put("data", "아이디 또는 비밀번호가 잘못되었습니다.");
            return ResponseEntity.ok(response);
        }

        // 탈퇴한 회원인 경우
        if (user.isDeleted()) {
            System.out.println("탈퇴한 회원이네요");
            response.put("success", false);
            response.put("data", "탈퇴하신분이에요");
            return ResponseEntity.ok(response);
        }


        // 로그인 성공 - UserDTO 변환
        UserDTO data = modelMapper.map(user, UserDTO.class);
        Map<String,Object> claims = data.getClaims();
        data.setUserPw(null);
        String accessToken = JWTUtil.generateToken(claims,10);
        String refreshToken = JWTUtil.generateToken(claims,60*24);

        log.info("엑세스"+ accessToken);
        // 응답 생성

        response.put("success", true);
        response.put("data", data);
        response.put("accessToken", accessToken);    // 액세스 토큰 추가
        response.put("refreshToken", refreshToken);  // 리프레시 토큰 추가

        return ResponseEntity.ok(response);
    }



    //마이페이지 정보 조회
    @Override
    public UserDTO getProfile(String userId) {
        User user = userRepository.findByUserId(userId);

        // 사용자가 존재하면 DTO로 변환하여 반환
        if (user != null) {
            return modelMapper.map(user, UserDTO.class);
        }
        // 사용자 없으면 null 반환
        return null;
    }

    //마이페이지 정보 수정
    @Override
    public UserDTO updateProfile(String userId, UserDTO userDTO) {

        User existingMember = userRepository.findByUserId(userId);

        existingMember.userName(userDTO.getUserName());
        existingMember.userEmail(userDTO.getUserEmail());
        existingMember.userAddress(userDTO.getUserAddress());
        existingMember.userPhoneNum(userDTO.getUserPhoneNum());

        User updatedMember = userRepository.save(existingMember);

        return modelMapper.map(updatedMember, UserDTO.class);
    }

    //아이디 찾기
    @Override
    public ResponseEntity<Map<String, Object>> findId(String userName, String userEmail) {

        System.out.println(userName+"메일"+userEmail);
        Optional<User> user = userRepository.findByUserNameAndUserEmail(userName,userEmail);
        System.out.println(user.map(User::userId));

        Map<String, Object> response = new HashMap<>();

        if(user.isPresent()){
            if(user.get().isDeleted()){
                response.put("success", false);
                response.put("data","탈퇴한 계정입니다.");
            }else {
                response.put("success", true);
                response.put("data", user.get().userId());
            }
        }else {
            response.put("success", false);
            response.put("data", "사용자가 없습니다.");
        }

        return ResponseEntity.ok(response);
    }

    //비밀번호 찾기
    @Override
    public  ResponseEntity<Map<String, Object>> findPw(String userName, String userId) {
        Optional<User> user = userRepository.findByUserNameAndUserId(userName, userId);
        System.out.println(user.map(User::userPw));

        Map<String, Object> response = new HashMap<>();  // 응답을 담을 맵

        if(user.isPresent()){

            if(user.get().isDeleted()){
                response.put("success", false);
                response.put("data", "탈퇴한 계정");
            }else{
                response.put("success", true);
                response.put("data", user.get().userPw());
            }
        }else {
         response.put("success", false);
         response.put("data", "찾을 수 없는 사용자");
        }
        return ResponseEntity.ok(response);

    }

    //주문내역 조회(order)
    @Override
    public List<MyPageRequestOrderDTO> findOrderByUid(Long uid) {
        System.out.println("오더가져오러옴");

        // 사용자의 주문 목록 가져오기
        List<ProductOrder> orderList = productOrderRepository.getOrderList(uid);
        System.out.println("오더리스트는 가져옴");

        List<MyPageRequestOrderDTO> result = new ArrayList<>();

        for(ProductOrder i : orderList) {
            // 주문번호에 해당하는 상품 리스트 가져오기
            List<OrderItem> orderItems = orderItemRepository.getOrderItemByOrderNum(i.getOrderNum());
            System.out.println("오더넘버"+i.getOrderNum());
            System.out.println("오더리스트"+orderItems);
            // 상품 정보를 저장할 리스트 생성
            List<OrderItemDTO> orderItemDTOList = new ArrayList<>();

            // 상품 리스트를 DTO로 변환
            for (OrderItem orderItem : orderItems) {
                List<ProductImage> images = orderItem.getProduct().images();
                OrderItemDTO orderItemDTO = new OrderItemDTO();
                orderItemDTO.setPno(orderItem.getProduct().pNo()); // 상품 번호
                orderItemDTO.setProductName(orderItem.getProduct().pName());// 상품명
                orderItemDTO.setImgFileName(!images.isEmpty() ? images.get(0).getFileName() : "");
                orderItemDTO.setNumOfItem(orderItem.getNumOfItem()); // 구매 수량
                orderItemDTO.setProductPrice(orderItem.getProduct().pPrice());// 상품 가격
                orderItemDTO.setHasReview(productReviewRepository.existsByProduct_PNoAndProductOrder_OrderNum(orderItem.getProduct().pNo(),i.getOrderNum()));
                orderItemDTO.setRealOrderNum(i.getOrderNum());
                orderItemDTO.setRefundStatus(orderItem.getRefundStatus());
                orderItemDTOList.add(orderItemDTO);
            }

            // 주문 정보 DTO 생성
                MyPageRequestOrderDTO myPageOrderDto = new MyPageRequestOrderDTO();
                myPageOrderDto.setOrderDate(i.getOrderDate());
                myPageOrderDto.setStatus(i.getStatus()); // 주문 상태 설정
                myPageOrderDto.setOrderItems(orderItemDTOList);// 상품 목록 추가

            // 운송장 정보 설정
            if (i.getTrackingNumber() != null && i.getShippingAddress() != null && !i.getShippingAddress().isEmpty()) {
                myPageOrderDto.setShippingNum(i.getTrackingNumber());
            } else {
                myPageOrderDto.setShippingNum("운송장 등록 전입니다");
            }

            // 주문번호 생성 (주문 날짜 + 주문 번호 조합)
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMdd");
            String orderNum = i.getOrderNum() != null ? i.getOrderNum().toString() : "000000";
            myPageOrderDto.setOrderNo(i.getOrderDate().format(formatter) + orderNum);

            result.add(myPageOrderDto);
        }

        return result;
    }

    //내 리뷰 조회
    @Override
    public List<userReviewDTO> getMyReview(Long uid) {
        System.out.println("내 리뷰 조회 중");
        List<ProductReview> myReviewList = productReviewRepository.getReviewList(uid);
        List<userReviewDTO> userReviewList = new ArrayList<>();

        for(ProductReview p : myReviewList){
            userReviewDTO userReviewDTO = com.green.project.Leo.dto.user.userReviewDTO.builder()
                    .pReviewNo(p.getPReviewNo())
                    .reviewtext(p.getReviewtext())
                    .reviewRating(p.getReviewRating())
                    .dueDate(p.getDueDate())
                    .pname(p.getProduct().pName())
                    .pno(p.getProduct().pNo())
                    .build();

            userReviewList.add(userReviewDTO);
        }
        return userReviewList;
    }

    @Override
    public List<UserReservationListDTO> getReservation(Long uid) {
        // 1. 사용자 예약 티켓 정보 가져오기
        List<ConcertTicket> concertTickets = concertTicketRepository.findByUser_UId(uid);

        // 2. DTO로 변환하여 리스트로 반환
        return concertTickets.stream()
                .map(this::convertToDTO) // 공통 변환 로직 호출
                .collect(Collectors.toList());
    }

    // 티켓 정보를 DTO로 변환하는 공통 메소드
    private UserReservationListDTO convertToDTO(ConcertTicket ticket) {
        // 공연 정보
        Concert concert = ticket.getConcertSchedule().getConcert(); //  Concert 객체 따로 저장
        Long cNo = concert.getCNo(); //  콘서트 ID 추출

        // 공연 정보
        String concertName = ticket.getConcertSchedule().getConcert().getCName();
        String concertPlace = ticket.getConcertSchedule().getConcert().getCPlace();
        LocalDateTime concertStartTime = ticket.getConcertSchedule().getStartTime();

        // 예매 정보
        int ticketQuantity = ticket.getTicketQuantity();
        String price = ticket.getPrice();
        OrderStatusForConcert status = ticket.getStatus();
        LocalDate paymentDate = ticket.getPaymentDate();
        String deliveryMethod = ticket.getDeliveryMethod();
        // 포스터 이미지 URL
        String posterImageUrl = ticket.getConcertSchedule().getConcert().getImages().stream()
                .findFirst()
                .map(ConcertImage::getFileName)
                .orElse(""); // 이미지가 없으면 빈 문자열 반환

        // DTO 반환
        return UserReservationListDTO.builder()
                .ticketId(ticket.getId())
                .cNo(cNo) //0411
                .concertName(concertName)
                .concertPlace(concertPlace)
                .concertStartTime(concertStartTime)
                .ticketQuantity(ticketQuantity)
                .price(price)
                .status(status)
                .paymentDate(paymentDate)
                .deliveryMethod(deliveryMethod)
                .posterImageUrl(posterImageUrl) // 포스터 이미지 URL 추가
                .build();
    }
    // 회원 탈퇴 삭제
    @Override
    public Boolean deleteUser(UserDTO userDTO) {

        User user = userRepository.findByUserId(userDTO.getUserId());

        if (!passwordEncoder.matches(userDTO.getUserPw(), user.userPw())) {
            return false; // 비밀번호가 일치하지 않음
        }
        user.isDeleted(true); // 사용자를 삭제 상태로 표시
        userRepository.save(user);
        return true;
    }

    @Override
    public User selectByUserId(String userId) {
        return userRepository.selectByUserId(userId);
    }

    //0415 주문 취소
    @Override
    public ResponseEntity<?> refundProduct(RefundDTO dto) {

        ProductRefund productRefund = new ProductRefund();
        productRefund.setProduct(new Product().pNo(dto.getPno()));
        productRefund.setUser(new User().uId(dto.getUid()));

        ProductOrder order = new ProductOrder();
        order.setOrderNum(dto.getRealOrderNum());

        productRefund.setProductOrder(order);
        productRefund.setReason(dto.getReason());
        productRefund.setStatus(RefundStatus.WAITING);

        refundRepository.save(productRefund);

        // 실제 DB에서 해당 주문의 상품 리스트 가져오기
        List<OrderItem> orderItems = orderItemRepository.getOrderItemByOrderNum(dto.getRealOrderNum());

        // 개별 상품 환불 상태 업데이트 (주문 내 모든 상품 중 해당 상품만 환불 처리)
        for (OrderItem orderItem : orderItems) {
            if (orderItem.getProduct().pNo().equals(dto.getPno())&& orderItem.getProductOrder().getOrderNum().equals(dto.getRealOrderNum())) {
                orderItem.setRefundStatus(RefundStatus.WAITING); // 환불 상태 변경
                orderItemRepository.save(orderItem); // 상태 업데이트
            }
        }
        discordLogger.refundRequest(dto.getPno()+"번 상품 환불 요청이 들어왔습니다.");
        return ResponseEntity.ok("환불요청이 완료되었습니다");
    }

    @Transactional
    @Override
    public void cancelTicket(Long ticketID, String userPw, Long uid) throws IamportResponseException, IOException {
        // 비밀번호 검증
        User user = userRepository.findById(uid).get();
        if (!passwordEncoder.matches(userPw, user.userPw())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "비밀번호가 일치하지 않습니다!");
        }

        ConcertTicket ticket = concertTicketRepository.findById(ticketID).get();
        ticket.setStatus(OrderStatusForConcert.CANCEL_COMPLETED);
        concertTicketRepository.save(ticket);
        try {
            CancelData cancelData = new CancelData(ticket.getImp_uid(), true);
            IamportResponse<Payment> response = iamportClient.cancelPaymentByImpUid(cancelData);
            if(response.getCode()==0){
                ticket.getConcertSchedule().setAvailableSeats(ticket.getConcertSchedule().getAvailableSeats()+ticket.getTicketQuantity());
                scheduleRepository.save(ticket.getConcertSchedule());
                discordLogger.refundRequest(ticket.getConcertSchedule().getConcert().getCName()+" 의"+ticket.getConcertSchedule().getStartTime()+"타임 티켓이 환불처리됨");
            }else {
                throw new RemoteException();
            }
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

    }

    @Override
    public Boolean deleteReview(userReviewDTO userReviewDTO) {

        ProductReview productReview = productReviewRepository.findById(userReviewDTO.getPReviewNo()).orElse(null);

        if(productReview == null || productReview.isReviewDeleted()){
            return  false;
        }
        productReview.setReviewDeleted(true); // 논리 삭제 처리!!!
        productReviewRepository.save(productReview);
        return true;
    }

    @Override
    public UserDTO updateProfileImage(String userId, MultipartFile profileImage) {
        // 1. 사용자 엔티티 조회
        User user = userRepository.findByUserId(userId);
        if (user == null) {
            throw new IllegalArgumentException("사용자가 존재하지 않습니다.");
        }

        // 2. 기존 프로필 이미지 삭제 (있다면)
        String currentProfileImage = user.profileImagePath();
        if (currentProfileImage != null && !currentProfileImage.equals("default.png")) {
            profileUtil.deleteProfileImage(currentProfileImage);
        }

        // 3. 새 프로필 이미지 저장
        String newProfileImageName = profileUtil.saveProfileImage(profileImage);

        // 4. 사용자 엔티티에 새 프로필 이미지 경로 설정
        user.profileImagePath(newProfileImageName);

        // 5. 엔티티 저장 (프로필 이미지 경로 업데이트)
        userRepository.save(user);
        return null;
    }

}