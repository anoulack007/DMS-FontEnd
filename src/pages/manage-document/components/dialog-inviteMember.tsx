import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
  Box,
  Typography,
  InputAdornment,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SendIcon from '@mui/icons-material/Send';

import Person_IC from "../../../assets/logo/Person.svg";

interface DialogInviteMemberProps {
  open: boolean;
  onClose: () => void;
}

const DialogInviteMember: React.FC<DialogInviteMemberProps> = ({
  open,
  onClose,
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
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
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Add a name or email"
          InputProps={{
            style: { borderRadius: 20},
            startAdornment: (
              <InputAdornment position="start">
                <img src={Person_IC} alt="person" />
              </InputAdornment>
            ),
          }}
          sx={{ mt: 2, borderRadius: 20 }}
        />
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          color="error"
          fullWidth
          startIcon={<SendIcon />}
          sx={{
            backgroundColor: "maroon",
            color: "white",
            textTransform: "none",
            maxWidth: 100,
            height: 40,
            borderRadius: 3
          }}
        >
          Send
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogInviteMember;
