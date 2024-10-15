import React from "react";
import { Card, CardContent, Typography, Button } from "@mui/material";
import { useState } from "react";
import { request } from "@/axios_helper";
import { getUserID } from "@/axios_helper";

function PetDisplayCard(props) {
  const pet = props.pet;
  let currPets = props.currPets;

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(pet.name);
  const [gender, setGender] = useState(pet.gender);
  const [species, setSpecies] = useState(pet.species);
  const [breed, setBreed] = useState(pet.breed);
  const [color, setColor] = useState(pet.color);
  const [furLength, setFurLength] = useState(pet.furLength);
  const [age, setAge] = useState(pet.age);
  const [description, setDescription] = useState(pet.description);

  function handleEdit() {
    setIsEditing(true);
  }

  function cancelEdit() {
    setIsEditing(false);
    setName(pet.name);
    setGender(pet.gender);
    setSpecies(pet.species);
    setBreed(pet.breed);
    setColor(pet.color);
    setFurLength(pet.furLength);
    setAge(pet.age);
    setDescription(pet.description);
  }

  function handleRemove() {

    request("DELETE", `/pets/${pet.id}`, null)
      .then((response) => {
        if( response.status === 204 ) {
          let index = currPets.findIndex(p => p.id === pet.id);
          currPets = [
            ...currPets.slice(0, index), // Elements before the one to delete
            ...currPets.slice(index + 1) // Elements after the one to delete
          ]

          props.setPets(currPets);
        }
      }).catch((error) => {
        console.log(error);
      });
  }

  function savePetChanges() {
    let updatedPet = {
      id: pet.id,
      name: name,
      species: species,
      breed: breed,
      color: color,
      description: description,
      furLength: furLength,
      age: age,
      gender: gender,
      adoptionCenter: pet.adoptionCenter,
    }

    console.log(updatedPet);

    request("PUT", `/pets/${getUserID()}`, updatedPet)
      .then((response) => {
        console.log(response)
        console.log(updatedPet)
        let index = currPets.findIndex(p => p.id === updatedPet.id);
        if( index !== -1) {
          currPets[index] = updatedPet;
          props.setPets(currPets);
        }
      }).catch((error) => {
        console.log(error);
      });
    
      setIsEditing(false);
  }

  function onChangeGender() {
    setGender(!gender);
  }

  function onChangeName(e) {
    setName(e.target.value);
  }

  function onChangeSpecies(e) {
    setSpecies(e.target.value);
  }

  function onChangeBreed(e) {
    setBreed(e.target.value);
  }

  function onChangeColor(e) {
    setColor(e.target.value);
  }

  function onChangeFurLength(e) {
    setFurLength(e.target.value);
  }

  function onChangeAge(e) {
    setAge(e.target.value);
  }

  function onChangeDescription(e) {
    setDescription(e.target.value);
  }

  return (
    <Card elevation={3} >
      <CardContent component="form">
        <Typography variant="h5" component="div">
          {isEditing ? (
                <input
                  value={name}
                  onChange={onChangeName}
                />
              ) : (
                <span>{name}</span>
              )}
        </Typography>
        <Typography variant="body">
          <div>
            {isEditing ?
            <>
              <label>
                <input 
                  type="radio"
                  value="Male"
                  checked={gender}
                  onChange={onChangeGender}
                  />
                  Male{" "}
              </label>
              <label>
                <input 
                  type="radio"
                  value="Female"
                  checked={!gender}
                  onChange={onChangeGender}
                  />
                  Female
              </label>
            </> :
            <>
              gender: {gender ? "Male" : "Female" }
            </> }
          </div>
          <div>
            <label>
              Species:{" "} 
              {isEditing ? (
                <input
                  value={species}
                  onChange={onChangeSpecies}
                />
              ) : (
                <span>{species}</span>
              )}

            </label>
          </div>
          <div>
            <label>
              Breed:{" "} 
              {isEditing ? (
                <input
                  value={breed}
                  onChange={onChangeBreed}
                />
              ) : (
                <span>{breed}</span>
              )}

            </label>
          </div>
          <div>
            <label>
              Color:{" "} 
              {isEditing ? (
                <input
                  value={color}
                  onChange={onChangeColor}
                />
              ) : (
                <span>{color}</span>
              )}

            </label>
          </div>
          <div>
            <label>
              Fur Length:{" "} 
              {isEditing ? (
                <input
                  value={furLength}
                  onChange={onChangeFurLength}
                />
              ) : (
                <span>{furLength}</span>
              )}

            </label>
          </div>
          <div>
            <label>
              Age:{" "} 
              {isEditing ? (
                <input
                  value={age}
                  onChange={onChangeAge}
                />
              ) : (
                <span>{age}</span>
              )}

            </label>
          </div>
          <div>
            <label>
              Description:{" "} 
              {isEditing ? (
                <textarea
                  rows={4} 
                  value={description}
                  onChange={onChangeDescription}  
                />
              ) : (
                <span>{description}</span>
              )}

            </label>
          </div>
        </Typography>

        {isEditing ? 
        <>
          <Button variant="outlined" onClick={savePetChanges}>Confirm</Button>
          <Button variant="outlined" onClick={cancelEdit}>Cancel</Button>
        </>
        :
        <>
          <Button variant="outlined" onClick={handleEdit}>Edit</Button>
          <Button variant="outlined" onClick={handleRemove}>Remove</Button>
        </> }
      </CardContent>

    </Card>
  )
}

export default function PetDisplay(props) {
  const petsCopy  = [...props.pets];
  return (
    <>
      {props.pets.map((pet) => {
        return (
          <PetDisplayCard key={pet.id} pet={pet} currPets={petsCopy} setPets={props.setPets}/>
        );
      }) }
    </>
  )
}