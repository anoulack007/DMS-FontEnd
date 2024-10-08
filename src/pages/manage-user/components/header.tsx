import React from 'react';
import { AppBar, Toolbar, Typography, Box, Avatar } from '@mui/material';

const Header: React.FC = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
        </Typography>
        <Box>
          <Avatar src="https://via.placeholder.com/150" alt="Admin" />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
