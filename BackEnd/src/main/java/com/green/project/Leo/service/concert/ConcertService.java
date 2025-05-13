package com.green.project.Leo.service.concert;


import com.green.project.Leo.dto.concert.ConcertDTO;
import com.green.project.Leo.dto.concert.ConcertScheduleDTO;
import com.green.project.Leo.dto.concert.ResponseListDTO;
import com.green.project.Leo.dto.concert.ScheduleDtoForBooking;
import com.green.project.Leo.dto.pageable.PageRequestDTO;
import com.green.project.Leo.dto.pageable.PageResponseDTO;

import java.time.LocalDateTime;
import java.util.List;


public interface ConcertService {
    public PageResponseDTO<ResponseListDTO> getConcertList(PageRequestDTO dto,String category);
    public ConcertDTO getConcertByCno(Long cno);
    public ScheduleDtoForBooking getConcertScheduleByCnoAndStartTime(Long cno , LocalDateTime startTime);
    // 추가: 세일즈 카운트 기준 정렬 리스트
    List<ResponseListDTO> getRankingBySales(String category, int limit);
}
