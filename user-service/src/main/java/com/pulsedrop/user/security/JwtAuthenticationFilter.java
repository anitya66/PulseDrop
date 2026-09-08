package com.pulsedrop.user.security;

import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String authorizationHeader =
                request.getHeader("Authorization");

        // No JWT → continue normally.
        // Spring Security will decide whether authentication is required.
        if (authorizationHeader == null
                || !authorizationHeader.startsWith("Bearer ")) {

            filterChain.doFilter(request, response);
            return;
        }

        String token = authorizationHeader.substring(7);

        try {

            if (SecurityContextHolder.getContext()
                    .getAuthentication() == null
                    && jwtService.isTokenValid(token)) {

                Claims claims =
                        jwtService.extractAllClaims(token);

                String email = claims.getSubject();
                String role = claims.get("role", String.class);

                if (email != null
                        && !email.isBlank()
                        && role != null
                        && !role.isBlank()) {

                    var authorities = List.of(
                            new SimpleGrantedAuthority(
                                    "ROLE_" + role
                            )
                    );

                    UsernamePasswordAuthenticationToken authentication =
                            new UsernamePasswordAuthenticationToken(
                                    email,
                                    null,
                                    authorities
                            );

                    SecurityContextHolder
                            .getContext()
                            .setAuthentication(authentication);
                }
            }

        } catch (Exception exception) {

            // Invalid/malformed JWT.
            // Do not authenticate the request.
            // Spring Security will subsequently return 401
            // for protected endpoints.
            SecurityContextHolder.clearContext();
        }

        filterChain.doFilter(request, response);
    }
}