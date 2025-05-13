package com.green.project.Leo.repository.user;

import com.green.project.Leo.entity.user.Point;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface PointRepository extends JpaRepository<Point,Long> {

    @Query(value = "SELECT COALESCE(SUM(point_amount), 0) FROM point WHERE u_id = :uId", nativeQuery = true)
    Integer getTotalPointsByUId(@Param("uId") Long uId);
}
