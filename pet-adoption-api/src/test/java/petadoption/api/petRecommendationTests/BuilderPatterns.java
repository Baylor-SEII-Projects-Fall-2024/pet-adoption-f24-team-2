package petadoption.api.petRecommendationTests;

import petadoption.api.pet.Pet;
import petadoption.api.recommendation.petAttributes;
import petadoption.api.user.User;


/*

Luke
This just has builders to create pets and users for testing

 */

public class BuilderPatterns {
    public static Pet createTestPet(String name, String species, String color, String gender, Integer age) {
        petAttributes attributes = new petAttributes(species, color, gender, age);

        Pet pet = new Pet();
        pet.setName(name);
        pet.setSpecies(species);
        pet.setColor(color);
        pet.setAge((int) age);
        pet.setAttributes(attributes);

        return pet;
    }

    public static User createTestUser() {
        User user = new User();
        petAttributes attributes = new petAttributes();
        user.setName("test");
        user.setAttributes(attributes);
        return user;
    }
}
