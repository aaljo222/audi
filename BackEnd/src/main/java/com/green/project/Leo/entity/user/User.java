package com.green.project.Leo.entity.user;

import com.green.project.Leo.entity.concert.ConcertReview;
import com.green.project.Leo.entity.concert.ConcertTicket;
import com.green.project.Leo.entity.product.ProductCart;
import com.green.project.Leo.entity.product.ProductOrder;
import com.green.project.Leo.entity.product.ProductReview;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.Accessors;

import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Accessors(fluent = true)
//@Where(clause = "is_deleted = false")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long uId;

    @Column(nullable = false, unique = true)
    private String userId;

    @Column(nullable = false)
    private String userPw;

    private String userName;

    private String userEmail;

    private String userAddress;

    private String userPhoneNum;

    @Enumerated(EnumType.STRING)
    private UserRole userRole;

    @Column(name = "is_deleted")
    private boolean isDeleted = false;  // 기본값을 false로 설정

    private String profileImagePath;

    @OneToMany(mappedBy = "user", cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    private List<ConcertTicket> concertTickets = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    private List<ConcertReview> concertReviews = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    private List<ProductReview> productReviews = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    private List<ProductCart> productCarts = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    private List<ProductOrder> productOrders = new ArrayList<>();

    @Builder
    public User(String userId, String userPw, String userName, String userEmail, String userAddress,boolean isDeleted,UserRole userRole , String userPhoneNum ,  String profileImagePath) {
        this.userId = userId;
        this.userPw = userPw;
        this.userName = userName;
        this.userEmail = userEmail;
        this.userAddress = userAddress;
        this.isDeleted = isDeleted;
        this.userRole = userRole;
        this.userPhoneNum =userPhoneNum;
        this.profileImagePath = profileImagePath;
    }
}