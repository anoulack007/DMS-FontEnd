import * as React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { renderEmail } from './cell-renderers/email';
import { renderAvatar } from './cell-renderers/avartar';
import { randomColor, randomPhoneNumber, randomEmail } from '@mui/x-data-grid-generator';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import Toolbar from '@mui/material/Toolbar';
import { red } from '@mui/material/colors';



const columns: GridColDef[] = [
  {
    field: 'avatar',
    headerName: 'Avatar',
    display: 'flex',
    renderCell: renderAvatar,
    valueGetter: (value, row) =>
      row.name == null || row.avatar == null
        ? null
        : { name: row.name, color: row.avatar },
    sortable: false,
    filterable: false,
  } as GridColDef<any, { color: string; name: string }>,
  { field: 'id', headerName: 'User ID', width: 150 },
  { field: 'name', headerName: 'Name', width: 250 },
  { field: 'phoneNumber', headerName: 'Phone Number', width: 150 },
  {
    field: 'email',
    headerName: 'Email',
    renderCell: renderEmail,
    width: 200,
  },
  {
    field: 'role', headerName: 'Role', width: 150,
  },
  {
    field: 'company',
    headerName: 'Companry',
    width: 250,
  },

];

const rows = [
  { avatar: randomColor(), id: 1, name: 'Jon', phoneNumber: randomPhoneNumber(), email: randomEmail(), role: 'admin', company: 'soutsaka' },
  { avatar: randomColor(), id: 2, name: 'Cersei', phoneNumber: randomPhoneNumber(), email: randomEmail(), role: 'admin', company: 'soutsaka' },
  { avatar: randomColor(), id: 3, name: 'Jaime', phoneNumber: randomPhoneNumber(), email: randomEmail(), role: 'admin', company: 'soutsaka' },
  { avatar: randomColor(), id: 4, name: 'Arya', phoneNumber: randomPhoneNumber(), email: randomEmail(), role: 'admin', company: 'soutsaka' },
  { avatar: randomColor(), id: 5, name: 'Daenerys', phoneNumber: randomPhoneNumber(), email: randomEmail(), role: 'admin', company: 'soutsaka' },
  { avatar: randomColor(), id: 6, name: 'null', phoneNumber: randomPhoneNumber(), email: randomEmail(), role: 'admin', company: 'soutsaka' },
  { avatar: randomColor(), id: 7, name: 'Ferrara', phoneNumber: randomPhoneNumber(), email: randomEmail(), role: 'admin', company: 'soutsaka' },
  { avatar: randomColor(), id: 8, name: 'Rossini', phoneNumber: randomPhoneNumber(), email: randomEmail(), role: 'admin', company: 'soutsaka' },
  { avatar: randomColor(), id: 9, name: 'Harvey', phoneNumber: randomPhoneNumber(), email: randomEmail(), role: 'admin', company: 'soutsaka' },
];

const paginationModel = { page: 0, pageSize: 5 };

export default function DataTable() {
  const [auth, setAuth] = React.useState(true);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  return (

    <Box>
      <Box sx={{ flexGrow: 1, bgcolor: 'white', width: '100%', height: 120 }}>
        <Toolbar>
          {auth && (
            <div>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >

              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleClose}>Profile</MenuItem>
                <MenuItem onClick={handleClose}>My account</MenuItem>
              </Menu>
            </div>
          )}
        </Toolbar>
      </Box>

      <Typography variant="h6" component="div" sx={{ flexGrow: 1, bgcolor: 'red', width: '100%', height: 120 }}>
        Manage User
      </Typography>

      <Paper sx={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{ pagination: { paginationModel } }}
          pageSizeOptions={[5, 10]}
          checkboxSelection
          sx={{ border: 0 }}
        />
      </Paper>
    </Box>

  );
}