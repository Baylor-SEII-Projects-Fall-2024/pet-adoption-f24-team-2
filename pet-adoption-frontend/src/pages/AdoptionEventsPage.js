import Navbar from "@/components/Navbar";
import { useEffect } from "react";
import { useState } from "react";
import { request, getUserID } from "@/axios_helper";
import { Card, CardActions, Typography, Grid, Button } from '@mui/material';
import { Dialog, DialogContent, DialogContentText, DialogActions } from '@mui/material'
import { DateTimePicker } from "@mui/x-date-pickers";
import EventDisplay from "@/components/EventDisplay"; 


export default function RegisterAdoptionEventPage() {

  const [ user, setUser ] = useState({});
  const [ open, setOpen ] = useState(false);
  const [ name, setName ] = useState("");
  const [ description, setDescription ] = useState("");
  const [ date, setDate ] = useState();
  const [ events, setEvents ] = useState([]);
  
  useEffect( () => {
    request("GET", `/users/${getUserID()}`, null)
      .then((response) => {
        setUser(response.data)
      }).catch((error) => {
        console.log(error);
      })

      request("GET", `/events/${getUserID()}`, null)
      .then((response) => {
        setEvents(response.data)
      }).catch((error) => {
        console.log(error);
      })
  
  }, [])

  function handleClickOpen() {
    setOpen(true);
  };

  function handleClose() {
    setOpen(false);
  };

  function onChangeName(e) {
    setName(e.target.value);
  }

  function onChangeDescription(e) {
    setDescription(e.target.value);
  }

  function handleEventRegistration(e) {
    let currEvents = [...events]
    e.preventDefault();
    let selectedDate = new Date(date);
    let epochTime = selectedDate.getTime();
    let newEvent = {
      name: name,
      description: description,
      date: epochTime,
    }
    console.log(newEvent);
    request("POST", `/register/${getUserID()}`, newEvent)
      .then((response) => {
        let event = response.data;
        console.log(event);
        currEvents.push(event);
        setEvents(currEvents);
        console.log(currEvents)
      }).catch((error) => {
        console.log(error);
      })
    handleClose();
  }

  return (
    <>
      <Navbar user={user}/> 
      <Typography variant="h2" align="center">
        Your Adoption Events
      </Typography>
      <CardActions sx={{ justifyContent: "center" }}>
        <Button size="large" onClick={handleClickOpen}>Register Event</Button>
      </CardActions>
      <Dialog
        open={open}
        onClose={handleClose}
        onSubmit={handleEventRegistration}
        component='form'
        >
        <DialogContent>
          <DialogContentText>Name</DialogContentText>
          <input 
            type="text"
            value={name}
            onChange={onChangeName}
            required
            />
          <DialogContentText>Description</DialogContentText>
          <textarea 
            rows={4} 
            value={description}
            onChange={onChangeDescription}
            />
          <DialogContentText>Date</DialogContentText>
          <DateTimePicker 
           value={date}
           onChange={(newValue) => setDate(newValue)}
           />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Register</Button>
        </DialogActions>
      </Dialog>
      <Grid columns={2}>
        <EventDisplay events={events} setEvents={setEvents}/>
      </Grid> 
      
    </>
  )
}