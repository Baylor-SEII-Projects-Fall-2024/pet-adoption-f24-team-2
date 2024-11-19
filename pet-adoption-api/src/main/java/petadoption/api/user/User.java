package petadoption.api.user;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;
import lombok.ToString;
import petadoption.api.dto.PetDto;
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
    petAttributes attributes = new petAttributes();

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
    public String profileToString() {
        return Arrays.toString(attributes.getAttributes());
    }

    public double[] generateUserProfile() {
        int temp = numLikedPets;
        if (numLikedPets == 0) {temp = 1;}
        double[] profile = new double[petAttributes.getNumAttributes()];
        if (attributes == null) {
            attributes = new petAttributes();
        }
        double[] userAttributes = attributes.getAttributes();

        for (int i = 0; i < profile.length-1; i++) {
            int overrideOffset=0;
            if (i < 3) {
                overrideOffset = attributes.getSpeciesOverrideCount();
            } else if (i < 6) {
                overrideOffset = attributes.getColorOverrideCount();
            } else if (i < 8) {
                overrideOffset = attributes.getGenderOverrideCount();
            }
            profile[i] = userAttributes[i]/(temp+overrideOffset);
        }
        profile[profile.length-1] = userAttributes[profile.length-1];

        System.out.println("userAttributes: " + Arrays.toString(userAttributes));
        System.out.println("profile       : " + Arrays.toString(profile));

        return profile;
    }

    public void addLikedPet(petAttributes attributes) {
        this.attributes.combine(attributes);
        numLikedPets++;
    }

    public void incrementNumLikedPets() {numLikedPets++;}

    public void resetPreferences() {
        this.numLikedPets=0;
        this.attributes = new petAttributes();
    }
}
