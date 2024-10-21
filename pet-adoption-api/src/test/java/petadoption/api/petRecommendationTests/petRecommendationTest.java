package petadoption.api.petRecommendationTests;

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

        Pet pet1 = createTestPet("White cat", "cat", "white", "male", 3);
        Pet pet2 = createTestPet("Black dog", "dog", "black", "male", 3);
        Pet pet3 = createTestPet("Brown rab", "rab", "brown", "male", 3);
        Pet pet4 = createTestPet("Black cat", "cat", "black", "female", 3);
        Pet pet5 = createTestPet("Brown dog", "dog", "brown", "female", 3);

        assertNotNull(pet1);
        assertNotNull(pet2);
        assertNotNull(pet3);
        assertNotNull(pet4);
        assertNotNull(pet5);

        List<Pet> allPets = new ArrayList<>(Arrays.asList(pet1, pet2, pet3, pet4, pet5));

        user.addLikedPet(pet1);
        user.generateUserProfile();

        System.out.println("First round:");
        System.out.println("User Profile:" + "\t\t\t\t\t" + user.profileToString());
        printPets(user, allPets);

        user.addLikedPet(pet3);
        user.generateUserProfile();

        System.out.println("Second round (added pet3):");
        System.out.println("User Profile:" + "\t\t\t\t\t" + user.profileToString());
        printPets(user, allPets);

        user.addLikedPet(pet4);
        user.generateUserProfile();

        System.out.println("Third round (added pet4):");
        System.out.println("User Profile:" + "\t\t\t\t\t" + user.profileToString());
        printPets(user, allPets);
    }

    public static void printPets(User user, List<Pet> allPets) {
        for (Pet pet : allPets) {
            double similarity = PetRecommendation.calcPetSimilarity(user, pet);
            System.out.println("Similarity: " + pet.getName() + " " + String.format("%.3f", similarity) + "\t\t" + pet.profileToString());
        }
    }
}
