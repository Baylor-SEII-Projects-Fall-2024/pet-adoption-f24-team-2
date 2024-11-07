package petadoption.api.recommendation;

import com.fasterxml.jackson.annotation.JsonCreator;
import jakarta.persistence.*;
import lombok.Getter;
import java.util.Arrays;
import java.util.Objects;

/*

Luke
This is an embeddable class stored in Pet and User
Basically a fancy array class with some functions

 */

@Embeddable
public class petAttributes {
    @Getter
    static int numAttributes=9;

    @Getter
    double[] attributes = new double[numAttributes];

    @Getter
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
            case "rab" -> attributes[2] = 1;
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

    // combines two petAttributes
    // used to add pets to a user's liked pets
    public void combine(petAttributes other) {
        for (int i = 0; i < numAttributes; i++) {
            attributes[i] += other.attributes[i];
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
            case "rab":
                attributes[2] += 1.0;
                break;
            default:
                break;
        }
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

    // function to change gender values
    public void incrementGender(boolean gender) {
        genderOverrideCount++;
        if (gender) {
            attributes[6] += 1.0;
        } else {
            attributes[7] += 1.0;
        }
    }
}
