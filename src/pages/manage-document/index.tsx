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
import Jpeg from "../../assets/logo/jpeg.png";
import Python from "../../assets/logo/python_ic.svg";
import Html from "../../assets/logo/html-icon.svg";
import Js from "../../assets/logo/javascript_icon.svg";
import HeicImage from "../../assets/logo/heic.png";

import { IconType } from "../../enums/icon-enums";
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
    case IconType.JPEG:
      return <img height={45} src={Jpeg} alt="jpeg" />;
    case IconType.PYTHON:
      return <img height={45} src={Python} alt="python" />;
    case IconType.HTML:
      return <img height={45} src={Html} alt="html" />;
    case IconType.JS:
      return <img height={45} src={Js} alt="Javascript" />;
    case IconType.HEIC:
      return <img height={45} src={HeicImage} alt="Heic" />;
    default:
      return <img src={FoldeImage} alt="folder" />;
  }
};

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
          ctrl={{
            ...ctrl,
            page: ctrl.page,
            rowsPerPage: ctrl.rowsPerPage,
            handleChangePage: ctrl.handleChangePage,
            handleChangeRowsPerPage: ctrl.handleChangeRowsPerPage,
          }}
          isAnyItemSelected={ctrl.selectedItems.length > 0}
          getIconByType={getIconByType}
          formatFileSize={formatFileSize}
          getStatusColor={getStatusColor}
          getTextColor={getTextColor}
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
      </Box>
    </Box>
  );
};

export default ManageDocumentPage;
