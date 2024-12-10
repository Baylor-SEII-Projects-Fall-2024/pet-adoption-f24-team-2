import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Card, CardMedia, CardContent, Button, AppBar, Toolbar } from '@mui/material';
import Accordion from 'react-bootstrap/Accordion';
import Carousel from 'react-bootstrap/Carousel';
import StarIcon from '@mui/icons-material/Star';


const DashboardPage = () => {
  const [pets, setPets] = useState([]);
  const [events, setEvents] = useState([]);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    setPets([
      {
        id: 1,
        gender: 'Male',
        name: 'Jeff',
        breed: 'German Shepard',
        color: 'Brown',
        fur: '2',
        age: 5,
        image: '/german-shepard.jpg',
      },
      {
        id: 2,
        gender: 'Female',
        name: 'Katie',
        breed: 'Tabby',
        color: 'Orange',
        fur: '1',
        age: 3,
        image: '/tabby.jpg',
      },
      {
        id: 3,
        gender: 'Male',
        name: 'Bruce',
        breed: 'Clydesdale',
        color: 'Brown',
        fur: 'Short',
        age: 4,
        image: '/horse.png',
      },
    ]);

    setEvents([
      {
        id: 1,
        name: 'Waco Pet Party',
        description: 'Dogs, cats, birds...we have them all!',
        date: 'Thu, 05 Dec 2024 06:00:00 GMT',
        location: '19345 Baylor Ln, Waco TX',
      },
      {
        id: 2,
        name: 'Holiday Pet Party',
        description: 'Celebrate the holidays with our furry friends!',
        date: 'Fri, 20 Dec 2024 18:00:00 GMT',
        location: '3452 Alamo Dr, Dallas, TX',
      },
      {
        id: 3,
        name: 'Weekend Adoption Fair',
        description: 'Find your perfect pet companion!',
        date: 'Sat, 10 Dec 2024 10:00:00 GMT',
        location: '789 Maple Ln, Houston, TX',
      },
    ]);

    setReviews([
      {
        id: 1,
        description: 'Amazing experience! The team was so helpful, and I found my perfect companion.',
        reviewer: 'Carter Collins',
      },
      {
        id: 2,
        description: 'Great service and so many adorable pets to choose from!',
        reviewer: 'Luke Heard',
      },
      {
        id: 3,
        description: 'The process was smooth, and the staff was very supportive.',
        reviewer: 'Kyle Sumners',
      },
      {
        id: 4,
        description: 'I highly recommend Furry Friends for anyone looking for a pet!',
        reviewer: 'Oliver Liu',
      },
      {
        id: 5,
        description: 'An incredible organization with lots of love for the animals.',
        reviewer: 'Wesley Goyette',
      },
      {
        id: 6,
        description: 'I found my perfect pet thanks to the amazing team at Furry Friends.',
        reviewer: 'Afraz Iqbal',
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
            <Button color="inherit" href="/LoginPage">
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
            Welcome to Furry Friends!
          </Typography>
          <Typography variant="body1">
            Find your perfect furry friend and explore adoption events near you!
          </Typography>
        </Box>
        {/* Reviews Section */}
        <Box p={3} textAlign="center">
          <Typography variant="h5" gutterBottom>
            Reviews
          </Typography>
          <Carousel
              data-bs-theme="dark"
              style={{ maxWidth: '500px', margin: '0 auto' }}
              indicators
              interval={3000}
          >
            {reviews.map((review) => (
                <Carousel.Item key={review.id}>
                  <Box
                      p={3}
                      style={{
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                        backgroundColor: '#f9f9f9',
                      }}
                  >
                    <Typography variant="h6" style={{ fontSize: '1.5rem', fontStyle: 'italic', marginBottom: '10px' }}>
                      "{review.description}"
                    </Typography>
                    <Typography variant="subtitle1" style={{ marginBottom: '10px' }}>
                      - {review.reviewer}
                    </Typography>
                    <Box display="flex" justifyContent="center" alignItems="center" gap={0.5} style={{marginBottom: '20px'}}>
                      {[...Array(5)].map((_, index) => (
                          <StarIcon key={index} style={{ color: '#FFD700' }} />
                      ))}
                    </Box>
                  </Box>
                </Carousel.Item>
            ))}
          </Carousel>
        </Box>
      </Box>
  );
};

export default DashboardPage;