package com.xeubiart.backend.domain.work.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter @Builder @AllArgsConstructor
public class PhotoResponse {
    private String url;
    private int width;
    private int height;
}
