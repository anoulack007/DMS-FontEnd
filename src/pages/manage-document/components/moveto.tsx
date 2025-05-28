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
import axiosInstance from "../../../configs/axios";
import { MOVE_FOLDER_END_POINT } from "../../../configs/endPoint/folder-endpoint";
import { MOVE_FILE_END_POINT } from "../../../configs/endPoint/files-endpoint";
import eventBus from "../../../utils/functions/eventBus";

interface MoveDialogProps {
  open: boolean;
  onClose: () => void;
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
  id?: string;
  isShared?: boolean;
  path?: string;
  parentId?: string;
}

const MoveDialog: React.FC<MoveDialogProps> = ({
  open,
  onClose,
  selectedCount,
}) => {
  const [fileData, setFileData] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [_currentFolderId, setCurrentFolderId] = useState<string | null>(null);
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

  const fetchRootFolders = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(GET_OWNER_DOC_END_POINT);
      const responseData = response?.data?.data;

      if (!responseData) {
        throw new Error("No data received from API");
      }

      const processedData: FileItem[] = [];

      // Process normal folders - filter only root folders (no parentId)
      if (responseData.folders && Array.isArray(responseData.folders)) {
        responseData.folders
          .filter((folder: any) => !folder.parentId) // Filter only root folders
          .forEach((folder: any) => {
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
        responseData.folder
          .filter((folder: any) => !folder.parentId) // Filter only root folders
          .forEach((folder: any) => {
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
        // Only add if it's a root folder
        if (!folder.parentId) {
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
      }

      // Process folderMembers (shared folders) - filter only root folders
      if (
        responseData.folderMembers &&
        Array.isArray(responseData.folderMembers)
      ) {
        responseData.folderMembers
          .filter((folderMember: any) => 
            folderMember.folder && !folderMember.folder.parentId
          )
          .forEach((folderMember: any) => {
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
                status: folderMember?.folder?. status || "Unknown status",
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
        setCurrentFolderId(newFolderId);
        setSelectedFolderId(null); // Reset selection

        // Store current folder and parent ID in localStorage
        localStorage.setItem("destinationFolderId", newFolderId);

        // Get parent ID from the current folder data if available
        if (folder.parentId) {
          localStorage.setItem("currentParentId", folder.parentId);
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
      setCurrentFolderId(target.id);
      setSelectedFolderId(null);

      if (target.path === "root") {
        fetchRootFolders();
      } else {
        fetchFoldersByPath(target.path);
      }
    }
  }, [pathHistory, fetchRootFolders, fetchFoldersByPath]);

  const handleMove = async () => {
  onClose();

  const destinationFolderId = localStorage.getItem("destinationFolderId");
  const originFolderId = localStorage.getItem("selectedDocumentId") || null;
  const docType = localStorage.getItem("selectedDocumentType") || null;
  // const originItemParentId = localStorage.getItem("currentParentId") || null;
  const documentId = localStorage.getItem("selectedDocumentNumber") || null;

  // Validation checks
  if (!originFolderId) {
    Swal.fire({
      title: "ບໍ່ໄດ້ເລືອກເອກະສານ",
      text: "ກະລຸນາເລືອກເອກະສານທີ່ຕ້ອງການຍ້າຍ",
      icon: "warning",
      confirmButtonText: "ຕົກລົງ",
      confirmButtonColor: "#2C3E50",
    });
    return;
  }

  if (!docType) {
    Swal.fire({
      title: "ປະເພດເອກະສານບໍ່ຖືກຕ້ອງ",
      text: "ບໍ່ສາມາດລະບຸປະເພດເອກະສານໄດ້",
      icon: "warning",
      confirmButtonText: "ຕົກລົງ",
      confirmButtonColor: "#2C3E50",
    });
    return;
  }

  // if (destinationFolderId === originItemParentId) {
  //   Swal.fire({
  //     title: "ບໍ່ສາມາດຍ້າຍໄດ້",
  //     text: `ເອກະສານຢູ່ໃນໂຟເດີ້ດຽວກັນແລ້ວ`,
  //     icon: "warning",
  //     confirmButtonText: "ຕົກລົງ",
  //     confirmButtonColor: "#2C3E50",
  //   });
  //   return;
  // }// Check if moving to the same folder
  

  // Confirm before moving
  const result = await Swal.fire({
    title: "ຢືນຢັນການຍ້າຍ",
    text: `ທ່ານຕ້ອງການຍ້າຍ${docType === "folder" ? "ໂຟເດີ້" : "ເອກະສານ"}${
      !destinationFolderId ? "ໄປຍັງໂຟເດີ້ຫຼັກ" : "ໄປຍັງໂຟເດີ້ທີ່ເລືອກ"
    }ບໍ່?`,
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

    // Show loading state
    Swal.fire({
      title: "ກຳລັງຍ້າຍ...",
      text: "ກະລຸນາລໍຖ້າ",
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    let res;
    console.log(res)

    if (docType === "folder") {
      res = await axiosInstance.patch(
        `${MOVE_FOLDER_END_POINT}/${originFolderId}`,
        {
          destinationFolderId: destinationFolderId || null,
        }
      );
    } else {
      res = await axiosInstance.patch(
        `${MOVE_FILE_END_POINT}`,
        {
          folderId: destinationFolderId || null,
          documentId: documentId, // Added the documentId to payload
        }
      );
    }

    Swal.fire({
      title: "ຍ້າຍສຳເລັດ",
      text: `ຍ້າຍ${docType === "folder" ? "ໂຟເດີ້" : "ເອກະສານ"}${
        !destinationFolderId ? "ໄປຍັງໂຟເດີ້ຫຼັກ" : ""
      }ສຳເລັດແລ້ວ`,
      icon: "success",
      confirmButtonText: "ຕົກລົງ",
      confirmButtonColor: "#2C3E50",
    });

    eventBus.publish("DOCUMNETS_UPDATED", true);

    // Clean up localStorage after successful operation
    localStorage.removeItem("selectedDocumentId");
    localStorage.removeItem("selectedDocumentType");
    localStorage.removeItem("destinationFolderId");
    localStorage.removeItem("currentParentId");
  } catch (error: any) {
    console.error("Error moving items:", error);
    Swal.fire({
      title: "ເກີດຂໍ້ຜິດພາດ",
      text:
        error.response?.data?.message ||
        "ບໍ່ສາມາດຍ້າຍລາຍການໄດ້ ກະລຸນາລອງໃໝ່ອີກຄັ້ງ",
      icon: "error",
      confirmButtonText: "ຕົກລົງ",
      confirmButtonColor: "#2C3E50",
    });
  } finally {
    setMovingFiles(false);
  }
};

  // Filter files based on search term
  const filteredData = fileData.filter((file) => {
    // Filter by search term
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Get the ID of the currently selected document
    const selectedDocumentId = localStorage.getItem("selectedDocumentId");
    
    // Exclude the current folder/file from the list
    const isNotCurrentItem = file._id !== selectedDocumentId;
    
    return matchesSearch && isNotCurrentItem;
  });

  useEffect(() => {
    if (open) {
      // Reset path and fetch root folders
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
