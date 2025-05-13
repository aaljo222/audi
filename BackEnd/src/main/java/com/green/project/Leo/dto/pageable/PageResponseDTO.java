package com.green.project.Leo.dto.pageable;


import lombok.Builder;
import lombok.Data;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Data
public class PageResponseDTO<E>{
    private List<E> dtoList;
    private List<Integer> pageNumList;
    private PageRequestDTO pageRequestDTO;// 현재페이지(page), size( 페이지당 size)
    private boolean prev,next;
    private int totalCount, prevPage, nextPage, totalPage, current;



    @Builder(builderMethodName = "withAll")
    public PageResponseDTO(List<E> dtoList, PageRequestDTO pageRequestDTO,long totalCount){
        this.dtoList=dtoList;

        this.pageRequestDTO= pageRequestDTO;
        this.totalCount=(int)totalCount;

        int end =(int)(Math.ceil(pageRequestDTO.getPage()/10.0))*10;
        int start = end-9;
        int last = (int)(Math.ceil((totalCount/(double)pageRequestDTO.getSize())));
        end =end >last ? last :end;
        this.prev= start>1;
        this.next =totalCount >end *pageRequestDTO.getSize();

        this.pageNumList= IntStream.rangeClosed(start,end).boxed().collect(Collectors.toList());
        if(prev) this.prevPage=start-1;
        if(next) this.nextPage=end+1;
        this.totalPage= this.pageNumList.size();
        this.current= pageRequestDTO.getPage();

    }
    //prev ,next는 이전 페이지가 있는가 ,다음페이지가 있는가
    //totalCnt(총 데이터수 )
    //nextPage(다음페이지 번호 )
    //totalPage(총 페이지 수 )
}
