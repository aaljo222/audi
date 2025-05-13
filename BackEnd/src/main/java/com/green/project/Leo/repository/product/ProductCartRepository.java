package com.green.project.Leo.repository.product;

import com.green.project.Leo.entity.product.ProductCart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProductCartRepository extends JpaRepository<ProductCart,Long> {
    @Query(value = "select u.u_id,c.cart_no,c.num_of_item,c.p_no from product_cart c join user u on c.u_id = u.u_id where u.user_id = :user_id",nativeQuery = true)
    public List<ProductCart> selectCartByUserId(@Param("user_id")String userId);

    @Query(value = "SELECT c.cart_no,c.u_id,c.p_no,c.num_of_item FROM product_cart c JOIN user u ON c.u_id = u.u_id WHERE u.user_id = :userId AND c.p_no = :pNo", nativeQuery = true)
    public ProductCart selectDuplicate(@Param("userId")String userId,@Param("pNo")Long pno);
}
