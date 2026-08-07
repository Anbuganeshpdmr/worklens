package com.pdmrindia.worklens.module_user;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CustomUserDetailService implements UserDetailsService {

    private final UserRepo userRepo;

    @Override
    public UserDetails loadUserByUsername(String identifier) throws UsernameNotFoundException {
        if(identifier.contains("@")) {
            return userRepo.findByEmailId(identifier)
                    .orElseThrow(() -> new RuntimeException("User not found with Email-Id: " + identifier));
        }else{
            return userRepo.findByEmpId(identifier)
                    .orElseThrow(() -> new RuntimeException("User not found with Emp-Id: " + identifier));
        }
    }
}
