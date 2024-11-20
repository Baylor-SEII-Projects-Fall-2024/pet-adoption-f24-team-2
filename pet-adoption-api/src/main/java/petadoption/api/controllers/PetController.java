package petadoption.api.controllers;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import petadoption.api.dto.PetDto;
import petadoption.api.mappers.PetMapper;
import petadoption.api.pet.Pet;
import petadoption.api.pet.PetService;
import petadoption.api.recommendation.petAttributes;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ThreadLocalRandom;

@Log4j2
@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "http://104.198.233.250:3000")
public class PetController {
    private final PetService petService;
    private final PetMapper petMapper;

    @PostMapping("/pets/{centerID}")
    public PetDto addPet(@PathVariable Long centerID, @RequestBody @Valid PetDto pet) {
        petAttributes attributes = new petAttributes(
            pet.getSpecies(),
            pet.getColor(), 
            pet.getGender(), 
            pet.getAge(),
            pet.getBreed()
        );

        pet.setAttributes(attributes);
        return petService.savePet(pet, centerID);
    }

    @DeleteMapping("/pets/{petID}")
    public ResponseEntity<Void> removePet(@PathVariable Long petID) {
        try {
            petService.deletePet(petID);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/pets/{centerID}")
    public List<PetDto> getPets(@PathVariable Long centerID) {
        List<PetDto> pets = petService.getPets(centerID);
        return pets;
    }

    @GetMapping("/pet/{petID}")
    public PetDto getPet(@PathVariable Long petID) {
        return petService.getPet(petID);
    }

    @GetMapping("/pets/all")
    public List<PetDto> getAllPets() {
        return petService.getAllPets();
    }

    @PutMapping("/pets/{centerID}")
    public ResponseEntity<PetDto> updatePet(@RequestBody @Valid PetDto pet, @PathVariable Long centerID) {
        PetDto newPet = petService.updatePet(pet, centerID);

        return ResponseEntity.ok(newPet);
    }
    
    @PostMapping("/pets/addTestPets/{id}")
    public void addTestPets(@PathVariable Long id) {
        String[] speciesOptions = {"cat", "dog", "rabbit"};
        String[] colorOptions = {"white", "black", "brown"};
        String[] petNames = {
                "Luna", "Max", "Bella", "Charlie", "Lucy", "Leo", "Milo", "Daisy", "Rocky", "Lily",
                "Oliver", "Molly", "Buddy", "Lola", "Jack", "Sadie", "Zeus", "Ruby", "Duke", "Bailey",
                "Coco", "Bear", "Sophie", "Tucker", "Penny", "Murphy", "Maggie", "Oscar", "Riley", "Zoey",
                "Bentley", "Chloe", "Finn", "Nala", "Winston", "Rosie", "Luke", "Millie", "Sam", "Lulu",
                "Cooper", "Belle", "Teddy", "Emma", "Ollie", "Pip", "Roxy", "Archie", "Nova", "Scout",
                "Jasper", "Princess", "Blue", "Gracie", "Bruno", "Cali", "Ace", "Ginger", "Thor", "Dixie",
                "Atlas", "Willow", "Louie", "Pepper", "Ziggy", "Stella", "Rocco", "Olive", "Simba", "Ellie",
                "Baxter", "Winnie", "Felix", "Piper", "Banjo", "Honey", "George", "Hazel", "Ozzy", "Poppy",
                "Dexter", "Ivy", "Harley", "Abby", "Rufus", "Kiki", "Chester", "Maple", "Moose", "Bonnie",
                "Samson", "Misty", "Beau", "Stormy", "Hank", "Minnie", "Diesel", "Pearl", "Rex", "Callie",
                "Apollo", "Layla", "Axel", "Raven", "Marley", "Leia", "Odin", "Delilah", "Romeo", "Sasha",
                "Benji", "Nori", "Ranger", "Athena", "Loki", "Phoebe", "Shadow", "Skye", "Wally", "Trixie",
                "Rusty", "Violet", "Prince", "Zelda", "Oakley", "Sage", "Neo", "Pixie", "River", "Josie",
                "Koda", "Fiona", "Chase", "Mabel", "Arlo", "Heidi", "Toby", "Flora", "Dash", "Iris",
                "Mochi", "Sunny", "Atlas", "Clover", "Cosmo", "Juniper", "Bandit", "Buttercup", "Bingo", "Daisy",
                "Blaze", "Eden", "Flash", "Georgia", "Hugo", "Holly", "Igor", "Indigo", "Jett", "Jasmine",
                "King", "Jade", "Link", "Lacey", "Mac", "Liberty", "Ned", "Luna", "Orion", "Marina",
                "Pluto", "Meadow", "Quincy", "Nellie", "Radar", "Oceana", "Storm", "Phoenix", "Tank", "Queen",
                "Ulysses", "Rain", "Vader", "Savannah", "Wolf", "Terra", "Xander", "Uma", "Yogi", "Venus",
                "Zeus", "Wren", "Ace", "Xena", "Bear", "Yara", "Chip", "Zinnia", "Duke", "Aurora",
                "Echo", "Bloom", "Finn", "Crystal", "Ghost", "Dawn", "Hero", "Ember", "Ice", "Fawn",
                "Jet", "Gaia", "Kite", "Haven", "Lion", "Iris", "Mars", "Joy", "Nero", "Karma",
                "Oz", "Lima", "Pike", "Moon", "Quest", "Nova", "Rex", "Opal", "Sol", "Pearl",
                "Thor", "Rose", "Uri", "Star", "Vex", "Twilight", "Wren", "Unity", "Yak", "Venus",
                "Zephyr", "Wave", "Ajax", "Xanthe", "Blitz", "Yuki", "Crow", "Zara", "Drake", "Ash",
                "Eagle", "Brook", "Fox", "Cloud", "Grim", "Dew", "Hawk", "Eve", "Iron", "Fable",
                "Jag", "Grace", "Knox", "Hope", "Lynx", "Isle", "Mist", "Joy", "Nix", "Koi",
                "Owl", "Lake", "Puma", "Mist", "Quill", "Night", "Rook", "Ocean", "Sky", "Peace",
                "Tux", "River", "Uri", "Storm", "Vale", "Terra", "Wing", "Uma", "Yeti", "Vale",
                "Zen", "Winter", "Ash", "Yarn", "Bolt", "Zest", "Cub", "Aura", "Dex", "Breeze",
                "Echo", "Coral", "Flint", "Delta", "Glow", "Eden", "Haze", "Fern", "Ink", "Gem",
                "Jade", "Halo", "Koi", "Iris", "Leo", "Jazz", "Moon", "Kiss", "Nova", "Leaf",
                "Onyx", "Mist", "Pike", "Noon", "Quartz", "Oasis", "Rain", "Pearl", "Star", "Quest",
                "Sun", "Rain", "Tiger", "Sage", "Ultra", "Sky", "Viper", "Soul", "Wolf", "Spring",
                "Xenon", "Tide", "Yogi", "Vale", "Zero", "Wave", "Alpha", "Wish", "Beta", "Zen",
                "Cave", "Amber", "Dune", "Bloom", "Edge", "Charm", "Frost", "Dawn", "Gulf", "Echo",
                "Hill", "Fairy", "Isle", "Glow", "Jade", "Haze", "Keep", "Iris", "Lake", "Joy",
                "Mesa", "Kiss", "Node", "Luna", "Oasis", "Mint", "Peak", "Nova", "Quest", "Opal",
                "Reef", "Pearl", "Sand", "Rose", "Tide", "Star", "Vale", "Sun", "Wave", "Terra",
                "Xray", "Uma", "Yang", "Vita", "Zeal", "Wave", "Apex", "Xena", "Bay", "Yang",
                "Cove", "Zora", "Dusk", "Alba", "Edge", "Briar", "Fern", "Cara", "Glen", "Dawn",
                "Hill", "Eden", "Isle", "Faye", "Jump", "Gia", "Knot", "Hope", "Leaf", "Ivy",
                "Maze", "Joy", "Nest", "Kay", "Orb", "Lark", "Path", "Mae", "Reef", "Nina",
                "Stream", "Ora", "Trail", "Paz", "Urban", "Quinn", "Vale", "Rain", "Wave", "Sage",
                "Yard", "Tara", "Zone", "Uma", "Arc", "Vera", "Bay", "Wren", "Cliff", "Xia",
                "Den", "Yara", "Edge", "Zara", "Flow", "Aria", "Gate", "Bria", "Hook", "Cora",
                "Inn", "Dara", "Jump", "Eva", "Key", "Fay", "Loop", "Gia", "Mill", "Hana",
                "Nook", "Ida", "Oak", "Jana", "Port", "Kara", "Quay", "Lea", "Rock", "Mia",
                "Sand", "Nia", "Tree", "Ora", "Urban", "Pia", "View", "Rae", "Wall", "Sky",
                "Yard", "Tea", "Zone", "Uma", "Arch", "Via", "Bank", "Wya", "Cave", "Zea"
        };

        // Add breed options for each species
        Map<String, String[]> breedOptions = new HashMap<>();
        breedOptions.put("cat", new String[]{"persian", "siamese", "other"});
        breedOptions.put("dog", new String[]{"labrador", "german shepherd", "other"});
        breedOptions.put("rabbit", new String[]{"holland lop", "rex", "other"});
        
        for (int i = 0; i < 500; i++) {
            Pet pet = new Pet();
            pet.setName(petNames[i]);

            // Random species
            String randomSpecies = speciesOptions[ThreadLocalRandom.current().nextInt(speciesOptions.length)];
            pet.setSpecies(randomSpecies);

            // Random color
            String randomColor = colorOptions[ThreadLocalRandom.current().nextInt(colorOptions.length)];
            pet.setColor(randomColor);

            String[] availableBreeds = breedOptions.get(randomSpecies);
            String randomBreed = availableBreeds[ThreadLocalRandom.current().nextInt(availableBreeds.length)];
            pet.setBreed(randomBreed);
            pet.setDescription("Randomly generated test pet.");
            pet.setFurLength(0);

            // Random age between 1 and 15
            int randomAge = ThreadLocalRandom.current().nextInt(1, 16);
            pet.setAge(randomAge);

            // Random gender (true or false)
            boolean randomGender = ThreadLocalRandom.current().nextBoolean();
            pet.setGender(randomGender);

            petAttributes attributes = new petAttributes(randomSpecies, randomColor, randomGender, randomAge, randomBreed);
            pet.setAttributes(attributes);

            pet.setAdoptionCenter(null);

            PetDto generatedPet = petMapper.toPetDto(pet);

            addPet(id, generatedPet);
        }
    }

    @DeleteMapping("/pets/all")
    public void removeAllPets() {
        petService.deleteAllPets();
    }
}
