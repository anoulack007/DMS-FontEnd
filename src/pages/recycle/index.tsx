import {
  Box,
  Checkbox,
  CircularProgress,
  Collapse,
  Divider,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import UseMainController from "./controllers";

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
import { IconType } from "../../enums/icon-enums";
import CustomMenu from "./components/custom-menu";
import NoData from '../../assets/logo/NotData.svg'

import PanoramaFishEyeIcon from "@mui/icons-material/PanoramaFishEye";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";

const getIconByType = (type: string) => {
  switch (type) {
    // case IconType.FOLDER:
    //   return <img src={FoldeImage} alt="folder" />;
    case IconType.ZIP:
      return <img src={ZipImage} alt="zip" />;
    case IconType.PNG:
      return <img height={45} src={PngImage} alt="png" />;
    case IconType.DOCX:
      return <img src={DocsImage} alt="docs" />;
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
    default:
      return <img src={FoldeImage} alt="folder" />;
  }
};

const RecyclePage = () => {
  const ctrl = UseMainController();

  return (
    <Box>
      {ctrl?.selectedItems.length > 0 && (
        <CustomMenu
          selectedCount={ctrl.selectedItems.length}
          onDetailsClick={ctrl.handleDetailsClick}
          handleDelete={ctrl?.handleDelete}
          handleRestore={ctrl?.handleRestore}
        />
      )}

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "row",
          gap: 2,
          width: "100%",
        }}
      >
        <Box sx={{ flexGrow: 1 }}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      icon={<PanoramaFishEyeIcon sx={{ color: "gray" }} />}
                      checkedIcon={<CheckCircleIcon sx={{ color: "blue" }} />}
                      indeterminate={
                        ctrl?.selectedItems.length > 0 &&
                        ctrl?.selectedItems.length < ctrl?.documents.length
                      }
                      checked={
                        ctrl?.documents.length > 0 &&
                        ctrl?.selectedItems.length === ctrl?.documents.length
                      }
                      onChange={ctrl?.handleSelectAll}
                    />
                  </TableCell>
                  <TableCell>Document Name</TableCell>
                  <TableCell>ID Document</TableCell>
                  <TableCell>User deleted</TableCell>
                  <TableCell>Date deleted</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {ctrl?.loading ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : ctrl?.error ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      {ctrl?.error}
                    </TableCell>
                  </TableRow>
                ) : ctrl?.documents.length > 0 ? (
                  ctrl?.documents.map((item) => (
                    <TableRow
                      key={item?.id}
                      selected={ctrl?.isSelected(item.id)}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                        "&:hover": {
                          backgroundColor: "rgba(0, 0, 0, 0.04)",
                          transition: "background-color 0.2s ease",
                        },
                        cursor: "pointer",
                      }}
                      // onDoubleClick={(e) =>
                      //   item.type === "folder"
                      //     ? ctrl.handleFolderClick(e, item)
                      //     : ctrl.handleFileClick(e, item)
                      // }
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          icon={<PanoramaFishEyeIcon sx={{ color: "gray" }} />}
                          checked={ctrl?.isSelected(item?.id)}
                          onChange={() => ctrl?.handleSelectItem(item?.id)}
                          checkedIcon={
                            <CheckCircleIcon sx={{ color: "blue" }} />
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            cursor: "pointer",
                          }}
                        >
                          {getIconByType(item?.type)}
                          <Box>
                            <Typography>{item?.name}</Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>{item?.documentId}</TableCell>
                      <TableCell>{item?.owner?.name}</TableCell>
                      <TableCell>
                        {item?.updatedAt
                          ? new Date(item?.updatedAt).toLocaleString()
                          : ""}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <Box sx={{ minHeight: 500, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <img src={NoData} alt="data" />
                      </Box>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        <Collapse
          in={ctrl.collapeOpen}
          timeout="auto"
          unmountOnExit
          sx={{ maxWidth: 350, width: "100%" }}
        >
          <Paper
            sx={{
              p: 3,
              backgroundColor: "white",
              boxShadow: 2,
              overflow: "auto",
              minHeight: 1200,
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
              <img src={FoldeImage} alt="folder" />
              <Typography
                variant="h5"
                title={ctrl?.selectedDocument?.name}
                sx={{
                  whiteSpace: "nowrap", // Prevents text from wrapping to the next line
                  overflow: "hidden", // Hides overflowing text
                  textOverflow: "ellipsis", // Adds ellipsis at the end of the truncated text
                  maxWidth: "100%", // Ensures the element has a maximum width to trigger truncation
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
                sx={{ display: "flex", flexDirection: "column", gap: 5, mt: 3 }}
              >
                <Typography variant="h5">Details :</Typography>

                <Typography>
                  <strong>
                    Owner <br /> {ctrl.selectedDocument?.owner?.email}
                  </strong>
                </Typography>
                <Typography>
                  <strong>
                    Company <br /> {ctrl.selectedDocument?.owner?.company}
                  </strong>
                </Typography>
                <Typography>
                  <strong>
                    Created <br />
                  </strong>
                  {ctrl?.selectedDocument?.updatedAt
                    ? new Date(
                        ctrl?.selectedDocument?.updatedAt
                      ).toLocaleString()
                    : "-"}
                </Typography>
                <Typography>
                  <strong>
                    Date deleted <br />{" "}
                  </strong>{" "}
                  {ctrl?.selectedDocument?.updatedAt
                    ? new Date(
                        ctrl?.selectedDocument?.updatedAt
                      ).toLocaleString()
                    : "-"}
                </Typography>
                <Typography>
                  <strong>
                    Deleted by <br /> {ctrl.selectedDocument?.owner?.name}
                  </strong>
                </Typography>
              </Box>
            )}
          </Paper>
        </Collapse>
      </Box>
    </Box>
  );
};

export default RecyclePage;
