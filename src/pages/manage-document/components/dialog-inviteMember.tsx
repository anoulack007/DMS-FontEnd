import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Box,
  Typography,
  Autocomplete,
  TextField,
  InputAdornment,
  Avatar,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SendIcon from "@mui/icons-material/Send";
import Person_IC from "../../../assets/logo/Person.svg";
import Swal from "sweetalert2";
import { ErrorModel } from "../../../models/Error";
import { getAllUsers } from "../../../service/user";
import { UserModel } from "../../../models/user";
// Match your Document type
interface Document {
  id: string;
  itemType: string;
  // Add other document properties as needed
}

interface DialogInviteMemberProps {
  open: boolean;
  onClose: () => void;
  selectedDocument: Document | null;
  INVITE_MEMBER_FOLDER_END_POINT: string;
  INVITE_MEMBER_FILE_END_POINT: string;
  axiosInstance: any;
  ErrorResponse: (error: ErrorModel) => void;
}

const DialogInviteMember: React.FC<DialogInviteMemberProps> = ({
  open,
  onClose,
  selectedDocument,
  INVITE_MEMBER_FOLDER_END_POINT,
  INVITE_MEMBER_FILE_END_POINT,
  axiosInstance,
  ErrorResponse,
}) => {
  const [users, setUsers] = useState<UserModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserModel | null>(null);
  const [inputValue, setInputValue] = useState("");

  const handleClear = () => {
    onClose();
    setSelectedUser(null);
    setInputValue("");
  };

  const handleGetData = async () => {
    setLoading(true);
    try {
      const response = await getAllUsers();
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
      ErrorResponse(error as ErrorModel);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetData();
  }, [open, ErrorResponse]);

  const handleInviteMember = async (e: React.FormEvent) => {
    e.preventDefault();
    onClose();
    

    if (!selectedUser || !selectedDocument) return;

    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "Do you want to invite this member?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, invite!",
        cancelButtonText: "Cancel",
      });

      if (result.isConfirmed) {
        Swal.fire({
          title: "Sending Invite...",
          text: "Please wait while the invite is being sent.",
          icon: "info",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        let endpoint;
        let payload;

        if (selectedDocument?.itemType === "folder") {
          endpoint = INVITE_MEMBER_FOLDER_END_POINT;
          payload = {
            folderId: selectedDocument?.id,
            username: selectedUser?.username,
          };
        } else {
          endpoint = INVITE_MEMBER_FILE_END_POINT;
          payload = {
            fileId: selectedDocument?.id,
            email: selectedUser?.email,
          };
        }

        await axiosInstance.post(endpoint, payload);

        Swal.fire({
          title: "Success!",
          text: "Member has been successfully invited.",
          icon: "success",
          showConfirmButton: false,
        });

        handleClear();
      }
    } catch (error) {
      ErrorResponse(error as ErrorModel);
    }
  };

  const handleClose = (_event: {}, reason: string) => {
    if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
      return; // Do nothing, preventing dialog from closing
    }
    onClose(); // Only close when explicitly called (like from the back button)
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth  disableEscapeKeyDown >
      <form onSubmit={handleInviteMember}>
        <DialogTitle>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton onClick={onClose}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h6" sx={{ ml: 1 }}>
              Invite Member
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Autocomplete
            fullWidth
            options={users}
            loading={loading}
            value={selectedUser}
            onChange={(_, newValue) => setSelectedUser(newValue)}
            inputValue={inputValue}
            onInputChange={(_, newInputValue) => setInputValue(newInputValue)}
            getOptionLabel={(option) => `${option.name} (${option.email})`}
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                variant="outlined"
                placeholder="Select User"
                slotProps={{
                  input: {
                    ...params.InputProps,
                    startAdornment: (
                      <>
                        <InputAdornment position="start">
                          <img src={Person_IC} alt="person" />
                        </InputAdornment>
                        {params.InputProps.startAdornment}
                      </>
                    ),
                  },
                }}
                sx={{ mt: 2, borderRadius: 20 }}
              />
            )}
            renderOption={(props, option) => (
              <li {...props}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Avatar src={option?.image?.url} alt="avatar" sx={{ width: 32, height: 32 }} />
                    
                  <Box>
                    <Typography variant="body1">{option?.username}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {option.email}
                    </Typography>
                  </Box>
                </Box>
              </li>
            )}
          />
        </DialogContent>
        <DialogActions sx={{ padding: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            onClick={handleClear}
            variant="outlined"
            color="error"
            sx={{
              textTransform: "none",
              maxWidth: 100,
              height: 40,
              borderRadius: 3,
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="error"
            disabled={!selectedUser || !selectedDocument}
            startIcon={<SendIcon />}
            sx={{
              backgroundColor: "#2C3E50",
              color: "white",
              textTransform: "none",
              maxWidth: 100,
              height: 40,
              borderRadius: 3,
            }}
          >
            Send
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default DialogInviteMember;
