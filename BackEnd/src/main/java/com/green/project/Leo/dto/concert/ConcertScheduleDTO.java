package com.green.project.Leo.dto.concert;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.green.project.Leo.entity.concert.ConcertStatus;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class ConcertScheduleDTO {
    private Long scheduleId;
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime startTime;
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime endTime;
    private int totalSeats;
    private ConcertStatus status;

}
