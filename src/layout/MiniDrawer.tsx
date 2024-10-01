import { Box, CssBaseline, Divider, IconButton, List, Tooltip } from '@mui/material';
import { styled, Theme, CSSObject } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import LockIcon from '@mui/icons-material/Lock';
import NavItem from './components/NavItem';
import { useLocation } from 'react-router-dom';
import { COLLAPSED_SPACE, DRAWER_WIDTH, MENU_ITEM_LISTS } from './config';
import { useState } from 'react';

import Logo from '../assets/logo/JOB_LOGO.png'

const openedMixin = (theme: Theme): CSSObject => ({
  width: DRAWER_WIDTH,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(COLLAPSED_SPACE)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(COLLAPSED_SPACE)} + 1px)`,
  },
});

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: DRAWER_WIDTH,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  })
);

const MiniDrawer = () => {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [locked, setLocked] = useState(false);

  const handleDrawerOpen = () => !locked && !open && setOpen(true);
  const handleDrawerClose = () => !locked && open && setOpen(false);
  const toggleLock = () => setLocked(!locked);

  const currentPath = location.pathname;

  return (
    <Box sx={{ position: 'relative' }}>
      <CssBaseline />
      <Drawer 
        variant="permanent" 
        open={open}
        onMouseEnter={handleDrawerOpen}
        onMouseLeave={handleDrawerClose}
      >
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-evenly',
          alignItems: 'center', 
          py: 0.5, 
          px: 1
        }}>
          <Tooltip title={locked ? "Unlock drawer" : "Lock drawer"}>
            <IconButton onClick={toggleLock} size="small">
              {locked ? <LockIcon /> : <LockOpenIcon />}
            </IconButton>
          </Tooltip>
          <img height={70} width={70} src={Logo} alt="Freelancer" />
        </Box>
        <Divider />
        <List>
          {MENU_ITEM_LISTS.map((item: any, index: number) => (
            <NavItem 
              key={item.path} 
              item={item} 
              open={open} 
              active={currentPath === '' ? index === 0 : currentPath === item.path} 
            />
          ))}
        </List>
      </Drawer>
    </Box>
  );
};

export default MiniDrawer;