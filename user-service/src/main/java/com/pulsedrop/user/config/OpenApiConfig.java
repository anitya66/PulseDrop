package com.pulsedrop.user.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.security.SecurityScheme;

import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(
        info = @Info(
                title = "PulseDrop User Service API",
                version = "1.0",
                description = """
                        Authentication, authorization and user management
                        APIs for the PulseDrop platform.
                        
                        Protected endpoints require a valid JWT Bearer token.
                        
                        401 - Authentication required
                        403 - Access denied
                        """
        )
)
@SecurityScheme(
        name = "bearerAuth",
        type = SecuritySchemeType.HTTP,
        scheme = "bearer",
        bearerFormat = "JWT"
)
public class OpenApiConfig {
}