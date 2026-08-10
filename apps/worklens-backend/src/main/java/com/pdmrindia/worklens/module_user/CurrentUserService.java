package com.pdmrindia.worklens.module_user;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class CurrentUserService {

    public Authentication authentication() {
        return SecurityContextHolder.getContext().getAuthentication();
    }

    public User user() {
        return (User) authentication().getPrincipal();
    }
}
