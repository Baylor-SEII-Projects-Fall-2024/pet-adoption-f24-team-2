import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Card, CardMedia, CardContent, Button, AppBar, Toolbar } from '@mui/material';
import { Link } from '@mui/material';
import Carousel from 'react-bootstrap/Carousel';


const DashboardPage = () => {
    const [pets, setPets] = useState([]);
    const [events, setEvents] = useState([]);
    const [reviews, setReviews] = useState([]);

    // Simulated fetch calls to populate pets, events, and reviews
    useEffect(() => {
        setPets([
            {
                id: 1,
                name: 'Buddy',
                breed: 'Golden Retriever',
                age: 2,
                image: 'https://via.placeholder.com/150',
            },
            {
                id: 2,
                name: 'Whiskers',
                breed: 'Tabby Cat',
                age: 3,
                image: 'https://via.placeholder.com/150',
            },
        ]);

        setEvents([
            {
                id: 1,
                title: 'Weekend Adoption Fair',
                date: '2024-12-10',
                location: 'City Park',
            },
            {
                id: 2,
                title: 'Holiday Pet Party',
                date: '2024-12-20',
                location: 'Downtown Community Center',
            },
        ]);

        setReviews([
            {
                id: 1,
                description: 'Amazing experience! The team was so helpful, and I found my perfect companion.',
                reviewer: 'Sarah Johnson',
                rating: 5,
            },
            {
                id: 2,
                description: 'Great service and so many adorable pets to choose from!',
                reviewer: 'Mark Thompson',
                rating: 5,
            },
        ]);
    }, []);

    return (
        <Box>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" style={{ flexGrow: 1 }}>
                        Furry Friends, Inc.
                    </Typography>
                    <Button color="inherit" href="/login">
                        Login
                    </Button>
                </Toolbar>
            </AppBar>
            <Box textAlign="center" mt={3}>
                <img
                    src="/logo.png"
                    alt="Furry Friends Logo"
                    style={{ width: '300px', height: '300px', objectFit: 'contain' }}
                />
            </Box>
            <Box p={3} textAlign="center">
                <Typography variant="h4" gutterBottom>
                    Welcome to Furry Friends, Inc.
                </Typography>
                <Typography variant="body1">
                    Find your perfect furry friend and explore adoption events near you!
                </Typography>
            </Box>
            <Box p={3}>
                <Typography variant="h5" gutterBottom>
                    Matching Pets
                </Typography>
                <Grid container spacing={3}>
                    {pets.map((pet) => (
                        <Grid item xs={12} sm={6} md={4} key={pet.id}>
                            <Card>
                                <CardMedia
                                    component="img"
                                    height="150"
                                    image={pet.image}
                                    alt={pet.name}
                                />
                                <CardContent>
                                    <Typography variant="h6">{pet.name}</Typography>
                                    <Typography variant="body2">
                                        Breed: {pet.breed}
                                    </Typography>
                                    <Typography variant="body2">
                                        Age: {pet.age} years
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        fullWidth
                                        style={{ marginTop: '10px' }}
                                    >
                                        Adopt Me
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>
            <Box p={3}>
                <Typography variant="h5" gutterBottom>
                    Upcoming Adoption Events
                </Typography>
                {events.map((event) => (
                    <Box key={event.id} mb={2}>
                        <Typography variant="h6">{event.title}</Typography>
                        <Typography variant="body2">Date: {event.date}</Typography>
                        <Typography variant="body2">Location: {event.location}</Typography>
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

export default DashboardPage;
