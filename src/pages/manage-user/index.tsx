import * as React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { renderEmail } from './cell-renderers/email';
import { renderAvatar } from './cell-renderers/avartar';
import { randomColor, randomPhoneNumber, randomEmail } from '@mui/x-data-grid-generator';

import { Paper, Box, IconButton, Menu, MenuItem, Typography, Toolbar, InputBase,Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Checkbox,
  Chip,
  TableSortLabel,
  Drawer, } from '@mui/material';

import image from '../../assets/avatar.svg'

//icons
import SearchIcon from '@mui/icons-material/Search';


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
  { field: 'name', headerName: 'Name', width: 200 },
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
    width: 150,
  }, {
    field: 'action',
    headerName: 'Action',
    width: 150,
  }

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

      <Box sx={{ flexGrow: 1, bgcolor: 'white', width: '100%', height: 74, borderRadius: 3 }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          </Typography>
          {auth && (
            <div style={{ marginTop: 10 }}>
              admin-1
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <img src={image} alt="image   " />
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


      <Box sx={{ flexGrow: 1, width: '100%', height: 89 }}>
        <Toolbar>
          <Typography variant="h5" component="div" sx={{ flexGrow: 1, color: '#838383', marginTop: 1 }}>
          User management
            <div style={{fontSize: 14, color: '#838383'}}>User management</div>
          </Typography>
          <Paper
            component="form"
            sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 300, borderRadius: 6, marginTop: 3 }}
          >
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              placeholder="Search"
              inputProps={{ 'aria-label': 'search' }}
            />

            <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
              <SearchIcon />
            </IconButton>
            
          </Paper>
        </Toolbar>
      </Box>


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