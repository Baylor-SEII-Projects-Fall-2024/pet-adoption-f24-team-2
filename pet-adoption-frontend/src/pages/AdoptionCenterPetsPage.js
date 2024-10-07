import { request, getUserID } from "@/axios_helper"
import { useState, useEffect } from "react";


export default function AdoptionCenterPetsPage() {
  const [ user, setUser ] = useState({});
  
  useEffect( () => {
    request("GET", `/users/${getUserID()}`, null)
      .then((response) => {
        setUser(response.data)
      }).catch((error) => {
        console.log(error);
      })
  
}, [])

  return (
    <>
      <h1>Welcome to your pets {user.name}!</h1>
    </>
  )
}