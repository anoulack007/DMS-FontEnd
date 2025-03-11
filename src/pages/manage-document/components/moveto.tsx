import React, { useState, useEffect, useCallback } from "react";
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
  Breadcrumbs,
  Link,
} from "@mui/material";
import Swal from "sweetalert2";

// Icons
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import FolderIcon from "@mui/icons-material/Folder";
import ArticleIcon from "@mui/icons-material/Article";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { GET_OWNER_DOC_END_POINT } from "../../../configs/endPoint/file&folder";
import { getStatusColor, getTextColor } from "../../../utils/functions/color";

interface MoveDialogProps {
  open: boolean;
  onClose: () => void;
  onMove: (targetFolderId: string, targetFolderPath: string) => void;
  selectedCount: number;
  selectedItems?: Array<{ id: string; type: "file" | "folder" }>; // Track both file and folder IDs with their types
}

// File type interface
interface FileItem {
  type: string;
  name: string;
  size: string;
  lastModified: string;
  status: string;
  _id?: string;
  id?: string;
  isShared?: boolean;
  path?: string;
  parentId?: string;
}

const MoveDialog: React.FC<MoveDialogProps> = ({
  open,
  onClose,
  onMove,
  selectedCount,
  selectedItems = [],
}) => {
  const [fileData, setFileData] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [currentFolderPath, setCurrentFolderPath] = useState<string>("root");
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [pathHistory, setPathHistory] = useState<
    Array<{ path: string; id: string; name: string }>
  >([{ path: "root", id: "", name: "Root" }]);
  const [movingFiles, setMovingFiles] = useState<boolean>(false);

  // Function to fetch folders by path
  const fetchFoldersByPath = useCallback(async (path: string) => {
    try {
      setLoading(true);
      const encodedPath = encodeURIComponent(path);
      const response = await axios.get(`/folders/path/${encodedPath}`);
      const responseData = response?.data?.data || response?.data;

      if (!responseData) {
        throw new Error("No data received from API");
      }

      const processedData: FileItem[] = [];

      // Process subfolders
      if (responseData.subFolders && Array.isArray(responseData.subFolders)) {
        responseData.subFolders.forEach((subfolder: any) => {
          processedData.push({
            type: "folder",
            name: subfolder.name || "Unnamed folder",
            size: subfolder.size ? `${subfolder.size} bytes` : "Unknown size",
            lastModified: subfolder.updatedAt
              ? new Date(subfolder.updatedAt).toLocaleDateString()
              : "Unknown date",
            _id: subfolder.id || subfolder._id,
            id: subfolder.id || subfolder._id,
            status: subfolder?.status || "Unknown status",
            path: subfolder.path || path + "/" + subfolder.name,
            parentId: subfolder.parentId,
          });
        });
      }

      setFileData(processedData);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch folders by path:", err);
      setError("Failed to load folders. Please try again later.");
      setFileData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Function to fetch root folders
  const fetchRootFolders = useCallback(async () => {
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
            id: folder.id || folder._id,
            status: folder?.status,
            path: folder.path || "/" + folder.name,
            parentId: folder.parentId,
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
            id: folder.id || folder._id,
            status: folder?.status,
            path: folder.path || "/" + folder.name,
            parentId: folder.parentId,
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
          id: folder.id || folder._id,
          status: folder?.status,
          path: folder.path || "/" + folder.name,
          parentId: folder.parentId,
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
              id: folderMember.folder.id || folderMember.folder._id,
              isShared: true,
              status: folderMember?.status || "Unknown status",
              path: folderMember.folder.path || "/" + folderMember.folder.name,
              parentId: folderMember.folder.parentId,
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
  }, []);

  // Handle folder double click
  // Handle folder double click
const handleFolderDoubleClick = useCallback(
  (folder: FileItem) => {
    if (folder.type === "folder") {
      const newPath = folder.path || `/${folder.name}`;
      const newFolderId = folder._id || folder.id || "";
      const folderName = folder.name;

      // Add to path history
      setPathHistory((prev) => [
        ...prev,
        {
          path: newPath,
          id: newFolderId,
          name: folderName,
        },
      ]);

      // Update current path and ID
      setCurrentFolderPath(newPath);
      setCurrentFolderId(newFolderId);
      setSelectedFolderId(null); // Reset selection

      // Store current folder and parent ID in localStorage
      localStorage.setItem('currentFolderId', newFolderId);
      localStorage.setItem('currentFolderPath', newPath);
      
      // Get parent ID from the current folder data if available
      if (folder.parentId) {
        localStorage.setItem('currentParentId', folder.parentId);
      }

      // Fetch folders at new path
      fetchFoldersByPath(newPath);
    }
  },
  [fetchFoldersByPath]
);

  // Navigate to a specific breadcrumb
  const handleBreadcrumbClick = useCallback(
    (index: number) => {
      if (index >= 0 && index < pathHistory.length) {
        const targetHistory = pathHistory.slice(0, index + 1);
        const target = targetHistory[index];

        setPathHistory(targetHistory);
        setCurrentFolderPath(target.path);
        setCurrentFolderId(target.id);
        setSelectedFolderId(null);

        if (target.path === "root") {
          fetchRootFolders();
        } else {
          fetchFoldersByPath(target.path);
        }
      }
    },
    [pathHistory, fetchRootFolders, fetchFoldersByPath]
  );

  // Navigate back
  const handleGoBack = useCallback(() => {
    if (pathHistory.length > 1) {
      const newHistory = pathHistory.slice(0, -1);
      const target = newHistory[newHistory.length - 1];

      setPathHistory(newHistory);
      setCurrentFolderPath(target.path);
      setCurrentFolderId(target.id);
      setSelectedFolderId(null);

      if (target.path === "root") {
        fetchRootFolders();
      } else {
        fetchFoldersByPath(target.path);
      }
    }
  }, [pathHistory, fetchRootFolders, fetchFoldersByPath]);

  // Function to handle moving files and folders
  // Function to handle moving files and folders
  const handleMove = async () => {
    if (!selectedFolderId && currentFolderId === null) {
      // Cannot move to root directly, must select a folder
      Swal.fire({
        title: "ເລືອກໂຟເດີ້",
        text: "ກະລຸນາເລືອກໂຟເດີ້ປາຍທາງ",
        icon: "warning",
        confirmButtonText: "ຕົກລົງ",
        confirmButtonColor: "#2C3E50",
      });
      return;
    }

    // Confirm before moving
    const result = await Swal.fire({
      title: "ຢືນຢັນການຍ້າຍ",
      text: `ທ່ານຕ້ອງການຍ້າຍ ${selectedCount} ລາຍການໄປຍັງໂຟເດີ້ທີ່ເລືອກບໍ່?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "ຍ້າຍ",
      cancelButtonText: "ຍົກເລີກ",
      confirmButtonColor: "#2C3E50",
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      setMovingFiles(true);

      // Get the target folder ID (either selected folder or current folder)
      const targetFolderId = selectedFolderId || currentFolderId || "";
      const targetFolder = fileData.find(
        (item) => (item._id || item.id) === targetFolderId
      );
      const targetPath = targetFolder?.path || currentFolderPath;

      // Process each selected item
      const movePromises = selectedItems.map(async (item) => {
        try {
          if (item.type === "folder") {
            // Moving a folder - update its parent ID
            const response = await axios.patch(`/folders/${item.id}`, {
              parentId: targetFolderId,
            });
            return response;
          } else {
            // Moving a file - update its folder ID
            const response = await axios.patch(`/files/update/${item.id}`, {
              folderId: targetFolderId,
            });
            return response;
          }
        } catch (error) {
          console.error(`Error moving item ${item.id}:`, error);
          throw error;
        }
      });

      // Wait for all move operations to complete
      await Promise.all(movePromises);

      // Success message
      Swal.fire({
        title: "ຍ້າຍສຳເລັດ",
        text: `ຍ້າຍ ${selectedCount} ລາຍການສຳເລັດແລ້ວ`,
        icon: "success",
        confirmButtonText: "ຕົກລົງ",
        confirmButtonColor: "#2C3E50",
      });

      // Notify parent component that the move has completed
      onMove(targetFolderId, targetPath);
      onClose();
    } catch (error) {
      console.error("Error moving items:", error);
      Swal.fire({
        title: "ເກີດຂໍ້ຜິດພາດ",
        text: "ບໍ່ສາມາດຍ້າຍລາຍການໄດ້ ກະລຸນາລອງໃໝ່ອີກຄັ້ງ",
        icon: "error",
        confirmButtonText: "ຕົກລົງ",
        confirmButtonColor: "#2C3E50",
      });
    } finally {
      setMovingFiles(false);
    }
  };

  // Filter files based on search term
  const filteredData = fileData.filter((file) =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (open) {
      // Reset path and fetch root folders
      setCurrentFolderPath("root");
      setCurrentFolderId(null);
      setSelectedFolderId(null);
      setPathHistory([{ path: "root", id: "", name: "Root" }]);
      fetchRootFolders();
    }
  }, [open, fetchRootFolders]);

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
                justifyContent: "space-between",
                mb: 2,
                gap: 2,
              }}
            >
              {/* Back button */}
              <IconButton
                sx={{ bgcolor: "white" }}
                onClick={handleGoBack}
                disabled={pathHistory.length <= 1}
              >
                <ArrowBackIcon />
              </IconButton>

              {/* Breadcrumbs navigation */}
              <Box sx={{ flex: 1, overflow: "hidden" }}>
                <Breadcrumbs maxItems={3} sx={{ ml: 1 }}>
                  {pathHistory.map((item, index) => (
                    <Link
                      key={index}
                      component="button"
                      variant="body2"
                      onClick={() => handleBreadcrumbClick(index)}
                      color="inherit"
                      underline="hover"
                      sx={{
                        cursor: "pointer",
                        fontWeight:
                          index === pathHistory.length - 1 ? "bold" : "normal",
                      }}
                    >
                      {item.name}
                    </Link>
                  ))}
                </Breadcrumbs>
              </Box>

              {/* Search */}
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
                            ? "ບໍ່ພົບໂຟເດີ້ທີ່ກົງກັບການຄົ້ນຫາ"
                            : "ບໍ່ມີໂຟເດີ້"}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredData.map((file, index) => (
                      <TableRow
                        key={file._id || file.id || index}
                        sx={{
                          "&:hover": { bgcolor: "#e0e0e0" },
                          cursor: "pointer",
                          height: 80,
                          bgcolor:
                            selectedFolderId === (file._id || file.id)
                              ? "#e0e0e0"
                              : "transparent",
                        }}
                        onClick={() =>
                          setSelectedFolderId(file._id || file.id || "")
                        }
                        onDoubleClick={() => handleFolderDoubleClick(file)}
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
                                {file?.name}{" "}
                                <span
                                  style={{ color: "green", fontWeight: 700 }}
                                >
                                  {file?.isShared && "(Shared)"}
                                </span>
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
                              color: getTextColor(file?.status ?? "black"),
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
            onClick={handleMove}
            disabled={loading || movingFiles}
            sx={{
              textTransform: "none",
              bgcolor: "#2C3E50",
              color: "white",
              borderRadius: "8px",
              "&:hover": {
                bgcolor: "#1C2E40",
              },
              px: 3,
            }}
          >
            {movingFiles ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "ຍ້າຍ"
            )}
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
