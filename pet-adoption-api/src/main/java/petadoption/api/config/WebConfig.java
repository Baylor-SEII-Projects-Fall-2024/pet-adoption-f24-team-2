package petadoption.api.config;

import com.google.common.net.HttpHeaders;
import jakarta.servlet.FilterRegistration;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;

import java.util.Arrays;

@Configuration
@EnableWebMvc
public class WebConfig {

    // This is used to configure the CORS policy and set what is allowed to
    // come from our frontend application
    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        // Allow the frontend to send credentials and accept them
        config.setAllowCredentials(true);
        // Set the url we will receive request from
        config.addAllowedOrigin("http://localhost:3000");

        config.setAllowedHeaders(Arrays.asList(
                HttpHeaders.AUTHORIZATION,
                HttpHeaders.CONTENT_TYPE,
                HttpHeaders.ACCEPT
        ));

        config.setAllowedMethods(Arrays.asList(
                HttpMethod.GET.name(),
                HttpMethod.POST.name(),
                HttpMethod.DELETE.name(),
                HttpMethod.PUT.name()
        ));
        // This option allows the browser to cache the response of a preflight
        // request for 30 minutes, so if the same request is sent within
        // that time frame, no preflight request will be sent for later
        // requests
        // a preflight request simply checks for the allowed origin, headers,
        // and methods from the server
        // 30 minutes
        config.setMaxAge(3600L);
        // Set this configuration for all requests
        source.registerCorsConfiguration("/**", config);

        return new CorsFilter(source);
    }
}
