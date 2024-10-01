package petadoption.api.dto;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
@ToString
public class SignUpDto {
    private String emailAddress;
    private char[] password;
    private String userType;
    private String name;
    private String address;
    private String description;
    private String phone;
}
