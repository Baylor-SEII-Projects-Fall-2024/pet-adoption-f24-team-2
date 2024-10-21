package petadoption.api.recommendation;

import petadoption.api.pet.Pet;
import petadoption.api.user.User;
import java.util.Arrays;

/*

Luke
Core recommendation algorithm functions provided here

 */

public class PetRecommendation {

    // weights that are applied during recommendation
    // basically based on which attributes are more important than others
    static final double WEIGHT_SPECIES = 7.5;
    static final double WEIGHT_COLOR = 5;
    static final double WEIGHT_AGE = 1.25;
    static final double WEIGHT_GENDER = 1.25;

    // function to apply the above weights to adjust the importance of attributes
    public static double[] applyWeights(double[] attributes) {
        double[] temp = new double[petAttributes.getNumAttributes()];
        System.arraycopy(attributes, 0, temp, 0, petAttributes.getNumAttributes());

        temp[0]*=WEIGHT_SPECIES;
        temp[1]*=WEIGHT_SPECIES;
        temp[2]*=WEIGHT_SPECIES;
        temp[3]*=WEIGHT_COLOR;
        temp[4]*=WEIGHT_COLOR;
        temp[5]*=WEIGHT_COLOR;
        temp[6]*=WEIGHT_GENDER;
        temp[7]*=WEIGHT_GENDER;
        temp[8]*=WEIGHT_AGE;

        return temp;
    }

    // computes cosine similarity between two vectors (a user and pet attributes)
    public static double calcPetSimilarity(User u, Pet p) {
        // creates copies of arrays for manipulation
        double[] temp1 = Arrays.copyOf(u.getAttributes().getAttributes(), u.getAttributes().getAttributes().length+1);
        double[] temp2 = Arrays.copyOf(p.getAttributes().getAttributes(), p.getAttributes().getAttributes().length+1);
        temp2[8] = temp1[8] - Math.abs(temp2[8] - temp1[8]);

        // applies weights to the vectors
        double[] vectorA = applyWeights(temp1);
        double[] vectorB = applyWeights(temp2);

        /*

        This is the actual calculation of the similarity.
        It finds the angle between 2 vectors (which are the user/pet attribute arrays).

        We want the magnitude of some values to matter because of the nature of the attributes, such as age. We want to
        consider the magnitude of the age because it is a linear value. But we don't want to consider the magnitude of
        a value such as species, because it isn't a linear value. We don't consider the distance between a cat and a dog
        as any different from the distance between a cat and a rabbit.

        The way that I have some values' magnitudes mattering and some not, is using one-hot encoding. This basically
        means that for values where magnitude doesn't matter, we have them stored in multiple spaces in the array.
        For example, species is stored in indices 0,1, and 2. If a pet is a cat, species is stored as [1][0][0], but a
        dog would be stored as [0][1][0], and a rabbit would be [0][0][1]. This allows for species to still make a
        difference in the return value, but have no difference in distance between different species.
        For values where magnitude matters, we leave them as is, where their actual value is stored.

         */
        double dotProduct = 0.0;
        double normA = 0.0;
        double normB = 0.0;
        for (int i = 0; i < vectorA.length; i++) {
            dotProduct += vectorA[i] * vectorB[i];
            normA += Math.pow(vectorA[i], 2);
            normB += Math.pow(vectorB[i], 2);
        }
        return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
    }
}