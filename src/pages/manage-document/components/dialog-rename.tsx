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
  return (
    <Dialog
      open={ctrl.renameDialogOpen}
      onClose={() => ctrl.setRenameDialogOpen(false)}
      maxWidth="xs"
      fullWidth
    >
      <form onSubmit={ctrl.handleRenameFolder}>
        <DialogTitle>Rename Document</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="New name"
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
            {ctrl.isSubmitting ? <CircularProgress size={24} /> : "Rename"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default RenameDocumentDialog;
