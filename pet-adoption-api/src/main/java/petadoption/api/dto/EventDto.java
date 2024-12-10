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
    @NotEmpty(message = "Event address is required")
    String streetAddress;
    @NotEmpty(message="Event city is required")
    String city;
    @NotEmpty(message="Event state is required")
    String state;
    @NotEmpty(message="Event description is required")
    String description;
    @NotNull(message="Event date is required")
    Long date;
}
