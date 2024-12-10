import React from "react";
import { useState, useEffect } from "react";
import { Card, CardContent, Typography, Button, Grid, TextField } from "@mui/material";

function AdoptionCenterDisplayCard(props) {
    const center = props.center;

    return (
        <Card elevation={3}>
            <CardContent>
                <Typography>
                    Adoption Center: {center.name}
                </Typography>
                <Typography>
                    Address: {center.streetAddress}, {center.city}, {center.state}
                </Typography>
                <Typography>
                    Phone Number: {center.phone}
                </Typography>
                <Typography>
                    Email Address: {center.emailAddress}
                </Typography>
                <Typography>
                    Adoption Center Description: {center.description}
                </Typography>
                <Button variant="contained" onClick={() => props.onFindCenterEvents(center.id)}>
                    View Events
                </Button>
            </CardContent>
        </Card>
    );
}

export default function AdoptionCenterDisplay(props) {
    const centers = props.centers;
    const [stateFilter, setStateFilter] = useState("");
    const [cityFilter, setCityFilter] = useState("");
    const [filteredCenters, setFilteredCenters] = useState(props.centers);

    useEffect( () => {
      const filtered = props.centers.filter((center) => {
        const matchesState = stateFilter ? center.state.toLowerCase().includes(stateFilter.toLowerCase()) : true;
        const matchesCity = cityFilter ? center.city.toLowerCase().includes(cityFilter.toLowerCase()) : true;
        return matchesState && matchesCity;
      });
      setFilteredCenters(filtered);
    }, [stateFilter, cityFilter, props.centers])

    return (
        <>
          <Grid container spacing={2} justifyContent="center" marginBottom={2}>
            <Grid item>
              <TextField
                label="State"
                variant="outlined"
                value={stateFilter}
                onChange={(e) => setStateFilter(e.target.value)}
              />
            </Grid>
            <Grid item>
              <TextField
                label="City"
                variant="outlined"
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
              />
            </Grid>
          </Grid>
          {filteredCenters.length > 0 ? (
            filteredCenters.map((center) => (
            <AdoptionCenterDisplayCard 
              key={center.id} 
              center={center} 
              onFindCenterEvents={props.onFindCenterEvents}
              />
            ))
          ) : (
            <Typography variant="h6">
              No adoption centers found with the given filters
            </Typography>
          )}
        </>
    );
}