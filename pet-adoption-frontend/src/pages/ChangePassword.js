import { useState, useEffect } from 'react';
import { request, getUserID } from '@/axios_helper';
import Navbar from '@/components/Navbar';
import { TextField, Button, Box, Typography, Snackbar } from '@mui/material';

export default function ChangePassword() {
  const [ currPassword, setCurrPassword ] = useState("");
  const [ newPassword, setNewPassword ] = useState("");
  const [ confirmPassword, setConfirmedPassword ] = useState("");
  const [ errorMessage, setErrorMessage ] = useState("");
  const [ successMessage, setSuccessMessage ] = useState("");
  const [ snackbarMessage, setSnackbarMessage ] = useState("");
  const [ snackbarSeverity, setSnackbarSeverity ] = useState("success");
  const [ snackbarOpen, setSnackbarOpen ] = useState(false);
  const [ user, setUser ] = useState({});

  // grab the user data when component loads
  useEffect( () => {
    request("GET", `/users/${getUserID()}`, null)
      .then((response) => {
        setUser(response.data)
      }).catch((error) => {
        console.log(error);
      })
  
}, [])

  function handleSubmit(e) {
    e.preventDefault();

    if(newPassword !== confirmPassword) {
      setSnackbarMessage("New password and confirmation do no match.")
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return
    }

    request("POST", "/users/change-password", {currPassword, newPassword})
      .then((response) => {
        setSnackbarMessage("Password change succesful")
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
        setCurrPassword("");
        setNewPassword("");
        setConfirmedPassword("");
      })
      .catch((error) => {
        setSnackbarMessage(error.response?.data?.message || "Failed to change password.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      })
  }

  function onChangeCurrPassword(e) {
    setCurrPassword(e.target.value);
  }

  function onChangeNewPassword(e) {
    setNewPassword(e.target.value);
  }

  function onChangeConfirmPassword(e) {
    setConfirmedPassword(e.target.value);
  }

  return (
    <>
      <Navbar user={user}/>
      <Box 
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
      >
        <Box
          padding={4}
          borderRadius={2}
          boxShadow={3}
          width={{xs: "100%", sm: "400px"}}
        >
          <Typography variant="h5" gutterBottom={true}>
            Change Password
          </Typography>
          <form onSubmit={handleSubmit}>
            <Box marginBottom={2}>
              <TextField
                label="Current Password"
                type="password"
                fullWidth
                required
                value={currPassword}
                onChange={onChangeCurrPassword}
              />
            </Box>
            <Box marginBottom={2}>
              <TextField
                label="New Password"
                type="password"
                fullWidth
                required
                value={newPassword}
                onChange={onChangeNewPassword}
              />
            </Box>
            <Box marginBottom={2}>
              <TextField
                label="Confirm New Password"
                type="password"
                fullWidth
                required
                value={confirmPassword}
                onChange={onChangeConfirmPassword}
              />
            </Box>
            <Button type="submit" cariant="combined" color="primary" fullWidth>
              Change Password
            </Button>
          </form>
        </Box>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={5000}
          severity={snackbarSeverity}
          message={snackbarMessage}
          onClose={() => setSnackbarOpen(false)}
        />
      </Box>
    </>
  )
}