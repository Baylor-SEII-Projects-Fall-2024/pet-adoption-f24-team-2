import { useEffect, useState } from "react";
import { request, getUserID } from "@/axios_helper";
import Navbar from "@/components/Navbar";
import PetCard from "@/components/PetCard";
import { Typography } from '@mui/material';

async function fetchInterpretedAttributes(pet) {
  try {
    const response = await request("POST", "/pets/interpretAttributes", { pet });
    return response.data;
  } catch (error) {
    console.error("Error fetching interpreted attributes:", error);
    return [];
  }
}

export default function PetRecommendationPage() {
  const [user, setUser] = useState({});
  const [pets, setPets ] = useState([]);
  const [interpretedAttributes, setInterpretedAttributes] = useState({});

  useEffect( () => {
    request("GET", `/petrec/${getUserID()}/all`, null)
    .then((response) => {
      setPets(response.data)
    }).catch((error) => {
      console.log(error);
    })
  }, [])

  useEffect(() => {
    if (pets.length > 0) {
      Promise.all(
        pets.map(async (pet) => {
          const interpretation = await fetchInterpretedAttributes(pet);
          return { id: pet.id, interpretation };
        })
      ).then((results) => {
        const interpretationMap = results.reduce((acc, curr) => {
          acc[curr.id] = curr.interpretation;
          return acc;
        }, {});
        setInterpretedAttributes(interpretationMap);
      });
    }
  }, [pets]);

  return (
    <>
      <Navbar user={user}/>
      <Typography variant="h2" align="center">
        Pet Recommendations:
      </Typography>
      <div className="pet-list">
        {pets.map((pet) => (
          <PetCard
            key={pet.id}
            name={pet.name}
            attributes={interpretedAttributes[pet.id] || []}
          />
        ))}
      </div>
    </>
  );
}