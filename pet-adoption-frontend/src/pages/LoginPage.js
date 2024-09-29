import React, {useState} from 'react';
import Head from 'next/head'
import {Button, Card, CardContent, Stack, Typography} from '@mui/material'
import styles from '@/styles/Login.module.css'
import { request, setLoggedInEmail } from '@/axios_helper';
import Router from 'next/router';

export default function Login() {
  const [active, setActive] = useState("Login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function activateLogin() {
    setActive("Login");
  };

  function activateRegister() {
    setActive("Register");
  };

  function onChangeEmail(event) {
    setEmail(event.target.value);
  };

  function onChangePassword(event) {
    setPassword(event.target.value);
  };

  function onSubmitLogin(e) {
    submitLogin(e, email, password);
  };

  function submitLogin(e, email, password) {
        e.preventDefault();
        request("POST",
            "/login",
            {email: email, password: password}
        ).then((response) => {
            {/*setAuthToken(response.data.token)*/}
            console.log(response.data)
            setLoggedInEmail(email)
            Router.push('/UserHomePage')
        }).catch((error) => {
            console.log(error);
        });
    }

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
            <form onSubmit={onSubmitLogin}>
              <div className={styles.loginGrid}>
                <label htmlFor="email"><Typography>Email:</Typography></label>
                <input 
                    type="text"
                    id="email"
                    name="email"
                    onChange={onChangeEmail}
                    />
                <label htmlFor="pw"><Typography>Password:</Typography></label>
                <input 
                    type="password"
                    id="pw"
                    name="password"
                    onChange={onChangePassword}
                    />
                </div>
                <button type="submit">Sign in</button>
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