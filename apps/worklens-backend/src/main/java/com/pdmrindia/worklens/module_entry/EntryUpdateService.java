package com.pdmrindia.worklens.module_entry;

import com.pdmrindia.worklens.exception.EntryException;
import com.pdmrindia.worklens.module_entry.mapperDtos.UpdateEntryPeriodDto;
import com.pdmrindia.worklens.module_sprint_activity.SprintActivity;
import com.pdmrindia.worklens.module_sprint_activity.SprintActivityRepo;
import com.pdmrindia.worklens.module_sprint_activity.SprintActivityService;

import com.pdmrindia.worklens.module_status.Record;
import com.pdmrindia.worklens.module_status.Status;
import com.pdmrindia.worklens.module_status.StatusService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EntryUpdateService {

    private final EntryRepo entryRepo;
    private final EntryService entryService;
    private final StatusService statusService;
    private final SprintActivityRepo sprintActivityRepo;

    @Transactional
    public Entry updateEntryPeriod(UpdateEntryPeriodDto updateEntryPeriodDto) {
        Entry entry = entryService.getEntryById(updateEntryPeriodDto.getId());

        List<Integer> overlapEntryIds = entryRepo.findOverlappingEntries(
                entry.getUser().getId(),
                entry.getId(),
                updateEntryPeriodDto.getNewStartDateTime(),
                updateEntryPeriodDto.getNewEndDateTime());

        if (!overlapEntryIds.isEmpty()) {
            String overlappingIds = overlapEntryIds.stream()
                    .map(String::valueOf)
                    .collect(Collectors.joining(", "));

            throw new EntryException.EntryOverlapException(
                    "Following entries overlap the specified period: " + overlappingIds
            );
        }

        entry.setStartDateTime(updateEntryPeriodDto.getNewStartDateTime());
        entry.setEndDateTime(updateEntryPeriodDto.getNewEndDateTime());
        entry.setRemarks(updateEntryPeriodDto.getRemarks());

        SprintActivity sprintActivity = entry.getSprintActivity();

        //  Work-Entry
        if(sprintActivity != null){
            //  Sprint-Activity attached
            if(sprintActivity.getCurrentEntry() != null && updateEntryPeriodDto.getNewEndDateTime() != null){
                //  Detach Sprint-Activity from Entry
                sprintActivity.setCurrentEntry(null);
            }
            sprintActivityRepo.save(sprintActivity);
        }

        //  Set status
        Status entryStatus = statusService.getRecordStatusByName(Record.ENTRY,"hold");
        statusService.validateRecordStatusOfRecord(Record.ENTRY,entryStatus);
        entry.setStatus(entryStatus);

        return entryRepo.save(entry);
    }
}
