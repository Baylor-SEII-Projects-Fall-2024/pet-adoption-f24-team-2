package petadoption.api.pet;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;
import petadoption.api.recommendation.petAttributes;
import petadoption.api.user.User;

import java.util.Arrays;

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

    @Column(name = "NAME")
    String name;

    @Column(name = "SPECIES")
    String species;

    @Column(name = "BREED")
    String breed;

    @Column(name = "PHOTO")
    String photoUrl;

    @Column(name = "COLOR")
    String color;

    @Column(name = "DESCRIPTION")
    String description;

    @Column(name = "FUR_LENGTH")
    int furLength;

    @Column(name = "AGE")
    int age;

    @Column(name = "GENDER")
    boolean gender;

    @Column(name = "ATTRIBUTES")
    petAttributes attributes;

    @ManyToOne
    @JoinColumn(name = "ADOPTION_CENTER_ID")
    User adoptionCenter;

    @ManyToOne
    @JoinColumn(name = "OWNER_ID")
    User owner;

    // used in petRecommendation
    public String profileToString() {
        return Arrays.toString(attributes.getAttributes());
    }

}
