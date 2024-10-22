import React from "react";
import { Card, CardContent, Typography, Button } from "@mui/material";

function AdoptionCenterDisplayCard(props) {
    const center = props.center;

    return (
        <Card elevation={3}>
            <CardContent>
                <Typography>
                    Adoption Center: {center.name}
                </Typography>
                <Typography>
                    Address: {center.address}
                </Typography>
                <Typography>
                    Phone Number: {center.phone}
                </Typography>
                <Typography>
                    Email Address: {center.emailAddress}
                </Typography>
                <Typography>
                    Adoption Center Description: {center.description}
                </Typography>
                <Button variant="contained" onClick={() => props.onFindCenterEvents(center.id)}>
                    View Events
                </Button>
            </CardContent>
        </Card>
    );
}

export default function AdoptionCenterDisplay(props) {
    const centers = props.centers;

    return (
        <>
          {centers.map((center) => (
            <AdoptionCenterDisplayCard key={center.id} center={center} onFindCenterEvents={props.onFindCenterEvents}/>
          ))}
        </>
    );
}