package petadoption.api.recommendation;

import com.fasterxml.jackson.annotation.JsonCreator;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Arrays;
import java.util.Objects;

/*

Luke
This is an embeddable class stored in Pet and User
Basically a fancy array class with some functions

 */

@Embeddable
public class petAttributes {
    @Getter @Setter
    static int numAttributes=9;

    @Getter @Setter
    double[] attributes = new double[numAttributes];

    @Getter @Setter
    int speciesOverrideCount=0, colorOverrideCount=0, genderOverrideCount=0;

    // default constructor
    public petAttributes() {
        Arrays.fill(attributes, 0);
    }

    // constructor used to easily create pets using strings
    public petAttributes(String species, String color, boolean gender, Integer age) {
        Arrays.fill(attributes, 0);
        switch (species.toLowerCase()) {
            case "cat" -> attributes[0] = 1;
            case "dog" -> attributes[1] = 1;
            case "rab", "rabbit" -> attributes[2] = 1;
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

        attributes[8] = age;
    }

    public petAttributes(petAttributes attributes) {
        this.attributes = Arrays.copyOf(attributes.attributes, numAttributes);
        this.speciesOverrideCount = attributes.speciesOverrideCount;
        this.colorOverrideCount = attributes.colorOverrideCount;
        this.genderOverrideCount = attributes.genderOverrideCount;
    }

    // combines two petAttributes
    // used to add pets to a user's liked pets
    public void combine(petAttributes other) {
        for (int i = 0; i < numAttributes-1; i++) {
            attributes[i] += other.attributes[i];
        }
        // averages age directly and floors, just simpler to do it this way
        // not as accurate but whateverrrr
        if (attributes[numAttributes-1] == 0) {attributes[8] = other.attributes[numAttributes-1];}
        else {attributes[numAttributes-1] = Math.round((attributes[numAttributes-1] + other.attributes[numAttributes-1])/2);}
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
    functions used in manually changing a user's preferences
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
                if (attributes[0] < 1.0) {return;}
                attributes[0] -= 1.0;
                break;
            case "dog":
                if (attributes[1] < 1.0) {return;}
                attributes[1] -= 1.0;
                break;
            case "rab", "rabbit":
                if (attributes[2] < 1.0) {return;}
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
                if (attributes[3] < 1.0) {return;}
                attributes[3] -= 1.0;
                break;
            case "black":
                if (attributes[4] < 1.0) {return;}
                attributes[4] -= 1.0;
                break;
            case "brown":
                if (attributes[5] < 1.0) {return;}
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
            attributes[8] += 1.0;
        } else {
            if (attributes[8] < 1.0) {return;}
            attributes[8] -= 1.0;
        }
    }

    public void resetAll() {
        Arrays.fill(attributes, 0);
        speciesOverrideCount = 0;
        colorOverrideCount = 0;
        genderOverrideCount = 0;
    }
}
