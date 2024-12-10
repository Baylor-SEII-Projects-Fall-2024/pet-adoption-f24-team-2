const defaultImage = "https://via.placeholder.com/250";

// Define how many images are available for each color
const NUM_IMAGES = 5;

const imageMap = {
    "Cat": {
        "White": Array.from({length: NUM_IMAGES}, (_, i) => `/images/pets/cats/white/white_cat${i+1}.jpeg`),
        "Black": Array.from({length: NUM_IMAGES}, (_, i) => `/images/pets/cats/black/black_cat${i+1}.jpeg`),
        "Brown": Array.from({length: NUM_IMAGES}, (_, i) => `/images/pets/cats/brown/brown_cat${i+1}.jpeg`)
    },
    "Dog": {
        "White": Array.from({length: NUM_IMAGES}, (_, i) => `/images/pets/dogs/white/white_dog${i+1}.jpeg`),
        "Black": Array.from({length: NUM_IMAGES}, (_, i) => `/images/pets/dogs/black/black_dog${i+1}.jpeg`),
        "Brown": Array.from({length: NUM_IMAGES}, (_, i) => `/images/pets/dogs/brown/brown_dog${i+1}.jpeg`)
    },
    "Rabbit": {
        "White": Array.from({length: NUM_IMAGES}, (_, i) => `/images/pets/rabbits/white/white_rabbit${i+1}.jpeg`),
        "Black": Array.from({length: NUM_IMAGES}, (_, i) => `/images/pets/rabbits/black/black_rabbit${i+1}.jpeg`),
        "Brown": Array.from({length: NUM_IMAGES}, (_, i) => `/images/pets/rabbits/brown/brown_rabbit${i+1}.jpeg`)
    }
};

function getIndexFromId(id, arrayLength) {
    return Number(id) % arrayLength;
}

export function getPetImage(petId, species, color) {
    try {
        const speciesImages = imageMap[species];
        if (!speciesImages) return defaultImage;

        const colorImages = speciesImages[color];
        if (!colorImages || colorImages.length === 0) return defaultImage;

        // Use the pet ID to consistently select an image
        const index = getIndexFromId(petId, NUM_IMAGES);
        return colorImages[index];
    } catch (error) {
        console.error('Error getting pet image:', error);
        return defaultImage;
    }
} 