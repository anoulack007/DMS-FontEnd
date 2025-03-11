import {
  Box,
  Checkbox,
  CircularProgress,
  Collapse,
  Divider,
  IconButton,
  InputAdornment,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
  Button,
  Stack,
} from "@mui/material";
import UseMainController from "./controllers";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

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
import SearchIcon from "@mui/icons-material/Search";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import ClearIcon from "@mui/icons-material/Clear";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

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
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          mb: 3,
          justifyContent: "space-between",
        }}
      >
        <Typography color="#838383" variant="h5" fontWeight={700}>
          ຖັງຂີ້ເຫຍື້ອ
        </Typography>

        <Box sx={{ display: "flex", gap: 3 }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Stack direction="row" spacing={2} alignItems="center">
              <FilterAltIcon color="action" />
              <Typography variant="subtitle2">ການກັ່ນຕອງຕາມວັນທີ</Typography>

              <DatePicker
                label="ວັນທີເລີ່ມຕົ້ນ"
                value={ctrl.dateFilter.startDate}
                onChange={(newValue: any) =>
                  ctrl.handleDateFilterChange({
                    ...ctrl.dateFilter,
                    startDate: newValue,
                  })
                }
                format="DD/MM/YYYY"
                slotProps={{
                  textField: {
                    size: "small",
                    sx: { width: 170 },
                  },
                }}
              />

              <DatePicker
                label="ວັນທີສິ້ນສຸດ"
                value={ctrl.dateFilter.endDate}
                onChange={(newValue: any) =>
                  ctrl.handleDateFilterChange({
                    ...ctrl.dateFilter,
                    endDate: newValue,
                  })
                }
                format="DD/MM/YYYY"
                slotProps={{
                  textField: {
                    size: "small",
                    sx: { width: 170 },
                  },
                }}
              />

              <Button
                variant="outlined"
                startIcon={<ClearIcon />}
                sx={{ textTransform: "none" }}
                onClick={ctrl.resetFilters}
                size="small"
              >
                ລ້າງຕົວກອງ
              </Button>
            </Stack>
          </LocalizationProvider>

          <Divider orientation="vertical" flexItem />

          <TextField
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
            placeholder="ຄົ້ນຫາເອກະສານ..."
            value={ctrl.searchTerm}
            onChange={(e) => ctrl.handleSearch(e.target.value)}
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

      {/* Date Filter Section */}
      <Box sx={{ mb: 3 }}></Box>

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
                    {/* <Checkbox
                      icon={<PanoramaFishEyeIcon sx={{ color: "gray" }} />}
                      checkedIcon={<CheckCircleIcon sx={{ color: "blue" }} />}
                      indeterminate={
                        ctrl?.selectedItems.length > 0 &&
                        ctrl?.selectedItems.length <
                          ctrl?.getPaginatedData().length
                      }
                      checked={
                        ctrl?.getPaginatedData().length > 0 &&
                        ctrl?.selectedItems.length ===
                          ctrl?.getPaginatedData().length
                      }
                      onChange={ctrl?.handleSelectAll}
                    /> */}
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
                          flexDirection: "column",
                          gap: 2,
                        }}
                      >
                        <img src={NoData} alt="data" />
                        <Typography color="textSecondary">
                          {ctrl.searchTerm ||
                          ctrl.dateFilter.startDate ||
                          ctrl.dateFilter.endDate
                            ? "No matching documents found. Try adjusting your filters."
                            : "No documents in recycle bin."}
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={7} align="right">
                    <TablePagination
                      component="div"
                      count={ctrl?.filteredDocuments.length}
                      page={ctrl.page}
                      onPageChange={ctrl.handleChangePage}
                      rowsPerPage={ctrl.rowsPerPage}
                      onRowsPerPageChange={ctrl.handleChangeRowsPerPage}
                      rowsPerPageOptions={[5, 10, 25]}
                    />
                  </TableCell>
                </TableRow>
              </TableFooter>
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
                  {ctrl?.selectedDocument?.createdAt
                    ? new Date(
                        ctrl?.selectedDocument?.createdAt
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
