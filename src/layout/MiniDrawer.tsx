import { useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  CssBaseline,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  List,
  ListItemIcon,
  Menu,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import MuiDrawer from "@mui/material/Drawer";
import NavItem from "./components/NavItem";
import { useLocation } from "react-router-dom";
import { DRAWER_WIDTH, MENU_ITEM_LISTS } from "./config";
import CloseIcon from "@mui/icons-material/Close";

//images
import Logo from "../assets/logo/IQURI.svg";
import Add_ic from "../assets/Image/Add.svg";
import Upload_ic from "../assets/Image/Document Arrow Up.svg";
import Upload_ic2 from "../assets/Image/Folder Arrow Up.svg";
import FoldeImage from "../assets/Image/image 11.png";
import axiosInstance from "../configs/axios";
import { CREATE_FOLDER_END_POINT } from "../configs/endPoint/folder-endpoint";
import Swal from "sweetalert2";

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: DRAWER_WIDTH,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  "& .MuiDrawer-paper": {
    width: DRAWER_WIDTH,
    boxSizing: "border-box",
  },
}));

const MiniDrawer = () => {
  const location = useLocation();
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(true);

  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [folderName, setFolderName] = useState<string>(null!);

  const [anchorEl, setAnchorEl] = useState<null>(null!);
  const opening = Boolean(anchorEl);

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
    handleClose();
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleCreateFolder = async () => {
    try {
      setLoading(true);
      const data = {
        name: folderName,
      };
  
      const res = await axiosInstance.post(CREATE_FOLDER_END_POINT, data);
  
      // On success, show SweetAlert2 success alert
      Swal.fire({
        title: 'Success!',
        text: 'Folder created successfully.',
        icon: 'success',
        confirmButtonText: 'OK',
        customClass: {
          confirmButton: 'your-custom-button-class', // You can add custom styles here if needed
        },
      });

      handleCloseDialog();
  
    } catch (error) {
      // On error, show SweetAlert2 error alert
      Swal.fire({
        title: 'Error!',
        text: 'Failed to create folder. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK',
        customClass: {
          confirmButton: 'your-custom-button-class',
        },
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const currentPath = location.pathname;

  return (
    <Box sx={{ position: "relative" }}>
      <CssBaseline />
      <Drawer
        variant="permanent"
        open={open}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: 'center',
            py: 0.5,
            px: 1,
          }}
        >
          <img height={70} width={70} src={Logo} alt="Freelancer" />
        </Box>
        <Divider />

        <Box sx={{ p: 1 }}>
          <Button
            fullWidth
            sx={{
              p: 3,
              height: 55,
              bgcolor: "#2C3E50",
              color: "white",
              borderRadius: 8,
              textTransform: "none",
              gap: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
            }}
            onClick={handleClick} // Change to onClick
          >
            <img src={Add_ic} alt="Add" style={{ marginRight: 8 }} />
            Upload Files
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={opening} // Change this line
            onClose={handleClose}
            PaperProps={{
              style: {
                borderRadius: "10px",
                padding: "10px",
                border: "1 dashed purple",
              },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, p: 2 }}>
              <img height={30} src={FoldeImage} alt="Folder" />
              <Typography variant="inherit">Folder</Typography>
            </Box>

            <Divider />

            <MenuItem sx={{ my: 1 }} onClick={handleClose}>
              <ListItemIcon>
                <img src={Upload_ic} alt="" />
              </ListItemIcon>
              <Typography variant="inherit">Files upload</Typography>
            </MenuItem>
            <MenuItem onClick={handleOpenDialog}>
              <ListItemIcon>
                <img src={Upload_ic2} alt="upload" />
              </ListItemIcon>
              <Typography variant="inherit">Folder upload</Typography>
            </MenuItem>
          </Menu>

          <Dialog
            maxWidth="sm"
            fullWidth
            open={openDialog}
            onClose={handleCloseDialog}
          >
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between'}}>
              Create a folder
              <IconButton
                edge="end"
                color="inherit"
                onClick={handleCloseDialog}
                aria-label="close"
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                id="folderName"
                label="Enter your folder name"
                type="text"
                fullWidth
                variant="outlined"
                value={folderName ?? ''}
                onChange={(e) => setFolderName(e.target.value)}
              />
            </DialogContent>
            <DialogActions>
              <Button sx={{ textTransform: 'none'}} onClick={handleCloseDialog} color="primary">
                Cancel
              </Button>
              <Button
              sx={{ textTransform: 'none'}}
                type="submit"
                onClick={handleCreateFolder}
                color="primary"
                variant="contained"
                disabled={!folderName}
              >
                {loading ? <CircularProgress color="primary" size={20} /> : "Create"}
              </Button>
            </DialogActions>
          </Dialog>
        </Box>

        <List>
          {MENU_ITEM_LISTS.map((item: any, index: number) => (
            <NavItem
              key={item.path}
              item={item}
              open={open}
              active={
                currentPath === "" ? index === 0 : currentPath === item.path
              }
            />
          ))}
        </List>
      </Drawer>
    </Box>
  );
};

export default MiniDrawer;