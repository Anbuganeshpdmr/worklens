package com.pdmrindia.worklens.service.user;

import com.pdmrindia.worklens.model.user.User;
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
