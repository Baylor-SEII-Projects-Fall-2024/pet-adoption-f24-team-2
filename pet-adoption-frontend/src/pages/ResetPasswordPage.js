import React, {useState, useEffect} from "react";
import Head from "next/head";
import { Button, Card, CardContent, Stack, Typography, Box, Grid2, TextField} from "@mui/material";
import { request } from "@/axios_helper";
import Link from "next/link";

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [token, setToken] = useState("");

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const resetToken = queryParams.get("token");
    if(resetToken) {
      setToken(resetToken);
    } else {
      setMessage("Invalid or expired reset token.");
    }
  }, []);

  function onChangeNewPassword(e) {
    setNewPassword(e.target.value);
  }

  function onSubmitNewPassword(e) {
    e.preventDefault();

    if(!token) {
      setMessage("Invalid token.");
      return;
    }

    let body = {
      "token": token,
      "password": newPassword,
    }
    request("POST", `/reset-password`, body)
      .then(() => {
        setMessage("Password reset successfully! You can now log in with"
          + " your new password");
      })
      .catch(() => {
        setMessage("An error occurred, please try again.");
      });
  }

  return (
    <>
      <Head>
        <title>Reset Password</title>
      </Head>

      <main>
        <Stack sx={{ paddingTop: 2, paddingBottom: 2 }} alignItems="center">
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h2" align="center" sx={{ paddingBottom: 2 }}>
                Reset Password
              </Typography>
              <form onSubmit={onSubmitNewPassword}>
                <Grid2>
                  <Grid2>
                    <Typography>New Password:</Typography>
                  </Grid2>
                  <Grid2 xs={12}>
                    <TextField
                      label="Password"
                      type="password"
                      id="password"
                      name="password"
                      onChange={onChangeNewPassword}
                      required
                      minLength={8}
                      fullWidth
                      />
                  </Grid2>
                  <Grid2 xs={12} textAlign="center">
                    <Button variant="contained" type="submit">
                      Confirm
                    </Button>
                  </Grid2>
                </Grid2>
              </form>
              {message && (
                <Box textAlign="center" paddingTop={2}>
                  <Typography>{message}</Typography>
                </Box>
              )}
              <Typography mt={2} align="center">
                <Link href="/login" passHref>
                  <Button variant="outlined">Go to Login Page</Button>
                </Link>
              </Typography>
            </CardContent>
          </Card>
        </Stack>
      </main>
    </>
  )
}