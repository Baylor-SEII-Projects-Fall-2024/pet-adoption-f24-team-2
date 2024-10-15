import Navbar from "@/components/Navbar";
import { useEffect } from "react";
import { useState } from "react";
import { request, getUserID } from "@/axios_helper";
import { Card, Typography, Grid } from '@mui/material';

export default function RegisterAdoptionEventPage() {

  const [ user, setUser ] = useState({});
  
  useEffect( () => {
    request("GET", `/users/${getUserID()}`, null)
      .then((response) => {
        setUser(response.data)
      }).catch((error) => {
        console.log(error);
      })
  
  }, [])

  return (
    <>
      <Navbar user={user}/> 
      <Typography variant="h2" align="center">
        Your Adoption Events
      </Typography>
      <Grid columns={2}>

      </Grid> 
      
    </>
  )
}