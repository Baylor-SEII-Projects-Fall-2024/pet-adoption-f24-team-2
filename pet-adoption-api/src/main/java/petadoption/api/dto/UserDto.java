package petadoption.api.dto;

import lombok.*;
import petadoption.api.enums.Role;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
@ToString
public class UserDto {
    private Long id;
    private String emailAddress;
    private String name;
    private String address;
    private String description;
    private String phone;
    private String token;
    private Role role;
}
