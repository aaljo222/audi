package com.green.project.Leo.dto.concert;

import com.green.project.Leo.entity.concert.ConcertSchedule;
import com.green.project.Leo.entity.concert.ConcertStatus;
import jakarta.persistence.*;
import lombok.*;
import org.aspectj.util.FileUtil;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@ToString
public class ConcertDTO {

    private Long cno;

    private String cname;

    private String cprice;

    private String cdesc;

    private String cplace;


    private MultipartFile file;

    private String category;

    private String uploadFileName;

    private List<ConcertScheduleDTO> schedulesDtoList;
}
