import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Chip,
  OutlinedInput,
  SelectChangeEvent,
  Avatar,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { getAllUsers } from "../../../service/user";
import { ErrorModel } from "../../../models/Error";
import { ErrorResponse } from "../../../utils/functions/Error";
import { UserModel } from "../../../models/user";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

interface CreateFolderDialogProps {
  open: boolean;
  folderName: string;
  loading: boolean;
  onClose: () => void;
  onChangeFolderName: (value: string) => void;
  onCreateFolder: () => void;
  selectedUsers?: string[]; // Array of usernames
  onUsersSelected?: (users: string[]) => void; // Callback for when users are selected
}

const CreateFolderDialog: React.FC<CreateFolderDialogProps> = ({
  open,
  folderName,
  loading,
  onClose,
  onChangeFolderName,
  onCreateFolder,
  selectedUsers = [],
  onUsersSelected = () => {},
}) => {
  const [users, setUsers] = useState<UserModel[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState<boolean>(false);
  const [selectedUsernames, setSelectedUsernames] =
    useState<string[]>(selectedUsers);

  useEffect(() => {
    if (open) {
      handleGetData();
      setSelectedUsernames(selectedUsers);
    }
  }, [open, selectedUsers]);

  const handleGetData = async () => {
    setIsLoadingUsers(true);
    try {
      const response = await getAllUsers();
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
      ErrorResponse(error as ErrorModel);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const handleUserSelection = (
    event: SelectChangeEvent<typeof selectedUsernames>
  ) => {
    const {
      target: { value },
    } = event;

    // On autofill we get a stringified value.
    const usernames = typeof value === "string" ? value.split(",") : value;
    setSelectedUsernames(usernames);
    onUsersSelected(usernames);
  };

  // Get user full name
  const getUserFullName = (user: UserModel) => {
    return `${user.name} ${user.surname}`;
  };

  // Get user avatar URL or return undefined if not available
  const getUserAvatar = (user: UserModel) => {
    return user.image?.url;
  };

  // Handle cancel button click - clear inputs and close dialog
  const handleCancel = () => {
    // Clear selected users
    setSelectedUsernames([]);
    // Notify parent component that users are cleared
    onUsersSelected([]);
    // Clear folder name (handled by parent component)
    onChangeFolderName("");
    // Close dialog
    onClose();
  };

  // Handle the X button click (same as cancel)
  const handleCloseX = () => {
    handleCancel();
  };

  // Handle form submission
  const handleSubmit = () => {
    if (folderName && !loading) {
      onCreateFolder();
    }
  };

  // Handle key down specifically for the folder name input
  const handleFolderNameKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSubmit();
    }
  };

  return (
    <Dialog 
      maxWidth="sm" 
      fullWidth 
      open={open} 
      onClose={handleCloseX}
    >
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between" }}>
        ສ້າງໂຟເດີ
        <IconButton
          edge="end"
          color="inherit"
          onClick={handleCloseX}
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
          label="ປ້ອນຊື່ໂຟເດີຂອງທ່ານ"
          type="text"
          fullWidth
          variant="outlined"
          value={folderName}
          onChange={(e) => onChangeFolderName(e.target.value)}
          onKeyDown={handleFolderNameKeyDown}
          sx={{ mb: 2 }}
        />

        <Typography variant="body1" color="textSecondary" sx={{ mb: 2 }}>
          #ຖ້າຕ້ອງການເພິ່ມຜູ້ໃຊ້ເພື່ອເຂົ້າເຖີງໂຟເດີ
        </Typography>

        <FormControl fullWidth>
          <InputLabel id="user-select-label">ເຊີນຜູ້ໃຊ້</InputLabel>
          <Select
            labelId="user-select-label"
            id="user-select"
            multiple
            value={selectedUsernames}
            onChange={handleUserSelection}
            input={
              <OutlinedInput id="select-multiple-chip" label="ເຊີນຜູ້ໃຊ້" />
            }
            renderValue={(selected) => (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {selected.map((value) => {
                  const user = users.find((u) => u?.username === value);
                  return (
                    <Chip
                      key={value}
                      label={user ? getUserFullName(user) : value}
                      avatar={
                        user?.image?.url ? (
                          <Avatar src={getUserAvatar(user)} />
                        ) : undefined
                      }
                    />
                  );
                })}
              </Box>
            )}
            startAdornment={
              <IconButton
                size="small"
                sx={{ mr: 1 }}
                disabled={isLoadingUsers}
                onClick={(e) => {
                  e.stopPropagation();
                  handleGetData();
                }}
              >
                {isLoadingUsers ? (
                  <CircularProgress size={20} />
                ) : (
                  <PersonAddIcon />
                )}
              </IconButton>
            }
          >
            {isLoadingUsers ? (
              <MenuItem disabled>
                <CircularProgress size={20} sx={{ mx: "auto", my: 1 }} />
              </MenuItem>
            ) : (
              users.map((user) => (
                <MenuItem
                  sx={{ height: 50 }}
                  key={user.username}
                  value={user.username}
                >
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    {user.image?.url && (
                      <Avatar
                        src={user.image.url}
                        sx={{ width: 24, height: 24, mr: 1 }}
                      />
                    )}
                    {getUserFullName(user)}
                    <span style={{ color: "blue", marginLeft: 5 }}>
                      ({user?.role})
                    </span>
                  </Box>
                </MenuItem>
              ))
            )}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button
          sx={{ textTransform: "none" }}
          onClick={handleCancel}
          color="primary"
        >
          ຍົກເລີກ
        </Button>
        <Button
          sx={{ textTransform: "none" }}
          type="submit"
          onClick={handleSubmit}
          color="primary"
          variant="contained"
          disabled={!folderName || loading}
        >
          {loading ? <CircularProgress color="primary" size={20} /> : "ສ້າງ"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateFolderDialog;