import React, {useState} from 'react';
import Head from 'next/head'
import {Button, Card, CardContent, Stack, Typography} from '@mui/material'
import styles from '@/styles/Login.module.css'

export default function Login() {
  const [active, setActive] = useState("Login");

  function activateLogin() {
    setActive("Login");
  };

  function activateRegister() {
    setActive("Register");
  };

  return (
  <>
    <Head>
      <title>Furry Friends {active}</title>
    </Head>

    <main>
      <Stack sx={{ paddingTop: 6 }} alignItems='center'>
        <Card elevation={3}>
          <CardContent>
            <Typography variant='h3' align='center' sx={{paddingBottom: 2}}>{active}</Typography>
            <form>
              <div className={styles.loginGrid}>
                <label htmlFor="username"><Typography>Username:</Typography></label>
                <input 
                    type="text"
                    id="username"
                    />
                <label htmlFor="pw"><Typography>Password:</Typography></label>
                <input 
                    type="password"
                    id="pw"
                    />
                </div>
            </form>
          </CardContent>
        </Card>
        <Stack direction="row">
          <Button onClick={activateLogin}>Login</Button>
          <Button onClick={activateRegister}>Register</Button>
        </Stack>
      </Stack>
    </main>
  </>)
}