import { useState, useEffect } from 'react';
import { request, getUserID } from "@/axios_helper";  
import { Grid2, Card, CardContent, Typography, Button, Box } from "@mui/material";
import SnackbarNoti from './SnackbarNoti';

function NotificationDisplayCard({notif, onMarkAsRead}) {
  const [user, setUser] = useState({});
  const [pet, setPet] = useState({});
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect( () => {
    request("GET", `/users/${notif.userId}`, null)
      .then((response) => {
        setUser(response.data)
      }).catch((error) => {
        console.log(error);
      })

    request("GET", `/pet/${notif.petId}`, null)
      .then((response) => {
        setPet(response.data)
      }).catch((error) => {
        console.log(error);
      })
  
  }, [notif]);

  function handleNotifClick() {
    request("PUT", `/notifications/read/${notif.id}`, null)
      .then((response) => {
        onMarkAsRead(response.data);
      }).catch((error) => {
        console.log(error);
      })
  }

  function handleSnackbarClose() {
    setSnackbarOpen(false);
  }

  return (
    !notif.read && 
    (<Card elevation={3} >
      <CardContent >
        <Typography variant="h5" component="div">
          From: {user.name}
        </Typography>
        <Typography>
          Interested in the {pet.species}: {pet.name}
        </Typography>
        <Typography>
          message:
        </Typography>
        <Typography>
          {notif.message}
        </Typography>
        <Typography>
          Sent at: {(new Date(notif.createdAt)).toString()}
        </Typography>
        <Typography>
          Contact at: {user.emailAddress}
        </Typography>
        <Box textAlign="center">
          <Button variant="contained" size="small" onClick={handleNotifClick}>Mark as read</Button>
        </Box>
      </CardContent>
      <SnackbarNoti
            open={snackbarOpen}
            severity={snackbarSeverity}
            message={snackbarMessage}
            onClose={handleSnackbarClose}
      />
    </Card>)
    )
}

export default function NotificationsDisplay(props) {
  const [notifications, setNotifications] = useState([]);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  function handleSnackbarClose() {
    setSnackbarOpen(false);
  }

  useEffect(() => {
    request("GET", `/notifications/${getUserID()}`, null)
      .then((response) => {
        setNotifications(response.data)
      }).catch((error) => {
        console.log(error);
      })
  }, []);

  const handleMarkAsRead = (updatedNotif) => {
    let index = notifications.findIndex(n => n.id === updatedNotif.id);
    console.log(index)
    console.log(updatedNotif);
    let prevNotifications = [...notifications];
    prevNotifications[index] = updatedNotif;
    setNotifications(prevNotifications);
    setSnackbarMessage("Message marked as read");
    setSnackbarSeverity("info");
    setSnackbarOpen(true);
  };

  return (
    <Grid2 container spacing={2} paddingBottom={2} paddingLeft={2} paddingRight={2}>
      {notifications.length > 0 ? notifications.map((notif) => {
        return (
          <Grid2 key={notif.id} size={{xs: 12}}>
            <NotificationDisplayCard notif={notif} onMarkAsRead={handleMarkAsRead} />
            <SnackbarNoti
              open={snackbarOpen}
              severity={snackbarSeverity}
              message={snackbarMessage}
              onClose={handleSnackbarClose}
            />
          </Grid2>
        );
      }) : <div>No notifications found</div>}
    </Grid2>
  )
}