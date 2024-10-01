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
  const [userType, setUserType] = useState("Pet Owner")
  const [phoneNumber, setPhoneNumber] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState(null);

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

  function onChangePhone(event) {
    setPhoneNumber(event.target.value);
  }

  function onChangeName(event) {
    setName(event.target.value);
  }

  function onChangeDescription(event) {
    setDescription(event.target.value);
  }

  function onChangeAddress(event) {
    setAddress(event.target.value);
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
    let user = {emailAddress: email, 
                password: password, 
                userType: userType,
                phone: phoneNumber,
                name: name,
                description: description,
                address: address
              }

    request("POST",
      "/register",
      user
    ).then((response) => {
      setAuthenticatedUser(response.data)
      Router.push('/UserHomePage');
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
              <div className={styles.userTypeLabel}>User Type:</div>
                <label>
                  <input 
                    type="radio"
                    value="Pet Owner"
                    checked={userType === 'Pet Owner'}
                    onChange={onChangeUserType}
                    />
                  Pet Owner
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
              <label htmlFor="email"><Typography>Email:</Typography></label>
              <input 
                type="text"
                id="email"
                name="email"
                onChange={onChangeEmail}
                required
                />
              <label htmlFor="pw"><Typography>Password:</Typography></label>
              <input 
                type="password"
                id="pw"
                name="password"
                onChange={onChangePassword}
                required
                />
              <label htmlFor="phone"><Typography>Phone:</Typography></label>
              <input 
                type="text"
                id="phone"
                name="phone"
                onChange={onChangePhone}
                />
              <label htmlFor="name"><Typography>Name:</Typography></label>
              <input 
                type="text"
                id="name"
                name="name"
                onChange={onChangeName}
                />
              <label htmlFor="description"><Typography>Description:</Typography></label>
              <textarea
                onChange={onChangeDescription}
                name="description"
                rows={4}
                />
              {userType === "Adoption Center" &&
                <>
                  <label htmlFor="address"><Typography>Address:</Typography></label>
                  <input 
                    type="text"
                    id="address"
                    name="address"
                    onChange={onChangeAddress}
                    />
                </>
              }
                
                
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