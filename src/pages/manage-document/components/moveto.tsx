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
import { useSelector } from "react-redux";
import { RootState } from "../../../store";

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
  ownerId?: string;
  members?: any[];
  folderMembers?: any;
  owner?: any;
  isAccessible?: boolean; // New field to track accessibility
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
  >([{ path: "root", id: "", name: "ໜ້າຫຼັກ" }]); // Changed from "Root" to "ໜ້າຫຼັກ"
  const [movingFiles, setMovingFiles] = useState<boolean>(false);

  const currentUserId = useSelector((state: RootState) => state.auth.data);

  const validateFolderAccess = (folder: any): FileItem | null => {
    const userId = currentUserId?.id;
    let isAccessible = false;
    let shouldShowFolder = true;

    if (!userId || !folder) {
      return null;
    }

    const isOwner =
      folder.ownerId === userId ||
      folder.owner?.id === userId ||
      folder.owner?._id === userId ||
      folder.owner === userId ||
      (folder.createdBy &&
        (folder.createdBy === userId ||
          folder.createdBy.id === userId ||
          folder.createdBy._id === userId));

    const isMember = checkMembership(folder, userId);

    if (isOwner || isMember) {
      isAccessible = true;
      shouldShowFolder = true;
    } else if (folder.status === "PUBLIC" || folder.visibility === "PUBLIC") {
      isAccessible = false;
      shouldShowFolder = true;
    } else {
      shouldShowFolder = false;
    }

    if (!shouldShowFolder) {
      return null;
    }

    return {
      type: folder.type || "folder",
      name: folder.name || "Unnamed folder",
      size: folder.size ? `${folder.size} bytes` : "Unknown size",
      lastModified: folder.updatedAt
        ? new Date(folder.updatedAt).toLocaleDateString()
        : "Unknown date",
      _id: folder.id || folder._id,
      id: folder.id || folder._id,
      status: folder.status || "Unknown status",
      path: folder.path || "/" + folder.name,
      parentId: folder.parentId,
      ownerId: folder.ownerId,
      members: folder.members,
      folderMembers: folder.folderMembers,
      owner: folder.owner,
      isShared: folder.isShared || false,
      isAccessible: isAccessible,
    };
  };

  const checkMembership = (folder: any, userId: any): boolean => {
    if (!userId || !folder) return false;

    const isUserMatch = (user: any): boolean => {
      if (!user) return false;

      if (user === userId) return true;

      if (user.id === userId) return true;

      if (user.userId === userId) return true;

      if (user._id === userId) return true;

      return false;
    };

    // Check direct members array (based on your API structure)
    if (folder.members && Array.isArray(folder.members)) {
      const isMember = folder.members.some((member: any) => {
        if (member.user) {
          const userMatch = isUserMatch(member.user);
          return userMatch;
        }

        return isUserMatch(member);
      });

      console.log("Members check result:", isMember);
      if (isMember) return true;
    }

    if (folder.folderMembers) {
      if (folder.folderMembers.user) {
        if (isUserMatch(folder.folderMembers.user)) return true;
      }

      if (isUserMatch(folder.folderMembers)) return true;

      if (Array.isArray(folder.folderMembers)) {
        const isMember = folder.folderMembers.some((member: any) => {
          if (member.user && isUserMatch(member.user)) return true;
          return isUserMatch(member);
        });
        if (isMember) return true;
      }
    }

    if (folder.files && Array.isArray(folder.files)) {
      const hasFileAccess = folder.files.some((file: any) => {
        if (file.owner && isUserMatch(file.owner)) return true;

        if (file.members && Array.isArray(file.members)) {
          return file.members.some((member: any) => {
            if (member.user) {
              return isUserMatch(member.user);
            }
            return isUserMatch(member);
          });
        }

        return false;
      });
      if (hasFileAccess) return true;
    }

    if (folder.owner && isUserMatch(folder.owner)) return true;

    return false;
  };
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

      if (responseData.subFolders && Array.isArray(responseData.subFolders)) {
        responseData.subFolders.forEach((subfolder: any) => {
          const validatedFolder = validateFolderAccess({
            ...subfolder,
            type: "folder",
          });
          if (validatedFolder !== null) {
            processedData.push(validatedFolder);
          }
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

      if (responseData.folders && Array.isArray(responseData.folders)) {
        responseData.folders
          .filter((folder: any) => !folder.parentId) // Filter only root folders
          .forEach((folder: any) => {
            const validatedFolder = validateFolderAccess({
              ...folder,
              type: "folder",
            });
            if (validatedFolder !== null) {
              processedData.push(validatedFolder);
            }
          });
      } else if (responseData.folder && Array.isArray(responseData.folder)) {
        responseData.folder
          .filter((folder: any) => !folder.parentId) // Filter only root folders
          .forEach((folder: any) => {
            const validatedFolder = validateFolderAccess({
              ...folder,
              type: "folder",
            });
            if (validatedFolder !== null) {
              processedData.push(validatedFolder);
            }
          });
      } else if (responseData.folder && !Array.isArray(responseData.folder)) {
        const folder = responseData.folder;
        if (!folder.parentId) {
          const validatedFolder = validateFolderAccess({
            ...folder,
            type: "folder",
          });
          if (validatedFolder !== null) {
            processedData.push(validatedFolder);
          }
        }
      }

      if (
        responseData.folderMembers &&
        Array.isArray(responseData.folderMembers)
      ) {
        responseData.folderMembers
          .filter(
            (folderMember: any) =>
              folderMember.folder && !folderMember.folder.parentId
          )
          .forEach((folderMember: any) => {
            if (folderMember.folder) {
              const validatedFolder = validateFolderAccess({
                ...folderMember.folder,
                type: "folder",
                isShared: true,
                folderMembers: folderMember,
              });
              if (validatedFolder !== null) {
                processedData.push(validatedFolder);
              }
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
      if (!folder.isAccessible) {
        Swal.fire({
          title: "ບໍ່ສາມາດເຂົ້າເຖິງໄດ້",
          text: "ທ່ານບໍ່ມີສິດເຂົ້າເຖິງໂຟເດີ້ນີ້",
          icon: "warning",
          confirmButtonText: "ຕົກລົງ",
          confirmButtonColor: "#2C3E50",
        });
        return;
      }

      if (folder.type === "folder") {
        const newPath = folder.path || `/${folder.name}`;
        const newFolderId = folder._id || folder.id || "";
        const folderName = folder.name;

        setPathHistory((prev) => [
          ...prev,
          {
            path: newPath,
            id: newFolderId,
            name: folderName,
          },
        ]);

        setCurrentFolderId(newFolderId);
        setSelectedFolderId(null); // Reset selection

        localStorage.setItem("destinationFolderId", newFolderId);

        if (folder.parentId) {
          localStorage.setItem("currentParentId", folder.parentId);
        }

        fetchFoldersByPath(newPath);
      }
    },
    [fetchFoldersByPath]
  );

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

    // Check if destination folder is accessible (if one is selected)
    if (destinationFolderId) {
      const destinationFolder = fileData.find(
        (f) => (f._id || f.id) === destinationFolderId
      );
      if (destinationFolder && !destinationFolder.isAccessible) {
        Swal.fire({
          title: "ບໍ່ສາມາດຍ້າຍໄດ້",
          text: "ທ່ານບໍ່ມີສິດຍ້າຍໄປຍັງໂຟເດີ້ນີ້",
          icon: "warning",
          confirmButtonText: "ຕົກລົງ",
          confirmButtonColor: "#2C3E50",
        });
        return;
      }
    }

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
      console.log(res);

      if (docType === "folder") {
        res = await axiosInstance.patch(
          `${MOVE_FOLDER_END_POINT}/${originFolderId}`,
          {
            destinationFolderId: destinationFolderId || null,
          }
        );
      } else {
        res = await axiosInstance.patch(`${MOVE_FILE_END_POINT}`, {
          folderId: destinationFolderId || null,
          documentId: documentId,
        });
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

  // Filter files based on search term and accessibility
  const filteredData = fileData.filter((file) => {
    // Filter by search term
    const matchesSearch = file.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    // Get the ID of the currently selected document
    const selectedDocumentId = localStorage.getItem("selectedDocumentId");

    // Exclude the current folder/file from the list
    const isNotCurrentItem = file._id !== selectedDocumentId;

    return matchesSearch && isNotCurrentItem;
  });

  // Separate accessible and inaccessible folders for rendering
  const accessibleFolders = filteredData.filter(
    (folder) => folder.isAccessible
  );
  const inaccessibleFolders = filteredData.filter(
    (folder) => !folder.isAccessible
  );

  useEffect(() => {
    if (open) {
      // Reset path and fetch root folders
      setCurrentFolderId(null);
      setSelectedFolderId(null);
      setPathHistory([{ path: "root", id: "", name: "ໜ້າຫຼັກ" }]); // Changed from "Root" to "ໜ້າຫຼັກ"
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
                minHeight: "300px",
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
                    <>
                      {/* Render accessible folders first */}
                      {accessibleFolders.map((file, index) => (
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
                      ))}

                      {/* Render inaccessible folders with reduced opacity */}
                      {inaccessibleFolders.map((file, index) => (
                        <TableRow
                          key={`inaccessible-${file._id || file.id || index}`}
                          sx={{
                            opacity: 0.4, // Reduced opacity for inaccessible folders
                            cursor: "not-allowed",
                            height: 80,
                            "&:hover": { bgcolor: "rgba(224, 224, 224, 0.3)" },
                          }}
                          onClick={(e) => {
                            e.preventDefault();
                            // Show tooltip or do nothing for inaccessible folders
                          }}
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
                                    style={{
                                      color: "red",
                                      fontWeight: 400,
                                      fontSize: "0.8em",
                                    }}
                                  >
                                    (ບໍ່ສາມາດເຂົ້າເຖິງໄດ້)
                                  </span>
                                  <span
                                    style={{ color: "green", fontWeight: 700 }}
                                  >
                                    {file?.isShared && " (Shared)"}
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
                                opacity: 0.7,
                              }}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </>
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
