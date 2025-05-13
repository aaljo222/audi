package com.green.project.Leo.repository.product;

import com.green.project.Leo.entity.product.ProductImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;

public interface ProductImageRepository extends JpaRepository<ProductImage,Long> {
    @Query(value ="select file_name from product_image where p_no = :pNo",nativeQuery = true)
    List<String> findFileNamesByPNo(@Param("pNo") Long pNo);

    @Query(value ="select p_image_no from product_image where file_name = :filename",nativeQuery = true )
    Long findImageNoByFilename(@Param("filename") String filename);

    @Modifying
    @Transactional
    @Query(value = "delete from product_image where p_no = :pNo",nativeQuery = true)
    void deletebyPno(@Param("pNo") Long pNo);


}
