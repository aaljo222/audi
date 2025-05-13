package com.green.project.Leo.entity.concert;

import com.green.project.Leo.entity.user.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
public class ConcertReview {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long cReviewNo;

    @Column(nullable = false)
    private int reviewRating;

    @Column(nullable = false)
    private String reviewtext;

    private LocalDate dueDate;

    // 리뷰->콘서트 방향으로는 cascade 설정 없음
    @ManyToOne
    @JoinColumn(name = "cNo")
    private Concert concert;

    // 리뷰->유저 방향으로는 cascade 설정 없음 (리뷰 삭제가 유저 삭제로 이어지면 안됨)
    @ManyToOne
    @JoinColumn(name = "userId")
    private User user;
}