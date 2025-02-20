// CreateFolderDialog.tsx
import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
  CircularProgress
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface CreateFolderDialogProps {
  open: boolean;
  folderName: string;
  loading: boolean;
  onClose: () => void;
  onChangeFolderName: (value: string) => void;
  onCreateFolder: () => void;
}

const CreateFolderDialog: React.FC<CreateFolderDialogProps> = ({
  open,
  folderName,
  loading,
  onClose,
  onChangeFolderName,
  onCreateFolder
}) => {
  return (
    <Dialog
      maxWidth="sm"
      fullWidth
      open={open}
      onClose={onClose}
    >
      <DialogTitle
        sx={{ display: "flex", justifyContent: "space-between" }}
      >
        ສ້າງໂຟເດີ
        <IconButton
          edge="end"
          color="inherit"
          onClick={onClose}
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
        />
      </DialogContent>
      <DialogActions>
        <Button
          sx={{ textTransform: "none" }}
          onClick={onClose}
          color="primary"
        >
          ຍົກເລີກ
        </Button>
        <Button
          sx={{ textTransform: "none" }}
          type="submit"
          onClick={onCreateFolder}
          color="primary"
          variant="contained"
          disabled={!folderName}
        >
          {loading ? (
            <CircularProgress color="primary" size={20} />
          ) : (
            "ສ້າງ"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateFolderDialog;