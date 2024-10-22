package petadoption.api.dto;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
@EqualsAndHashCode
public class EventDto {
    Long id;
    Long adoptionCenterId;
    String name;
    String location;
    String description;
    Long date;
}
