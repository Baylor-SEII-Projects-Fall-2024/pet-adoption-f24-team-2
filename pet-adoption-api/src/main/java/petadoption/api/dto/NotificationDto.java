package petadoption.api.dto;

import jakarta.validation.constraints.NotEmpty;
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
    @NotEmpty(message="Notification message is required")
    String message;
    boolean read;
    Long createdAt;
}
