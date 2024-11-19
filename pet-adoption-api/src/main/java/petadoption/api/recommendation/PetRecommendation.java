package petadoption.api.recommendation;

import org.springframework.stereotype.Service;
import petadoption.api.dto.PetDto;
import petadoption.api.dto.UserDto;
import petadoption.api.pet.Pet;
import petadoption.api.user.User;
import java.util.Arrays;

/*

Luke
Core recommendation algorithm functions provided here

 */

@Service
public class PetRecommendation {

    // weights that are applied during recommendation
    // basically based on which attributes are more important than others
    static final double WEIGHT_SPECIES = 2;
    static final double WEIGHT_COLOR = 1.25;
    static final double WEIGHT_GENDER = 1.5;

    // WEIGHT_AGE is a special weight, used in the calcPetSimilarity function
    // as a way to provide exponential decay for age difference
    static final double WEIGHT_AGE = .025;

    // function to apply the above weights to adjust the importance of attributes
    public static double[] applyWeights(double[] attributes) {
        double[] temp = new double[petAttributes.getNumAttributes()];
        System.arraycopy(attributes, 0, temp, 0, petAttributes.getNumAttributes());

        // applies weights to all attributes except age
        temp[0]*=WEIGHT_SPECIES;
        temp[1]*=WEIGHT_SPECIES;
        temp[2]*=WEIGHT_SPECIES;
        temp[3]*=WEIGHT_COLOR;
        temp[4]*=WEIGHT_COLOR;
        temp[5]*=WEIGHT_COLOR;
        temp[6]*=WEIGHT_GENDER;
        temp[7]*=WEIGHT_GENDER;

        return temp;
    }

    // computes cosine similarity between two vectors (a user and pet attributes)
    public static double calcPetSimilarity(User u, Pet p) {

        // creates copies of arrays for manipulation
        double[] temp1 = u.generateUserProfile();
        double[] temp2 = Arrays.copyOf(p.getAttributes().getAttributes(), p.getAttributes().getAttributes().length);
        double ageDiff = Math.abs(temp2[8] - temp1[8]);
        temp2[8] = temp1[8] + ageDiff;

        // applies weights to the vectors
        double[] vectorA = applyWeights(temp1);
        double[] vectorB = applyWeights(temp2);

//        System.out.println("temp1: " + Arrays.toString(temp1));
//        System.out.println("temp2: " + Arrays.toString(temp2));
//        System.out.println("ageDiff: " + ageDiff);
//        System.out.println("temp2[8] after calc: " + ageDiff);

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
        if (dotProduct == 0.0) { return 0.0; } // if user preferences are empty, return 0

        // similarity between vectors
        double similarity = dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));

        // applies exponential decay to adjust similarity based on age difference
        double ageAdjustment = Math.exp(-WEIGHT_AGE * ageDiff);

        //System.out.println("sim: " + similarity * ageAdjustment * '\n');
        return similarity * ageAdjustment;
    }
}