package petadoption.api.petRecommendationTests;

import org.apache.commons.lang3.tuple.Pair;
import org.junit.jupiter.api.Test;
import petadoption.api.pet.Pet;
import petadoption.api.recommendation.PetRecommendation;
import petadoption.api.user.User;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static petadoption.api.petRecommendationTests.BuilderPatterns.*;

public class petRecommendationTest {

    @Test
    void testPetRecommendation() {
        User user = createTestUser();

        Pet pet1 = createTestPet("White cat", "cat", "white", "male", 4);
        Pet pet2 = createTestPet("White cat", "cat", "white", "male", 5);
        Pet pet3 = createTestPet("White cat", "cat", "white", "male", 6);

        assertNotNull(pet1);
        assertNotNull(pet2);
        assertNotNull(pet3);

        List<Pet> allPets = new ArrayList<>(Arrays.asList(pet1, pet2, pet3));

        user.generateUserProfile();
        System.out.println("\nRecommendations with no preferences:");
        //System.out.println("User Profile:" + "\t\t\t\t\t" + user.profileToString());
        printPets(user, allPets);

        user.addLikedPet(pet2);

        System.out.println("\nRecommendations with Pet2 (White cat) added:");
        //System.out.println("User Profile:" + "\t\t\t\t\t" + user.profileToString());
        printPets(user, allPets);
    }

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
