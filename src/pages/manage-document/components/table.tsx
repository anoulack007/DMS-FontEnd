import React from "react";
import { useSelector } from "react-redux";
import {
  Box,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  Checkbox,
  Chip,
  CircularProgress,
  Paper,
  TablePagination,
  TableFooter,
  IconButton,
  Tooltip,
} from "@mui/material";
import PanoramaFishEyeIcon from "@mui/icons-material/PanoramaFishEye";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import LockIcon from "@mui/icons-material/Lock";
import NO_DATA_IC from "../../../assets/logo/NotData.svg";
import { getFileTypeFromName } from "../../../utils/functions/typefile";
import { UserInterface } from "../../../store/authenticationSlice";
import { Document } from "../../../models/Document";

interface DocumentTableProps {
  ctrl: any;
  isAnyItemSelected: boolean;
  getIconByType: (type: string) => React.ReactNode;
  formatFileSize: (size: number) => string;
  getStatusColor: (status: string) => string;
  getTextColor: (status: string) => string;
  handleUploadVersion?: (documentNumber: string) => void;
}

const DocumentTable: React.FC<DocumentTableProps> = ({
  ctrl,
  isAnyItemSelected,
  getIconByType,
  formatFileSize,
  getStatusColor,
  getTextColor,
  handleUploadVersion,
}) => {
  // Get current user from Redux store
  const currentUser = useSelector(
    (state: { auth: UserInterface }) => state.auth.data
  );

 const validateItemAccess = (item: Document): { 
  canView: boolean; 
  canModify: boolean; 
  canSelect: boolean;
  canNavigate: boolean; // New property
  showLockIcon: boolean;
  isOwner: boolean;
  isMember: boolean;
  accessLevel: 'owner' | 'member' | 'public-readonly' | 'no-access';
} => {
  // If no current user, deny all access
  if (!currentUser?.id) {
    return { 
      canView: false, 
      canModify: false, 
      canSelect: false,
      canNavigate: false, // New property
      showLockIcon: true,
      isOwner: false,
      isMember: false,
      accessLevel: 'no-access'
    };
  }

  const currentUserId = currentUser.id;
  let canView = false;
  let canModify = false;
  let canSelect = false;
  let canNavigate = false; // New property
  let showLockIcon = false;
  let accessLevel: 'owner' | 'member' | 'public-readonly' | 'no-access' = 'no-access';

  // Check if user is the owner
  const isOwner = item.owner?.id === currentUserId || 
                  item.ownerId === currentUserId;
  
  // Check if user is a member
  let isMember = false;
  
  if (item.itemType === "file") {
    // Check file membership - handle both array and single object cases
    isMember = 
      item.fileMember?.user?.id === currentUserId ||
      item.fileMember?.userId === currentUserId ||
      // Check if fileMembers is an array
      (Array.isArray(item.fileMember) && 
        item.fileMember.some((member: any) => 
          member.user?.id === currentUserId || member.userId === currentUserId
        )
      ) ||
      // Check if fileMembers is a single object
      (!Array.isArray(item.fileMember) && item.fileMember && (
        item.fileMember.user?.id === currentUserId ||
        item.fileMember.userId === currentUserId
      ));
  } else if (item.itemType === "folder") {
    // Check folder membership - handle both array and single object cases
    isMember = 
      // Check if members is an array
      (Array.isArray(item.members) && 
        item.members.some((member: any) => 
          member.user?.id === currentUserId || 
          member.userId === currentUserId ||
          member.id === currentUserId
        )
      ) ||
      // Check if members is a single object
      (!Array.isArray(item.members) && item.members && (
        item.members.user?.id === currentUserId ||
        item.members.userId === currentUserId 
      )) ||
      // Check folderMembers (single object)
      item.folderMembers?.user?.id === currentUserId ||
      item.folderMembers?.userId === currentUserId;
  }

  // Owner can do everything
  if (isOwner) {
    canView = true;
    canModify = true;
    canSelect = true;
    canNavigate = true; // Owners can navigate
    showLockIcon = false;
    accessLevel = 'owner';
  }
  // Member can do everything like owner
  else if (isMember) {
    canView = true;
    canModify = true;
    canSelect = true;
    canNavigate = true; // Members can navigate
    showLockIcon = false;
    accessLevel = 'member';
  }
  // For PUBLIC documents, non-members can only view
  else if (item.status === "PUBLIC") {
    canView = true;
    canModify = false;
    canSelect = false; // Cannot select public documents if not owner/member
    canNavigate = false; // Cannot navigate into public folders if not owner/member
    showLockIcon = true;
    accessLevel = 'public-readonly';
  }
  // For PRIVATE documents, non-members have no access
  else if (item.status === "PRIVATE") {
    canView = false;
    canModify = false;
    canSelect = false;
    canNavigate = false; // Cannot navigate into private folders
    showLockIcon = true;
    accessLevel = 'no-access';
  }
  // Default case - no access
  else {
    canView = false;
    canModify = false;
    canSelect = false;
    canNavigate = false;
    showLockIcon = true;
    accessLevel = 'no-access';
  }

  return { canView, canModify, canSelect, canNavigate, showLockIcon, isOwner, isMember, accessLevel };
};
  // Enhanced handleSelectItem with validation
  const handleSelectItemWithValidation = (id: string) => {
    const item = ctrl.documents.find((doc: Document) => doc.id === id);

    if (!item) return;

    const access = validateItemAccess(item);

    // Check if user can select this item
    if (!access.canSelect) {
      let message =
        "Access denied: You do not have permission to select this item";

      if (access.accessLevel === "public-readonly") {
        message =
          "You can only view this public document but cannot select it. Only owners and members can select documents.";
      } else if (access.accessLevel === "no-access") {
        message = "You do not have permission to access this item.";
      }

      console.warn(message);

      // Show user-friendly message
      if (typeof ctrl.showAccessDeniedMessage === "function") {
        ctrl.showAccessDeniedMessage(access.accessLevel);
      }

      return;
    }

    // Call the original handleSelectItem
    ctrl.handleSelectItem(id);
  };

  // Enhanced handleFolderDoubleClick function
 const handleFolderDoubleClickWithValidation = (item: Document) => {
  const access = validateItemAccess(item);
  
  // Check if user can navigate into this folder
  if (!access.canNavigate) {
    let title = "ບໍ່ມີສິດເຂົ້າເຖິງ";
    console.log(title)
    let text = "ທ່ານບໍ່ມີສິດເຂົ້າເຖິງໂຟນເດີນີ້.";
    
    if (access.accessLevel === 'public-readonly') {
      title = "ການເຂົ້າເຖິງແບບຈຳກັດ";
      text = "ໂຟນເດີສາທາລະນະນີ້ສາມາດເບິ່ງໄດ້ແຕ່ບໍ່ສາມາດເຂົ້າໄປໃນໂຟນເດີໄດ້. ພຽງແຕ່ເຈົ້າຂອງແລະສະມາຊິກເທົ່ານັ້ນທີ່ສາມາດເຂົ້າໄປໃນໂຟນເດີໄດ້.";
    } else if (access.accessLevel === 'no-access') {
      text = "ທ່ານບໍ່ມີສິດເຂົ້າເຖິງໂຟນເດີນີ້.";
    }
    
    console.warn(text);
    
    return;
  }

  // If user can navigate, proceed with the original function
  ctrl.handleFolderDoubleClick(item);
};
  // Get row styling based on access level
  const getRowStyling = (
    accessLevel: string,
    canView: boolean,
    canSelect: boolean
  ) => {
    const baseStyle = {
      "&:last-child td, &:last-child th": { border: 0 },
      transition: "background-color 0.2s ease",
    };

    console.log(canView, canSelect)

    switch (accessLevel) {
      case "owner":
      case "member":
        return {
          ...baseStyle,
          "&:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.04)",
          },
          cursor: "pointer",
          opacity: 1,
        };

      case "public-readonly":
        return {
          ...baseStyle,
          "&:hover": {
            backgroundColor: "rgba(255, 165, 0, 0.1)",
          },
          cursor: "default",
          opacity: 0.30,
          // backgroundColor: "rgba(255, 165, 0, 0.05)",
        };

      case "no-access":
      default:
        return {
          ...baseStyle,
          "&:hover": {
            backgroundColor: "rgba(255, 0, 0, 0.1)",
          },
          cursor: "not-allowed",
          opacity: 0.5,
          backgroundColor: "rgba(255, 0, 0, 0.05)",
        };
    }
  };

  // Get paginated data
  const paginatedData = ctrl.documents.slice(
    ctrl.page * ctrl.rowsPerPage,
    ctrl.page * ctrl.rowsPerPage + ctrl.rowsPerPage
  );

  return (
    <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
      <TableContainer
        sx={{
          boxShadow: 3,
          borderRadius: 3,
        }}
        component={Paper}
      >
        <Table>
          <TableHead>
            <TableRow>
              {isAnyItemSelected && (
                <TableCell padding="checkbox">
                  <Checkbox
                    icon={<PanoramaFishEyeIcon sx={{ color: "gray" }} />}
                    checkedIcon={<CheckCircleIcon sx={{ color: "blue" }} />}
                    indeterminate={
                      ctrl?.selectedItems.length > 0 &&
                      ctrl?.selectedItems.length <
                        ctrl?.documents.filter((doc: Document) => {
                          const access = validateItemAccess(doc);
                          return access.canSelect;
                        }).length
                    }
                    checked={
                      ctrl?.documents.filter((doc: Document) => {
                        const access = validateItemAccess(doc);
                        return access.canSelect;
                      }).length > 0 &&
                      ctrl?.selectedItems.length ===
                        ctrl?.documents.filter((doc: Document) => {
                          const access = validateItemAccess(doc);
                          return access.canSelect;
                        }).length
                    }
                    onChange={ctrl?.handleSelectAll}
                  />
                </TableCell>
              )}
              <TableCell>
                <p style={{ fontWeight: "bold" }}>ຊື່ເອກະສານ</p>
              </TableCell>
              <TableCell>
                <p style={{ fontWeight: "bold" }}>ເວີຊັນ</p>
              </TableCell>
              <TableCell>
                <p style={{ fontWeight: "bold" }}>ປະເພດ</p>
              </TableCell>
              <TableCell>
                <p style={{ fontWeight: "bold" }}>ລະຫັດເອກະສານ</p>
              </TableCell>
              <TableCell>
                <p style={{ fontWeight: "bold" }}>ວັນທີແກ້ໄຂ</p>
              </TableCell>
              <TableCell>
                <p style={{ fontWeight: "bold" }}>ຂະໜາດໄຟລ໌</p>
              </TableCell>
              <TableCell>
                <p style={{ fontWeight: "bold" }}>ສະຖານະ</p>
              </TableCell>
              <TableCell>
                <p style={{ fontWeight: "bold" }}>ຈັດການ</p>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody sx={{ borderBottom: "1px solid #919EAB3D" }}>
            {ctrl?.loading ? (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : ctrl?.error ? (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  {ctrl?.error}
                </TableCell>
              </TableRow>
            ) : paginatedData.length > 0 ? (
              paginatedData.map((item: any) => {
                const access = validateItemAccess(item);

                return (
                  <TableRow
                    key={item?.id}
                    selected={ctrl?.isSelected(item.id) && access.canSelect}
                    onClick={() => {
                      if (access.canSelect) {
                        handleSelectItemWithValidation(item?.id);
                      }
                    }}
                    onDoubleClick={() => {
                      if (item.itemType === "folder" && access.canNavigate) {
                        handleFolderDoubleClickWithValidation(item);
                      }
                    }}
                    sx={getRowStyling(
                      access.accessLevel,
                      access.canView,
                      access.canSelect
                    )}
                  >
                    {(isAnyItemSelected || ctrl?.isSelected(item?.id)) && (
                      <TableCell
                        sx={{ borderBottom: "none" }}
                        padding="checkbox"
                      >
                        <Checkbox
                          icon={
                            <PanoramaFishEyeIcon
                              sx={{
                                color: access.canSelect
                                  ? "gray"
                                  : "rgba(0, 0, 0, 0.26)",
                              }}
                            />
                          }
                          checked={
                            ctrl?.isSelected(item?.id) && access.canSelect
                          }
                          onChange={() => {
                            if (access.canSelect) {
                              handleSelectItemWithValidation(item?.id);
                            }
                          }}
                          checkedIcon={
                            <CheckCircleIcon
                              sx={{
                                color: access.canSelect
                                  ? "blue"
                                  : "rgba(0, 0, 0, 0.26)",
                              }}
                            />
                          }
                          disabled={!access.canSelect}
                        />
                      </TableCell>
                    )}
                    <TableCell sx={{ borderBottom: "none" }}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        {getIconByType(
                          item.itemType === "file"
                            ? item.type || getFileTypeFromName(item.name)
                            : "folder"
                        )}
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                          }}
                        >
                          <Typography
                            sx={{
                              color:
                                access.accessLevel === "no-access"
                                  ? "rgba(0, 0, 0, 0.38)"
                                  : "inherit",
                            }}
                          >
                            {item?.name ?? item?.fileMembers?.file?.name}
                            {item?.isShared && (
                              <span
                                style={{
                                  color:
                                    access.accessLevel === "no-access"
                                      ? "rgba(0, 128, 0, 0.38)"
                                      : "green",
                                  marginLeft: "8px",
                                  fontWeight: 700,
                                }}
                              >
                                (Shared)
                              </span>
                            )}
                            {access.accessLevel === "no-access" && (
                              <span
                                style={{
                                  color: "red",
                                  marginLeft: "8px",
                                  fontWeight: 500,
                                  fontSize: "0.8em",
                                }}
                              >
                                (No Access)
                              </span>
                            )}
                          </Typography>
                          {access.showLockIcon && (
                            <LockIcon
                              sx={{
                                fontSize: 16,
                                color:
                                  access.accessLevel === "no-access"
                                    ? "rgba(255, 0, 0, 0.7)"
                                    : "orange",
                                ml: 0.5,
                              }}
                            />
                          )}
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell
                      sx={{
                        borderBottom: "none",
                        color:
                          access.accessLevel === "no-access"
                            ? "rgba(0, 0, 0, 0.38)"
                            : "inherit",
                      }}
                    >
                      {item?.version ?? "N/A"}
                    </TableCell>
                    <TableCell
                      sx={{
                        borderBottom: "none",
                        color:
                          access.accessLevel === "no-access"
                            ? "rgba(0, 0, 0, 0.38)"
                            : "inherit",
                      }}
                    >
                      {item.itemType === "file"
                        ? item.type || getFileTypeFromName(item.name)
                        : "folder"}
                    </TableCell>
                    <TableCell
                      sx={{
                        borderBottom: "none",
                        color:
                          access.accessLevel === "no-access"
                            ? "rgba(0, 0, 0, 0.38)"
                            : "inherit",
                      }}
                    >
                      {item?.document
                        ? item?.documentNumber ?? item?.documentId
                        : item?.documentId}
                    </TableCell>
                    <TableCell
                      sx={{
                        borderBottom: "none",
                        color:
                          access.accessLevel === "no-access"
                            ? "rgba(0, 0, 0, 0.38)"
                            : "inherit",
                      }}
                    >
                      {item.updatedAt
                        ? new Date(item.updatedAt).toLocaleDateString()
                        : ""}
                    </TableCell>
                    <TableCell
                      sx={{
                        borderBottom: "none",
                        color:
                          access.accessLevel === "no-access"
                            ? "rgba(0, 0, 0, 0.38)"
                            : "inherit",
                      }}
                    >
                      {item.size ? formatFileSize(Number(item.size)) : "N/A"}
                    </TableCell>
                    <TableCell sx={{ borderBottom: "none" }}>
                      <Chip
                        label={item.status}
                        sx={{
                          backgroundColor:
                            access.accessLevel === "no-access"
                              ? "rgba(0, 0, 0, 0.12)"
                              : getStatusColor(item.status),
                          borderRadius: "4px",
                          fontWeight: "normal",
                          color:
                            access.accessLevel === "no-access"
                              ? "rgba(0, 0, 0, 0.38)"
                              : getTextColor(item.status),
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ borderBottom: "none" }}>
                      {item.itemType === "file" && handleUploadVersion && (
                        <Tooltip
                          title={
                            access.accessLevel === "no-access"
                              ? "No Access"
                              : !access.canModify
                              ? "View Only Access"
                              : "ອັບໂຫຼດເວີຊັນໃໝ່"
                          }
                        >
                          <span>
                            <IconButton
                              color="primary"
                              onClick={(e) => {
                                if (access.canModify) {
                                  e.stopPropagation(); // Prevent row selection
                                  const docNumber =
                                    item?.documentNumber || item?.documentId;
                                  handleUploadVersion(docNumber);
                                }
                              }}
                              size="small"
                              disabled={!access.canModify}
                            >
                              <UploadFileIcon />
                            </IconButton>
                          </span>
                        </Tooltip>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow sx={{ height: "200px" }}>
                <TableCell colSpan={9} align="center">
                  <img height={"100px"} src={NO_DATA_IC} alt="No Data" />
                  <p>ບໍ່ມີຂໍ້ມູນ</p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={9} align="right">
                <TablePagination
                  component="div"
                  count={ctrl.documents.length}
                  page={ctrl.page}
                  onPageChange={ctrl.handleChangePage}
                  rowsPerPage={ctrl.rowsPerPage}
                  onRowsPerPageChange={ctrl.handleChangeRowsPerPage}
                  rowsPerPageOptions={[5, 10, 25, 50]}
                />
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default DocumentTable;
