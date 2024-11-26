import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  CircularProgress,
  IconButton,
  Checkbox,
  Typography,
  Collapse,
  Divider,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  InputAdornment,
  Chip,
  TablePagination,
} from "@mui/material";
import Person_IC from "../../assets/logo/Person.svg";

//icons
import PanoramaFishEyeIcon from "@mui/icons-material/PanoramaFishEye";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SendIcon from "@mui/icons-material/Send";
import NoData from "../../assets/logo/NotData.svg";

//controllers
import UseMainController from "./controller";

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
import CustomMenu from "../manage-document/components/custom-menu";

const getIconByType = (type: string) => {
  switch (type) {
    case IconType.FOLDER:
      return <img src={FoldeImage} alt="folder" />;
    case IconType.ZIP:
      return <img src={ZipImage} alt="zip" />;
    case IconType.PNG:
      return <img height={45} src={PngImage} alt="png" />;
    case IconType.DOCS:
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

const FollowDocumentPage = () => {
  const ctrl = UseMainController();

  return (
    <Box>
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
        }}
      >
        <Box sx={{ flexGrow: 1 }}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell width={500}>Document Name</TableCell>
                  <TableCell>Creation Date</TableCell>
                  <TableCell>User Name</TableCell>
                  <TableCell>Company</TableCell>
                  <TableCell>Event</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {ctrl?.loading ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : ctrl?.error ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      {ctrl?.error}
                    </TableCell>
                  </TableRow>
                ) : ctrl?.documents.length > 0 ? (
                  ctrl?.documents
                    .slice(
                      (ctrl?.page - 1) * ctrl?.pageSize,
                      ctrl?.page * ctrl?.pageSize
                    )
                    .map((item) => (
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
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            icon={
                              <PanoramaFishEyeIcon sx={{ color: "gray" }} />
                            }
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
                            <Box
                              sx={{
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              <Typography>{item?.docName}</Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          {item?.createdAt
                            ? new Date(item?.createdAt).toLocaleString()
                            : ""}
                        </TableCell>
                        <TableCell>{item?.ownerName}</TableCell>
                        <TableCell>{item?.company}</TableCell>
                        <TableCell>
                          <Chip
                            label={item?.event}
                            sx={{
                              backgroundColor:
                                item?.event === "Update"
                                  ? "#FFB200"
                                  : item?.event === "Upload"
                                  ? "#03994D"
                                  : item?.event === "Delete"
                                  ? "#91040B"
                                  : item?.event === "Create"
                                  ? "#1F509A"
                                  : "gray",
                              color:
                                item?.event === "update" ? "black" : "white", // Adjust text color for visibility
                              fontWeight: "bold",
                            }}
                          />
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
            count={ctrl?.totalPages * ctrl?.pageSize} 
            page={ctrl?.page - 1}
            onPageChange={(event, newPage) => ctrl?.setPage(newPage + 1)}
            rowsPerPage={ctrl?.pageSize}
            rowsPerPageOptions={[10, 25, 50]}
            onRowsPerPageChange={(event) =>
              ctrl?.setPageSize(parseInt(event.target.value, 10))
            }
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
                sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 3 }}
              >
                <Typography>Details</Typography>

                <Typography>
                  <strong>Name:</strong> {ctrl.selectedDocument.name}
                </Typography>
                <Typography>
                  <strong>Owner:</strong>
                </Typography>
                <Typography>
                  <strong>ID:</strong> {ctrl.selectedDocument?.documentId}
                </Typography>
                <Typography>
                  <strong>Created:</strong>{" "}
                  {ctrl?.selectedDocument?.createdAt
                    ? new Date(
                        ctrl?.selectedDocument?.createdAt
                      ).toLocaleString()
                    : "-"}
                </Typography>
              </Box>
            )}
          </Paper>
        </Collapse>

        <Dialog
          open={ctrl?.renameDialogOpen}
          onClose={() => ctrl?.setRenameDialogOpen(false)}
          maxWidth="xs"
          fullWidth
        >
          <form onSubmit={ctrl.handleRenameFolder}>
            <DialogTitle>Rename Document</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                label="New name"
                fullWidth
                value={ctrl?.newName}
                onChange={(e) => ctrl?.handleChangeName(e.target.value)}
              />
            </DialogContent>
            <DialogActions>
              {/* <Button onClick={onClose} disabled={ctrl?.isSubmitting}>
                Cancel
              </Button> */}
              <Button
                type="submit"
                sx={{
                  bgcolor: "#2C3E50",
                  textTransform: "none",
                  color: "white",
                }}
              >
                {ctrl?.isSubmitting ? <CircularProgress size={24} /> : "Rename"}
              </Button>
            </DialogActions>
          </form>
        </Dialog>

        <Dialog
          open={ctrl?.shareDialogOpen}
          onClose={ctrl.handleCloseShareDialog}
          maxWidth="xs"
          fullWidth
        >
          <form>
            <DialogTitle>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <IconButton onClick={ctrl.handleCloseShareDialog}>
                  <ArrowBackIcon />
                </IconButton>
                <Typography variant="h6" sx={{ ml: 1 }}>
                  Share "Documents"
                </Typography>
              </Box>
            </DialogTitle>
            <DialogContent>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Add a name or email"
                InputProps={{
                  style: { borderRadius: 20 },
                  startAdornment: (
                    <InputAdornment position="start">
                      <img src={Person_IC} alt="person" />
                    </InputAdornment>
                  ),
                }}
                sx={{ mt: 2, borderRadius: 20 }}
              />
            </DialogContent>
            <DialogActions>
              <Button
                type="submit"
                variant="contained"
                color="error"
                fullWidth
                startIcon={<SendIcon />}
                sx={{
                  backgroundColor: "maroon",
                  color: "white",
                  textTransform: "none",
                  maxWidth: 100,
                  height: 40,
                  borderRadius: 3,
                }}
              >
                Send
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </Box>
    </Box>
  );
};

export default FollowDocumentPage;
