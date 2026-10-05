package com.pdmrindia.worklens.config;

public interface Permissions {

    String FHTL = "hasAnyRole('FH', 'TL')";
    String FHTLUSER  = "hasAnyRole('FH', 'TL', 'MEMBER')";
    String FHTLADMIN  = "hasAnyRole('FH', 'TL', 'ADMIN')";

}
