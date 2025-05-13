package com.green.project.Leo.dto.admin.concert;

import com.green.project.Leo.entity.concert.OrderStatusForConcert;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class ConcertTicketListDTO {
    private Long id;
    private Long uid;
    private String cname;
    private LocalDate payment_date;
    private OrderStatusForConcert status;
}
