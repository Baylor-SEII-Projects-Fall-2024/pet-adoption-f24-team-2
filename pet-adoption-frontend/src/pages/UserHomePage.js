import { useEffect, useState } from "react";
import { request, getUserID } from "@/axios_helper";
import Navbar from "@/components/Navbar";
import { Typography, Card, CardContent, Button, Grid2, Box } from "@mui/material";
import SnackbarNoti from "@/components/SnackbarNoti";
import Chart from 'chart.js/auto';

export default function UserHomePage() {
  const [user, setUser] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [phone, setPhone] = useState();
  const [userType, setUserType] = useState();
  const [description, setDescription] = useState();
  const [address, setAddress] = useState();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("");

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
    setSnackbarMessage("User information changes have been discarded!");
    setSnackbarSeverity("info");
    setSnackbarOpen(true);
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

        setSnackbarMessage("User information updated!");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
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

  function onIncSpecies(opt) {
    request("POST", `/petrec/${getUserID()}/incSpecies/${opt}`, null)
    .then(() => {
      request("GET", `/users/${getUserID()}`, null)
        .then((response) => {
          setUser(response.data);
        })
    })
  }

  function onDecSpecies(opt) {
    request("POST", `/petrec/${getUserID()}/decSpecies/${opt}`, null)
    .then(() => {
      request("GET", `/users/${getUserID()}`, null)
        .then((response) => {
          setUser(response.data); 
        })
    })
  }

  function onIncColor(opt) {
    request("POST", `/petrec/${getUserID()}/incColor/${opt}`, null)
    .then(() => {
      request("GET", `/users/${getUserID()}`, null)
        .then((response) => {
          setUser(response.data); 
        })
    })
  }

  function onDecColor(opt) {
    request("POST", `/petrec/${getUserID()}/decColor/${opt}`, null)
    .then(() => {
      request("GET", `/users/${getUserID()}`, null)
        .then((response) => {
          setUser(response.data); 
        })
    })
  }

  function onChangeGender(opt) {
    request("POST", `/petrec/${getUserID()}/changeGender/${opt}`, null)
    .then(() => {
      request("GET", `/users/${getUserID()}`, null)
        .then((response) => {
          setUser(response.data); 
        })
    })
  }

  function onChangeAge(opt) {
    request("POST", `/petrec/${getUserID()}/changeAge/${opt}`, null)
    .then(() => {
      request("GET", `/users/${getUserID()}`, null)
        .then((response) => {
          setUser(response.data); 
        })
    })
  }

  function onResetPref() {
    request("POST", `/petrec/${getUserID()}/reset`)
    .then(() => {
      request("GET", `/users/${getUserID()}`, null)
        .then((response) => {
          setUser(response.data); 
        })
        setSnackbarMessage("Preferences Reset!");
        setSnackbarSeverity("warning");
        setSnackbarOpen(true);
    })
  }

  function addRandomPets() {
    request("POST", `/pets/addTestPets/${getUserID()}`)
    .catch((error) => {
      console.log(error);
    })
  }

  function handleSnackbarClose() {
    setSnackbarOpen(false);
  }
  // Species Chart
  useEffect(() => {
    const speciesCtx = document.getElementById('speciesChart')?.getContext('2d');
    
    if (speciesCtx && user.attributes?.attributes) {
      const speciesChart = new Chart(speciesCtx, {
        type: 'pie',
        data: {
          labels: ['Cats', 'Dogs', 'Rabbits'],
          datasets: [{
            data: [
              user.attributes.attributes[0],
              user.attributes.attributes[1],
              user.attributes.attributes[2]
            ],
            backgroundColor: [
              'rgba(255, 99, 132, 0.5)',
              'rgba(54, 162, 235, 0.5)',
              'rgba(255, 206, 86, 0.5)'
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)'
            ],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: 'Species Preferences'
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  const dataset = context.dataset;
                  const total = dataset.data.reduce((acc, data) => acc + data, 0);
                  const value = dataset.data[context.dataIndex];
                  const percentage = ((value / total) * 100).toFixed(1);
                  return `${context.label}: ${percentage}%`;
                }
              }
            }
          }
        }
      });

      return () => speciesChart.destroy();
    }
  }, [user.attributes?.attributes[0], user.attributes?.attributes[1], user.attributes?.attributes[2]]);

  // Color Chart
  useEffect(() => {
    const colorCtx = document.getElementById('colorChart')?.getContext('2d');
    
    if (colorCtx && user.attributes?.attributes) {
      const colorChart = new Chart(colorCtx, {
        type: 'pie',
        data: {
          labels: ['White', 'Black', 'Brown'],
          datasets: [{
            data: [
              user.attributes.attributes[3],
              user.attributes.attributes[4],
              user.attributes.attributes[5]
            ],
            backgroundColor: [
              'rgba(255, 255, 255, 0.5)',
              'rgba(0, 0, 0, 0.5)',
              'rgba(111, 78, 55, 0.5)'
            ],
            borderColor: [
              'rgba(200, 200, 200, 1)',
              'rgba(0, 0, 0, 1)',
              'rgba(111, 78, 55, 1)'
            ],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: 'Color Preferences'
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  const dataset = context.dataset;
                  const total = dataset.data.reduce((acc, data) => acc + data, 0);
                  const value = dataset.data[context.dataIndex];
                  const percentage = ((value / total) * 100).toFixed(1);
                  return `${context.label}: ${percentage}%`;
                }
              }
            }
          }
        }
      });

      return () => colorChart.destroy();
    }
  }, [user.attributes?.attributes[3], user.attributes?.attributes[4], user.attributes?.attributes[5]]);

  // Gender Chart
  useEffect(() => {
    const genderCtx = document.getElementById('genderChart')?.getContext('2d');
    
    if (genderCtx && user.attributes?.attributes) {
      const genderChart = new Chart(genderCtx, {
        type: 'pie',
        data: {
          labels: ['Male', 'Female'],
          datasets: [{
            data: [
              user.attributes.attributes[6],
              user.attributes.attributes[7]
            ],
            backgroundColor: [
              'rgba(54, 162, 235, 0.5)',
              'rgba(255, 99, 132, 0.5)'
            ],
            borderColor: [
              'rgba(54, 162, 235, 1)',
              'rgba(255, 99, 132, 1)'
            ],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: 'Gender Preferences'
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  const dataset = context.dataset;
                  const total = dataset.data.reduce((acc, data) => acc + data, 0);
                  const value = dataset.data[context.dataIndex];
                  const percentage = ((value / total) * 100).toFixed(1);
                  return `${context.label}: ${percentage}%`;
                }
              }
            }
          }
        }
      });

      return () => genderChart.destroy();
    }
  }, [user.attributes?.attributes[6], user.attributes?.attributes[7]]);

  return (
    <>
      <Navbar user={user}/>
      <Typography variant="h3" align="center"> Welcome {user.name} </Typography>
      <Box 
        paddingLeft={{ xs: "5%", sm: "10%", md: "20%", lg: "20%" }}
        paddingRight={{ xs: "5%", sm: "10%", md: "20%", lg: "20%" }}
        paddingBottom={1}
        sx={{ display: 'flex', justifyContent: 'center' }}
        >
        <Grid2 container spacing={3} justifyContent="center">
          {/* Account Details Card */}
          <Grid2 xs={12} sm={8} md={5} sx={{ minWidth: '400px' }}>
            <Card elevation={2}>
              <CardContent component="form">
                <Box variant="h5" align="center">
                  Account Details
                </Box>
                <Box paddingTop={1}>
                  <Grid2 container spacing={2}>
                    <Grid2 size={6}>
                      Email:{" "}
                    </Grid2>
                    <Grid2 size={6}>
                      {email}
                    </Grid2>
                  </Grid2>
                </Box>
                <Box paddingTop={1}>
                  <Grid2 container spacing={2}>
                    <Grid2 size={6}>
                      Account Type:{" "}
                    </Grid2>
                    <Grid2 size={6}>
                      {userType}
                    </Grid2>
                  </Grid2>
                </Box>
                <Box paddingTop={1}>
                  <label>
                    <Grid2 container spacing={2}>
                      <Grid2 size={6}>
                        Name:{" "}
                      </Grid2>
                      <Grid2 size={6}>
                        {isEditing ? (
                          <input value={name} onChange={onChangeName} required />
                        ) : (
                          <span>{name}</span>
                        )}
                      </Grid2>
                    </Grid2>
                  </label>
                </Box>
                <Box paddingTop={1}>
                  <label>
                    <Grid2 container spacing={2}>
                      <Grid2 size={6}>
                        Phone Number:{" "}
                      </Grid2>
                      <Grid2 size={6}>
                        {isEditing ? (
                          <input value={phone} onChange={onChangePhone} required />
                        ) : (
                          <span>{phone}</span>
                        )}
                      </Grid2>
                    </Grid2>
                  </label>
                </Box>
                <Box paddingTop={1}>
                  <label>
                    <Grid2 container spacing={2}>
                      <Grid2 size={6}>
                        Description:{" "}
                      </Grid2>
                      <Grid2 size={6}>
                        {isEditing ? (
                          <textarea rows={4} value={description} onChange={onChangeDescription} />
                        ) : (
                          <span>{description}</span>
                        )}
                      </Grid2>
                    </Grid2>
                  </label>
                </Box>
                {userType === "Adoption Center" && (
                  <Box paddingTop={1}>
                    <label>
                      <Grid2 container spacing={2}>
                        <Grid2 size={6}>
                          Address:{" "}
                        </Grid2>
                        <Grid2 size={6}>
                          {isEditing ? (
                            <input value={address} onChange={onChangeAddress} />
                          ) : (
                            <span>{address}</span>
                          )}
                        </Grid2>
                      </Grid2>
                    </label>
                  </Box>
                )}
  
                {isEditing ? (
                  <Box textAlign="center">
                    <Button variant="contained" onClick={saveChanges}>Save</Button>{" "}
                    <Button variant="contained" onClick={discardChanges}>Cancel</Button>
                  </Box>
                ) : (
                  <Box textAlign="center">
                    <Button variant="contained" onClick={startEditing}>Edit profile</Button>
                  </Box>
                )}
              </CardContent>
            </Card>
            {userType === "Adoption Center" &&
                <Button variant="contained" onClick={addRandomPets}>Add 500 Random Test Pets</Button> }
          </Grid2>

          <SnackbarNoti
            open={snackbarOpen}
            onClose={handleSnackbarClose}
            severity={snackbarSeverity}
            message={snackbarMessage}
          />
  
          {userType === "Pet Owner" && (
            <Grid2 xs={12} sm={6} md={5} sx={{ minWidth: '400px' }}>
              <Card elevation={2}>
                <CardContent>
                  <Box variant="h5" align="center">
                    Pet Preferences
                  </Box>
                  <Box variant="h5" align="center" color="text.secondary">
                    (If a button is greyed out, it's at it's minimum value.)
                  </Box>
                  <Box paddingTop={1}>
                    <Grid2 container spacing={2} alignItems="center">
                      <Grid2 xs={4} textAlign="right">
                        Species:
                      </Grid2>
                      <Grid2 xs={4} textAlign="center">
                        <Button variant="contained" onClick={() => onIncSpecies("cat")}>More Cats</Button>
                        <Button variant="contained" onClick={() => onDecSpecies("cat")}
                          disabled={user.attributes?.attributes[0] < 1}>Less Cats</Button>
                        <Button variant="contained" onClick={() => onIncSpecies("dog")}>More Dogs</Button>
                        <Button variant="contained" onClick={() => onDecSpecies("dog")}
                          disabled={user.attributes?.attributes[1] < 1}>Less Dogs</Button>
                        <Button variant="contained" onClick={() => onIncSpecies("rab")}>More Rabbits</Button>
                        <Button variant="contained" onClick={() => onDecSpecies("rab")}
                          disabled={user.attributes?.attributes[2] < 1}>Less Rabbits</Button>
                      </Grid2>
                    </Grid2>
                  </Box>
                  <Box paddingTop={1}>
                    <Grid2 container spacing={2} alignItems="center">
                      <Grid2 xs={4} textAlign="right">
                        Color:
                      </Grid2>
                      <Grid2 xs={4} textAlign="center">
                        <Button variant="contained" onClick={() => onIncColor("white")}>More White</Button>
                        <Button variant="contained" onClick={() => onDecColor("white")}
                          disabled={user.attributes?.attributes[3] < 1}>Less White</Button>
                        <Button variant="contained" onClick={() => onIncColor("black")}>More Black</Button>
                        <Button variant="contained" onClick={() => onDecColor("black")}
                          disabled={user.attributes?.attributes[4] < 1}>Less Black</Button>
                        <Button variant="contained" onClick={() => onIncColor("brown")}>More Brown</Button>
                        <Button variant="contained" onClick={() => onDecColor("brown")}
                          disabled={user.attributes?.attributes[5] < 1}>Less Brown</Button>
                      </Grid2>
                    </Grid2>
                  </Box>
                  <Box paddingTop={1}>
                    <Grid2 container spacing={2} alignItems="center">
                      <Grid2 xs={4} textAlign="right">
                        Gender:
                      </Grid2>
                      <Grid2 xs={4} textAlign="center">
                        <Button variant="contained" onClick={() => onChangeGender(true)}>More Male</Button>
                        <Button variant="contained" onClick={() => onChangeGender(false)}>More Female</Button>
                      </Grid2>
                    </Grid2>
                  </Box>
                  <Box paddingTop={1}>
                    <Grid2 container spacing={2} alignItems="center">
                      <Grid2 xs={4} textAlign="right">
                        Age ({user.attributes?.attributes ? user.attributes.attributes[8] : "N/A"}):
                      </Grid2>
                      <Grid2 xs={4} textAlign="center">
                      <Button variant="contained" onClick={() => onChangeAge(false)}
                        disabled={user.attributes?.attributes[8] < 1}> Younger</Button>
                      <Button variant="contained" onClick={() => onChangeAge(true)}>Older</Button>
                      </Grid2>
                    </Grid2>
                  </Box>
                  <Box paddingTop={1}>
                    <Grid2 container spacing={2} alignItems="center">
                      <Grid2 xs={4} textAlign="center">
                        <Button variant="contained" onClick={() => onResetPref()}>Reset Preferences</Button>
                      </Grid2>
                    </Grid2>
                    
                  </Box>

                  <Box paddingTop={1}>
                    <Grid2 container spacing={2}>
                      {/* <Grid2 xs={4} textAlign="right"> *FOR TESTING. REMOVE IN PROD.* Current Preferences: </Grid2>
                      <Grid2 xs={8}>
                        {user.attributes && JSON.stringify(user.attributes)}
                      </Grid2> */}
                      <Box paddingTop={1}>
                        <Grid2 container spacing={2}>
                          <Grid2 xs={12}>
                            <Box sx={{ height: '150px' }}>
                              <canvas id="speciesChart"></canvas>
                            </Box>
                          </Grid2>
                          <Grid2 xs={12}>
                            <Box sx={{ height: '150px' }}>
                              <canvas id="colorChart"></canvas>
                            </Box>
                          </Grid2>
                          <Grid2 xs={12}>
                            <Box sx={{ height: '150px' }}>
                              <canvas id="genderChart"></canvas>
                            </Box>
                          </Grid2>
                        </Grid2>
                      </Box>
                    </Grid2>
                  </Box>
                </CardContent>
              </Card>
            </Grid2>
          )}
        </Grid2>
      </Box>
    </>
  );
}