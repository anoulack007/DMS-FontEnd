import React, { useState, useRef, DragEvent, ChangeEvent, useEffect } from "react";
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
  TextField,
  InputAdornment,
} from "@mui/material";

//icons
import CloseIcon from "@mui/icons-material/Close";
import UploadFileIcon from "@mui/icons-material/UploadFile";

import axios from "axios";
import axiosInstance from "../../../configs/axios";
import HistoryEduOutlinedIcon from "@mui/icons-material/HistoryEduOutlined";
import eventBus from "../../../utils/functions/eventBus";
import { FILE_UPLOAD_VERSION_END_POINT } from "../../../configs/endPoint/files-endpoint";

interface FileUploadDialogProps {
  open: boolean;
  onClose: () => void;
  folderId?: string;
  documentNumber?: string; 
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

const FileUploadVersionDialog: React.FC<FileUploadDialogProps> = ({
  open,
  onClose,
  folderId,
  documentNumber = "", 
}) => {
  const [dragActive, setDragActive] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const documentNumberRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [error, setError] = useState<UploadError | null>(null);
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: "",
    severity: "success",
  });

  // Effect to update document number field when it changes
  useEffect(() => {
    if (documentNumberRef.current && documentNumber) {
      documentNumberRef.current.value = documentNumber;
    }
  }, [documentNumber, open]);

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

      // Get folderId from local storage or URL path
      const storageFolderId = localStorage.getItem("currentFolderId");

      // Prioritize: URL param > local storage > prop > null
      const finalFolderId = storageFolderId || folderId || null;

      if (finalFolderId) {
        formData.append("folderId", finalFolderId);
      } else {
        formData.append("folderId", "");
      }

      // Add documentNumber if provided
      if (documentNumber) {
        formData.append("documentId", documentNumber);
      }

      const response = await axiosInstance.post(
        FILE_UPLOAD_VERSION_END_POINT,
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
          message: `ອັບໂຫຼດສຳເລັດແລ້ວ ${files.length} ໄຟລ໌`,
          severity: "success",
        });

        eventBus.publish("FILES_UPDATED", true);

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

  const isVersionUpload = documentNumber !== "";

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle
          sx={{
            m: 0,
            p: 3,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h4">
            {isVersionUpload ? "ອັບໂຫຼດເວີຊັນໃໝ່" : "ເລືອກເອກະສານ"}
          </Typography>
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
            {isVersionUpload ? "ອັບໂຫຼດເວີຊັນໃໝ່ຂອງເອກະສານ" : "ນໍາເຂົ້າເອກະສານຂອງທ່ານ"}
          </Typography>

          <Box sx={{ mb: 2 }}>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
              # ເລກລະຫັດເອກະສານ
            </Typography>
            <TextField
              variant="outlined"
              placeholder="ເລກລະຫັດເອກະສານ"
              required
              inputRef={documentNumberRef}
              type="text"
              error={!!error && error.message.includes("document number")}
              helperText={
                error && error.message.includes("document number")
                  ? error.message
                  : ""
              }
              disabled={uploading || isVersionUpload} // Disable when uploading or it's a version upload
              defaultValue={documentNumber}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <HistoryEduOutlinedIcon />
                  </InputAdornment>
                ),
                readOnly: isVersionUpload, // Make read-only when it's a version upload
              }}
              fullWidth
            />
          </Box>

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
              p: 10,
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
              {isVersionUpload 
                ? "ເລືອກເວີຊັນໃໝ່ຂອງເອກະສານ" 
                : "ເລືອກ ແລະ ວາງໄຟລ໌ຂອງທ່ານ"}
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
                boxShadow: 0,
                color: "white",
                textTransform: "none",
                bgcolor: "primary.dark",
                "&:hover": {
                  backgroundColor: "white",
                  color: "primary.dark",
                },
              }}
            >
              {uploading ? "ກຳລັງອັບໂຫຼດ..." : "ເລືອກໄຟລ໌"}
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

export default FileUploadVersionDialog;