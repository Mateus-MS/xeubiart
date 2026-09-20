package com.xeubiart.backend.domain.work.controller;

import com.xeubiart.backend.domain.work.DTO.*;
import com.xeubiart.backend.domain.work.model.TattooStyle;
import com.xeubiart.backend.domain.work.service.WorkService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api")
@AllArgsConstructor
public class WorkController {
    private WorkService workService;

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping(value = "/works", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public void createWork(@Valid @ModelAttribute CreateWorkRequest request) {
        workService.create(request);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping(value = "/works/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public void updateWork(@PathVariable UUID id,
                           @RequestPart("data") UpdateWorkRequest request,
                           @RequestPart(value = "images", required = false) List<MultipartFile> images
    ){
        workService.update(id, request, images);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin/works")
    public Page<AdminWorkResponse> findAdminWorks(
            @RequestParam(required = false) Boolean visible,
            Pageable pageable
    ) {
        return workService.findForAdmin(visible, pageable);
    }

//    @PreAuthorize("isAuthenticated()")
//    @GetMapping("/me/works")
//    public Page<UserWorkResponse> findMyWorks(Pageable pageable) {
//
//        UUID userId = authenticationService.getCurrentUserId();
//
//        return workService.findForUser(userId, pageable);
//    }

    @GetMapping("/works")
    public Page<PublicWorkResponse> findAll(@RequestParam(required = false) TattooStyle style, Pageable pageable) {
        return workService.findPublic(style, pageable);
    }

    @GetMapping("/works/{id}")
    public PublicWorkResponse findAll(@PathVariable UUID id, @RequestParam(required = false) TattooStyle style) {
        return workService.findPublicById(id, style);
    }

    @GetMapping("/works/random")
    public PublicWorkResponse findRandom(@RequestParam(required = false) TattooStyle style) {
        return workService.findRandomPublic(style);
    }
}