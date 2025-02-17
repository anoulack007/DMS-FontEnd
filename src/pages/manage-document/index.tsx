import {
  Paper,
  Box,
  IconButton,
  Typography,
  MenuItem,
  Collapse,
  Divider,
  TextField,
  FormControl,
  InputLabel,
  Select,
  InputAdornment,
  Avatar,
} from "@mui/material";

import Invite_IC from "../../assets/logo/invite_ic.svg";
import Access_IC from "../../assets/logo/access_ic.svg";
import Person_IC from "../../assets/logo/Person.svg";

//icons
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";

//controllers
import UseMainController from "./controller";
import CustomMenu from "./components/custom-menu";
import { STATUS_ENUMS } from "../../enums/status-enum";

//icons
import FoldeImage from "../../assets/Image/image 11.png";
import ZipImage from "../../assets/logo/zip_ic.svg";
import PngImage from "../../assets/logo/png.svg";
import DocsImage from "../../assets/logo/doc_ic.svg";
import XlsxImage from "../../assets/logo/excel_ic.svg";
import ImageImage from "../../assets/logo/image_ic.svg";
import JpegImage from "../../assets/logo/jpg.svg.svg";
import PptImage from "../../assets/logo/ptt_ic.svg";
import Mp3Image from "../../assets/logo/music_ic.svg";
import VideoImage from "../../assets/logo/video_ic.svg";
import PdfImage from "../../assets/logo/pdf_ic.svg";
import TxtImage from "../../assets/logo/txt.svg.svg";
import SvgImage from "../../assets/logo/svg.svg.svg";
import ExeImage from "../../assets/logo/exe.svg.svg";
import RarImage from "../../assets/logo/rar_ic.svg";

import { IconType } from "../../enums/icon-enums";
import DialogInviteMember from "./components/dialog-inviteMember";
import BreadcrumbCustom from "./components/breadcrumbs";
import DocumentTable from "./components/table";
import ShareDocumentDialog from "./components/dialog-shareDocument";
import RenameDocumentDialog from "./components/dialog-rename";
import { INVITE_MEMBER_FILE_END_POINT } from "../../configs/endPoint/files-endpoint";
import { INVITE_MEMBER_FOLDER_END_POINT } from "../../configs/endPoint/folder-endpoint";
import axiosInstance from "../../configs/axios";
import { ErrorResponse } from "../../utils/functions/Error";

export const getIconByType = (type: string) => {
  switch (type) {
    case IconType.FOLDER:
      return <img src={FoldeImage} alt="folder" />;
    case IconType.ZIP:
      return <img src={ZipImage} alt="zip" />;
    case IconType.PNG:
      return <img height={45} src={PngImage} alt="png" />;
    case IconType.DOCX:
      return <img src={DocsImage} alt="docx" />;
    case IconType.XLSX:
      return <img src={XlsxImage} alt="xlsx" />;
    case IconType.IMAGE:
      return <img src={ImageImage} alt="image" />;
    case IconType.JPG:
      return <img height={45} src={JpegImage} alt="jpeg" />;
    case IconType.PPT:
      return <img src={PptImage} alt="ppt" />;
    case IconType.MP3:
      return <img src={Mp3Image} alt="mp3" />;
    case IconType.MP4:
      return <img src={VideoImage} alt="video" />;
    case IconType.PDF:
      return <img src={PdfImage} alt="pdf" />;
    case IconType.TXT:
      return <img height={45} src={TxtImage} alt="txt" />;
    case IconType.SVG:
      return <img height={45} src={SvgImage} alt="svg" />;
    case IconType.EXE:
      return <img height={45} src={ExeImage} alt="exe" />;
    case IconType.RAR:
      return <img height={45} src={RarImage} alt="rar" />;
    default:
      return <img src={FoldeImage} alt="folder" />;
  }
};

const getStatusColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case "public":
      return "#36B37E29"; // Light red
    case "private":
      return "#91040B1A"; // Light orange
    default:
      return "transparent";
  }
};

const getTextColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case "public":
      return "#1B806A";
    case "private":
      return "#91040B";
    default:
      return "white";
  }
};

const ManageDocumentPage = () => {
  const ctrl = UseMainController();

  const formatFileSize = (sizeInBytes: any) => {
    if (sizeInBytes === 0) return "0 B";
    const units = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(sizeInBytes) / Math.log(1024));
    return `${(sizeInBytes / Math.pow(1024, i)).toFixed(2)} ${units[i]}`;
  };

  return (
    <Box>
      <Typography color="#838383" variant="h5" fontWeight={700}>
        <p>ຈັດການເອກະສານ</p>
      </Typography>

      <Box sx={{ justifyContent: "space-between", display: "flex" }} my={3}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <BreadcrumbCustom />
        </Box>
        <TextField
          value={ctrl?.searchTerm}
          placeholder="ຄົ້ນຫາ..."
          onChange={(e) => ctrl.handleSearch(e.target.value)}
          sx={{
            fontFamily: "NotoSansLao-Regular",
            borderRadius: 24,
            bgcolor: "#F6F6F6",
            "& .MuiOutlinedInput-root": {
              border: "none",
            },
            "& .MuiOutlinedInput-notchedOutline": {
              border: "none",
            },
          }}
          slotProps={{
            input: {
              style: {
                borderRadius: 24,
              },
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton>
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />
      </Box>

      {ctrl?.selectedItems.length > 0 && (
        <CustomMenu
          selectedCount={ctrl.selectedItems.length}
          onDetailsClick={ctrl.handleDetailsClick}
          hanldeFolderRename={() => ctrl?.setRenameDialogOpen(true)}
          handleDelete={ctrl?.handleDeleteFolder}
          handleShare={() => ctrl?.setShareDialogOpen(true)}
          handleDownload={ctrl?.handleDownload}
        />
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
          isAnyItemSelected={ctrl.selectedItems.length > 0}
          getIconByType={getIconByType}
          formatFileSize={formatFileSize}
          getStatusColor={getStatusColor}
          getTextColor={getTextColor}
        />

        <Collapse
          in={ctrl.collapeOpen}
          timeout="auto"
          unmountOnExit
          sx={{
            maxWidth: 350,
            width: "100%",
            position: "sticky",
            top: 0,
            height: "calc(100vh - 250px)", // Match TableContainer height
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
              {/* <img src={FoldeImage} alt="folder" /> */}
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
                    ctrl.setSearchParams({});
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </Box>
            </Box>

            <Divider />

            {ctrl.selectedDocument && (
              <Box
                sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 3 }}
              >
                <Box>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    Status
                  </Typography>
                  <FormControl fullWidth margin="normal" size="medium">
                    <InputLabel id="status-select-label">Status</InputLabel>
                    <Select
                      labelId="status-select-label"
                      id="status-select"
                      value={ctrl?.selectedDocument?.status ?? ""}
                      label="Status"
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
                    <Typography>Has access</Typography>

                    <Box sx={{ mt: 2, display: "flex" }}>
                      <IconButton
                        onClick={() => ctrl?.setInviteDialogOpen(true)}
                      >
                        <img src={Invite_IC} alt="invite" />
                      </IconButton>

                      {ctrl?.filteredMembers.map((member) => (
                        <Avatar
                          key={member.id}
                          src={member?.user?.image?.url}
                          alt={member?.user?.name}
                        />
                      ))}

                      {/* <IconButton>
                        <img src={Access_IC} alt="access" />
                      </IconButton> */}
                    </Box>
                  </Box>
                </Box>

                <Divider />

                <Typography>Details</Typography>

                <Typography>
                  <strong>Name:</strong> <br /> {ctrl.selectedDocument.name}
                </Typography>
                <Typography>
                  <strong>Owner:</strong> <br />{" "}
                  {ctrl?.selectedDocument?.owner?.name}
                </Typography>
                <Typography>
                  <strong>ID:</strong> <br /> {ctrl.selectedDocument?.id}
                </Typography>
                <Typography>
                  <strong>Created:</strong> <br />{" "}
                  {ctrl?.selectedDocument?.createdAt
                    ? new Date(
                        ctrl?.selectedDocument?.createdAt
                      ).toLocaleString()
                    : "-"}
                </Typography>
                <Typography>
                  <strong>Size:</strong> <br />{" "}
                  {ctrl?.selectedDocument?.size
                    ? formatFileSize(ctrl.selectedDocument.size)
                    : "N/A"}
                </Typography>

                <Typography mt={2} fontWeight={700}>
                  <strong>version and Modification</strong>
                </Typography>

                <Typography mt={2} fontWeight={700}>
                  <strong>History Event</strong>
                </Typography>
                {ctrl?.fileHistory.length > 0 ? (
                  <Box>
                    {ctrl?.fileHistory.map((history, index) => (
                      <Box
                        key={index}
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Typography mb={1}>{history?.event}</Typography>
                        <Typography>
                          {history.createdAt
                            ? new Date(history?.createdAt).toLocaleDateString()
                            : ""}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                ) : (
                  <Typography mt={2}>No history available</Typography>
                )}
              </Box>
            )}
          </Paper>
        </Collapse>

        <RenameDocumentDialog ctrl={ctrl} />

        <ShareDocumentDialog ctrl={ctrl} personIcon={Person_IC} />

        <DialogInviteMember
          open={ctrl?.inviteDialogOpen}
          onClose={() => ctrl?.setInviteDialogOpen(false)}
          selectedDocument={ctrl?.selectedDocument}
          INVITE_MEMBER_FOLDER_END_POINT={INVITE_MEMBER_FOLDER_END_POINT}
          INVITE_MEMBER_FILE_END_POINT={INVITE_MEMBER_FILE_END_POINT}
          axiosInstance={axiosInstance}
          ErrorResponse={ErrorResponse}
        />
      </Box>
    </Box>
  );
};

export default ManageDocumentPage;
