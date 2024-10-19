import { ADD_USER_PATH } from "../../routes/paths";

import {
  Paper, Box, IconButton, Menu, MenuItem, Typography, Toolbar, InputBase, Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  TablePagination,
  Button,
} from '@mui/material';

import image from '../../assets/avatar.svg';

//icons
import SearchIcon from '@mui/icons-material/Search';
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import PanoramaFishEyeIcon from "@mui/icons-material/PanoramaFishEye";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import UseMainController from './controllers';
import AddIcon from '@mui/icons-material/Add';

//Component
import CustomMenu from './components/custom-menu';


export default function DataTable() {
  const ctrl = UseMainController();
  const open = Boolean(ctrl?.anchorEl);

  return (
    <Box>
      {/* Profile Menu */}
      <Box sx={{ flexGrow: 1, bgcolor: 'white', width: '100%', height: 74, borderRadius: 3 }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          </Typography>
          {ctrl?.auth && (
            <div style={{ marginTop: 10 }}>
              admin-1
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={ctrl?.handleProfileMenu}
                color="inherit"
              >
                <img src={image} alt="avatar" />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={ctrl?.anchorElProfile}  // ใช้ anchorElProfile สำหรับโปรไฟล์
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(ctrl?.anchorElProfile)}
                onClose={ctrl?.handleCloseProfileMenu}
              >
                <MenuItem onClick={ctrl?.handleCloseProfileMenu}>Profile</MenuItem>
                <MenuItem onClick={ctrl?.handleCloseProfileMenu}>My account</MenuItem>
              </Menu>
            </div>
          )}
        </Toolbar>
      </Box>

      {/* Add User & Search */}
      <Box sx={{ flexGrow: 1, width: '100%', height: 89 }}>
        <Toolbar>
          <Typography variant="h5" component="div" sx={{ flexGrow: 1, color: '#838383', marginTop: 1 }}>
            <Button onClick={() => ctrl?.handleAddUserClick(ADD_USER_PATH)} variant="contained" startIcon={<AddIcon />}>
              Add User
            </Button>
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

      {ctrl?.selectedIds.length > 0 && (
        <CustomMenu
          selectedCount={ctrl?.selectedIds.length}
        />
      )}

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "row",
          gap: 2,
          width: "100%",
        }}
      ></Box>

      

      {/* DataTable */}
      <TableContainer component={Paper} sx={{ height: 400, width: '100%', marginBottom: 10 }}>
        <Table aria-label="simple table">  {/* ใช้ Table */}
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  icon={<PanoramaFishEyeIcon sx={{ color: "gray" }} />}
                  checkedIcon={<CheckCircleIcon sx={{ color: "blue" }} />}
                  checked={ctrl?.selectedIds.length === ctrl?.data.length}
                  indeterminate={ctrl?.selectedIds.length > 0 && ctrl?.selectedIds.length < ctrl?.data.length}
                  onChange={() => {
                    if (ctrl?.selectedIds.length === ctrl?.data.length) {
                      ctrl?.setSelectedIds([]);
                    } else {
                      ctrl?.setSelectedIds(ctrl?.data.map(data => data.id));
                    }
                  }}
                />
              </TableCell>
              <TableCell>Username</TableCell>
              <TableCell>User ID</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Company</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ctrl?.data
              .slice(ctrl?.page * ctrl?.rowsPerPage, ctrl?.page * ctrl?.rowsPerPage + ctrl?.rowsPerPage)
              .map((user) => (
                <TableRow
                  key={user.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      icon={<PanoramaFishEyeIcon sx={{ color: "gray" }} />}
                      checkedIcon={<CheckCircleIcon sx={{ color: "blue" }} />}
                      checked={ctrl?.selectedIds.includes(user.id)}
                      onChange={() => ctrl?.handleCheckboxChange(user.id)}
                    />
                  </TableCell>
                  <TableCell>{user?.username}</TableCell>
                  <TableCell>{user?.userId}</TableCell>
                  <TableCell>{user?.phoneNumber}</TableCell>
                  <TableCell>{user?.email}</TableCell>
                  <TableCell>{null}</TableCell>
                  <TableCell>{user?.company}</TableCell>
                  <TableCell>
                    <IconButton onClick={ctrl?.handleActionClick}>
                      <MoreHorizIcon />
                    </IconButton>
                    <Menu
                      id="demo-positioned-menu"
                      aria-labelledby="demo-positioned-button"
                      anchorEl={ctrl?.anchorEl}  // ใช้ anchorEl สำหรับ Action Menu
                      open={open}
                      onClose={ctrl?.handleCloseActionMenu}
                      anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                      }}
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                      }}
                    >
                      <MenuItem onClick={ctrl?.handleCloseActionMenu}>Edit</MenuItem>
                      <MenuItem onClick={ctrl?.handleCloseActionMenu}>Delete</MenuItem>
                    </Menu>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        {/*Change Table Page*/}
        <TablePagination
          component="div"
          count={ctrl?.data.length}
          page={ctrl?.page}
          onPageChange={ctrl?.handleChangePage}
          rowsPerPage={ctrl?.rowsPerPage}
          onRowsPerPageChange={ctrl?.handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 15]}
        />
      </TableContainer>
    </Box>
  );
}
