package com.xeubiart.backend.domain.work.controller;

import com.xeubiart.backend.domain.work.DTO.CreateWorkRequest;
import com.xeubiart.backend.domain.work.DTO.SearchWorkResponse;
import com.xeubiart.backend.domain.work.service.WorkService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/work")
@AllArgsConstructor
public class WorkController {
    private WorkService workService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public void createWork(@Valid @ModelAttribute CreateWorkRequest request){
        workService.create(request);
    }

    @GetMapping
    public Page<SearchWorkResponse> findAll(Pageable pageable){
        return this.workService.findAll(pageable);
    }
}