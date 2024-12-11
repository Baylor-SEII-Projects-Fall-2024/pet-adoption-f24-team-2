package petadoption.api.recommendation;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.util.Arrays;

/*

Luke
This is an embeddable class stored in Pet and User
Basically a fancy array class with some functions

 */

@Embeddable
public class petAttributes {
    @Getter
    @Setter
    static int numAttributes = 18;

    @Getter
    @Setter
    double[] attributes = new double[numAttributes];

    @Getter
    @Setter
    Integer speciesOverrideCount = 0, colorOverrideCount = 0, genderOverrideCount = 0, breedOverrideCount = 0;

    // default constructor
    public petAttributes() {
        Arrays.fill(attributes, 0);
        this.speciesOverrideCount = 0;
        this.colorOverrideCount = 0;
        this.genderOverrideCount = 0;
        this.breedOverrideCount = 0;
    }

    // constructor used to easily create pets using strings
    public petAttributes(String species, String color, boolean gender, Integer age, String breed) {
        Arrays.fill(attributes, 0);
        switch (species.toLowerCase()) {
            case "cat" -> {
                attributes[0] = 1;
                switch (breed.toLowerCase()) {
                    case "persian" -> attributes[8] = 1;
                    case "siamese" -> attributes[9] = 1;
                    default -> attributes[10] = 1;
                }
            }
            case "dog" -> {
                attributes[1] = 1;
                switch (breed.toLowerCase()) {
                    case "labrador" -> attributes[11] = 1;
                    case "german shepherd" -> attributes[12] = 1;
                    default -> attributes[13] = 1;
                }
            }
            case "rab", "rabbit" -> {
                attributes[2] = 1;
                switch (breed.toLowerCase()) {
                    case "holland lop" -> attributes[14] = 1;
                    case "rex" -> attributes[15] = 1;
                    default -> attributes[16] = 1;
                }
            }
        }

        switch (color.toLowerCase()) {
            case "white" -> attributes[3] = 1;
            case "black" -> attributes[4] = 1;
            case "brown" -> attributes[5] = 1;
        }

        if (gender) {
            attributes[6] = 1;
        } else {
            attributes[7] = 1;
        }

        attributes[17] = age;
    }

    public petAttributes(petAttributes attributes) {
        this.attributes = Arrays.copyOf(attributes.attributes, numAttributes);
        this.speciesOverrideCount = attributes.speciesOverrideCount;
        this.colorOverrideCount = attributes.colorOverrideCount;
        this.genderOverrideCount = attributes.genderOverrideCount;
        this.breedOverrideCount = attributes.breedOverrideCount;
    }

    // combines two petAttributes
    // used to add pets to a user's liked pets
    public void combine(petAttributes other) {
        // Handle species-specific breed combinations
        if (other.attributes[0] > 0) { // Cat
            for (int i = 8; i <= 10; i++) {
                attributes[i] += other.attributes[i];
            }
        } else if (other.attributes[1] > 0) { // Dog
            for (int i = 11; i <= 13; i++) {
                attributes[i] += other.attributes[i];
            }
        } else if (other.attributes[2] > 0) { // Rabbit
            for (int i = 14; i <= 16; i++) {
                attributes[i] += other.attributes[i];
            }
        }

        for (int i = 0; i < 8; i++) {
            attributes[i] += other.attributes[i];
        }

        if (attributes[17] == 0) {
            attributes[17] = other.attributes[17];
        } else {
            attributes[17] = Math.round((attributes[17] + other.attributes[17]) / 2);
        }
    }

    public String attributesToString() {
        StringBuilder str = new StringBuilder();
        for (double a : attributes) {
            String temp = "[" + a + "]";
            str.append(temp);
        }
        return str.toString();
    }

    /*
     * functions used in manually changing a user's preferences
     */

    // function to change species values
    public void incrementSpecies(String species) {
        speciesOverrideCount++;
        switch (species.toLowerCase()) {
            case "cat":
                attributes[0] += 1.0;
                break;
            case "dog":
                attributes[1] += 1.0;
                break;
            case "rab", "rabbit":
                attributes[2] += 1.0;
                break;
            default:
                break;
        }
    }

    public void decrementSpecies(String species) {
        switch (species.toLowerCase()) {
            case "cat":
                if (attributes[0] < 1.0) {
                    return;
                }
                attributes[0] -= 1.0;
                break;
            case "dog":
                if (attributes[1] < 1.0) {
                    return;
                }
                attributes[1] -= 1.0;
                break;
            case "rab", "rabbit":
                if (attributes[2] < 1.0) {
                    return;
                }
                attributes[2] -= 1.0;
                break;
            default:
                break;
        }
        speciesOverrideCount--;
    }

    // function to change color values
    public void incrementColor(String color) {
        colorOverrideCount++;
        switch (color.toLowerCase()) {
            case "white":
                attributes[3] += 1.0;
                break;
            case "black":
                attributes[4] += 1.0;
                break;
            case "brown":
                attributes[5] += 1.0;
                break;
            default:
                break;
        }
    }

    public void decrementColor(String color) {
        switch (color.toLowerCase()) {
            case "white":
                if (attributes[3] < 1.0) {
                    return;
                }
                attributes[3] -= 1.0;
                break;
            case "black":
                if (attributes[4] < 1.0) {
                    return;
                }
                attributes[4] -= 1.0;
                break;
            case "brown":
                if (attributes[5] < 1.0) {
                    return;
                }
                attributes[5] -= 1.0;
                break;
            default:
                break;
        }
        colorOverrideCount--;
    }

    // function to change gender values
    public void changeGender(boolean gender) {
        genderOverrideCount++;
        if (gender) {
            attributes[6] += 1.0;
        } else {
            attributes[7] += 1.0;
        }
    }

    // function to change gender values
    public void changeAge(boolean opt) {
        if (opt) {
            attributes[17] += 1.0;
        } else {
            if (attributes[17] < 1.0) {
                return;
            }
            attributes[17] -= 1.0;
        }
    }

    public void resetAll() {
        Arrays.fill(attributes, 0);
        speciesOverrideCount = 0;
        colorOverrideCount = 0;
        genderOverrideCount = 0;
        breedOverrideCount = 0;
    }

    public void incrementBreed(String breed) {
        breedOverrideCount++;
        switch (breed.toLowerCase()) {
            case "persian" -> attributes[8] += 1.0;
            case "siamese" -> attributes[9] += 1.0;
            case "cat other" -> attributes[10] += 1.0;
            case "labrador" -> attributes[11] += 1.0;
            case "german shepherd" -> attributes[12] += 1.0;
            case "dog other" -> attributes[13] += 1.0;
            case "holland lop" -> attributes[14] += 1.0;
            case "rex" -> attributes[15] += 1.0;
            case "rabbit other" -> attributes[16] += 1.0;
        }
    }

    public void decrementBreed(String breed) {
        switch (breed.toLowerCase()) {
            case "persian" -> {
                if (attributes[8] < 1.0)
                    return;
                attributes[8] -= 1.0;
            }
            case "siamese" -> {
                if (attributes[9] < 1.0)
                    return;
                attributes[9] -= 1.0;
            }
            case "cat other" -> {
                if (attributes[10] < 1.0)
                    return;
                attributes[10] -= 1.0;
            }
            case "labrador" -> {
                if (attributes[11] < 1.0)
                    return;
                attributes[11] -= 1.0;
            }
            case "german shepherd" -> {
                if (attributes[12] < 1.0)
                    return;
                attributes[12] -= 1.0;
            }
            case "dog other" -> {
                if (attributes[13] < 1.0)
                    return;
                attributes[13] -= 1.0;
            }
            case "holland lop" -> {
                if (attributes[14] < 1.0)
                    return;
                attributes[14] -= 1.0;
            }
            case "rex" -> {
                if (attributes[15] < 1.0)
                    return;
                attributes[15] -= 1.0;
            }
            case "rabbit other" -> {
                if (attributes[16] < 1.0)
                    return;
                attributes[16] -= 1.0;
            }
        }
        breedOverrideCount--;
    }
}
