package com.pdmrindia.worklens.module_entry.mapperDtos;

import com.pdmrindia.worklens.module_activity_type.mapperDtos.TypeDisplayDtoMapper;
import com.pdmrindia.worklens.module_category.mapperDtos.CategoryDisplayDtoMapper;
import com.pdmrindia.worklens.module_entry.Entry;
import com.pdmrindia.worklens.module_status.mapperDtos.StatusDisplayDtoMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class EntryDisplayDtoMapper {

    private final StatusDisplayDtoMapper statusDisplayDtoMapper;
    private final CategoryDisplayDtoMapper categoryMapper;
    private final TypeDisplayDtoMapper typeMapper;

    public EntryDisplayDto getEntryDisplayDto(Entry entry){
        EntryDisplayDto dto = new EntryDisplayDto();

        dto.setId(entry.getId());
        dto.setName(entry.getName());
        dto.setDescription(entry.getDescription());
        dto.setRemarks(entry.getRemarks());
        dto.setActivityDate(entry.getActivityDate().toString());
        dto.setStartTime(entry.getStartTime().toString());
        if(entry.getEndTime()!=null){
            dto.setEndTime(entry.getEndTime().toString());
            dto.setDuration(entry.getDuration().toString());
        }
        dto.setUser(entry.getUser().getName());
        dto.setCurrentStatus(statusDisplayDtoMapper.getStatusDisplayDto(entry.getStatus()));
        dto.setExternalTicketId(entry.getExternalTicketId());
        dto.setActivityId(entry.getActivity().getId());

        dto.setActivityType(typeMapper.getSimpleTypeDto(entry.getActivity().getActivityType()));
        dto.setCategory(categoryMapper.getSimpleCategoryDispDto(entry.getActivity().getActivityType().getCategory()));

        dto.setSprintActivityId(entry.getSprintActivity() != null ? entry.getSprintActivity().getId() : null);
        dto.setSprintName(entry.getSprintActivity() != null ? entry.getSprintActivity().getSprint().getName() : null);
        dto.setProjectName(entry.getActivity().getProject() != null ? entry.getActivity().getProject().getName() : null);

        return dto;
    }
}
