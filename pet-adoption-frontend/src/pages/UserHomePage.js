import { useEffect, useState } from "react";
import { getUser } from "@/axios_helper";

export default function UserHomePage() {
  const [user, setUser] = useState({});

  useEffect( () => {
    setUser(getUser());
  }, []) 

  return (
    <>
      <h1>User Profile Page</h1>
      <h2>Welcome {user.emailAddress}</h2>
      
      <div>
        <div>Name: {user.name}</div>
        <div>Email Address: {user.emailAddress}</div>
        <div>Phone Number: {user.phone}</div>
        <div>Account Type: {user.userType}</div>
        <div>Description: {user.description}</div>
        {user.userType === "Adoption Center" &&
          <div>Address: {user.address}</div>
        }
      </div>
    </>
  )
}