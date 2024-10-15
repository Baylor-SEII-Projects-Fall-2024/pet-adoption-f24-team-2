package petadoption.api.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class EventDto {
    Long id;
    Long adoptionCenterId;
    String name;
    String description;
    Long date;
}
