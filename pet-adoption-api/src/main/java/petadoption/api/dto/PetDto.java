package petadoption.api.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import petadoption.api.recommendation.petAttributes;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class PetDto {
    Long id;
    Long adoptionCenterID;
    Long ownerID;
    String name;
    String species;
    String breed;
    String photoUrl;
    String color;
    String description;
    int furLength;
    int age;
    boolean gender;
    petAttributes attributes = new petAttributes();

    public boolean getGender() {
        return gender;
    }
}
