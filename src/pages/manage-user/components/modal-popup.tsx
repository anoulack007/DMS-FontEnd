import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';

interface PopupDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userToDelete: string | null; // ชื่อของผู้ใช้ที่จะแสดงใน dialog
}

const PopupDialog: React.FC<PopupDialogProps> = ({ open, onClose, onConfirm, userToDelete }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Delete?</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete {userToDelete}?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onConfirm} color="error" variant="contained">Confirm</Button>
        <Button onClick={onClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
};

export default PopupDialog;
