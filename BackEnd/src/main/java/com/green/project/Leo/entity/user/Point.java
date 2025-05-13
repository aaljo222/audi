package com.green.project.Leo.entity.user;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Point {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long pointId ;

    @ManyToOne
    @JoinColumn(name = "uId")
    private User user;

    private String reason;

    private int pointAmount;

    private String eventType;

    private LocalDate issueDate;
}
