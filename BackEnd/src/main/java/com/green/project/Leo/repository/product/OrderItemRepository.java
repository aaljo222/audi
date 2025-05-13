package com.green.project.Leo.repository.product;

import com.green.project.Leo.entity.product.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface OrderItemRepository extends JpaRepository<OrderItem,Long> {
    @Query(value = "select * from order_item where product_order_num = :orderNum ",nativeQuery = true)
    List<OrderItem> getOrderItemByOrderNum(@Param("orderNum")Long orderNum );

    @Query(value = "select * from order_item where product_order_num = :orderNum and p_no = :pNo",nativeQuery = true)
    OrderItem getOrderItemByOrderNumAndPNo(@Param("orderNum")Long orderNum,@Param("pNo")Long pNo);


}
