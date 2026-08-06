package com.pdmrindia.worklens.jwt;

import jakarta.servlet.DispatcherType;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.pdmrindia.worklens.model.user.mapperDtos.LoginDto;
import com.pdmrindia.worklens.model.user.User;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        return request.getDispatcherType() == DispatcherType.FORWARD;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        if(!request.getServletPath().equals("/login")){
            filterChain.doFilter(request,response);
            return;
        }
        System.out.println("here 1");

        ObjectMapper objectMapper = new ObjectMapper();
        LoginDto loginDto = objectMapper.readValue(request.getInputStream(), LoginDto.class);

        UsernamePasswordAuthenticationToken authenticationToken =
                new UsernamePasswordAuthenticationToken(loginDto.getIdentifier(),loginDto.getPassword());

        Authentication authentication = authenticationManager.authenticate(authenticationToken);
        System.out.println("Here 2");

        if(authentication.isAuthenticated()){
            SecurityContextHolder.getContext().setAuthentication(authentication);

            System.out.println(loginDto.getIdentifier()+" is Authenticated");
            User currentUser = (User)authentication.getPrincipal();
            String jwtToken = jwtUtil.generateToken(currentUser);
            response.setHeader("Authorization","Bearer "+jwtToken);

            filterChain.doFilter(request,response);
        }
    }
}
