package com.pdmrindia.worklens.module_record;


import com.pdmrindia.worklens.module_record_status.mapperDtos.RecordStatusDisplayDtoMapper;

import com.pdmrindia.worklens.module_record_status.RecordStatusRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class RecordService {

    private final RecordStatusRepo recordStatusRepo;
    private final RecordStatusDisplayDtoMapper recordStatusDisplayDtoMapper;



}
