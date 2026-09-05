package com.xeubiart.backend.domain.work.controller;

import com.xeubiart.backend.domain.work.DTO.CreateWorkRequest;
import com.xeubiart.backend.domain.work.DTO.SearchWorkResponse;
import com.xeubiart.backend.domain.work.DTO.UpdateWorkRequest;
import com.xeubiart.backend.domain.work.service.WorkService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/work")
@AllArgsConstructor
public class WorkController {
    private WorkService workService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public void createWork(@Valid @ModelAttribute CreateWorkRequest request) {
        workService.create(request);
    }

    @GetMapping
    public Page<SearchWorkResponse> findAll(@RequestParam(required = false) Boolean visible, Pageable pageable){
        return this.workService.find(visible, pageable);
    }

    @PatchMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public void updateWork(@PathVariable UUID id,
                           @RequestPart("data") UpdateWorkRequest request,
                           @RequestPart(value = "images", required = false) List<MultipartFile> images
    ){
        workService.update(id, request, images);
    }
}