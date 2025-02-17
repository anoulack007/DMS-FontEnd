import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Box,
  IconButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SendIcon from "@mui/icons-material/Send";

interface ShareDialogController {
  shareDialogOpen: boolean;
  handleCloseShareDialog: () => void;
}

interface ShareDocumentDialogProps {
  ctrl: ShareDialogController;
  personIcon?: string;
}

const ShareDocumentDialog: React.FC<ShareDocumentDialogProps> = ({
  ctrl,
  personIcon = "../../../assets/logo/Person.svg",
}) => {
  return (
    <Dialog
      open={ctrl.shareDialogOpen}
      onClose={ctrl.handleCloseShareDialog}
      maxWidth="xs"
      fullWidth
    >
      <form>
        <DialogTitle>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton onClick={ctrl.handleCloseShareDialog}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h6" sx={{ ml: 1 }}>
              Share "Documents"
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Add a name or email"
            slotProps={{
              input: {
                startAdornment: (
                  <img
                    src={personIcon}
                    alt="person"
                    style={{ marginRight: 8 }}
                  />
                ),
                style: { borderRadius: 20 },
              },
            }}
            sx={{ mt: 2, borderRadius: 20 }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            type="submit"
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

export default ShareDocumentDialog;
