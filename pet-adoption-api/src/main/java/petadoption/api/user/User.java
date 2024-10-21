package petadoption.api.user;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;
import lombok.ToString;
import petadoption.api.enums.Role;
import petadoption.api.event.Event;
import petadoption.api.pet.Pet;
import petadoption.api.recommendation.petAttributes;

import java.util.Arrays;
import java.util.List;

@Data
@Entity
@Table(name = User.TABLE_NAME)
public class User {
    public static final String TABLE_NAME = "USERS";

    @Id
    @GeneratedValue(generator = TABLE_NAME + "_GENERATOR")
    @SequenceGenerator(
            name = TABLE_NAME + "_GENERATOR",
            sequenceName = TABLE_NAME + "_SEQUENCE"
    )

    @Column(name = "USER_ID")
    Long id;

    @Column(name = "EMAIL_ADDRESS")
    String emailAddress;

    @Column(name = "PASSWORD")
    String password;

    @Column(name = "PHONE")
    String phone;

    @Column(name = "NAME")
    String name;

    @Column(name = "ADDRESS")
    String address;

    @Column(name = "DESCRIPTION")
    String description;

    @Column(name = "ATTRIBUTES")
    petAttributes attributes;

    @Column(name = "NUM_LIKED_PETS")
    Integer numLikedPets = 0;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    Role role;

    @OneToMany(mappedBy = "adoptionCenter")
    List<Pet> pets;

    @OneToMany(mappedBy = "owner")
    List<Pet> adoptedPets;

    @OneToMany(mappedBy = "adoptionCenter")
    List<Event> events;

    // used in petRecommendation
    public void addLikedPet(Pet p) {
        attributes.combine(p.getAttributes());
        numLikedPets++;
    }

    // used in petRecommendation
    public double[] generateUserProfile() {
        double[] profile = new double[petAttributes.getNumAttributes()];
        double[] userAttributes = attributes.getAttributes();

        for (int i = 0; i < profile.length; i++) {
            profile[i] = userAttributes[i]/numLikedPets;
        }

        return profile;
    }

    // used in petRecommendation
    public String profileToString() {
        return Arrays.toString(attributes.getAttributes());
    }
}
