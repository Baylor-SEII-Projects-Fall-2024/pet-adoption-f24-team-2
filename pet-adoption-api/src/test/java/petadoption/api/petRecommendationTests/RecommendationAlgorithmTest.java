package petadoption.api.petRecommendationTests;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import petadoption.api.pet.Pet;
import petadoption.api.recommendation.PetRecommendation;
import petadoption.api.recommendation.petAttributes;
import petadoption.api.user.User;

import static org.junit.jupiter.api.Assertions.*;

public class RecommendationAlgorithmTest {

    private User user;
    private Pet catPet;
    private Pet dogPet;
    private Pet rabbitPet;

    @BeforeEach
    void setUp() {
        // Create a user with default preferences
        user = new User();
        user.setAttributes(new petAttributes());

        // Create test pets
        catPet = new Pet();
        catPet.setAttributes(new petAttributes("cat", "white", true, 2, "persian"));

        dogPet = new Pet();
        dogPet.setAttributes(new petAttributes("dog", "brown", false, 3, "labrador"));

        rabbitPet = new Pet();
        rabbitPet.setAttributes(new petAttributes("rabbit", "black", true, 1, "holland lop"));
    }

    @Test
    void testPetAttributesConstructor() {
        petAttributes attrs = new petAttributes("cat", "white", true, 2, "persian");

        // Test species
        assertEquals(1.0, attrs.getAttributes()[0]); // cat
        assertEquals(0.0, attrs.getAttributes()[1]); // dog
        assertEquals(0.0, attrs.getAttributes()[2]); // rabbit

        // Test color
        assertEquals(1.0, attrs.getAttributes()[3]); // white
        assertEquals(0.0, attrs.getAttributes()[4]); // black
        assertEquals(0.0, attrs.getAttributes()[5]); // brown

        // Test gender
        assertEquals(1.0, attrs.getAttributes()[6]); // male
        assertEquals(0.0, attrs.getAttributes()[7]); // female

        // Test breed
        assertEquals(1.0, attrs.getAttributes()[8]); // persian
        assertEquals(0.0, attrs.getAttributes()[9]); // siamese
        assertEquals(0.0, attrs.getAttributes()[10]); // other cats

        // Test age
        assertEquals(2.0, attrs.getAttributes()[17]);
    }

    @Test
    void testPreferenceAdjustments() {
        petAttributes attrs = new petAttributes();

        // Test species adjustments
        attrs.incrementSpecies("cat");
        assertEquals(1.0, attrs.getAttributes()[0]);
        attrs.decrementSpecies("cat");
        assertEquals(0.0, attrs.getAttributes()[0]);

        // Test color adjustments
        attrs.incrementColor("white");
        assertEquals(1.0, attrs.getAttributes()[3]);
        attrs.decrementColor("white");
        assertEquals(0.0, attrs.getAttributes()[3]);

        // Test gender adjustments
        attrs.changeGender(true);
        assertEquals(1.0, attrs.getAttributes()[6]);

        // Test age adjustments
        attrs.changeAge(true);
        assertEquals(1.0, attrs.getAttributes()[17]);
        attrs.changeAge(false);
        assertEquals(0.0, attrs.getAttributes()[17]);
    }

    @Test
    void testBreedPreferences() {
        petAttributes attrs = new petAttributes();

        // Test cat breeds
        attrs.incrementBreed("persian");
        assertEquals(1.0, attrs.getAttributes()[8]);
        attrs.decrementBreed("persian");
        assertEquals(0.0, attrs.getAttributes()[8]);

        // Test dog breeds
        attrs.incrementBreed("labrador");
        assertEquals(1.0, attrs.getAttributes()[11]);
        attrs.decrementBreed("labrador");
        assertEquals(0.0, attrs.getAttributes()[11]);

        // Test rabbit breeds
        attrs.incrementBreed("holland lop");
        assertEquals(1.0, attrs.getAttributes()[14]);
        attrs.decrementBreed("holland lop");
        assertEquals(0.0, attrs.getAttributes()[14]);
    }

    @Test
    void testPetSimilarityWithNoPreferences() {
        // User with no preferences should have equal similarity with all pets
        double catSimilarity = PetRecommendation.calcPetSimilarity(user, catPet);
        double dogSimilarity = PetRecommendation.calcPetSimilarity(user, dogPet);
        double rabbitSimilarity = PetRecommendation.calcPetSimilarity(user, rabbitPet);

        assertEquals(0.0, catSimilarity);
        assertEquals(0.0, dogSimilarity);
        assertEquals(0.0, rabbitSimilarity);
    }

    @Test
    void testPetSimilarityWithSpeciesPreference() {
        // Set user preference for cats
        user.getAttributes().incrementSpecies("cat");

        double catSimilarity = PetRecommendation.calcPetSimilarity(user, catPet);
        double dogSimilarity = PetRecommendation.calcPetSimilarity(user, dogPet);

        // Cat similarity should be higher than dog similarity
        assertTrue(catSimilarity > dogSimilarity);
    }

    @Test
    void testPetSimilarityWithMultiplePreferences() {
        // Set multiple preferences matching the cat
        user.getAttributes().incrementSpecies("cat");
        user.getAttributes().incrementColor("white");
        user.getAttributes().changeGender(true);
        user.getAttributes().incrementBreed("persian");

        double catSimilarity = PetRecommendation.calcPetSimilarity(user, catPet);
        double dogSimilarity = PetRecommendation.calcPetSimilarity(user, dogPet);

        // Cat should have very high similarity
        assertTrue(catSimilarity > 0.9);
        // Dog should have low similarity
        assertTrue(dogSimilarity < 0.3);
    }

    @Test
    void testAgePreference() {
        // Set age preference
        user.getAttributes().changeAge(true); // Set to 1
        user.getAttributes().changeAge(true); // Set to 2

        Pet youngPet = new Pet();
        youngPet.setAttributes(new petAttributes("cat", "white", true, 2, "persian"));

        Pet oldPet = new Pet();
        oldPet.setAttributes(new petAttributes("cat", "white", true, 8, "persian"));

        double youngPetSimilarity = PetRecommendation.calcPetSimilarity(user, youngPet);
        double oldPetSimilarity = PetRecommendation.calcPetSimilarity(user, oldPet);

        // Young pet should have higher similarity due to age match
        assertTrue(youngPetSimilarity > oldPetSimilarity);
    }

    @Test
    void testAttributesCombining() {
        petAttributes attrs1 = new petAttributes("cat", "white", true, 2, "persian");
        petAttributes attrs2 = new petAttributes("cat", "white", true, 4, "persian");

        attrs1.combine(attrs2);

        // Check that values were combined
        assertEquals(2.0, attrs1.getAttributes()[0]); // cat count should be 2
        assertEquals(2.0, attrs1.getAttributes()[3]); // white count should be 2
        assertEquals(3.0, attrs1.getAttributes()[17]); // age should be averaged
    }

    @Test
    void testResetPreferences() {
        petAttributes attrs = new petAttributes();

        // Add some preferences
        attrs.incrementSpecies("cat");
        attrs.incrementColor("white");
        attrs.changeGender(true);
        attrs.incrementBreed("persian");

        // Reset preferences
        attrs.resetAll();

        // Check that all values are reset to 0
        for (double value : attrs.getAttributes()) {
            assertEquals(0.0, value);
        }

        // Check that override counts are reset
        assertEquals(0, attrs.getSpeciesOverrideCount());
        assertEquals(0, attrs.getColorOverrideCount());
        assertEquals(0, attrs.getGenderOverrideCount());
        assertEquals(0, attrs.getBreedOverrideCount());
    }
}
