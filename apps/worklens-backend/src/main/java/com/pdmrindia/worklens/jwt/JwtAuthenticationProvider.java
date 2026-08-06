package com.pdmrindia.worklens.jwt;

import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;

@RequiredArgsConstructor
public class JwtAuthenticationProvider implements AuthenticationProvider {

    private final JwtUtil jwtUtil;
    private final UserDetailsService userDetailsService;

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {

        JwtAuthenticationToken authRequestToken = (JwtAuthenticationToken) authentication;
        String jwtToken = authRequestToken.getToken();

        String empId = jwtUtil.validateAndGetEmpId(jwtToken);

        if(empId==null){
            throw new BadCredentialsException("Invalid Jwt Token");
        }
        UserDetails sellerDetails = userDetailsService.loadUserByUsername(empId);

        return new JwtAuthenticationToken(sellerDetails,jwtToken,sellerDetails.getAuthorities());
    }

    @Override
    public boolean supports(Class<?> authentication) {
        return JwtAuthenticationToken.class.isAssignableFrom(authentication);
    }
}
