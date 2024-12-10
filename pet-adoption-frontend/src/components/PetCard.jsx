import { useEffect, useState } from "react";
import { request, getUserID } from "@/axios_helper";
import { Dialog, DialogContent, DialogActions } from "@mui/material";
import { Typography, Card, CardContent, Button, Grid2, Box } from "@mui/material";
import SnackbarNoti from "./SnackbarNoti";
import { getPetImage } from "@/utils/petImageHelper";

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

    // helper function to determine breed based on species and breed attributes
    const getBreed = () => {
        if (!bigattributes || !bigattributes.attributes) return "Unknown";
        
        const attrs = bigattributes.attributes;
        
        // check cat breeds (9-11)
        if (attrs[0] > 0) {
            if (attrs[8] > 0) return "Persian";
            if (attrs[9] > 0) return "Siamese";
            if (attrs[10] > 0) return "Other";
        }
        // check dog breeds (12-14)
        else if (attrs[1] > 0) {
            if (attrs[11] > 0) return "Labrador";
            if (attrs[12] > 0) return "German Shepherd";
            if (attrs[13] > 0) return "Other";
        }
        // check rabbit breeds (15-17)
        else if (attrs[2] > 0) {
            if (attrs[14] > 0) return "Holland Lop";
            if (attrs[15] > 0) return "Rex";
            if (attrs[16] > 0) return "Other";
        }
        return "Unknown";
    };

    // create new attributes array with breed after species
    const displayAttributes = attributes ? [
        attributes[0],  // species
        getBreed(),    // breed
        ...attributes.slice(1)  // rest of the attributes
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

    console.log('Pet Details:', {
        id,
        species: attributes[0],
        color: attributes[1],
        allAttributes: attributes
    });

    // Use the string attributes directly since they're already in the correct format
    const species = attributes[0];  // "Dog"
    const color = attributes[1];    // "Brown"

    return (
        <div className="petcard" style={{ 
            width: '350px',
            margin: 'auto'
        }}>
            <img 
                src={getPetImage(id, species, color)}
                alt={`${color} ${species}`}
                style={{
                    width: '100%',
                    height: '250px',
                    objectFit: 'cover'
                }}
            />
            <h2 style={{ fontSize: '1.5rem', margin: '1rem 0' }}>{name}</h2>
            <div style={{ padding: '0 1rem 1rem' }}>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Attributes:</h3>
                {displayAttributes && displayAttributes.length > 0 ? (
                    displayAttributes.map((attribute, index) => (
                        <p key={index}>
                            <strong>{attributeNames[index]}:</strong> {attribute}
                        </p>
                    ))
                ) : (
                    <p>No attributes available</p>
                )}
                <Grid2 item xs={4} textAlign="center" sx={{ mt: 2 }}>
                    <Button variant="contained" onClick={() => onLike(bigattributes, setSnackbarMessage, setSnackbarOpen, setSnackbarSeverity)} sx={{ mr: 1 }}>Like</Button>
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
