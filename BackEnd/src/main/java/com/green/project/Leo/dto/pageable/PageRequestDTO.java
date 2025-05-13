package com.green.project.Leo.dto.pageable;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
public class PageRequestDTO {
    @Builder.Default
    private int page=1;//기본값은 현재 페이지가 1페이지

    @Builder.Default
    private int size=10;//기본값으로 10개의 데이터
}
