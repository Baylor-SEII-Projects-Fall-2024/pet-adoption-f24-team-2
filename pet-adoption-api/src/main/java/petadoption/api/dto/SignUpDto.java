package petadoption.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import petadoption.api.enums.Role;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
@ToString
public class SignUpDto {
    @NotBlank(message = "Email address is required")
    private String emailAddress;
    @Size(min = 8, message = "password must be at least 8 characters long")
    private char[] password;
    @NotBlank(message = "Name is required")
    private String name;
    private String address;
    private String description;
    @NotBlank(message = "Phone is required")
    private String phone;
    @NotNull(message = "Role is required")
    private Role role;
}
