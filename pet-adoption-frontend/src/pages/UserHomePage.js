import { useEffect, useState } from "react";
import { request, getUserID } from "@/axios_helper";
import Navbar from "@/components/Navbar";
import { Typography, Card, CardContent, Button, Grid2, Box } from "@mui/material";

export default function UserHomePage() {
  const [user, setUser] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [phone, setPhone] = useState();
  const [userType, setUserType] = useState();
  const [description, setDescription] = useState();
  const [address, setAddress] = useState();

  useEffect( () => {
      request("GET", `/users/${getUserID()}`, null)
        .then((response) => {
          setUser(response.data)
          setName(response.data.name);
          setEmail(response.data.emailAddress);
          setPhone(response.data.phone);
          setUserType(response.data.role === "PET_OWNER" ? "Pet Owner" : "Adoption Center");
          setDescription(response.data.description);
          setAddress(response.data.address);
        }).catch((error) => {
          console.log(error);
        })
    
  }, [])
  
  function discardChanges(e) {
    e.preventDefault();
    setIsEditing(false);
    setName(user.name);
    setPhone(user.phone);
    setDescription(user.description);
    if( userType === "Pet Owner" ) {
      setAddress(user.address);
    }
  }

  function saveChanges(e) {
    e.preventDefault();
    setIsEditing(false);
    
    const newUserInfo = {
      emailAddress: user.emailAddress,
      role: user.role,
      name: name,
      address: address,
      description: description,
      phone: phone,
    }

    request("PUT", `/users/${getUserID()}`,  newUserInfo)
      .then((response) => {
        setUser(response.data);
        setName(response.data.name);
        setEmail(response.data.emailAddress);
        setPhone(response.data.phone);
        setUserType(response.data.role === "PET_OWNER" ? "Pet Owner" : "Adoption Center");
        setDescription(response.data.description);
        setAddress(response.data.address);
      }).catch((error) => {
        console.log(error);
      })

  }

  function startEditing(e) {
    e.preventDefault();
    setIsEditing(true);
  }

  function onChangePhone(event) {
    setPhone(event.target.value);
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

  return (
    <>
      <Navbar user={user}/>
      <Typography variant="h3" align="center"> Welcome {user.name}  </Typography>
      <Box paddingLeft={{xs: "5%", sm: "10%", md: "20%", lg: "30%"}} paddingRight={{xs: "5%", sm: "10%", md: "20%", lg: "30%"}} paddingBottom={1}>
        <Card elevation={2} >
          <CardContent component="form" >
            <Typography paddingTop={1} >
              <Grid2 container spacing={2}>
                <Grid2 item size={6}>
                  Email:{" "}
                </Grid2>
                <Grid2 item size={6}>
                  {email}
                </Grid2>
              </Grid2>
            </Typography>
            <Typography paddingTop={1} >
              <Grid2 container spacing={2}>
                <Grid2 item size={6}>
                  Account Type:{" "}
                </Grid2>
                <Grid2 item size={6}>
                  {userType}
                </Grid2>
              </Grid2>
            </Typography>
            <Typography paddingTop={1} >
              <label>
                <Grid2 container spacing={2}>
                  <Grid2 item size={6}>
                    Name:{" "}
                  </Grid2>
                  <Grid2 item size={6}>
                    {isEditing ? (
                      <input
                        value={name}
                        onChange={onChangeName}
                      />
                    ) : (
                      <span>{name}</span>
                    )}
                  </Grid2>
                </Grid2> 
              </label>
            </Typography>
            <Typography paddingTop={1} >
              <label>
                <Grid2 container spacing={2}>
                  <Grid2 item size={6}>
                    Phone Number:{" "}
                  </Grid2>
                  <Grid2 item size={6}>
                    { isEditing ? (
                      <input 
                        value={phone}
                        onChange={onChangePhone}
                        />
                    ) : (
                      <span>{phone}</span>
                    )}
                  </Grid2>
                </Grid2> 
              </label>
            </Typography>
            <Typography paddingTop={1} >
              <label>
                <Grid2 container spacing={2}>
                  <Grid2 item size={6}>
                    Description:{" "}
                  </Grid2>
                  <Grid2 item size={6}>
                    {isEditing ? (
                      <textarea
                        rows={4} 
                        value={description}
                        onChange={onChangeDescription}
                        />
                    ) : (
                      <span>{description}</span>
                    )}
                  </Grid2>
                </Grid2>  
              </label>
            </Typography>
            {userType === "Adoption Center" &&
              <Typography paddingTop={1} >
                <label>
                  <Grid2 container spacing={2}>
                    <Grid2 item size={6}>
                      Address:{" "}
                    </Grid2>
                    <Grid2 item size={6}>
                      {isEditing ? (
                        <input 
                          value={address}
                          onChange={onChangeAddress}
                          />
                      ) : (
                        <span>{address}</span>
                      )}
                    </Grid2>
                  </Grid2>
                </label>
              </Typography>
            }

            {isEditing ?
              <Box textAlign="center">
                <Button variant="contained" onClick={saveChanges}>Save</Button>
                {" "}
                <Button variant="contained" onClick={discardChanges}>Cancel</Button>
              </Box> :
              <Box textAlign="center">
                <Button variant="contained" onClick={startEditing}>Edit profile</Button>
              </Box> }
          </CardContent>
        </Card>
      </Box>
    </>
  )
}