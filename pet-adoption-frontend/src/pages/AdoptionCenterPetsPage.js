import {
  request,
  getUserID
} from "@/axios_helper";
import {
  useState,
  useEffect
} from "react";
import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Typography,
  CardActions,
  Pagination
} from "@mui/material";
import PetDisplay from "@/components/PetDisplay";
import Navbar from "@/components/Navbar";
import SnackbarNoti from "@/components/SnackbarNoti";

export default function AdoptionCenterPetsPage() {
  const [open, setOpen] = useState(false);
  const [isMale, setIsMale] = useState(true);
  const [name, setName] = useState("");
  const [species, setSpecies] = useState("");
  const [breed, setBreed] = useState("");
  const [color, setColor] = useState("");
  const [furLength, setFurLength] = useState(0);
  const [age, setAge] = useState(0);
  const [description, setDescription] = useState("");
  const [user, setUser] = useState({});
  const [pets, setPets] = useState([]);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); // State for the current page
  const petsPerPage = 25; // Number of pets per page

  useEffect(() => {
    request("GET", `/users/${getUserID()}`, null)
        .then((response) => {
          setUser(response.data);
        })
        .catch((error) => {
          console.log(error);
        });

    request("GET", `/pets/${getUserID()}`, null)
        .then((response) => {
          setPets(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
  }, []);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setIsMale(true);
    setName("");
    setSpecies("");
    setBreed("");
    setColor("");
    setFurLength(0);
    setAge(0);
    setDescription("");
    setOpen(false);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const onChangeIsMale = () => {
    setIsMale(!isMale);
  };
  const onChangeName = (e) => {
    setName(e.target.value);
  };
  const onChangeSpecies = (e) => {
    setSpecies(e.target.value);
  };
  const onChangeBreed = (e) => {
    setBreed(e.target.value);
  };
  const onChangeColor = (e) => {
    setColor(e.target.value);
  };
  const onChangeFurLength = (e) => {
    setFurLength(e.target.value)
  };
  const onChangeAge = (e) => {
    setAge(e.target.value);
  }

  const onChangeDescription = (e) => {
    setDescription(e.target.value);
  }


  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handlePetRegistration = (e) => {
    let currPets = [...pets];
    e.preventDefault();
    let newPet = {
      name: name,
      gender: isMale,
      species: species,
      breed: breed,
      color: color,
      furLength: furLength,
      age: age,
      description: description,
      adoptionCenterId: getUserID(),
    };
    request("POST", `/pets/${getUserID()}`, newPet)
        .then((response) => {
          let pet = response.data;
          console.log(pet);
          currPets.push(pet);
          setPets(currPets);
          setSnackbarMessage("Pet registered!");
          setSnackbarSeverity("success");
          setSnackbarOpen(true);
        })
        .catch((error) => {
          console.log(error);
        });
    handleClose();
  };

  // Get the pets for the current page
  const startIndex = (currentPage - 1) * petsPerPage;
  const endIndex = startIndex + petsPerPage;
  const petsToDisplay = pets.slice(startIndex, endIndex);

  return (
    <>
      <Navbar user={user}/>
      <Typography variant="h3" align="center">Welcome to your pets {user.name}!</Typography>
      <CardActions sx={{ justifyContent: "center" }}>
        <Button onClick={handleClickOpen} size="large">Register Pet</Button>
      </CardActions>
      <Dialog
        open={open}
        onClose={handleClose}
        onSubmit={handlePetRegistration}
        component='form'
        >
        <DialogContent>
          <DialogContentText>Name</DialogContentText>
          <input 
            type="text"
            defaultValue={name}
            onChange={onChangeName}
            required
            />
          <DialogContentText>Species</DialogContentText>
          <input 
            type="text"
            defaultValue={species}
            onChange={onChangeSpecies}
            required
            />
          <DialogContentText>Breed</DialogContentText>
          <input 
            type="text"
            defaultValue={breed}
            onChange={onChangeBreed}
            required
            />
          <DialogContentText>Color</DialogContentText>
          <input 
            type="text"
            defaultValue={color}
            onChange={onChangeColor}
            required
            />
          <DialogContentText>Fur Length</DialogContentText>
          <input 
            type="number"
            defaultValue={furLength}
            onChange={onChangeFurLength}
            required
            />
          <DialogContentText>Age</DialogContentText>
          <input 
            type="number"
            defaultValue={age}
            onChange={onChangeAge}
            required
            />

          <DialogContentText>Description</DialogContentText>
          <textarea 
            rows={4} 
            value={description}
            onChange={onChangeDescription}
            required
            />
          <DialogContentText>Gender</DialogContentText>
          <label>
            <input 
              type="radio"
              value="Male"
              checked={isMale}
              onChange={onChangeIsMale}
              />
              Male{" "}
          </label>
          <label>
            <input 
              type="radio"
              value="Female"
              checked={!isMale}
              onChange={onChangeIsMale}
              />
              Female
          </label>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Register</Button>
        </DialogActions>
      </Dialog>
      <SnackbarNoti
        open={snackbarOpen}
        onClose={handleSnackbarClose}
        severity={snackbarSeverity}
        message={snackbarMessage}
      />
      <PetDisplay pets={pets} setPets={setPets}/>
      <Pagination count = {
        Math.ceil(pets.length / petsPerPage)
      }
                     page = {
                       currentPage
                     }
                     onChange = {
                       handlePageChange
                     }
                     sx = {
                       {
                         display: "flex",
                         justifyContent: "center",
                         mt: 2
                       }
                     }
      />
    </>
  )
}