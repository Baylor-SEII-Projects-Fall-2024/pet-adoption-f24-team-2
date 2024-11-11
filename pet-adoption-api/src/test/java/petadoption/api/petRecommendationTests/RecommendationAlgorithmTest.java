package petadoption.api.petRecommendationTests;

import org.apache.commons.lang3.tuple.Pair;
import org.junit.jupiter.api.Test;
import petadoption.api.pet.Pet;
import petadoption.api.recommendation.PetRecommendation;
import petadoption.api.user.User;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class RecommendationAlgorithmTest {

    public static void printPets(User user, List<Pet> allPets) {
        List<Pair<Pet, Double>> similarityList = new ArrayList<>();

        for (Pet pet : allPets) {
            Double similarity = PetRecommendation.calcPetSimilarity(user, pet);
            Pair<Pet, Double> temp = Pair.of(pet, similarity);
            similarityList.add(temp);
        }

        similarityList.sort((p1, p2) -> p2.getRight().compareTo(p1.getRight()));

        for (Pair<Pet, Double> pair : similarityList) {
            System.out.println("Similarity: " + pair.getLeft().getName() + " " + String.format("%.3f", pair.getRight()) + "\t\t" + pair.getLeft().profileToString());
        }
    }
}
