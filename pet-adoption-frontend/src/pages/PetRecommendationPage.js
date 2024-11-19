import { useEffect, useState } from "react";
import { request, getUserID } from "@/axios_helper";
import Navbar from "@/components/Navbar";
import PetCard from "@/components/PetCard";
import { Typography, Box, Button, Pagination } from '@mui/material';

function interpretAttributes(pet) {
  const temp = [];
  const attributes = pet.attributes.attributes;


  if (attributes) {
    // Species
    if (attributes[0] === 1) {
      temp.push("Cat");
    } else if (attributes[1] === 1) {
      temp.push("Dog");
    } else if (attributes[2] === 1) {
      temp.push("Rabbit");
    } else {
      temp.push("species");
    }

    // Color
    if (attributes[3] === 1) {
      temp.push("White");
    } else if (attributes[4] === 1) {
      temp.push("Black");
    } else if (attributes[5] === 1) {
      temp.push("Brown");
    } else {
      temp.push("color");
    }

    // Gender
    if (attributes[6] === 1) {
      temp.push("Male");
    } else if (attributes[7] === 1) {
      temp.push("Female");
    } else {
      temp.push("gender");
    }

    // Age
    temp.push(String(attributes[8]));
  }

  return temp;
}


export default function PetRecommendationPage() {
  const [user, setUser] = useState({});
  const [pets, setPets] = useState([]);
  const [interpretedAttributes, setInterpretedAttributes] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const petsPerPage = 49;

  useEffect(() => {
    request("GET", `/petrec/${getUserID()}/all`, null)
      .then((response) => {
        setPets(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    console.log(pets);
    if (pets.length > 0) {
      const interpretationMap = {};

      pets.forEach((pet) => {
        const interpretation = interpretAttributes(pet);
        interpretationMap[pet.id] = interpretation;
      });

      setInterpretedAttributes(interpretationMap);
    }
  }, [pets]);

  const handleReload = () => {
    window.location.reload();
  };

  // pagination
  const indexOfLastPet = currentPage * petsPerPage;
  const indexOfFirstPet = indexOfLastPet - petsPerPage;
  const currentPets = pets.slice(indexOfFirstPet, indexOfLastPet);
  const pageCount = Math.ceil(pets.length / petsPerPage);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    window.scrollTo(0, 0);
  };

  return (
    <>
      <Navbar user={user} />
      <Box display="flex" justifyContent="space-between" alignItems="center" padding="0 16px">
        <Button variant="contained" onClick={handleReload}>
          Reload Recommendations
        </Button>
        <Typography variant="h2" align="center" flexGrow={1}>
          Pet Recommendations:
        </Typography>
      </Box>
      <div className="pet-list" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        gap: '20px',
        padding: '20px'
      }}>
        {currentPets.map((pet) => (
          <PetCard
            key={pet.id}
            id={pet.id}
            name={pet.name}
            attributes={interpretedAttributes[pet.id] || []}
            bigattributes={pet.attributes}
          />
        ))}
      </div>
      <Box display="flex" justifyContent="center" padding="20px">
        <Pagination 
          count={pageCount}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
          size="large"
        />
      </Box>
    </>
  );
}
