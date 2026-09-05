package com.xeubiart.backend.domain.work.mapper;

import com.xeubiart.backend.domain.work.DTO.CreateWorkRequest;
import com.xeubiart.backend.domain.work.DTO.SearchWorkResponse;
import com.xeubiart.backend.domain.work.DTO.UpdateWorkRequest;
import com.xeubiart.backend.domain.work.entity.WorkEntity;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring")
public interface WorkMapper {
    SearchWorkResponse toSearchResponse(WorkEntity work);
    WorkEntity toEntity(CreateWorkRequest request);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntity(UpdateWorkRequest request, @MappingTarget WorkEntity work);
}
