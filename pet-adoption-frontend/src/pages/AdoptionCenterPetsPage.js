import { request, getUserID } from "@/axios_helper"
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogContentText, DialogActions, Button, Typography, CardActions } from "@mui/material";
import PetDisplay from "@/components/PetDisplay";
import Navbar from "@/components/Navbar";
import SnackbarNoti from "@/components/SnackbarNoti";

export default function AdoptionCenterPetsPage() {
  const [ open, setOpen ] = useState(false);
  const [ isMale, setIsMale ] = useState(true);
  const [ name, setName ] = useState("");
  const [ species, setSpecies ] = useState("");
  const [ breed, setBreed ] = useState("");
  const [ color, setColor ] = useState("");
  const [ furLength, setFurLength ] = useState(0);
  const [ age, setAge ] = useState(0);
  const [ description, setDescription] = useState("");
  const [ user, setUser ] = useState({});
  const [ pets, setPets ] = useState([]);
  const [ snackbarMessage, setSnackbarMessage ] = useState("");
  const [ snackbarSeverity, setSnackbarSeverity ] = useState("");
  const [ snackbarOpen, setSnackbarOpen ] = useState(false);
  const [breedOptions, setBreedOptions] = useState([]);

  const SPECIES_OPTIONS = ["Dog", "Cat", "Rabbit"];
  const COLOR_OPTIONS = ["Black", "Brown", "White"];
  const BREED_MAP = {
    Cat: ["Persian", "Siamese", "Other"],
    Dog: ["Labrador", "German Shepherd", "Other"],
    Rabbit: ["Holland Lop", "Rex", "Other"]
  };

  useEffect( () => {
    request("GET", `/users/${getUserID()}`, null)
      .then((response) => {
        setUser(response.data)
      }).catch((error) => {
        console.log(error);
      })
    
    request("GET", `/pets/${getUserID()}`, null)
      .then((response) => {
        setPets(response.data)
      }).catch((error) => {
        console.log(error);
      })
  
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

  const onChangeIsMale = () => {
    setIsMale(!isMale);
  };

  const onChangeName = (e) => {
    setName(e.target.value);
  };

  const onChangeSpecies = (e) => {
    const selectedSpecies = e.target.value;
    setSpecies(selectedSpecies);
    setBreed("");
    setBreedOptions(BREED_MAP[selectedSpecies] || []);
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
  };

  const onChangeDescription = (e) => {
    setDescription(e.target.value);
  }

  function handleSnackbarClose() {
    setSnackbarOpen(false);
  }

  const handlePetRegistration = (e) => {
    let currPets = [...pets]
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
    }
    request("POST", `/pets/${getUserID()}`, newPet)
      .then((response) => {
        let pet = response.data;
        console.log(pet)
        currPets.push(pet);
        setPets(currPets);
        console.log(currPets);
        setSnackbarMessage("Pet registered!");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
      }).catch((error) => {
        console.log(error);
      })
    handleClose();
  }

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
          <select
            value={species}
            onChange={onChangeSpecies}
            required
          >
            <option value="">Select Species</option>
            {SPECIES_OPTIONS.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>

          <DialogContentText>Breed</DialogContentText>
          <select
            value={breed}
            onChange={onChangeBreed}
            required
            disabled={!species}
          >
            <option value="">Select Breed</option>
            {breedOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>

          <DialogContentText>Color</DialogContentText>
          <select
            value={color}
            onChange={onChangeColor}
            required
          >
            <option value="">Select Color</option>
            {COLOR_OPTIONS.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>

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
    </>
  )
}