package com.xeubiart.backend.domain.work.service;

import com.xeubiart.backend.controllerAdvice.exceptions.ResourceNotFoundException;
import com.xeubiart.backend.domain.work.DTO.AdminWorkResponse;
import com.xeubiart.backend.domain.work.DTO.CreateWorkRequest;
import com.xeubiart.backend.domain.work.DTO.PublicWorkResponse;
import com.xeubiart.backend.domain.work.DTO.UpdateWorkRequest;
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

@Service
@AllArgsConstructor
@Transactional
public class WorkServiceImpl implements WorkService{
    private FileStorageService fileStorageService;
    private WorkRepository workRepository;
    private WorkMapper workMapper;

    @Override
    public void create(CreateWorkRequest request) {
        WorkEntity work = this.workMapper.toEntity(request);

        work.setPhotosURLs(this.fileStorageService.saveMultiple(request.getImages()));
        this.workRepository.save(work);
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

    @Override public void update( UUID id, UpdateWorkRequest request, List<MultipartFile> images ) {
        WorkEntity work = this.workRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Work not found: " + id) );
        this.workMapper.updateEntity(request, work);

        if (request.getPhotos() != null) {
            List<String> oldPhotos = new ArrayList<>(work.getPhotosURLs());
            List<String> newPhotos = this.syncImages( oldPhotos, request.getPhotos(), images );
            work.setPhotosURLs(newPhotos);

            try {
                this.workRepository.save(work);
            } catch (RuntimeException e) {
                this.deleteNewImages(oldPhotos, newPhotos); throw e;
            }

            this.deleteRemovedImages(oldPhotos, newPhotos);
            return;
        }

        this.workRepository.save(work);
    }

    private List<String> syncImages(List<String> oldPhotos, List<UpdateWorkRequest.PhotoOrder> photoOrder, List<MultipartFile> images){
        Map<String, String> newImages = this.saveNewImages(images);

        return photoOrder.stream()
                .map(photo -> {
                    if("new".equals(photo.getType())){
                        String savedKey = newImages.get(photo.getValue());

                        if(savedKey == null){
                            throw new InvalidPhotoOrderException("Missing uploaded image: " + photo.getValue());
                        }

                        return savedKey;
                    }

                    if("existing".equals(photo.getType())){
                        if(!oldPhotos.contains(photo.getValue())){
                            throw new InvalidPhotoOrderException("Image does not belong to this work: " + photo.getValue());
                        }

                        return photo.getValue();
                    }

                    throw new InvalidPhotoOrderException("Invalid photo type: " + photo.getType());
                }).toList();
    }

    private Map<String, String> saveNewImages(List<MultipartFile> images){
        Map<String, String> newImages = new HashMap<>();

        if(images == null){
            return newImages;
        }

        for(MultipartFile image : images){
            String filename = image.getOriginalFilename();

            if(filename == null || !filename.contains("__")){
                throw new InvalidPhotoOrderException("Invalid uploaded image filename");
            }

            String temporaryId = filename.substring(0, filename.indexOf("__"));
            String savedKey = this.fileStorageService.save(image);
            newImages.put(temporaryId, savedKey);
        }

        return newImages;
    }

    private void deleteRemovedImages(List<String> oldPhotos, List<String> newPhotos){
        for(String oldPhoto : oldPhotos){
            if(!newPhotos.contains(oldPhoto)){
                this.fileStorageService.delete(oldPhoto);
            }
        }
    }

    private void deleteNewImages(List<String> oldPhotos, List<String> newPhotos){
        for (String newPhoto : newPhotos){
            if(!oldPhotos.contains(newPhoto)){
                this.fileStorageService.delete(newPhoto);
            }
        }
    }
}
