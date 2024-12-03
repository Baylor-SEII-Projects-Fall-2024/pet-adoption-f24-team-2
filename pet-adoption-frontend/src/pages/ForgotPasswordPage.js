import { Grid2, Typography, Box, Card, CardContent, Stack, Button, TextField } from "@mui/material";
import { useState } from "react";
import { request } from "@/axios_helper";
import Head from 'next/head';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  
  function onChangeEmail(e) {
    setEmail(e.target.value);
  }

  function onSubmitForgotPassword(e) {
    e.preventDefault();

    request("POST", "/forgot-password", {email: email})
      .then((response) => {
        setMessage("If there is an account associated with this email, "
           + " a reset link has been sent.");
      })
      .catch( (error) => {
        setMessage("An error occurred, please try again.");
        console.error(error);
      })
  }
  
  return (
    <>
      <Head>
        <title>Forgot Password</title>
      </Head>

      <main>
        <Stack sx={{ paddingTop: 4, paddingBottom: 2 }} alignItems="center">
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h2" align="center" sx={{ paddingBottom: 2 }}>
                Forgot Password
              </Typography>
              <form onSubmit={onSubmitForgotPassword}>
                <Grid2 container spacing={1} direction="column">
                  <Grid2 xs={12}>
                    <Typography>Email:</Typography>
                  </Grid2>
                  <Grid2 xs={12}>
                    <TextField
                      label="Email"
                      type="email"
                      id="email"
                      name="email"
                      onChange={onChangeEmail}
                      required
                      fullWidth
                      />
                  </Grid2>
                  <Grid2 xs={12} textAlign="center">
                    <Button variant="contained" type="submit">
                      Reset Password
                    </Button>
                  </Grid2>
                </Grid2>
              </form>
              {message && (
                <Box textAlign="center" paddingTop={2}>
                  <Typography>{message}</Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Stack>
      </main>
    </>
  )
}