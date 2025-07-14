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
  CircularProgress,
  Skeleton,
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
import { IconType } from "../../../enums/icon-enums";
import axiosInstance from "../../../configs/axios";
import {
  GET_FILE_MEMBER_BY_DOC_ID_END_POINT,
  GET_MEMBER_FILE_END_POINT,
} from "../../../configs/endPoint/files-endpoint";
import Swal from "sweetalert2";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import {
  GET_FOLDER_MEMBER_BY_DOC_ID_END_POINT,
  GET_FOLDER_MEMBER_END_POINT,
} from "../../../configs/endPoint/folder-endpoint";
import eventBus from "../../../utils/functions/eventBus";
import { getIconByType } from "../../../utils/functions/inconUtils";

interface Document {
  id: string;
  name: string;
  path: string;
  documentId: string;
  modified: string;
  size: string;
  type: IconType;
  version: string;
  itemType: string;
  documentNumber: string;
  status: STATUS_ENUMS;
  owner: {
    username: string;
  };
  url: string;
  isFolder: boolean;
  parentId: string;
  isPinned: boolean;
  isDelete: boolean;
  createdAt: string;
  updatedAt: string;
}

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

  const getMemberData = async () => {
    const selectedDocument = ctrl.selectedDocument;
    if (!selectedDocument) return;

    setLoading(true);
    try {
      let response;
      let endpoint;

      const isFolder =
        selectedDocument.itemType === "folder" ||
        selectedDocument.type === "folder";

      if (isFolder) {
        endpoint = `${GET_FOLDER_MEMBER_BY_DOC_ID_END_POINT}/${selectedDocument.documentId}`;
      } else {
        endpoint = `${GET_FILE_MEMBER_BY_DOC_ID_END_POINT}/${selectedDocument.documentId}`;
      }

      response = await axiosInstance.get(endpoint);
      const memberData = response?.data?.data;

      if (!Array.isArray(memberData)) {
        console.error("Invalid member data format received:", memberData);
        setMembers([]);
        return;
      }

      setMembers(memberData);
    } catch (error) {
      console.error("Error fetching members:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: `Failed to fetch ${
          selectedDocument.itemType || selectedDocument.type
        } members`,
        timer: 2000,
        showConfirmButton: false,
      });
      setMembers([]);
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

  const isFolder = ctrl.selectedDocument.type === "folder";
  const endpoint = isFolder ? "folders/member/delete" : "files/member/delete";

  const username = members.map((member) => member.user?.username).filter(Boolean);
  const emailList = members.map((member) => member.user?.email).filter(Boolean);
  const email = emailList.length > 0 ? { email: emailList[0] } : {};

  const payload = isFolder
    ? { folderId: ctrl.selectedDocument.id, username }
    : { fileId: ctrl.selectedDocument.id, ...email };

  try {
    const result = await Swal.fire({
      title: "ທ່ານແນ່ໃຈບໍ່?",
      text: `ທ່ານຕ້ອງການລຶບສະມາຊິກ ${members.length} ຄົນອອກຈາກ ${isFolder ? "ໂຟເດີ" : "ຟາຍ"}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ຕົກລົງ",
      cancelButtonText: "ຍົກເລີກ",
    });

    if (result.isConfirmed) {
      // Show SweetAlert loading
      Swal.fire({
        title: "ກຳລັງລຶບ...",
        text: "ກະລຸນາລໍຖ້າ",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      // Perform delete
      await axiosInstance.delete(endpoint, { data: payload });

      // Show success after delete
      Swal.fire({
        icon: "success",
        title: "ລຶບສຳເລັດ",
        showConfirmButton: false,
        timer: 1500,
      });

      getMemberData();
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


  useEffect(() => {
    const unsubscribe = eventBus.subscribe("MEMBER_UPDATED", (data) => {
      if (ctrl.selectedDocument?.id === data.documentId) {
        getMemberData();
      }
    });

    getMemberData();

    return () => {
      unsubscribe();
    };
  }, [ctrl.selectedDocument]);

  const renderMembers = () => {
    if (loading) {
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
          {[...Array(4)].map((_, index) => (
            <Skeleton
              key={index}
              variant="circular"
              width={32}
              height={32}
              sx={{ my: 1 }}
            />
          ))}
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
        {displayMembers.map((member) => (
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
              alt={member?.user?.name}
              sx={{ width: 32, height: 32 }}
            />
            <Tooltip title="Remove member">
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

        {showAllMembers && members.length > 3 && (
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
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography>ການເຂົ້າເຖິງ</Typography>
                  {loading && <CircularProgress size={16} />}
                </Box>

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
                  ເວີ​ຊັນເອກະສານ​{" "}
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
