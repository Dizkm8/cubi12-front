import React from 'react';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import { AppBar, Toolbar, Box, Link, Typography } from '@mui/material';

const Navbar: React.FC = () => {
  return (
    <AppBar position="fixed" sx={{ backgroundColor: '#1C478F', height: '92px' }}>
      <Toolbar>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', height: '100%' }}>
          {/* Logo*/}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {/* Logo image */}
            <IconButton sx={{ height: '92px', marginRight: 2 }}>
              <Avatar src='..\static\images\logo.png' sx={{ width: 74, height: 74 }} />
            </IconButton>
            {/* Logo text */}
            <Typography variant="h5" sx={{ fontSize: 28, color: 'white', fontWeight: 'mixed', font: 'Raleway' }}>CUBI12</Typography>
          </Box>
          {/* Navbar items */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Link href="home" variant="h6" color="textPrimary" sx={{ fontSize: 28, color: 'white', marginRight: 4 }}>Inicio</Link>
            <Link href="CF" variant="h6" color="textPrimary" sx={{ fontSize: 28, color: 'white', marginRight: 4 }}>Malla Interactiva</Link>
            <Link href="My progress" variant="h6" color="textPrimary" sx={{ fontSize: 28, color: 'white', marginRight: 4 }}>Mi Progreso</Link>
            <AccountCircleIcon sx={{ color: 'white', fontSize: 45 }} />
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
