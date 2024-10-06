import { useEffect, useState } from "react";
import { request, getUserID } from "@/axios_helper";

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

  return (
    <>
      <h1>User Profile Page</h1>
      <h2>Welcome {email}</h2>
      
      <form id="userInformation">
        <div>
          Email Address: {email}
        </div>
        <div>
          Account Type: {userType}
        </div>
        <div>
          <label>
            Name:{" "} 
            {isEditing ? (
              <input
                value={name}
                onChange={onChangeName}
              />
            ) : (
              <span>{name}</span>
            )}

          </label>
        </div>
        <div>
          <label>
            Phone Number:{" "} {
              isEditing ? (
                <input 
                  value={phone}
                  onChange={onChangePhone}
                  />
              ) : (
                <span>{phone}</span>
              )
            }
          </label>
        </div>
        <div>
          <label>
            Description:{" "} {
              isEditing ? (
                <textarea
                  rows={4} 
                  value={description}
                  onChange={onChangeDescription}
                  />
              ) : (
                <span>{description}</span>
              )
            }
          </label>
        </div>
        {userType === "Adoption Center" &&
          <div>
            <label>
              Address:{" "} {
                isEditing ? (
                  <input 
                    value={address}
                    onChange={onChangeAddress}
                    />
                ) : (
                  <span>{address}</span>
                )
              }
            </label>
          </div>
        }
      </form>
      {isEditing ?
      <>
        <button form="userInformation" onClick={saveChanges}>Save</button>
        {" "}
        <button form="userInformation" onClick={discardChanges}>Cancel</button>
      </> :
      <button form="userInformation" onClick={startEditing}>Edit profile</button> }
    </>
  )
}