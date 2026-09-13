package com.xeubiart.backend.domain.work.service;

import com.xeubiart.backend.controllerAdvice.exceptions.ResourceNotFoundException;
import com.xeubiart.backend.domain.imageMetadata.models.ImageDimensions;
import com.xeubiart.backend.domain.imageMetadata.service.ImageMetadataService;
import com.xeubiart.backend.domain.work.DTO.AdminWorkResponse;
import com.xeubiart.backend.domain.work.DTO.CreateWorkRequest;
import com.xeubiart.backend.domain.work.DTO.PublicWorkResponse;
import com.xeubiart.backend.domain.work.DTO.UpdateWorkRequest;
import com.xeubiart.backend.domain.work.entity.PhotoEntity;
import com.xeubiart.backend.domain.work.entity.WorkEntity;
import com.xeubiart.backend.domain.work.exceptions.InvalidPhotoOrderException;
import com.xeubiart.backend.domain.work.mapper.WorkMapper;
import com.xeubiart.backend.domain.work.repository.WorkRepository;
import com.xeubiart.backend.domain.fileStorage.service.FileStorageService;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
@Transactional
public class WorkServiceImpl implements WorkService{
    private FileStorageService fileStorageService;
    private WorkRepository workRepository;
    private WorkMapper workMapper;
    private ImageMetadataService imageMetadataService;

    @Override
    public void create(CreateWorkRequest request) {

        WorkEntity work = this.workMapper.toEntity(request);

        List<PhotoEntity> photos = request.getImages()
                .stream()
                .map(this::savePhoto)
                .collect(Collectors.toCollection(ArrayList::new));

        work.setPhotos(photos);

        workRepository.save(work);
    }

    private PhotoEntity savePhoto(MultipartFile image) {

        ImageDimensions dimensions = this.imageMetadataService.getDimensions(image);

        String url = this.fileStorageService.save(image);

        return PhotoEntity.builder()
                .url(url)
                .width(dimensions.getWidth())
                .height(dimensions.getHeight())
                .build();
    }

    @Override
    public Page<PublicWorkResponse> findPublic(Pageable pageable){
        return workRepository
                .findByVisibleTrue(pageable)
                .map(workMapper::toPublicResponse);
    }
//    public Page<UserWorkResponse> findForUser(UUID userId, Pageable pageable){
//        return workRepository
//                .findByCustomerId(userId, pageable)
//                .map(workMapper::toUserResponse);
//    }

    @Override
    public Page<AdminWorkResponse> findForAdmin(Boolean visible, Pageable pageable){
        Page<WorkEntity> works;

        if(visible == null){
            works = workRepository.findAll(pageable);
        }else{
            works = workRepository.findByVisible(visible, pageable);
        }

        return works.map(workMapper::toAdminResponse);
    }

    @Override
    public void update(
            UUID id,
            UpdateWorkRequest request,
            List<MultipartFile> images
    ) {
        WorkEntity work = workRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Work not found: " + id
                        )
                );

        workMapper.updateEntity(request, work);

        if (request.getPhotos() == null) {
            workRepository.save(work);
            return;
        }

        List<PhotoEntity> oldPhotos =
                new ArrayList<>(work.getPhotos());

        List<PhotoEntity> newPhotos =
                syncImages(
                        oldPhotos,
                        request.getPhotos(),
                        images
                );

        work.setPhotos(newPhotos);

        try {
            workRepository.save(work);
        } catch (RuntimeException e) {
            deleteNewImages(oldPhotos, newPhotos);
            throw e;
        }

        deleteRemovedImages(oldPhotos, newPhotos);
    }

    private List<PhotoEntity> syncImages(
            List<PhotoEntity> oldPhotos,
            List<UpdateWorkRequest.PhotoOrder> photoOrder,
            List<MultipartFile> images
    ) {
        Map<String, PhotoEntity> newImages = saveNewImages(images);

        return new ArrayList<>(
                photoOrder.stream()
                        .map(photo -> {
                            if ("new".equals(photo.getType())) {
                                PhotoEntity savedPhoto =
                                        newImages.get(photo.getValue());

                                if (savedPhoto == null) {
                                    throw new InvalidPhotoOrderException(
                                            "Missing uploaded image: "
                                                    + photo.getValue()
                                    );
                                }

                                return savedPhoto;
                            }

                            if ("existing".equals(photo.getType())) {
                                return oldPhotos.stream()
                                        .filter(existing ->
                                                photo.getValue()
                                                        .equals(existing.getUrl())
                                        )
                                        .findFirst()
                                        .orElseThrow(() ->
                                                new InvalidPhotoOrderException(
                                                        "Image does not belong to this work: "
                                                                + photo.getValue()
                                                )
                                        );
                            }

                            throw new InvalidPhotoOrderException(
                                    "Invalid photo type: " + photo.getType()
                            );
                        })
                        .toList()
        );
    }

    private Map<String, PhotoEntity> saveNewImages(
            List<MultipartFile> images
    ) {
        Map<String, PhotoEntity> newImages = new HashMap<>();

        if (images == null) {
            return newImages;
        }

        for (MultipartFile image : images) {

            String filename = image.getOriginalFilename();

            if (filename == null || !filename.contains("__")) {
                throw new InvalidPhotoOrderException(
                        "Invalid uploaded image filename"
                );
            }

            String temporaryId =
                    filename.substring(0, filename.indexOf("__"));

            PhotoEntity photo = savePhoto(image);

            newImages.put(temporaryId, photo);
        }

        return newImages;
    }

    private void deleteRemovedImages(
            List<PhotoEntity> oldPhotos,
            List<PhotoEntity> newPhotos
    ) {
        for (PhotoEntity oldPhoto : oldPhotos) {

            boolean stillExists = newPhotos.stream()
                    .anyMatch(newPhoto ->
                            newPhoto.getUrl().equals(oldPhoto.getUrl())
                    );

            if (!stillExists) {
                fileStorageService.delete(oldPhoto.getUrl());
            }
        }
    }

    private void deleteNewImages(
            List<PhotoEntity> oldPhotos,
            List<PhotoEntity> newPhotos
    ) {
        for (PhotoEntity newPhoto : newPhotos) {

            boolean existedBefore = oldPhotos.stream()
                    .anyMatch(oldPhoto ->
                            oldPhoto.getUrl().equals(newPhoto.getUrl())
                    );

            if (!existedBefore) {
                fileStorageService.delete(newPhoto.getUrl());
            }
        }
    }
}
