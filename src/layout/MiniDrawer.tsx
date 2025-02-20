import {
  Box,
  Button,
  CssBaseline,
  Divider,
  List,
  ListItemIcon,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import MuiDrawer from "@mui/material/Drawer";
import NavItem from "./components/NavItem";
import { useLocation } from "react-router-dom";
import {
  DRAWER_WIDTH,
  FOLLOW_DOCUMENT_LISTS,
  MENU_ITEM_LISTS,
  USER_MANAGE_LISTS,
} from "./config";

//images
import Logo from "../assets/logo/IQURI.svg";
import Add_ic from "../assets/Image/Add.svg";
import Upload_ic from "../assets/Image/Document Arrow Up.svg";
// import Upload_ic2 from "../assets/Image/Folder Arrow Up.svg";
import FoldeImage from "../assets/Image/image 11.png";
import UseDrawerController from "./controllers/Drawer";
import FileUploadDialog from "./components/dilog-uploadFile";
import { MANAGE_DOC_PATH } from "../routes/paths";
import CreateFolderDialog from "./components/dialog-createFolder";

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

  const isManageDocument =
    location.pathname === MANAGE_DOC_PATH || location.pathname === "/";

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
            py: 4,
            px: 1,
          }}
        >
          <img height={70} width={70} src={Logo} alt="iQURi" />
        </Box>

        <Box sx={{ p: 1 }}>
          <Button
            disabled={!isManageDocument}
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
              "&.Mui-disabled": {
                bgcolor: "#95A5A6",
                color: "rgba(255, 255, 255, 0.7)",
                cursor: "not-allowed",
              },
            }}
            onClick={ctrl?.handleClick} // Change to onClick
          >
            <img src={Add_ic} alt="Add" style={{ marginRight: 8 }} />
            ອັບໂຫຼດເອກະສານ
          </Button>
          <Menu
            anchorEl={ctrl?.anchorEl}
            open={ctrl?.opening} // Change this line
            onClose={ctrl?.handleClose}
            slotProps={{
              paper: {
                sx: {
                  borderRadius: "10px",
                  padding: "10px",
                },
              },
            }}
          >
            <MenuItem onClick={ctrl?.handleOpenDialog}>
              <ListItemIcon>
                <img height={30} src={FoldeImage} alt="Folder" />
              </ListItemIcon>
              <Typography variant="inherit">ສ້າງໂຟເດີ</Typography>
            </MenuItem>

            <Divider />

            <MenuItem sx={{ my: 1 }} onClick={ctrl?.handleOpenUploadDialog}>
              <ListItemIcon>
                <img src={Upload_ic} alt="" />
              </ListItemIcon>
              <Typography variant="inherit">ອັບໂຫຼດຟາຍ</Typography>
            </MenuItem>
            {/* <MenuItem onClick={ctrl?.handleOpenDialog}>
              <ListItemIcon>
                <img src={Upload_ic2} alt="upload" />
              </ListItemIcon>
              <Typography variant="inherit">Folder Uploads</Typography>
            </MenuItem> */}
          </Menu>

          <FileUploadDialog
            open={ctrl.openUploadDialog}
            onClose={ctrl.handleCloseUploadDialog}
          />

          <CreateFolderDialog
            open={ctrl?.openDialog}
            folderName={ctrl?.folderName ?? ""}
            loading={ctrl?.loading}
            onClose={ctrl?.handleCloseDialog}
            onChangeFolderName={(value) => ctrl?.setFolderName(value)}
            onCreateFolder={ctrl?.handleCreateFolder}
          />
        </Box>

        <Box sx={{ ml: 1, bgcolor: "white", borderRadius: "8px" }}>
          <Box sx={{ px: "8px", py: "24px" }}>
            <Typography sx={{ pl: "16px", color: "#746E6E" }}>
              ຈັດການເອກະສານ
            </Typography>
            <List>
              {MENU_ITEM_LISTS.map((item, index) => {
                const isItemActive =
                  currentPath === item.path ||
                  (currentPath === "" && index === 0);
                return (
                  <NavItem
                    key={item.path}
                    item={item}
                    open={isItemActive}
                    active={isItemActive}
                  />
                );
              })}
            </List>

            <Typography sx={{ pl: "16px", color: "#746E6E" }}>
              ຕິດຕາມເອກະສານ
            </Typography>
            <List>
              {FOLLOW_DOCUMENT_LISTS.map((item, index) => {
                const isItemActive =
                  currentPath === item.path ||
                  (currentPath === "" && index === 0);
                return (
                  <NavItem
                    key={item.path}
                    item={item}
                    open={isItemActive}
                    active={isItemActive}
                  />
                );
              })}
            </List>

            <Typography sx={{ pl: "16px", color: "#746E6E" }}>
              ຈັດການຜູ້ໃຊ້
            </Typography>
            <List sx={{ marginBottom: "24px" }}>
              {USER_MANAGE_LISTS.map((item, index) => {
                const isItemActive =
                  currentPath === item.path ||
                  (currentPath === "" && index === 0);
                return (
                  <NavItem
                    key={item.path}
                    item={item}
                    open={isItemActive}
                    active={isItemActive}
                  />
                );
              })}
            </List>
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
};

export default MiniDrawer;
