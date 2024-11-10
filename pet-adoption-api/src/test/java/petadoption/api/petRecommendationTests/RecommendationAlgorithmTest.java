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

public class RecommendationAlgorithmTest {

    @Test
    void testPetRecommendation() {
        User user = createTestUser();

        Pet pet1 = createTestPet("White cat", "cat", "white", "male", 3);
        Pet pet2 = createTestPet("Black cat", "cat", "black", "male", 3);
        Pet pet3 = createTestPet("Brown cat", "cat", "brown", "male", 3);

        assertNotNull(pet1);
        assertNotNull(pet2);
        assertNotNull(pet3);

        List<Pet> allPets = new ArrayList<>(Arrays.asList(pet1, pet2, pet3));

        user.generateUserProfile();
        System.out.println("\nRecommendations with no preferences:");
        System.out.println("User Profile:" + "\t\t\t\t\t" + user.profileToString());
        printPets(user, allPets);

        user.addLikedPet(pet1);

        System.out.println("\nRecommendations with pet1 (White cat) liked:");
        System.out.println("User Profile:" + "\t\t\t\t\t" + user.profileToString());
        printPets(user, allPets);


        user.getAttributes().incrementColor("brown");
        System.out.println("\nRecommendations with brown preference increase:");
        System.out.println("User Profile:" + "\t\t\t\t\t" + user.profileToString());
        printPets(user, allPets);

//        user.getAttributes().incrementColor("black");
//        System.out.println("\nRecommendations with black preference increase:");
//        System.out.println("User Profile:" + "\t\t\t\t\t" + user.profileToString());
//        printPets(user, allPets);
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
