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
  Chip,
  TableSortLabel,
  MenuItem,
  Collapse,
  Divider,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
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
import PanoramaFishEyeIcon from "@mui/icons-material/PanoramaFishEye";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SendIcon from "@mui/icons-material/Send";
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

const getIconByType = (type: string) => {
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

type SortField = "name" | "modified" | "size" | "status";

const ManageDocumentPage = () => {
  const ctrl = UseMainController();

  const formatFileSize = (sizeInBytes: any) => {
    if (sizeInBytes === 0) return "0 B";
    const units = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(sizeInBytes) / Math.log(1024));
    return `${(sizeInBytes / Math.pow(1024, i)).toFixed(2)} ${units[i]}`;
  };

  const renderSortableHeader = (field: SortField, label: string) => (
    <TableCell>
      <Box sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
        <TableSortLabel
          active={ctrl?.sortField === field}
          direction={ctrl?.sortField === field ? ctrl?.sortOrder : "asc"}
          onClick={() => ctrl?.handleSort(field)}
          sx={{ fontWeight: "bold" }}
        >
          {label}
        </TableSortLabel>
      </Box>
    </TableCell>
  );

  const isAnyItemSelected = ctrl?.selectedItems?.length > 0;

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
          placeholder="Search..."
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
          InputProps={{
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
        <Box sx={{ flexGrow: 1, display: "flex" }}>
          <TableContainer
            sx={{
              boxShadow: 3,
              borderRadius: 3,
              minHeight: "calc(100vh - 250px)", // Adjust value based on your layout
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
                          ctrl?.selectedItems.length < ctrl?.documents.length
                        }
                        checked={
                          ctrl?.documents.length > 0 &&
                          ctrl?.selectedItems.length === ctrl?.documents.length
                        }
                        onChange={ctrl?.handleSelectAll}
                      />
                    </TableCell>
                  )}
                  {renderSortableHeader("name", "ຊື່ເອກະສານ")}
                  <TableCell>
                    <p style={{ fontWeight: "bold" }}>ປະເພດ</p>
                  </TableCell>
                  <TableCell>
                    <p style={{ fontWeight: "bold" }}>ລະຫັດເອກະສານ</p>
                  </TableCell>
                  {renderSortableHeader("modified", "ວັນທີແກ້ໄຂ")}
                  <TableCell>
                    <p style={{ fontWeight: "bold" }}>ຂະໜາດຟໄຟລ໌</p>
                  </TableCell>
                  <TableCell>
                    <p style={{ fontWeight: "bold" }}>ສະຖານະ</p>
                  </TableCell>
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
                ) : ctrl?.documents.length > 0 ? (
                  ctrl?.documents.map((item) => (
                    <TableRow
                      key={item?.id}
                      selected={ctrl?.isSelected(item.id)}
                      onClick={() => ctrl.handleSelectItem(item?.id)}
                      onDoubleClick={() => {
                        if (item.itemType === "folder") {
                          ctrl.handleFolderDoubleClick(item);
                        }
                      }}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                        "&:hover": {
                          backgroundColor: "rgba(0, 0, 0, 0.04)",
                          transition: "background-color 0.2s ease",
                        },
                        cursor: item.type === "folder" ? "pointer" : "default",
                      }}
                    >
                      {(isAnyItemSelected || ctrl?.isSelected(item?.id)) && (
                        <TableCell
                          sx={{ borderBottom: "none" }}
                          padding="checkbox"
                        >
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
                      )}
                      <TableCell sx={{ borderBottom: "none" }}>
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
                      <TableCell sx={{ borderBottom: "none" }}>
                        {item?.type}
                      </TableCell>
                      <TableCell sx={{ borderBottom: "none" }}>
                        {item?.id}
                      </TableCell>
                      <TableCell sx={{ borderBottom: "none" }}>
                        {item?.createdAt
                          ? new Date(item?.createdAt).toLocaleString()
                          : ""}
                      </TableCell>
                      <TableCell sx={{ borderBottom: "none" }}>
                        {item?.size ? formatFileSize(item.size) : "N/A"}
                      </TableCell>
                      <TableCell sx={{ borderBottom: "none" }}>
                        <Chip
                          label={item?.status}
                          sx={{
                            backgroundColor: getStatusColor(item?.status),
                            borderRadius: "4px",
                            fontWeight: "normal",
                            color: getTextColor(item?.status),
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      No files or folders found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            {/* <TablePagination component="div" count={100} /> */}
          </TableContainer>
        </Box>

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

                      <IconButton>
                        <img src={Access_IC} alt="access" />
                      </IconButton>
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
                          alignItems: 'center'
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

        <DialogInviteMember
          open={ctrl?.inviteDialogOpen}
          onClose={() => ctrl?.setInviteDialogOpen(false)}
          handleInviteMember={ctrl.handleIviteMember}
          email={ctrl?.email}
          setEmail={ctrl?.handleChangeEmail}
        />
      </Box>
    </Box>
  );
};

export default ManageDocumentPage;
