package com.green.project.Leo.dto.admin.concert;

import com.green.project.Leo.dto.concert.ConcertScheduleDTO;
import com.green.project.Leo.dto.user.UserDTO;

import com.green.project.Leo.entity.concert.OrderStatusForConcert;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ConcertTicketDetailDTO {


        private Long id;
        private ConcertScheduleDTO scheduleDTO;
        private UserDTO userDTO;
        private int ticketQuantity;
        private String buyMethod;
        private String buyerName;
        private String buyerTel;
        private String price;
        private String deliveryMethod;
        private LocalDate paymentDate;
        private String trackingNumber;
        private String shippingAddress;
        private OrderStatusForConcert status;
        private String concertName;
    }

