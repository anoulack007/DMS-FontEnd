import {
  Box,
  IconButton,
  Typography,
  TextField,
  InputAdornment,
} from "@mui/material";

// import Access_IC from "../../assets/logo/access_ic.svg";

//icons
import SearchIcon from "@mui/icons-material/Search";

//controllers
import UseMainController from "./controller";
import CustomMenu from "./components/custom-menu";

import DialogInviteMember from "./components/dialog-inviteMember";
import BreadcrumbCustom from "./components/breadcrumbs";
import DocumentTable from "./components/table";
import RenameDocumentDialog from "./components/dialog-rename";
import { INVITE_MEMBER_FILE_END_POINT } from "../../configs/endPoint/files-endpoint";
import { INVITE_MEMBER_FOLDER_END_POINT } from "../../configs/endPoint/folder-endpoint";
import axiosInstance from "../../configs/axios";
import { ErrorResponse } from "../../utils/functions/Error";
import { formatFileSize } from "../../utils/functions/formarFile";
import { getStatusColor, getTextColor } from "../../utils/functions/color";
import { DocumentDetailsPanel } from "./components/collapse";
import { getIconByType } from "../../utils/functions/inconUtils";
import FileUploadVersionDialog from "./components/dialog-uploadVersionFile";


const ManageDocumentPage = () => {
  const ctrl = UseMainController();

  return (
    <Box>
      {/* Breadcrumbs always at the top */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <BreadcrumbCustom folders={ctrl?.allDocuments} />
      </Box>

      {/* Conditional rendering based on selection */}
      {ctrl?.selectedItems.length > 0 ? (
        <CustomMenu
          selectedCount={ctrl.selectedItems.length}
          onDetailsClick={ctrl.handleDetailsClick}
          hanldeFolderRename={() => ctrl?.setRenameDialogOpen(true)}
          handleDelete={ctrl?.handleDeleteFolder}
          handleDownload={ctrl?.handleDownload}
        />
      ) : (
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
            height: "60px",
          }}
        >
          <Typography
            textAlign={"center"}
            color="#838383"
            variant="h5"
            fontWeight={700}
          >
            ຈັດການເອກະສານ
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center" }}>
            <TextField
              value={ctrl?.searchTerm}
              placeholder="ຄົ້ນຫາ..."
              onChange={(e) => ctrl.handleSearch(e.target.value)}
              sx={{
                fontFamily: "NotoSansLao-Regular",
                borderRadius: 24,
                bgcolor: "#F6F6F6",
                mb: 2,
                "& .MuiOutlinedInput-root": {
                  border: "none",
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  border: "none",
                },
              }}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton>
                        <SearchIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                  style: {
                    borderRadius: 24,
                  },
                },
              }}
            />
          </Box>
        </Box>
      )}

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "row",
          gap: 2,
          width: "100%",
          position: "relative",
        }}
      >
        <DocumentTable
          ctrl={ctrl}
          isAnyItemSelected={ctrl?.selectedItems.length > 0}
          getIconByType={getIconByType}
          formatFileSize={formatFileSize}
          getStatusColor={getStatusColor}
          getTextColor={getTextColor}
          handleUploadVersion={ctrl?.handleUploadVersion}
        />

        <DocumentDetailsPanel ctrl={ctrl} />

        <RenameDocumentDialog ctrl={ctrl} />

        <DialogInviteMember
          open={ctrl?.inviteDialogOpen}
          onClose={() => ctrl?.setInviteDialogOpen(false)}
          selectedDocument={ctrl?.selectedDocument}
          INVITE_MEMBER_FOLDER_END_POINT={INVITE_MEMBER_FOLDER_END_POINT}
          INVITE_MEMBER_FILE_END_POINT={INVITE_MEMBER_FILE_END_POINT}
          axiosInstance={axiosInstance}
          ErrorResponse={ErrorResponse}
        />

        <FileUploadVersionDialog
          open={ctrl?.versionUploadOpen}
          onClose={() => ctrl?.setVersionUploadOpen(false)}
          documentNumber={ctrl?.selectedDocumentNumber}
        />
      </Box>
    </Box>
  );
};

export default ManageDocumentPage;
