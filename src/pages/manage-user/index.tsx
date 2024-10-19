import * as React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { renderEmail } from './cell-renderers/email';
import { renderAvatar } from './cell-renderers/avartar';
import { randomColor, randomPhoneNumber, randomEmail } from '@mui/x-data-grid-generator';

import { useEffect, useState } from "react"
import axiosInstance from "../../configs/axios"
import { GET_ALL_USER } from "../../configs/endPoint/login"
import { UserModel } from "../../models/user"
import axios from "axios"

import {
  Paper, Box, IconButton, Menu, MenuItem, Typography, Toolbar, InputBase, Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Checkbox,
  Chip,
  TableSortLabel,
  Drawer,
  FormControlLabel,
  TablePagination
} from '@mui/material';

import image from '../../assets/avatar.svg'

//icons
import SearchIcon from '@mui/icons-material/Search';
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import PanoramaFishEyeIcon from "@mui/icons-material/PanoramaFishEye";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import UseMainController from './controllers';


export default function DataTable() {

  const ctrl = UseMainController();

  const [auth, setAuth] = React.useState(true);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [rowsPerPage, setRowsPerPage] = React.useState(5); // RowPerPage
  const [page, setPage] = React.useState(0); // Page

  //ChangeTablePage
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  //ChangeRowsPerPage
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };


  //profile
  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  //checkbox
  //const [DataTableTest] = React.useState<RowData[]>(initialRows);
  const [selectedIds, setSelectedIds] = React.useState<number[]>([]);

  const handleCheckboxChange = (id: number) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((prevId) => prevId !== id);
      } else {
        return [...prev, id];
      }
    });
  };








  const [data, setData] = useState<UserModel[]>([])

  const handleGetData = async () => {
    try {
      const res = await axios.get('https://dms-backend-khlo.onrender.com/user/get-all')
      setData(res?.data?.data)

    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    handleGetData()
  }, [])







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
            <div style={{ fontSize: 14, color: '#838383' }}>User management</div>
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


      <TableContainer component={Paper} sx={{ height: 400, width: '100%', marginBottom: 10 }}>
        <table aria-label='simple table'>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  icon={<PanoramaFishEyeIcon sx={{ color: "gray" }} />}
                  checkedIcon={<CheckCircleIcon sx={{ color: "blue" }} />}
                  checked={selectedIds.length === data.length}
                  indeterminate={selectedIds.length > 0 && selectedIds.length < data.length}
                  onChange={() => {
                    if (selectedIds.length === data.length) {
                      setSelectedIds([]);
                    } else {
                      setSelectedIds(data.map(data => data.id));
                    }
                  }}

                />
              </TableCell>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Phone Number</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Company</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((user) => (
                <TableRow
                  key={user.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell padding="checkbox" >
                    <Checkbox
                      icon={<PanoramaFishEyeIcon sx={{ color: "gray" }} />}
                      checkedIcon={<CheckCircleIcon sx={{ color: "blue" }} />}
                      checked={selectedIds.includes(user.id)}
                      onChange={() => handleCheckboxChange(user.id)}
                    />
                  </TableCell>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.phone}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{null}</TableCell>
                  <TableCell>{user.company}</TableCell>
                  <TableCell>
                    <IconButton>
                      <MoreHorizIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </table>
        <TablePagination
          component="div"
          count={data.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 15]}
        />
      </TableContainer>




    </Box>

  );
}

/*
const DataTable = () => {

  const [data, setData] = useState<UserModel[]>([])

  const handleGetData = async () => {
    try {
      const res = await axios.get('https://dms-backend-khlo.onrender.com/user/get-all')
      setData(res?.data?.data)

    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    handleGetData()
  }, [])



  return (
    <Box>
      <div>
        <h1>User List</h1>
        {data.length > 0 ? (
          <ul>
            {data.map((user) => (
              <li key={user.id}> {/* Assuming each user has a unique 'id' }
                <p>Name: {user?.phone}</p> {/* Replace with actual user properties }
                <p>Email: {user.email}</p> {/* Replace with actual user properties }
              </li>
            ))}
          </ul>
        ) : (
          <p>No users found.</p>
        )}
      </div>
    </Box>
  )
}

export default DataTable*/