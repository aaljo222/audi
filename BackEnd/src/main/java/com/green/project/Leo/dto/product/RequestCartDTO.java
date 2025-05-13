package com.green.project.Leo.dto.product;

import lombok.*;

@Getter
@Setter
@Builder
@ToString
@NoArgsConstructor
@AllArgsConstructor

public class RequestCartDTO {

    private String userId;
    private Long pNo;
    private int numOfItem;

}
