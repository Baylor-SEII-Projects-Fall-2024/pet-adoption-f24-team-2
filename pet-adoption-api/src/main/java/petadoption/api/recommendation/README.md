# Pet Recommendation Algorithm
By the one and only Luke Heard.

*Its kinda spaghetti, but was originally much worse. Condensed it down as much as I could,
but ask if you don't understand something. More comments in the files themselves.*

## How it works

### Pet Attribute Embeddable
The attributes of pets used in the recommendation (species, color, gender, age) are stored in the class petAttributes,
which is an embeddable class, stored in the pet and user jpa repositories.
The petAttribute embeddable itself is basically a fancy array, housing the attributes and related functions.
The reason there is a petAttribute in the user
class is to store the traits that the user has liked so far, defaulted to no preferences.  

### The Algorithm

The algorithm itself is rather simple, just looks complicated in code. The main function that does the heavy is
the calcPetSimilarity function in the petRecommendation class. It takes in two parameters, a User and a Pet,
and compares their petAttribute embeddable to each other using cosine similarity. This outputs a single value (a double)
that represents how similar the user's likes are to the inputted pet. As the user chooses more and more pets that they like,
we can narrow down the search for the perfect pet.

## Future Additions

I plan to add other features such as:
- Letting them choose their preferences manually
- Resetting a user's manual preferences
- Resetting ALL of a user's preferences

Essentially just adding more ways to manipulate a user's likes.

