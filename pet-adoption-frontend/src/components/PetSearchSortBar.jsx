import { Box, TextField, Select, MenuItem, FormControl, InputLabel, Button } from '@mui/material';

export default function PetSearchSortBar({ 
  onSearchChange, 
  onSortChange, 
  onSpeciesFilter,
  onColorFilter,
  onGenderFilter,
  onClearFilters,
  searchTerm = '',
  speciesValue = 'all',
  colorValue = 'all',
  genderValue = 'all',
  sortValue = 'similarity'
}) {
  return (
    <Box sx={{ 
      display: 'flex', 
      gap: 2, 
      padding: 2,
      alignItems: 'center',
      justifyContent: 'center',
      flexWrap: 'wrap',
      width: '100%',
      position: 'relative',
      zIndex: 1
    }}>
      <TextField
        label="Search pet names"
        variant="outlined"
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search by name..."
        value={searchTerm}
        sx={{ width: 300 }}
      />
      
      <FormControl sx={{ minWidth: 150 }}>
        <InputLabel>Species</InputLabel>
        <Select
          label="Species"
          onChange={(e) => onSpeciesFilter(e.target.value)}
          value={speciesValue}
          MenuProps={{
            disableScrollLock: true,
          }}
        >
          <MenuItem value="all">All Species</MenuItem>
          <MenuItem value="Cat">Cat</MenuItem>
          <MenuItem value="Dog">Dog</MenuItem>
          <MenuItem value="Rabbit">Rabbit</MenuItem>
        </Select>
      </FormControl>

      <FormControl sx={{ minWidth: 150 }}>
        <InputLabel>Color</InputLabel>
        <Select
          label="Color"
          onChange={(e) => onColorFilter(e.target.value)}
          value={colorValue}
          MenuProps={{
            disableScrollLock: true,
          }}
        >
          <MenuItem value="all">All Colors</MenuItem>
          <MenuItem value="White">White</MenuItem>
          <MenuItem value="Black">Black</MenuItem>
          <MenuItem value="Brown">Brown</MenuItem>
        </Select>
      </FormControl>

      <FormControl sx={{ minWidth: 150 }}>
        <InputLabel>Gender</InputLabel>
        <Select
          label="Gender"
          onChange={(e) => onGenderFilter(e.target.value)}
          value={genderValue}
          MenuProps={{
            disableScrollLock: true,
          }}
        >
          <MenuItem value="all">All Genders</MenuItem>
          <MenuItem value="Male">Male</MenuItem>
          <MenuItem value="Female">Female</MenuItem>
        </Select>
      </FormControl>
      
      <FormControl sx={{ minWidth: 200 }}>
        <InputLabel>Sort By</InputLabel>
        <Select
          label="Sort By"
          onChange={(e) => onSortChange(e.target.value)}
          value={sortValue}
          MenuProps={{
            disableScrollLock: true,
          }}
        >
          <MenuItem value="similarity">Similarity to Preferences</MenuItem>
          <MenuItem value="nameAsc">Name (A-Z)</MenuItem>
          <MenuItem value="nameDesc">Name (Z-A)</MenuItem>
          <MenuItem value="ageAsc">Age (Youngest First)</MenuItem>
          <MenuItem value="ageDesc">Age (Oldest First)</MenuItem>
        </Select>
      </FormControl>
      
      <Button 
        variant="outlined" 
        onClick={onClearFilters}
        sx={{ height: 56 }}
      >
        Clear Filters
      </Button>
    </Box>
  );
}
