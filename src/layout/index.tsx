// MainLayout.tsx
import {
  Avatar,
  Box,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import { Outlet, useNavigate } from "react-router-dom";
import MiniDrawer from "./MiniDrawer";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { useState } from "react";

//icons
import { Logout as LogoutIcon } from "@mui/icons-material";
import { LOGIN_PATH } from "../routes/paths";
import { logout } from "../store/authenticationSlice";

export default function MainLayout() {
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const adminData = useSelector(
    (state: RootState) => state.authentication.data
  ); // Adjust the key based on your store structure

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNavigateToLogin = (path: string) => {
    navigate(path);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleClose();

    try {
      dispatch(logout());
      localStorage.clear();
      handleNavigateToLogin(LOGIN_PATH);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        position: "relative",
        p: 2,
      }}
    >
      <MiniDrawer />

      <Box
        sx={{
          flexGrow: 1,
          p: 2,
          zIndex: 1,
          borderRadius: 5,
          bgcolor: "#eef2f6",
        }}
      >
        <Toolbar
          sx={{
            mb: 5,
            bgcolor: "white",
            display: "flex",
            justifyContent: "flex-end",
            flexDirection: "row",
            borderRadius: 1,
            boxShadow: 1,
          }}
        >
          {adminData ? (
            <Box
              sx={{ display: "flex", gap: 2, alignItems: "center" }}
              key={adminData.id}
            >
              <Typography
                sx={{ display: "flex", alignItems: "center", fontWeight: 500 }}
              >
                {adminData.username}
              </Typography>

              <IconButton
                onClick={handleClick}
                size="small"
                aria-controls={open ? "account-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
              >
                <Avatar
                  src={adminData?.image?.url}
                  sx={{
                    width: 32,
                    height: 32,
                    cursor: "pointer",
                    "&:hover": {
                      opacity: 0.8,
                    },
                  }}
                />
              </IconButton>
            </Box>
          ) : (
            <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
              <Typography alignContent={'center'}>No user data available</Typography>
              <Avatar />
            </Box>
          )}

          <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={open}
            onClose={handleClose}
            onClick={handleClose}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: "visible",
                filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                mt: 1.5,
                "& .MuiAvatar-root": {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
                "&:before": {
                  content: '""',
                  display: "block",
                  position: "absolute",
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: "background.paper",
                  transform: "translateY(-50%) rotate(45deg)",
                  zIndex: 0,
                },
              },
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            <MenuItem onClick={handleLogout}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  color: "error.main",
                }}
              >
                <LogoutIcon fontSize="small" color="error" />
                Logout
              </Box>
            </MenuItem>
          </Menu>
        </Toolbar>
        <Outlet />
      </Box>
    </Box>
  );
}
