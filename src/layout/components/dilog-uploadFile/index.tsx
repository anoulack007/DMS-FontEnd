import React, { useState, useRef, DragEvent, ChangeEvent } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  IconButton,
  Box,
  Button,
  LinearProgress,
  Alert,
  Snackbar,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import axios from "axios";
import { CREATE_FILE_END_POINT } from "../../../configs/endPoint/files-endpoint";
import axiosInstance from "../../../configs/axios";

interface FileUploadDialogProps {
  open: boolean;
  onClose: () => void;
  folderId?: string;
  status?: "PRIVATE" | "PUBLIC";
}

interface UploadError {
  message: string;
  code?: string;
}

interface SnackbarState {
  open: boolean;
  message: string;
  severity: "success" | "error" | "info" | "warning";
}

const FileUploadDialog: React.FC<FileUploadDialogProps> = ({
  open,
  onClose,
  folderId,
  status = "PRIVATE",
}) => {
  const [dragActive, setDragActive] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [error, setError] = useState<UploadError | null>(null);
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: "",
    severity: "success",
  });

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = async (files: FileList) => {
    try {
      setError(null);
      setUploading(true);
      setUploadProgress(0);

      const formData = new FormData();
      Array.from(files).forEach((file) => {
        formData.append("files", file);
      });

      // Add optional folderId if provided
      if (folderId) {
        formData.append("folderId", folderId);
      }

      // Add status
      formData.append("status", status);

      const response = await axiosInstance.post(
        CREATE_FILE_END_POINT,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / (progressEvent.total || 100)
            );
            setUploadProgress(percentCompleted);
          },
        }
      );

      // Handle successful upload
      if (response.status === 201) {
        onClose();

        setSnackbar({
          open: true,
          message: `Successfully uploaded ${files.length} file${
            files.length > 1 ? "s" : ""
          }`,
          severity: "success",
        });

        // Close dialog after short delay
        setTimeout(() => {
          onClose();
        }, 1000);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError({
          message: error.response?.data?.message || "Error uploading file",
          code: error.response?.data?.code,
        });
      } else {
        setError({
          message: "An unexpected error occurred",
        });
      }
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle
          sx={{
            m: 0,
            p: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6">Select document</Typography>
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography variant="h5" color="text.secondary" sx={{ mb: 2 }}>
            Import your documents
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error.message}
            </Alert>
          )}

          <Box
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            sx={{
              border: "2px dashed #ccc",
              borderRadius: 2,
              p: 3,
              textAlign: "center",
              backgroundColor: dragActive
                ? "rgba(0, 0, 0, 0.04)"
                : "transparent",
              transition: "all 0.2s ease",
              cursor: "pointer",
              minHeight: "200px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
            }}
            onClick={onButtonClick}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileInput}
              style={{ display: "none" }}
            />

            <Typography variant="h5" sx={{ mb: 1 }}>
              Drag and drop your file
            </Typography>

            <Button
              variant="contained"
              startIcon={<UploadFileIcon />}
              onClick={(e) => {
                e.stopPropagation();
                onButtonClick();
              }}
              disabled={uploading}
              sx={{
                textTransform: "none",
                backgroundColor: "primary.main",
                "&:hover": {
                  backgroundColor: "primary.dark",
                },
              }}
            >
              {uploading ? "Uploading..." : "Select File"}
            </Button>

            {uploading && (
              <Box sx={{ width: "100%", mt: 2 }}>
                <LinearProgress variant="determinate" value={uploadProgress} />
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  {uploadProgress}% Uploaded
                </Typography>
              </Box>
            )}
          </Box>
        </DialogContent>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default FileUploadDialog;
