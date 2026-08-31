package com.pdmrindia.worklens.module_entry;

import com.pdmrindia.worklens.exception.EntryException;
import com.pdmrindia.worklens.module_activity.Activity;
import com.pdmrindia.worklens.module_activity.ActivityService;
import com.pdmrindia.worklens.module_entry.filter.EntryFilterRequest;
import com.pdmrindia.worklens.module_entry.filter.EntrySpecification;
import com.pdmrindia.worklens.module_entry.mapperDtos.CloseWorkEntryDto;

import com.pdmrindia.worklens.module_status.Record;
import com.pdmrindia.worklens.module_sprint_activity.SprintActivity;
import com.pdmrindia.worklens.module_sprint_activity.SprintActivityService;
import com.pdmrindia.worklens.module_status.Status;
import com.pdmrindia.worklens.module_status.StatusService;
import com.pdmrindia.worklens.module_user.CurrentUserService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EntryService {

    private final EntryRepo entryRepo;
    private final SprintActivityService sprintActivityService;
    private final CurrentUserService currentUserService;
    private final StatusService statusService;
    private final ActivityService activityService;

    @Transactional
    public Entry createNewTestEntry(int sprintActivityId){
        Entry entry = new Entry();

        SprintActivity sprintActivity = sprintActivityService.getSprintActivityById(sprintActivityId);
        Activity activity = sprintActivity.getActivity();

        //  validate Activity status before starting first Entry
        activity = activityService.processActivityStatusForEntry(activity);

        entry.setName(activity.getTitle());
        entry.setDescription(activity.getDescription());
        entry.setActivity(activity);
        entry.setUser(currentUserService.user());
        entry.setActivityDate(LocalDate.now());
        entry.setStartTime(LocalTime.now());
        entry.setExternalTicketId(activity.getExternalTicketId() != null ? activity.getExternalTicketId() : null);

        //  Setting Entry Status
        Status entryStatus = statusService.getRecordStatusByName(Record.ENTRY,"in-process");
        statusService.validateRecordStatusOfRecord(Record.ENTRY,entryStatus);
        entry.setStatus(entryStatus);

        //  Setting Sprint-Activity Status to "in-testing"
        sprintActivityService.updateStatus(sprintActivity,statusService.getRecordStatusByName(Record.SPRINT_ACTIVITY,"in-testing"));
        entry.setSprintActivity(sprintActivity);

        return entryRepo.save(entry);
    }

    @Transactional
    public Entry closeTestEntry(CloseWorkEntryDto closeWorkEntryDto){
        Entry currentEntry = getEntryById(closeWorkEntryDto.getEntryId());

        validateEntryClosingUser(currentEntry);

        LocalTime endTime = LocalTime.now();
        currentEntry.setEndTime(endTime);
        currentEntry.setDuration(Duration.between(currentEntry.getStartTime(), endTime));
        currentEntry.setRemarks(closeWorkEntryDto.getRemarks());

        //  Setting Entry Status
        Status updatedStatus = statusService.getStatusById(closeWorkEntryDto.getSelectedStatusId());
        statusService.validateRecordStatusOfRecord(Record.ENTRY,updatedStatus);
        currentEntry.setStatus(updatedStatus);

        //  Setting Sprint-Activity Status
        sprintActivityService.updateStatus(currentEntry.getSprintActivity(), statusService.getStatusById(closeWorkEntryDto.getSelectedParentStatusId()));

        return entryRepo.save(currentEntry);
    }

    @Transactional
    public Entry createNewNonTestEntry(int activityId){
        Entry entry = new Entry();

        Activity activity = activityService.getActivityById(activityId);

        //  validate Activity status before starting first Entry
        activity = activityService.processActivityStatusForEntry(activity);

        entry.setName(activity.getTitle());
        entry.setDescription(activity.getDescription());
        entry.setActivity(activity);
        entry.setUser(currentUserService.user());
        entry.setActivityDate(LocalDate.now());
        entry.setStartTime(LocalTime.now());
        entry.setExternalTicketId(activity.getExternalTicketId() != null ? activity.getExternalTicketId() : null);

        //  Setting Entry Status
        Status entryStatus = statusService.getRecordStatusByName(Record.ENTRY,"in-process");
        statusService.validateRecordStatusOfRecord(Record.ENTRY,entryStatus);
        entry.setStatus(entryStatus);

        return entryRepo.save(entry);
    }

    @Transactional
    public Entry closeNonTestEntry(CloseWorkEntryDto closeWorkEntryDto){
        Entry currentEntry = getEntryById(closeWorkEntryDto.getEntryId());

        validateEntryClosingUser(currentEntry);

        LocalTime endTime = LocalTime.now();
        currentEntry.setEndTime(endTime);
        currentEntry.setDuration(Duration.between(currentEntry.getStartTime(), endTime));
        currentEntry.setRemarks(closeWorkEntryDto.getRemarks());

        //  Setting Entry Status
        Status updatedStatus = statusService.getStatusById(closeWorkEntryDto.getSelectedStatusId());
        statusService.validateRecordStatusOfRecord(Record.ENTRY,updatedStatus);
        currentEntry.setStatus(updatedStatus);

        return entryRepo.save(currentEntry);
    }

    public Entry getEntryById(long id){
        return entryRepo.findById(id)
                .orElseThrow(()-> new EntryException.EntryNotFoundException("No Valid Entry found"));
    }

    public Page<Entry> search(EntryFilterRequest request, Pageable pageable) {
        Specification<Entry> specification = EntrySpecification.withFilters(request);
        return entryRepo.findAll(specification, pageable);
    }

    private void validateEntryClosingUser(Entry entry){
        if(entry.getUser().equals(currentUserService.user())){
            throw new EntryException.UnauthorisedEntryAccessException("Entry must be closed by its owner: "+entry.getUser().getName());
        }
    }

}
