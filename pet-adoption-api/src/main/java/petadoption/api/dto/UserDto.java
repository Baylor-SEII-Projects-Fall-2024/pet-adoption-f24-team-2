package petadoption.api.dto;

import lombok.*;
import petadoption.api.enums.Role;
import petadoption.api.recommendation.petAttributes;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class UserDto {
    private Long id;
    private String emailAddress;
    private String name;
    private String address;
    private String description;
    private String phone;
    private String token;
    private Role role;

    private petAttributes attributes;
    private Integer numLikedPets = 0;
}
