package com.green.project.Leo.entity.concert;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ConcertImage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long cImageNo;

    private String fileName;

    // 이미지->콘서트 방향으로는 cascade 설정 없음 (콘서트 삭제시 이미지를 삭제하지만, 이미지 삭제시 콘서트를 삭제하지는 않음)
    @ManyToOne
    @JoinColumn(name = "cNo")
    private Concert concert;
}
