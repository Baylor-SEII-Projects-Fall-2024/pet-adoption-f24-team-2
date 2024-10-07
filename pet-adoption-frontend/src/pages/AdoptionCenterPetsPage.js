import { request, getUserID } from "@/axios_helper"
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogContentText, DialogActions, Button } from "@mui/material";


export default function AdoptionCenterPetsPage() {
  const [ open, setOpen ] = useState(false);
  const [ isMale, setIsMale ] = useState(true);
  const [ name, setName ] = useState("");
  const [ species, setSpecies ] = useState("");
  const [ breed, setBreed ] = useState("");
  const [ color, setColor ] = useState("");
  const [ furLength, setFurLength ] = useState(0);
  const [ age, setAge ] = useState(0);
  const [ user, setUser ] = useState({});
  
  useEffect( () => {
    request("GET", `/users/${getUserID()}`, null)
      .then((response) => {
        setUser(response.data)
      }).catch((error) => {
        console.log(error);
      })
  
  }, []);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
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
  };

  const handlePetRegistration = (e) => {
    e.preventDefault();
    handleClose();
  }

  return (
    <>
      <h1>Welcome to your pets {user.name}!</h1>
      <button onClick={handleClickOpen}>Register Pet</button>
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
              onChnage={onChangeName}
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
    </>
  )
}