import React from "react";
import { Card, CardContent, Typography, Button } from "@mui/material";
import { useState } from "react";
import { request } from "@/axios_helper";
import { getUserID } from "@/axios_helper";

function EventDisplayCard(props) {
  const event = props.event;
  let currEvents = props.currEvents;

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(event.name);
  const [description, setDescription] = useState(event.description);
  const [ date, setDate ] = useState(new Date(event.date));

  function handleEdit() {
    setIsEditing(true);
  }

  function cancelEdit() {
    setIsEditing(false);
    setName(event.name);
    setDescription(event.description)
  }

  function handleRemove() {
    console.log(event.id);
    request("DELETE", `/events/${event.id}`, null)
      .then((response) => {
        if( response.status === 204 ) {
          let index = currEvents.findIndex(e => e.id === event.id);
          currEvents = [
            ...currEvents.slice(0, index), // Elements before the one to delete
            ...currEvents.slice(index + 1) // Elements after the one to delete
          ]

          props.setEvents(currEvents);
        }
      }).catch((error) => {
        console.log(error);
      });
  }

  function saveEventChanges() {
    
      setIsEditing(false);
  }

  function onChangeName(e) {
    setName(e.target.value);
  }

  function onChangeDescription(e) {
    setDescription(e.target.value);
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

        <Typography>Date: {date.toString()}</Typography>

        {isEditing ? 
        <>
          <Button variant="outlined" onClick={saveEventChanges}>Confirm</Button>
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

export default function EventDisplay(props) {
  const eventsCopy  = [...props.events];
  return (
    <>
      {props.events.map((event) => {
        return (
          <EventDisplayCard key={event.id} event={event} currEvents={eventsCopy} setEvents={props.setEvents}/>
        );
      }) }
    </>
  )
}