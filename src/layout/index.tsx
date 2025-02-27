// MainLayout.tsx
import { Box } from "@mui/material";
import { Outlet, useNavigate } from "react-router-dom";
import MiniDrawer from "./MiniDrawer";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { useState } from "react";

//icons
import { LOGIN_PATH } from "../routes/paths";
import { logout } from "../store/authenticationSlice";
import AdminToolbar from "./components/ToolbarShowData";

export default function MainLayout() {
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const adminData = useSelector((state: RootState) => state.auth.data);

  const [_anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

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
      }}
    >
      <MiniDrawer />

      <Box
        sx={{
          flexGrow: 1,
          p: 3,
        }}
      >
        <AdminToolbar adminData={adminData} handleLogout={handleLogout} />
        <Outlet />
      </Box>
    </Box>
  );
}
