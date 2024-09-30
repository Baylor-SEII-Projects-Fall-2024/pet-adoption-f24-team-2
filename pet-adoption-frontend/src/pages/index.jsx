import React, {useState} from 'react';
import Head from 'next/head'
import {Button, Card, CardContent, Stack, Typography} from '@mui/material'
import { clearCookies, setAuthenticatedUser, request } from '@/axios_helper';
import styles from '@/styles/Login.module.css';
import Router from 'next/router';

export default function Login() {
  const [active, setActive] = useState("Login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("Potential Adopter")

  function activateLogin() {
    setEmail("")
    setPassword("")
    setActive("Login");
  };

  function activateRegister() {
    setEmail("")
    setPassword("")
    setActive("Register");
  };

  function onChangeEmail(event) {
    setEmail(event.target.value);
  };

  function onChangePassword(event) {
    setPassword(event.target.value);
  };

  function onChangeUserType(event) {
    setUserType(event.target.value);
  }

  function onSubmitLogin(e) {
    e.preventDefault();
    submitLogin(email, password);
  };

  function submitLogin(email, password) {
    clearCookies()
    request("POST",
            "/login",
            {emailAddress: email, password: password}
    ).then((response) => {
      console.log(response.data);
      setAuthenticatedUser(response.data);
      Router.push('/UserHomePage')
    }).catch((error) => {
      console.log(error);
    });
  }

  function onSubmitRegister(e) {
    e.preventDefault()
    submitRegister(email, password, userType)
  }

  function submitRegister(email, password, userType) {
    clearCookies();
    let user = {emailAddress: email, password: password, userType: userType}
    console.log(user);

    request("POST",
      "/register",
      user
    ).then((response) => {
      setAuthenticatedUser(response.data)
      Router.push('/UserHomePage');
    }).catch((error) => {
      console.log(error);
    });

    console.log(user);
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
            { active === "Login" && 
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
            </form> }
            { active === "Register" && 
            <form onSubmit={onSubmitRegister}>
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
              <div className={styles.userTypeLabel}>User Type:</div>
              <label>
                <input 
                    type="radio"
                    value="Potential Adopter"
                    checked={userType === 'Potential Adopter'}
                    onChange={onChangeUserType}
                    />
                Potential Adopter
              </label>
              <label>
                <input 
                    type="radio"
                    value="Adoption Center"
                    checked={userType === 'Adoption Center'}
                    onChange={onChangeUserType}
                    />
                Adoption Center
              </label>
                
              </div>
              <button type="submit">{active === Login ? "Sign in" : "Register"}</button>
          </form>}
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