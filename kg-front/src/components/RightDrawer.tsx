import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const bull = (
  <Box
    component="span"
    sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
  >
    •
  </Box>
);

const card = (
  <React.Fragment>
    <CardContent>
      <Typography sx={{ fontSize: 30 }} color="text.secondary" gutterBottom>
        Overview
      </Typography>
      
    </CardContent>
    <CardActions>
      <Button size="small">Learn More</Button>
    </CardActions>
  </React.Fragment>
);

export default function RightCard() {
  return (
    <Box sx={{ position:'absolute', right: 5, top: 5}}>
      <Card variant="outlined" sx={{ minWidth: 250, minHeight: '95vh'}}>{card}</Card>
    </Box>
  );
}