package petadoption.api.recommendation;

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

    // default constructor
    public petAttributes() {
        Arrays.fill(attributes, 0);
    }

    // constructor used to easily create pets using strings
    public  petAttributes(String species, String color, String gender, Integer age) {
        Arrays.fill(attributes, 0);
        if (Objects.equals(species, "cat")) {
            attributes[0] = 1;
        } else if (Objects.equals(species, "dog")) {
            attributes[1] = 1;
        } else if (Objects.equals(species, "rab")) {
            attributes[2] = 1;
        }

        if (Objects.equals(color, "white")) {
            attributes[3] = 1;
        } else if (Objects.equals(color, "black")) {
            attributes[4] = 1;
        } else if (Objects.equals(color, "brown")) {
            attributes[5] = 1;
        }

        if (Objects.equals(gender, "male")) {
            attributes[6] = 1;
        } else if (Objects.equals(gender, "female")) {
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

}
