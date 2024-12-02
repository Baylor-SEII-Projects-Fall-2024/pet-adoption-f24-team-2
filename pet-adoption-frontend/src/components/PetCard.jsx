import { useEffect, useState } from "react";
import { request, getUserID } from "@/axios_helper";
import { Dialog, DialogContent, DialogActions } from "@mui/material";
import { Typography, Card, CardContent, Button, Grid2, Box } from "@mui/material";
import SnackbarNoti from "./SnackbarNoti";

function onLike(attributes, setSnackbarMessage, setSnackbarOpen, setSnackbarSeverity) {
    request("POST", `/petrec/${getUserID()}/likePet`, attributes)
        .then(() => {
          setSnackbarMessage("Pet liked!");
          setSnackbarSeverity("success");
          setSnackbarOpen(true);
        })
        .catch((error) => {
            console.log(error);
        });
}

function PetCard({ id, name, attributes, bigattributes }) {
    // attribute labels for each attribute index
    const [ message, setMessage ] = useState("");
    const [ open, setOpen ] = useState(false);
    const attributeNames = [
        "Species",
        "Color",
        "Gender",
        "Age"
    ];
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("");

    function onChangeMessage(e) {
      setMessage(e.target.value);
    }

    function handleOpen() {
      setOpen(true);
    }

    function handleClose() {
      setOpen(false);
    }

    function handleSnackbarClose() {
      setSnackbarOpen(false);
    }

    function handleSubmit(e) {
      e.preventDefault();
      let epochTime = (new Date()).getTime();
      let notif = {
        userId: getUserID(),
        petId: id,
        message: message,
        read: false,
        createdAt: epochTime,
      }
      request("POST", `/notifications`, notif)
        .then(() => {
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
        <div className="petcard">
            <img src="https://via.placeholder.com/150" alt="picture" />
            <h2>{name}</h2>
            <div>
                <h3>Attributes:</h3>
                {attributes && attributes.length > 0 ? (
                    attributes.map((attribute, index) => (
                        <p key={index}>
                            <strong>{attributeNames[index]}:</strong> {attribute}
                        </p>
                    ))
                ) : (
                    <p>No attributes available</p>
                )}
                <Grid2 item xs={4} textAlign="center">
                  <Button variant="contained" onClick={() => onLike(bigattributes, setSnackbarMessage, setSnackbarOpen, setSnackbarSeverity)}>Like</Button>
                  <Button variant="contained" onClick={handleOpen}>Adopt</Button>
                </Grid2>
            </div>
            <Dialog
              open={open}
              onClose={handleClose}
              component="form"
              >
              <DialogContent>
                <Typography>Message:</Typography>
                <textarea
                  value={message}
                  onChange={onChangeMessage}
                  required
                ></textarea>
              </DialogContent>
              <DialogActions>
                <Button variant="contained" onClick={handleSubmit}>Send</Button>
              </DialogActions>
            </Dialog>
            <SnackbarNoti
              open={snackbarOpen}
              severity={snackbarSeverity}
              message={snackbarMessage}
              onClose={handleSnackbarClose}
            />
        </div>
    );
}

export default PetCard;
