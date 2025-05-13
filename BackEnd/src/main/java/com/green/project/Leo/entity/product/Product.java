package com.green.project.Leo.entity.product;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.Accessors;

import java.util.ArrayList;
import java.util.List;

@Entity
@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Accessors(fluent = true)
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long pNo;
    @Column(length = 500)
    private String pdesc;

    @Column(nullable = false)
    private String pName;

    @Column(nullable = false)
    private String pPrice;

    private int pStock;

    private String category;

    private boolean isDeleted = false;


    @OneToMany(mappedBy = "product", cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    private List<ProductImage> images = new ArrayList<>();


    @OneToMany(mappedBy = "product", cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    private List<ProductReview> reviews = new ArrayList<>();


    @OneToMany(mappedBy = "product", cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    private List<OrderItem> orderItems = new ArrayList<>();


    @OneToMany(mappedBy = "product", cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    private List<ProductCart> carts = new ArrayList<>();
}