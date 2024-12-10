import { useEffect, useState } from "react";
import { request, getUserID } from "@/axios_helper";
import Navbar from "@/components/Navbar";
import { Typography, Card, CardContent, Button, Grid2, Box, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import SnackbarNoti from "@/components/SnackbarNoti";
import Link from "next/link";
import Chart from 'chart.js/auto';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import RefreshIcon from '@mui/icons-material/Refresh';

export default function UserHomePage() {
  // state for user info and editing mode
  const [user, setUser] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [phone, setPhone] = useState();
  const [userType, setUserType] = useState();
  const [description, setDescription] = useState();
  const [streetAddress, setStreetAddress] = useState();
  const [city, setCity] = useState();
  const [state, setState] = useState();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("");

  // grab the user data when component loads
  useEffect( () => {
      request("GET", `/users/${getUserID()}`, null)
        .then((response) => {
          setUser(response.data)
          setName(response.data.name);
          setEmail(response.data.emailAddress);
          setPhone(response.data.phone);
          setUserType(response.data.role === "PET_OWNER" ? "Pet Owner" : "Adoption Center");
          setDescription(response.data.description);
          setStreetAddress(response.data.streetAddress);
          setCity(response.data.city);
          setState(response.data.state);
        }).catch((error) => {
          console.log(error);
        })
    
  }, [])
  
  // handlers for editing profile stuff
  function discardChanges(e) {
    e.preventDefault();
    setIsEditing(false);
    setName(user.name);
    setPhone(user.phone);
    setDescription(user.description);
    if( userType === "Adoption Center" ) {
      setStreetAddress(user.streetAddress);
      setCity(user.city);
      setState(user.state);
    }
    setSnackbarMessage("User information changes have been discarded!");
    setSnackbarSeverity("info");
    setSnackbarOpen(true);
  }

  function saveChanges(e) {
    e.preventDefault();
    if( userType == "Adoption Center" && 
      (city == "" || state == "" || streetAddress == "")) {
      setSnackbarMessage("Please ensure all fields are filled out!");
      setSnackbarSeverity("error");
      setSnackbarOpen(true)
      setCity(user.city)
      setState(user.state)
      setStreetAddress(user.streetAddress)
      return
    }
    setIsEditing(false);
    
    const newUserInfo = {
      emailAddress: user.emailAddress,
      role: user.role,
      name: name,
      streetAddress: streetAddress,
      city: city,
      state: state,
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
        setStreetAddress(response.data.streetAddress);
        setCity(response.data.city);
        setState(response.data.state);

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

  // form input handlers
  function onChangePhone(event) {
    setPhone(event.target.value);
  }

  function onChangeName(event) {
    setName(event.target.value);
  }

  function onChangeDescription(event) {
    setDescription(event.target.value);
  }

  // preference adjustment functions
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

  // reset preference functions
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

  // admin functions for test data
  function addRandomPets() {
    request("POST", `/pets/addTestPets/${getUserID()}`)
    .catch((error) => {
      console.log(error);
    })
  }

  function deleteAllPets() {
    request("DELETE", `/pets/all`)
    .catch((error) => {
      console.log(error);
    })
  }

  // notification stuff
  function handleSnackbarClose() {
    setSnackbarOpen(false);
  }

  function onIncBreed(breed) {
    request("POST", `/petrec/${getUserID()}/incBreed/${breed}`, null)
    .then(() => {
      request("GET", `/users/${getUserID()}`, null)
        .then((response) => {
          setUser(response.data);
        })
    })
  }

  function onDecBreed(breed) {
    request("POST", `/petrec/${getUserID()}/decBreed/${breed}`, null)
    .then(() => {
      request("GET", `/users/${getUserID()}`, null)
        .then((response) => {
          setUser(response.data);
        })
    })
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
              // grab the preference values from user attributes
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

  // Cat Breeds Chart
  useEffect(() => {
    const catBreedsCtx = document.getElementById('catBreedsChart')?.getContext('2d');
    
    if (catBreedsCtx && user.attributes?.attributes) {
      const catBreedsChart = new Chart(catBreedsCtx, {
        type: 'pie',
        data: {
          labels: ['Persian', 'Siamese', 'Other Cats'],
          datasets: [{
            data: [
              user.attributes.attributes[8],
              user.attributes.attributes[9],
              user.attributes.attributes[10]
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
              text: 'Cat Breed Preferences'
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

      return () => catBreedsChart.destroy();
    }
  }, [user.attributes?.attributes[8], user.attributes?.attributes[9], user.attributes?.attributes[10]]);

  // Dog Breeds Chart
  useEffect(() => {
    const dogBreedsCtx = document.getElementById('dogBreedsChart')?.getContext('2d');
    
    if (dogBreedsCtx && user.attributes?.attributes) {
      const dogBreedsChart = new Chart(dogBreedsCtx, {
        type: 'pie',
        data: {
          labels: ['Labrador', 'German Shepherd', 'Other Dogs'],
          datasets: [{
            data: [
              user.attributes.attributes[11],
              user.attributes.attributes[12],
              user.attributes.attributes[13]
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
              text: 'Dog Breed Preferences'
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

      return () => dogBreedsChart.destroy();
    }
  }, [user.attributes?.attributes[11], user.attributes?.attributes[12], user.attributes?.attributes[13]]);

  // Rabbit Breeds Chart
  useEffect(() => {
    const rabbitBreedsCtx = document.getElementById('rabbitBreedsChart')?.getContext('2d');
    
    if (rabbitBreedsCtx && user.attributes?.attributes) {
      const rabbitBreedsChart = new Chart(rabbitBreedsCtx, {
        type: 'pie',
        data: {
          labels: ['Holland Lop', 'Rex', 'Other Rabbits'],
          datasets: [{
            data: [
              user.attributes.attributes[14],
              user.attributes.attributes[15],
              user.attributes.attributes[16]
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
              text: 'Rabbit Breed Preferences'
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

      return () => rabbitBreedsChart.destroy();
    }
  }, [user.attributes?.attributes[14], user.attributes?.attributes[15], user.attributes?.attributes[16]]);

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
          {/* account details Card */}
          <Grid2 xs={12} sm={8} md={5} sx={{ minWidth: '400px' }}>
            <Card elevation={2}>
              {/* form for viewing/editing user details */}
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
                          <input value={name} 
                            onChange={onChangeName} 
                            required />
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
                          <input value={phone} 
                            onChange={onChangePhone} 
                            required
                            minLength={12}
                            maxLength={12} />
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
                          <textarea rows={4} 
                            value={description} 
                            onChange={onChangeDescription} />
                        ) : (
                          <span>{description}</span>
                        )}
                      </Grid2>
                    </Grid2>
                  </label>
                </Box>
                {/* special buttons for adoption centers */}
                {userType === "Adoption Center" && (
                  <Box paddingTop={1}>
                    <label>
                      <Grid2 container spacing={2}>
                        <Grid2 size={6}>
                          Street Address:{" "}
                        </Grid2>
                        <Grid2 size={6}>
                          {isEditing ? (
                            <input 
                              value={streetAddress} 
                              onChange={(e) => setStreetAddress(e.target.value)} 
                              required />
                          ) : (
                            <span>{streetAddress}</span>
                          )}
                        </Grid2>
                      </Grid2>
                    </label>
                  </Box>
                )}
                { userType === "Adoption Center" && (
                  <Box paddingTop={1}>
                      <label>
                        <Grid2 container spacing={2}>
                          <Grid2 size={6}>
                            City:{" "}
                          </Grid2>
                          <Grid2 size={6}>
                            {isEditing ? (
                              <input 
                                value={city} 
                                onChange={(e) => setCity(e.target.value)} 
                                required />
                            ) : (
                              <span>{city}</span>
                            )}
                          </Grid2>
                        </Grid2>
                      </label>
                    </Box> 
                )}
                { userType === "Adoption Center" && (   
                  <Box paddingTop={1}>
                    <label>
                      <Grid2 container spacing={2}>
                        <Grid2 size={6}>
                          State:{" "}
                        </Grid2>
                        <Grid2 size={6}>
                          {isEditing ? (
                            <input 
                              value={state} 
                              onChange={(e) => setState(e.target.value)} 
                              required />
                          ) : (
                            <span>{state}</span>
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
            <Box paddingTop={2} textAlign="center">
              <Link href="/ChangePassword">
                <Button variant="contained">Change password</Button>
              </Link>
            </Box>
            {userType === "Adoption Center" && (
              <Box paddingTop={2} textAlign="center">
                <Button variant="contained" onClick={addRandomPets}>Add 500 Random Test Pets</Button>
                <Button variant="contained" onClick={deleteAllPets}>Delete all pets</Button>
              </Box>
            )}
          </Grid2>

          {/* notification stuff */}
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
                  <Box variant="subtitle1" align="center" color="text.secondary" mb={2}>
                    Customize your pet matching preferences below
                  </Box>

                  {/* species preferences */}
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="h6" align="center" gutterBottom>Species Preferences</Typography>
                    <Grid2 container spacing={2} justifyContent="center">
                      <Grid2 xs={12} sm={4}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="subtitle2" gutterBottom>Cats</Typography>
                          <Button variant="contained" size="small" sx={{ m: 0.5 }} onClick={() => onIncSpecies("cat")}>+</Button>
                          <Button variant="contained" size="small" sx={{ m: 0.5 }} onClick={() => onDecSpecies("cat")}
                            disabled={user.attributes?.attributes[0] < 1}>-</Button>
                        </Box>
                      </Grid2>
                      <Grid2 xs={12} sm={4}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="subtitle2" gutterBottom>Dogs</Typography>
                          <Button variant="contained" size="small" sx={{ m: 0.5 }} onClick={() => onIncSpecies("dog")}>+</Button>
                          <Button variant="contained" size="small" sx={{ m: 0.5 }} onClick={() => onDecSpecies("dog")}
                            disabled={user.attributes?.attributes[1] < 1}>-</Button>
                        </Box>
                      </Grid2>
                      <Grid2 xs={12} sm={4}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="subtitle2" gutterBottom>Rabbits</Typography>
                          <Button variant="contained" size="small" sx={{ m: 0.5 }} onClick={() => onIncSpecies("rab")}>+</Button>
                          <Button variant="contained" size="small" sx={{ m: 0.5 }} onClick={() => onDecSpecies("rab")}
                            disabled={user.attributes?.attributes[2] < 1}>-</Button>
                        </Box>
                      </Grid2>
                    </Grid2>
                  </Box>

                  {/* color preferences */}
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="h6" align="center" gutterBottom>Color Preferences</Typography>
                    <Grid2 container spacing={2} justifyContent="center">
                      <Grid2 xs={12} sm={4}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="subtitle2" gutterBottom>White</Typography>
                          <Button variant="contained" size="small" sx={{ m: 0.5, bgcolor: 'rgba(255, 255, 255, 1)', color: 'black' }} onClick={() => onIncColor("white")}>+</Button>
                          <Button variant="contained" size="small" sx={{ m: 0.5, bgcolor: 'rgba(255, 255, 255, 1)', color: 'black' }} onClick={() => onDecColor("white")}
                            disabled={user.attributes?.attributes[3] < 1}>-</Button>
                        </Box>
                      </Grid2>
                      <Grid2 xs={12} sm={4}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="subtitle2" gutterBottom>Black</Typography>
                          <Button variant="contained" size="small" sx={{ m: 0.5, bgcolor: 'rgba(0, 0, 0, 1)' }} onClick={() => onIncColor("black")}>+</Button>
                          <Button variant="contained" size="small" sx={{ m: 0.5, bgcolor: 'rgba(0, 0, 0, 1)' }} onClick={() => onDecColor("black")}
                            disabled={user.attributes?.attributes[4] < 1}>-</Button>
                        </Box>
                      </Grid2>
                      <Grid2 xs={12} sm={4}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="subtitle2" gutterBottom>Brown</Typography>
                          <Button variant="contained" size="small" sx={{ m: 0.5, bgcolor: 'rgba(111, 78, 55, 1)' }} onClick={() => onIncColor("brown")}>+</Button>
                          <Button variant="contained" size="small" sx={{ m: 0.5, bgcolor: 'rgba(111, 78, 55, 1)' }} onClick={() => onDecColor("brown")}
                            disabled={user.attributes?.attributes[5] < 1}>-</Button>
                        </Box>
                      </Grid2>
                    </Grid2>
                  </Box>

                  {/* gender/age Section */}
                  <Box sx={{ mb: 4 }}>
                    <Grid2 container direction="column" alignItems="center" spacing={3}>
                      {/* gender preference */}
                      <Grid2 xs={12}>
                        <Typography variant="h6" align="center" gutterBottom>Gender Preference</Typography>
                        <Box sx={{ textAlign: 'center' }}>
                          <Button 
                            variant="contained" 
                            sx={{ 
                              m: 0.5,
                              minWidth: '120px'
                            }} 
                            onClick={() => onChangeGender(true)}
                          >
                            <span style={{ marginRight: '4px' }}>♂</span> Male
                          </Button>
                          <Button 
                            variant="contained" 
                            sx={{ 
                              m: 0.5,
                              minWidth: '120px'
                            }} 
                            onClick={() => onChangeGender(false)}
                          >
                            <span style={{ marginRight: '4px' }}>♀</span> Female
                          </Button>
                        </Box>
                      </Grid2>

                      {/* age preference */}
                      <Grid2 xs={12}>
                        <Typography variant="h6" align="center" gutterBottom>Age Preference</Typography>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="subtitle2" gutterBottom>
                            Current: {user.attributes?.attributes[17] === 0 ? "(None)" : user.attributes?.attributes[17]}
                          </Typography>
                          <Button 
                            variant="contained" 
                            sx={{ 
                              m: 0.5,
                              minWidth: '120px'
                            }} 
                            onClick={() => onChangeAge(false)}
                            disabled={user.attributes?.attributes[17] < 1}
                          >
                            -
                          </Button>
                          <Button 
                            variant="contained" 
                            sx={{ 
                              m: 0.5,
                              minWidth: '120px'
                            }} 
                            onClick={() => onChangeAge(true)}
                          >
                            +
                          </Button>
                        </Box>
                      </Grid2>
                    </Grid2>
                  </Box>

                  {/* breed preferences */}
                  <Box sx={{ mb: 4 }}>
                    {/* cat breeds accordion */}
                    <Accordion disableGutters>
                      <AccordionSummary 
                        expandIcon={<ExpandMoreIcon />}
                        sx={{
                          minHeight: '50px',
                          '&.Mui-expanded': {
                            minHeight: '50px',
                          }
                        }}
                      >
                        <Typography variant="h6">Cat Breeds</Typography>
                      </AccordionSummary>
                      <AccordionDetails sx={{ pt: 2, pb: 2 }}>
                        <Grid2 container spacing={2} justifyContent="center">
                          {[
                            { label: 'Persian', inc: () => onIncBreed("persian"), dec: () => onDecBreed("persian"), value: 8 },
                            { label: 'Siamese', inc: () => onIncBreed("siamese"), dec: () => onDecBreed("siamese"), value: 9 },
                            { label: 'Other', inc: () => onIncBreed("cat other"), dec: () => onDecBreed("cat other"), value: 10 }
                          ].map((breed) => (
                            <Grid2 xs={12} sm={4} key={breed.label}>
                              <Box sx={{ textAlign: 'center' }}>
                                <Typography variant="subtitle2" gutterBottom>{breed.label}</Typography>
                                <Button variant="contained" size="small" sx={{ m: 0.5 }} onClick={breed.inc}>+</Button>
                                <Button variant="contained" size="small" sx={{ m: 0.5 }} onClick={breed.dec}
                                  disabled={user.attributes?.attributes[breed.value] < 1}>-</Button>
                              </Box>
                            </Grid2>
                          ))}
                        </Grid2>
                        <Box sx={{ height: 200, mt: 3 }}>
                          <canvas id="catBreedsChart"></canvas>
                        </Box>
                      </AccordionDetails>
                    </Accordion>

                    {/* dog breeds accordion */}
                    <Accordion disableGutters>
                      <AccordionSummary 
                        expandIcon={<ExpandMoreIcon />}
                        sx={{
                          minHeight: '50px',
                          '&.Mui-expanded': {
                            minHeight: '50px',
                          }
                        }}
                      >
                        <Typography variant="h6">Dog Breeds</Typography>
                      </AccordionSummary>
                      <AccordionDetails sx={{ pt: 2, pb: 2 }}>
                        <Grid2 container spacing={2} justifyContent="center">
                          {[
                            { label: 'Labrador', inc: () => onIncBreed("labrador"), dec: () => onDecBreed("labrador"), value: 11 },
                            { label: 'German Shepherd', inc: () => onIncBreed("german shepherd"), dec: () => onDecBreed("german shepherd"), value: 12 },
                            { label: 'Other', inc: () => onIncBreed("dog other"), dec: () => onDecBreed("dog other"), value: 13 }
                          ].map((breed) => (
                            <Grid2 xs={12} sm={4} key={breed.label}>
                              <Box sx={{ textAlign: 'center' }}>
                                <Typography variant="subtitle2" gutterBottom>{breed.label}</Typography>
                                <Button variant="contained" size="small" sx={{ m: 0.5 }} onClick={breed.inc}>+</Button>
                                <Button variant="contained" size="small" sx={{ m: 0.5 }} onClick={breed.dec}
                                  disabled={user.attributes?.attributes[breed.value] < 1}>-</Button>
                              </Box>
                            </Grid2>
                          ))}
                        </Grid2>
                        <Box sx={{ height: 200, mt: 3 }}>
                          <canvas id="dogBreedsChart"></canvas>
                        </Box>
                      </AccordionDetails>
                    </Accordion>

                    {/* rabbit breeds accordion */}
                    <Accordion disableGutters>
                      <AccordionSummary 
                        expandIcon={<ExpandMoreIcon />}
                        sx={{
                          minHeight: '50px',
                          '&.Mui-expanded': {
                            minHeight: '50px',
                          }
                        }}
                      >
                        <Typography variant="h6">Rabbit Breeds</Typography>
                      </AccordionSummary>
                      <AccordionDetails sx={{ pt: 2, pb: 2 }}>
                        <Grid2 container spacing={2} justifyContent="center">
                          {[
                            { label: 'Holland Lop', inc: () => onIncBreed("holland lop"), dec: () => onDecBreed("holland lop"), value: 14 },
                            { label: 'Rex', inc: () => onIncBreed("rex"), dec: () => onDecBreed("rex"), value: 15 },
                            { label: 'Other', inc: () => onIncBreed("rabbit other"), dec: () => onDecBreed("rabbit other"), value: 16 }
                          ].map((breed) => (
                            <Grid2 xs={12} sm={4} key={breed.label}>
                              <Box sx={{ textAlign: 'center' }}>
                                <Typography variant="subtitle2" gutterBottom>{breed.label}</Typography>
                                <Button variant="contained" size="small" sx={{ m: 0.5 }} onClick={breed.inc}>+</Button>
                                <Button variant="contained" size="small" sx={{ m: 0.5 }} onClick={breed.dec}
                                  disabled={user.attributes?.attributes[breed.value] < 1}>-</Button>
                              </Box>
                            </Grid2>
                          ))}
                        </Grid2>
                        <Box sx={{ height: 200, mt: 3 }}>
                          <canvas id="rabbitBreedsChart"></canvas>
                        </Box>
                      </AccordionDetails>
                    </Accordion>
                  </Box>

                  {/* overall preferences */}
                  <Box sx={{ mt: 4 }}>
                    <Typography variant="h6" align="center" gutterBottom>Overall Preferences</Typography>
                    <Grid2 container spacing={3}>
                      <Grid2 xs={12} md={6}>
                        <Box sx={{ height: 200, mb: 3 }}>
                          <canvas id="speciesChart"></canvas>
                        </Box>
                      </Grid2>
                      <Grid2 xs={12} md={6}>
                        <Box sx={{ height: 200, mb: 3 }}>
                          <canvas id="colorChart"></canvas>
                        </Box>
                      </Grid2>
                      <Grid2 xs={12} md={6}>
                        <Box sx={{ height: 200, mb: 3 }}>
                          <canvas id="genderChart"></canvas>
                        </Box>
                      </Grid2>
                    </Grid2>
                  </Box>
                  {/* reset button */}
                  <Box sx={{ textAlign: 'center', mt: 3, mb: 4 }}>
                    <Button 
                      variant="contained" 
                      color="warning" 
                      onClick={() => onResetPref()}
                      startIcon={<RefreshIcon />}
                    >
                      Reset All Preferences
                    </Button>
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