import {
  Box,
  Button,
  CssBaseline,
  Divider,
  IconButton,
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
  REPORT_ITEM_LISTS,
} from "./config";

// Icons
import Add_ic from "../assets/Image/Add.svg";
import Upload_ic from "../assets/Image/Document Arrow Up.svg";
import FoldeImage from "../assets/Image/image 11.png";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

import UseDrawerController from "./controllers/Drawer";
import FileUploadDialog from "./components/dilog-uploadFile";
import { MANAGE_DOC_PATH } from "../routes/paths";
import CreateFolderDialog from "./components/dialog-createFolder";

import LOGO_IQURI from "../assets/Document Management Icons.png";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { checkPermission } from "../utils/functions/checkPermission";
import { UserRole } from "../enums/role";
import { useState } from "react";

const openedMixin = (theme: any) => ({
  width: DRAWER_WIDTH,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden" as const,
});

const closedMixin = (theme: any) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden" as const,
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

// Simplified styled component approach
const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})<{ open?: boolean }>(({ theme, open }) => ({
  width: DRAWER_WIDTH,
  flexShrink: 0,
  whiteSpace: "nowrap" as const,
  boxSizing: "border-box" as const,
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": {
      ...closedMixin(theme),
      marginTop: "16px",
      height: "calc(100vh - 32px)",
    },
  }),
}));

const MiniDrawer = () => {
  const ctrl = UseDrawerController();
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState<boolean>(true);

  const authData = useSelector((state: RootState) => state?.auth?.data);

  const isManageDocument =
    location.pathname === MANAGE_DOC_PATH || location.pathname === "/";

  const currentPath = location.pathname;

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <Box sx={{ position: "relative" }}>
      <CssBaseline />
      <Drawer variant="permanent" open={drawerOpen}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            py: 1,
            px: 2,
            // Add padding when drawer is closed
            ...(!drawerOpen && {
              pt: 2,
            }),
          }}
        >
          {drawerOpen && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flex: 1,
              }}
            >
              <IconButton
                onClick={() => ctrl?.handleNavigateToMain(MANAGE_DOC_PATH)}
                sx={{ p: 0 }}
              >
                <img
                  height={drawerOpen ? 120 : 40}
                  width={drawerOpen ? 120 : 40}
                  src={LOGO_IQURI}
                  alt="iQURi"
                  style={{ transition: "all 0.3s ease" }}
                />
              </IconButton>
            </Box>
          )}

          <Box>
            <IconButton
              onClick={handleDrawerToggle}
              sx={{
                position: "absolute",
                right: 8,
                backgroundColor: "rgba(0, 0, 0, 0.04)",
                "&:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.08)",
                },
              }}
            >
              {drawerOpen ? <ChevronLeftIcon /> : <MenuIcon />}
            </IconButton>
          </Box>
        </Box>

        {drawerOpen && (
          <Box sx={{ p: 1, mt: 2 }}>
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
              onClick={ctrl?.handleClick}
            >
              <img src={Add_ic} alt="Add" style={{ marginRight: 8 }} />
              ອັບໂຫຼດເອກະສານ
            </Button>
            <Menu
              anchorEl={ctrl?.anchorEl}
              open={ctrl?.opening}
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
              selectedUsers={ctrl?.selectedUsers}
              onUsersSelected={ctrl?.setSelectedUsers}
            />
          </Box>
        )}

        <Box
          sx={{
            ml: drawerOpen ? 1 : 0,
            bgcolor: "white",
            borderRadius: drawerOpen ? "8px" : "0px",
            height: drawerOpen ? "auto" : "100%",
          }}
        >
          <Box
            sx={{
              px: drawerOpen ? "8px" : "4px",
              py: "24px",
              ...(!drawerOpen && {
                pt: "32px",
              }),
            }}
          >
            {(authData?.role === UserRole.ADMIN ||
              authData?.role === UserRole.PROJECT_MANAGER ||
              authData?.role === UserRole.USER ||
              authData?.role === UserRole.HR) && (
              <>
                {drawerOpen && (
                  <Typography sx={{ pl: "16px", color: "#746E6E", mb: 1 }}>
                    ຈັດການເອກະສານ
                  </Typography>
                )}
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
                        display={checkPermission(
                          authData?.role?.toString() || "",
                          item.path
                        )}
                        collapsed={!drawerOpen}
                      />
                    );
                  })}
                </List>
              </>
            )}

            {/* Follow Documents - Visible to ADMIN, PROJECT_MANAGER */}
            {(authData?.role === UserRole.ADMIN ||
              authData?.role === UserRole.PROJECT_MANAGER) && (
              <>
                {drawerOpen && (
                  <Typography sx={{ pl: "16px", color: "#746E6E", mb: 1 }}>
                    ຕິດຕາມເອກະສານ
                  </Typography>
                )}
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
                        display={checkPermission(
                          authData?.role?.toString() || "",
                          item.path
                        )}
                        collapsed={!drawerOpen}
                      />
                    );
                  })}
                </List>
              </>
            )}

            {/* User Management - Visible to ADMIN, HR */}
            {(authData?.role === UserRole.ADMIN ||
              authData?.role === UserRole.HR) && (
              <>
                {drawerOpen && (
                  <Typography sx={{ pl: "16px", color: "#746E6E", mb: 1 }}>
                    ຈັດການຜູ້ໃຊ້
                  </Typography>
                )}
                <List>
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
                        display={checkPermission(
                          authData?.role?.toString() || "",
                          item.path
                        )}
                        collapsed={!drawerOpen}
                      />
                    );
                  })}
                </List>
              </>
            )}

            {/* Reports - Visible to ADMIN, PROJECT_MANAGER */}
            {(authData?.role === UserRole.ADMIN ||
              authData?.role === UserRole.PROJECT_MANAGER) && (
              <>
                {drawerOpen && (
                  <Typography sx={{ pl: "16px", color: "#746E6E", mb: 1 }}>
                    ລາຍງານ
                  </Typography>
                )}
                <List sx={{ marginBottom: "24px" }}>
                  {REPORT_ITEM_LISTS.map((item) => {
                    const isItemActive =
                      currentPath === item.path ||
                      (item.children &&
                        item.children.some(
                          (child) => child.path === currentPath
                        ));
                    return (
                      <NavItem
                        key={item.path}
                        item={item}
                        open={isItemActive}
                        active={isItemActive}
                        display={checkPermission(
                          authData?.role?.toString() || "",
                          item.path
                        )}
                        collapsed={!drawerOpen}
                      />
                    );
                  })}
                </List>
              </>
            )}
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
};

export default MiniDrawer;
