package petadoption.api.dto;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
@ToString
public class UserDto {
    private Long id;
    private String emailAddress;
    private String userType;
    private String name;
    private String address;
    private String description;
    private String phone;
    private String token;
}
