import { useState } from 'react';
import { useRouter } from 'next/router';
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
    <Box padding={3}>
      <h2>Change Password</h2>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Current Password"
          type="password"
          required
          value={currPassword}
          onChange={onChangeCurrPassword}
        />
        <TextField
          label="New Password"
          type="password"
          required
          value={newPassword}
          onChange={onChangeNewPassword}
        />
        <TextField
          label="Confirm New Password"
          type="password"
          required
          value={confirmPassword}
          onChange={onChangeConfirmPassword}
        />
        <Button type="submit" cariant="combined" color="primary" fullWidth>
          Change Password
        </Button>
      </form>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        severity={snackbarSeverity}
        message={snackbarMessage}
        onClose={() => setSnackbarOpen(false)}
      />
    </Box>
  )
}