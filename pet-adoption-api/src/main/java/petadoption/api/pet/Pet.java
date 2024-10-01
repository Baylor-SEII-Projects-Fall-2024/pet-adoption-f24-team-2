package petadoption.api.pet;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = Pet.TABLE_NAME)
public class Pet {
    public static final String TABLE_NAME = "PETS";
    @Id
    @GeneratedValue(generator = TABLE_NAME + "_GENERATOR")
    @SequenceGenerator(
            name = TABLE_NAME + "_GENERATOR",
            sequenceName = TABLE_NAME + "_SEQUENCE"
    )
    @Column(name = "PET_ID")
    Long id;

    @Column(name = "SPECIES")
    String species;

    @Column(name = "AGE")
    Long age;

    @Column(name = "FUR_COLOR")
    String furColor;

    @Column(name = "FUR_LENGTH")
    Long furLength;

    @Column(name = "GENDER")
    boolean gender;
}
