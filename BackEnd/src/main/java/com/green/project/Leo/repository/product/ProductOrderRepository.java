package com.green.project.Leo.repository.product;

import com.green.project.Leo.entity.product.ProductOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProductOrderRepository extends JpaRepository<ProductOrder,Long> {
    @Query(value = "select * from product_order p join order_item o on p.order_num = o.product_order_num where p.order_num = :orderNum ",nativeQuery = true)
    ProductOrder selectOrderByOrderNum(@Param("orderNum")Long orderNum);

    @Query(value = "select * from product_order where u_id = :uid ",nativeQuery = true)
    List<ProductOrder> getOrderList(@Param("uid") Long uid);

    @Query(value = "SELECT MONTH(order_date) as month, SUM(CAST(REPLACE(REPLACE(total_price, ',', ''), '원', '') AS DECIMAL(15,0))) as total ,count(*)  FROM product_order WHERE YEAR(order_date) = :yearData GROUP BY MONTH(order_date) ORDER BY month;",nativeQuery = true)
    List<Object[]> findOrdersByYear(@Param("yearData") int yearData);
}
