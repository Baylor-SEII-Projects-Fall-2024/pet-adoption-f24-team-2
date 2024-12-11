package petadoption.api.dto;

import jakarta.validation.constraints.NotNull;
import lombok.*;
import petadoption.api.enums.Role;
import petadoption.api.recommendation.petAttributes;
import jakarta.validation.constraints.NotBlank;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class UserDto {
    private Long id;
    @NotBlank(message = "Email address is required")
    private String emailAddress;
    @NotBlank(message = "Name is required")
    private String name;
    private String streetAddress;
    private String city;
    private String state;
    private String description;
    @NotBlank(message = "Phone is required")
    private String phone;
    private String token;
    @NotNull(message = "Role is required")
    private Role role;

    private petAttributes attributes;
    private Integer numLikedPets = 0;
}
