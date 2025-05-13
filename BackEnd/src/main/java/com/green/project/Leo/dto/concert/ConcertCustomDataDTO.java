package com.green.project.Leo.dto.concert;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class ConcertCustomDataDTO {
    private Long scheduleId;
    private int ticketQuantity;
    private String deliveryMethod;
    private Long uid;
}
