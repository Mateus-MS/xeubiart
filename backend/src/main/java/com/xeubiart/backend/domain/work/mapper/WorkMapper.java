package com.xeubiart.backend.domain.work.mapper;

import com.xeubiart.backend.domain.work.DTO.*;
import com.xeubiart.backend.domain.work.entity.PhotoEntity;
import com.xeubiart.backend.domain.work.entity.WorkEntity;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface WorkMapper {

    PhotoResponse toPhotoResponse(PhotoEntity photo);

    PublicWorkResponse toPublicResponse(WorkEntity work);

    @Mapping(target = "photosURLs", source = "photos")
    UserWorkResponse toUserResponse(WorkEntity work);

    AdminWorkResponse toAdminResponse(WorkEntity work);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "photos", ignore = true)
    @Mapping(target = "thumbnail", ignore = true)
    WorkEntity toEntity(CreateWorkRequest request);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "photos", ignore = true)
    @Mapping(target = "thumbnail", ignore = true)
    @BeanMapping(
            nullValuePropertyMappingStrategy =
                    NullValuePropertyMappingStrategy.IGNORE
    )
    void updateEntity(
            UpdateWorkRequest request,
            @MappingTarget WorkEntity work
    );

    // Helper for MapStruct to convert List<PhotoEntity> -> List<String> for UserWorkResponse
    default String mapPhotoToUrl(PhotoEntity photo) {
        return photo != null ? photo.getUrl() : null;
    }
}