package com.green.project.Leo.repository.concert;

import com.green.project.Leo.entity.concert.ConcertSchedule;
import com.green.project.Leo.entity.concert.ConcertTicket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ConcertTicketRepository extends JpaRepository<ConcertTicket,Long> {
    @Query(value = "select * from concert_ticket where schedule_id = :id ",nativeQuery = true)
    List<ConcertTicket> findTicketByScheduleId(@Param("id")Long scheduleId);

    @Query(value = "SELECT MONTH(payment_date) AS month, SUM(CAST(REPLACE(REPLACE(price, ',', ''), '원', '') AS DECIMAL(15,0))) AS total_amount , COUNT(*) AS ticket_count FROM concert_ticket WHERE YEAR(payment_date) = :yearData GROUP BY MONTH(payment_date) ORDER BY month " , nativeQuery = true)
    List<Object[]> findTicketByYear(@Param("yearData")int yearData);

    List<ConcertTicket> findByUser_UId(Long uId);
}
