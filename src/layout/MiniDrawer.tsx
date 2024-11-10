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
import UseDrawerController from "./controllers/Drawer";
import FileUploadDialog from "./components/dilog-uploadFile";

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(() => ({
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
  const ctrl = UseDrawerController();
  const location = useLocation();

  const currentPath = location.pathname;

  return (
    <Box sx={{ position: "relative" }}>
      <CssBaseline />
      <Drawer variant="permanent" open={ctrl?.open}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
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
            onClick={ctrl?.handleClick} // Change to onClick
          >
            <img src={Add_ic} alt="Add" style={{ marginRight: 8 }} />
            Upload Files
          </Button>
          <Menu
            anchorEl={ctrl?.anchorEl}
            open={ctrl?.opening} // Change this line
            onClose={ctrl?.handleClose}
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

            <MenuItem sx={{ my: 1 }} onClick={ctrl?.handleOpenUploadDialog}>
              <ListItemIcon>
                <img src={Upload_ic} alt="" />
              </ListItemIcon>
              <Typography variant="inherit">Files upload</Typography>
            </MenuItem>
            <MenuItem onClick={ctrl?.handleOpenDialog}>
              <ListItemIcon>
                <img src={Upload_ic2} alt="upload" />
              </ListItemIcon>
              <Typography variant="inherit">Folder upload</Typography>
            </MenuItem>
          </Menu>

          <FileUploadDialog
            open={ctrl.openUploadDialog}
            onClose={ctrl.handleCloseUploadDialog}
          />

          <Dialog
            maxWidth="sm"
            fullWidth
            open={ctrl?.openDialog}
            onClose={ctrl?.handleCloseDialog}
          >
            <DialogTitle
              sx={{ display: "flex", justifyContent: "space-between" }}
            >
              Create a folder
              <IconButton
                edge="end"
                color="inherit"
                onClick={ctrl?.handleCloseDialog}
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
                value={ctrl?.folderName ?? ""}
                onChange={(e) => ctrl?.setFolderName(e.target.value)}
              />
            </DialogContent>
            <DialogActions>
              <Button
                sx={{ textTransform: "none" }}
                onClick={ctrl?.handleCloseDialog}
                color="primary"
              >
                Cancel
              </Button>
              <Button
                sx={{ textTransform: "none" }}
                type="submit"
                onClick={ctrl?.handleCreateFolder}
                color="primary"
                variant="contained"
                disabled={!ctrl?.folderName}
              >
                {ctrl?.loading ? (
                  <CircularProgress color="primary" size={20} />
                ) : (
                  "Create"
                )}
              </Button>
            </DialogActions>
          </Dialog>
        </Box>

        <List>
          {MENU_ITEM_LISTS.map((item: any, index: number) => (
            <NavItem
              key={item.path}
              item={item}
              open={ctrl?.open}
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
