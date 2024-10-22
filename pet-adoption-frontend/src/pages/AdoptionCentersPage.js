import { useState, useEffect } from "react";
import { request, getUserID } from "@/axios_helper";
import Navbar from "@/components/Navbar";
import { Button, Dialog, DialogTitle, DialogContent, Typography } from "@mui/material";
import AdoptionCenterDisplay from "@/components/AdoptionCenterDisplay";
import EventDisplay from "@/components/EventDisplay";
 
export default function AdoptionCentersPage() {
  const [user, setUser] = useState({});
  const [centers, setCenters] = useState([]);
  const [eventCenter, setEventCenter] = useState(null);
  const [events, setEvents] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    request("GET", `/users/adoption-centers`, null)
      .then((response) => {
        console.log(response.data);
        setCenters(response.data);
        console.log("Went through");
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  function findCenterEvents(centerId) {
    request("GET", `/events/${centerId}`, null)
      .then((response) => {
        console.log(response.data);
        setEvents(response.data);
        setEventCenter(centers.find((center) => center.id === centerId));
        setOpen(true);
      })
      .catch((error) => {
        console.error("Error finding events: ", events);
      });
  }

  function closeEvents() {
    setOpen(false);
    setEventCenter(null);
  }

  return (
    <>
     <Navbar user={user}/>
     <Typography variant="h3" align="center">
      Adoption Centers Nearby!
     </Typography>
     <AdoptionCenterDisplay centers={centers} onFindCenterEvents={findCenterEvents}/>
     <Dialog open={open} onClose={closeEvents} maxWidth="md" fullWidth>
      <DialogTitle>Available Events for {eventCenter?.name}</DialogTitle>
      <DialogContent>
        {events.length > 0 ? (
          <EventDisplay events={events} setEvents={setEvents}/>
        ) : (
          <Typography>No events planned :/</Typography>
        )}
        <Button onClick={closeEvents} variant="contained">close</Button>
      </DialogContent>
     </Dialog>
    </>
  );
}