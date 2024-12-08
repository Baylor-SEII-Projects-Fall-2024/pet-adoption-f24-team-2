import { useState, useEffect } from 'react';
import { request, getUserID } from "@/axios_helper";  
import { Tab, Tabs, Grid, Card, CardContent, Typography, Button, Box } from "@mui/material";
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
    
    <Card elevation={3} >
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
}

export default function NotificationsDisplay(props) {
  const [notifications, setNotifications] = useState([]);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("");
  const [tabIndex, setTabIndex] = useState(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  function handleSnackbarClose() {
    setSnackbarOpen(false);
  }

  useEffect(() => {
    request("GET", `/notifications/${getUserID()}`, null)
      .then((response) => {
        setNotifications(response.data)
        console.log(response.data)
      }).catch((error) => {
        console.error(error);
      })
  }, []);

  const handleMarkAsRead = (updatedNotif) => {
    let index = notifications.findIndex(n => n.id === updatedNotif.id);
    console.log(index)
    console.log(updatedNotif);
    setNotifications((prev) => prev.map((n) => (n.id === updatedNotif.id ? updatedNotif : n)));
    setSnackbarMessage("Message marked as read");
    setSnackbarSeverity("info");
    setSnackbarOpen(true);
  };

  function handleTabChange(_, newIndex) {
    setTabIndex(newIndex);
  }

  const unreadNotifications = notifications.filter((n) => !n.read);
  const readNotifications = notifications.filter((n) => n.read);

  return (
    <Box sx={{ width: "100%", padding: 2 }}>
      {console.log(readNotifications)}
      {console.log(unreadNotifications)}
      <Tabs value={tabIndex} onChange={handleTabChange} centered>
        <Tab label={`Unread (${unreadNotifications.length})`} />
        <Tab label={`Read (${readNotifications.length})`} />
      </Tabs>
  
      <Grid container spacing={2}>
        {(tabIndex === 0 ? unreadNotifications : readNotifications).map((notif) => (
          <Grid item xs={12} key={notif.id}>
            <NotificationDisplayCard notif={notif} onMarkAsRead={handleMarkAsRead} />
          </Grid>
        ))}
  
        {tabIndex === 0 && unreadNotifications.length === 0 && (
          <Box textAlign="center" sx={{ marginTop: 3, width: "100%" }}>
            <p>No unread notifications</p>
          </Box>
        )}
  
        {tabIndex === 1 && readNotifications.length === 0 && (
          <Box textAlign="center" sx={{ marginTop: 3, width: "100%" }}>
            <p>No read notifications</p>
          </Box>
        )}
      </Grid>
  
      <SnackbarNoti
        open={snackbarOpen}
        severity={snackbarSeverity}
        message={snackbarMessage}
        onClose={handleSnackbarClose}
      />
    </Box>
    );
  
}