package com.green.project.Leo.entity.payment;

import com.green.project.Leo.entity.product.Product;
import com.green.project.Leo.entity.product.ProductOrder;
import com.green.project.Leo.entity.user.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ProductRefund {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long refundId;

    @ManyToOne
    @JoinColumn(name = "uId")
    private User user;

    @ManyToOne
    @JoinColumn(name = "orderNum")
    private ProductOrder productOrder;

    @ManyToOne
    @JoinColumn(name = "pNo")
    private Product product;

    private RefundStatus status;

    private String Reason;
}
