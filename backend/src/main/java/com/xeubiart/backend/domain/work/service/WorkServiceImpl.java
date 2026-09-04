package com.xeubiart.backend.domain.work.service;

import com.xeubiart.backend.domain.work.DTO.CreateWorkRequest;
import com.xeubiart.backend.domain.work.DTO.SearchWorkResponse;
import com.xeubiart.backend.domain.work.DTO.UpdateWorkRequest;
import com.xeubiart.backend.domain.work.entity.WorkEntity;
import com.xeubiart.backend.domain.work.repository.WorkRepository;
import com.xeubiart.backend.exceptions.EntityNotFoundException;
import com.xeubiart.backend.services.fileService.service.FileService;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.UUID;

@Service
@AllArgsConstructor
@Transactional
public class WorkServiceImpl implements WorkService{
    private FileService fileService;
    private WorkRepository workRepository;

    @Override
    public void create(CreateWorkRequest request) {
        WorkEntity work = WorkEntity.builder()
                .title(request.getTitle())
                .style(request.getStyle())
                .description(request.getDescription())
                .visible(request.isVisible())
                .build();

        try{
            work.setPhotosURLs(this.fileService.saveMultiple(request.getImages()));
        } catch (IOException e){
            e.printStackTrace();
        }

        this.workRepository.save(work);
    }

    @Override
    public Page<SearchWorkResponse> find(Boolean visible, Pageable pageable) {
        if (visible == null) {
            return workRepository.findAll(pageable)
                    .map(this::toResponse);
        }
        if (visible) {
            return workRepository.findByVisibleTrue(pageable)
                    .map(this::toResponse);
        }
        return workRepository.findByVisibleFalse(pageable)
                .map(this::toResponse);
    }

    @Override
    public void update(UUID id, UpdateWorkRequest request) {
        WorkEntity work = this.workRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Work not found: " + id
                ));

        if (request.getTitle() != null) {
            work.setTitle(request.getTitle());
        }

        if (request.getDescription() != null) {
            work.setDescription(request.getDescription());
        }

        if (request.getStyle() != null) {
            work.setStyle(request.getStyle());
        }

        if (request.getVisible() != null) {
            work.setVisible(request.getVisible());
        }

        this.workRepository.save(work);
    }

    private SearchWorkResponse toResponse(WorkEntity work) {
        return new SearchWorkResponse(
                work.getId(),
                work.getTitle(),
                work.getStyle(),
                work.getDescription(),
                work.getPhotosURLs(),
                work.isVisible()
        );
    }
}
