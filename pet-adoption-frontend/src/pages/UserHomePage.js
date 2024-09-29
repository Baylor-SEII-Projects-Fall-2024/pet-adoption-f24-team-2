import { retrieveUser } from "@/components/api/UserApiService"
import { useState } from "react";
import { getLoggedInEmail } from "@/axios_helper";

export default function UserHomePage() {
  const [user, setUser] = useState(null);

  const email = getLoggedInEmail();

  const loadUser = () => {
    retrieveUser(1)
      .then( response => {
        console.log(response)
        setUser(response.data)
      })
      .catch( error => console.log(error) );
  }
  return (
    <>
      <h1>User Profile Page</h1>
      <h2>Welcome {email}</h2>
      {user === null ? <button onClick={loadUser}>Load User</button> :
      <div>
        <div>Email Address: {user.emailAddress}</div>
        <div>Password: {user.password}</div>
        <div>Account Type: {user.userType}</div>
      </div>
      }
    </>
  )
}