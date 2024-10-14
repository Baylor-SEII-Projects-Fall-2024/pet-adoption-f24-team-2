package petadoption.api.dto;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.Column;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import petadoption.api.user.User;

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
}
