package petadoption.api.dto;

import lombok.*;
import petadoption.api.enums.Role;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
@ToString
public class SignUpDto {
    private String emailAddress;
    private char[] password;
    private String name;
    private String address;
    private String description;
    private String phone;
    private Role role;
}
