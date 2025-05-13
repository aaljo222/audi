package com.green.project.Leo.repository.concert;

import com.green.project.Leo.entity.concert.ConcertImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

public interface ConcertImageRepository extends JpaRepository<ConcertImage,Long> {
    @Query(value = "select file_name from concert_image where c_no = :cNo",nativeQuery = true)
    String findFileNameByCNo(@Param("cNo") Long cNo);

    @Modifying
    @Transactional
    @Query(value = "update concert_image set file_name = :fileName where c_no = :cno",nativeQuery = true)
    void updateFileNameByCno(@Param("fileName")String fileName ,@Param("cno")Long cNo);

    @Modifying
    @Transactional
    @Query(value = "delete from concert_image where c_no = :cNo",nativeQuery = true)
    void deleteImgInfoByCno(@Param("cNo") Long cNo );
}
