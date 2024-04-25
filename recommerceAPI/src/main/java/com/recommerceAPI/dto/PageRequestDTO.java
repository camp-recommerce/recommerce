package com.recommerceAPI.dto;

import lombok.Builder;
import lombok.Data;
import lombok.experimental.SuperBuilder;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Data
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
public class PageRequestDTO {

    @Builder.Default
    private int page = 1;

    @Builder.Default
    private int size = 8;

    //0425임형욱
    @Builder.Default
    private String sortBy = "pno";  // 기본적으로 pno 필드를 기준으로 정렬합니다.

    //0425임형욱
    @Builder.Default
    private boolean direction = false;  // 기본적으로 내림차순으로 정렬합니다. true면 오름차순.
}
