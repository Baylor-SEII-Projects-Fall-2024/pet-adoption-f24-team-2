import { useEffect, useState } from "react";
import { request, getUserID } from "@/axios_helper";
import Navbar from "@/components/Navbar";
import PetCard from "@/components/PetCard";
import { Typography, Box, Button, Pagination } from '@mui/material';
import PetSearchSortBar from "@/components/PetSearchSortBar";

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
  const [searchTerm, setSearchTerm] = useState('');
  const [sortMethod, setSortMethod] = useState('similarity');
  const [filteredPets, setFilteredPets] = useState([]);
  const [speciesFilter, setSpeciesFilter] = useState('all');
  const [colorFilter, setColorFilter] = useState('all');
  const [genderFilter, setGenderFilter] = useState('all');

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

  useEffect(() => {
    let filtered = [...pets];
    
    // Apply name search
    if (searchTerm) {
      filtered = filtered.filter(pet => 
        pet.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply species filter
    if (speciesFilter !== 'all') {
      filtered = filtered.filter(pet => 
        interpretAttributes(pet)[0] === speciesFilter
      );
    }
    
    // Apply color filter
    if (colorFilter !== 'all') {
      filtered = filtered.filter(pet => 
        interpretAttributes(pet)[1] === colorFilter
      );
    }
    
    // Apply gender filter
    if (genderFilter !== 'all') {
      filtered = filtered.filter(pet => 
        interpretAttributes(pet)[2] === genderFilter
      );
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortMethod) {
        case 'similarity':
          return pets.indexOf(a) - pets.indexOf(b);
        case 'nameAsc':
          return a.name.localeCompare(b.name);
        case 'nameDesc':
          return b.name.localeCompare(a.name);
        case 'ageAsc':
          return a.age - b.age;
        case 'ageDesc':
          return b.age - a.age;
        default:
          return 0;
      }
    });
    
    setFilteredPets(filtered);
  }, [pets, searchTerm, sortMethod, speciesFilter, colorFilter, genderFilter]);

  const handleReload = () => {
    request("GET", `/petrec/${getUserID()}/all`, null)
      .then((response) => {
        setPets(response.data);
        setCurrentPage(1);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSortMethod('similarity');
    setSpeciesFilter('all');
    setColorFilter('all');
    setGenderFilter('all');
  };

  // pagination
  const indexOfLastPet = currentPage * petsPerPage;
  const indexOfFirstPet = indexOfLastPet - petsPerPage;
  const currentPets = filteredPets.slice(indexOfFirstPet, indexOfLastPet);
  const pageCount = Math.ceil(filteredPets.length / petsPerPage);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    window.scrollTo(0, 0);
  };

  return (
    <>
      <Navbar user={user} />
      <Box display="flex" justifyContent="space-between" alignItems="center" padding="0 16px" sx={{ my: 4 }}>
        <Button variant="contained" onClick={handleReload} sx={{ mr: 2 }}>
          Reload Recommendations
        </Button>
        <Typography variant="h2" align="center" flexGrow={1} sx={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
          Pet Recommendations:
        </Typography>
      </Box>
      
      <PetSearchSortBar 
        onSearchChange={setSearchTerm}
        onSortChange={setSortMethod}
        onSpeciesFilter={setSpeciesFilter}
        onColorFilter={setColorFilter}
        onGenderFilter={setGenderFilter}
        onClearFilters={clearFilters}
        searchTerm={searchTerm}
        speciesValue={speciesFilter}
        colorValue={colorFilter}
        genderValue={genderFilter}
        sortValue={sortMethod}
      />
      
      <div className="pet-list" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
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
