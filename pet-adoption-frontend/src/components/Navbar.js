import { AppBar, Toolbar, Button, Collapse } from "@mui/material";
import { useState } from "react";
import { getUserID } from "@/axios_helper";

export default function Navbar() {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [user, setUser] = useState({});

  useEffect( () => {
    request("GET", `/users/${getUserID()}`, null)
      .then((response) => {
        setUser(response.data)
      }).catch((error) => {
        console.log(error);
      })
  }, []);

  function toggleDrawer(opened) {
    setIsNavOpen(opened);
  }

  const DrawerList = (user.userType === "Adoption_Center")

  return (
    <div>
      <Button onClick={toggleDrawer(true)}>Open nav</Button>
      <Drawer open={isNavOpen} onClose={toggleDrawer(false)}>

      </Drawer>
    </div>
  )
}