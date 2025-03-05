import React, { useState, useEffect } from "react";
import axios from "../../../configs/axios";
import {
  Box,
  Button,
  Dialog,
  Typography,
  IconButton,
  TextField,
  InputAdornment,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableFooter,
  CircularProgress,
  Chip,
} from "@mui/material";

// Icons
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import FolderIcon from "@mui/icons-material/Folder";
import ArticleIcon from "@mui/icons-material/Article";
import { GET_OWNER_DOC_END_POINT } from "../../../configs/endPoint/file&folder";
import { getStatusColor, getTextColor } from "../../../utils/functions/color";

interface MoveDialogProps {
  open: boolean;
  onClose: () => void;
  onMove: (folderId: string) => void;  // Updated to accept folderId
  selectedCount: number;
}

// File type interface
interface FileItem {
  type: string;
  name: string;
  size: string;
  lastModified: string;
  status: string;
  _id?: string;
  isShared?: boolean;
}

const MoveDialog: React.FC<MoveDialogProps> = ({
  open,
  onClose,
  onMove,
  selectedCount,
}) => {
  const [fileData, setFileData] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  console.log(selectedFolderId)

  useEffect(() => {
    const fetchFolders = async () => {
      if (!open) return;

      try {
        setLoading(true);
        const response = await axios.get(GET_OWNER_DOC_END_POINT);
        const responseData = response?.data?.data;

        if (!responseData) {
          throw new Error("No data received from API");
        }

        const processedData: FileItem[] = [];

        // Process normal folders
        if (responseData.folders && Array.isArray(responseData.folders)) {
          responseData.folders.forEach((folder: any) => {
            processedData.push({
              type: "folder",
              name: folder.name || "Unnamed folder",
              size: folder.size ? `${folder.size} bytes` : "Unknown size",
              lastModified: folder.updatedAt
                ? new Date(folder.updatedAt).toLocaleDateString()
                : "Unknown date",
              _id: folder.id || folder._id,
              status: folder?.status,
            });
          });
        }
        // Fallback if folders are under 'folder' key instead
        else if (responseData.folder && Array.isArray(responseData.folder)) {
          responseData.folder.forEach((folder: any) => {
            processedData.push({
              type: "folder",
              name: folder.name || "Unnamed folder",
              size: folder.size ? `${folder.size} bytes` : "Unknown size",
              lastModified: folder.updatedAt
                ? new Date(folder.updatedAt).toLocaleDateString()
                : "Unknown date",
              _id: folder.id || folder._id,
              status: folder?.status,
            });
          });
        }
        // Handle single folder object case
        else if (responseData.folder && !Array.isArray(responseData.folder)) {
          const folder = responseData.folder;
          processedData.push({
            type: "folder",
            name: folder.name || "Unnamed folder",
            size: folder.size ? `${folder.size} bytes` : "Unknown size",
            lastModified: folder.updatedAt
              ? new Date(folder.updatedAt).toLocaleDateString()
              : "Unknown date",
            _id: folder.id || folder._id,
            status: folder?.status,
          });
        }

        // Process folderMembers (shared folders)
        if (
          responseData.folderMembers &&
          Array.isArray(responseData.folderMembers)
        ) {
          responseData.folderMembers.forEach((folderMember: any) => {
            if (folderMember.folder) {
              processedData.push({
                type: "folder",
                name: folderMember.folder.name || "Unnamed shared folder",
                size: folderMember.folder.size
                  ? `${folderMember.folder.size} bytes`
                  : "Unknown size",
                lastModified: folderMember.folder.updatedAt
                  ? new Date(folderMember.folder.updatedAt).toLocaleDateString()
                  : "Unknown date",
                _id: folderMember.folder.id || folderMember.folder._id,
                isShared: true,
                status: folderMember?.status || "Unknown status",
              });
            }
          });
        }

        setFileData(processedData);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch folders:", err);
        setError("Failed to load folders. Please try again later.");
        setFileData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFolders();
  }, [open]);

  // Reset selected folder when dialog opens/closes
  useEffect(() => {
    if (!open) {
      setSelectedFolderId(null);
    }
  }, [open]);

  // Filter files based on search term
  const filteredData = fileData.filter((file) =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          bgcolor: "#f5f5f5",
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          ຍ້າຍ {selectedCount} ລາຍການ
        </Typography>

        <Box sx={{ display: "flex", mb: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                mb: 2,
                gap: 2,
              }}
            >
              <Box
                sx={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  borderRadius: 1,
                  flexGrow: 1,
                }}
              >
                <TextField
                  placeholder="ຄົ້ນຫາ..."
                  fullWidth
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  slotProps={{
                    input: {
                      style: {
                        backgroundColor: "white",
                        borderRadius: "12px",
                        height: "45px",
                      },
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                    },
                  }}
                  sx={{
                    border: "none",
                    background: "transparent",
                    outline: "none",
                    padding: "8px 0",
                    "& .MuiOutlinedInput-root": {
                      border: "none",
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                      border: "none",
                    },
                  }}
                />
              </Box>
              <Box sx={{ display: "flex", gap: 3 }}>
                <IconButton sx={{ bgcolor: "white" }} onClick={onClose}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </Box>

            <Box
              sx={{
                bgcolor: "white",
                borderRadius: 1,
                mb: 2,
                overflow: "auto",
                minHeight: "300px", // Set a min height for consistency
              }}
            >
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell width="50%">
                      <Typography fontWeight={700}>ຊື່ໂຟເດີ້</Typography>
                    </TableCell>
                    <TableCell width="20%">
                      <Typography fontWeight={700}>ແກ້ໄຂລ່າສຸດ</Typography>
                    </TableCell>
                    <TableCell width="30%">
                      <Typography fontWeight={700}>ສະຖານະ</Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={3} align="center" sx={{ py: 4 }}>
                        <CircularProgress />
                      </TableCell>
                    </TableRow>
                  ) : error ? (
                    <TableRow>
                      <TableCell
                        colSpan={3}
                        align="center"
                        sx={{ py: 4, color: "error.main" }}
                      >
                        <Typography>{error}</Typography>
                      </TableCell>
                    </TableRow>
                  ) : filteredData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} align="center" sx={{ py: 4 }}>
                        <Typography>
                          {searchTerm
                            ? "No matching folders found"
                            : "No folders available"}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredData.map((file, index) => (
                      <TableRow
                        key={file._id || index}
                        sx={{
                          "&:hover": { bgcolor: "#e0e0e0" },
                          cursor: "pointer",
                          height: 80,
                          bgcolor: selectedFolderId === file._id ? "#e0e0e0" : "transparent",
                        }}
                        onClick={() => setSelectedFolderId(file._id || "")}
                      >
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            {file?.type === "folder" ? (
                              <FolderIcon sx={{ color: "#ffd54f", mr: 1 }} />
                            ) : (
                              <ArticleIcon sx={{ color: "#2196f3", mr: 1 }} />
                            )}
                            <Box>
                              <Typography>
                                {file?.name} {file?.isShared && "(Shared)"}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {file?.lastModified}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={file?.status}
                            sx={{
                              bgcolor: getStatusColor(file?.status),
                              color: getTextColor(file?.status ?? 'black'),
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
                <TableFooter sx={{ height: 50 }}></TableFooter>
              </Table>
            </Box>
          </Box>
        </Box>

        <Box
          sx={{ display: "flex", justifyContent: "flex-end", mt: 2, gap: 2 }}
        >
          <Button
            onClick={() => onMove(selectedFolderId || "")}
            disabled={loading || !selectedFolderId}
            sx={{
              textTransform: "none",
              bgcolor: "#2C3E50",
              color: "white",
              borderRadius: "8px",
              "&:hover": {
                bgcolor: "#6d0000",
              },
              px: 3,
            }}
          >
            ຍ້າຍ
          </Button>
          <Button
            variant="outlined"
            onClick={onClose}
            sx={{
              border: "1px solid #838383",
              textTransform: "none",
              color: "#021016",
              mr: 1,
              borderRadius: "8px",
            }}
          >
            ຍົກເລີກ
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
};

export default MoveDialog;