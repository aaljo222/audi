// ConcertSchedule.java 수정
package com.green.project.Leo.entity.concert;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
public class ConcertSchedule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long scheduleId;

    // 스케줄->콘서트 방향으로는 cascade 설정 없음
    @ManyToOne
    @JoinColumn(name = "cNo")
    private Concert concert;

    private LocalDateTime startTime;
    private LocalDateTime endTime;

    private int totalSeats;
    private int availableSeats;

    @Enumerated(EnumType.STRING)
    private ConcertStatus status;

    // 스케줄 삭제시 티켓도 삭제
    @OneToMany(mappedBy = "concertSchedule", cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REMOVE}, orphanRemoval = true)
    private List<ConcertTicket> tickets = new ArrayList<>();
}