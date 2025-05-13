package com.green.project.Leo.dto.admin.concert;

import com.green.project.Leo.entity.concert.OrderStatusForConcert;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class RequestTicketModifyDTO {
    private Long id;
    private String trackingNumber;
    private OrderStatusForConcert status;

}
