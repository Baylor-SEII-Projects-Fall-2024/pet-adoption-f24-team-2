import { useEffect, useState } from "react";
import { getUser} from "@/axios_helper";

export default function UserHomePage() {
  const user = getUser();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [phone, setPhone] = useState();
  const [userType, setUserType] = useState();
  const [description, setDescription] = useState();
  const [address, setAddress] = useState();

  useEffect( () => {
    setName(user.name);
    setEmail(user.emailAddress);
    setPhone(user.phone);
    setUserType(user.userType);
    setDescription(user.description);
    setAddress(user.address);
  }, [])
  
  function discardChanges(e) {
    e.preventDefault();
    setIsEditing(false);
    setName(user.name);
    setEmail(user.emailAddress);
    setPhone(user.phone);
    setUserType(user.userType);
    setDescription(user.description);
    setAddress(user.address);
  }

  function saveChanges(e) {
    e.preventDefault();
    setIsEditing(false);
  }

  function startEditing(e) {
    e.preventDefault();
    setIsEditing(true);
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
                  value={phone}/>
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
                <input 
                  value={description}/>
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
                    value={address}/>
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