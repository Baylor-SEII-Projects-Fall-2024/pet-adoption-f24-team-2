package petadoption.api.user;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;
import lombok.ToString;
import petadoption.api.enums.Role;
import petadoption.api.pet.Pet;

import java.util.List;

@Data
@Entity
@Table(name = User.TABLE_NAME)
@ToString
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

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    Role role;

    @JsonManagedReference(value = "adoptionCenter-pets")
    @OneToMany(mappedBy = "adoptionCenter")
    List<Pet> pets;

    @JsonManagedReference(value = "owner-pets")
    @OneToMany(mappedBy = "owner")
    List<Pet> adoptedPets;
}
