package com.green.project.Leo.repository.concert;

import com.green.project.Leo.entity.concert.ConcertSchedule;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface ConcertScheduleRepository extends JpaRepository<ConcertSchedule,Long> {
    @Transactional
    @Modifying
    @Query(value = "delete from concert_schedule where c_no = :cNo" ,nativeQuery = true)
    void deleteScheduleByCno(@Param("cNo")Long cNo);

    @Query(value = "select * from concert_schedule where c_no = :cNo" ,nativeQuery = true)
    List<ConcertSchedule> getScheduleByCno(@Param("cNo")Long cNo);

    @Query(value = "select * from concert_schedule where c_no = :cNo and start_time = :startTime",nativeQuery = true)
    ConcertSchedule getScheduleByCnoAndStartTime(@Param("cNo")Long cNo, @Param("startTime")LocalDateTime startTime);


    @Query("SELECT c FROM ConcertSchedule c WHERE c.scheduleId = :scheduleId")
    Optional<ConcertSchedule> findByIdWithLock(@Param("scheduleId") Long scheduleId);

    @Query(value = "select sum(t.ticket_quantity) as sale_count from concert_ticket t  join concert_schedule s on t.schedule_id = s.schedule_id where s.c_no = :cNo",nativeQuery = true)
    Integer getSaleCount(@Param("cNo")Long cNo);
}
