package com.green.project.Leo.entity.concert;

import com.green.project.Leo.entity.user.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ConcertTicket {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 티켓->스케줄 방향으로는 cascade 설정 없음
    @ManyToOne
    @JoinColumn(
            name = "scheduleId",
            foreignKey = @ForeignKey(
                    name = "FK_TICKET_SCHEDULE",
                    foreignKeyDefinition = "FOREIGN KEY (schedule_id) REFERENCES concert_schedule(schedule_id) ON DELETE CASCADE ON UPDATE CASCADE"
            )
    )
    private ConcertSchedule concertSchedule;

    // 티켓->유저 방향으로는 cascade 설정 없음 (티켓 삭제가 유저 삭제로 이어지면 안됨)
    @ManyToOne
    @JoinColumn(
            name = "uId",
            foreignKey = @ForeignKey(
                    name = "FK_TICET_SCHDULE_OF_USER",
                    foreignKeyDefinition = "FOREIGN KEY (u_id) REFERENCES user(u_id) ON DELETE CASCADE ON UPDATE CASCADE"
            )
    )
    private User user;

    private OrderStatusForConcert status;
    private int ticketQuantity;
    private String buyMethod;
    private String buyerName;
    private String buyerTel;
    private String price;
    private String deliveryMethod;
    private LocalDate paymentDate;
    private String trackingNumber;
    private String shippingAddress;
    private String imp_uid;
}