package petadoption.api.dto;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
@EqualsAndHashCode
public class NotificationDto {
    Long id;
    Long userId;
    Long petId;
    String message;
    boolean read;
    Long createdAt;
}
