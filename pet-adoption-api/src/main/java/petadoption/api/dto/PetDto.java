package petadoption.api.dto;

import jakarta.persistence.Column;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.*;
import petadoption.api.user.User;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class PetDto {
    Long id;
    String name;
    String species;
    String breed;
    String photoUrl;
    String color;
    String description;
    int furLength;
    int age;
    boolean gender;
    User adoptionCenter;
    User owner;
}
