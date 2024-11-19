package petadoption.api.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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
    @NotBlank(message="Pet name is required")
    String name;
    @NotBlank(message="Pet species is required")
    String species;
    @NotBlank(message="Pet breed is required")
    String breed;
    String photoUrl;
    @NotBlank(message="Pet color is required")
    String color;
    @NotBlank(message="Pet description is required")
    String description;
    @NotNull(message="Pet fur length is required")
    Integer furLength;
    @NotNull(message="Pet age is required")
    Integer age;
    @NotNull(message="Pet gender is required")
    Boolean gender;

    @JsonProperty("attributes")
    petAttributes attributes = new petAttributes();

    public boolean getGender() {
        return gender;
    }
}
