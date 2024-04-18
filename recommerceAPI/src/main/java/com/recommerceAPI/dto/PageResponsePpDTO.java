package com.recommerceAPI.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
public class PageResponsePpDTO<E> {

    private List<E> dtoList;

    private long totalCount; // 전체 데이터 수

    private PageRequestDTO pageRequestDTO; // 요청 페이지 정보

    @Builder(builderMethodName = "withAll")
       public PageResponsePpDTO(List<E> dtoList, long totalCount, PageRequestDTO pageRequestDTO ) {

        this.dtoList = dtoList;
        this.totalCount = (int) totalCount;
        this.pageRequestDTO = pageRequestDTO;

    }

}
