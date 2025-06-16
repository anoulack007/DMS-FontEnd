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
import eventBus from "../../../utils/functions/eventBus";
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

  const handleInviteMember = async (e: React.FormEvent) => {
    e.preventDefault();
    onClose();

    if (!selectedUser || !selectedDocument) return;

    try {
      const result = await Swal.fire({
        title: "ທ່ານແນ່ໃຈບໍ?",
        text: "ທ່ານຕ້ອງການເຊີນສະມາຊິກນີ້ບໍ?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "ຕົກລົງ",
        cancelButtonText: "ຍົກເລີກ",
      });

      if (result.isConfirmed) {
        Swal.fire({
          title: "ກຳລັງສົ່ງຄຳເຊີນ...",
          text: "ກະລຸນາລໍຖ້າໃນຂະນະທີ່ຄຳເຊີນກຳລັງຖືກສົ່ງ.",
          icon: "info",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        let endpoint;
        let payload;

        const username = selectedUser?.username ? [selectedUser.username] : [];

        if (selectedDocument?.itemType === "folder") {
          endpoint = INVITE_MEMBER_FOLDER_END_POINT;
          payload = {
            folderId: selectedDocument?.id,
            username, // Send as array
          };
        } else {
          endpoint = INVITE_MEMBER_FILE_END_POINT;
          payload = {
            fileId: selectedDocument?.id,
            email: selectedUser?.email
          };
        }

        await axiosInstance.post(endpoint, payload);

        Swal.fire({
          title: "ສຳເລັດ!",
          text: "ເຊີນສະມາຊິກສຳເລັດແລ້ວ.",
          icon: "success",
          showConfirmButton: false,
          timer: 1500,
        });

        eventBus.publish("MEMBER_UPDATED", {
          action: "invite",
          documentId: selectedDocument?.id,
          documentType: selectedDocument?.itemType,
        });

        handleClear();
      }
    } catch (error) {
      ErrorResponse(error as ErrorModel);
    }
  };

  const handleClose = (_event: {}, reason: string) => {
    if (reason === "backdropClick" || reason === "escapeKeyDown") {
      return; // Do nothing, preventing dialog from closing
    }
    onClose(); // Only close when explicitly called (like from the back button)
  };

  useEffect(() => {
    handleGetData();
  }, [open, ErrorResponse]);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      disableEscapeKeyDown
    >
      <form onSubmit={handleInviteMember}>
        <DialogTitle>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton onClick={onClose}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h6" sx={{ ml: 1 }}>
              ເຊີນສະມາຊິກ
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
                placeholder="ເລືອກຜູ້ໃຊ້"
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
                  <Avatar
                    src={option?.image?.url}
                    alt="avatar"
                    sx={{ width: 32, height: 32 }}
                  />

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
        <DialogActions
          sx={{ padding: 2, display: "flex", justifyContent: "flex-end" }}
        >
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
            ຍົກເລີກ
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
            ສົ່ງ
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default DialogInviteMember;
