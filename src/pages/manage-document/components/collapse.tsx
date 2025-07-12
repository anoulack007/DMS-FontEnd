// components/DocumentDetailsPanel.tsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Collapse,
  Paper,
  Typography,
  IconButton,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  Tooltip,
  Button,
  Badge,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import FoldeImage from "../../../assets/Image/image 11.png";
import Invite_IC from "../../../assets/logo/invite_ic.svg";
import { Version } from "../../../models/file-model";
import { MemberModel } from "../../../models/member-model";
import { STATUS_ENUMS } from "../../../enums/status-enum";
import { formatFileSize } from "../../../utils/functions/formarFile";
import { VersionListComponent } from "./versionDocList";
import { FileHistory } from "./historyFile";
import axiosInstance from "../../../configs/axios";
import Swal from "sweetalert2";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import eventBus from "../../../utils/functions/eventBus";
import { getIconByType } from "../../../utils/functions/inconUtils";
import {
  Document,
} from "../../../models/Document";

interface DocumentDetailsPanelProps {
  ctrl: {
    collapeOpen: boolean;
    selectedDocument: Document | null;
    setCollapseOpen: (open: boolean) => void;
    setSearchParams: (params: any) => void;
    handleChangeStatus: (event: any) => void;
    setInviteDialogOpen: (open: boolean) => void;
    versionDocument: Version[];
    fileHistory: Version[];
  };
}

export const DocumentDetailsPanel: React.FC<DocumentDetailsPanelProps> = ({
  ctrl,
}) => {
  const [showAllMembers, setShowAllMembers] = useState<boolean>(false);
  const [members, setMembers] = useState<MemberModel[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const toggleMemberDisplay = () => {
    setShowAllMembers(!showAllMembers);
  };

  const getMemberData = () => {
    const selectedDocument = ctrl.selectedDocument;
    if (!selectedDocument) {
      console.log("No document selected");
      setMembers([]);
      return;
    }

    // Extract members from the selectedDocument object
    let documentMembers: MemberModel[] = [];

    // Check if it's a folder or file and get members accordingly
    const isFolder =
      selectedDocument.itemType === "folder" ||
      selectedDocument.type === "folder" ||
      selectedDocument.isFolder;

    if (isFolder) {
      // For folders, use 'members' property
      if (selectedDocument.members && Array.isArray(selectedDocument.members)) {
        documentMembers = selectedDocument.members;
      }
    } else {
      // For files, use 'fileMember' property
      if (
        selectedDocument.fileMember &&
        Array.isArray(selectedDocument.fileMember)
      ) {
        documentMembers = selectedDocument.fileMember;
      }
    }

    console.log("Setting members data:", documentMembers);
    setMembers(documentMembers);
  };

  // Function to refresh member data from API (optional, if you have these endpoints)
  const refreshMemberDataFromAPI = async () => {
    if (!ctrl.selectedDocument?.id) return;

    try {
      setLoading(true);
      const isFolder =
        ctrl.selectedDocument.itemType === "folder" ||
        ctrl.selectedDocument.type === "folder" ||
        ctrl.selectedDocument.isFolder;

      // Adjust these endpoints to match your actual API
      const endpoint = isFolder 
        ? `/folders/${ctrl.selectedDocument.id}/members` 
        : `/files/${ctrl.selectedDocument.id}/members`;

      const response = await axiosInstance.get(endpoint);
      
      // Update the members state directly
      setMembers(response.data);
      
      console.log("Members refreshed from API:", response.data);
    } catch (error) {
      console.error("Error refreshing member data from API:", error);
      // Fallback to getting data from selectedDocument
      getMemberData();
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMember = async (members: MemberModel[]) => {
    if (!ctrl.selectedDocument?.id) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "ບໍ່ໄດ້ເລືອກເອກະສານ!",
      });
      return;
    }

    const isFolder =
      ctrl.selectedDocument.itemType === "folder" ||
      ctrl.selectedDocument.type === "folder" ||
      ctrl.selectedDocument.isFolder;

    const endpoint = isFolder ? "folders/member/delete" : "files/member/delete";

    const username = members
      .map((member) => member.user?.username)
      .filter(Boolean);
    const emailList = members
      .map((member) => member.user?.email)
      .filter(Boolean);
    const email = emailList.length > 0 ? { email: emailList[0] } : {};

    const payload = isFolder
      ? { folderId: ctrl.selectedDocument.id, username }
      : { fileId: ctrl.selectedDocument.id, ...email };

    try {
      const result = await Swal.fire({
        title: "ທ່ານແນ່ໃຈບໍ່?",
        text: `ທ່ານຕ້ອງການລຶບສະມາຊິກ ${members.length} ຄົນອອກຈາກ ${
          isFolder ? "ໂຟເດີ" : "ຟາຍ"
        }?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "ຕົກລົງ",
        cancelButtonText: "ຍົກເລີກ",
      });

      if (result.isConfirmed) {
        await axiosInstance.delete(endpoint, { data: payload });

        Swal.fire({
          icon: "success",
          title: "ລຶບສະມາຊິກອອກສຳເລັດແລ້ວ",
          showConfirmButton: false,
          timer: 1500,
        });

        // Publish event to trigger refresh in main controller
        eventBus.publish("MEMBER_UPDATED", {
          action: "remove",
          documentId: ctrl.selectedDocument.id,
          documentType: ctrl.selectedDocument.itemType,
          removedMembers: members,
        });
      }
    } catch (error) {
      console.error("Error deleting member:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "ມີບາງຢ່າງຜິດພາດໃນຂະນະທີ່ລຶບສະມາຊິກອອກ.",
      });
    }
  };

  // Subscribe to MEMBER_UPDATED event
  useEffect(() => {
    const handleMemberUpdate = (eventData: any) => {
      console.log("MEMBER_UPDATED event received in DocumentDetailsPanel:", eventData);
      
      // Check if the event is for the currently selected document
      if (ctrl.selectedDocument?.id === eventData.documentId) {
        console.log("Event matches current document, refreshing members");
        
        // Try to refresh from API first, then fallback to document data
        // Add a small delay to ensure the main controller has updated the document list
        setTimeout(() => {
          // Since the main controller will refresh the document list,
          // we can just call getMemberData to get the updated data from the refreshed document
          getMemberData();
          
          // Uncomment the line below if you have dedicated member API endpoints
          // refreshMemberDataFromAPI();
        }, 1000); // Increased delay to ensure main controller refresh is complete
      }
    };

    const unsubscribe = eventBus.subscribe("MEMBER_UPDATED", handleMemberUpdate);

    return () => {
      unsubscribe();
    };
  }, [ctrl.selectedDocument?.id]); // Only re-subscribe when document ID changes

  // Load initial member data when document changes
  useEffect(() => {
    if (ctrl.selectedDocument) {
      console.log("Selected document changed, loading member data");
      getMemberData();
    } else {
      setMembers([]);
    }
  }, [ctrl.selectedDocument]);

  // Rest of your component remains the same...
  const renderMembers = () => {
    console.log("Rendering members:", members);

    if (loading) {
      return (
        <Box sx={{ p: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Loading members...
          </Typography>
        </Box>
      );
    }

    if (members.length === 0) {
      return (
        <Box sx={{ p: 1 }}>
          <Typography variant="body2" color="text.secondary">
            No members found
          </Typography>
        </Box>
      );
    }

    const displayMembers = showAllMembers ? members : members.slice(0, 4);
    const remainingCount = members.length - 4;

    return (
      <Box
        sx={{
          display: "flex",
          gap: 2,
          p: 1,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        {displayMembers.map((member: MemberModel) => (
          <Box
            key={member.id}
            sx={{
              my: 1,
              position: "relative",
              "&:hover .delete-button": {
                opacity: 1,
              },
            }}
          >
            <Avatar
              src={member?.user?.image?.url}
              alt={member?.user?.name || member?.user?.username}
              sx={{ width: 32, height: 32 }}
            >
              {!member?.user?.image?.url &&
                (member?.user?.name ||
                  member?.user?.username)?.[0]?.toUpperCase()}
            </Avatar>
            <Tooltip
              title={`Remove ${member?.user?.name || member?.user?.username}`}
            >
              <IconButton
                className="delete-button"
                size="small"
                onClick={() => handleDeleteMember([member])}
                sx={{
                  position: "absolute",
                  top: -8,
                  right: -8,
                  backgroundColor: "white",
                  opacity: 0,
                  transition: "opacity 0.2s",
                  "&:hover": {
                    backgroundColor: "#f5f5f5",
                  },
                  width: 20,
                  height: 20,
                }}
              >
                <DeleteIcon sx={{ fontSize: 14 }} />
              </IconButton>
            </Tooltip>
          </Box>
        ))}

        {!showAllMembers && members.length > 4 && (
          <Badge
            variant="dot"
            color="error"
            sx={{
              "& .MuiBadge-dot": {
                top: 2,
                right: 2,
              },
            }}
          >
            <Button
              onClick={toggleMemberDisplay}
              sx={{
                minWidth: 32,
                height: 32,
                p: 0,
                borderRadius: "50%",
                color: "black",
                backgroundColor: "#f5f5f5",
                "&:hover": {
                  backgroundColor: "#e0e0e0",
                },
              }}
            >
              <Tooltip title={`Show ${remainingCount} more members`}>
                <MoreHorizIcon />
              </Tooltip>
            </Button>
          </Badge>
        )}

        {showAllMembers && members.length > 4 && (
          <Button
            onClick={toggleMemberDisplay}
            size="small"
            sx={{
              fontSize: "0.75rem",
              textTransform: "none",
              color: "black",
              bgcolor: "#f1fbfd",
              ml: 1,
              "&:hover": {
                backgroundColor: "#e0f3f7",
              },
            }}
          >
            ໜ້ອຍລົງ
          </Button>
        )}
      </Box>
    );
  };

  return (
    <Collapse
      in={ctrl.collapeOpen}
      timeout="auto"
      unmountOnExit
      sx={{
        maxWidth: 350,
        width: "100%",
        position: "sticky",
        top: 0,
        height: "calc(100vh - 250px)",
      }}
    >
      <Paper
        sx={{
          p: 3,
          backgroundColor: "white",
          boxShadow: 2,
          height: "100%",
          overflow: "auto",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 2,
            gap: 2,
          }}
        >
          {ctrl?.selectedDocument?.type ? (
            getIconByType(ctrl.selectedDocument.type)
          ) : (
            <img src={FoldeImage} alt="default" />
          )}
          <Typography
            variant="h5"
            title={ctrl?.selectedDocument?.name}
            sx={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "100%",
            }}
          >
            {ctrl?.selectedDocument?.name}
          </Typography>

          <Box sx={{ ml: "auto" }}>
            <IconButton
              size="small"
              onClick={() => {
                ctrl.setCollapseOpen(false);
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>

        <Divider />

        {ctrl.selectedDocument && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 3 }}>
            <Box>
              <FormControl fullWidth margin="normal" size="medium">
                <InputLabel id="status-select-label">ສະຖານະ</InputLabel>
                <Select
                  labelId="status-select-label"
                  id="status-select"
                  value={ctrl?.selectedDocument?.status ?? ""}
                  label="ສະຖານະ"
                  onChange={ctrl.handleChangeStatus}
                >
                  {Object.values(STATUS_ENUMS).map((status) => (
                    <MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Box sx={{ mt: 1 }}>
                <Typography>ການເຂົ້າເຖິງ</Typography>

                <Box sx={{ mt: 2, display: "flex" }}>
                  <IconButton onClick={() => ctrl?.setInviteDialogOpen(true)}>
                    <img src={Invite_IC} alt="invite" />
                  </IconButton>
                </Box>
                {renderMembers()}
              </Box>
            </Box>

            <Divider />

            <Box>
              <Typography
                sx={{ fontSize: "18px", fontWeight: 700, marginBottom: "8px" }}
              >
                ລະຫັດເອກະສານ
              </Typography>
              <Box>{ctrl.selectedDocument?.documentId}</Box>
            </Box>
            <Box>
              <Typography
                sx={{ fontSize: "18px", fontWeight: 700, marginBottom: "8px" }}
              >
                ຜູ້ສ້າງ
              </Typography>
              <Box>
                {ctrl.selectedDocument?.owner?.username ??
                  ctrl.selectedDocument?.owner}
              </Box>
            </Box>
            <Box>
              <Typography
                sx={{ fontSize: "18px", fontWeight: 700, marginBottom: "8px" }}
              >
                ວັນທີສ້າງ
              </Typography>
              <Box>
                {ctrl?.selectedDocument?.createdAt
                  ? new Date(
                      ctrl?.selectedDocument?.createdAt
                    ).toLocaleDateString("en-GB")
                  : "-"}
              </Box>
            </Box>
            <Box>
              <Typography
                sx={{ fontSize: "18px", fontWeight: 700, marginBottom: "8px" }}
              >
                ຂະໜາດເອກະສານ
              </Typography>
              <Box>
                {ctrl?.selectedDocument?.size
                  ? formatFileSize(ctrl.selectedDocument.size)
                  : "N/A"}
              </Box>
            </Box>

            {ctrl?.selectedDocument?.type != "folder" && (
              <Typography mt={2} fontWeight={700}>
                <Typography
                  sx={{
                    fontSize: "18px",
                    fontWeight: 700,
                    marginBottom: "8px",
                  }}
                >
                  ເວີ​ຊັນ ​ແລະ ​ການ​ດັດ​ແປງ​{" "}
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <VersionListComponent
                    versions={ctrl?.versionDocument || []}
                  />
                </Box>
              </Typography>
            )}

            <Typography mt={2} fontWeight={700}>
              <Typography
                sx={{ fontSize: "18px", fontWeight: 700, marginBottom: "8px" }}
              >
                ປະຫວັດ
              </Typography>
            </Typography>
            <FileHistory fileHistory={ctrl?.fileHistory || []} />
          </Box>
        )}
      </Paper>
    </Collapse>
  );
};