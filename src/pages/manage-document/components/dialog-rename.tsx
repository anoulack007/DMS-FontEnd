import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";

interface RenameDialogController {
  renameDialogOpen: boolean;
  setRenameDialogOpen: (open: boolean) => void;
  handleRenameFolder: (e: React.FormEvent<HTMLFormElement>) => void;
  handleChangeName: (name: string) => void;
  isSubmitting: boolean;
  newName: string;
}

interface RenameDocumentDialogProps {
  ctrl: RenameDialogController;
}

const RenameDocumentDialog: React.FC<RenameDocumentDialogProps> = ({
  ctrl,
}) => {
  const handleClose = () => {
    ctrl.setRenameDialogOpen(false);
    ctrl.handleChangeName("");
  };
  return (
    <Dialog
      open={ctrl.renameDialogOpen}
      onClose={handleClose}
      maxWidth="xs"
      fullWidth
    >
      <form
        onSubmit={(e) => {
          ctrl.handleRenameFolder(e);
          ctrl.handleChangeName(""); // Clear input when submitting
        }}
      >
        <DialogTitle>ປ່ຽນຊື່ ເອກະສານ</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="ຊື່ໃໝ່"
            fullWidth
            value={ctrl.newName}
            onChange={(e) => ctrl.handleChangeName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button
            type="submit"
            sx={{
              bgcolor: "#2C3E50",
              textTransform: "none",
              color: "white",
            }}
          >
            {ctrl.isSubmitting ? <CircularProgress size={24} /> : "ປ່ຽນຊື່"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default RenameDocumentDialog;
