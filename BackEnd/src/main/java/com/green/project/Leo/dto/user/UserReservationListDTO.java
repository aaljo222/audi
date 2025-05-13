package com.green.project.Leo.dto.user;

import com.green.project.Leo.entity.concert.OrderStatusForConcert;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class UserReservationListDTO {

    private Long ticketId;

    // 공연 정보
    private Long cNo;
    private String concertName;
    private String concertPlace;

    // 공연 일정
    private LocalDateTime concertStartTime;

    // 예매 요약 정보
    private int ticketQuantity;
    private String price;
    private OrderStatusForConcert status;
    private LocalDate paymentDate;

    //포스터 이미지 불러오기
    private String posterImageUrl; // 해당 공연의 포스터 이미지 URL
    private String deliveryMethod;

}
