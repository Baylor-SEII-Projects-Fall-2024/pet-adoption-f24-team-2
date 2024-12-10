import React, { useEffect } from "react";
import { useState } from "react";
import { TextField, Typography, Grid, Select, MenuItem, InputLabel, FormControl, Button, Menu, Grid2 } from "@mui/material";
import Navbar from "@/components/Navbar";
import { request, getUserID } from "@/axios_helper";
import Router from "next/router";
import { useRouter } from "next/router";
import { textAlign } from "@mui/system";
import SnackbarNoti from "@/components/SnackbarNoti";
export default function AdoptionApplicationPage() {
  const [user, setUser] = useState({});
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [phone, setPhone] = useState();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("");
  const router = useRouter();
  const { petId } = router.query;
  const[formData, setFormData] = useState({
    address: "",
    city: "",
    occupation: "",
    familyMembers: [
      { name: "", age: "", relation: ""},
      { name: "", age: "", relation: ""},
      { name: "", age: "", relation: ""},
    ],
    childrenCount: 0,
    homeType: "",
  });

  useEffect(() => {
    request("GET", `/users/${getUserID()}`, null)
      .then((response) => {
        setUser(response.data)
        setName(response.data.name)
        setEmail(response.data.emailAddress)
        setPhone(response.data.phone)
      }).catch((error) => {
        console.log(error);
      })
    }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value});
  };

  const handleFamilyMemberChange = (index, field, value) => {
    const updatedFamilyMembers = [...formData.familyMembers];
    updatedFamilyMembers[index][field] = value;
    setFormData({...formData, familyMembers: updatedFamilyMembers});
  };

  function handleSnackbarClose() {
    setSnackbarOpen(false);
  };

  function handleSubmit(e) {
    e.preventDefault();
    let epochTime = (new Date()).getTime();
    const adoptionData = {
      userId: getUserID(),
      petId: petId,
      message: "\nName: " + name + "\nEmail Address: " + email +
        "\nPhone Number: " + phone + "\nHome Address: " + formData.address + ", " + formData.city + "\nOccupation: " + formData.occupation +
        "\nNumber of Children in Household: " + formData.childrenCount + "\nType of Home: " + formData.homeType,
      read: false,
      createdAt: epochTime
    }
    request("POST", `/notifications`, adoptionData)
      .then(() => {
        console.log(adoptionData);
        setMessage("");
        setOpen(false);
      })
      .catch((error) => {
        console.log(error);
      });
    setSnackbarMessage("Adoption form sent!");
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
    console.log(snackbarMessage, snackbarSeverity, snackbarOpen);
  }


  return (
    <>
      <Navbar user={user}/>
      <div style={{ padding: "20px", fontFamily: "Arial, sans-serif"}}>
        <Typography variant="h4" align="center" gutterBottom>Pet Adoption Form</Typography>
        <form onSubmit={handleSubmit} style={{ maxWidth: "600px", margin: "0 auto"}}>
        <div>
            <label>
              Name:
              <div style={{ display: "flex", gap: "10px"}}>
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={name}
                  required
                  style={{ flex: 1,  width: "100%", paddingTop: "5px", paddingBottom: "5px" }}
                />
              </div>
            </label>
          </div>
          <div>
            <label>
              Email Address:
              <input
                type="text"
                name="email"
                value={email}
                required
                style={{ width: "100%", paddingTop: "5px", paddingBottom: "5px" }}
              />
            </label>
          </div>
          <div>
            <label>
              Phone Number:
              <input
                type="text"
                name="phone"
                placeholder="###-###-####"
                value={phone}
                required
                style={{ width: "100%", paddingTop: "5px", paddingBottom: "5px" }}
              />
            </label>
          </div>
          <div>
            <label>
              Home Address:
              <input
                type="text"
                name="address"
                placeholder="111 Baylor Way"
                value={formData.address}
                onChange={handleInputChange}
                required
                style={{ width: "100%", paddingTop: "5px", paddingBottom: "5px" }}
              />
            </label>
          </div>
          <div>
            <label>
              City:
              <input
                type="text"
                name="city"
                placeholder="Waco"
                value={formData.city}
                onChange={handleInputChange}
                required
                style={{ width: "100%", paddingTop: "5px", paddingBottom: "5px" }}
              />
            </label>
          </div>
          <div>
            <label>
              Occupation:
              <input
                type="text"
                name="occupation"
                placeholder="Occupation"
                value={formData.occupation}
                onChange={handleInputChange}
                required
                style={{ width: "100%", paddingTop: "5px", paddingBottom: "5px" }}
              />
            </label>
          </div>
          <h2 style={{ textAlign: "center", fontSize: "large", paddingTop: "10px" }}>Adult's In Household</h2>
          {formData.familyMembers.map((member, index) => (
            <div key={index}>
              <label>
                Name:
                <input
                  type="text"
                  value={member.name}
                  onChange={(e) => handleFamilyMemberChange(index, "name", e.target.value)}
                  style={{ paddingTop: "5px", paddingLeft: "5px", paddingRight: "5px" }}
                />
              </label>
              <label>
                Age:
                <input
                  type="text"
                  value={member.age}
                  onChange={(e) => handleFamilyMemberChange(index, "age", e.target.value)}
                  style={{ paddingTop: "5px", paddingLeft: "5px", paddingRight: "5px" }}
                />
              </label>
              <label>
                Relation:
                <input
                  type="text"
                  value={member.relation}
                  onChange={(e) => handleFamilyMemberChange(index, "relation", e.target.value)}
                  style={{ paddingTop: "5px", paddingLeft: "5px" }}
                />
              </label>
            </div>
          ))}
          <label>
              Number of Children in Household:
              <input
                type="number"
                name="childrenCount"
                placeholder="0"
                value={formData.childrenCount}
                onChange={handleInputChange}
                required
                style={{ width: "100%", paddingTop: "5px", paddingBottom: "5px" }}
              />
            </label>
            <label>
              Type of Home:
              <select name="homeType" value={formData.homeType} onChange={handleInputChange}>
                <option value="">Select</option>
                <option value="house">House</option>
                <option value="townHome">Town Home</option>
                <option value="apartment">Apartment</option>
                <option value="condo">Condo</option>
              </select>
            </label>
            <div></div>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center"}}>
              <Button variant="contained" onClick={handleSubmit}>Submit</Button>
            </div>
        </form>
        <SnackbarNoti
              open={snackbarOpen}
              severity={snackbarSeverity}
              message={snackbarMessage}
              onClose={handleSnackbarClose}
            />
      </div>
    </>
  )
}