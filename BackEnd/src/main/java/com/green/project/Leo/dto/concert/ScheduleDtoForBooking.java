package com.green.project.Leo.dto.concert;

import com.green.project.Leo.entity.concert.ConcertStatus;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class ScheduleDtoForBooking {

    private Long scheduleId;

    private ConcertDTO concertDTO;

    private LocalDateTime startTime;
    private LocalDateTime endTime;

    private int totalSeats;
    private int availableSeats;

    private ConcertStatus status;
}
