package petadoption.api.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
@EqualsAndHashCode
public class EventDto {
    Long id;
    Long adoptionCenterId;
    @NotEmpty(message="Event name is required")
    String name;
    @NotEmpty(message="Event location is required")
    String location;
    @NotEmpty(message="Event description is required")
    String description;
    @NotNull(message="Event date is required")
    Long date;
}
