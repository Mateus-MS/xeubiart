package com.xeubiart.backend.domain.work.service;

import com.xeubiart.backend.controllerAdvice.exceptions.ResourceNotFoundException;
import com.xeubiart.backend.domain.fileStorage.service.FileStorageService;
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
import com.xeubiart.backend.domain.work.model.TattooStyle;
import com.xeubiart.backend.domain.work.repository.WorkRepository;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
@Transactional
public class WorkServiceImpl implements WorkService {
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

        // Generate thumbnail from first image if photos exist
        if (!photos.isEmpty()) {
            PhotoEntity thumbnail = createThumbnail(photos.getFirst());
            work.setThumbnail(thumbnail);
        }

        try {
            workRepository.save(work);
        } catch (RuntimeException e) {
            deleteNewImages(Collections.emptyList(), photos);
            if (work.getThumbnail() != null) {
                fileStorageService.delete(work.getThumbnail().getUrl());
            }
            throw e;
        }
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
    public Page<PublicWorkResponse> findPublic(TattooStyle style, Pageable pageable) {
        Page<WorkEntity> works = style == null
                ? workRepository.findByVisibleTrue(pageable)
                : workRepository.findByVisibleTrueAndStyle(style, pageable);

        return works.map(workMapper::toPublicResponse);
    }

    @Override
    public PublicWorkResponse findPublicById(UUID id, TattooStyle style) {
        WorkEntity work = style == null
                ? workRepository.findByIdAndVisibleTrue(id)
                : workRepository.findByIdAndVisibleTrueAndStyle(id, style);

        return this.workMapper.toPublicResponse(work);
    }

    @Override
    public Page<AdminWorkResponse> findForAdmin(Boolean visible, Pageable pageable) {
        Page<WorkEntity> works = visible == null
                ? workRepository.findAll(pageable)
                : workRepository.findByVisible(visible, pageable);

        return works.map(workMapper::toAdminResponse);
    }

    @Override
    public PublicWorkResponse findRandomPublic(TattooStyle style) {
        WorkEntity work = workRepository
                .findRandomVisible(style, PageRequest.of(0, 1))
                .stream()
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("No public works found"));

        return workMapper.toPublicResponse(work);
    }

    @Override
    public void update(
            UUID id,
            UpdateWorkRequest request,
            List<MultipartFile> images
    ) {
        WorkEntity work = workRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Work not found: " + id));

        workMapper.updateEntity(request, work);

        if (request.getPhotos() == null) {
            workRepository.save(work);
            return;
        }

        List<PhotoEntity> oldPhotos = new ArrayList<>(work.getPhotos());
        PhotoEntity oldThumbnail = work.getThumbnail();

        List<PhotoEntity> newPhotos = syncImages(oldPhotos, request.getPhotos(), images);
        work.setPhotos(newPhotos);

        PhotoEntity oldFirstPhoto = oldPhotos.isEmpty() ? null : oldPhotos.get(0);
        PhotoEntity newFirstPhoto = newPhotos.isEmpty() ? null : newPhotos.get(0);

        PhotoEntity newThumbnail = oldThumbnail;
        boolean thumbnailChanged = false;

        // Check if the first image changed OR if thumbnail was missing previously
        if (!isSamePhoto(oldFirstPhoto, newFirstPhoto) || (newFirstPhoto != null && oldThumbnail == null)) {
            thumbnailChanged = true;
            newThumbnail = (newFirstPhoto != null) ? createThumbnail(newFirstPhoto) : null;
            work.setThumbnail(newThumbnail);
        }

        try {
            workRepository.save(work);
        } catch (RuntimeException e) {
            deleteNewImages(oldPhotos, newPhotos);
            if (thumbnailChanged && newThumbnail != null) {
                fileStorageService.delete(newThumbnail.getUrl());
            }
            throw e;
        }

        deleteRemovedImages(oldPhotos, newPhotos);

        // Delete old thumbnail file if replaced or removed
        if (thumbnailChanged && oldThumbnail != null && (newThumbnail == null || !oldThumbnail.getUrl().equals(newThumbnail.getUrl()))) {
            fileStorageService.delete(oldThumbnail.getUrl());
        }
    }

    private PhotoEntity createThumbnail(PhotoEntity firstPhoto) {
        String thumbnailUrl = buildThumbnailUrl(firstPhoto.getUrl());

        // Define max width & height for the thumbnail (aspect ratio is preserved)
        int maxThumbnailWidth = 400;
        int maxThumbnailHeight = 400;

        ImageDimensions scaledDimensions = fileStorageService.createThumbnail(
                firstPhoto.getUrl(),
                thumbnailUrl,
                maxThumbnailWidth,
                maxThumbnailHeight
        );

        return PhotoEntity.builder()
                .url(thumbnailUrl)
                .width(scaledDimensions.getWidth())
                .height(scaledDimensions.getHeight())
                .build();
    }

    private String buildThumbnailUrl(String originalUrl) {
        if (originalUrl == null) {
            return null;
        }
        int dotIndex = originalUrl.lastIndexOf('.');
        if (dotIndex == -1) {
            return originalUrl + "_thumbnail";
        }
        return originalUrl.substring(0, dotIndex) + "_thumbnail" + originalUrl.substring(dotIndex);
    }

    private boolean isSamePhoto(PhotoEntity p1, PhotoEntity p2) {
        if (p1 == null && p2 == null) return true;
        if (p1 == null || p2 == null) return false;
        return Objects.equals(p1.getUrl(), p2.getUrl());
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
                                PhotoEntity savedPhoto = newImages.get(photo.getValue());
                                if (savedPhoto == null) {
                                    throw new InvalidPhotoOrderException("Missing uploaded image: " + photo.getValue());
                                }
                                return savedPhoto;
                            }

                            if ("existing".equals(photo.getType())) {
                                return oldPhotos.stream()
                                        .filter(existing -> photo.getValue().equals(existing.getUrl()))
                                        .findFirst()
                                        .orElseThrow(() -> new InvalidPhotoOrderException("Image does not belong to this work: " + photo.getValue()));
                            }

                            throw new InvalidPhotoOrderException("Invalid photo type: " + photo.getType());
                        })
                        .toList()
        );
    }

    private Map<String, PhotoEntity> saveNewImages(List<MultipartFile> images) {
        Map<String, PhotoEntity> newImages = new HashMap<>();

        if (images == null) {
            return newImages;
        }

        for (MultipartFile image : images) {
            String filename = image.getOriginalFilename();

            if (filename == null || !filename.contains("__")) {
                throw new InvalidPhotoOrderException("Invalid uploaded image filename");
            }

            String temporaryId = filename.substring(0, filename.indexOf("__"));
            PhotoEntity photo = savePhoto(image);

            newImages.put(temporaryId, photo);
        }

        return newImages;
    }

    private void deleteRemovedImages(List<PhotoEntity> oldPhotos, List<PhotoEntity> newPhotos) {
        for (PhotoEntity oldPhoto : oldPhotos) {
            boolean stillExists = newPhotos.stream().anyMatch(newPhoto -> newPhoto.getUrl().equals(oldPhoto.getUrl()));
            if (!stillExists) {
                fileStorageService.delete(oldPhoto.getUrl());
            }
        }
    }

    private void deleteNewImages(List<PhotoEntity> oldPhotos, List<PhotoEntity> newPhotos) {
        for (PhotoEntity newPhoto : newPhotos) {
            boolean existedBefore = oldPhotos.stream().anyMatch(oldPhoto -> oldPhoto.getUrl().equals(newPhoto.getUrl()));
            if (!existedBefore) {
                fileStorageService.delete(newPhoto.getUrl());
            }
        }
    }
}