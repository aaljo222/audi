package com.green.project.Leo.repository.concert;

import com.green.project.Leo.entity.concert.Concert;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ConcertRepository extends JpaRepository<Concert,Long> {
    Page<Concert> findByCategory(String category, Pageable pageable);

    // 랭킹 코드
    List<Concert> findByCategoryOrderBySaleCountDesc(String category, Pageable pageable);

    @Query(value = "select c.c_no,c.c_name,c.c_place,c.c_price,c.category,c.cdesc,sum(t.ticket_quantity) as sale_count from concert c join concert_schedule s on c.c_no = s.c_no join concert_ticket t on s.schedule_id = t.schedule_id group by c.c_no order by sale_count",nativeQuery = true)
    List<Concert> findRanking();

    List<Concert> findAllByOrderBySaleCountDesc(Pageable pageable);
}
