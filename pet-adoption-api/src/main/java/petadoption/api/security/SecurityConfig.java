package petadoption.api.security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
import petadoption.api.config.UserAuthProvider;
import petadoption.api.config.UserAuthenticationEntryPoint;
import petadoption.api.user.CustomUserDetailsService;

@RequiredArgsConstructor
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final UserAuthenticationEntryPoint userAuthenticationEntryPoint;
    private final CustomUserDetailsService customUserDetailsService;
    private final UserAuthProvider userAuthProvider;

    @Bean
    public AuthenticationManager authenticationManager(HttpSecurity http) throws Exception {
        AuthenticationManagerBuilder authenticationManagerBuilder =
                http.getSharedObject(AuthenticationManagerBuilder.class);

        authenticationManagerBuilder.userDetailsService(customUserDetailsService);

        return authenticationManagerBuilder.build();
    }
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        // Add exception handler to return a custom message when a security issue occurs
        http.exceptionHandling(e ->
                e.authenticationEntryPoint(userAuthenticationEntryPoint)
        );

        // Add Jwt filter before any of Spring Security authentication filters
        // Disable csrf since we are using jwt instead
        // Make the application stateless, following REST and avoiding storage
        // of session information/cookie by spring
        http.addFilterBefore(new JwtAuthFilter(userAuthProvider, customUserDetailsService), BasicAuthenticationFilter.class)
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests((auth) ->
                        // Allow requests to login and register without authentication
                        auth.requestMatchers(HttpMethod.POST, "/login", "/register", "/forgot-password", "/reset-password").permitAll()
                                .anyRequest().authenticated()
                );

        return http.build();
    }
}
