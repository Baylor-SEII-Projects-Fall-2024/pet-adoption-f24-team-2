import { useEffect, useState } from "react";
import { request, getUserID } from "@/axios_helper";
import Navbar from "@/components/Navbar";
import { Typography, Card, CardContent, Button, Grid2, Box } from "@mui/material";

function onLike(attributes) {
    request("POST", `/petrec/${getUserID()}/likePet`, attributes)
        .catch((error) => {
            console.log(error);
        });
}

function PetCard({ name, attributes, bigattributes }) {
    // attribute labels for each attribute index
    const attributeNames = [
        "Species",
        "Color",
        "Gender",
        "Age"
    ];

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
                  <Button variant="contained" onClick={() => onLike(bigattributes)}>Like</Button>
                </Grid2>
            </div>
        </div>
    );
}

export default PetCard;
