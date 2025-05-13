package com.green.project.Leo.entity.concert;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Entity
@NoArgsConstructor
@Getter
@Table(name = "sum_concert")
public class ConcertReviewRating {
    @Id
    private Long cNo;
    private Double avgRating;
    private int reviewCount;

}
