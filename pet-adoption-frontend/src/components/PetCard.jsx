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
        "Breed",
        "Color",
        "Gender",
        "Age"
    ];
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("");

    // Helper function to determine breed based on species and breed attributes
    const getBreed = () => {
        if (!bigattributes || !bigattributes.attributes) return "Unknown";
        
        const attrs = bigattributes.attributes;
        console.log("Breed detection - attributes:", attrs); // Debug log
        
        // Check cat breeds (indices 9-11)
        if (attrs[0] > 0) {
            if (attrs[9] > 0) return "Persian";
            if (attrs[10] > 0) return "Siamese";
            if (attrs[11] > 0) return "Other";
        }
        // Check dog breeds (indices 12-14)
        else if (attrs[1] > 0) {
            if (attrs[12] > 0) return "Labrador";
            if (attrs[13] > 0) return "German Shepherd";
            if (attrs[14] > 0) return "Other";
        }
        // Check rabbit breeds (indices 15-17)
        else if (attrs[2] > 0) {
            if (attrs[15] > 0) return "Holland Lop";
            if (attrs[16] > 0) return "Rex";
            if (attrs[17] > 0) return "Other";
        }
        return "Unknown";
    };

    // Create new attributes array with breed after species
    const displayAttributes = attributes ? [
        attributes[0],  // Species
        getBreed(),    // Breed
        ...attributes.slice(1)  // Rest of the attributes
    ] : [];

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
                {displayAttributes && displayAttributes.length > 0 ? (
                    displayAttributes.map((attribute, index) => (
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
