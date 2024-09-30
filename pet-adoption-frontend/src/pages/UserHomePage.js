import { useEffect, useState } from "react";
import { getUser } from "@/axios_helper";

export default function UserHomePage() {
  const [user, setUser] = useState({});

  useEffect( () => {
    setUser(getUser());
  }, []) 

  return (
    <>
      {console.log(user)}
      <h1>User Profile Page</h1>
      <h2>Welcome {user.emailAddress}</h2>
      {user === null ? <button onClick={getUser}>Load User</button> :
      <div>
        <div>Email Address: {user.emailAddress}</div>
        <div>Account Type: {user.userType}</div>
      </div>
      }
    </>
  )
}