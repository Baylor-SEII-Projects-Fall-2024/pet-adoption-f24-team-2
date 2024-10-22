import { ListItemIcon, Button, ListItemText, List, ListItem, ListItemButton, Box, Drawer, AppBar, IconButton, Toolbar } from "@mui/material";
import { useState } from "react";
import { Menu } from "@mui/icons-material";
import Router from 'next/router';
import { clearUser, clearToken } from "@/axios_helper";

export default function Navbar({ user }) {
  const [isNavOpen, setIsNavOpen] = useState(false);

  function toggleDrawer(opened) {
    setIsNavOpen(opened);
  }

  function logout() {
    clearUser();
    clearToken();
    Router.push("/");
  }

  const adoptionCenterList = (
    <List>
      <ListItem key="Home">
        <ListItemButton onClick={() => Router.push("UserHomePage")}>
          <ListItemText primary="Home"/>
        </ListItemButton>
      </ListItem>
      <ListItem key="Pets">
        <ListItemButton onClick={() => Router.push("/AdoptionCenterPetsPage")}>
          <ListItemText primary="Pets"/>
        </ListItemButton>
      </ListItem>
      <ListItem key="Adoption Events">
        <ListItemButton onClick={() => Router.push("/AdoptionEventsPage")}>
          <ListItemText primary="Adoption Events"/>
        </ListItemButton>
      </ListItem>
    </List>
  )

  const userList = (
    <List>
      <ListItem key="Home">
        <ListItemButton onClick={() => Router.push("UserHomePage")}>
          <ListItemText primary="Home"/>
        </ListItemButton>
      </ListItem>
      <ListItem key="Adopt">
        <ListItemButton onClick={() => Router.push("/PetRecommendationPage")}>
          <ListItemText primary="Adopt A Pet"/>
        </ListItemButton>
      </ListItem>
      <ListItem key="AdoptionCenters">
        <ListItemButton onClick={() => Router.push("AdoptionCentersPage")}>
          <ListItemText primary="Adoption Centers"/>
        </ListItemButton>
      </ListItem>
    </List>
  )

  const drawerItems = (user.role === "ADOPTION_CENTER" ? 
    adoptionCenterList : userList);
  

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation" onClick={() => toggleDrawer(false)}>
        {drawerItems}
    </Box>
  )

  return (
    <div>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              onClick={() => toggleDrawer(true)}>
              <Menu />
            </IconButton>
            <Button color="inherit" sx={{ marginLeft: "auto" }} onClick={logout}>Logout</Button>
          </Toolbar>
        </AppBar>
      </Box>
      <Drawer open={isNavOpen} onClose={() => toggleDrawer(false)}>
        {DrawerList}
      </Drawer>
    </div>
  )
}