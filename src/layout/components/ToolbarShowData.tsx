import { useState, useEffect } from "react";
import {
  Box,
  Toolbar,
  Avatar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Modal,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { PRIMARY_COLOR } from "../../theme/colors";
import { UserModel } from "../../models/user"; // Make sure this import path is correct

// Update the prop types for better type checking
interface AdminToolbarProps {
  adminData: UserModel | null;
  handleLogout: () => void;
}

const AdminToolbar = ({ adminData, handleLogout }: AdminToolbarProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);

  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  // State for real-time date & time
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedDate = currentTime.toLocaleDateString("en-GB");
  const formattedTime = currentTime.toLocaleTimeString();

  return (
    <Toolbar
      sx={{
        mb: 5,
        bgcolor: "white",
        display: "flex",
        justifyContent: "flex-end",
        flexDirection: "row",
        borderRadius: 1,
        p: 2,
        boxShadow: 1,
        gap: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          border: `2px solid ${PRIMARY_COLOR}`,
          borderRadius: "10px",
          p: "8px 16px",
          gap: 1,
        }}
      >
        <AccessTimeIcon fontSize="medium" />
        <Box>
          <Typography variant="body1" sx={{ fontWeight: 700 }}>
            {formattedDate}
          </Typography>
          <Typography variant="body2">{formattedTime}</Typography>
        </Box>
      </Box>

      {adminData ? (
        <Box
          sx={{
            display: "flex",
            gap: 2,
            alignItems: "center",
            border: `2px solid ${PRIMARY_COLOR}`,
            borderRadius: "10px",
            height: "66px",
            justifyContent: "flex-start",
            p: "8px 16px",
            flexDirection: "row",
          }}
        >
          <Avatar
            src={adminData.image?.url}
            alt={adminData.name || adminData.username || "User"}
            sx={{
              width: 40,
              height: 40,
              cursor: "pointer",
              "&:hover": { opacity: 0.8 },
            }}
            onClick={handleOpenDialog}
          />

          <Modal
            open={openDialog}
            onClose={handleCloseDialog}
            aria-labelledby="avatar-modal"
            aria-describedby="enlarged view of user avatar"
          >
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                bgcolor: "background.paper",
                boxShadow: 24,
                p: 2,
                outline: "none",
                borderRadius: "4px",
              }}
            >
              <img
                src={adminData.image?.url}
                alt={adminData.name || adminData.username || "User"}
                style={{
                  maxWidth: "90vw",
                  maxHeight: "90vh",
                  objectFit: "contain",
                }}
                onClick={handleClose}
              />
            </Box>
          </Modal>
          <Box>
            <Typography variant="body1" sx={{ fontWeight: 700 }}>
              {adminData?.name}
            </Typography>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              {adminData.role}
            </Typography>
          </Box>
          <IconButton
            onClick={handleClick}
            size="small"
            aria-controls={open ? "account-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            sx={{ marginLeft: "auto" }}
          >
            <ArrowDropDownIcon />
          </IconButton>
        </Box>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
          <Typography alignContent={"center"}>
            No user data available
          </Typography>
          <IconButton onClick={handleClick} size="small">
            <Avatar
              sx={{
                width: 32,
                height: 32,
                cursor: "pointer",
                "&:hover": { opacity: 0.8 },
              }}
            />
          </IconButton>
        </Box>
      )}

      {/* Dropdown Menu */}
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        slotProps={{
          paper: {
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
  );
};

export default AdminToolbar;
