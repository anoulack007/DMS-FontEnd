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
  TablePagination,
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
import NoData from "../../assets/logo/NotData.svg";

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
          <TableContainer
            sx={{
              boxShadow: 3,
              borderRadius: 3,
            }}
          >
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
                  <TableCell>ຊື່ເອກະສານ</TableCell>
                  <TableCell>ລະຫັດເອກະສານ</TableCell>
                  <TableCell>ຊື່ຜູ້ລົບ</TableCell>
                  <TableCell>ລົບໃນວັນທິ</TableCell>
                </TableRow>
              </TableHead>
              <TableBody sx={{ borderBottom: "1px solid #919EAB3D" }}>
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
                ) : ctrl.getPaginatedData().length > 0 ? (
                  ctrl.getPaginatedData().map((item) => (
                    <TableRow
                      key={item?.id}
                      selected={ctrl?.isSelected(item.id)}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                        "&:hover": {
                          backgroundColor: "rgba(0, 0, 0, 0.04)",
                          transition: "background-color 0.2s ease",
                          "& .checkbox-cell": {
                            opacity: 1,
                            visibility: "visible",
                          },
                        },
                        cursor: "pointer",
                      }}
                      onClick={() => ctrl?.handleSelectItem(item?.id)}
                    >
                      <TableCell
                        padding="checkbox"
                        sx={{
                          borderBottom: "none",
                          "& .MuiCheckbox-root": {
                            transition: "opacity 0.2s, visibility 0.2s",
                            opacity: ctrl?.isSelected(item?.id) ? 1 : 0,
                            visibility: ctrl?.isSelected(item?.id)
                              ? "visible"
                              : "hidden",
                          },
                        }}
                        className="checkbox-cell"
                      >
                        <Checkbox
                          icon={<PanoramaFishEyeIcon sx={{ color: "gray" }} />}
                          checked={ctrl?.isSelected(item?.id)}
                          checkedIcon={
                            <CheckCircleIcon sx={{ color: "blue" }} />
                          }
                          onClick={(e) => e.stopPropagation()}
                        />
                      </TableCell>
                      <TableCell sx={{ borderBottom: "none" }}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          {getIconByType(item?.type)}
                          <Box>
                            <Typography>{item?.name}</Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ borderBottom: "none" }}>
                        {item?.documentId}
                      </TableCell>
                      <TableCell sx={{ borderBottom: "none" }}>
                        {item?.owner?.name}
                      </TableCell>
                      <TableCell sx={{ borderBottom: "none" }}>
                        {item?.updatedAt
                          ? new Date(item?.updatedAt).toLocaleString()
                          : ""}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <Box
                        sx={{
                          minHeight: 500,
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <img src={NoData} alt="data" />
                      </Box>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={ctrl?.documents.length}
            page={ctrl.page}
            onPageChange={ctrl.handleChangePage}
            rowsPerPage={ctrl.rowsPerPage}
            onRowsPerPageChange={ctrl.handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
          />
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
