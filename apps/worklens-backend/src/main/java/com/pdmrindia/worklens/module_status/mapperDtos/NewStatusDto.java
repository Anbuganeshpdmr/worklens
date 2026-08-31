package com.pdmrindia.worklens.module_status.mapperDtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class NewStatusDto {

    private String recordName;
    private String displayName;
    private String colourCode;
}
