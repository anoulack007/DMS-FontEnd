// @mui
import { Avatar, Box, MenuItem, Typography } from '@mui/material';
import ICON_ADMIN from '../../assets/icon/Ellipse 5.svg';
import MenuPopover from './menu-popover';
import { useState } from 'react';

// ----------------------------------------------------------------------

export default function AccountPopover() {
  const [openPopover, setOpenPopover] = useState<HTMLElement | null>(null);
  const handleClosePopover = () => {
    setOpenPopover(null);
  };

  return (
    <>
      <Avatar src={ICON_ADMIN} alt="Admin" sx={{ width: '50px', height: '50px' }} />

      <MenuPopover open={openPopover} onClose={handleClosePopover} sx={{ width: 200, p: 0 }}>
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography variant="subtitle2" noWrap>
            waiting...
          </Typography>
        </Box>
        <MenuItem sx={{ m: 1, color: 'red', fontWeight: 'bold' }}>Admin</MenuItem>
      </MenuPopover>
    </>
  );
}
