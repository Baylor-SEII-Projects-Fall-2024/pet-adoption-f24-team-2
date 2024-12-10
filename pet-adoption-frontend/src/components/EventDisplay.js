import React from "react";
import { Card, CardContent, Typography, Button, Grid2 } from "@mui/material";
import { useState } from "react";
import { request } from "@/axios_helper";
import { getUserID } from "@/axios_helper";
import { DateTimePicker } from "@mui/x-date-pickers";
import dayjs from 'dayjs';
import SnackbarNoti from "./SnackbarNoti";

function EventDisplayCard(props) {
  const event = props.event;
  let currEvents = props.currEvents;
  let user = props.user;

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(event.name);
  const [description, setDescription] = useState(event.description);
  const [date, setDate] = useState(dayjs(event.date));
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  function handleEdit() {
    setIsEditing(true);
  }

  function cancelEdit() {
    setIsEditing(false);
    setName(event.name);
    setDescription(event.description)
    setDate(event.date)
    setSnackbarMessage("Event edit canceled");
    setSnackbarSeverity("info");
    setSnackbarOpen(true);
  }

  function handleRemove() {
    request("DELETE", `/events/${event.id}`, null)
      .then((response) => {
        if( response.status === 204 ) {
          let index = currEvents.findIndex(e => e.id === event.id);
          currEvents = [
            ...currEvents.slice(0, index), // Elements before the one to delete
            ...currEvents.slice(index + 1) // Elements after the one to delete
          ]
          setSnackbarMessage("Event deleted!");
          setSnackbarSeverity("warning");
          setSnackbarOpen(true);
          props.setEvents(currEvents);
        }
      }).catch((error) => {
        console.log(error);
      });
  }

  function saveEventChanges() {
    let selectedDate = new Date(date);
    let epochTime = selectedDate.getTime();
    let newEvent = {
      id: event.id,
      name: name,
      description: description,
      date: epochTime,
      streetAddress: event.streetAddress,
      state: event.state,
      city: event.city,
    }

    request("PUT", `/events/${getUserID()}`, newEvent)
    .then((response) => {
      let index = currEvents.findIndex(e => e.id === newEvent.id);
      if( index !== -1) {
        currEvents[index] = response.data;
        props.setEvents(currEvents);
      }
      setSnackbarMessage("Event updated!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    }).catch((error) => {
      console.log(error);
    });
    setIsEditing(false);
  }

  function onChangeName(e) {
    setName(e.target.value);
  }

  function onChangeDescription(e) {
    setDescription(e.target.value);
  }
  
  function onChangeLocation(e) {
    setLocation(e.target.value);
  }

  function handleSnackbarClose() {
    setSnackbarOpen(false);
  }

  return (
    <Card elevation={3} >
      <CardContent component="form">
        <Typography variant="h5" component="div">
          Event name:{" "}
          {isEditing ? (
                <input
                  value={name}
                  onChange={onChangeName}
                />
              ) : (
                <span>{name}</span>
              )}
        </Typography>
        <Typography>
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
        </Typography>

        <Typography>Date:{" "} 
        {isEditing ? (
              <DateTimePicker 
                value={date}
                onChange={(newValue) => setDate(newValue)}
              />
            ) : (
              <span>{date.toString()}</span>
            )}
        </Typography>
        
        <Typography>
          <label>
            Location:{" "} {event.streetAddress}, {event.city}, {event.state}

          </label>
        </Typography>
        {console.log(props.user)}
        { user.role === "ADOPTION_CENTER" && (isEditing ? 
        <>
          <Button variant="outlined" onClick={saveEventChanges}>Confirm</Button>
          <Button variant="outlined" onClick={cancelEdit}>Cancel</Button>
        </>
        :
        <>
          <Button variant="outlined" onClick={handleEdit}>Edit</Button>
          <Button variant="outlined" onClick={handleRemove}>Remove</Button>
        </>) }
      </CardContent>
      <SnackbarNoti
            open={snackbarOpen}
            severity={snackbarSeverity}
            message={snackbarMessage}
            onClose={handleSnackbarClose}
      />
    </Card>
  )
}

export default function EventDisplay(props) {
  const eventsCopy  = [...props.events];
  return (
    <Grid2 container spacing={2} paddingBottom={2} paddingLeft={2} paddingRight={2}>
      {props.events.map((event) => {
        return (
          <Grid2 key={event.id} size={{xs: 12, sm: 6 }}>
            <EventDisplayCard event={event} currEvents={eventsCopy} setEvents={props.setEvents} user={props.user}/>
          </Grid2>
        );
      }) }
    </Grid2>
  )
}