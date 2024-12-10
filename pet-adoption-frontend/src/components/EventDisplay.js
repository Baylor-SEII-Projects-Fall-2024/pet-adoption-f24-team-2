import React, { useState, useEffect } from "react";
import { Card, CardContent, Typography, Button, Grid2 } from "@mui/material";
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
  const [location, setLocation] = useState(event.location);
  const [date, setDate] = useState(dayjs(event.date));
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [selectedPetId, setSelectedPetId] = useState("");
  const [pets, setPets] = useState([]);

  useEffect(() => {
    request("GET", "/pets")
        .then((response) => setPets(response.data))
        .catch((error) => console.log(error));
  }, []);

  function handleEdit() {
    setIsEditing(true);
  }

  function cancelEdit() {
    setIsEditing(false);
    setName(event.name);
    setDescription(event.description);
    setLocation(event.location);
    setDate(event.date);
    setSnackbarMessage("Event edit canceled");
    setSnackbarSeverity("info");
    setSnackbarOpen(true);
  }

  function handleRemove() {
    request("DELETE", `/events/${event.id}`, null)
        .then((response) => {
          if (response.status === 204) {
            let index = currEvents.findIndex(e => e.id === event.id);
            currEvents = [
              ...currEvents.slice(0, index),
              ...currEvents.slice(index + 1)
            ];
            setSnackbarMessage("Event deleted!");
            setSnackbarSeverity("warning");
            setSnackbarOpen(true);
            props.setEvents(currEvents);
          }
        }).catch((error) => console.log(error));
  }

  function saveEventChanges() {
    let selectedDate = new Date(date);
    let epochTime = selectedDate.getTime();
    let newEvent = {
      id: event.id,
      name: name,
      description: description,
      date: epochTime,
      location: location,
    };

    request("PUT", `/events/${getUserID()}`, newEvent)
        .then((response) => {
          let index = currEvents.findIndex(e => e.id === newEvent.id);
          if (index !== -1) {
            currEvents[index] = response.data;
            props.setEvents(currEvents);
          }
          setSnackbarMessage("Event updated!");
          setSnackbarSeverity("success");
          setSnackbarOpen(true);
        })
        .catch((error) => console.log(error));
    setIsEditing(false);
  }

  function handleAddPet() {
    if (!selectedPetId) {
      setSnackbarMessage("Please select a pet.");
      setSnackbarSeverity("warning");
      setSnackbarOpen(true);
      return;
    }

    useEffect(() => {
      request("GET", `/pets/${getUserID()}`, null)
          .then((response) => setPets(response.data))
          .catch((error) => console.log(error));
    }, []);

    handleClose();
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
      <Card elevation={3}>
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
              Location:{" "}
              {isEditing ? (
                  <input
                      value={location}
                      onChange={onChangeLocation}
                  />
              ) : (
                  <span>{location}</span>
              )}
            </label>
          </Typography>

          {user.role === "ADOPTION_CENTER" && (
              <>
                {isEditing ? (
                    <>
                      <Button variant="outlined" onClick={saveEventChanges}>Confirm</Button>
                      <Button variant="outlined" onClick={cancelEdit}>Cancel</Button>
                    </>
                ) : (
                    <>
                      <Button variant="outlined" onClick={handleEdit}>Edit</Button>
                      <Button variant="outlined" onClick={handleRemove}>Remove</Button>
                    </>
                )}
                <Typography>Add a Pet to this Event:</Typography>
                <select defaultValue="" onChange={(e) => console.log(e.target.value)}>
                  <option value="" disabled>
                    Select a Pet
                  </option>
                  {pets.length > 0 ? (
                      pets.map((pet) => (
                          <option key={pet.id} value={pet.id}>
                            {pet.name}
                          </option>
                      ))
                  ) : (
                      <option disabled>No Pets Available</option>
                  )}
                </select>
                <Button variant="outlined" onClick={handleAddPet}>
                  Add Pet
                </Button>
              </>
          )}
        </CardContent>

        <SnackbarNoti
            open={snackbarOpen}
            severity={snackbarSeverity}
            message={snackbarMessage}
            onClose={handleSnackbarClose}
        />
      </Card>
  );
}

export default function EventDisplay(props) {
  const eventsCopy = [...props.events];
  return (
      <Grid2 container spacing={2} paddingBottom={2} paddingLeft={2} paddingRight={2}>
        {props.events.map((event) => (
            <Grid2 key={event.id} size={{ xs: 12, sm: 6 }}>
              <EventDisplayCard event={event} currEvents={eventsCopy} setEvents={props.setEvents} user={props.user} />
            </Grid2>
        ))}
      </Grid2>
  );
}
